-- v286 — لكل رسالة خطوتها التالية وتنبيهها الخاص بحسب غرضها (بدل السطر الموحد)، وتنبيه مختلف للمشرف عن الطالب.
create or replace function public.ft_mail_note(p_ar text, p_staff boolean) returns jsonb
language plpgsql immutable set search_path to 'public' as $$
declare M jsonb := $j$[
 ["قُدِّم طلب الالتحاق","تابع حالة طلبك من ملف التدريب؛ يصلك القرار وسببه في البوابة.","Follow your application from the training file; the decision and its reason reach you in the portal.","لا تقدّم طلباً مكرراً، ولا تباشر أي جهة قبل صدور خطاب التوجيه.","Do not submit a duplicate application or start at any organization before the referral letter is issued."],
 ["صدر قرار القسم في طلب التدريب","اطّلع على القرار وسببه في ملفك؛ وإن أُعيد الطلب للتعديل فعدّله وأرسله من جديد.","See the decision and its reason in your file; if returned, edit and resubmit.","الطلب المعاد لا يُنظر فيه حتى يُرسل من جديد.","A returned application is not reviewed until it is resubmitted."],
 ["صدر خطاب توجيه","نزّل خطاب التوجيه من «وثائق التدريب» وسلّمه لجهة التدريب.","Download the referral letter from “Training documents” and hand it to the organization.","الخطاب برقم ورمز QR، وتستطيع الجهة التحقق منه؛ لا تعدّل فيه شيئاً.","The letter carries a number and QR code the organization can verify; do not alter it."],
 ["سُجّلت إفادة الجهة","أرسل إشعار المباشرة (ت-4) في يوم بدئك الفعلي، ثم أعدّ خطة التدريب (ت-5).","Send the start notice (T-4) on your actual first day, then prepare the training plan (T-5).","لا تُحتسب الساعات قبل المصادقة على المباشرة.","Hours do not count before the start is confirmed."],
 ["أكّد المتدرب مباشرة","تنتظر المباشرة مصادقة المشرف الميداني.","The start awaits the field supervisor’s confirmation.","يبدأ احتساب الساعات من تاريخ المصادقة.","Hours count from the date of confirmation."],
 ["صودق على مباشرة التدريب","ابدأ تدوين سجلك اليومي (ت-6) من اليوم الأول.","Start your daily log (T-6) from the first day.","اليوم غير المدوَّن في مهلته لا يُحتسب، والمتأخر يُعلَّم «متأخراً».","A day not logged in time does not count; late entries are marked late."],
 ["اعتمد مشرف المعهد خطة التدريب","التزم بالأهداف والمهام الأسبوعية المعتمدة.","Follow the approved weekly goals and tasks.","أي تعديل في الخطة يحتاج اعتماداً جديداً من المشرف.","Any change to the plan needs new approval."],
 ["كُلّفت بمهمة جديدة","اطّلع على المهمة وموعدها في ملفك، وسجّل إنجازها عند الانتهاء.","See the task and its due date in your file and record it when done.","المهام المتأخرة تُذكر في تقويم المشرف.","Late tasks are noted in the supervisor’s evaluation."],
 ["حُدّد موعد عرض تجربة التدريب","جهّز عرضاً مختصراً لتجربتك واحضر في الموعد.","Prepare a short presentation of your experience and attend on time.","العرض جزء من درجة ملف التدريب (ت-11).","The presentation is part of the training-file grade (T-11)."],
 ["اكتمل التدريب","سلّم التقرير الختامي (ت-10) والتقويم الذاتي (ت-9) وقيّم جهة التدريب إن لم تفعل.","Submit the final report (T-10), the self-evaluation (T-9) and rate the organization if you have not.","لا يُغلق الملف ولا تُرصد الدرجة قبل اكتمال التقويمات.","The file is not closed and the grade not posted until evaluations are complete."],
 ["رُصد تقويم","سُجّل التقويم في ملفك.","The evaluation is recorded in your file.","لا تظهر أي درجة قبل نشر نتائج الفصل وتأكيد الرسوم أو تطبيق المنحة.","No grade appears before semester results are published and fees confirmed or a scholarship applied."],
 ["وافق المتدرب على التعهد","فُعّل تكليفك داخل المعهد؛ تابع مهامك في ملفك.","Your internal assignment is active; follow your tasks in the file.","التعهد ملزم طوال مدة التكليف.","The pledge is binding for the whole assignment."],
 ["أُوقف التدريب","اطّلع على سبب الإيقاف في ملفك، وراجع وحدة التدريب لمعرفة شروط الاستئناف.","See the reason in your file and contact the Training Unit about resuming.","لا تُحتسب أي ساعات أثناء الإيقاف.","No hours count during the suspension."],
 ["استُؤنف التدريب","واصل تدوين سجلك اليومي من اليوم.","Continue your daily log from today.","تُحتسب الساعات من تاريخ الاستئناف.","Hours count from the date of resumption."],
 ["قُرِّر عدم اجتياز","اطّلع على السبب في ملفك، وراجع وحدة التدريب بشأن إعادة التدريب.","See the reason in your file and contact the Training Unit about repeating the training.","القرار مسجَّل بسببه ويمكن طلب مراجعته عبر وحدة التدريب.","The decision is recorded with its reason; a review can be requested through the Training Unit."],
 ["سجّل المتدرب تقييمه","اطّلع على التقييم في ملف التدريب.","See the rating in the training file.","تُستعمل تقييمات المتدربين في اختيار جهات التدريب مستقبلاً.","Trainee ratings inform future choices of organizations."],
 ["مقترح مشروع","تابع مراجعة المقترح في ملف المشروع؛ يصلك القرار وتعيين المشرف في البوابة.","Follow the review in the project file; the decision and supervisor reach you in the portal.","العناوين المسجَّلة من قبل لا تُقبل، ولا يبدأ العمل قبل اعتماد المقترح.","Previously registered titles are not accepted, and work starts only after approval."],
 ["مقترح المشروع","تابع مراجعة المقترح في ملف المشروع؛ يصلك القرار وتعيين المشرف في البوابة.","Follow the review in the project file; the decision and supervisor reach you in the portal.","العناوين المسجَّلة من قبل لا تُقبل، ولا يبدأ العمل قبل اعتماد المقترح.","Previously registered titles are not accepted, and work starts only after approval."],
 ["اعتمد المشرف خطة المشروع","ابدأ العمل وفق الخطة، وسلّم كل مرحلة في موعدها.","Start working to the plan and submit each stage on time.","تصلك تذكيرات قبل كل موعد بثلاثة أيام، ويُسجَّل التأخر في ملفك.","Reminders arrive three days before each deadline; delays are recorded in your file."],
 ["سُجّل محضر لقاء إشرافي","راجع ملاحظات المشرف في المحضر (م-4).","Review the supervisor’s notes in the minutes (G-4).","نفّذ الملاحظات قبل اللقاء القادم؛ تُحتسب المتابعة في الدرجة.","Act on the notes before the next meeting; follow-up counts toward the grade."],
 ["اكتملت المسودة النهائية","ينتظر المشروع طلب الإذن بالمناقشة من المشرف (م-6).","The project awaits the supervisor’s defence request (G-6).","لا تُحدَّد المناقشة قبل الإذن واكتمال المتطلبات.","No defence is scheduled before approval and complete requirements."],
 ["طلب المشرف إجازة المشروع للمناقشة","جهّز عرض المناقشة؛ سيصلك موعدها ومكانها ولجنتها.","Prepare your defence presentation; its date, place and committee will reach you.","احضر قبل الموعد بوقت كافٍ ومعك النسخة النهائية.","Arrive early with the final version."],
 ["سلّم الطالب النسخة المعدلة","يراجع المشرف التعديلات قبل الاعتماد النهائي.","The supervisor reviews the revisions before final approval.","تُعتمد النسخة النهائية بعد التحقق من كل تعديلات اللجنة.","The final version is approved once all committee revisions are verified."],
 ["اعتمد المشرف المشروع نهائياً","أودِع النسخة النهائية المعتمدة في أرشيف المعهد، ونزّل إفادة إنجاز المشروع (م-10).","Deposit the approved final version in the Institute archive and download the completion statement (G-10).","تُرصد الدرجة آلياً ولا تظهر قبل نشر نتائج الفصل وتأكيد الرسوم.","The grade is posted automatically and appears only after results are published and fees confirmed."],
 ["قررت اللجنة إعادة المشروع","اطّلع على سبب القرار في ملفك، واتفق مع مشرفك على خطة الاستكمال.","See the reason in your file and agree a completion plan with your supervisor.","يُناقش المشروع من جديد بعد استكماله واعتماده.","The project is defended again once completed and approved."],
 ["قُدّم طلب جديد","يُبتّ في الطلب ويصلك القرار في البوابة.","The request will be decided and the decision will reach you in the portal.","لا تتصرف بناءً على الطلب قبل صدور القرار.","Do not act on the request before the decision."],
 ["رُدّ على تسليم الطالب","اطّلع على الرد في ملفك؛ وإن أُعيد التسليم للتعديل فسلّم من جديد.","See the response in your file; if returned, submit again.","التسليم المعاد لا يُحتسب حتى يُسلَّم من جديد.","A returned submission does not count until resubmitted."],
 ["أكّد الطالب تسليماً","سيُراجَع التسليم ويُرد عليه في البوابة.","The submission will be reviewed and answered in the portal.","احتفظ برابط ملفك في Google Drive مفتوحاً للمراجعين.","Keep your Google Drive link open to reviewers."],
 ["حُدّد موعد المقابلة","احضر المقابلة أو الدرس التجريبي في الموعد.","Attend the interview or trial lesson on time.","الغياب دون عذر يُعد انسحاباً من الترشح.","Absence without excuse counts as withdrawal."],
 ["صدر قرار في الجهة المقترحة","اطّلع على القرار في البوابة.","See the decision in the portal.","لا يجوز التدريب إلا في جهة معتمدة.","Training is allowed only at an approved organization."],
 ["اعتمد رئيس القسم التوصية","وافق من البوابة إن رغبت في إدراجك في سجل المرشحين للتعاون.","Consent in the portal if you wish to be listed for cooperation.","لا تُدرج بياناتك إلا بموافقتك.","Your details are listed only with your consent."],
 ["وافق الخريج","أُدرجت في سجل المرشحين للتعاون.","You are listed for cooperation.","يمكنك سحب موافقتك في أي وقت من البوابة.","You can withdraw your consent at any time in the portal."],
 ["تذكير: موعد تسليم","سلّم المرحلة قبل موعدها من ملف المشروع.","Submit the stage before its deadline from the project file.","التأخر يُسجَّل في ملفك ويُبلَّغ به مشرفك.","Delays are recorded in your file and reported to your supervisor."],
 ["تأخر تسليم النسخة المعدلة","سلّم النسخة المعدلة فوراً، أو راجع مشرفك بشأن المهلة.","Submit the revised version now, or contact your supervisor about the deadline.","تجاوز المهلة قد يؤخر اعتماد المشروع والتخرج.","Missing the deadline may delay project approval and graduation."],
 ["تأخر تسليم","سلّم المرحلة المتأخرة في أقرب وقت، أو راجع مشرفك.","Submit the overdue stage as soon as possible, or contact your supervisor.","التأخر مسجَّل في ملفك وقد يؤثر في درجة المتابعة.","The delay is recorded and may affect the follow-up grade."],
 ["انقطع تدوين السجل اليومي","دوّن الأيام الفائتة الآن من «السجل اليومي والحضور».","Log the missed days now under “Daily log & attendance”.","الأيام التي تتجاوز مهلة التدوين تُعلَّم «متأخرة» وقد لا تُحتسب.","Days past the logging window are marked late and may not count."]
]$j$; e jsonb;
begin
  for e in select x from jsonb_array_elements(M) x loop
    if position(e->>0 in coalesce(p_ar,'')) > 0 then
      if p_staff then
        return jsonb_build_object('nextAr', 'الإجراء المطلوب منكم — إن وُجد — يظهر في «بانتظار قرارك» في بوابة الخريجين.', 'nextEn', 'Any action required from you appears under “Awaiting your action” in the Graduates Portal.',
          'noteAr', 'وصلتكم هذه الرسالة بصفتكم مشرفاً أو عضو لجنة في هذا الملف. '||(e->>3), 'noteEn', 'You received this as a supervisor or committee member on this file. '||(e->>4));
      end if;
      return jsonb_build_object('nextAr', e->>1, 'nextEn', e->>2, 'noteAr', e->>3, 'noteEn', e->>4);
    end if;
  end loop;
  return jsonb_build_object('nextAr', 'تابع التفاصيل من الملف في بوابة الخريجين.', 'nextEn', 'Follow the details from the file in the Graduates Portal.', 'noteAr', 'هذه رسالة آلية بشأن ملفك في بوابة الخريجين.', 'noteEn', 'This is an automated message about your file in the Graduates Portal.');
