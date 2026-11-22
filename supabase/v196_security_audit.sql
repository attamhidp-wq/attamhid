-- v196 — تدقيق أمني: تحديد معدل الطلبات لكل عنوان IP على الوظائف العامة، رمز تحقق إلزامي لمتابعة الطلبات،
-- حجب البيانات الحساسة من القراءة العامة للبرامج القصيرة والإعدادات. لا يحذف أي بيانات ولا يعطّل أي وظيفة.

-- (1) تحديد المعدل
create table if not exists public.v196_rl(k text primary key, n int not null default 0, win timestamptz not null default now());
alter table public.v196_rl enable row level security;
revoke all on public.v196_rl from anon, authenticated;
create table if not exists public.v196_fail(rid text primary key, n int not null default 0, win timestamptz not null default now());
alter table public.v196_fail enable row level security;
revoke all on public.v196_fail from anon, authenticated;

create or replace function public.v196_ip() returns text language plpgsql stable set search_path to 'public' as $$
declare h json; ip text;
begin
  begin h := nullif(current_setting('request.headers', true),'')::json; exception when others then h := null; end;
  if h is null then return null; end if;
  ip := coalesce(nullif(h->>'cf-connecting-ip',''), nullif(trim(split_part(coalesce(h->>'x-forwarded-for',''),',',1)),''), nullif(h->>'x-real-ip',''), 'unknown');
  return left(ip,64);
end $$;

create or replace function public.v196_rl(p_fn text, p_lim int, p_secs int default 600) returns void language plpgsql security definer set search_path to 'public' as $$
declare ip text := public.v196_ip(); k text; c int;
begin
  if ip is null or coalesce(auth.role(),'') = 'service_role' then return; end if;   -- استدعاءات داخلية من الخادم لا تُقيَّد
  k := p_fn || ':' || ip;
  insert into public.v196_rl as r(k,n,win) values (k,1,now())
    on conflict (k) do update set n = case when r.win < now() - make_interval(secs => p_secs) then 1 else r.n + 1 end,
                                  win = case when r.win < now() - make_interval(secs => p_secs) then now() else r.win end
    returning n into c;
  if random() < 0.02 then delete from public.v196_rl where win < now() - interval '1 day'; end if;
  if c > p_lim then raise exception 'rate_limited' using errcode = 'PT429', hint = 'Too many requests. Try again later.'; end if;
end $$;
revoke all on function public.v196_rl(text,int,int) from public, anon, authenticated;
revoke all on function public.v196_ip() from public, anon, authenticated;

-- (2) أغلفة بتحديد المعدل بالاسم والتوقيع نفسيهما (لا يتغير شيء للموقع)
do $do$
declare r record; L jsonb := '{"verify_cert":40,"verify_person":30,"v64_card_status":30,"track_request_secure":20,"v77_track":20,"v141_track":20,"partner_track":20,"v135_dup_check":30,"v155_dup_check":30,"login_email":30,"v51_login_email":30,"v61_alias":30,"v67_map":40,"v136_amb_status":30,"placement_paper":30,"track_request":20,"v77_resubmit":10,"v141_resubmit":10,"partner_reply":20,"v136_share_proof":20,"submit_placement":10,"short_register":10,"v60_sp_register":20,"feedback_submit":20,"partner_submit":10}';
  core text; call text; body text; an boolean; au boolean;
begin
  for r in select p.oid, p.proname, pg_get_function_arguments(p.oid) args, pg_get_function_identity_arguments(p.oid) ida, pg_get_function_result(p.oid) res, p.proretset rs, p.proargnames nm, p.pronargs na
           from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and L ? p.proname loop
    core := r.proname || '_c196';
    if exists(select 1 from pg_proc q join pg_namespace n on n.oid=q.pronamespace where n.nspname='public' and q.proname=core) then continue; end if;
    an := has_function_privilege('anon', r.oid, 'execute'); au := has_function_privilege('authenticated', r.oid, 'execute');
    execute format('alter function public.%I(%s) rename to %I', r.proname, r.ida, core);
    execute format('revoke all on function public.%I(%s) from public, anon, authenticated', core, r.ida);
    select string_agg(quote_ident(x), ', ') into call from unnest(r.nm[1:r.na]) x;
    call := coalesce(call,'');
    if r.rs then body := format('begin perform public.v196_rl(%L,%s); return query select * from public.%I(%s); end', r.proname, L->>r.proname, core, call);
    elsif r.res = 'void' then body := format('begin perform public.v196_rl(%L,%s); perform public.%I(%s); end', r.proname, L->>r.proname, core, call);
    else body := format('begin perform public.v196_rl(%L,%s); return public.%I(%s); end', r.proname, L->>r.proname, core, call); end if;
    execute format('create function public.%I(%s) returns %s language plpgsql volatile security definer set search_path to ''public'' as %L', r.proname, r.args, r.res, body);
    execute format('revoke all on function public.%I(%s) from public', r.proname, r.ida);
    if an then execute format('grant execute on function public.%I(%s) to anon', r.proname, r.ida); end if;
    if au then execute format('grant execute on function public.%I(%s) to authenticated', r.proname, r.ida); end if;
  end loop;
