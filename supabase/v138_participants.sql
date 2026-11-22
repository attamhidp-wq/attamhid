-- v138: حسابات المشاركين الزائرين + إعلانات البريد + توسيع النشر في فيسبوك
create table if not exists public.v138_participants(
  uid uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  data jsonb not null default '{}'::jsonb,
  notify boolean not null default true,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);
alter table public.v138_participants enable row level security;
drop policy if exists v138_part_central on public.v138_participants;
create policy v138_part_central on public.v138_participants for select to authenticated using ((select public.v51_is_central()));

create table if not exists public.v138_ann(
  id bigserial primary key, src text not null, ref text not null, kind text not null,
  due timestamptz not null default now(), st text not null default 'q', n int default 0, at timestamptz default now(),
  info jsonb default '{}'::jsonb
);
alter table public.v138_ann enable row level security;
drop policy if exists v138_ann_central on public.v138_ann;
create policy v138_ann_central on public.v138_ann for select to authenticated using ((select public.v51_is_central()));

alter table public.v136_fb_q add column if not exists src text not null default 'sp';
alter table public.v136_fb_q add column if not exists msg text;
alter table public.v136_fb_q add column if not exists link text;

-- ملف المشارك + تسجيلاته + شهاداته
create or replace function public.v138_me() returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare p record; rg jsonb; ct jsonb; sh jsonb;
begin
  select * into p from public.v138_participants where uid = auth.uid();
  if not found then return null; end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'pid', r.program_id, 'wait', r.data->'wait', 'at', r.data->>'at', 'att', r.data->'att',
      'p', case when s.data is null then null else jsonb_build_object('nameAr', s.data->>'nameAr', 'nameEn', s.data->>'nameEn', 'start', s.data->>'start', 'end', s.data->>'end', 'kind', s.data->>'kind', 'url', s.data->>'url', 'mode', s.data->>'mode', 'place', s.data->>'place', 'hours', s.data->>'hours', 'tzOff', s.data->'tzOff', 'days', s.data->'days', 'deleted', s.data->'deleted') end)
      order by r.created_at desc), '[]'::jsonb) into rg
  from public.v60_sp_registrations r left join public.v60_short_programs s on s.id = r.program_id
  where r.deleted_at is null and coalesce(r.data->>'deleted','') not in ('1','true')
    and (r.data->>'pu' = p.uid::text or (p.confirmed_at is not null and lower(r.data->'v'->>'email') = p.email));
  select coalesce(jsonb_agg(c.data), '[]'::jsonb) into ct from public.certs c
  where c.data->>'spr' in (select x->>'id' from jsonb_array_elements(rg) x);
  select coalesce(jsonb_agg(distinct x.rec), '[]'::jsonb) into sh from public.v136_shares x where x.rec in (select c->>'rec' from jsonb_array_elements(ct) c);
  return jsonb_build_object('email', p.email, 'data', p.data, 'notify', p.notify, 'confirmed', p.confirmed_at is not null, 'since', p.created_at, 'regs', rg, 'certs', ct, 'shared', sh);
end $$;
grant execute on function public.v138_me() to authenticated;

create or replace function public.v138_set(p jsonb) returns boolean language plpgsql security definer set search_path to 'public' as $$
declare d jsonb;
begin
  select data into d from public.v138_participants where uid = auth.uid();
  if d is null then raise exception 'not_participant'; end if;
  if p ? 'nameAr' and (coalesce(trim(p->>'nameAr'),'') = '' or coalesce(trim(p->>'nameEn'),'') = '' or coalesce(trim(p->>'phone'),'') = '' or coalesce(p->>'sex','') not in ('m','f')) then raise exception 'fields_required'; end if;
  update public.v138_participants set
    data = case when p ? 'nameAr' then d || jsonb_build_object('nameAr', left(trim(p->>'nameAr'),120), 'nameEn', left(trim(p->>'nameEn'),120), 'sex', p->>'sex', 'phone', left(trim(p->>'phone'),40)) else d end,
    notify = coalesce((p->>'notify')::boolean, notify)
  where uid = auth.uid();
  return true;
end $$;
grant execute on function public.v138_set(jsonb) to authenticated;

-- يُستدعى من الوظيفة الطرفية بعد التحقق من الرابط (أول دخول)
create or replace function public.v138_confirm() returns boolean language sql security definer set search_path to 'public' as $$
  update public.v138_participants set confirmed_at = coalesce(confirmed_at, now()) where uid = auth.uid() returning true $$;
