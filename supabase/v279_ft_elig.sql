-- v279 — بوابة الخريجين (التدريب الميداني ومشروع التخرج) — المرحلة الأولى: الاستحقاق
-- شروط الدخول لكل برنامج من الإعدادات (ft_cfg.data.elig[prog])، تُحسب آلياً من السجل الأكاديمي الرسمي،
-- ويرى الطالب ما استوفاه وما بقي عليه. الاستثناء بقرار من الإدارة المركزية مع السبب، مسجَّل وقابل للسحب.
-- لا بيانات شخصية في هذا الملف.

create table if not exists public.ft_exc (
  id bigserial primary key,
  sid text not null,
  k text not null,                 -- رمز الشرط، أو '*' لكل الشروط
  reason text not null,
  by_ref text,
  at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by text,
  revoke_reason text
);
create index if not exists ft_exc_sid on public.ft_exc(sid) where revoked_at is null;
alter table public.ft_exc enable row level security;
revoke all on public.ft_exc from anon, authenticated;

-- قيمة منطقية من JSON (true / 1 / "1" / "true")
create or replace function public.ft_true(v jsonb) returns boolean
language sql immutable set search_path to 'public' as $$
  select coalesce(v::text,'') not in ('','null','0','false','""','"0"','"false"')
$$;

-- الشروط الافتراضية: الشرطان المعمول بهما سابقاً مفعّلان، والبقية تُحسب وتُعرض ولا تمنع حتى تفعّلها الإدارة
create or replace function public.ft_elig_defaults() returns jsonb
language sql immutable set search_path to 'public' as $$
  select '{"course":{"on":true},"pre":{"on":true},"lvls":{"on":false,"n":3},"prof":{"on":false,"lvl":3},
           "hifz":{"on":false},"hrs":{"on":false,"min":63},"gpa":{"on":false,"min":0},"dues":{"on":false}}'::jsonb
$$;

create or replace function public.ft_elig_cfg(p_prog text) returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select public.ft_elig_defaults() || coalesce(public.ft_c()->'elig'->coalesce(nullif(p_prog,''),'1000'), '{}'::jsonb)
$$;

-- الحساب (داخلي، بلا فحص صلاحية)
create or replace function public.ft_elig_core(p_sid text) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare s jsonb; pg text; cf jsonb; c jsonb; crs jsonb; gr jsonb; it jsonb := '[]'::jsonb; ok boolean := true;
  course text := public.ft_c()->>'course'; pre text := public.ft_c()->>'pre';
  x record; g jsonb; n int; lv int; miss jsonb; hh numeric := 0; q numeric := 0; ph numeric := 0;
  gpa numeric; pr jsonb; pass numeric; avg numeric; dn int; da numeric; dc int; ex jsonb; e record; v boolean; on_ boolean;
