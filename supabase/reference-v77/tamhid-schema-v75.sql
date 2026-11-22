-- معهد التمهيد — v75: سجل الأرقام الصادرة (إضافة فقط) + قراءة إعدادات بوابة التسجيل للزوار
-- يُشغَّل مرة واحدة في محرر SQL في Supabase بعد أخذ نسخة احتياطية. آمن عند إعادة التشغيل.

-- 1) سجل الأرقام الصادرة: لا يُعدَّل ولا يُحذف منه شيء أبداً
create table if not exists public.v75_issued (
  num        text primary key,
  kind       text not null,
  holder     text,
  label      text,
  issued_at  timestamptz not null default now()
);
alter table public.v75_issued enable row level security;
revoke all on public.v75_issued from anon;
grant select, insert on public.v75_issued to authenticated;
revoke update, delete on public.v75_issued from authenticated;

drop policy if exists v75_issued_read on public.v75_issued;
create policy v75_issued_read on public.v75_issued for select using (public.v51_is_central());
drop policy if exists v75_issued_insert on public.v75_issued;
create policy v75_issued_insert on public.v75_issued for insert with check (public.v51_is_central());

-- منع التعديل والحذف على مستوى قاعدة البيانات نفسها (حتى لمن يملك صلاحيات أوسع عبر الواجهات)
create or replace function public.v75_issued_lock() returns trigger language plpgsql as $$
begin
  raise exception 'v75_issued is append-only: issued numbers can never be changed or removed';
end $$;
drop trigger if exists v75_issued_no_update on public.v75_issued;
create trigger v75_issued_no_update before update or delete on public.v75_issued
  for each row execute function public.v75_issued_lock();

-- 2) إعدادات بوابة التسجيل: يقرؤها الزوار، وتكتبها الإدارة المركزية
drop policy if exists v75_reg_pub_read on public.v51_settings;
create policy v75_reg_pub_read on public.v51_settings for select using (key = 'reg75');
drop policy if exists v75_reg_write on public.v51_settings;
create policy v75_reg_write on public.v51_settings for all
  using (key in ('reg75','issued75') and public.v51_is_central())
  with check (key in ('reg75','issued75') and public.v51_is_central());