end $$;

create or replace function public.ft_dear(p_ref text) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare s jsonb; f jsonb; fem boolean;
begin
  select data into s from public.students where id = p_ref;
  if s is not null then fem := coalesce(s->>'sex', s->>'gender','') ~* '^(أنثى|انثى|female|f)$';
    return jsonb_build_object('ar', case when fem then 'عزيزتي الطالبة ' else 'عزيزي الطالب ' end || coalesce(s->>'name',''), 'en', 'Dear ' || coalesce(nullif(s->>'nameEn',''), 'Student'), 'em', s->>'email'); end if;
  select data into f from public.faculty where id = p_ref;
  if f is not null then return jsonb_build_object('ar', 'الأستاذ الفاضل ' || coalesce(f->>'name',''), 'en', 'Dear ' || coalesce(nullif(f->>'nameEn',''), 'Colleague'), 'em', f->>'email', 'staff', true); end if;
  return null;
end $$;
revoke all on function public.ft_dear(text) from public, anon, authenticated;

create or replace function public.ft_mail_tpl(r public.ft_rec, ar text, en text, dear jsonb, p_kind text default 'act') returns jsonb
language sql stable security definer set search_path to 'public' as $$
  with n as (select public.ft_mail_note(ar, coalesce((dear->>'staff')::boolean,false)) j)
  select jsonb_build_object(
    'subject', left(ar,110)||' — '||'معهد التمهيد / '||left(coalesce(en,''),90),
    'titleAr', left(ar,140), 'titleEn', left(coalesce(en,''),140),
    'dearAr', dear->>'ar', 'dearEn', dear->>'en',
    'ar', ar||E'\n'||'رقم الملف: '||r.id||E'\n'||(n.j->>'nextAr'),
    'en', coalesce(en,'')||E'\n'||'File number: '||r.id||E'\n'||(n.j->>'nextEn'),
    'url', 'https://attamhid.com/#/graduates/r/'||r.id, 'btnAr', case when r.kind='gp' then 'فتح ملف المشروع' else 'فتح ملف التدريب' end, 'btnEn', case when r.kind='gp' then 'Open the project file' else 'Open the training file' end,
    'noteAr', 'تنبيه: '||(n.j->>'noteAr'), 'noteEn', 'Note: '||(n.j->>'noteEn'),
    'fromAr', public.ft_unit(r.kind)->>0, 'fromEn', public.ft_unit(r.kind)->>1)
  from n
$$;
revoke all on function public.ft_mail_tpl(public.ft_rec,text,text,jsonb,text) from public, anon, authenticated;