grant execute on function public.v138_confirm() to authenticated;

create or replace function public.v138_admin_list() returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.v51_is_central() then raise exception 'forbidden'; end if;
  return (select coalesce(jsonb_agg(x order by x.created_at desc), '[]'::jsonb) from (
    select p.uid, p.email, p.data, p.notify, p.created_at, p.confirmed_at,
      (select count(*) from public.v60_sp_registrations r where r.deleted_at is null and coalesce(r.data->>'deleted','') not in ('1','true') and (r.data->>'pu' = p.uid::text or lower(r.data->'v'->>'email') = p.email)) regs,
      (select count(*) from public.certs c join public.v60_sp_registrations r on r.id = c.data->>'spr' where coalesce(c.data->>'revoked','false') not in ('true','1') and (r.data->>'pu' = p.uid::text or lower(r.data->'v'->>'email') = p.email)) certs
    from public.v138_participants p) x);
end $$;
grant execute on function public.v138_admin_list() to authenticated;

-- التسجيل في البرنامج: المشارك صاحب الحساب تُسحب بياناته تلقائياً
create or replace function public.v60_sp_register(p_program text, p_data jsonb default '{}'::jsonb) returns text
language plpgsql security definer set search_path to 'public' as $function$
declare
  v_ref text := public.my_ref();
  v_sid text := null; v_pu text := null; pp record;
  P jsonb; rid text; d jsonb; n int; mx int; em text; w boolean := false; nowt text := to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
begin
  if coalesce(p_program,'') = '' then raise exception 'program_required'; end if;
  select data into P from public.v60_short_programs where id = p_program;
  if P is null or coalesce((P->>'deleted')::text,'') in ('true','1') then raise exception 'program_unavailable'; end if;
  if coalesce(P->>'selfReg','1') = '0' then raise exception 'self_reg_closed'; end if;
  if v_ref is not null and exists(select 1 from public.students s where s.id = v_ref and coalesce(s.data->>'deleted','') not in ('true','1')) then v_sid := v_ref; end if;
  if v_sid is null and auth.uid() is not null then
    select * into pp from public.v138_participants where uid = auth.uid() and confirmed_at is not null;
    if found then
      v_pu := pp.uid::text;
      p_data := coalesce(p_data,'{}'::jsonb) || jsonb_build_object('nameAr', pp.data->>'nameAr', 'nameEn', pp.data->>'nameEn', 'sex', pp.data->>'sex', 'phone', pp.data->>'phone', 'email', pp.email);
      select id into rid from public.v60_sp_registrations where program_id = p_program and deleted_at is null and coalesce(data->>'deleted','') not in ('true','1')
        and (data->>'pu' = v_pu or lower(data->'v'->>'email') = pp.email) limit 1;
      if rid is not null then return rid; end if;
    end if;
  end if;

  if v_sid is not null then
    select id into rid from public.v60_sp_registrations where program_id = p_program and student_id = v_sid and deleted_at is null and coalesce(data->>'deleted','') not in ('true','1') limit 1;
    if rid is not null then return rid; end if;
  else
    if coalesce(P->>'aud','') <> 'public' then raise exception 'students_only'; end if;
    em := lower(trim(coalesce(p_data->>'email','')));
    if coalesce(trim(p_data->>'nameAr'),'')='' or coalesce(trim(p_data->>'nameEn'),'')='' or coalesce(trim(p_data->>'phone'),'')=''
       or coalesce(p_data->>'sex','') = '' or em !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then raise exception 'fields_required'; end if;
    if exists(select 1 from public.v60_sp_registrations where program_id = p_program and deleted_at is null and coalesce(data->>'deleted','') not in ('true','1') and lower(data->'v'->>'email') = em) then raise exception 'email_exists'; end if;
    select count(*) into n from public.v60_sp_registrations where program_id = p_program and created_at > now() - interval '10 minutes' and data->>'src' = 'self';
    if n >= 30 then raise exception 'try_later'; end if;
  end if;

  mx := nullif(regexp_replace(coalesce(P->>'max',''),'\D','','g'),'')::int;
  if mx is not null and mx > 0 then
    select count(*) into n from public.v60_sp_registrations where program_id = p_program and deleted_at is null and coalesce(data->>'deleted','') not in ('true','1') and coalesce(data->>'wait','') not in ('1','true');
    if n >= mx then
      if coalesce(p_data->>'wait','') = '1' and coalesce(P->>'waitList','1') <> '0' then w := true; else raise exception 'program_full'; end if;
    end if;
  end if;

  loop
    rid := 'SR' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    exit when not exists(select 1 from public.v60_sp_registrations where id = rid);
  end loop;
  d := jsonb_build_object('id', rid, 'pid', p_program, 'src', 'self', 'at', nowt, 'u', nowt);
  if w then d := d || jsonb_build_object('wait', 1, 'waitAt', nowt); end if;
  if v_sid is not null then
    d := d || jsonb_build_object('sid', v_sid, 'by', v_sid);
  else
    d := d || jsonb_build_object('by', case when v_pu is not null then 'participant' else 'visitor' end, 'v', jsonb_build_object(
      'nameAr', left(trim(p_data->>'nameAr'), 120), 'nameEn', left(trim(p_data->>'nameEn'), 120),
      'sex', left(p_data->>'sex', 20), 'email', left(em, 160), 'phone', left(trim(p_data->>'phone'), 40)));
    if v_pu is not null then d := d || jsonb_build_object('pu', v_pu); end if;
  end if;
  insert into public.v60_sp_registrations(id, program_id, student_id, data, updated_at) values (rid, p_program, v_sid, d, now());
  return case when w then 'W:' || rid else rid end;
