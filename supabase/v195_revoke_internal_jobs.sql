-- v195 — مرجع لما طُبّق على الخادم (ترحيل v195_revoke_internal_jobs)
-- وظائف داخلية (مهام مجدولة/مشغّلات) لا يجوز أن يستدعيها الزوار أو المستخدمون عبر واجهة البرمجة
revoke execute on function public.v157_ig_tick() from public, anon, authenticated;
revoke execute on function public.v169_job_failing(text) from public, anon, authenticated;
revoke execute on function public.v175_errs_trim() from public, anon, authenticated;
revoke execute on function public.v162_ren from public, anon, authenticated;
alter function public.v162_ren set search_path = public;
