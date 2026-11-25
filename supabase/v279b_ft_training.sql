-- v279b — المرحلة الثانية (التدريب الميداني): إيقاف/استئناف/عدم اجتياز بسبب إلزامي، وتقييم الطالب للجهة،
-- وإشعارات داخل البوابة فقط للإجراءات الجديدة (لا بريد قبل اعتماد نماذجه). لا بيانات شخصية.
do $$ begin
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='ft_defs_base') then
    alter function public.ft_defs() rename to ft_defs_base;
  end if;
end $$;

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
     "nn":["سجّل المتدرب تقييمه لجهة التدريب","The trainee rated the training organization"]}
 }$j$::jsonb
$f$;

do $$ declare d text := pg_get_functiondef('public.ft_act(text,text,jsonb)'::regprocedure); n text;
begin
  if position('v279why' in d) > 0 then return; end if;
  n := replace(d, $x$if d is null then raise exception 'unknown action'; end if;$x$,
    $x$if d is null then raise exception 'unknown action'; end if;
  -- v279why: سبب إلزامي لإجراءات الإيقاف والاستئناف وعدم الاجتياز
  if d ? 'why' and length(trim(coalesce(p->>'why',''))) < 5 then raise exception 'السبب إلزامي (5 أحرف على الأقل)'; end if;$x$);
  n := replace(n, $x$if d ? 'n' then perform public.ft_notify(r,$x$,
    $x$if d ? 'nn' then perform public.ft_notify(r, (d->'nn'->>0) || coalesce(' — '||nullif(r.data->'s'->>'ar',''),''), (d->'nn'->>1), false); end if;
  if d ? 'n' then perform public.ft_notify(r,$x$);
  if n = d or position('v279why' in n) = 0 or position($x$d ? 'nn'$x$ in n) = 0 then raise exception 'patch failed'; end if;
  execute n;
end $$;
