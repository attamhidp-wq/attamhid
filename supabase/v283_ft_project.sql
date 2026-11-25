-- v283 — المرحلة الثالثة (مشروع التخرج): منع تكرار العناوين، وقرار «إعادة» من اللجنة بسبب،
-- وتنبيهات يومية داخل البوابة باقتراب المواعيد والتأخر (المراحل، والتعديلات بعد المناقشة، وانقطاع السجل اليومي).
-- لا بريد في هذه التنبيهات قبل اعتماد نماذجه. لا بيانات شخصية.

create or replace function public.ft_gp_title_guard() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare t text := public.v224_norm(new.data->'reg'->>'title'); te text := lower(regexp_replace(coalesce(new.data->'reg'->>'titleEn',''),'[^A-Za-z0-9]+',' ','g'));
begin
  if new.kind <> 'gp' or new.st in ('rejected','archived') then return new; end if;
  if tg_op = 'UPDATE' and (old.data->'reg'->>'title') is not distinct from (new.data->'reg'->>'title')
     and (old.data->'reg'->>'titleEn') is not distinct from (new.data->'reg'->>'titleEn') then return new; end if;
  te := trim(regexp_replace(te,'\s+',' ','g'));
  if coalesce(t,'') <> '' and exists(select 1 from public.ft_rec z where z.kind='gp' and z.id <> new.id and z.st not in ('rejected')
       and public.v224_norm(z.data->'reg'->>'title') = t) then
    raise exception 'عنوان المشروع مسجَّل من قبل؛ اختر عنواناً آخر / This project title is already registered';
  end if;
  if te <> '' and exists(select 1 from public.ft_rec z where z.kind='gp' and z.id <> new.id and z.st not in ('rejected')
       and trim(regexp_replace(lower(regexp_replace(coalesce(z.data->'reg'->>'titleEn',''),'[^A-Za-z0-9]+',' ','g')),'\s+',' ','g')) = te) then
    raise exception 'العنوان الإنجليزي مسجَّل من قبل / This English title is already registered';
  end if;
  return new;
end $$;
drop trigger if exists ft_gp_title_guard on public.ft_rec;
create trigger ft_gp_title_guard before insert or update on public.ft_rec for each row execute function public.ft_gp_title_guard();

create or replace function public.ft_defs() returns jsonb
language sql immutable set search_path to 'public' as $f$
 select public.ft_defs_base() || $j${
  "tr_suspend":{"k":"tr","r":["tc"],"f":["approved","letter","accepted","started","running"],"to":["suspended"],"op":"set","p":"susp","why":1,
     "nn":["أُوقف التدريب الميداني مؤقتاً","Field training suspended"]},
  "tr_resume":{"k":"tr","r":["tc"],"f":["suspended"],"to":["running"],"op":"merge","p":"susp","why":1,
     "nn":["استُؤنف التدريب الميداني","Field training resumed"]},
  "tr_fail":{"k":"tr","r":["tc"],"f":["started","running","done","evaluated","suspended"],"to":["failed"],"op":"set","p":"fail","why":1,
     "nn":["قُرِّر عدم اجتياز التدريب الميداني","Field training marked as not passed"]},
  "ent_rate":{"k":"tr","r":["stu"],"f":["done","evaluated"],"op":"set","p":"rate",
     "nn":["سجّل المتدرب تقييمه لجهة التدريب","The trainee rated the training organization"]},
  "gp_redo":{"k":"gp","r":["pc"],"f":["discussed","revisions"],"to":["inprogress"],"op":"set","p":"redo","why":1,
     "nn":["قررت اللجنة إعادة المشروع واستكماله ثم مناقشته من جديد","The committee decided the project must be redone and defended again"]}
 }$j$::jsonb
$f$;

create or replace function public.ft_remind() returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare c jsonb := public.ft_c(); dl jsonb := coalesce(c->'dead','{}'::jsonb); r public.ft_rec; k text; d date; n int := 0; v_ar text; v_en text; tod date := (now() at time zone 'Asia/Dhaka')::date;
  STG jsonb := '{"plan":["خطة المشروع","Project plan"],"ch":["الفصول","Chapters"],"draft":["المسودة الكاملة","Full draft"],"final":["النسخة النهائية","Final version"]}';
  last date; gap int := coalesce((c->>'gapDays')::int,5);
begin
  if coalesce(auth.role(),'') not in ('service_role','') and not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  for r in select * from public.ft_rec where kind='gp' and st in ('assigned','plan_ok','inprogress','draft_final') loop
    for k in select jsonb_object_keys(dl) loop
      if not (STG ? k) or coalesce(dl->>k,'') !~ '^\d{4}-\d{2}-\d{2}$' then continue; end if;
      d := (dl->>k)::date;
      if exists(select 1 from jsonb_array_elements(coalesce(r.data->'subs','[]'::jsonb)) x where x->>'stage' = k) then continue; end if;
      v_ar := null;
      if d - tod in (3,1) then v_ar := 'تذكير: موعد تسليم «'||(STG->k->>0)||'» بعد '||(d - tod)||' يوم ('||d||')'; v_en := 'Reminder: “'||(STG->k->>1)||'” is due in '||(d - tod)||' day(s) ('||d||')';
      elsif tod > d then v_ar := 'تأخر تسليم «'||(STG->k->>0)||'» عن موعده ('||d||')'; v_en := '“'||(STG->k->>1)||'” is overdue (due '||d||')'; end if;
      if v_ar is not null and not exists(select 1 from public.ft_note z where z.rec_id = r.id and z.ar like v_ar||'%') then
        perform public.ft_notify(r, v_ar, v_en, false); n := n + 1; end if;
    end loop;
  end loop;
  for r in select q.* from public.ft_rec q where q.kind='gp' and q.st = 'revisions' and coalesce(q.data->'m9'->>'date','') ~ '^\d{4}-\d{2}-\d{2}' loop
    d := (left(r.data->'m9'->>'date',10))::date + coalesce(nullif(r.data->'m9'->>'days','')::int, 14);
    if tod > d and not exists(select 1 from public.ft_note z where z.rec_id = r.id and z.ar like 'تأخر تسليم النسخة المعدلة%') then
      perform public.ft_notify(r, 'تأخر تسليم النسخة المعدلة بعد المناقشة (المهلة '||d||')', 'The revised version after the defence is overdue (deadline '||d||')', false); n := n + 1; end if;
  end loop;
  for r in select * from public.ft_rec where kind='tr' and st in ('started','running') loop
    select max((x->>'date')::date) into last from jsonb_array_elements(coalesce(r.data->'log','[]'::jsonb)) x where (x->>'date') ~ '^\d{4}-\d{2}-\d{2}';
    last := coalesce(last, nullif(left(r.data->'start'->>'date',10),'')::date);
    if last is not null and tod - last > gap and not exists(select 1 from public.ft_note z where z.rec_id = r.id and z.ar like 'انقطع تدوين السجل اليومي%' and z.at > now() - interval '7 days') then
      perform public.ft_notify(r, 'انقطع تدوين السجل اليومي منذ '||(tod - last)||' يوماً', 'The daily log has not been updated for '||(tod - last)||' days', false); n := n + 1; end if;
  end loop;
  return jsonb_build_object('ok', true, 'notes', n);
end $$;
revoke all on function public.ft_remind() from public, anon, authenticated;

do $$ begin
  if exists(select 1 from cron.job where jobname = 'ft_remind_daily') then perform cron.unschedule('ft_remind_daily'); end if;
  perform cron.schedule('ft_remind_daily', '15 3 * * *', 'select public.ft_remind()');
end $$;
