-- v79 (ج) قواعد من متطلبات v77 الرسمية لم تكن مطبّقة على الخادم:
-- 1) قراءة عامة لإعدادات «واجهة الموقع الرسمية» (look77)
-- 2) أسئلة الاختبار لا تظهر إلا داخل نافذة موعده المفعّلة (date/end بتوقيت UTC+3)
-- النص الكامل لدالة v65_exam_paper طُبّق في Supabase (ترحيل v79_c_v77_rules)، وهو v78_b مع شرط النافذة.
create policy v77_look_pub_read on public.v51_settings for select to anon, authenticated using (key = 'look77');