begin
  select data into s from public.students where id = p_sid;
  if s is null then return jsonb_build_object('ok', false, 'items', '[]'::jsonb, 'none', true); end if;
  pg := coalesce(nullif(s->>'prog',''),'1000');
  cf := public.ft_elig_cfg(pg);
  select data into c from public.programs where id = pg;
  crs := coalesce(c->'coursesAll','[]'::jsonb);
  gr := case when jsonb_typeof(s->'gr')='object' then s->'gr' else '{}'::jsonb end;
  select coalesce(jsonb_object_agg(z.k, jsonb_build_object('id',z.id,'reason',z.reason,'at',z.at)),'{}'::jsonb) into ex
    from public.ft_exc z where z.sid = p_sid and z.revoked_at is null;

  -- الساعات والمعدل من المقررات المرصودة المنشورة فقط
  for x in select e2 from jsonb_array_elements(crs) e2 loop
    g := gr->(x.e2->>'id');
    if g is not null and public.ft_true(g->'fin') and public.ft_true(g->'rel') and (g->>'pts') ~ '^[0-9.]+$'
       and coalesce(nullif(x.e2->>'hrs','')::numeric,0) > 0 then
      hh := hh + (x.e2->>'hrs')::numeric; q := q + (x.e2->>'hrs')::numeric * (g->>'pts')::numeric;
    end if;
    if g is not null and ((public.ft_true(g->'fin') and public.ft_true(g->'ok') and public.ft_true(g->'rel')) or public.ft_true(g->'eq')) then
      ph := ph + coalesce(nullif(x.e2->>'hrs','')::numeric,0);
    end if;
  end loop;
  gpa := case when hh > 0 then round(q/hh, 2) end;

  -- 1) التسجيل في مقرر التدريب والمشروع
  v := coalesce(s->'reg','[]'::jsonb) ? coalesce(course,'');
  it := it || jsonb_build_object('k','course','on',public.ft_true(cf->'course'->'on'),'ok',v,
    'ar','التسجيل في مقرر 4401 «مشروع التخرج والتدريب الميداني» في الفصل الحالي','en','Registered in course 4401 “Graduation Project and Field Training” this semester');
  -- 2) اجتياز المتطلب السابق
  g := gr->coalesce(pre,'');
  -- كما كان معمولاً به (ok)، حتى لا يفقد طالب مستحق استحقاقه
  v := g is not null and (public.ft_true(g->'ok') or public.ft_true(g->'eq'));
  it := it || jsonb_build_object('k','pre','on',public.ft_true(cf->'pre'->'on'),'ok',v,
    'ar','اجتياز المتطلب السابق 3102 «التعبير الكتابي»','en','Passed the prerequisite 3102 “Written Expression”');
  -- 3) اجتياز المستويات المطلوبة: كل مقررات المستويات 1..n
  n := greatest(1, least(4, coalesce(nullif(cf->'lvls'->>'n','')::int, 3)));
  select coalesce(jsonb_agg(e2->>'code' order by e2->>'code'),'[]'::jsonb) into miss
    from jsonb_array_elements(crs) e2
   where left(coalesce(e2->>'code',''),1) ~ '^[1-9]$' and left(e2->>'code',1)::int <= n
     and not exists(select 1 where (gr->(e2->>'id')) is not null and ((public.ft_true(gr->(e2->>'id')->'fin') and public.ft_true(gr->(e2->>'id')->'ok') and public.ft_true(gr->(e2->>'id')->'rel')) or public.ft_true(gr->(e2->>'id')->'eq')));
  it := it || jsonb_build_object('k','lvls','on',public.ft_true(cf->'lvls'->'on'),'ok',jsonb_array_length(miss)=0,'n',n,'miss',miss,
    'ar','اجتياز جميع مقررات المستويات من الأول إلى '||(array['الأول','الثاني','الثالث','الرابع'])[n],
    'en','Passing all courses of Levels One to '||(array['One','Two','Three','Four'])[n]);
  -- 4) اختبار الكفاية في المهارات الأربع
  lv := greatest(1, least(4, coalesce(nullif(cf->'prof'->>'lvl','')::int, 3)));
  pr := s->'prof223'->(lv::text);
  pass := coalesce(nullif(c->'plan65cfg'->>'profPass','')::numeric, 60);
  avg := null;
  if pr is not null and (pr->>'r') ~ '^[0-9.]+$' and (pr->>'w') ~ '^[0-9.]+$' and (pr->>'li') ~ '^[0-9.]+$' and (pr->>'sp') ~ '^[0-9.]+$' then
    avg := round(((pr->>'r')::numeric + (pr->>'w')::numeric + (pr->>'li')::numeric + (pr->>'sp')::numeric)/4, 2);
  end if;
  it := it || jsonb_build_object('k','prof','on',public.ft_true(cf->'prof'->'on'),'ok',coalesce(avg >= pass,false),'got',avg,'need',pass,'lvl',lv,
    'ar','اجتياز اختبار الكفاية في المهارات الأربع للمستوى '||(array['الأول','الثاني','الثالث','الرابع'])[lv]||' (المتوسط '||pass||' فأكثر)',
    'en','Passing the four-skill proficiency test of Level '||(array['One','Two','Three','Four'])[lv]||' (average '||pass||' or more)');
  -- 5) حفظ جزء عمّ (المستويان الأول والثاني)
  v := public.ft_true(s->'hifz223'->'1'->'ok') and public.ft_true(s->'hifz223'->'2'->'ok');
  it := it || jsonb_build_object('k','hifz','on',public.ft_true(cf->'hifz'->'on'),'ok',v,
    'p1',public.ft_true(s->'hifz223'->'1'->'ok'),'p2',public.ft_true(s->'hifz223'->'2'->'ok'),
    'ar','حفظ جزء عمّ كاملاً (الناس – الضحى، والليل – النبأ)','en','Memorising Juz’ Amma in full (an-Nas – ad-Duha, al-Layl – an-Naba’)');
  -- 6) الحد الأدنى من الساعات المجتازة
  it := it || jsonb_build_object('k','hrs','on',public.ft_true(cf->'hrs'->'on'),'ok',ph >= coalesce(nullif(cf->'hrs'->>'min','')::numeric,0),'got',ph,'need',coalesce(nullif(cf->'hrs'->>'min','')::numeric,0),
    'ar','الحد الأدنى من الساعات المعتمدة المجتازة','en','Minimum passed credit hours');
  -- 7) الحد الأدنى من المعدل التراكمي
  it := it || jsonb_build_object('k','gpa','on',public.ft_true(cf->'gpa'->'on'),'ok',coalesce(gpa,0) >= coalesce(nullif(cf->'gpa'->>'min','')::numeric,0),'got',gpa,'need',coalesce(nullif(cf->'gpa'->>'min','')::numeric,0),
    'ar','الحد الأدنى من المعدل التراكمي','en','Minimum cumulative GPA');
  -- 8) لا مستحقات مالية غير مسددة (السجل المالي الموحد)
  select count(*) filter (where status='due'), coalesce(sum(due) filter (where status='due'),0), count(*) filter (where status='claimed')
    into dn, da, dc from public.fin263 where ref = p_sid and status in ('due','claimed');
  it := it || jsonb_build_object('k','dues','on',public.ft_true(cf->'dues'->'on'),'ok',dn = 0 and dc = 0,'due_n',dn,'due_amt',da,'claimed_n',dc,
    'ar','عدم وجود مستحقات مالية غير مسددة','en','No unpaid fees');

  -- الاستثناءات والنتيجة
  select jsonb_agg(case when ex ? (o->>'k') or ex ? '*' then o || jsonb_build_object('exc', coalesce(ex->(o->>'k'), ex->'*')) else o end) into it from jsonb_array_elements(it) o;
  select coalesce(bool_and(public.ft_true(o->'ok') or o ? 'exc'), true) into ok from jsonb_array_elements(it) o where public.ft_true(o->'on');
  return jsonb_build_object('ok', ok, 'sid', p_sid, 'prog', pg, 'lvl', s->>'lvl', 'gpa', gpa, 'hrs', ph, 'items', it);
