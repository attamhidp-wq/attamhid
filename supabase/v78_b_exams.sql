-- v78 (ب) الاختبارات الإلكترونية من بنوك الأسئلة (v65): سحب عشوائي على الخادم وتصحيح ورصد آلي

create table if not exists public.v65_draws (
  student_id text not null,
  exam_id    text not null,
  pick       int[] not null,
  perm       jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  primary key (student_id, exam_id)
);
alter table public.v65_draws enable row level security;
-- لا سياسات: لا يصل إليه أحد إلا عبر الدوال أدناه
create policy v65_draws_central on public.v65_draws for select to authenticated using (public.v51_is_central());

-- سلم التقديرات (يُقرأ من إعداد الإدارة إن وُجد، وإلا السلم الافتراضي)
create or replace function public.v78_grade(p numeric)
returns table(gl text, pts numeric) language plpgsql stable security definer set search_path = public as $$
declare g jsonb; s jsonb;
begin
  p := greatest(0, least(100, coalesce(p,0)));
  select data->'grades' into s from public.v51_settings where key = 'scale';
  pts := case when p>=95 then 5 when p>=90 then 4.75 when p>=85 then 4.5 when p>=80 then 4 when p>=75 then 3.5
              when p>=70 then 3 when p>=65 then 2.5 when p>=60 then 2 else 1 end;
  gl := case when p>=95 then 'ممتاز مرتفع' when p>=90 then 'ممتاز' when p>=85 then 'جيد جداً مرتفع' when p>=80 then 'جيد جداً'
             when p>=75 then 'جيد مرتفع' when p>=70 then 'جيد' when p>=65 then 'مقبول مرتفع' when p>=60 then 'مقبول' else 'راسب' end;
  if jsonb_typeof(s) = 'array' then
    for g in select x from jsonb_array_elements(s) x
             where jsonb_typeof(x)='array' and (x->>0) ~ '^\d+(\.\d+)?$'
             order by (x->>0)::numeric desc loop
      if p >= (g->>0)::numeric then gl := coalesce(nullif(g->>1,''), gl); exit; end if;
    end loop;
  end if;
  return next;
end $$;
revoke execute on function public.v78_grade(numeric) from public, anon, authenticated;

create or replace function public.v78_now() returns text language sql stable as
$$ select to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') $$;