end $function$;

-- طابور الإعلانات (بريد المشاركين + فيسبوك)
create or replace function public.v138_ann_add(p_src text, p_ref text, p_kind text, p_delay interval, p_info jsonb default '{}'::jsonb) returns void
language plpgsql security definer set search_path to 'public' as $$
begin
  update public.v138_ann set due = now() + p_delay, info = coalesce(p_info,'{}'::jsonb) where src = p_src and ref = p_ref and kind = p_kind and st = 'q';
  if not found and not exists(select 1 from public.v138_ann where src = p_src and ref = p_ref and kind = p_kind and st = 'done' and at > now() - interval '12 hours' and p_kind <> 'update') then
    insert into public.v138_ann(src, ref, kind, due, info) values (p_src, p_ref, p_kind, now() + p_delay, coalesce(p_info,'{}'::jsonb));
  end if;
end $$;

create or replace function public.v138_fb_add(p_src text, p_ref text, p_kind text, p_msg text, p_link text, p_delay interval) returns void
language plpgsql security definer set search_path to 'public' as $$
begin
  update public.v136_fb_q set due = now() + p_delay, msg = p_msg, link = p_link where src = p_src and pid = p_ref and kind = p_kind and st = 'q';
  if not found then insert into public.v136_fb_q(src, pid, kind, due, msg, link) values (p_src, p_ref, p_kind, now() + p_delay, p_msg, p_link); end if;
end $$;

-- البرامج القصيرة: إعلان للمشاركين عند النشر، وتحديث للمسجلين عند تغيّر الموعد أو المكان
create or replace function public.v138_sp_trg() returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if new.deleted_at is not null or coalesce(new.data->>'deleted','') in ('1','true') then return new; end if;
  if (select tt.t2 from public.v136_sp_times(new.data) tt) < now() then return new; end if;
  if tg_op = 'INSERT' then
    if coalesce(new.data->>'aud','') = 'public' and coalesce(new.data->>'selfReg','1') <> '0' then perform public.v138_ann_add('sp', new.id, 'new', interval '10 minutes'); end if;
  elsif (old.data->>'start') is distinct from (new.data->>'start') or (old.data->>'end') is distinct from (new.data->>'end') or (old.data->>'place') is distinct from (new.data->>'place')
        or (old.data->>'mode') is distinct from (new.data->>'mode') or (old.data->>'url') is distinct from (new.data->>'url') then
    if exists(select 1 from public.v138_ann where src='sp' and ref=new.id and kind='new' and st='q') then
      update public.v138_ann set due = now() + interval '10 minutes' where src='sp' and ref=new.id and kind='new' and st='q';
    else perform public.v138_ann_add('sp', new.id, 'update', interval '5 minutes'); end if;
  elsif coalesce(old.data->>'aud','') <> 'public' and coalesce(new.data->>'aud','') = 'public' then
    perform public.v138_ann_add('sp', new.id, 'new', interval '10 minutes');
  end if;
  return new;
