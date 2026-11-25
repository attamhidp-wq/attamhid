-- v284 — المرحلة الرابعة (البريد): رسائل بوابة الخريجين بالقالب الرسمي الموحد للمعهد،
-- المرسل والتذييل باسم الجهة المختصة (لا اسم شخص)، التحية بالاسم العربي ثم الإنجليزي، زر يوصل إلى الملف نفسه،
-- وتنبيه خاص بكل رسالة. لا يُعمل بالقالب الجديد إلا بعد موافقة الإدارة (ft_cfg.mail279.ok)، وقبلها تُرسل النماذج إلى بريد المعهد فقط.
create or replace function public.ft_esc(t text) returns text language sql immutable set search_path to 'public' as $$
  select replace(replace(replace(replace(coalesce(t,''),'&','&amp;'),'<','&lt;'),'>','&gt;'),'"','&quot;') $$;

create or replace function public.ft_mail_render(t jsonb) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare inst jsonb := (select data from public.v51_settings where key='inst'); h jsonb := (select data from public.settings where key='home');
  nar text := coalesce(nullif(inst->>'nameAr',''),'معهد التمهيد'); nen text := coalesce(nullif(inst->>'nameEn',''),'At Tamhid Institute');
  NV text := '#14284B'; SV text := '#9AA6AE'; BG text := '#EEF1F5'; fa text := coalesce(nullif(t->>'fromAr',''),'الإدارة العامة'); fe text := coalesce(nullif(t->>'fromEn',''),'General Administration');
  pa text; pe text; btn text := ''; note text := ''; html text; txt text; contact text;
