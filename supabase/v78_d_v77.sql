-- v78 (د) تسليم التكليفات (v77_asg) والوثائق الفورية «وثائقي» (v77_self_cert)

create table if not exists public.v77_asg (
  course_id  text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.v77_asg enable row level security;
create policy v77_asg_read on public.v77_asg for select to anon, authenticated using (true);
-- الكتابة عبر الدالة فقط

create or replace function public.v77_asg_set(cid text, d jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
declare ok boolean := public.v51_is_central(); it jsonb; items jsonb := '[]'::jsonb;
begin
  cid := left(trim(coalesce(cid,'')), 40);
  if cid = '' or jsonb_typeof(d) <> 'object' then return false; end if;
  if not ok then
    ok := exists(select 1 from public.profiles p join public.faculty f on f.id = p.ref_id
                 where p.id = (select auth.uid()) and p.role = 'faculty'
                   and coalesce(f.data->>'active','true') not in ('false','0')
                   and exists(select 1 from jsonb_array_elements_text(coalesce(f.data->'courses','[]'::jsonb)) c where c = cid));
  end if;
  if not ok then raise exception 'forbidden'; end if;
  for it in select x from jsonb_array_elements(coalesce(d->'items','[]'::jsonb)) x limit 50 loop
    if coalesce(it->>'url','') <> '' and (it->>'url') !~* '^https://(docs\.google\.com/forms/|forms\.gle/|forms\.office\.com/)' then
      raise exception 'invalid form link';
    end if;
    items := items || jsonb_build_array(jsonb_build_object(
      'id', left(coalesce(it->>'id',''),40), 'tAr', left(coalesce(it->>'tAr',''),120), 'tEn', left(coalesce(it->>'tEn',''),120),
      'url', left(coalesce(it->>'url',''),500), 'from', left(coalesce(it->>'from',''),25), 'to', left(coalesce(it->>'to',''),25),
      'on', case when coalesce(it->>'on','0') in ('1','true') then 1 else 0 end, 'deleted', case when coalesce(it->>'deleted','0') in ('1','true') then 1 else 0 end,
      'by', left(coalesce(it->>'by',''),120), 'u', left(coalesce(it->>'u',''),30)));
  end loop;
  insert into public.v77_asg(course_id, data, updated_at)
    values (cid, jsonb_build_object('items', items, 'u', coalesce(left(d->>'u',30), public.v78_now())), now())
    on conflict (course_id) do update set data = excluded.data, updated_at = now();
  return true;
end $$;

-- وثيقة ذاتية الإصدار برقم رسمي فريد (11 رقماً، بادئة النوع 19 = وثائق أخرى) وتسجيله في سجل الأرقام الدائم
create or replace function public.v77_self_cert(c jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := (select auth.uid()); pr record; o jsonb; t text := c->>'type'; kind text; pre text; n int; rec text;
        cert jsonb; ex record; today text := to_char(now(),'YYYY-MM-DD'); ap jsonb;
begin
  if uid is null then raise exception 'login required'; end if;
  select role, ref_id into pr from public.profiles where id = uid;
  if pr.ref_id is null then raise exception 'no linked record'; end if;
  kind := pr.role;
  if kind = 'student' then
    if t not in ('intro','fin','skill77') then raise exception 'type not allowed'; end if;
    select data into o from public.students where id = pr.ref_id;
  elsif kind = 'faculty' then
    if t not in ('intro','exp') then raise exception 'type not allowed'; end if;
    select data into o from public.faculty where id = pr.ref_id;
  elsif kind = 'staff' then
    if t not in ('intro','exp') then raise exception 'type not allowed'; end if;
    select data into o from public.v51_members where id = pr.ref_id;
  else raise exception 'not allowed'; end if;
  if o is null then raise exception 'record not found'; end if;

  -- وثيقة اليوم نفسها تُعاد ولا يُصدر رقم جديد
  select id, data into ex from public.certs
   where data->>'type' = t and coalesce(data->>'self77','') <> '' and coalesce(data->>'revoked','false') not in ('true','1')
     and (case when kind = 'student' then data->>'sid' else data->>'uid' end) = pr.ref_id and data->>'date' = today
   order by created_at desc limit 1;
  if found then return jsonb_build_object('ok', true, 'rec', ex.data->>'rec', 'cert', ex.data); end if;

  pre := '19' || to_char(now(),'YYYY');
  perform pg_advisory_xact_lock(hashtext('v77_self_cert:' || pre));
  select greatest(
           coalesce((select max(substr(num,7)::int) from public.v75_issued where num ~ ('^' || pre || '\d{5}$')), 0),
           coalesce((select max(substr(data->>'rec',7)::int) from public.certs where data->>'rec' ~ ('^' || pre || '\d{5}$')), 0)) + 1
    into n;
  rec := pre || lpad(n::text, 5, '0');

  cert := jsonb_build_object('rec', rec, 'type', t, 'lang', 'bi', 'name', coalesce(o->>'name',''), 'nameEn', coalesce(o->>'nameEn',''),
            'date', today, 'at', public.v78_now(), 'self77', 1, 'by', 'إصدار ذاتي من البوابة');
  if kind = 'student' then
    cert := cert || jsonb_build_object('sid', pr.ref_id, 'uid', pr.ref_id, 'prog', o->'prog');
  else
    ap := coalesce(o->'appt64','{}'::jsonb);
    cert := cert || jsonb_build_object('uid', pr.ref_id, 'sid', '');
    if t = 'exp' then cert := cert || jsonb_build_object('from', coalesce(ap->>'start', o->>'start', ''), 'to', today); end if;
  end if;

  insert into public.certs(id, data) values (rec, cert);
  insert into public.v75_issued(num, kind, holder, label) values (rec, t, pr.ref_id, 'self77') on conflict (num) do nothing;
  return jsonb_build_object('ok', true, 'rec', rec, 'cert', cert);
end $$;

revoke execute on function public.v77_asg_set(text, jsonb), public.v77_self_cert(jsonb) from public, anon;
grant execute on function public.v77_asg_set(text, jsonb), public.v77_self_cert(jsonb) to authenticated;