exception when others then raise warning 'v138 sp trg: %', sqlerrm; return new;
end $$;
drop trigger if exists v138_sp_trg on public.v60_short_programs;
create trigger v138_sp_trg after insert or update of data on public.v60_short_programs for each row execute function public.v138_sp_trg();

-- الأخبار: نشر في فيسبوك
create or replace function public.v138_news_trg() returns trigger language plpgsql security definer set search_path to 'public' as $$
declare t text; b text;
begin
  t := coalesce(new.data->>'title',''); b := coalesce(new.data->>'body','');
  if t = '' or coalesce(new.data->>'deleted','') in ('1','true') or coalesce(new.data->>'fb','1') = '0' then return new; end if;
  perform public.v138_fb_add('news', new.id::text, 'news', '📰 أخبار معهد التمهيد'||E'\n\n'||t||E'\n\n'||left(b, 1800)||case when length(b) > 1800 then '…' else '' end
    ||E'\n\nhttps://attamhid.com/#/news'||E'\n\n#معهد_التمهيد #AtTamhidInstitute', 'https://attamhid.com/#/news', interval '3 minutes');
  return new;
exception when others then raise warning 'v138 news trg: %', sqlerrm; return new;
end $$;
drop trigger if exists v138_news_trg on public.news;
create trigger v138_news_trg after insert on public.news for each row execute function public.v138_news_trg();

-- فتح باب التقديم في برنامج: نشر في فيسبوك + دعوة المشاركين بالبريد
create or replace function public.v138_adm_trg() returns trigger language plpgsql security definer set search_path to 'public' as $$
declare k text; nm text; ne text;
begin
  if new.key <> 'reg75' then return new; end if;
  for k in select jsonb_object_keys(coalesce(new.data->'progs','{}'::jsonb)) loop
    if coalesce(new.data->'progs'->k->>'state','') = 'open' and coalesce(old.data->'progs'->k->>'state','') <> 'open' then
      select coalesce(data->>'name', data->>'nameAr', ''), coalesce(data->>'nameEn', data->>'en', '') into nm, ne from public.programs where id::text = k;
      if coalesce(nm,'') = '' then continue; end if;
      perform public.v138_fb_add('adm', k, 'adm', '🎓 فُتح باب التقديم في معهد التمهيد'||E'\n\n«'||nm||'»'
        ||E'\n\nقدّم الآن عبر الموقع، وتابع طلبك إلكترونياً. تتوفر منح دراسية للمستحقين.'||E'\n\nللتقديم: https://attamhid.com/#/register'
        ||case when coalesce(ne,'') <> '' then E'\n\n— Applications are now open: '||ne||' · At Tamhid Institute' else '' end||E'\n\n#معهد_التمهيد #AtTamhidInstitute',
        'https://attamhid.com/#/register', interval '3 minutes');
      perform public.v138_ann_add('adm', k, 'adm', interval '5 minutes', jsonb_build_object('nameAr', nm, 'nameEn', ne));
    end if;
  end loop;
  return new;
exception when others then raise warning 'v138 adm trg: %', sqlerrm; return new;
end $$;
drop trigger if exists v138_adm_trg on public.v51_settings;
create trigger v138_adm_trg after update of data on public.v51_settings for each row execute function public.v138_adm_trg();

-- المنح: نشر في فيسبوك + إعلام المشاركين
create or replace function public.v138_sch_trg() returns trigger language plpgsql security definer set search_path to 'public' as $$
declare nm text; pc text; pn text;
begin
  if new.deleted_at is not null or coalesce(new.active, true) = false then return new; end if;
  if tg_op = 'UPDATE' and coalesce(old.active, true) = true and old.deleted_at is null then return new; end if;
  nm := coalesce(nullif(new.data->>'nameAr',''), nullif(new.data->>'name',''), nullif(new.data->>'title',''), 'منحة دراسية');
  pc := coalesce(nullif(new.data->>'pct',''), nullif(new.data->>'percent',''), nullif(new.data->>'value',''));
  select coalesce(data->>'name','') into pn from public.programs where id::text = coalesce(new.program_id::text, new.data->>'prog', '');
  perform public.v138_fb_add('sch', new.id::text, 'sch', '🌟 منحة دراسية من معهد التمهيد'||E'\n\n«'||nm||'»'||case when pc is not null then ' — '||pc||'%' else '' end
    ||case when coalesce(pn,'') <> '' then E'\nالبرنامج: '||pn else '' end||E'\n\nاطّلع على الشروط وقدّم عبر الموقع: https://attamhid.com/#/programs'||E'\n\n#معهد_التمهيد #AtTamhidInstitute',
    'https://attamhid.com/#/programs', interval '3 minutes');
  perform public.v138_ann_add('sch', new.id::text, 'sch', interval '5 minutes', jsonb_build_object('nameAr', nm, 'pct', pc, 'prog', pn));
  return new;