begin
  select string_agg('<p class="tx" dir="rtl" style="margin:0 0 12px;font-size:16px;line-height:1.7;text-align:right">'||public.ft_esc(x)||'</p>','') into pa from regexp_split_to_table(coalesce(t->>'ar',''), '\n+') x where trim(x) <> '';
  select string_agg('<p class="tx" dir="ltr" style="margin:0 0 12px;font-size:16px;line-height:1.7;text-align:left">'||public.ft_esc(x)||'</p>','') into pe from regexp_split_to_table(coalesce(t->>'en',''), '\n+') x where trim(x) <> '';
  if coalesce(t->>'url','') ~ '^https://attamhid\.com/' then
    btn := '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px"><tr><td align="center"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:'||NV||';border-radius:8px"><a href="'||public.ft_esc(t->>'url')||'" target="_blank" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700">'||public.ft_esc(coalesce(t->>'btnAr','فتح في البوابة'))||' / '||public.ft_esc(coalesce(t->>'btnEn','Open in the portal'))||'</a></td></tr></table></td></tr></table>';
  end if;
  if coalesce(t->>'noteAr','') <> '' then note := '<p class="tx mu" dir="rtl" style="margin:0 0 4px;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:right">'||public.ft_esc(t->>'noteAr')||'</p><p class="tx mu" dir="ltr" style="margin:0;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:left">'||public.ft_esc(coalesce(t->>'noteEn',''))||'</p>'; end if;
  contact := concat_ws(' · ', nullif(inst->>'addrAr',''), nullif(h->>'p1',''), nullif(h->>'p2',''), nullif(h->>'em',''));
  html := '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>'||public.ft_esc(t->>'subject')||'</title><style>@media (max-width:620px){.wrap{width:100%!important}.pad{padding:18px 16px!important}}@media (prefers-color-scheme:dark){.bg{background:#0B1322!important}.card{background:#141F33!important}.tx{color:#E6EBF2!important}.mu{color:#B9C3D0!important}.ft{background:#0F1828!important}}</style></head>'||
    '<body style="margin:0;padding:0;background:'||BG||'" class="bg"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:'||BG||'" class="bg"><tr><td align="center" style="padding:20px 8px">'||
    '<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;border-collapse:collapse;font-family:Tahoma,Arial,''Segoe UI'',sans-serif;color:#16202E">'||
    '<tr><td style="background:'||NV||';padding:18px 22px;border-radius:10px 10px 0 0;border-bottom:3px solid '||SV||'"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="110" valign="middle"><img src="cid:logo64" alt="شعار معهد التمهيد / At Tamhid Institute logo" width="96" style="display:block;width:96px;height:auto;background:#fff;border-radius:6px;padding:4px"></td>'||
    '<td valign="middle" style="color:#fff;text-align:right" dir="rtl"><div style="font-size:17px;font-weight:700;line-height:1.5">'||public.ft_esc(nar)||'</div><div dir="ltr" style="font-size:13px;line-height:1.5;color:#D7DDE6;text-align:right">'||public.ft_esc(nen)||'</div></td></tr></table></td></tr>'||
    '<tr><td class="card pad" style="background:#ffffff;padding:26px 28px">'||
    '<h1 class="tx" style="margin:0 0 4px;font-size:23px;line-height:1.4;color:'||NV||';text-align:right" dir="rtl">'||public.ft_esc(t->>'titleAr')||'</h1><div class="tx" dir="ltr" style="font-size:18px;line-height:1.4;color:'||NV||';text-align:left;margin:0 0 18px;font-weight:700">'||public.ft_esc(t->>'titleEn')||'</div>'||
    '<p class="tx" dir="rtl" style="margin:0 0 12px;font-size:16px;font-weight:700;text-align:right">'||public.ft_esc(t->>'dearAr')||'،</p>'||coalesce(pa,'')||btn||
    '<hr style="border:none;border-top:1px solid #D5DCE4;margin:16px 0">'||
    '<p class="tx" dir="ltr" style="margin:0 0 12px;font-size:16px;font-weight:700;text-align:left">'||public.ft_esc(t->>'dearEn')||',</p>'||coalesce(pe,'')||
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;border-top:2px solid #8A97A8"><tr><td dir="rtl" class="tx" style="text-align:right;padding-top:12px"><div style="font-size:15px;font-weight:700;line-height:1.5">'||public.ft_esc(fa)||'</div><div class="mu" style="font-size:13.5px;line-height:1.5;color:#4a5a70">'||public.ft_esc(nar)||'</div></td></tr><tr><td dir="ltr" class="tx" style="text-align:left;padding-top:8px"><div style="font-size:15px;font-weight:700;line-height:1.5">'||public.ft_esc(fe)||'</div><div class="mu" style="font-size:13.5px;line-height:1.5;color:#4a5a70">'||public.ft_esc(nen)||'</div></td></tr></table>'||
    '</td></tr><tr><td class="ft" style="background:#F6F8FA;padding:16px 22px;border-radius:0 0 10px 10px;border-top:1px solid #E1E6EC">'||note||
    '<p class="tx mu" dir="rtl" style="margin:8px 0 0;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:right">هذه رسالة آلية من معهد التمهيد، فلا تردّ عليها.</p><p class="tx mu" dir="ltr" style="margin:0;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:left">This is an automated message from At Tamhid Institute; please do not reply.</p>'||
    case when contact <> '' then '<p class="mu" style="margin:10px 0 0;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:center">'||public.ft_esc(contact)||'</p>' else '' end ||
    '</td></tr></table></td></tr></table></body></html>';
  txt := concat_ws(E'\n', (t->>'titleAr')||' / '||(t->>'titleEn'), '', (t->>'dearAr')||'،', t->>'ar', case when btn<>'' then coalesce(t->>'btnAr','فتح في البوابة')||': '||(t->>'url') end, '', '------------------------------', (t->>'dearEn')||',', t->>'en', case when btn<>'' then coalesce(t->>'btnEn','Open in the portal')||': '||(t->>'url') end, '', fa||' — '||nar, fe||' — '||nen, '', t->>'noteAr', t->>'noteEn');
  return jsonb_build_object('html', html, 'text', txt);
