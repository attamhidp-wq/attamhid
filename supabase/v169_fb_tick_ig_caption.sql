-- v169 — مرجع لما طُبّق على الخادم بترحيلين (20261112182946 و20261112183156). المصدر الحاكم: supabase_migrations.schema_migrations
-- (1) v169_fb_tick_ig_caption_fix
-- منشور القصة في إنستغرام لا يحمل تعليقاً، وكان يُدرج بقيمة null فيكسر المهمة كلها
-- 1) التعليق يُبنى دائماً (نص المنشور ثم الرابط بديلاً)  2) إدراج طابور إنستغرام معزول بحيث لا يُسقط منشور فيسبوك
CREATE OR REPLACE FUNCTION public.v136_fb_tick()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare d jsonb; t text; q record; P jsonb; rid bigint; r record; n int := 0; m text; lk text; im text; cap text; sti text;
begin
  select data into d from public.v136_integr where k='fb'; t := public.v136_fb_tok();
  for q in select * from public.v136_fb_q where st = 'wait' and req is not null loop
    select status_code, content into r from net._http_response where id = q.req;
    if r is not null then
      if r.status_code between 200 and 299 then update public.v136_fb_q set st='posted', post_id = coalesce(r.content::jsonb->>'post_id', r.content::jsonb->>'id'), err = null where id = q.id;
      elsif q.ph and not q.noimg then
        update public.v136_fb_q set st='q', noimg=true, ph=false, req=null, due=now(), err = left('photo: '||regexp_replace(coalesce(r.content,''),'access_token=[^&"]+','***','g'),300) where id = q.id;
      else update public.v136_fb_q set st='failed', err = left(regexp_replace(coalesce(r.content,''),'access_token=[^&"]+','***','g'),300) where id = q.id; end if;
    elsif q.at < now() - interval '30 minutes' then update public.v136_fb_q set st='failed', err='timeout' where id = q.id; end if;
  end loop;
  if d is null or t is null or coalesce((d->>'on')::boolean,false) = false then return 0; end if;
  insert into public.v136_fb_q(pid, kind, due)
  select s.id, k.k, now() from public.v60_short_programs s, lateral public.v136_sp_times(s.data) tt, (values ('soon'),('soon_en')) k(k)
  where s.deleted_at is null and coalesce(s.data->>'aud','')='public' and coalesce(s.data->>'fb','1')<>'0' and tt.t1 between now() + interval '20 hours' and now() + interval '28 hours'
    and not exists(select 1 from public.v136_fb_q x where x.pid = s.id and x.kind=k.k);
  for q in select * from public.v136_fb_q where st = 'q' and due <= now() order by id limit 5 loop
    if q.at < now() - interval '7 days' then update public.v136_fb_q set st='skipped' where id = q.id; continue; end if;
    im := null;
    if coalesce(q.src,'sp') = 'sp' then
      select data into P from public.v60_short_programs where id = q.pid and deleted_at is null;
      if P is null or coalesce(P->>'aud','')<>'public' or (select tt.t2 from public.v136_sp_times(P) tt) < now() then update public.v136_fb_q set st='skipped' where id = q.id; continue; end if;
      if q.kind like '%\_en' then m := public.v136_fb_msg_en(P, q.pid, replace(q.kind,'_en','')); im := nullif(P->>'annImgEn','');
        if m is null then update public.v136_fb_q set st='skipped', err='no English title' where id = q.id; continue; end if;
      else m := public.v136_fb_msg(P, q.pid, q.kind); im := nullif(P->>'annImg',''); end if;
      lk := 'https://attamhid.com/#/sp/'||q.pid;
      if im is null and not q.noimg and q.due > now() - interval '20 minutes' then continue; end if;
    else
      if coalesce(q.msg,'') = '' then update public.v136_fb_q set st='skipped' where id = q.id; continue; end if;
      m := q.msg; lk := coalesce(q.link, 'https://attamhid.com/'); im := nullif(q.img,'');
      if im is null and not q.noimg then
        select 'https://ttuelhswxyjbjdnydmns.supabase.co/storage/v1/object/public/ann/'||o.name||'?v='||floor(extract(epoch from o.updated_at))::bigint into im
          from storage.objects o where o.bucket_id='ann' and o.name = q.src||'-'||regexp_replace(q.pid,'[^A-Za-z0-9_.-]','_','g')||case when q.kind like '%\_en' then '-en' else '' end||'.jpg' and (q.src = 'news' or o.updated_at > q.due - interval '30 minutes');
        if im is null and q.due > now() - interval '20 minutes' then continue; end if;
      end if;
    end if;
    m := replace(m, 'https://attamhid.com/#/', 'https://attamhid.com/?src=fb#/'); lk := replace(lk, 'https://attamhid.com/#/', 'https://attamhid.com/?src=fb#/');
    if q.noimg or im is null or (im not like 'https://ttuelhswxyjbjdnydmns.supabase.co/storage/v1/object/public/ann/%' and im not like 'https://attamhid.com/img/fb/%') then im := null; end if;
    if im is not null then
      select net.http_post(url := 'https://graph.facebook.com/v21.0/'||(d->>'page')||'/photos',
        body := jsonb_build_object('url', im, 'caption', case when position(lk in m) > 0 then m else m || E'\n\n' || lk end, 'access_token', t),
        headers := '{"Content-Type":"application/json"}'::jsonb, timeout_milliseconds := 30000) into rid;
    else
      select net.http_post(url := 'https://graph.facebook.com/v21.0/'||(d->>'page')||'/feed',
        body := jsonb_build_object('message', m, 'link', lk, 'access_token', t),
        headers := '{"Content-Type":"application/json"}'::jsonb, timeout_milliseconds := 30000) into rid;
    end if;
    update public.v136_fb_q set st='wait', req = rid, at = now(), ph = (im is not null) where id = q.id; n := n + 1;
    if im is not null then
      -- v169: التعليق لا يكون فارغاً أبداً، وخطأ طابور إنستغرام لا يُسقط منشور فيسبوك ولا المهمة
      cap := coalesce(nullif(replace(coalesce(m,''), '?src=fb#', '?src=ig#'),''), replace(lk, '?src=fb#', '?src=ig#'), 'معهد التمهيد — At Tamhid Institute');
      begin
        insert into public.v157_ig_q(fbq, img, caption, due) values (q.id, im, cap, now() + interval '2 minutes');
        sti := public.v161_story_img(im);
        if sti is not null then insert into public.v157_ig_q(fbq, img, caption, due, story) values (q.id, sti, cap, now() + interval '4 minutes', true); end if;
      exception when others then raise warning 'v169 ig enqueue (fbq %): %', q.id, sqlerrm; end;
    end if;
  end loop;
  begin perform public.v157_ig_tick(); exception when others then raise warning 'v157 ig: %', sqlerrm; end;
  return n;
