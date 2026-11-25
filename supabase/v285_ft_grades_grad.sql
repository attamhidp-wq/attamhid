-- v285 — المرحلة الرابعة: الرصد الآلي للدرجة (غير منشورة)، والترشيح للتخرج، وسجل الوثائق وإلغاؤها بسبب، والتقارير. لا بيانات شخصية.

-- رصد درجة 4401 آلياً عند إغلاق ملف التدريب واعتماد المشروع نهائياً؛ تبقى غير منشورة (pub270_guard) حتى زر النشر وتأكيد الرسوم
create or replace function public.ft_grade_auto(p_sid text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare x jsonb := public.ft_grade(p_sid); gg record; crs text := public.ft_c()->>'course'; pct numeric; cur jsonb;
begin
  if not coalesce((x->>'ready')::boolean,false) then return jsonb_build_object('ok',false,'ready',false); end if;
  select data->'gr'->crs into cur from public.students where id = p_sid;
  if cur is not null and public.ft_true(cur->'rel') then return jsonb_build_object('ok',false,'published',true); end if;
  pct := round((x->>'total')::numeric); select * into gg from public.v78_grade(pct);
  perform set_config('app.ft_sys','1',true);
  update public.students set data = jsonb_set(data, '{gr}', coalesce(data->'gr','{}'::jsonb) || jsonb_build_object(crs, jsonb_build_object('score',pct,'gl',gg.gl,'pts',gg.pts,'ok',pct>=60,'fin',1,'rel',0,'src','ft279auto','comp',x - 'ready' - 'tr' - 'gp'))) where id = p_sid;
  perform public.ft_log(coalesce(x->>'tr','grade'), 'grade_auto', jsonb_build_object('sid',p_sid,'total',x->>'total'));
  return jsonb_build_object('ok',true,'score',pct);
end $$;
revoke all on function public.ft_grade_auto(text) from public, anon, authenticated;

create or replace function public.ft_grade_auto_trg() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare m text;
begin
  if new.st is distinct from old.st and ((new.kind='tr' and new.st='closed') or (new.kind='gp' and new.st in ('final_ok','archived'))) then
    perform public.ft_grade_auto(new.sid);
    if new.kind='gp' then for m in select jsonb_array_elements_text(coalesce(new.data->'mem','[]'::jsonb)) loop perform public.ft_grade_auto(m); end loop; end if;
  end if;
  return null;
end $$;

create trigger ft_grade_auto after update on public.ft_rec for each row execute function public.ft_grade_auto_trg();

-- الترشيح للتخرج: المستحقات، والدرجات غير المنشورة، ودرجة 4401 (يُضاف إليها في الواجهة شرط اكتمال متطلبات البرنامج)
create or replace function public.ft_grad_check(p_sids text[]) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare crs text := public.ft_c()->>'course';
begin
  if not public.ft_elig_view_ok() then raise exception 'forbidden' using errcode='42501'; end if;
  return coalesce((select jsonb_object_agg(s.id, jsonb_build_object(
      'dues', (select count(*) from public.fin263 f where f.ref = s.id and f.status in ('due','claimed')),
      'unpub', (select count(*) from jsonb_each(case when jsonb_typeof(s.data->'gr')='object' then s.data->'gr' else '{}'::jsonb end) e(k,v) where jsonb_typeof(v)='object' and public.ft_true(v->'fin') and not public.ft_true(v->'rel')),
      'c4401', case when public.ft_true(s.data->'gr'->crs->'rel') then 'pub' when public.ft_true(s.data->'gr'->crs->'fin') then 'posted' else 'none' end))
    from public.students s where s.id = any(p_sids)), '{}'::jsonb);
end $$;
revoke all on function public.ft_grad_check(text[]) from public, anon;
grant execute on function public.ft_grad_check(text[]) to authenticated;

-- قرار التخرج (فردي أو جماعي) برقم وتاريخ — يُسجَّل في سجل التدقيق باسم منفّذه
create or replace function public.ft_grad_log(p_sids text[], p_no text, p_date date) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare s text;
begin
  if not public.v51_is_central() then raise exception 'forbidden: central administration only' using errcode='42501'; end if;
  if coalesce(trim(p_no),'') = '' or p_date is null then raise exception 'decision number and date are required'; end if;
  foreach s in array p_sids loop perform public.ft_log(s, 'grad_decision', jsonb_build_object('no', left(p_no,60), 'date', p_date, 'n', cardinality(p_sids))); end loop;
  insert into public.audit_log(id, data) values ('g'||substr(md5(random()::text||clock_timestamp()::text),1,11), jsonb_build_object('t',now(),'by',coalesce(public.my_ref(),'admin'),'v51',1,'action','اعتماد التخرج بقرار','target',array_to_string(p_sids,','),'detail','القرار '||left(p_no,60)||' بتاريخ '||p_date));
  return jsonb_build_object('ok', true, 'n', cardinality(p_sids));
end $$;
revoke all on function public.ft_grad_log(text[],text,date) from public, anon;
grant execute on function public.ft_grad_log(text[],text,date) to authenticated;

-- سجل الوثائق الصادرة كله، وإلغاء وثيقة بسبب إلزامي
create or replace function public.ft_docs_all() returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select case when public.ft_elig_view_ok() then coalesce((select jsonb_agg(jsonb_build_object('ref',d.ref,'form',d.form,'rec',d.rec_id,'st',d.st,'issued',d.issued_at,'tar',d.title_ar,'ten',d.title_en,'cancelled',d.cancelled_at,'replaced_by',d.replaced_by,'by',d.by_ref) order by d.issued_at desc) from public.ft_docs d), '[]'::jsonb) else '[]'::jsonb end
$$;
revoke all on function public.ft_docs_all() from public, anon;
grant execute on function public.ft_docs_all() to authenticated;

create or replace function public.ft_doc_cancel(p_ref text, p_reason text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare d public.ft_docs; r text := left(trim(coalesce(p_reason,'')),500);
begin
  if not (public.ft_staff_roles() && array['tc','pc','admin']) then raise exception 'forbidden' using errcode='42501'; end if;
  if length(r) < 5 then raise exception 'reason required'; end if;
  update public.ft_docs set st = 'cancelled', cancelled_at = now() where ref = p_ref and st <> 'cancelled' returning * into d;
  if d.ref is null then raise exception 'not found or already cancelled'; end if;
  perform public.ft_log(coalesce(d.rec_id,'doc'), 'doc_cancel', jsonb_build_object('ref', p_ref, 'reason', r));
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.ft_doc_cancel(text,text) from public, anon;
grant execute on function public.ft_doc_cancel(text,text) to authenticated;

-- تقرير بفترة (يومي، أسبوعي، شهري، فصلي، أو مخصص): أعداد فقط
create or replace function public.ft_report(p_from date, p_to date) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare f timestamptz := p_from::timestamptz; t timestamptz := (p_to + 1)::timestamptz;
  a jsonb; h numeric;
begin
  if not public.ft_elig_view_ok() then raise exception 'forbidden' using errcode='42501'; end if;
  select coalesce(jsonb_object_agg(act, n),'{}'::jsonb) into a from (select act, count(*) n from public.ft_audit where at >= f and at < t group by act) z;
  select coalesce(sum((x->>'h')::numeric),0) into h from public.ft_rec r, jsonb_array_elements(coalesce(r.data->'log','[]'::jsonb)) x
    where r.kind='tr' and (x->>'date') ~ '^\d{4}-\d{2}-\d{2}' and (x->>'date')::date between p_from and p_to;
  return jsonb_build_object('from', p_from, 'to', p_to, 'acts', a, 'hours', h,
    'tr_new', (select count(*) from public.ft_rec where kind='tr' and created_at >= f and created_at < t),
    'gp_new', (select count(*) from public.ft_rec where kind='gp' and created_at >= f and created_at < t),
    'tr_st', (select coalesce(jsonb_object_agg(st, n),'{}'::jsonb) from (select st, count(*) n from public.ft_rec where kind='tr' group by st) z),
    'gp_st', (select coalesce(jsonb_object_agg(st, n),'{}'::jsonb) from (select st, count(*) n from public.ft_rec where kind='gp' group by st) z),
    'defences', (select count(*) from public.ft_rec where kind='gp' and coalesce(data->'m7'->>'date','') ~ '^\d{4}-\d{2}-\d{2}' and left(data->'m7'->>'date',10)::date between p_from and p_to),
    'docs', (select count(*) from public.ft_docs where issued_at >= f and issued_at < t),
    'docs_cancelled', (select count(*) from public.ft_docs where cancelled_at >= f and cancelled_at < t),
    'verify', (select count(*) from public.ft_audit where act like '%verify%' and at >= f and at < t));
end $$;
revoke all on function public.ft_report(date,date) from public, anon;
grant execute on function public.ft_report(date,date) to authenticated;
