// v138-part — حسابات المشاركين الزائرين في البرامج القصيرة: إنشاء الحساب، إعادة إرسال رابط التفعيل، استعادة كلمة المرور
// الروابط تُرسل من بريد المعهد نفسه (طابور البريد)، ولا تُعاد الرموز إلى المتصفح أبداً.
import { createClient } from "jsr:@supabase/supabase-js@2";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
const SITE = "https://attamhid.com/";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const EM = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const clean = (v: unknown, n: number) => String(v ?? "").replace(/[<>]/g, "").trim().slice(0, n);

// v196: حماية كلمات المرور المسرَّبة (Have I Been Pwned بطريقة k-anonymity: لا يُرسل إلا أول 5 رموز من بصمة SHA-1)
async function pwned(password: string): Promise<number> {
  try {
    const h = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password)))).map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
    const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch("https://api.pwnedpasswords.com/range/" + h.slice(0, 5), { headers: { "Add-Padding": "true", "User-Agent": "attamhid-participants" }, signal: ctl.signal });
    clearTimeout(tm);
    if (!r.ok) return 0;
    const suf = h.slice(5);
    for (const line of (await r.text()).split("\n")) { const [x, c] = line.trim().split(":"); if (x === suf) return Number(c) || 0; }
  } catch { /* تعذّر الفحص: لا نمنع المستخدم */ }
  return 0;
}
const weakPw = (pw: string) => pw.length < 8 || pw.length > 64 || !/[A-Za-z\u0600-\u06FF]/.test(pw) || !/\d/.test(pw);

async function recent(email: string) {
  const { count } = await admin.from("v63_mail_log").select("id", { count: "exact", head: true }).eq("to_addr", email).like("type", "p138_auth%").gte("at", new Date(Date.now() - 90e3).toISOString());
  return (count || 0) > 0;
}

async function mail(email: string, kind: "signup" | "recovery", vt: string, hashed: string, na: string, ne: string) {
  const link = SITE + "#/pv/" + vt + "/" + hashed;
  const T = kind === "recovery"
    ? { ta: "استعادة كلمة المرور", te: "Reset your password", ba: "طلبتم تعيين كلمة مرور جديدة لحسابكم في بوابة التدريب. اضغطوا الزر أدناه خلال ساعة واحدة، ثم اختاروا كلمة المرور الجديدة. إن لم تطلبوا ذلك فتجاهلوا هذه الرسالة.", be: "You asked to set a new password for your Training Portal account. Press the button below within one hour and choose your new password. If you did not ask for this, ignore this email.", bta: "تعيين كلمة مرور جديدة", bte: "Set a new password", s: "استعادة كلمة المرور — معهد التمهيد / Password reset" }
    : { ta: "فعّلوا حسابكم في بوابة التدريب", te: "Activate your Training Portal account", ba: "شكراً لتسجيلكم في بوابة التدريب بمعهد التمهيد. اضغطوا الزر أدناه خلال 24 ساعة لتفعيل الحساب، ثم ادخلوا ببريدكم وكلمة المرور، وسجّلوا في أي برنامج قصير أو دورة أو ورشة بضغطة واحدة، وتجدوا شهاداتكم فور صدورها.", be: "Thank you for joining the At Tamhid Institute Training Portal. Press the button below within 24 hours to activate your account; then sign in with your email and password, register for any short programme, course or workshop in one click, and find your certificates as soon as they are issued.", bta: "تفعيل الحساب", bte: "Activate account", s: "تفعيل حسابكم — معهد التمهيد / Activate your account" };
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
      if (await pwned(pw) > 0) return json({ error: "pwned" });
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
    if (action === "setpw") {
      // v196: تعيين كلمة المرور بعد رابط الاستعادة يمر بالخادم ليُفحص ضد كلمات المرور المسرَّبة
      const tok = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
      const { data: U, error: ue } = await admin.auth.getUser(tok);
      if (ue || !U?.user || String(U.user.email || "").toLowerCase() !== email) return json({ error: "auth" }, 401);
      if (!P || P.uid !== U.user.id) return json({ error: "auth" }, 401);
      const pw = String(b.password || "");
      if (weakPw(pw)) return json({ error: "weak" });
      if (await pwned(pw) > 0) return json({ error: "pwned" });
      const up = await admin.auth.admin.updateUserById(U.user.id, { password: pw });
      if (up.error) return json({ error: /different|same/i.test(up.error.message) ? "same" : "server" });
      return json({ ok: true });
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