end $$;
revoke all on function public.ft_mail_render(jsonb) from public, anon, authenticated;

create or replace function public.ft_mail_queue(p_to text, t jsonb, p_type text, p_ref text) returns boolean
language plpgsql security definer set search_path to 'public' as $$
declare m jsonb := public.ft_mail_render(t); lg text; att jsonb := '[]'::jsonb;
begin
  if coalesce(p_to,'') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return false; end if;
  if exists(select 1 from public.v63_mail_log where to_addr = p_to and type = p_type and ref_id = p_ref and subject = left(t->>'subject',300) and at > now() - interval '30 minutes') then return false; end if;
  select case when jsonb_typeof(data)='string' then data#>>'{}' else data->>'png' end into lg from public.v51_settings where key='mailLogo108';
  if lg ~ '^[A-Za-z0-9+/=]{100,}$' then att := jsonb_build_array(jsonb_build_object('filename','logo.png','content',lg,'content_type','image/png','content_id','logo64')); end if;
  insert into public.v63_mail_log(type, ref_id, to_addr, subject, status, error, attempts, payload)
  values (p_type, p_ref, p_to, left(t->>'subject',300), 'failed', 'queued', 0,
    jsonb_build_object('to',p_to,'subject',left(t->>'subject',300),'html',m->>'html','text',m->>'text','from_name',coalesce(nullif(t->>'fromEn',''),'General Administration')||' — At Tamhid Institute','attachments',att));
  return true;
end $$;
revoke all on function public.ft_mail_queue(text,jsonb,text,text) from public, anon, authenticated;

-- الجهة المرسلة بحسب نوع الملف
create or replace function public.ft_unit(p_kind text) returns jsonb language sql immutable set search_path to 'public' as $$
  select case when p_kind in ('tr','ent','opp','app','rec') then '["وحدة التدريب الميداني","Field Training Unit"]'::jsonb
              when p_kind = 'gp' then '["وحدة مشاريع التخرج","Graduation Projects Unit"]'::jsonb
              else '["الإدارة العامة","General Administration"]'::jsonb end $$;

-- التحية بالاسم: العربية بالاسم العربي، والإنجليزية بالاسم الإنجليزي المحفوظ
create or replace function public.ft_dear(p_ref text) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare s jsonb; f jsonb; fem boolean;
begin
  select data into s from public.students where id = p_ref;
  if s is not null then fem := coalesce(s->>'sex', s->>'gender','') ~* '^(أنثى|انثى|female|f)$';
    return jsonb_build_object('ar', case when fem then 'عزيزتي الطالبة ' else 'عزيزي الطالب ' end || coalesce(s->>'name',''), 'en', 'Dear ' || coalesce(nullif(s->>'nameEn',''), 'Student'), 'em', s->>'email'); end if;
  select data into f from public.faculty where id = p_ref;
  if f is not null then return jsonb_build_object('ar', 'الأستاذ الفاضل ' || coalesce(f->>'name',''), 'en', 'Dear ' || coalesce(nullif(f->>'nameEn',''), 'Colleague'), 'em', f->>'email'); end if;
  return null;
end $$;
revoke all on function public.ft_dear(text) from public, anon, authenticated;

