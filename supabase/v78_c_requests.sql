-- v78 (ج) اختبار تحديد المستوى، والاستعلام الآمن عن الطلب، وإعادة تسليم الطلب المعاد (v77)

-- حقول داخلية لا تظهر للمتقدم
create or replace function public.v78_req_public(d jsonb) returns jsonb language sql immutable as $$
  select (d - 'secret' - 'rv64') || case when d ? 'app77'
           then jsonb_build_object('app77', (d->'app77') - 'mq') else '{}'::jsonb end
$$;

create or replace function public.v78_is_placement(e jsonb, eid text) returns boolean language sql immutable as $$
  select eid = '1000001' or (coalesce(e->>'courseId','') = '' and coalesce(e->>'subj','') like '%تحديد المستوى%')
$$;

-- ورقة اختبار تحديد المستوى (بلا إجابات)
create or replace function public.placement_paper(rid text, eid text)
returns table(pos int, ty text, t text, opts jsonb) language plpgsql security definer set search_path = public as $$
declare r jsonb; e jsonb;
begin
  select x.data into r from public.requests x where upper(x.id) = upper(trim(rid));
  if r is null or coalesce(r->>'status','') ~ 'مرفوض|اعتذار' then raise exception 'request not eligible'; end if;
  select x.data into e from public.exams x where x.id = eid and x.data->>'pub' = 'true';
  if e is null or not public.v78_is_placement(e, eid) then raise exception 'exam not available'; end if;
  if exists(select 1 from public.submissions b where upper(b.data->>'rid') = upper(trim(rid))) then raise exception 'already submitted'; end if;
  return query select q.pos, q.ty, q.t, case when q.ty = 'mc' then q.opts else null end
    from public.exam_questions q where q.exam_id = eid order by q.pos;
end $$;