end $$;
revoke all on function public.ft_elig_core(text) from public, anon, authenticated;

-- الإبقاء على التوقيع القديم (يستعمله ft_whoami وغيره)
create or replace function public.ft_elig(p_sid text) returns boolean
language sql stable security definer set search_path to 'public' as $$
  select coalesce((public.ft_elig_core(p_sid)->>'ok')::boolean, false)
$$;

create or replace function public.ft_elig_view_ok() returns boolean
language sql stable security definer set search_path to 'public' as $$
  select public.is_admin() or cardinality(public.ft_staff_roles()) > 0 or public.v226_has('graduates','eligibility','view')
$$;

-- التفصيل: للطالب نفسه، وللإدارة والجهات المخوّلة
create or replace function public.ft_elig_detail(p_sid text) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if auth.uid() is null then raise exception 'forbidden' using errcode='42501'; end if;
  if not (coalesce(public.my_ref() = p_sid, false) or coalesce(public.ft_elig_view_ok(), false)) then raise exception 'forbidden' using errcode='42501'; end if;
  return public.ft_elig_core(p_sid);
end $$;
revoke all on function public.ft_elig_detail(text) from public, anon;
grant execute on function public.ft_elig_detail(text) to authenticated;

-- قائمة الاستحقاق: طلاب الدبلوم غير المتخرجين في المستوى الثالث فأعلى أو المسجلين في 4401، مع الاسم للعرض الإداري فقط
create or replace function public.ft_elig_list() returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare course text := public.ft_c()->>'course';
begin
  if not public.ft_elig_view_ok() then raise exception 'forbidden' using errcode='42501'; end if;
  return coalesce((select jsonb_agg(public.ft_elig_core(s.id) || jsonb_build_object('ar', coalesce(s.data->>'name',''), 'en', coalesce(s.data->>'nameEn',''))
                                    order by s.id)
     from public.students s
    where not public.ft_true(s.data->'deleted') and coalesce(s.data->>'status','') <> 'متخرج'
      and coalesce(nullif(s.data->>'prog',''),'1000') = '1000'
      and (coalesce(nullif(s.data->>'lvl','')::int,1) >= 3 or coalesce(s.data->'reg','[]'::jsonb) ? coalesce(course,''))), '[]'::jsonb);
