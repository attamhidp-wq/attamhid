-- v220: اعتماد الخطة الدراسية النهائية للدبلوم العام (خطة 2023: 33 مقرراً، 84 ساعة) بدل المسودة الأولية (31 مقرراً، 80 ساعة)
-- طُبّق في Supabase بتاريخ 2026-11-19 (الدالة المؤقتة v220_apply ثم حُذفت؛ الحراس أدناه دائمة):
-- * نسخة احتياطية كاملة قبل التغيير في v79_backups بنوع 'v220-pre-plan' (البرنامج، الطلاب، الاختبارات، الأسئلة، البنوك، المقررات المرآة، قائمة الوثائق، شهادات التخرج).
-- * programs/1000: courses = coursesAll = 33 مقرراً بمعرّفات P23-<الرمز>، hours = 84، الخطة «خطة 2023» بالاعتماد نفسه (القرار 01/1445 — 2023-07-19 — رئيس المعهد).
-- * v51_program_courses: حُذفت P26-* وتقاعدت معرّفاتها في v81_retired؛ تُنشأ P23-* آلياً عبر v112_mirror.
-- * students: صُفّرت كل الدرجات (gr = {})؛ الخريجون: reg = مقررات الخطة الـ33 و pend67 = 1 (بانتظار إدخال الدرجات)؛ المنتظمون: مقررات مستواهم.
-- * exams: اختبارات المقررات الـ16 المتطابقة رمزاً واسماً رُبطت بالمعرّف الجديد؛ حُذفت اختبارات المقررات الـ15 الأخرى وأسئلتها وبنوكها.
-- * v51_settings.queue: حُذفت السجلات الأكاديمية المنتظرة المبنية على الدرجات التجريبية.

-- الحراس الدائمة (كما طُبّقت في الترحيل v220_old_plan_guards)
create or replace function public.v220_programs_guard() returns trigger language plpgsql security definer set search_path=public as $$
begin
  -- نسخة متصفح قديمة تحمل مقررات المسودة الأولية (P26-) أو ساعاتها (80): يُتجاهل الحفظ ويبقى السجل الحالي
  if tg_op = 'UPDATE' and new.id = '1000' and (coalesce(new.data->'coursesAll','[]')::text like '%"P26-%' or coalesce(new.data->'courses','[]')::text like '%"P26-%'
     or coalesce(new.data->>'hours','') = '80') then
    return null;
  end if;
  return new;
end $$;
create trigger v220_programs_guard before insert or update on public.programs for each row execute function public.v220_programs_guard();

create or replace function public.v220_students_guard() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.data::text like '%P26-%' then
    if jsonb_typeof(new.data->'gr')='object' then
      new.data := jsonb_set(new.data,'{gr}',coalesce((select jsonb_object_agg(k,v) from jsonb_each(new.data->'gr') e(k,v) where k not like 'P26-%'),'{}'));
    end if;
    if jsonb_typeof(new.data->'reg')='array' then
      new.data := jsonb_set(new.data,'{reg}',coalesce((select jsonb_agg(r) from jsonb_array_elements(new.data->'reg') r where r#>>'{}' not like 'P26-%'),'[]'));
    end if;
  end if;
  return new;
end $$;
create trigger v220_students_guard before insert or update on public.students for each row execute function public.v220_students_guard();

create or replace function public.v220_exams_guard() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if coalesce(new.data->>'courseId','') like 'P26-%' then return null; end if;
  return new;
end $$;
create trigger v220_exams_guard before insert or update on public.exams for each row execute function public.v220_exams_guard();

create or replace function public.v220_banks_guard() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.code = any(array['1202','1302','2202','2301','2302','2401','3202','3301','3302','3303','4103','4301','4401','4402','4403']) and coalesce(new.data->>'src','') = 'v671' then return null; end if;
  return new;
end $$;
create trigger v220_banks_guard before insert or update on public.v65_banks for each row execute function public.v220_banks_guard();
