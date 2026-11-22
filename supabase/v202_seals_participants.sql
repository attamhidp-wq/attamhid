-- v202 — المشاركون (بوابة التدريب) يقرؤون الأختام لعرض شهاداتهم وتنزيلها كاملة (الزائر دون حساب لا يقرؤها)
create or replace function public.v202_is_participant() returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists (select 1 from public.v138_participants p where p.uid = auth.uid()) $$;
revoke all on function public.v202_is_participant() from public, anon;
grant execute on function public.v202_is_participant() to authenticated;
create policy v202_seals_participant_read on public.v51_seals for select to authenticated using ((select public.v202_is_participant()));