end $$;
revoke all on function public.ft_elig_list() from public, anon;
grant execute on function public.ft_elig_list() to authenticated;

-- الاستثناء: الإدارة المركزية فقط، بسبب إلزامي
create or replace function public.ft_exc_set(p_sid text, p_k text, p_reason text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare nid bigint; r text := left(trim(coalesce(p_reason,'')),500);
begin
  if not public.is_admin() then raise exception 'forbidden: central administration only' using errcode='42501'; end if;
  if p_k not in ('*','course','pre','lvls','prof','hifz','hrs','gpa','dues') then raise exception 'condition'; end if;
  if length(r) < 5 then raise exception 'reason required'; end if;
  if not exists(select 1 from public.students where id = p_sid) then raise exception 'student not found'; end if;
  update public.ft_exc set revoked_at = now(), revoked_by = coalesce(public.my_ref(),'admin'), revoke_reason = 'استُبدل باستثناء جديد'
   where sid = p_sid and k = p_k and revoked_at is null;
  insert into public.ft_exc(sid, k, reason, by_ref) values (p_sid, p_k, r, coalesce(public.my_ref(),'admin')) returning id into nid;
  perform public.ft_log(p_sid, 'elig_exc', jsonb_build_object('k', p_k, 'reason', r, 'id', nid));
  return jsonb_build_object('ok', true, 'id', nid);
end $$;
revoke all on function public.ft_exc_set(text,text,text) from public, anon;
grant execute on function public.ft_exc_set(text,text,text) to authenticated;

create or replace function public.ft_exc_revoke(p_id bigint, p_reason text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare z public.ft_exc; r text := left(trim(coalesce(p_reason,'')),500);
begin
  if not public.is_admin() then raise exception 'forbidden: central administration only' using errcode='42501'; end if;
  if length(r) < 5 then raise exception 'reason required'; end if;
  update public.ft_exc set revoked_at = now(), revoked_by = coalesce(public.my_ref(),'admin'), revoke_reason = r
   where id = p_id and revoked_at is null returning * into z;
  if z.id is null then raise exception 'not found or already revoked'; end if;
  perform public.ft_log(z.sid, 'elig_exc_revoke', jsonb_build_object('k', z.k, 'reason', r, 'id', z.id));
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.ft_exc_revoke(bigint,text) from public, anon;
grant execute on function public.ft_exc_revoke(bigint,text) to authenticated;

create or replace function public.ft_exc_list() returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select case when public.ft_elig_view_ok() then coalesce((select jsonb_agg(to_jsonb(z) order by z.id desc) from public.ft_exc z), '[]'::jsonb) else '[]'::jsonb end
$$;
revoke all on function public.ft_exc_list() from public, anon;
grant execute on function public.ft_exc_list() to authenticated;

-- إعدادات الاستحقاق لبرنامج: الإدارة المركزية فقط
create or replace function public.ft_elig_cfg_set(p_prog text, p jsonb) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare old jsonb := public.ft_c(); el jsonb; clean jsonb := '{}'::jsonb; k text;
begin
  if not public.is_admin() then raise exception 'forbidden: central administration only' using errcode='42501'; end if;
  if coalesce(p_prog,'') !~ '^[0-9A-Za-z_-]{1,20}$' then raise exception 'program'; end if;
  foreach k in array array['course','pre','lvls','prof','hifz','hrs','gpa','dues'] loop
    if p ? k then
      clean := clean || jsonb_build_object(k, jsonb_strip_nulls(jsonb_build_object('on', public.ft_true(p->k->'on'),
        'n', case when k='lvls' then greatest(1,least(4,coalesce(nullif(p->k->>'n','')::int,3))) end,
        'lvl', case when k='prof' then greatest(1,least(4,coalesce(nullif(p->k->>'lvl','')::int,3))) end,
        'min', case when k in ('hrs','gpa') then greatest(0,coalesce(nullif(p->k->>'min','')::numeric,0)) end)));
    end if;
  end loop;
  el := coalesce(old->'elig','{}'::jsonb) || jsonb_build_object(p_prog, clean);
  update public.ft_cfg set data = old || jsonb_build_object('elig', el), updated_at = now() where k = 'main';
  perform public.ft_log('cfg', 'elig_cfg', jsonb_build_object('prog', p_prog, 'old', old->'elig'->p_prog, 'new', clean));
  return public.ft_elig_cfg(p_prog);
end $$;
revoke all on function public.ft_elig_cfg_set(text,jsonb) from public, anon;
grant execute on function public.ft_elig_cfg_set(text,jsonb) to authenticated;

-- ft_whoami: تفصيل استحقاق الطالب ضمن الطلب الواحد
create or replace function public.ft_whoami() returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare me text := public.my_ref(); pr record; sup jsonb; ext boolean := false; ed jsonb;
begin
  if auth.uid() is null then return jsonb_build_object('auth', false); end if;
  select role, ref_id into pr from public.profiles where id = auth.uid();
  select e into sup from jsonb_array_elements(coalesce(public.ft_c()->'sups','[]'::jsonb)) e where e->>'id' = me limit 1;
  if sup is not null and coalesce(sup->>'until','') <> '' and current_date > (sup->>'until')::date then ext := true; end if;
  if pr.role = 'student' then ed := public.ft_elig_core(me); end if;
  return jsonb_build_object('auth', true, 'admin', public.is_admin(), 'ref', me, 'role', pr.role, 'name', public.ft_name(me),
    'roles', to_jsonb(public.ft_staff_roles()), 'elig', case when pr.role = 'student' then coalesce((ed->>'ok')::boolean,false) else false end,
    'eld', ed,
    'sup', case when pr.role = 'faculty' then (public.ft_is_sup(me) and not ext) or exists(select 1 from public.ft_rec r where me = any(r.sup)) else false end,
    'expired', ext, 'term', public.ft_c()->'term');
end $$;

-- ft_boot: للإدارة والجهات المخوّلة قائمة الاستحقاق والاستثناءات في الطلب نفسه
create or replace function public.ft_boot() returns jsonb
language sql stable set search_path to 'public' as $$
 select jsonb_build_object(
  'who', public.ft_whoami(),
  'cfg', public.ft_cfg_get(),
  'sig', public.ft_signers(),
  'recs', coalesce((select jsonb_agg(to_jsonb(r) order by r.updated_at desc) from public.ft_rec r),'[]'::jsonb),
  'notes', coalesce((select jsonb_agg(to_jsonb(n) order by n.id desc) from (select * from public.ft_note order by id desc limit 60) n),'[]'::jsonb),
  'elig', case when public.ft_elig_view_ok() then public.ft_elig_list() end,
  'exc', case when public.ft_elig_view_ok() then public.ft_exc_list() end);
$$;