exception when others then raise warning 'v138 sch trg: %', sqlerrm; return new;
end $$;
drop trigger if exists v138_sch_trg on public.v51_scholarships;
create trigger v138_sch_trg after insert or update on public.v51_scholarships for each row execute function public.v138_sch_trg();

-- معالجة الطابور: بريد لكل مشارك مشترك (أو لمسجلي البرنامج عند تحديث الموعد)
create or replace function public.v138_tick() returns integer language plpgsql security definer set search_path to 'public' as $$
declare q record; P jsonb; tt record; dA text; place text; url text; h text; s text; n int := 0; r record; bA text; bE text; tA text; tE text; btn text; ra jsonb; re jsonb; m int;
begin
  for q in select * from public.v138_ann where st = 'q' and due <= now() order by id limit 3 loop
    m := 0;
    if q.src = 'sp' then
      select data into P from public.v60_short_programs where id = q.ref and deleted_at is null;
      if P is null or coalesce(P->>'deleted','') in ('1','true') then update public.v138_ann set st='skipped' where id = q.id; continue; end if;
      select * into tt from public.v136_sp_times(P);
      if tt.t2 < now() then update public.v138_ann set st='skipped' where id = q.id; continue; end if;
      url := case when coalesce(P->>'url','') ~* '^https?://' then P->>'url' else null end;
      place := case when coalesce(P->>'mode','')='remote' or url is not null then 'عن بُعد' else coalesce(nullif(P->>'place',''),'مقر المعهد') end;
      dA := left(coalesce(P->>'start',''),10) || case when not tt.allday then ' — '||substring(P->>'start' from 12 for 5) else '' end;
      ra := jsonb_build_array(jsonb_build_array('البرنامج', P->>'nameAr'), jsonb_build_array('الموعد', dA), jsonb_build_array('المكان', place))
        || case when coalesce(P->>'trainerAr','')<>'' then jsonb_build_array(jsonb_build_array(coalesce(nullif(P->>'trainerTitleAr',''),'المدرب'), P->>'trainerAr')) else '[]' end
        || case when coalesce(P->>'hours','')<>'' then jsonb_build_array(jsonb_build_array('الساعات', P->>'hours')) else '[]' end;
      re := jsonb_build_array(jsonb_build_array('Programme', coalesce(nullif(P->>'nameEn',''),P->>'nameAr')), jsonb_build_array('Date', dA), jsonb_build_array('Venue', case when place='عن بُعد' then 'Online' when place='مقر المعهد' then 'Institute campus' else place end));
      btn := 'https://attamhid.com/#/sp/'||q.ref;
      if q.kind = 'new' then
        tA := 'برنامج جديد متاح للتسجيل'; tE := 'A new programme is open for registration';
        bA := 'يسرّ معهد التمهيد دعوتكم إلى «'||coalesce(P->>'nameAr','')||'». سجّلوا بضغطة واحدة من حسابكم، وتصلكم الشهادة بعد انتهاء البرنامج.';
        bE := 'At Tamhid Institute is pleased to invite you to “'||coalesce(nullif(P->>'nameEn',''),P->>'nameAr','')||'”. Register in one click from your account; your certificate will be emailed after the programme ends.';
        s := 'دعوة: '||coalesce(P->>'nameAr','')||' / Invitation: '||coalesce(nullif(P->>'nameEn',''),'');
        for r in select email, data from public.v138_participants where notify and confirmed_at is not null
                 and not exists(select 1 from public.v60_sp_registrations g where g.program_id = q.ref and g.deleted_at is null and (g.data->>'pu' = v138_participants.uid::text or lower(g.data->'v'->>'email') = v138_participants.email)) loop
          h := public.v134_tpl(tA, tE, 'السلام عليكم '||coalesce(r.data->>'nameAr','')||'،', 'Dear '||coalesce(nullif(r.data->>'nameEn',''), r.data->>'nameAr','')||',',
            bA||E'\n\n'||'لإيقاف رسائل الإعلانات: حسابي ← الإشعارات.', bE||E'\n\n'||'To stop announcement emails: My account → Notifications.', ra, re, btn, 'التسجيل بضغطة', 'Register in one click');
          perform public.v134_mailq(r.email, s, h, bA, 'p138_new', q.ref); m := m + 1;
        end loop;
      else
        tA := 'تحديث في موعد البرنامج أو مكانه'; tE := 'Programme schedule updated';
        bA := 'نحيطكم علماً بتحديث بيانات «'||coalesce(P->>'nameAr','')||'» المسجّلين فيه. البيانات المحدّثة أدناه، ويصلكم تذكير قبل البدء بـ30 دقيقة'||case when url is not null then ' مع رابط الدخول' else '' end||'.';
        bE := 'Please note that “'||coalesce(nullif(P->>'nameEn',''),P->>'nameAr','')||'”, which you registered for, has been updated. The updated details are below; a reminder will arrive 30 minutes before it starts.';
        s := 'تحديث: '||coalesce(P->>'nameAr','')||' / Update: '||coalesce(nullif(P->>'nameEn',''),'');
        for r in select distinct on (lower(coalesce(nullif(g.data->'v'->>'email',''), st.data->>'email'))) lower(coalesce(nullif(g.data->'v'->>'email',''), st.data->>'email')) email,
                   coalesce(nullif(g.data->'v'->>'nameAr',''), st.data->>'name','') na, coalesce(nullif(g.data->'v'->>'nameEn',''), st.data->>'nameEn', st.data->>'name','') ne
                 from public.v60_sp_registrations g left join public.students st on st.id = g.student_id
                 where g.program_id = q.ref and g.deleted_at is null and coalesce(g.data->>'deleted','') not in ('1','true') loop
          if coalesce(r.email,'') !~ '^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$' then continue; end if;
          h := public.v134_tpl(tA, tE, 'السلام عليكم '||r.na||'،', 'Dear '||coalesce(nullif(r.ne,''), r.na)||',', bA, bE, ra, re, btn, 'تفاصيل البرنامج', 'Programme details');
          perform public.v134_mailq(r.email, s, h, bA, 'p138_upd', q.ref); m := m + 1;
        end loop;
      end if;
    elsif q.src in ('adm','sch') then
      if q.src = 'adm' then
        tA := 'فُتح باب التقديم'; tE := 'Applications are now open';
        bA := 'يسرّ معهد التمهيد إعلامكم بفتح باب التقديم في «'||coalesce(q.info->>'nameAr','')||'». قدّموا عبر الموقع وتابعوا طلبكم إلكترونياً، وتتوفر منح دراسية للمستحقين، منها منحة سفراء التمهيد 50% لمن شارك في 10 برامج قصيرة ونشر شهاداتها.';
        bE := 'At Tamhid Institute is pleased to announce that applications are now open for “'||coalesce(nullif(q.info->>'nameEn',''), q.info->>'nameAr','')||'”. Apply online and track your application; scholarships are available, including the 50% At Tamhid Ambassadors scholarship for those who took part in 10 short programmes and shared their certificates.';
        s := 'فُتح باب التقديم — '||coalesce(q.info->>'nameAr','')||' / Applications open'; btn := 'https://attamhid.com/#/register';
      else
        tA := 'منحة دراسية جديدة'; tE := 'A new scholarship';
        bA := 'أعلن معهد التمهيد عن منحة «'||coalesce(q.info->>'nameAr','')||'»'||coalesce(' بنسبة '||(q.info->>'pct')||'%','')||coalesce(' في '||nullif(q.info->>'prog',''),'')||'. اطّلعوا على الشروط وقدّموا عبر الموقع.';
        bE := 'At Tamhid Institute has announced a new scholarship'||coalesce(' ('||(q.info->>'pct')||'%)','')||'. See the conditions and apply on the website.';
        s := 'منحة دراسية — '||coalesce(q.info->>'nameAr','')||' / New scholarship'; btn := 'https://attamhid.com/#/programs';
      end if;
      for r in select email, data from public.v138_participants where notify and confirmed_at is not null loop
        h := public.v134_tpl(tA, tE, 'السلام عليكم '||coalesce(r.data->>'nameAr','')||'،', 'Dear '||coalesce(nullif(r.data->>'nameEn',''), r.data->>'nameAr','')||',',
          bA||E'\n\n'||'لإيقاف رسائل الإعلانات: حسابي ← الإشعارات.', bE||E'\n\n'||'To stop announcement emails: My account → Notifications.', null, null, btn, 'التفاصيل والتقديم', 'Details & apply');
        perform public.v134_mailq(r.email, s, h, bA, 'p138_'||q.src, q.ref); m := m + 1;
      end loop;
    end if;
    update public.v138_ann set st = 'done', n = m, at = now() where id = q.id; n := n + m;
  end loop;
  if n > 0 then perform public.v108_tick(); end if;
  return n;