-- نص الرسالة الموحد لإشعارات الملفات
create or replace function public.ft_mail_tpl(r public.ft_rec, ar text, en text, dear jsonb, p_kind text default 'act') returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object(
    'subject', left(ar,110)||' — '||'معهد التمهيد / '||left(coalesce(en,''),90),
    'titleAr', left(ar,140), 'titleEn', left(coalesce(en,''),140),
    'dearAr', dear->>'ar', 'dearEn', dear->>'en',
    'ar', ar||E'\n'||'رقم الملف: '||r.id||E'\n'||case when p_kind='remind' then 'يُرجى المتابعة في الموعد حتى لا يتأخر ملفك.' else 'يمكنكم الاطلاع على التفاصيل ومتابعة الإجراء التالي من الملف في بوابة الخريجين.' end,
    'en', coalesce(en,'')||E'\n'||'File number: '||r.id||E'\n'||case when p_kind='remind' then 'Please follow up on time so that your file is not delayed.' else 'You can view the details and follow up on the next step from the file in the Graduates Portal.' end,
    'url', 'https://attamhid.com/#/graduates/r/'||r.id, 'btnAr', 'فتح الملف في البوابة', 'btnEn', 'Open the file in the portal',
    'noteAr', case when p_kind='remind' then 'تنبيه: هذه رسالة تذكير آلية بموعد أو تأخر في ملفك.' else 'تنبيه: وصلتكم هذه الرسالة لأنكم طرف في هذا الملف (الطالب أو المشرف أو اللجنة).' end,
    'noteEn', case when p_kind='remind' then 'Note: this is an automated reminder about a deadline or delay in your file.' else 'Note: you received this message because you are a party to this file (student, supervisor or committee).' end,
    'fromAr', public.ft_unit(r.kind)->>0, 'fromEn', public.ft_unit(r.kind)->>1)
$$;
revoke all on function public.ft_mail_tpl(public.ft_rec,text,text,jsonb,text) from public, anon, authenticated;

-- ft_notify: الإشعار داخل البوابة كما هو؛ والبريد بالقالب الرسمي بعد موافقة الإدارة، وإلا يبقى السلوك السابق
create or replace function public.ft_notify(r ft_rec, ar text, en text, p_mail boolean default true) returns void
language plpgsql security definer set search_path to 'public' as $function$
declare t text; em text; tos text[] := '{}'; dear jsonb; ok boolean := coalesce(public.ft_c()->'mail279'->>'ok','') = 'true';
begin
  tos := array_remove(array[r.sid, r.data->>'isup', r.data->>'usup', r.data->>'gsup'], null) || array(select jsonb_array_elements_text(coalesce(r.data->'cmt','[]'::jsonb)));
  foreach t in array (select array(select distinct x from unnest(tos) x where x <> coalesce(public.my_ref(),''))) loop
    insert into public.ft_note(to_ref, rec_id, ar, en) values (t, r.id, ar, en);
    if p_mail then
      if ok then dear := public.ft_dear(t);
        if dear is not null then perform public.ft_mail_queue(dear->>'em', public.ft_mail_tpl(r, ar, en, dear, case when ar like 'تذكير%' or ar like 'تأخر%' or ar like 'انقطع%' then 'remind' else 'act' end), 'ft279', r.id||':'||left(md5(ar),8)); end if;
      else em := public.ft_email(t);
        if em ~ '@' then perform public.v210_send(em, 'معهد التمهيد — '||left(ar,120)||' / At Tamhid Institute',
          '<div dir="rtl" style="font-family:Tahoma,Arial;font-size:15px;line-height:1.8"><p>السلام عليكم ورحمة الله وبركاته،</p><p>'||ar||'</p><p>يمكنكم الاطلاع والمتابعة من <a href="https://attamhid.com/#/graduates">بوابة الخريجين</a>.</p><p>مع التحية،<br>معهد التمهيد — قسم الدراسات اللغوية والترجمة</p></div><hr><div dir="ltr" style="font-family:Arial;font-size:14px"><p>'||en||'</p><p>Please follow up in the <a href="https://attamhid.com/#/graduates">Graduates Portal</a>.</p><p>Kind regards,<br>At Tamhid Institute — Department of Linguistic Studies and Translation</p></div>',
          ar||E'\n'||en, 'ft225', r.id||':'||left(md5(ar),8)); end if;
      end if;
    end if;
  end loop;
  insert into public.ft_note(to_ref, rec_id, ar, en) values ('staff', r.id, ar, en);
end $function$;

