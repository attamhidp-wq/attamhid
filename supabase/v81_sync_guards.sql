-- v81: حماية البيانات من تضارب نسخ المتصفحات (طُبّق في Supabase: v81_sync_guards + v81_sync_guards_fix)
-- 1) لا حذف نهائي من المتصفح للجداول الأساسية (يُتجاهل بصمت ويبقى السجل)؛ الحذف المقصود عبر v81_delete_rows للإدارة المركزية
-- 2) لا يُكتب فوق نسخة أحدث بنسخة أقدم (حسب data.u)
create or replace function public.v81_no_client_delete() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('tamhid.allow_delete', true), '') = '1' or coalesce(auth.role(), '') in ('', 'service_role') then return old; end if;
  return null;
end $$;
create or replace function public.v81_no_stale_update() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.role(), '') in ('', 'service_role') then return new; end if;
  if (old.data ? 'u') and (new.data ? 'u') and coalesce(new.data->>'u','') < coalesce(old.data->>'u','') then return null; end if;
  return new;
end $$;
-- triggers on: students, faculty, requests, certs, submissions, programs, exams, doc_requests, v51_members
-- create or replace function public.v81_delete_rows(tbl text, ids text[]) returns int  (central only; sets tamhid.allow_delete)