end $function$;

-- طبقة حماية في الجدول نفسه: أي إدراج مستقبلي بتعليق فارغ يُستبدل بنص آمن بدل كسر المعاملة
alter table public.v157_ig_q alter column caption set default '';
create or replace function public.v169_ig_q_caption() returns trigger language plpgsql set search_path to 'public' as $$
begin new.caption := coalesce(new.caption, ''); return new; end $$;
drop trigger if exists v169_ig_q_caption on public.v157_ig_q;
create trigger v169_ig_q_caption before insert or update of caption on public.v157_ig_q for each row execute function public.v169_ig_q_caption();

-- (2) v169_watch_skip_recovered_jobs
-- لا يُرسل تنبيه عن مهمة مجدولة تعافت (آخر تشغيل ناجح ولا فشل خلال الساعة الأخيرة)
create or replace function public.v169_job_failing(p_job text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists(select 1 from cron.job_run_details d join cron.job j on j.jobid=d.jobid where j.jobname=p_job and d.status='failed' and d.start_time > now() - interval '1 hour')
      or coalesce((select d.status from cron.job_run_details d join cron.job j on j.jobid=d.jobid where j.jobname=p_job order by d.start_time desc limit 1),'') = 'failed' $$;
do $m$ declare src text;
begin
  src := pg_get_functiondef('public.v136_watch()'::regprocedure);
  if position('v169_job_failing' in src) = 0 then
    src := replace(src, 'if (i->>''fail24'')::int >= 3 then', 'if (i->>''fail24'')::int >= 3 and public.v169_job_failing(i->>''job'') then');
    if position('v169_job_failing' in src) = 0 then raise exception 'pattern not found'; end if;
    execute src;
  end if;
end $m$;
