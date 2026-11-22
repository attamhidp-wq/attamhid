-- v78 (هـ) التحقق العام من البطاقات (v64)، وتطبيق خريطة الأرقام (v61)، ومخزن مرفقات الطلبات (v64-apps)

-- التحقق من بطاقة بالرقم التسلسلي: يعرض اللقطة العامة المعتمدة (card64.pub) فقط
create or replace function public.v64_card_status(q text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare h record; c jsonb; ov jsonb; k text; ser text; ex text; st text; nm text; ne text; inactive boolean;
begin
  q := trim(coalesce(q,''));
  if q !~ '^\d{6,12}$' and q !~ '^\d{4}-\d{5}$' then return jsonb_build_object('found', false); end if;
  select * into h from (
    select 's'::text src, s.id, s.data from public.students s
     where s.data->'card64'->>'serial' = q or s.data->'card64'->>'gserial' = q
    union all
    select 'f', f.id, f.data from public.faculty f where f.data->'card64'->>'serial' = q
    union all
    select 'a', m.id, m.data from public.v51_members m where m.data->'card64'->>'serial' = q
  ) z limit 1;
  if h.id is null then return jsonb_build_object('found', false); end if;
  c := coalesce(h.data->'card64','{}'::jsonb); ov := coalesce(c->'ovr','{}'::jsonb);
  k := h.src;
  if k = 's' and coalesce(h.data->>'status','') = 'متخرج' then k := 'g'; end if;
  ser := case when k = 'g' then c->>'gserial' else c->>'serial' end;
  ex := case when k = 'g' then '' else coalesce(nullif(c->>'exp',''), nullif(c->>'expS',''), c->'pub'->>'exp', '') end;
  inactive := coalesce(h.data->>'active','true') in ('false','0') or coalesce(h.data->>'deleted','') in ('1','true');
  st := case
          when k = 'g' and coalesce(ser,'') = '' then 'ended'
          when coalesce(case when k = 'g' then c->>'gst' else c->>'st' end,'') = 's' or inactive then 'suspended'
          when k = 'g' then 'valid'
          when ex <> '' and to_char(now(),'YYYY-MM-DD') > ex then 'expired'
          else 'valid' end;
  nm := trim(coalesce(ov->'name'->>'ar', h.data->>'name', ''));
  ne := upper(trim(coalesce(ov->'name'->>'en', h.data->>'nameEn', h.data->'appt64'->>'nameEn', '')));
  return jsonb_build_object('found', true, 'kind', k, 'name', nm, 'nameEn', ne, 'id', h.id, 'serial', coalesce(ser,''),
                            'exp', ex, 'status', st, 'pub', coalesce(c->'pub','{}'::jsonb));
end $$;
grant execute on function public.v64_card_status(text) to anon, authenticated;

-- تطبيق خريطة الأرقام القديمة → الجديدة على الخادم (للإدارة المركزية)
create or replace function public.v61_apply_id_map()
returns jsonb language plpgsql security definer set search_path = public as $$
declare m jsonb; n int := 0; p int := 0;
begin
  if not public.v51_is_central() then raise exception 'forbidden'; end if;
  select data->'idMap' into m from public.v51_settings where key = 'cal61';
  if m is null or jsonb_typeof(m) <> 'object' then return jsonb_build_object('mapped', 0, 'profiles', 0); end if;
  insert into public.v61_id_map(old_id, new_id)
    select left(trim(e.key),40), left(trim(e.value),40) from jsonb_each_text(m) e where coalesce(trim(e.value),'') <> ''
    on conflict (old_id) do update set new_id = excluded.new_id;
  get diagnostics n = row_count;
  update public.profiles pf set ref_id = mp.new_id from public.v61_id_map mp where pf.ref_id = mp.old_id;
  get diagnostics p = row_count;
  return jsonb_build_object('mapped', n, 'profiles', p);
end $$;
revoke execute on function public.v61_apply_id_map() from public, anon;
grant execute on function public.v61_apply_id_map() to authenticated;

-- مخزن خاص لمرفقات طلبات التسجيل: لا قراءة إلا لمن يملك صلاحية الطلبات
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('v64-apps', 'v64-apps', false, 10485760, array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "v64 apps staff read" on storage.objects for select to authenticated
  using (bucket_id = 'v64-apps' and public.v51_can('req'));
create policy "v64 apps central write" on storage.objects for all to authenticated
  using (bucket_id = 'v64-apps' and public.v51_is_central())
  with check (bucket_id = 'v64-apps' and public.v51_is_central());