-- نماذج كل الرسائل إلى بريد المعهد وحده (الإدارة المركزية أو المهمة الآلية)
create or replace function public.ft_mail_samples() returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare to_ text := lower(trim((select data->>'em' from public.settings where key='home'))); r public.ft_rec; e record; n int := 0; t jsonb;
  stu jsonb := '{"ar":"عزيزي الطالب محمد عبد الله (نموذج)","en":"Dear Mohammad Abdullah (sample)"}'; fac jsonb := '{"ar":"الأستاذ الفاضل أحمد كريم (نموذج)","en":"Dear Ahmad Karim (sample)"}';
  P text := '[نموذج للمراجعة / Sample] ';
begin
  if coalesce(auth.role(),'') not in ('service_role','') and not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  if coalesce(to_,'') !~ '@' then return jsonb_build_object('error','no_inst_email'); end if;
  for e in select k, v->>'k' kind, coalesce(v->'n'->>0, v->'nn'->>0) ar, coalesce(v->'n'->>1, v->'nn'->>1) en from jsonb_each(public.ft_defs()) x(k,v) where (v ? 'n' or v ? 'nn') order by v->>'k', k loop
    r.id := case when e.kind='gp' then 'GP-SAMPLE' when e.kind='*' then 'TR-SAMPLE' else upper(e.kind)||'-SAMPLE' end; r.kind := case when e.kind='*' then 'tr' else e.kind end;
    t := public.ft_mail_tpl(r, e.ar||' — محمد عبد الله (نموذج)', e.en, stu, 'act'); t := t || jsonb_build_object('subject', P||(t->>'subject'));
    if public.ft_mail_queue(to_, t, 'sample', 'ft279:'||e.k) then n := n + 1; end if;
  end loop;
  r.id := 'GP-SAMPLE'; r.kind := 'gp';
  t := public.ft_mail_tpl(r, 'تأخر تسليم «الفصول» عن موعده (2026-12-01)', '“Chapters” is overdue (due 2026-12-01)', stu, 'remind'); t := t || jsonb_build_object('subject', P||(t->>'subject')); if public.ft_mail_queue(to_, t, 'sample', 'ft279:remind_late') then n := n + 1; end if;
  t := public.ft_mail_tpl(r, 'تذكير: موعد تسليم «المسودة الكاملة» بعد 3 يوم (2026-12-04)', 'Reminder: “Full draft” is due in 3 day(s) (2026-12-04)', stu, 'remind'); t := t || jsonb_build_object('subject', P||(t->>'subject')); if public.ft_mail_queue(to_, t, 'sample', 'ft279:remind_soon') then n := n + 1; end if;
  t := public.ft_mail_tpl(r, 'تأخر تسليم النسخة المعدلة بعد المناقشة (المهلة 2026-12-15)', 'The revised version after the defence is overdue (deadline 2026-12-15)', stu, 'remind'); t := t || jsonb_build_object('subject', P||(t->>'subject')); if public.ft_mail_queue(to_, t, 'sample', 'ft279:remind_rev') then n := n + 1; end if;
  t := public.ft_mail_tpl(r, 'سُجّل محضر لقاء إشرافي (م-4) — محمد عبد الله (نموذج)', 'A supervision meeting record (G-4) was added', fac, 'act'); t := t || jsonb_build_object('subject', P||'(إلى المشرف / to the supervisor) '||(t->>'subject')); if public.ft_mail_queue(to_, t, 'sample', 'ft279:to_sup') then n := n + 1; end if;
  r.id := 'TR-SAMPLE'; r.kind := 'tr';
  t := public.ft_mail_tpl(r, 'انقطع تدوين السجل اليومي منذ 6 يوماً', 'The daily log has not been updated for 6 days', stu, 'remind'); t := t || jsonb_build_object('subject', P||(t->>'subject')); if public.ft_mail_queue(to_, t, 'sample', 'ft279:remind_log') then n := n + 1; end if;
  t := jsonb_build_object('subject', P||'طلب إجراء بشأن متدرب — معهد التمهيد / Trainee action request', 'titleAr', 'طلب إجراء بشأن متدرب', 'titleEn', 'Trainee action request',
    'dearAr', 'حضرة المشرف الميداني الكريم (نموذج)', 'dearEn', 'Dear Field Supervisor (sample)',
    'ar', 'نشكركم على تعاونكم في تدريب الطالب محمد عبد الله (نموذج). نرجو التكرم بإتمام الإجراء المطلوب (تأكيد المباشرة، أو اعتماد أيام الحضور، أو التقويم) عبر الرابط الآمن الخاص بكم، ولا يحتاج إلى حساب.',
    'en', 'Thank you for training our student. Kindly complete the requested action (confirm the start, approve attendance days, or evaluate) through your secure personal link; no account is needed.',
    'url', 'https://attamhid.com/#/ft-org/SAMPLE', 'btnAr', 'فتح الرابط الآمن', 'btnEn', 'Open the secure link',
    'noteAr', 'تنبيه: هذا الرابط شخصي لكم وحدكم، وصالح مدة محدودة، ويمكن للمعهد إلغاؤه؛ فلا تشاركوه مع غيركم.', 'noteEn', 'Note: this link is personal to you, valid for a limited time and can be revoked by the Institute; do not share it.',
    'fromAr', 'وحدة التدريب الميداني', 'fromEn', 'Field Training Unit');
  if public.ft_mail_queue(to_, t, 'sample', 'ft279:tok') then n := n + 1; end if;
  return jsonb_build_object('ok', true, 'queued', n, 'to', 'institute');