end $do$;

-- (3) متابعة الطلب: لا بيانات دون رمز تحقق (البريد المسجّل في الطلب أو الرمز السري)، وقفل مؤقت بعد المحاولات الخاطئة
create or replace function public.v141_track_c196(rid text, em text default null) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare d jsonb; v text := lower(trim(coalesce(em,''))); f record; k text := upper(trim(coalesce(rid,'')));
begin
  if length(k) < 6 then return null; end if;
  select x.data into d from public.requests x where upper(x.id) = k limit 1;
  select * into f from public.v196_fail where v196_fail.rid = k;
  if f.rid is not null and f.n >= 8 and f.win > now() - interval '1 hour' then return jsonb_build_object('locked141', true); end if;
  if v = '' then return jsonb_build_object('need141', true); end if;                -- لا يُكشف حتى وجود الطلب
  if d is not null and (v = lower(trim(coalesce(d->>'email',''))) or (coalesce(d->>'secret','') <> '' and v = lower(trim(d->>'secret')))) then
    delete from public.v196_fail where v196_fail.rid = k;
    return public.v78_req_public(d) || jsonb_build_object('full141', true);
  end if;
  insert into public.v196_fail as t(rid,n,win) values (k,1,now())
    on conflict (rid) do update set n = case when t.win < now() - interval '1 hour' then 1 else t.n + 1 end, win = case when t.win < now() - interval '1 hour' then now() else t.win end;
  return jsonb_build_object('bad141', true);
end $$;
revoke all on function public.v141_track_c196(text,text) from public, anon, authenticated;

-- إعادة التسليم تقبل البريد أو الرمز السري أيضاً
do $m$ declare src text;
begin
  src := pg_get_functiondef('public.v141_resubmit_c196(text,text,jsonb,text)'::regprocedure);
  if position('v196' in src) = 0 then
    src := regexp_replace(src, 'lower\(trim\(em\)\)\s*<>\s*lower\(trim\(coalesce\(d->>''email'',''''\)\)\)', 'lower(trim(em)) <> lower(trim(coalesce(d->>''email'',''''))) and lower(trim(em)) <> lower(trim(coalesce(nullif(d->>''secret'',''''),chr(1)))) /*v196*/');
    if position('v196' in src) > 0 then execute src; end if;
  end if;
end $m$;

-- track_request القديم: لا يُستعمل في المسارات العامة الحالية؛ صار لصاحب الطلب المسجّل أو الإدارة فقط
create or replace function public.track_request_c196(rid text) returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object('status', data->>'status', 'sid', data->>'sid') from public.requests
   where upper(id)=upper(rid) and auth.uid() is not null and (public.is_admin() or public.v51_is_central() or data->>'sid' = public.my_ref()) limit 1 $$;
revoke all on function public.track_request_c196(text) from public, anon, authenticated;
revoke execute on function public.track_request(text) from anon;

-- (4) القراءة العامة للبرامج القصيرة عبر عرض منقّح (دون بريد المدرب والحقول الداخلية)
create or replace view public.v196_sp_pub with (security_barrier = true) as
  select id, (data - 'trainerEmail' - 'urlOld138' - 'urlSeen67' - 'meet136') as data, updated_at
  from public.v60_short_programs;
grant select on public.v196_sp_pub to anon, authenticated;
drop policy if exists v60_short_programs_pub_read on public.v60_short_programs;
create policy v196_sp_staff_read on public.v60_short_programs for select to authenticated using (public.v51_is_central() or public.v113_is_staff());

-- (5) جدول settings: القراءة العامة لمفتاحي الواجهة فقط
drop policy if exists "public read" on public.settings;
create policy v196_settings_pub_read on public.settings for select to anon, authenticated using (key in ('home','img'));
