-- v83 (طُبّق في Supabase): حسابات الدخول وكلمات المرور — تُدار من الدالة الطرفية v63-accounts فقط
-- v63_accounts عرض (view) على profiles يبقى كما هو؛ حالة كلمات المرور في جدول v83_acc
create table if not exists public.v83_acc(
  user_id uuid primary key references auth.users(id) on delete cascade,
  ref_id text not null unique, role text not null,
  init_enc text, init_exp timestamptz, must_change boolean not null default true,   -- كلمة المرور الأولى مشفّرة AES-256-GCM حتى أول تغيير
  fails int not null default 0, locked_until timestamptz, last_login timestamptz,
  created_at timestamptz not null default now(), changed_at timestamptz);
alter table public.v83_acc enable row level security;            -- لا وصول إلا من الخادم (service_role)
revoke all on public.v83_acc from anon, authenticated;
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role = any (array['admin','student','faculty','staff']));
create table if not exists public.v63_acc_log(id bigserial primary key, at timestamptz not null default now(), event text not null, ref_id text, by_name text, detail text);
create table if not exists public.v63_rc(user_id uuid not null, hash text not null, used_at timestamptz, created_at timestamptz not null default now(), primary key(user_id, hash));
create table if not exists public.v63_rc_fail(user_id uuid not null, at timestamptz not null default now());
-- (RLS مفعّل على الثلاثة دون سياسات)
-- مفتاح التشفير في الخزنة: acc_init_key ؛ يقرؤه الخادم فقط عبر v83_acc_key() (service_role)

-- v83_retire_old_faculty_ids: حُذفت نسخ هيئة التدريس القديمة TF-2026-001..004 (مكررة بأرقامها الجديدة 12026001..004)
-- وأضيفت إلى v81_retired مع مشغّل v81_block_retired على faculty حتى لا ترجع من أي متصفح.