end $$;
revoke all on function public.ft_mail_samples() from public, anon;
grant execute on function public.ft_mail_samples() to authenticated;

-- اعتماد الإدارة للقالب الجديد (أو إيقافه)
create or replace function public.ft_mail_approve(p_ok boolean) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.v51_is_central() then raise exception 'forbidden: central administration only' using errcode='42501'; end if;
  update public.ft_cfg set data = data || jsonb_build_object('mail279', jsonb_build_object('ok', p_ok, 'at', now(), 'by', coalesce(public.my_ref(),'admin'))), updated_at = now() where k='main';
  perform public.ft_log('cfg', 'mail279', jsonb_build_object('ok', p_ok));
  return jsonb_build_object('ok', true, 'mail279', p_ok);
end $$;
revoke all on function public.ft_mail_approve(boolean) from public, anon;
grant execute on function public.ft_mail_approve(boolean) to authenticated;

-- التذكير اليومي v283 يكتفي بمهلة التعديلات بعد المناقشة (المواعيد وانقطاع السجل في ft_alerts القائمة، منعاً للتكرار)
create or replace function public.ft_remind() returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare r public.ft_rec; d date; n int := 0; tod date := (now() at time zone 'Asia/Dhaka')::date;
begin
  if coalesce(auth.role(),'') not in ('service_role','') and not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  for r in select q.* from public.ft_rec q where q.kind='gp' and q.st = 'revisions' and coalesce(q.data->'m9'->>'date','') ~ '^\d{4}-\d{2}-\d{2}' loop
    d := (left(r.data->'m9'->>'date',10))::date + coalesce(nullif(r.data->'m9'->>'days','')::int, 14);
    if tod > d and not exists(select 1 from public.ft_note z where z.rec_id = r.id and z.ar like 'تأخر تسليم النسخة المعدلة%') then
      perform public.ft_notify(r, 'تأخر تسليم النسخة المعدلة بعد المناقشة (المهلة '||d||')', 'The revised version after the defence is overdue (deadline '||d||')', false); n := n + 1; end if;
  end loop;
  return jsonb_build_object('ok', true, 'notes', n);
end $$;
revoke all on function public.ft_remind() from public, anon, authenticated;
