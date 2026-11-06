-- v82: سجل البريد الرسمي (طُبّق في Supabase: v82_mail_log, v82_pg_net)
-- جدول v63_mail_log: كل رسالة (مُرسلة/فاشلة) مع محاولات الإعادة؛ يقرؤه المركز فقط.
-- امتداد pg_net: لاستدعاء الدالة من الخادم (فحص، وإعادة إرسال مجدولة لاحقاً).
-- الدالة الطرفية: supabase/functions/v63-accounts (Gmail SMTP عبر المنفذ 465).

-- v82 (ب): بيانات Gmail في الخزنة المشفّرة (vault): gmail_user, gmail_app_password, mail_selftest_token
-- الدالة v82_mail_cred() تعيدها لدور الخدمة فقط (الدالة الطرفية)، ولا يقرؤها أي مستخدم.
-- فحص ذاتي ناجح 2026-11-07: أُرسلت رسالة اختبار إلى attamhidp@gmail.com عبر smtp.gmail.com:465.
