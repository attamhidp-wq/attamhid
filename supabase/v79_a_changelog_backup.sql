-- v79 (أ) المرحلة الأولى: سجل تغييرات على الخادم + نسخ احتياطي يومي آلي
-- كل إضافة أو تعديل أو حذف في الجداول الأساسية يُسجَّل بقيمته السابقة واللاحقة وصاحبه ووقته،
-- فيمكن التراجع عن أي تغيير. ونسخة كاملة يومية تُحفظ 30 يوماً.

create extension if not exists pg_cron;

-- ---------- سجل التغييرات ----------
create table if not exists public.v79_change_log (
  id       bigint generated always as identity primary key,
  at       timestamptz not null default now(),
  tbl      text not null,
  row_id   text not null,
  op       text not null check (op in ('INSERT','UPDATE','DELETE')),
  actor    uuid,
  role     text,
  old_data jsonb,
  new_data jsonb
);
create index if not exists v79_change_log_row on public.v79_change_log (tbl, row_id, at desc);
create index if not exists v79_change_log_at  on public.v79_change_log (at desc);
alter table public.v79_change_log enable row level security;
create policy v79_change_log_central on public.v79_change_log for select to authenticated using (public.v51_is_central());

create or replace function public.v79_row_key(r jsonb) returns text
language sql immutable set search_path = public as $$
  select coalesce(r->>'id', r->>'code', r->>'key', r->>'num', r->>'course_id', r->>'old_id', r->>'k',
                  case when r ? 'exam_id' then (r->>'exam_id') || ':' || coalesce(r->>'pos','') end, '?')
$$;

create or replace function public.v79_log() returns trigger
language plpgsql security definer set search_path = public as $$
declare o jsonb; n jsonb;
begin
  if tg_op <> 'INSERT' then o := to_jsonb(old); end if;
  if tg_op <> 'DELETE' then n := to_jsonb(new); end if;
  -- حفظ متكرر بلا تغيير حقيقي (المتصفح يعيد رفع الصفوف كما هي) لا يُسجَّل
  if tg_op = 'UPDATE' and (o - 'updated_at') = (n - 'updated_at') then return null; end if;
  insert into public.v79_change_log(tbl, row_id, op, actor, role, old_data, new_data)
  values (tg_table_name, public.v79_row_key(coalesce(n, o)), tg_op,
          auth.uid(), coalesce(auth.role(), session_user::text), o, n);
  return null;
end $$;
revoke execute on function public.v79_log() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['students','faculty','requests','certs','exams','exam_questions','submissions','programs','news',
    'library','settings','doc_requests','partners','feedback','short_regs','profiles','v51_settings','v51_members','v51_images',
    'v51_program_courses','v51_scholarship_applications','v60_short_programs','v60_sp_regs','v61_id_map','v65_banks',
    'v65_bank_props','v67_map_tbl','v73_banks','v75_issued','v77_asg'] loop
    if to_regclass('public.' || t) is not null then
      execute format('create trigger v79_log after insert or update or delete on public.%I for each row execute function public.v79_log()', t);
    end if;
  end loop;
end $$;

-- التراجع عن تغيير واحد: يعيد الصف إلى ما كان عليه قبل ذلك التغيير (للإدارة المركزية)
create or replace function public.v79_undo(log_id bigint)
returns jsonb language plpgsql security definer set search_path = public as $$
declare L public.v79_change_log; pk text[]; cond text;
begin
  if not public.v51_is_central() and session_user not in ('postgres','supabase_admin') then raise exception 'forbidden'; end if;
  select * into L from public.v79_change_log where id = log_id;
  if L.id is null then raise exception 'log entry not found'; end if;
  select array_agg(a.attname order by a.attnum) into pk
    from pg_index i join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey)
   where i.indrelid = ('public.' || quote_ident(L.tbl))::regclass and i.indisprimary;
  select string_agg(format('%I = (jsonb_populate_record(null::public.%I, $1)).%I', c, L.tbl, c), ' and ') into cond from unnest(pk) c;
  -- احذف الصف بحالته الحالية (إن وُجد)، ثم أعده كما كان قبل التغيير (إن كان موجوداً قبله)
  execute format('delete from public.%I where %s', L.tbl, cond) using coalesce(L.new_data, L.old_data);
  if L.old_data is not null then
    execute format('insert into public.%I select * from jsonb_populate_record(null::public.%I, $1)', L.tbl, L.tbl) using L.old_data;
  end if;
  return jsonb_build_object('ok', true, 'tbl', L.tbl, 'row', L.row_id, 'restored_to', case when L.old_data is null then 'removed' else 'previous' end);
end $$;
revoke execute on function public.v79_undo(bigint) from public, anon;
grant execute on function public.v79_undo(bigint) to authenticated;

-- ---------- النسخ الاحتياطي اليومي ----------
create table if not exists public.v79_backups (
  id       bigint generated always as identity primary key,
  taken_at timestamptz not null default now(),
  tbl      text not null,
  n        int not null,
  rows     jsonb not null
);
create index if not exists v79_backups_at on public.v79_backups (taken_at desc);
alter table public.v79_backups enable row level security;
create policy v79_backups_central on public.v79_backups for select to authenticated using (public.v51_is_central());

create or replace function public.v79_backup_now()
returns jsonb language plpgsql security definer set search_path = public as $$
declare t text; c int; total int := 0; tabs int := 0; r jsonb;
begin
  if not public.v51_is_central() and session_user not in ('postgres','supabase_admin') then raise exception 'forbidden'; end if;
  for t in select c2.relname from pg_class c2 join pg_namespace s on s.oid = c2.relnamespace
            where s.nspname = 'public' and c2.relkind = 'r'
              and c2.relname not in ('v79_backups','v79_change_log','v65_draws','v64_qr_scans') loop
    execute format('select count(*)::int, coalesce(jsonb_agg(to_jsonb(x)), ''[]''::jsonb) from public.%I x', t) into c, r;
    insert into public.v79_backups(tbl, n, rows) values (t, c, r);
    total := total + c; tabs := tabs + 1;
  end loop;
  -- الاحتفاظ: النسخ 30 يوماً، وسجل التغييرات 180 يوماً
  delete from public.v79_backups where taken_at < now() - interval '30 days';
  delete from public.v79_change_log where at < now() - interval '180 days';
  return jsonb_build_object('ok', true, 'tables', tabs, 'rows', total, 'at', now());
end $$;
revoke execute on function public.v79_backup_now() from public, anon;
grant execute on function public.v79_backup_now() to authenticated;

-- كل يوم الساعة 00:30 بتوقيت بنغلاديش (18:30 UTC)
select cron.unschedule(jobid) from cron.job where jobname = 'tamhid-daily-backup';
select cron.schedule('tamhid-daily-backup', '30 18 * * *', 'select public.v79_backup_now()');

-- نسخة أولى الآن
select public.v79_backup_now();
