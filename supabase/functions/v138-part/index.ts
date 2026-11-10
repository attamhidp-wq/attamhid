// v138-part — حسابات المشاركين الزائرين في البرامج القصيرة: إنشاء الحساب، إعادة إرسال رابط التفعيل، استعادة كلمة المرور
// الروابط تُرسل من بريد المعهد نفسه (طابور البريد)، ولا تُعاد الرموز إلى المتصفح أبداً.
import { createClient } from "jsr:@supabase/supabase-js@2";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
const SITE = "https://attamhid.com/";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const EM = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const clean = (v: unknown, n: number) => String(v ?? "").replace(/[<>]/g, "").trim().slice(0, n);

async function recent(email: string) {
  const { count } = await admin.from("v63_mail_log").select("id", { count: "exact", head: true }).eq("to_addr", email).like("type", "p138_auth%").gte("at", new Date(Date.now() - 90e3).toISOString());
  return (count || 0) > 0;
}

async function mail(email: string, kind: "signup" | "recovery", vt: string, hashed: string, na: string, ne: string) {
  const link = SITE + "#/pv/" + vt + "/" + hashed;
  const T = kind === "recovery"
    ? { ta: "استعادة كلمة المرور", te: "Reset your password", ba: "طلبتم تعيين كلمة مرور جديدة لحسابكم في بوابة المشاركين. اضغطوا الزر أدناه خلال ساعة واحدة، ثم اختاروا كلمة المرور الجديدة. إن لم تطلبوا ذلك فتجاهلوا هذه الرسالة.", be: "You asked to set a new password for your participant account. Press the button below within one hour and choose your new password. If you did not ask for this, ignore this email.", bta: "تعيين كلمة مرور جديدة", bte: "Set a new password", s: "استعادة كلمة المرور — معهد التمهيد / Password reset" }
    : { ta: "فعّلوا حسابكم في بوابة المشاركين", te: "Activate your participant account", ba: "شكراً لتسجيلكم في بوابة المشاركين بمعهد التمهيد. اضغطوا الزر أدناه خلال 24 ساعة لتفعيل الحساب، ثم ادخلوا ببريدكم وكلمة المرور، وسجّلوا في أي برنامج قصير أو دورة أو ورشة بضغطة واحدة، وتجدوا شهاداتكم فور صدورها.", be: "Thank you for joining the At Tamhid Institute participant portal. Press the button below within 24 hours to activate your account; then sign in with your email and password, register for any short programme, course or workshop in one click, and find your certificates as soon as they are issued.", bta: "تفعيل الحساب", bte: "Activate account", s: "تفعيل حسابكم — معهد التمهيد / Activate your account" };
  const { data: html, error } = await admin.rpc("v134_tpl", { title_ar: T.ta, title_en: T.te, dear_ar: "السلام عليكم " + (na || "") + "،", dear_en: "Dear " + (ne || na || "participant") + ",", body_ar: T.ba, body_en: T.be, rows_ar: [], rows_en: [], btn_url: link, btn_ar: T.bta, btn_en: T.bte });
  if (error) throw error;
  const q = await admin.rpc("v134_mailq", { p_to: email, p_subject: T.s, p_html: html, p_text: T.ba + "\n" + link, p_type: "p138_auth_" + kind, p_ref: email });
  if (q.error) throw q.error;
  await admin.rpc("v108_tick");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { return json({ error: "bad_json" }, 400); }
  const action = String(b.action || "");
  const email = String(b.email || "").trim().toLowerCase().slice(0, 160);
  if (!EM.test(email)) return json({ error: "bad_email" });
  try {
    const { data: P } = await admin.from("v138_participants").select("uid,data,confirmed_at").eq("email", email).maybeSingle();
    if (action === "signup") {
      const pw = String(b.password || "");
      const d = { nameAr: clean(b.nameAr, 120), nameEn: clean(b.nameEn, 120), sex: String(b.sex || ""), phone: clean(b.phone, 40), lang: String(b.lang || "ar").slice(0, 2) };
      if (!d.nameAr || !d.nameEn || !d.phone || !["m", "f"].includes(d.sex)) return json({ error: "fields_required" });
      if (pw.length < 8 || pw.length > 64 || !/[A-Za-z؀-ۿ]/.test(pw) || !/\d/.test(pw)) return json({ error: "weak" });
      if (P) {
        if (P.confirmed_at) return json({ error: "exists" });
        if (await recent(email)) return json({ ok: true, sent: true });
        const g = await admin.auth.admin.generateLink({ type: "magiclink", email });
        if (g.error) throw g.error;
        await admin.auth.admin.updateUserById(P.uid, { password: pw });
        await admin.from("v138_participants").update({ data: d }).eq("uid", P.uid);
        await mail(email, "signup", "magiclink", g.data.properties.hashed_token, d.nameAr, d.nameEn);
        return json({ ok: true, sent: true });
      }
      const { count } = await admin.from("v138_participants").select("uid", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 10 * 60e3).toISOString());
      if ((count || 0) >= 40) return json({ error: "try_later" });
      const g = await admin.auth.admin.generateLink({ type: "signup", email, password: pw });
      if (g.error) {
        if (/already|exists|registered/i.test(g.error.message)) return json({ error: "exists" });
        throw g.error;
      }
      const ins = await admin.from("v138_participants").insert({ uid: g.data.user.id, email, data: d });
      if (ins.error) throw ins.error;
      await mail(email, "signup", "signup", g.data.properties.hashed_token, d.nameAr, d.nameEn);
      return json({ ok: true, sent: true });
    }
    if (action === "resend" || action === "reset") {
      // الرد واحد دائماً حتى لا يُكشف وجود الحساب
      if (P && !(await recent(email))) {
        const kind = action === "reset" && P.confirmed_at ? "recovery" : "magiclink";
        const g = await admin.auth.admin.generateLink({ type: kind, email });
        if (!g.error) await mail(email, kind === "recovery" ? "recovery" : "signup", kind, g.data.properties.hashed_token, P.data?.nameAr, P.data?.nameEn);
      }
      return json({ ok: true, sent: true });
    }
    return json({ error: "action" }, 400);
  } catch (e) {
    console.error("v138-part", e);
    return json({ error: "server" }, 500);
  }
});