-- تسليم اختبار تحديد المستوى وتصحيحه ورصده في ملف الطلب
create or replace function public.submit_placement(rid text, eid text, answers jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare rq record; e jsonb; q record; a text; sc numeric := 0; mx int := 0; wr jsonb := '{}'::jsonb;
        pct numeric; lv int; subid text; today text := to_char(now(),'YYYY-MM-DD'); ts bigint := (extract(epoch from clock_timestamp())*1000)::bigint;
        pln text[] := array['الأول','الثاني','الثالث','الرابع'];
begin
  select x.id, x.data into rq from public.requests x where upper(x.id) = upper(trim(rid)) for update;
  if rq.id is null or coalesce(rq.data->>'status','') ~ 'مرفوض|اعتذار' then raise exception 'request not eligible'; end if;
  select x.data into e from public.exams x where x.id = eid and x.data->>'pub' = 'true';
  if e is null or not public.v78_is_placement(e, eid) then raise exception 'exam not available'; end if;
  if exists(select 1 from public.submissions b where upper(b.data->>'rid') = upper(rq.id)) then raise exception 'already submitted'; end if;
  answers := case when jsonb_typeof(answers) = 'object' then answers else '{}'::jsonb end;
  for q in select x.pos, x.ty, x.ans from public.exam_questions x where x.exam_id = eid order by x.pos loop
    mx := mx + 1; a := answers->>(q.pos::text);
    if q.ty = 'wr' then
      if length(trim(coalesce(a,''))) >= 25 then sc := sc + 1; wr := wr || jsonb_build_object(q.pos::text, 1); else wr := wr || jsonb_build_object(q.pos::text, 0); end if;
    elsif a is not null and a = (q.ans #>> '{}') then sc := sc + 1;
    end if;
  end loop;
  if mx = 0 then raise exception 'exam has no questions'; end if;
  pct := round(sc / mx * 100, 1);
  lv := case when pct > 90 then 4 when pct > 80 then 3 when pct > 70 then 2 else 1 end;
  subid := ts::text;
  insert into public.submissions(id, data) values (subid, jsonb_build_object('id', ts, 'ts', ts, 'rid', rq.id, 'sid', '',
    'eid', case when eid ~ '^\d+$' then to_jsonb(eid::bigint) else to_jsonb(eid) end, 'ans', answers, 'auto', sc, 'wr', wr,
    'total', sc, 'pct', pct, 'st', 'مُقيَّم', 'date', today, 'pl', 1));
  update public.requests set updated_at = now(), data = data || jsonb_build_object(
    'pl', jsonb_build_object('score', pct, 'raw', sc, 'max', mx, 'lv', lv, 'eid', e->'id', 'date', today, 'ts', ts),
    'placementScore', pct, 'suggestedLevel', lv, 'suggestedLevelName', 'المستوى ' || pln[lv],
    'placementDate', today, 'placementRaw', sc, 'placementMax', mx, 'u', public.v78_now())
  where id = rq.id;
  return jsonb_build_object('pct', pct, 'score', pct, 'raw', sc, 'max', mx, 'lv', lv);
end $$;

-- الاستعلام برقم الطلب والرمز السري
create or replace function public.track_request_secure(rid text, sec text)
returns jsonb language sql stable security definer set search_path = public as $$
  select public.v78_req_public(x.data) from public.requests x
   where upper(x.id) = upper(trim(rid)) and coalesce(x.data->>'secret','') <> ''
     and upper(x.data->>'secret') = upper(trim(sec)) limit 1
$$;

-- v77: الاستعلام مع التمييز بين «غير موجود» و«الرمز خاطئ»
create or replace function public.v77_track(rid text, sec text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare d jsonb;
begin
  select x.data into d from public.requests x where upper(x.id) = upper(trim(rid)) limit 1;
  if d is null then return null; end if;
  if coalesce(d->>'secret','') = '' or upper(d->>'secret') <> upper(trim(coalesce(sec,''))) then raise exception 'bad secret'; end if;
  return public.v78_req_public(d);
end $$;

-- v77: إعادة تسليم الطلب المعاد بعد التصحيح
create or replace function public.v77_resubmit(rid text, sec text, patch jsonb, note text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
declare rq record; d jsonb; a jsonb; k text; v text; st text; now_i text := public.v78_now();
        allowed text[] := array['name','nameEn','email','phone','birth','pob','pobEn','nat','natEn','country','pid','address','guardian','guardianPhone','q64_issuer','q64_year','q64_gpa'];
begin
  select x.id, x.data into rq from public.requests x where upper(x.id) = upper(trim(rid)) for update;
  if rq.id is null then return jsonb_build_object('ok', false, 'error', 'not found'); end if;
  d := rq.data;
  if coalesce(d->>'secret','') = '' or upper(d->>'secret') <> upper(trim(coalesce(sec,''))) then return jsonb_build_object('ok', false, 'error', 'bad secret'); end if;
  st := case when coalesce(d->>'status','') ~ 'مقبول' then 'final' when coalesce(d->>'status','') ~ 'مرفوض|اعتذار' then 'rejected'
             else coalesce(d->'app77'->>'st', '') end;
  if st <> 'returned' then return jsonb_build_object('ok', false, 'error', 'not returned'); end if;
  if jsonb_typeof(patch) <> 'object' then patch := '{}'::jsonb; end if;
  if coalesce(trim(patch->>'name'),'') = '' or coalesce(patch->>'email','') !~ '^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$' then
    return jsonb_build_object('ok', false, 'error', 'name and email required');
  end if;
  foreach k in array allowed loop
    v := left(trim(coalesce(patch->>k, '')), 300);
    if k = 'nameEn' then v := upper(v); end if;
    if v <> '' or coalesce(d->>k,'') <> '' then d := d || jsonb_build_object(k, v); end if;
  end loop;
  note := left(trim(coalesce(note,'')), 600);
  a := coalesce(d->'app77', '{}'::jsonb);
  a := a || jsonb_build_object('st','review','note','','last','review','resub', coalesce(nullif(a->>'resub','')::int,0) + 1,
         'hist', (select coalesce(jsonb_agg(h order by o), '[]'::jsonb) from (
                    select h, o from jsonb_array_elements(coalesce(a->'hist','[]'::jsonb) || jsonb_build_array(
                      jsonb_build_object('st','review','at',now_i,'by','الطالب','note',note,'ev','resubmitted'))) with ordinality z(h,o)
                    order by o desc limit 60) t),
         'mq', coalesce(a->'mq','[]'::jsonb) || case when coalesce(d->>'email','') <> ''
                 then jsonb_build_array(jsonb_build_object('st','review','ev','resubmitted','note',note,'at',now_i,'n',0)) else '[]'::jsonb end);
  d := d || jsonb_build_object('app77', a, 'u', now_i);
  update public.requests set data = d, updated_at = now() where id = rq.id;
  return jsonb_build_object('ok', true);
end $$;

revoke execute on function public.v78_req_public(jsonb) from public, anon, authenticated;
revoke execute on function public.v78_is_placement(jsonb, text) from public, anon, authenticated;
grant execute on function public.placement_paper(text, text), public.submit_placement(text, text, jsonb),
  public.track_request_secure(text, text), public.v77_track(text, text), public.v77_resubmit(text, text, jsonb, text) to anon, authenticated;