end $$;

-- فيسبوك: يدعم الآن الأخبار وفتح التقديم والمنح إلى جانب البرامج
create or replace function public.v136_fb_tick() returns integer language plpgsql security definer set search_path to 'public' as $function$
declare d jsonb; t text; q record; P jsonb; rid bigint; r record; n int := 0; m text; lk text;
begin
  select data into d from public.v136_integr where k='fb'; t := public.v136_fb_tok();
  for q in select * from public.v136_fb_q where st = 'wait' and req is not null loop
    select status_code, content into r from net._http_response where id = q.req;
    if r is not null then
      if r.status_code between 200 and 299 then update public.v136_fb_q set st='posted', post_id = (r.content::jsonb->>'id'), err = null where id = q.id;
      else update public.v136_fb_q set st='failed', err = left(regexp_replace(coalesce(r.content,''),'access_token=[^&"]+','***','g'),300) where id = q.id; end if;
    elsif q.at < now() - interval '30 minutes' then update public.v136_fb_q set st='failed', err='timeout' where id = q.id; end if;
  end loop;
  if d is null or t is null or coalesce((d->>'on')::boolean,false) = false then return 0; end if;
  insert into public.v136_fb_q(pid, kind, due)
  select s.id, 'soon', now() from public.v60_short_programs s, lateral public.v136_sp_times(s.data) tt
  where s.deleted_at is null and coalesce(s.data->>'aud','')='public' and coalesce(s.data->>'fb','1')<>'0' and tt.t1 between now() + interval '20 hours' and now() + interval '28 hours'
    and not exists(select 1 from public.v136_fb_q x where x.pid = s.id and x.kind='soon');
  for q in select * from public.v136_fb_q where st = 'q' and due <= now() order by id limit 5 loop
    if q.at < now() - interval '7 days' then update public.v136_fb_q set st='skipped' where id = q.id; continue; end if;
    if coalesce(q.src,'sp') = 'sp' then
      select data into P from public.v60_short_programs where id = q.pid and deleted_at is null;
      if P is null or coalesce(P->>'aud','')<>'public' or (select tt.t2 from public.v136_sp_times(P) tt) < now() then update public.v136_fb_q set st='skipped' where id = q.id; continue; end if;
      m := public.v136_fb_msg(P, q.pid, q.kind); lk := 'https://attamhid.com/#/sp/'||q.pid;
    else
      if coalesce(q.msg,'') = '' then update public.v136_fb_q set st='skipped' where id = q.id; continue; end if;
      m := q.msg; lk := coalesce(q.link, 'https://attamhid.com/');
    end if;
    select net.http_post(url := 'https://graph.facebook.com/v21.0/'||(d->>'page')||'/feed',
      body := jsonb_build_object('message', m, 'link', lk, 'access_token', t),
      headers := '{"Content-Type":"application/json"}'::jsonb, timeout_milliseconds := 30000) into rid;
    update public.v136_fb_q set st='wait', req = rid, at = now() where id = q.id; n := n + 1;
  end loop;
  return n;
end $function$;

revoke all on function public.v138_tick() from public, anon, authenticated;
revoke all on function public.v138_ann_add(text,text,text,interval,jsonb) from public, anon, authenticated;
revoke all on function public.v138_fb_add(text,text,text,text,text,interval) from public, anon, authenticated;

do $$ begin perform cron.unschedule('v138_ann_tick'); exception when others then null; end $$;
select cron.schedule('v138_ann_tick', '* * * * *', 'select public.v138_tick()');
