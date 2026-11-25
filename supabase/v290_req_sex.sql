-- v290: الجنس إلزامي في طلبات القبول الجديدة (تُصاغ الخطابات والوثائق بحسبه)
create or replace function public.v290_req_sex() returns trigger language plpgsql set search_path to 'public' as $$
begin
  if coalesce(new.data->>'sex','') !~* '^(ذكر|أنثى|انثى|m|f|male|female)$' then
    raise exception 'الجنس مطلوب لتقديم الطلب / Gender is required' using errcode = '23514';
  end if;
  return new;
end $$;
drop trigger if exists v290_req_sex on public.requests;
create trigger v290_req_sex before insert on public.requests for each row execute function public.v290_req_sex();