-- ورقة الاختبار: أسئلة مسحوبة عشوائياً وخيارات مخلوطة، بلا إجابات
create or replace function public.v65_exam_paper(eid text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_sid text := public.my_ref(); e jsonb; d public.v65_draws; mc int; tf int; pk int[]; pm jsonb := '{}'::jsonb;
        q record; paper jsonb := '[]'::jsonb; i int;
begin
  if v_sid is null or not exists(select 1 from public.students s where s.id = v_sid) then raise exception 'students only'; end if;
  select x.data into e from public.exams x where x.id = eid and x.data->>'pub' = 'true';
  if e is null then raise exception 'exam not available'; end if;
  if e->'draw65' is null then raise exception 'not a bank exam'; end if;
  if exists(select 1 from public.submissions b where b.data->>'sid' = v_sid and b.data->>'eid' = eid) then raise exception 'already submitted'; end if;

  select * into d from public.v65_draws w where w.student_id = v_sid and w.exam_id = eid;
  if not found then
    mc := greatest(0, coalesce(nullif(e->'draw65'->>'mc','')::int, 10));
    tf := greatest(0, coalesce(nullif(e->'draw65'->>'tf','')::int, 5));
    pk := array(select pos from public.exam_questions where exam_id = eid and ty = 'mc' order by random() limit mc)
       || array(select pos from public.exam_questions where exam_id = eid and ty = 'tf' order by random() limit tf);
    if coalesce(array_length(pk,1),0) = 0 then raise exception 'exam has no questions'; end if;
    for q in select pos, opts from public.exam_questions where exam_id = eid and ty = 'mc' and pos = any(pk) loop
      pm := pm || jsonb_build_object(q.pos::text,
              (select coalesce(jsonb_agg(g order by random()), '[]'::jsonb) from generate_series(0, coalesce(jsonb_array_length(q.opts),0) - 1) g));
    end loop;
    insert into public.v65_draws(student_id, exam_id, pick, perm) values (v_sid, eid, pk, pm)
      on conflict (student_id, exam_id) do nothing;
    select * into d from public.v65_draws w where w.student_id = v_sid and w.exam_id = eid;
  end if;

  foreach i in array d.pick loop
    select pos, ty, t, opts into q from public.exam_questions where exam_id = eid and pos = i;
    if not found then continue; end if;
    paper := paper || jsonb_build_array(jsonb_build_object('pos', q.pos, 'ty', q.ty, 't', q.t,
      'opts', case when q.ty = 'mc' then
                (select coalesce(jsonb_agg(q.opts->(j.v::int) order by j.o), '[]'::jsonb)
                   from jsonb_array_elements_text(coalesce(d.perm->(q.pos::text), '[]'::jsonb)) with ordinality j(v, o))
              else null end));
  end loop;
  return jsonb_build_object('paper', paper, 'started', d.started_at, 'min', e->>'min');
end $$;

-- التسليم: تصحيح آلي فوري، ورصد الدرجة دون المساس بدرجة مرصودة سابقاً
create or replace function public.v65_submit_exam(eid text, answers jsonb, sa jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_sid text := public.my_ref(); e jsonb; d public.v65_draws; i int; q record; a text; orig text;
        sc numeric := 0; mx numeric := 0; sac int := 0; sv numeric[] := '{}'; v_avg numeric;
        subid text; pct int; g record; cid text; st jsonb; cur jsonb; kept boolean := false; late boolean := false;
        today text := to_char(now(), 'YYYY-MM-DD');
begin
  if v_sid is null or not exists(select 1 from public.students s where s.id = v_sid) then raise exception 'students only'; end if;
  select x.data into e from public.exams x where x.id = eid and x.data->>'pub' = 'true';
  if e is null then raise exception 'exam not available'; end if;
  if exists(select 1 from public.submissions b where b.data->>'sid' = v_sid and b.data->>'eid' = eid) then raise exception 'already submitted'; end if;
  select * into d from public.v65_draws w where w.student_id = v_sid and w.exam_id = eid;
  if not found then raise exception 'exam not started'; end if;
  if coalesce(nullif(e->>'min','')::numeric, 0) > 0 and now() > d.started_at + make_interval(mins => (e->>'min')::int + 5) then late := true; end if;
  answers := case when jsonb_typeof(answers) = 'object' then answers else '{}'::jsonb end;

  foreach i in array d.pick loop
    select ty, ans into q from public.exam_questions where exam_id = eid and pos = i;
    if not found then continue; end if;
    mx := mx + 1;
    a := answers->>(i::text);
    if a is null or a !~ '^\d+$' then continue; end if;
    if q.ty = 'mc' then
      orig := d.perm->(i::text)->>(a::int);
      if orig is not null and orig = (q.ans #>> '{}') then sc := sc + 1; end if;
    elsif q.ty = 'tf' then
      if a::int = coalesce(nullif(q.ans #>> '{}','')::int, -1) then sc := sc + 1; end if;
    end if;
  end loop;

  if jsonb_typeof(sa) = 'object' then
    select coalesce(array_agg(x.value::numeric), '{}') into sv from jsonb_each_text(sa) x where x.value ~ '^[1-5]$';
  end if;
  if array_length(sv,1) > 0 then select avg(u) into v_avg from unnest(sv) u; end if;
  select coalesce(nullif(data->>'saCount','')::int, 0) into sac from public.v51_settings where key = 'bank65cfg';
  if coalesce(sac,0) > 0 and array_length(sv,1) > 0 then
    sc := sc + (select sum((u-1)/4) from unnest(sv) u); mx := mx + array_length(sv,1);
  end if;
  sc := round(sc, 2);
  pct := round(sc / greatest(mx,1) * 100);
  select * into g from public.v78_grade(pct);

  subid := ((extract(epoch from clock_timestamp())*1000)::bigint)::text;
  insert into public.submissions(id, data) values (subid, jsonb_build_object(
    'id', subid::bigint, 'sid', v_sid, 'eid', case when eid ~ '^\d+$' then to_jsonb(eid::bigint) else to_jsonb(eid) end,
    'ans', answers, 'pick', to_jsonb(d.pick), 'perm65', d.perm, 'auto', sc, 'wr', '{}'::jsonb, 'total', sc, 'max65', mx,
    'sa65', jsonb_build_object('v', coalesce(sa,'{}'::jsonb), 'avg', v_avg), 'st', 'مُقيَّم آلياً', 'date', today, 'srv65', 1, 'late', late));

  cid := e->>'courseId';
  if cid is not null and cid <> '' then
    select data into st from public.students where id = v_sid for update;
    cur := st->'gr'->cid;
    if cur is not null and (coalesce(cur->>'fin','') not in ('','0','false') or coalesce(cur->>'man','') not in ('','0','false')) then
      kept := true;
    else
      st := jsonb_set(st, '{gr}', coalesce(st->'gr','{}'::jsonb) || jsonb_build_object(cid, jsonb_build_object(
              'rel',1,'relDate',today,'score',pct,'gl',g.gl,'pts',g.pts,'ok', pct >= coalesce(nullif(e->>'passPct','')::numeric,60),
              'fin',1,'src','exam','eid', e->'id','bank65',1,'date',today)));
    end if;
    if not coalesce(st->'reg','[]'::jsonb) @> jsonb_build_array(e->'courseId') then
      st := jsonb_set(st, '{reg}', coalesce(st->'reg','[]'::jsonb) || jsonb_build_array(e->'courseId'));
    end if;
    st := st || jsonb_build_object('u', public.v78_now());
    update public.students set data = st, updated_at = now() where id = v_sid;
  end if;
  delete from public.v65_draws where student_id = v_sid and exam_id = eid;
  return jsonb_build_object('ok', true, 'pct', pct, 'gl', g.gl, 'kept', kept, 'total', sc, 'max', mx, 'late', late);
end $$;

revoke execute on function public.v65_exam_paper(text) from public, anon;
revoke execute on function public.v65_submit_exam(text, jsonb, jsonb) from public, anon;
grant execute on function public.v65_exam_paper(text) to authenticated;
grant execute on function public.v65_submit_exam(text, jsonb, jsonb) to authenticated;
