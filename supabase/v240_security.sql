-- v240 — محور الأمان (توثيق ما طُبِّق في قاعدة البيانات؛ لا أسرار هنا)
-- نسخ موضعية قبل التعديل: bk_v231.students_v240 / faculty_v240 / members_v240 / parts_v240 (مطابقة بالبصمة md5)

-- 1) حماية بيانات الهوية من الكتابة بنسخة قديمة أو ناقصة من متصفح الإدارة
--    القيمة المسجّلة لا تُمحى بقيمة فارغة، وإن كانت النسخة الواردة أقدم من آخر حفظ ذاتي/بالرابط (idn16.at)
--    بقيت حقول الهوية كما هي. التعديل المقصود من صفحة استكمال البيانات يحمل idn16 جديداً فيمرّ.
create or replace function public.v240_idn_keep() returns trigger language plpgsql set search_path to 'public' as $f$
declare k text; o text; n text; stale boolean;
  keys text[] := array['name','nameEn','sex','dob','birth','pob','pobEn','nat','natEn','docType','idType','pid','country','countryEn','address','addressEn','mother','motherEn','phone',
    'qualType','qualMajor','qualMajorEn','qualIssuer','qualIssuerEn','qualCountry','qualCountryEn','qualYear','spec','specEn','rank','rankEn'];
begin
  if old.data is null or new.data is null then return new; end if;
  stale := coalesce(old.data->'idn16'->>'at','') > coalesce(new.data->'idn16'->>'at','');
  foreach k in array keys loop
    o := coalesce(old.data->>k,''); n := coalesce(new.data->>k,'');
    if o = '' or o = n then continue; end if;
    if n = '' or stale then new.data := new.data || jsonb_build_object(k, old.data->k); end if;
  end loop;
  if stale then new.data := new.data || jsonb_build_object('idn16', old.data->'idn16'); end if;
  return new;
end $f$;
-- create trigger v240_idn_keep before update on public.students|faculty|v51_members for each row execute function public.v240_idn_keep();

-- 2) دوال مساعدة داخلية لم تعد قابلة للاستدعاء من الزوار والمستخدمين (تستدعيها دوال المالك فقط)
-- revoke execute on function public.v223_allowed(text,text,jsonb), public.v224_ok(jsonb,jsonb), public.v224_show(jsonb,integer) from public, anon, authenticated;

-- 3) alter function public.idn_keys(text) set search_path to 'public';

-- نتائج التدقيق (23 نوفمبر 2026):
-- * عناوين الدخول وهمية داخلية (acc.attamhid.invalid) فلا تكشف دوال الدخول بريداً حقيقياً.
-- * الدوال العامة محمية بحد للطلبات (v196_rl) أو برموز سرية أو بفحص الصلاحية؛ دوال القواعد (RLS) تبقى متاحة لأنها تُقيَّم بصلاحية المستخدم.
-- * دوال الحافة بلا verify_jwt تتحقق بنفسها (OIDC للنسخ، رمز الخزنة للفحوص، جلسة المستخدم ودوره لبقية الإجراءات، قفل بعد المحاولات الفاشلة).
-- * متبقٍّ يحتاج قرار صاحب الحساب: تفعيل Leaked password protection من لوحة Supabase؛ وصور التوقيع والختم مقروءة للعموم لعرض الشهادات في التحقق العام.
