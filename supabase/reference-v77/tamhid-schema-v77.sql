-- =====================================================================
-- معهد التمهيد — v77: حالات طلب التسجيل، واستعلام الطالب، وإعادة تسليم الطلب المعاد
-- يُشغَّل مرة واحدة في Supabase ← SQL Editor (بعد أخذ نسخة احتياطية). آمن لإعادة التشغيل.
-- لا يحتوي بيانات ولا بنوك أسئلة: كل البنوك داخل ملف index.html مشفّرة.
-- =====================================================================

-- استعلام الطالب عن طلبه برقم الطلب والرمز السري (لا يُعاد إلا ما يخص صاحب الطلب، ولا تُعاد قائمة البريد الصادر)
create or replace function public.v77_track(rid text, sec text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare d jsonb;
begin
  select r.data into d from public.requests r
   where upper(r.id) = upper(trim(rid)) and coalesce(r.data->>'secret','') <> ''
     and upper(r.data->>'secret') = upper(trim(sec)) limit 1;
  if d is null then return null; end if;
  return jsonb_build_object(
    'id', d->>'id', 'name', d->>'name', 'nameEn', d->>'nameEn', 'email', d->>'email', 'phone', d->>'phone',
    'birth', d->>'birth', 'pob', d->>'pob', 'pobEn', d->>'pobEn', 'nat', d->>'nat', 'natEn', d->>'natEn',
    'country', d->>'country', 'pid', d->>'pid', 'address', d->>'address', 'guardian', d->>'guardian',
    'guardianPhone', d->>'guardianPhone', 'q64_issuer', d->>'q64_issuer', 'q64_year', d->>'q64_year', 'q64_gpa', d->>'q64_gpa',
    'status', d->>'status', 'sid', d->>'sid', 'rv64', d->'rv64', 'q64_docs', d->>'q64_docs', 'docs70', d->'docs70',
    'app77', case when d ? 'app77' then (d->'app77') - 'mq' - 'sent' - 'mfail' else null end);
end $$;

-- إعادة تسليم الطلب المعاد بعد التعديل: الحقول المسموح بها فقط، ثم «قيد المراجعة» مع بريد آلي
create or replace function public.v77_resubmit(rid text, sec text, patch jsonb, note text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record; d jsonb; k text; v text; a jsonb; st text;
  allowed text[] := array['name','nameEn','email','phone','birth','pob','pobEn','nat','natEn','country','pid','address','guardian','guardianPhone','q64_issuer','q64_year','q64_gpa'];
begin
  select * into r from public.requests where upper(id) = upper(trim(rid)) for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  d := r.data;
  if coalesce(d->>'secret','') = '' or upper(d->>'secret') <> upper(trim(sec)) then return jsonb_build_object('ok', false, 'error', 'bad_secret'); end if;
  if coalesce(d->>'status','') ~ '(مقبول|مرفوض)' then return jsonb_build_object('ok', false, 'error', 'closed'); end if;
  a := coalesce(d->'app77', '{}'::jsonb); st := coalesce(a->>'st', '');
  if st <> 'returned' then return jsonb_build_object('ok', false, 'error', 'not_returned'); end if;
  foreach k in array allowed loop
    if patch ? k then
      v := left(coalesce(patch->>k, ''), 300);
      if k = 'nameEn' then v := upper(v); end if;
      d := jsonb_set(d, array[k], to_jsonb(v), true);
    end if;
  end loop;
  if coalesce(d->>'name','') = '' or coalesce(d->>'email','') !~ '^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$' then
    return jsonb_build_object('ok', false, 'error', 'invalid'); end if;
  a := jsonb_set(a, '{st}', '"review"'::jsonb, true);
  a := jsonb_set(a, '{note}', '""'::jsonb, true);
  a := jsonb_set(a, '{resub}', to_jsonb(coalesce((a->>'resub')::int, 0) + 1), true);
  a := jsonb_set(a, '{hist}', coalesce(a->'hist', '[]'::jsonb) || jsonb_build_array(jsonb_build_object('st','review','at',to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'by','الطالب','note',left(coalesce(note,''),600),'ev','resubmitted')), true);
  a := jsonb_set(a, '{mq}', coalesce(a->'mq', '[]'::jsonb) || jsonb_build_array(jsonb_build_object('st','review','ev','resubmitted','note',left(coalesce(note,''),600),'at',to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'n',0)), true);
  a := jsonb_set(a, '{last}', '"review"'::jsonb, true);
  d := jsonb_set(d, '{app77}', a, true);
  d := jsonb_set(d, '{u}', to_jsonb(to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"')), true);
  update public.requests set data = d where id = r.id;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.v77_track(text, text) from public;
revoke all on function public.v77_resubmit(text, text, jsonb, text) from public;
grant execute on function public.v77_track(text, text) to anon, authenticated;
grant execute on function public.v77_resubmit(text, text, jsonb, text) to anon, authenticated;

-- =====================================================================
-- روابط تسليم التكليفات والبحوث (نماذج Google) لكل مقرر
-- القراءة للجميع (يظهر الزر للطالب)، والكتابة عبر الدالة: الإدارة المركزية أو عضو الهيئة المسند إليه المقرر
-- =====================================================================
create table if not exists public.v77_asg (
  course_id  text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_by uuid,
  updated_at timestamptz not null default now()
);
alter table public.v77_asg enable row level security;
drop policy if exists v77_asg_read on public.v77_asg;
create policy v77_asg_read on public.v77_asg for select using (true);
drop policy if exists v77_asg_central on public.v77_asg;
create policy v77_asg_central on public.v77_asg for all using (public.v51_is_central()) with check (public.v51_is_central());

create or replace function public.v77_asg_set(cid text, d jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
declare ok boolean := false; fref text;
begin
  if public.v51_is_central() then ok := true;
  else
    select p.ref_id into fref from public.profiles p where p.id = auth.uid() and p.role = 'faculty';
    if fref is not null then
      select exists (select 1 from public.faculty f
        where f.id = fref and coalesce((f.data->>'active')::boolean, true)
          and exists (select 1 from jsonb_array_elements_text(coalesce(f.data->'courses','[]'::jsonb)) c where c = cid)) into ok;
    end if;
  end if;
  if not ok then return false; end if;
  if jsonb_typeof(d->'items') is distinct from 'array' then return false; end if;
  insert into public.v77_asg(course_id, data, updated_by, updated_at) values (cid, d, auth.uid(), now())
    on conflict (course_id) do update set data = excluded.data, updated_by = excluded.updated_by, updated_at = now();
  return true;
end $$;
revoke all on function public.v77_asg_set(text, jsonb) from public;
grant execute on function public.v77_asg_set(text, jsonb) to authenticated;

-- إعدادات «واجهة الموقع الرسمية» تُقرأ للجميع (نصوص عامة)، وتكتبها الإدارة المركزية فقط (السياسة العامة القائمة)
drop policy if exists v77_look_pub_read on public.v51_settings;
create policy v77_look_pub_read on public.v51_settings for select using (key = 'look77');

-- =====================================================================
-- وثائقي: إصدار ذاتي مباشر من البوابة دون طلب ولا موافقة
-- الطالب: شهادة التعريف، إفادة المستحق المالي، السجل المهاري. عضو الهيئة والإداري: شهادة التعريف، شهادة الخبرة.
-- الرقم الرسمي (11 خانة) يُحسب في الخادم تسلسلياً فلا يتكرر، وتُثبَّت الهوية من الحساب لا من المتصفح.
-- =====================================================================
create or replace function public.v77_self_cert(c jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare a record; t text; pre text; n int; rec text; d jsonb; nm text; nme text; prog text; tries int := 0;
begin
  select ref_id, role into a from public.v63_accounts where user_id = auth.uid() and status = 'active' limit 1;
  if a.ref_id is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  t := coalesce(c->>'type','');
  if a.role = 'student' and t not in ('intro','fin','skill77') then return jsonb_build_object('ok', false, 'error', 'type'); end if;
  if a.role in ('faculty','staff') and t not in ('intro','exp') then return jsonb_build_object('ok', false, 'error', 'type'); end if;
  pre := coalesce(c->>'pre','');
  if pre !~ '^\d{6}$' then pre := '19' || to_char(now(),'YYYY'); end if;
  if a.role = 'student' then
    select s.data->>'name', s.data->>'nameEn', s.data->>'prog' into nm, nme, prog from public.students s where s.id = a.ref_id;
  elsif a.role = 'faculty' then
    select f.data->>'name', f.data->>'nameEn' into nm, nme from public.faculty f where f.id = a.ref_id;
  end if;
  d := (c - 'pre' - 'rec' - 'revoked' - 'v51')
       || jsonb_build_object('type', t, 'self77', 1, 'uid', a.ref_id, 'sid', case when a.role = 'student' then a.ref_id else '' end,
                             'date', to_char(now() at time zone 'utc','YYYY-MM-DD'), 'at', to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"'));
  if nm is not null then d := d || jsonb_build_object('name', nm, 'nameEn', coalesce(nme,'')); end if;
  if prog is not null then d := d || jsonb_build_object('prog', prog); end if;
  loop
    select coalesce(max(substring(id from 7)::int), 0) into n from public.certs where id ~ ('^' || pre || '\d{5}$');
    rec := pre || lpad((n + 1)::text, 5, '0');
    begin
      insert into public.certs(id, data, updated_at) values (rec, d || jsonb_build_object('rec', rec), now());
      exit;
    exception when unique_violation then
      tries := tries + 1; if tries > 5 then return jsonb_build_object('ok', false, 'error', 'busy'); end if;
    end;
  end loop;
  return jsonb_build_object('ok', true, 'rec', rec, 'cert', d || jsonb_build_object('rec', rec));
end $$;
revoke all on function public.v77_self_cert(jsonb) from public;
grant execute on function public.v77_self_cert(jsonb) to authenticated;

-- =====================================================================
-- ورقة الاختبار: الأسئلة تظهر للطالب فقط أثناء الاختبار المنشور وفي موعده المفعّل (لا قبله ولا بعده)
-- (نفس دالة v65 مع شرط نافذة الموعد في الخادم؛ والتصحيح الآلي الفوري كما هو)
-- =====================================================================
create or replace function public.v65_exam_paper(eid text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_sid text; v_role text; v_ex jsonb; d public.v65_draws%rowtype;
  v_mc int; v_tf int; v_pick int[]; v_perm jsonb := '{}'::jsonb; q record; v_out jsonb := '[]'::jsonb; v_opts jsonb; v_p jsonb;
begin
  select ref, role into v_sid, v_role from public.v65_me();
  if v_sid is null or v_role <> 'student' then raise exception 'forbidden'; end if;
  select x.data into v_ex from public.exams x where x.id::text = eid;
  if v_ex is null or coalesce(v_ex->>'pub','false') not in ('true','1') or v_ex->'bank65' is null then raise exception 'not available'; end if;
  -- v77: لا تُعرض الأسئلة إلا داخل نافذة الاختبار المفعّلة (بتوقيت الاختبارات UTC+3)، لا قبلها ولا بعدها
  if coalesce(v_ex->>'date','') = '' or coalesce(v_ex->>'end','') = '' then raise exception 'not available'; end if;
  if to_char((now() at time zone 'utc') + interval '3 hours','YYYY-MM-DD"T"HH24:MI:SS') < left(v_ex->>'date',19)
     or to_char((now() at time zone 'utc') + interval '3 hours','YYYY-MM-DD"T"HH24:MI:SS') >= left(v_ex->>'end',19) then
    raise exception 'outside window'; end if;
  if exists (select 1 from public.submissions s where s.data->>'sid' = v_sid and s.data->>'eid' = eid) then raise exception 'already submitted'; end if;
  select * into d from public.v65_draws w where w.sid = v_sid and w.eid = v65_exam_paper.eid and not w.used order by w.created_at desc limit 1;
  if not found then
    v_mc := coalesce((v_ex->'draw65'->>'mc')::int, 10);
    v_tf := coalesce((v_ex->'draw65'->>'tf')::int, 5);
    select coalesce(array_agg(pos), '{}') into v_pick from (
      (select e.pos from public.exam_questions e where e.exam_id::text = eid and e.ty = 'mc' order by random() limit v_mc)
      union all
      (select e.pos from public.exam_questions e where e.exam_id::text = eid and e.ty = 'tf' order by random() limit v_tf)) z;
    for q in select e.pos, jsonb_array_length(to_jsonb(e.opts)) n from public.exam_questions e
             where e.exam_id::text = eid and e.ty = 'mc' and e.pos = any(v_pick) loop
      select jsonb_agg(i order by random()) into v_p from generate_series(0, q.n - 1) i;
      v_perm := v_perm || jsonb_build_object(q.pos::text, v_p);
    end loop;
    insert into public.v65_draws(sid, eid, pick, perm) values (v_sid, eid, v_pick, v_perm) returning * into d;
  end if;
  for q in select e.pos, e.ty::text ty, e.t::text t, to_jsonb(e.opts) opts from public.exam_questions e
           where e.exam_id::text = eid and e.pos = any(d.pick) loop
    if q.ty = 'mc' then
      select jsonb_agg(q.opts->(a.x::int) order by a.ord) into v_opts
        from jsonb_array_elements_text(d.perm->(q.pos::text)) with ordinality as a(x, ord);
    else v_opts := null; end if;
    v_out := v_out || jsonb_build_array(jsonb_build_object('pos', q.pos, 'ty', q.ty, 't', q.t, 'opts', v_opts));
  end loop;
  return jsonb_build_object('paper',
    (select coalesce(jsonb_agg(x order by array_position(d.pick, (x->>'pos')::int)), '[]'::jsonb) from jsonb_array_elements(v_out) x));
end $$;
grant execute on function public.v65_exam_paper(text) to authenticated;
