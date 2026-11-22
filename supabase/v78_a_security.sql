-- v78 (أ) إصلاحات الأمان
-- 1) دالة مشغّل الأحداث لا تُستدعى من الواجهة
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- 2) جدول قديم فارغ لا يستخدمه الموقع
-- معلّق بانتظار موافقة الإدارة (حذف نهائي لجدول قديم فارغ):
-- drop table if exists public."Registrations";

-- 3) التسجيل العام: يقبل طلباً جديداً بصيغة صحيحة فقط (لا حالة مزيفة ولا حقول إدارية)
drop policy if exists "anyone can register" on public.requests;
create policy "public can register" on public.requests
  for insert to anon, authenticated
  with check (
    id ~ '^REQ-[A-Z0-9]{6,16}$'
    and data->>'id' = id
    and coalesce(data->>'status','') = 'قيد المراجعة'
    and octet_length(data::text) < 60000
    and not (data ?| array['sid','pl','app77','rv64','admRes','admNote','rank','docs70','placementScore'])
  );

-- حد للإغراق: 300 طلب في الساعة لغير الإدارة
create or replace function public.v78_requests_flood() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() and (select count(*) from public.requests where created_at > now() - interval '1 hour') >= 300 then
    raise exception 'busy';
  end if;
  return new;
end $$;
revoke execute on function public.v78_requests_flood() from public, anon, authenticated;
drop trigger if exists v78_requests_flood on public.requests;
create trigger v78_requests_flood before insert on public.requests for each row execute function public.v78_requests_flood();

-- 4) (معلّق) تحسين أداء سياسة profiles: إعادة كتابتها بـ (select auth.uid())

create or replace function public.v78_now() returns text language sql stable set search_path = public as
$$ select to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') $$;
