// v63-accounts (v108) — البريد الرسمي (Resend بنطاق المعهد + Gmail احتياطي)، الإشعارات، «نسيت كلمة المرور»، الحسابات
// العمليات: probe, selftest, mail_status, mail_ready, mail, mail_log, retry_due
// v83 — الحسابات: list, ensure, reset, reveal, unlock, log, login, change, rename, remove, purge, rc_generate, rc_use, rc_status
// بيانات Gmail: أسرار الدالة GMAIL_USER/GMAIL_APP_PASSWORD، أو الخزنة المشفّرة (vault: gmail_user, gmail_app_password)
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import nodemailer from "npm:nodemailer@6.9.16";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(URL_, SRK, { auth: { persistSession: false } });
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const ACC_DOMAIN = "acc.attamhid.invalid";
const accEmail = (ref: string) => `${ref}@${ACC_DOMAIN}`;
// بيانات Gmail: من أسرار الدالة إن وُجدت، وإلا من الخزنة المشفّرة في قاعدة البيانات (v82_mail_cred)
let GUSER = (Deno.env.get("GMAIL_USER") || "").trim();
let GPASS = (Deno.env.get("GMAIL_APP_PASSWORD") || "").replace(/\s+/g, "");
let ON = !!(GUSER && GPASS);
let TOKEN = "";
// v105: مزوّد الإرسال — Resend بنطاق المعهد إن ضُبط مفتاحه وعنوانه، وإلا Gmail. الإعدادات تُقرأ من الخزنة كل دقيقة.
let RESEND = "", MFROM = "", CRED_AT = 0;
let LAST_RESEND_ERR = "";
async function loadCred(force = false) {
  if (!force && Date.now() - CRED_AT < 15_000 && TOKEN) return;
  try {
    const { data } = await admin.rpc("v82_mail_cred");
    const c = (data || {}) as { user?: string; pass?: string; token?: string; resend?: string; from?: string };
    TOKEN = String(c.token || "");
    RESEND = String(c.resend || "").trim();
    MFROM = String(c.from || "").trim().toLowerCase();
    if (!(Deno.env.get("GMAIL_USER") && Deno.env.get("GMAIL_APP_PASSWORD"))) {
      const u = String(c.user || "").trim(), p = String(c.pass || "").replace(/\s+/g, "");
      if (u !== GUSER || p !== GPASS) tx = null;
      GUSER = u; GPASS = p;
    }
    ON = !!((GUSER && GPASS) || (RESEND && MFROM));
    CRED_AT = Date.now();
  } catch { /* يبقى على الإعداد السابق */ }
}
const PROVIDER = () => (RESEND && MFROM) ? "resend" : "gmail";

function jwtClaims(tok: string): Record<string, unknown> {
  try { const p = tok.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"); return JSON.parse(atob(p + "===".slice((p.length + 3) % 4))); } catch { return {}; }
}
async function caller(req: Request) {
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!tok) return null;
  const { data } = await admin.auth.getUser(tok);
  const u = data?.user;
  if (!u) return null;
  const { data: p } = await admin.from("profiles").select("role,ref_id").eq("id", u.id).maybeSingle();
  const aal = String(jwtClaims(tok).aal || "aal1");
  const mfa = (u.factors || []).some((f: { status?: string }) => f.status === "verified");
  return { id: u.id, role: p?.role || null, ref: p?.ref_id || null, aal, mfa, email: u.email || "" };
}

let tx: ReturnType<typeof nodemailer.createTransport> | null = null;
function transport() {
  if (!tx) tx = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: GUSER, pass: GPASS } });
  return tx;
}

type Att = { filename?: string; content?: string; content_type?: string; content_id?: string };
type MailIn = { to?: string; subject?: string; html?: string; text?: string; cred_with?: string; cred_with_text?: string; pw?: string; cred_without?: string; cred_without_text?: string; from_name?: string; reply_to?: string; attachments?: Att[] };

// v83: إن كانت لصاحب الرسالة كلمة مرور أولى سارية تُدرج من الخادم ({{PW}})، وإلا نص «بدون كلمة مرور»
// كلمة المرور الحالية (اختارها صاحبها): تُحذف عبارتا «الأولى» و«يجب تغييرها»
function asCurrent(t: string) {
  return t.split("كلمة المرور الأولى").join("كلمة المرور").split("Initial password").join("Password")
    .split("يجب تغيير كلمة المرور إلزامياً عند أول دخول.").join("").split("You must change the password at your first sign-in.").join("")
    .split(" (غيّرها إلزامياً عند أول دخول)").join("").split(" (change it at first sign-in)").join("");
}
function compose(b: MailIn & { cur?: boolean }) {
  const pw = b.pw && b.cred_with ? b.pw : "";
  const fx = (t: string) => b.cur ? asCurrent(t) : t;
  const ch = pw ? fx(String(b.cred_with)).split("{{PW}}").join(pw) : String(b.cred_without || "");
  const ct = pw ? fx(String(b.cred_with_text || b.cred_without_text || "")).split("{{PW}}").join(pw) : String(b.cred_without_text || "");
  // القالب يضع موضع بيانات الدخول في HTML بالعلامة <!--CRED--> وفي النص بـ [[CRED]]
  const html = String(b.html || "").split("[[CRED]]").join(ch).split("<!--CRED-->").join(ch);
  const text = String(b.text || "").split("[[CRED]]").join(ct);
  return { html, text };
}
async function initPw(ref?: string) {
  if (!ref) return "";
  try {
    const { data: a } = await admin.from("v83_acc").select("init_enc,init_exp,must_change").eq("ref_id", ref).maybeSingle();
    if (!a?.init_enc || !a.must_change || (a.init_exp && Date.parse(a.init_exp) < Date.now())) return "";
    return await dec(a.init_enc);
  } catch { return ""; }
}

async function viaResend(b: MailIn, html: string, text: string, name: string) {
  const reply = b.reply_to && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.reply_to) ? b.reply_to : (GUSER || undefined);
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${name} <${MFROM}>`, to: [String(b.to)], subject: String(b.subject || "").slice(0, 300),
      html: html || undefined, text: text || undefined, reply_to: reply,
      attachments: (b.attachments || []).filter((a) => a && a.content).slice(0, 10).map((a) => ({
        filename: String(a.filename || "file").slice(0, 120), content: String(a.content),
        content_type: a.content_type || undefined, content_id: a.content_id || undefined,
      })),
    }),
  });
  if (!r.ok) throw new Error("resend " + r.status + ": " + (await r.text()).slice(0, 300));
  try { const j = await r.json(); return String(j?.id || ""); } catch { return ""; }
}
type Sent = { via: string; id: string };
async function deliver(b: MailIn & { cur?: boolean }): Promise<Sent> {
  const { html, text } = compose(b);
  const name = String(b.from_name || "معهد التمهيد للدراسات الإسلامية واللغوية").replace(/["<>\r\n]/g, "").slice(0, 120);
  if (RESEND && MFROM) {
    try { const id = await viaResend(b, html, text, name); LAST_RESEND_ERR = ""; return { via: "resend", id }; }
    catch (e) { LAST_RESEND_ERR = String((e as Error)?.message || e).slice(0, 300); if (!(GUSER && GPASS)) throw e; console.warn("resend failed → gmail", LAST_RESEND_ERR); }
  }
  await transport().sendMail({
    from: { name, address: GUSER },
    to: String(b.to),
    replyTo: b.reply_to && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.reply_to) ? b.reply_to : undefined,
    subject: String(b.subject || "").slice(0, 300),
    html: html || undefined,
    text: text || undefined,
    attachments: (b.attachments || []).filter((a) => a && a.content).slice(0, 10).map((a) => ({
      filename: String(a.filename || "file").slice(0, 120),
      content: String(a.content),
      encoding: "base64",
      contentType: a.content_type || undefined,
      cid: a.content_id || undefined,
    })),
  });
  return { via: "gmail", id: "" };
}

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

async function retryDue() {
  if (!ON) return { error: "mail_off" };
  const { data } = await admin.from("v63_mail_log").select("id,payload,attempts").eq("status", "failed").lt("attempts", 5).not("payload", "is", null).order("at").limit(20);
  let sent = 0, failed = 0;
  for (const r of data || []) {
    try {
      const { id: mid } = await deliver(r.payload as MailIn);
      await admin.from("v63_mail_log").update({ status: "sent", msg_id: mid || null, sent_at: new Date().toISOString(), attempts: r.attempts + 1, error: null, payload: null }).eq("id", r.id);
      sent++;
    } catch (e) {
      await admin.from("v63_mail_log").update({ attempts: r.attempts + 1, error: String((e as Error)?.message || e).slice(0, 500) }).eq("id", r.id);
      failed++;
    }
  }
  return { ok: true, due: (data || []).length, sent, failed };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty */ }
  const action = String(body.action || "");
  await loadCred(["mail_test", "mail_status", "mail_ready", "probe"].includes(action));

  if (action === "probe") return json({ ok: true, v: "v108-accounts", mail: ON, provider: PROVIDER() });

  // فحص ذاتي من الخادم: يرسل رسالة اختبار إلى بريد المعهد نفسه؛ محمي برمز في الخزنة
  if (action === "selftest") {
    if (!TOKEN || String(body.token || "") !== TOKEN) return json({ error: "forbidden" });
    if (!ON) return json({ error: "mail_off" });
    try {
      const to = String(body.to || "").trim() || GUSER;
      await deliver({ to, subject: "اختبار البريد الرسمي — معهد التمهيد / Mail test — At-Tamhid", text: "هذه رسالة اختبار آلية من نظام معهد التمهيد للتحقق من عمل البريد الرسمي. لا يلزم الرد.\n\nThis is an automatic test message from the At-Tamhid system to verify official email. No reply needed." });
      await admin.from("v63_mail_log").insert({ type: "selftest", to_addr: GUSER, subject: "selftest", status: "sent", sent_at: new Date().toISOString(), attempts: 1 });
      return json({ ok: true, sent_to: GUSER });
    } catch (e) {
      const msg = String((e as Error)?.message || e).slice(0, 500);
      await admin.from("v63_mail_log").insert({ type: "selftest", to_addr: GUSER, subject: "selftest", status: "failed", error: msg, attempts: 1 });
      return json({ error: "send_failed", detail: msg });
    }
  }

  // فحص ذاتي لدورة الحساب كاملة على سجل مؤقت (محمي برمز الخزنة)
  if (action === "acc_selftest") {
    if (!TOKEN || String(body.token || "") !== TOKEN) return json({ error: "forbidden" });
    const ref = "19999999", st: Record<string, unknown> = {};
    const fake = { id: "selftest", email: "selftest" };
    try {
      await admin.from("faculty").upsert({ id: ref, data: { id: ref, name: "selftest" } });
      st.ensure = await accAdmin("ensure", { items: [{ ref_id: ref }] }, fake);
      const rv = await accAdmin("reveal", { ref_id: ref }, fake) as { password?: string };
      st.reveal = !!rv.password;
      st.bad = await accLogin(ref, "wrong-pass-1");
      const lg = await accLogin(ref, rv.password || "") as { ok?: boolean; must_change?: boolean; session?: unknown };
      st.login = { ok: lg.ok, must_change: lg.must_change, session: !!lg.session };
      const { data: a } = await admin.from("v83_acc").select("user_id").eq("ref_id", ref).single();
      st.change = await accChange(a!.user_id, "NewPassw0rd99");
      const rv2 = await accAdmin("reveal", { ref_id: ref }, fake) as { password?: string; current?: boolean };
      st.reveal2 = { same: rv2.password === "NewPassw0rd99", current: rv2.current };
      const lg2 = await accLogin(ref, "NewPassw0rd99") as { ok?: boolean; must_change?: boolean };
      st.login2 = { ok: lg2.ok, must_change: lg2.must_change };
      const c = compose({ cred_with: "كلمة المرور الأولى: {{PW}} يجب تغيير كلمة المرور إلزامياً عند أول دخول.", html: "[[CRED]]", pw: "NewPassw0rd99", cur: true });
      st.mail_current = c.html;
      st.list = ((await accAdmin("list", {}, fake)) as { items?: unknown[] }).items?.length;
    } catch (e) { st.error = String((e as Error)?.message || e); }
    st.remove = await accAdmin("remove", { ref_id: ref }, fake);
    await admin.from("faculty").delete().eq("id", ref);
    await admin.from("v63_acc_log").delete().eq("ref_id", ref);
    return json({ ok: true, st });
  }

  // ---------- v83: الدخول بالرقم (عام) ----------
  if (action === "login") return json(await accLogin(String(body.ident || ""), String(body.password || "")));
  if (action === "forgot") return json(await forgot(String(body.ident || "")));
  if (action === "reset_check") return json(await resetCheck(String(body.token || "")));
  if (action === "reset_pw") return json(await resetPw(String(body.token || ""), String(body.password || "")));
  if (action === "cron") {
    if (!TOKEN || String(body.token || "") !== TOKEN) return json({ error: "forbidden" });
    const n = await notifyRun();
    const r = await retryDue();
    return json({ ok: true, notify: n, retry: r });
  }

  const me = await caller(req);
  // تغيير كلمة المرور: لأي صاحب حساب داخل جلسته
  if (action === "change") {
    if (!me) return json({ error: "auth" });
    return json(await accChange(me.id, String(body.password || "")));
  }
  // رموز الاسترداد للإدارة المركزية (rc_use يعمل قبل اكتمال التحقق الثنائي)
  if (action === "rc_use") {
    if (!me || me.role !== "admin") return json({ error: "forbidden" });
    return json(await rcUse(me.id, String(body.code || ""), !!body.keep));
  }
  if (!me || me.role !== "admin") return json({ error: "forbidden" });
  if (action === "rc_generate" || action === "rc_status") {
    if (me.mfa && me.aal !== "aal2") return json({ error: "mfa_required" });
    return json(action === "rc_generate" ? await rcGenerate(me.id) : await rcStatus(me.id));
  }
  const accActs = ["list", "ensure", "reset", "reveal", "unlock", "log", "rename", "remove", "purge"];
  if (accActs.includes(action)) {
    if (me.mfa && me.aal !== "aal2") return json({ error: "mfa_required" });
    return json(await accAdmin(action, body, me));
  }
  const known = ["mail_status", "mail_ready", "mail", "mail_log", "retry_due", "mail_test"];
  if (!known.includes(action)) return json({ error: "fn_unavailable" });

  if (action === "mail_status") return json({ ok: true, on: ON, from: PROVIDER() === "resend" ? MFROM : (GUSER || null), provider: PROVIDER() });
  if (action === "mail_test") {
    if (!ON) return json({ error: "mail_off" });
    const to = String(body.to || GUSER || "");
    if (!EMAIL.test(to)) return json({ error: "no_email" });
    try {
      const { via, id: mid } = await deliver({ to, subject: "اختبار البريد الرسمي — معهد التمهيد / Official email test — At-Tamhid", text: "هذه رسالة اختبار من بوابة الإدارة المركزية للتحقق من عمل البريد الرسمي بنطاق المعهد. لا يلزم الرد.\n\nThis is a test message from the central administration to verify the Institute's official email. No reply needed." });
      await admin.from("v63_mail_log").insert({ type: "test", to_addr: to, msg_id: mid || null, subject: "mail_test " + via, error: via === "resend" ? null : (LAST_RESEND_ERR || null), status: "sent", sent_at: new Date().toISOString(), attempts: 1, by_user: me.id });
      return json({ ok: true, to, provider: via, from: via === "resend" ? MFROM : GUSER, resend_error: via === "resend" ? undefined : (LAST_RESEND_ERR || (RESEND ? "" : "no_key")) });
    } catch (e) { return json({ error: "send_failed", detail: String((e as Error)?.message || e).slice(0, 400) }); }
  }

  if (action === "mail_ready") {
    const pr = PROVIDER(), fr = pr === "resend" ? MFROM : GUSER;
    let hook = false; try { const { data: hs } = await admin.rpc("v108_hook_secret"); hook = /^whsec_/.test(String(hs || "")); } catch { /* */ }
    return json({ ok: true, key: ON, fromOk: ON, from: fr || "", domain: String(fr || "").split("@")[1] || "", domainStatus: ON ? "verified" : "unknown", cron: true, webhook: hook, provider: pr });
  }

  if (action === "mail_log") {
    const lim = Math.min(Math.max(Number(body.limit) || 100, 1), 500);
    const { data, error } = await admin.from("v63_mail_log")
      .select("id,at,type,ref_id,to_addr,subject,status,error,attempts,sent_at,delivery,delivery_at,delivery_detail").order("at", { ascending: false }).limit(lim);
    if (error) return json({ error: "db", detail: error.message });
    return json({ ok: true, items: (data || []).map((r) => ({ ...r, to: r.to_addr })) });
  }

  if (action === "mail") {
    if (!ON) return json({ error: "mail_off" });
    const b = body as MailIn & { type?: string; ref_id?: string };
    if (!b.to || !EMAIL.test(String(b.to))) return json({ error: "no_email" });
    const payload = { to: b.to, subject: b.subject, html: b.html, text: b.text, cred_with: b.cred_with, cred_with_text: b.cred_with_text, cred_without: b.cred_without, cred_without_text: b.cred_without_text, from_name: b.from_name, reply_to: b.reply_to, attachments: b.attachments };
    // خطاب القبول/التعيين/إعادة التعيين يحمل دائماً كلمة مرور صالحة:
    // الأولى إن وُجدت، وإلا الحالية المحفوظة مشفّرة، وإلا يُعاد التعيين آلياً فتصدر كلمة أولى جديدة
    let pw = await initPw(b.ref_id), cur = false;
    if (!pw && b.ref_id && KIND(String(b.ref_id)) && ["admit", "appoint", "reset"].includes(String(b.type || ""))) {
      const ref = String(b.ref_id);
      const { data: ex } = await admin.from("v83_acc").select("user_id,init_enc,must_change").eq("ref_id", ref).maybeSingle();
      if (!ex) { await accAdmin("ensure", { items: [{ ref_id: ref }] }, me); pw = await initPw(ref); }
      else if (ex.init_enc && !ex.must_change) { try { pw = await dec(ex.init_enc); cur = true; } catch { pw = ""; } }
      if (!pw && ex) { const r = await accAdmin("reset", { ref_id: ref }, me) as { password?: string }; pw = r.password || ""; }
    }
    const { data: row } = await admin.from("v63_mail_log").insert({ type: b.type || null, ref_id: b.ref_id || null, to_addr: String(b.to), subject: String(b.subject || "").slice(0, 300), by_user: me.id, payload, attempts: 1 }).select("id").single();
    try {
      const { via, id: mid } = await deliver({ ...payload, pw, cur });
      if (row) await admin.from("v63_mail_log").update({ status: "sent", msg_id: mid || null, sent_at: new Date().toISOString(), payload: null, error: via === "resend" ? null : ("via gmail" + (LAST_RESEND_ERR ? ": " + LAST_RESEND_ERR : "")) }).eq("id", row.id);
      if (pw) await alog("send", b.ref_id || null, me.email || "admin", String(b.to));
      return json({ ok: true, id: row?.id, password_included: !!pw, provider: via });
    } catch (e) {
      const msg = String((e as Error)?.message || e).slice(0, 500);
      if (row) await admin.from("v63_mail_log").update({ status: "failed", error: msg }).eq("id", row.id);
      return json({ error: "send_failed", detail: msg });
    }
  }

  if (action === "retry_due") return json(await retryDue());

  return json({ error: "fn_unavailable" });
});

// =====================================================================
// v83 — الحسابات وكلمات المرور
// =====================================================================
type Acc = { user_id: string; ref_id: string; role: string; init_enc: string | null; init_exp: string | null; must_change: boolean; fails: number; locked_until: string | null; last_login: string | null; created_at: string; changed_at: string | null };
const KIND = (id: string) => /^\d{9}$/.test(id) ? "student" : /^1\d{7}$/.test(id) ? "faculty" : /^2\d{7}$/.test(id) ? "staff" : null;
const TBL: Record<string, string> = { student: "students", faculty: "faculty", staff: "v51_members" };
const SETK = "auth63";

async function settings() {
  const d = { initDays: 14, maxFail: 5, lockMin: 15, idleMin: 30 };
  try {
    const { data } = await admin.from("v51_settings").select("data").eq("key", SETK).maybeSingle();
    const s = (data?.data || {}) as Record<string, number>;
    for (const k of Object.keys(d) as (keyof typeof d)[]) if (Number(s[k]) > 0) d[k] = Number(s[k]);
  } catch { /* defaults */ }
  return d;
}

let KEY: CryptoKey | null = null;
async function aesKey() {
  if (KEY) return KEY;
  const { data } = await admin.rpc("v83_acc_key");
  const raw = Uint8Array.from(atob(String(data || "")), (c) => c.charCodeAt(0));
  KEY = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
  return KEY;
}
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
async function enc(t: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const c = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await aesKey(), new TextEncoder().encode(t)));
  return b64(iv) + "." + b64(c);
}
async function dec(s: string) {
  const [iv, c] = s.split(".");
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(iv) }, await aesKey(), unb64(c)));
}
function genPw() {
  const L = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ", D = "23456789", A = L + D;
  const r = crypto.getRandomValues(new Uint32Array(12));
  const a = Array.from(r, (x, i) => i === 0 ? L[x % L.length] : i === 1 ? D[x % D.length] : A[x % A.length]);
  for (let i = a.length - 1; i > 0; i--) { const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a.join("");
}
const strong = (p: string) => p.length >= 10 && /[A-Za-z؀-ۿ]/.test(p) && /\d/.test(p);
async function sha(t: string) { return b64(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))); }

async function alog(event: string, ref: string | null, by: string | null, detail = "") {
  try { await admin.from("v63_acc_log").insert({ event, ref_id: ref, by_name: by, detail: detail.slice(0, 300) }); } catch { /* */ }
}
function view(a: Acc, status = "active") {
  const now = Date.now();
  const locked = !!(a.locked_until && Date.parse(a.locked_until) > now);
  const expired = !!(a.must_change && a.init_enc && a.init_exp && Date.parse(a.init_exp) < now);
  return { ref_id: a.ref_id, role: a.role, status, locked, locked_until: a.locked_until, must_change: a.must_change, has_init: !!a.init_enc && !expired, expired, last_login: a.last_login, created_at: a.created_at };
}
async function holder(ref: string, role: string) {
  const t = TBL[role]; if (!t) return null;
  const { data } = await admin.from(t).select("id,data").eq("id", ref).maybeSingle();
  if (!data) return null;
  const d = (data.data || {}) as Record<string, unknown>;
  const off = d.deleted || String(d.active) === "false" || String(d.active) === "0";
  return { name: String(d.name || ""), active: !off };
}

async function accAdmin(action: string, body: Record<string, unknown>, me: { id: string; email: string }) {
  const by = me.email || "admin";
  const cfg = await settings();
  if (action === "list") {
    const { data, error } = await admin.from("v83_acc").select("*");
    if (error) return { error: "db", detail: error.message };
    return { ok: true, items: (data as Acc[] || []).map((a) => view(a)) };
  }
  if (action === "ensure") {
    const days = Math.min(Math.max(Number(body.days) || cfg.initDays, 1), 90);
    const items = ((body.items || []) as { ref_id?: string; role?: string }[]).slice(0, 50);
    const out: unknown[] = [];
    for (const it of items) {
      const ref = String(it.ref_id || ""), role = KIND(ref);
      if (!role) { out.push({ ref_id: ref, error: "bad_id" }); continue; }
      const { data: ex } = await admin.from("v83_acc").select("*").eq("ref_id", ref).maybeSingle();
      if (ex) { out.push(view(ex as Acc)); continue; }
      let h = await holder(ref, role);
      for (let i = 0; !h && i < 8; i++) { await new Promise((r) => setTimeout(r, 1000)); h = await holder(ref, role); }
      if (!h) { out.push({ ref_id: ref, error: "not_found" }); continue; }
      const pw = genPw();
      let uid = "";
      const cr = await admin.auth.admin.createUser({ email: accEmail(ref), password: pw, email_confirm: true, user_metadata: { ref_id: ref, role } });
      if (cr.error) {
        // مستخدم موجود مسبقاً بنفس البريد: يُعاد ربطه وتُعيَّن له كلمة جديدة
        const { data: pr } = await admin.from("profiles").select("id").eq("ref_id", ref).maybeSingle();
        if (!pr) { out.push({ ref_id: ref, error: "create_failed", detail: cr.error.message }); continue; }
        uid = pr.id; await admin.auth.admin.updateUserById(uid, { password: pw });
      } else uid = cr.data.user!.id;
      await admin.from("profiles").upsert({ id: uid, role, ref_id: ref, login_email: accEmail(ref) });
      const row = { user_id: uid, ref_id: ref, role, init_enc: await enc(pw), init_exp: new Date(Date.now() + days * 864e5).toISOString(), must_change: true, fails: 0 };
      const { data: ins, error } = await admin.from("v83_acc").insert(row).select("*").single();
      if (error) { out.push({ ref_id: ref, error: "db", detail: error.message }); continue; }
      await alog("create", ref, by, h.name);
      out.push(view(ins as Acc));
    }
    return { ok: true, items: out };
  }
  if (action === "log") {
    const lim = Math.min(Math.max(Number(body.limit) || 100, 1), 500);
    const { data } = await admin.from("v63_acc_log").select("at,event,ref_id,by_name,detail").order("at", { ascending: false }).limit(lim);
    return { ok: true, items: data || [] };
  }
  if (action === "rename") {
    const map = (body.map || {}) as Record<string, string>; const done: string[][] = [];
    for (const [o, n] of Object.entries(map)) {
      const { data: a } = await admin.from("v83_acc").select("*").eq("ref_id", o).maybeSingle();
      if (!a || !KIND(n)) continue;
      await admin.from("v83_acc").update({ ref_id: n, role: KIND(n) }).eq("user_id", a.user_id);
      await admin.from("profiles").update({ ref_id: n, role: KIND(n), login_email: accEmail(n) }).eq("id", a.user_id);
      await admin.auth.admin.updateUserById(a.user_id, { email: accEmail(n), email_confirm: true });
      await alog("rename", n, by, o + " → " + n); done.push([o, n]);
    }
    return { ok: true, done };
  }
  if (action === "remove" || action === "purge") {
    const refs = action === "purge" ? ((body.refs || []) as string[]) : [String(body.ref_id || "")];
    const done: string[] = [];
    for (const ref of refs.slice(0, 200)) {
      const { data: a } = await admin.from("v83_acc").select("user_id").eq("ref_id", ref).maybeSingle();
      if (a) { await admin.auth.admin.deleteUser(a.user_id); await alog("remove", ref, by); }
      done.push(ref);
    }
    return { ok: true, done };
  }
  const ref = String(body.ref_id || "");
  const { data: a0 } = await admin.from("v83_acc").select("*").eq("ref_id", ref).maybeSingle();
  let a = a0 as Acc | null;
  if (action === "reset") {
    const days = Math.min(Math.max(Number(body.days) || cfg.initDays, 1), 90);
    if (!a) {
      const r = await accAdmin("ensure", { days, items: [{ ref_id: ref }] }, me) as { items: { error?: string }[] };
      if (r.items?.[0]?.error) return { error: r.items[0].error };
      const { data } = await admin.from("v83_acc").select("*").eq("ref_id", ref).single(); a = data as Acc;
      const pw = await dec(a.init_enc!);
      return { ok: true, view: view(a), password: pw, expires: a.init_exp };
    }
    const pw = genPw();
    const up = await admin.auth.admin.updateUserById(a.user_id, { password: pw });
    if (up.error) return { error: "auth", detail: up.error.message };
    const exp = new Date(Date.now() + days * 864e5).toISOString();
    const { data } = await admin.from("v83_acc").update({ init_enc: await enc(pw), init_exp: exp, must_change: true, fails: 0, locked_until: null }).eq("user_id", a.user_id).select("*").single();
    await alog("reset", ref, by);
    return { ok: true, view: view(data as Acc), password: pw, expires: exp };
  }
  if (!a) return { error: "not_found" };
  if (action === "reveal") {
    if (!a.init_enc) return { error: "gone" };
    if (a.must_change && a.init_exp && Date.parse(a.init_exp) < Date.now()) return { error: "expired" };
    await alog("reveal", ref, by);
    return { ok: true, password: await dec(a.init_enc), expires: a.init_exp, current: !a.must_change };
  }
  if (action === "unlock") {
    const { data } = await admin.from("v83_acc").update({ fails: 0, locked_until: null }).eq("user_id", a.user_id).select("*").single();
    await alog("unlock", ref, by);
    return { ok: true, view: view(data as Acc) };
  }
  return { error: "fn_unavailable" };
}

async function accLogin(ident: string, password: string) {
  const ref = ident.replace(/\s+/g, "");
  if (!/^\d+$/.test(ref) || !password) return { error: "bad" };
  const cfg = await settings();
  const { data: a } = await admin.from("v83_acc").select("*").eq("ref_id", ref).maybeSingle() as { data: Acc | null };
  if (!a) return { error: "bad" };
  if (a.locked_until && Date.parse(a.locked_until) > Date.now()) return { error: "locked", until: a.locked_until };
  const h = await holder(ref, a.role);
  if (!h || !h.active) { await alog("login_fail", ref, null, "inactive"); return { error: "bad" }; }
  if (a.must_change && a.init_enc && a.init_exp && Date.parse(a.init_exp) < Date.now()) return { error: "expired" };
  const pub = createClient(URL_, ANON, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await pub.auth.signInWithPassword({ email: accEmail(ref), password });
  if (error || !data.session) {
    const fails = (a.fails || 0) + 1;
    if (fails >= cfg.maxFail) {
      const until = new Date(Date.now() + cfg.lockMin * 60e3).toISOString();
      await admin.from("v83_acc").update({ fails: 0, locked_until: until }).eq("user_id", a.user_id);
      await alog("locked", ref, null, String(fails));
      return { error: "locked", until };
    }
    await admin.from("v83_acc").update({ fails }).eq("user_id", a.user_id);
    await alog("login_fail", ref, null);
    return { error: "bad", left: cfg.maxFail - fails };
  }
  await admin.from("v83_acc").update({ fails: 0, locked_until: null, last_login: new Date().toISOString() }).eq("user_id", a.user_id);
  await alog("login", ref, null);
  let units: unknown = null;
  if (a.role === "staff") { const { data: m } = await admin.from("v51_members").select("data").eq("id", ref).maybeSingle(); const d = (m?.data || {}) as Record<string, unknown>; units = [d.unitId, ...((d.units as unknown[]) || [])].filter(Boolean); }
  return { ok: true, session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token }, role: a.role, ref_id: ref, must_change: !!a.must_change, idle: cfg.idleMin, units };
}

async function accChange(uid: string, password: string) {
  if (!strong(password)) return { error: "weak" };
  const { data: a } = await admin.from("v83_acc").select("ref_id,init_enc").eq("user_id", uid).maybeSingle();
  const { data: mc } = await admin.from("v83_acc").select("must_change").eq("user_id", uid).maybeSingle();
  if (mc?.must_change && a?.init_enc && (await dec(a.init_enc)) === password) return { error: "weak" };
  const up = await admin.auth.admin.updateUserById(uid, { password });
  if (up.error) return { error: "weak", detail: up.error.message };
  if (a) {
    // v83.1: بطلب الإدارة تبقى نسخة مشفّرة من كلمة المرور الحالية لتعرضها الإدارة المركزية وحدها (كل عرض يُسجَّل)
    await admin.from("v83_acc").update({ init_enc: await enc(password), init_exp: null, must_change: false, changed_at: new Date().toISOString() }).eq("user_id", uid);
    await alog("pw_changed", a.ref_id, a.ref_id);
  }
  return { ok: true };
}

// ---------- رموز الاسترداد (الإدارة المركزية) ----------
async function rcGenerate(uid: string) {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const codes = Array.from({ length: 10 }, () => { const r = crypto.getRandomValues(new Uint32Array(8)); const s = Array.from(r, (x) => A[x % A.length]).join(""); return s.slice(0, 4) + "-" + s.slice(4); });
  await admin.from("v63_rc").delete().eq("user_id", uid);
  await admin.from("v63_rc").insert(await Promise.all(codes.map(async (c) => ({ user_id: uid, hash: await sha(c) }))));
  return { ok: true, codes };
}
async function rcStatus(uid: string) {
  const { count } = await admin.from("v63_rc").select("hash", { count: "exact", head: true }).eq("user_id", uid).is("used_at", null);
  return { ok: true, left: count || 0 };
}
async function rcUse(uid: string, code: string, keep: boolean) {
  const since = new Date(Date.now() - 3600e3).toISOString();
  const { count: f } = await admin.from("v63_rc_fail").select("at", { count: "exact", head: true }).eq("user_id", uid).gt("at", since);
  if ((f || 0) >= 5) return { error: "locked" };
  const norm = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const h = await sha(norm.slice(0, 4) + "-" + norm.slice(4));
  const { data } = await admin.from("v63_rc").select("hash").eq("user_id", uid).eq("hash", h).is("used_at", null).maybeSingle();
  if (!data) { await admin.from("v63_rc_fail").insert({ user_id: uid }); return { error: "bad" }; }
  await admin.from("v63_rc").update({ used_at: new Date().toISOString() }).eq("user_id", uid).eq("hash", h);
  if (!keep) {
    const { data: fl } = await admin.auth.admin.mfa.listFactors({ userId: uid });
    for (const x of fl?.factors || []) await admin.auth.admin.mfa.deleteFactor({ id: x.id, userId: uid });
  }
  const st = await rcStatus(uid);
  return { ok: true, left: st.left };
}

// =====================================================================
// v108 — قالب البريد على الخادم + إشعارات الطلاب + «نسيت كلمة المرور»
// =====================================================================
const NV = "#14284B", SV = "#9AA6AE", BG = "#EEF1F5";
const esc = (x: unknown) => String(x ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
type Brand = { nameAr: string; nameEn: string; base: string; contact: string; logo: string };
let BRAND: Brand | null = null, BRAND_AT = 0;
async function brand(): Promise<Brand> {
  if (BRAND && Date.now() - BRAND_AT < 10 * 60e3) return BRAND;
  const { data: rows } = await admin.from("v51_settings").select("key,data").in("key", ["inst", "mailLogo108"]);
  const { data: hm } = await admin.from("settings").select("data").eq("key", "home").maybeSingle();
  const g = (k: string) => ((rows || []).find((r) => r.key === k)?.data ?? null) as Record<string, unknown> | string | null;
  const inst = (g("inst") || {}) as Record<string, string>;
  const h = (hm?.data || {}) as Record<string, string>;
  let base = String(h.domain || "https://attamhid.com/").trim();
  if (!/^https:\/\//.test(base)) base = "https://attamhid.com/";
  if (!base.endsWith("/")) base += "/";
  const lg = g("mailLogo108");
  const logo = typeof lg === "string" ? lg : String((lg as Record<string, string> | null)?.png || "");
  BRAND = {
    nameAr: inst.nameAr || "معهد التمهيد للدراسات الإسلامية واللغوية",
    nameEn: inst.nameEn || "At-Tamhid Institute for Islamic and Linguistic Studies",
    base, logo: /^[A-Za-z0-9+/=]{100,}$/.test(logo) ? logo : "",
    contact: [inst.addrAr, h.p1, h.p2, h.em].filter(Boolean).map((x) => esc(x)).join(" · "),
  };
  BRAND_AT = Date.now();
  return BRAND;
}
const P = (t: string, dir: "rtl" | "ltr") => t.split(/\n+/).filter((x) => x.trim()).map((x) =>
  `<p class="tx" dir="${dir}" style="margin:0 0 12px;font-size:16px;line-height:1.7;text-align:${dir === "rtl" ? "right" : "left"}">${esc(x)}</p>`).join("");
type Tpl = { subject: string; titleAr: string; titleEn: string; dearAr: string; dearEn: string; ar: string; en: string; extraAr?: string; extraEn?: string; btn?: { url: string; ar: string; en: string }; noteAr?: string; noteEn?: string };
async function render(t: Tpl) {
  const B = await brand();
  const btn = t.btn ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px"><tr><td align="center"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${NV};border-radius:8px"><a href="${esc(t.btn.url)}" target="_blank" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;font-family:Tahoma,Arial,sans-serif"><span dir="rtl">${esc(t.btn.ar)}</span><br><span dir="ltr" style="font-size:14px;font-weight:600">${esc(t.btn.en)}</span></a></td></tr></table></td></tr></table>` : "";
  const note = (t.noteAr || t.noteEn) ? `<p class="tx mu" dir="rtl" style="margin:0 0 4px;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:right">${esc(t.noteAr || "")}</p><p class="tx mu" dir="ltr" style="margin:0;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:left">${esc(t.noteEn || "")}</p>` : "";
  const logo = B.logo ? `<td width="110" valign="middle"><img src="cid:logo64" alt="شعار معهد التمهيد / At-Tamhid Institute logo" width="96" style="display:block;width:96px;height:auto;background:#fff;border-radius:6px;padding:4px"></td>` : "";
  const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(t.subject)}</title>` +
    `<style>@media (max-width:620px){.wrap{width:100%!important}.pad{padding:18px 16px!important}}@media (prefers-color-scheme:dark){.bg{background:#0B1322!important}.card{background:#141F33!important}.tx{color:#E6EBF2!important}.mu{color:#B9C3D0!important}.box{background:#1C2A42!important;border-color:#2C3E5C!important}.ft{background:#0F1828!important}}</style></head>` +
    `<body style="margin:0;padding:0;background:${BG}" class="bg"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG}" class="bg"><tr><td align="center" style="padding:20px 8px">` +
    `<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;border-collapse:collapse;font-family:Tahoma,Arial,'Segoe UI',sans-serif;color:#16202E">` +
    `<tr><td style="background:${NV};padding:18px 22px;border-radius:10px 10px 0 0;border-bottom:3px solid ${SV}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${logo}` +
    `<td valign="middle" style="color:#fff;text-align:right" dir="rtl"><div style="font-size:17px;font-weight:700;line-height:1.5">${esc(B.nameAr)}</div><div dir="ltr" style="font-size:13px;line-height:1.5;color:#D7DDE6;text-align:right">${esc(B.nameEn)}</div></td></tr></table></td></tr>` +
    `<tr><td class="card pad" style="background:#ffffff;padding:26px 28px">` +
    `<h1 class="tx" style="margin:0 0 4px;font-size:23px;line-height:1.4;color:${NV};text-align:right" dir="rtl">${esc(t.titleAr)}</h1><div class="tx" dir="ltr" style="font-size:18px;line-height:1.4;color:${NV};text-align:left;margin:0 0 18px;font-weight:700">${esc(t.titleEn)}</div>` +
    `<p class="tx" dir="rtl" style="margin:0 0 12px;font-size:16px;font-weight:700;text-align:right">${esc(t.dearAr)}،</p>${P(t.ar, "rtl")}${t.extraAr || ""}` +
    btn +
    `<hr style="border:none;border-top:1px solid #D5DCE4;margin:16px 0">` +
    `<p class="tx" dir="ltr" style="margin:0 0 12px;font-size:16px;font-weight:700;text-align:left">${esc(t.dearEn)},</p>${P(t.en, "ltr")}${t.extraEn || ""}` +
    `</td></tr><tr><td class="ft" style="background:#F6F8FA;padding:16px 22px;border-radius:0 0 10px 10px;border-top:1px solid #E1E6EC">${note}` +
    `<p class="tx mu" dir="rtl" style="margin:8px 0 0;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:right">هذه رسالة آلية من معهد التمهيد، فلا تردّ عليها.</p><p class="tx mu" dir="ltr" style="margin:0;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:left">This is an automated message from At-Tamhid Institute; please do not reply.</p>` +
    (B.contact ? `<p class="mu" style="margin:10px 0 0;font-size:12.5px;line-height:1.5;color:#4a5a70;text-align:center">${B.contact}</p>` : "") +
    `</td></tr></table></td></tr></table></body></html>`;
  const strip = (h: string) => h.replace(/<br>/g, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  const text = [t.titleAr + " / " + t.titleEn, "", t.dearAr + "،", t.ar, strip(t.extraAr || ""), t.btn ? t.btn.ar + ": " + t.btn.url : "", "", "------------------------------", t.dearEn + ",", t.en, strip(t.extraEn || ""), t.btn ? t.btn.en + ": " + t.btn.url : "", "", t.noteAr || "", t.noteEn || ""].join("\n");
  const attachments: Att[] = B.logo ? [{ filename: "logo.png", content: B.logo, content_type: "image/png", content_id: "logo64" }] : [];
  return { html, text, attachments };
}
async function sendLogged(type: string, ref: string, to: string, t: Tpl, by: string | null = null) {
  const { html, text, attachments } = await render(t);
  const payload = { to, subject: t.subject, html, text, attachments };
  const { data: row } = await admin.from("v63_mail_log").insert({ type, ref_id: ref, to_addr: to, subject: t.subject.slice(0, 300), by_user: by, payload, attempts: 1 }).select("id").single();
  try {
    const { via, id } = await deliver(payload);
    if (row) await admin.from("v63_mail_log").update({ status: "sent", msg_id: id || null, sent_at: new Date().toISOString(), payload: null, error: via === "resend" ? null : "via gmail" }).eq("id", row.id);
    return { ok: true, id: row?.id };
  } catch (e) {
    const msg = String((e as Error)?.message || e).slice(0, 500);
    if (row) await admin.from("v63_mail_log").update({ status: "failed", error: msg }).eq("id", row.id);
    return { ok: false, id: row?.id, error: msg };
  }
}
type Person = { id: string; email: string; name: string; nameEn: string; f: boolean };
function person(id: string, d: Record<string, unknown>): Person {
  const sx = String(d.sex || d.gender || "").toLowerCase();
  return { id, email: String(d.email || "").trim(), name: String(d.name || ""), nameEn: String(d.nameEn || d.name || ""), f: /أنثى|female|^f$|انثى/.test(sx) };
}
const dearA = (p: Person, kind: string) => (kind === "student" ? (p.f ? "عزيزتي الطالبة " : "عزيزي الطالب ") : (p.f ? "المكرمة الأستاذة " : "المكرم الأستاذ ")) + p.name;
const dearE = (p: Person) => "Dear " + p.nameEn;
function fmtDate(d: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(d || "");
  if (!m) return d || "";
  return `${m[1]}-${m[2]}-${m[3]}` + (m[4] ? ` ${m[4]}:${m[5]}` : "");
}

// ---------- إشعارات الطلاب ----------
async function notifyRun() {
  if (!ON) return { error: "mail_off" };
  const { data: q } = await admin.from("v108_notify").select("*").eq("status", "pending").lt("tries", 5).order("id").limit(300);
  if (!q || !q.length) return { sent: 0, failed: 0 };
  const B = await brand();
  const refs = [...new Set(q.map((r) => r.ref_id))];
  const { data: st } = await admin.from("students").select("id,data").in("id", refs);
  const S = new Map<string, Record<string, unknown>>((st || []).map((r) => [r.id, r.data as Record<string, unknown>]));
  const cids = [...new Set(q.filter((r) => r.kind === "grade").map((r) => String(r.data?.course || "")))];
  const exIds = [...new Set(q.filter((r) => r.kind === "exam").map((r) => String(r.data?.exam || "")))];
  const nwIds = [...new Set(q.filter((r) => r.kind === "news").map((r) => String(r.data?.news || "")))];
  const { data: ex } = exIds.length ? await admin.from("exams").select("id,data").in("id", exIds) : { data: [] };
  const EX = new Map<string, Record<string, unknown>>((ex || []).map((r) => [String(r.id), r.data as Record<string, unknown>]));
  const allC = [...cids, ...[...EX.values()].map((d) => String((d as Record<string, unknown>).courseId || ""))].filter(Boolean);
  const { data: cr } = allC.length ? await admin.from("v51_program_courses").select("id,data").in("id", allC) : { data: [] };
  const C = new Map<string, Record<string, unknown>>((cr || []).map((r) => [String(r.id), r.data as Record<string, unknown>]));
  const { data: nw } = nwIds.length ? await admin.from("news").select("id,data").in("id", nwIds) : { data: [] };
  const NW = new Map<string, Record<string, unknown>>((nw || []).map((r) => [String(r.id), r.data as Record<string, unknown>]));
  const cName = (id: string) => { const c = (C.get(id) || {}) as Record<string, unknown>; return { ar: String(c.name || id), en: String(c.nameEn || c.name || id), code: String(c.code || "") }; };
  const done = async (ids: number[], ok: boolean, mailId?: number, err?: string, skip = false) => {
    for (const id of ids) {
      const r = q.find((x) => x.id === id)!;
      await admin.from("v108_notify").update(skip ? { status: "skipped", error: err || null } : ok ? { status: "sent", sent_at: new Date().toISOString(), mail_id: mailId || null, error: null } : { tries: r.tries + 1, error: err || null, status: r.tries + 1 >= 5 ? "failed" : "pending" }).eq("id", id);
    }
  };
  // تجميع: كل درجات الطالب في رسالة واحدة؛ الإعلان والاختبار رسالة لكل منهما
  const groups = new Map<string, typeof q>();
  for (const r of q) { const g = r.kind === "grade" ? `grade:${r.ref_id}` : `${r.kind}:${r.id}`; if (!groups.has(g)) groups.set(g, []); groups.get(g)!.push(r); }
  let sent = 0, failed = 0, skipped = 0;
  const portal = (id: string) => B.base + "?p=" + encodeURIComponent(id);
  for (const [, rows] of groups) {
    const r0 = rows[0], d = S.get(r0.ref_id);
    const ids = rows.map((r) => r.id as number);
    if (!d || !EMAIL.test(String(d.email || "")) || d.deleted) { await done(ids, false, 0, "no_email", true); skipped++; continue; }
    const p = person(r0.ref_id, d);
    let t: Tpl | null = null;
    if (r0.kind === "grade") {
      const rowsH = (lang: "ar" | "en") => rows.map((r) => { const c = cName(String(r.data?.course || "")); const gl = String(r.data?.gl || ""); return `<tr><td class="tx" style="padding:7px 10px;border-bottom:1px solid #E1E6EC;text-align:${lang === "ar" ? "right" : "left"}" dir="${lang === "ar" ? "rtl" : "ltr"}">${esc(c.code ? c.code + " — " : "")}${esc(lang === "ar" ? c.ar : c.en)}</td><td class="tx" style="padding:7px 10px;border-bottom:1px solid #E1E6EC;text-align:center;font-weight:700" dir="ltr">${esc(r.data?.score ?? "")}</td>${lang === "ar" ? `<td class="tx" style="padding:7px 10px;border-bottom:1px solid #E1E6EC;text-align:center">${esc(gl)}</td>` : ""}</tr>`; }).join("");
      const tbl = (lang: "ar" | "en") => `<table role="presentation" class="box" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:4px 0 14px;background:${BG};border:1px solid #D5DCE4;border-radius:8px" dir="${lang === "ar" ? "rtl" : "ltr"}"><tr><th class="tx" style="padding:8px 10px;text-align:${lang === "ar" ? "right" : "left"};font-size:14px">${lang === "ar" ? "المقرر" : "Course"}</th><th class="tx" style="padding:8px 10px;font-size:14px">${lang === "ar" ? "الدرجة" : "Score"}</th>${lang === "ar" ? `<th class="tx" style="padding:8px 10px;font-size:14px">التقدير</th>` : ""}</tr>${rowsH(lang)}</table>`;
      t = { subject: "رصد درجات جديدة — معهد التمهيد / New Grades Posted — At-Tamhid", titleAr: "رُصدت لكم درجات جديدة", titleEn: "New Grades Posted", dearAr: dearA(p, "student"), dearEn: dearE(p),
        ar: `رُصدت في سجلكم الأكاديمي ${rows.length === 1 ? "درجة جديدة" : rows.length + " درجات جديدة"}، وهذه تفاصيلها:`, extraAr: tbl("ar") + P("يمكنكم الاطلاع على سجلكم كاملاً ومعدلكم في البوابة.", "rtl"),
        en: `${rows.length === 1 ? "A new grade has" : rows.length + " new grades have"} been posted to your academic record:`, extraEn: tbl("en") + P("You can view your full record and GPA in the portal.", "ltr"),
        btn: { url: portal(p.id), ar: "عرض درجاتي في البوابة", en: "View my grades in the portal" } };
    } else if (r0.kind === "news") {
      const n = NW.get(String(r0.data?.news || ""));
      if (!n) { await done(ids, false, 0, "news_gone", true); skipped++; continue; }
      const title = String(n.title || ""), body = String(n.body || "").slice(0, 1500);
      t = { subject: "إعلان جديد — معهد التمهيد / New Announcement — At-Tamhid: " + title.slice(0, 120), titleAr: "إعلان جديد من المعهد", titleEn: "New Announcement", dearAr: dearA(p, "student"), dearEn: dearE(p),
        ar: "نشر المعهد إعلاناً جديداً:", extraAr: `<div class="box" dir="rtl" style="background:${BG};border:1px solid #D5DCE4;border-radius:8px;padding:12px 14px;margin:0 0 14px;text-align:right"><p class="tx" style="margin:0 0 6px;font-size:17px;font-weight:700">${esc(title)}</p>${n.ev ? `<p class="tx mu" style="margin:0 0 6px;font-size:14px;color:#4a5a70">الموعد: <b dir="ltr">${esc(fmtDate(String(n.ev)))}</b></p>` : ""}${P(body, "rtl")}</div>`,
        en: "The Institute has published a new announcement (in Arabic above). Details are on the website.",
        btn: { url: B.base + "#/news", ar: "قراءة الإعلان في الموقع", en: "Read it on the website" } };
    } else if (r0.kind === "exam") {
      const e = EX.get(String(r0.data?.exam || ""));
      if (!e) { await done(ids, false, 0, "exam_gone", true); skipped++; continue; }
      const c = cName(String(e.courseId || "")), when = fmtDate(String(e.date || "")), mins = Number(e.min) || 0;
      const box = (lang: "ar" | "en") => `<div class="box" dir="${lang === "ar" ? "rtl" : "ltr"}" style="background:${BG};border:1px solid #D5DCE4;border-radius:8px;padding:12px 14px;margin:0 0 14px;text-align:${lang === "ar" ? "right" : "left"}"><p class="tx" style="margin:0 0 6px;font-size:16px;font-weight:700">${esc(lang === "ar" ? String(e.title || c.ar) : String(e.titleEn || "Exam: " + c.en))}</p><p class="tx" style="margin:0;font-size:15px">${lang === "ar" ? "الموعد (بتوقيت مكة المكرمة): " : "Time (Makkah time, UTC+3): "}<b dir="ltr">${esc(when)}</b>${mins ? (lang === "ar" ? " · المدة: " + mins + " دقيقة" : " · Duration: " + mins + " min") : ""}</p></div>`;
      t = { subject: "تذكير بموعد اختبار — معهد التمهيد / Exam Reminder — At-Tamhid", titleAr: "تذكير بموعد الاختبار", titleEn: "Exam Reminder", dearAr: dearA(p, "student"), dearEn: dearE(p),
        ar: "نذكّركم بموعد الاختبار القادم:", extraAr: box("ar") + P("يُفتح الاختبار في البوابة عند موعده. تأكدوا من اتصالكم بالإنترنت قبل البدء.", "rtl"),
        en: "This is a reminder of your upcoming exam:", extraEn: box("en") + P("The exam opens in the portal at its scheduled time. Please check your internet connection before you start.", "ltr"),
        btn: { url: portal(p.id), ar: "الدخول إلى البوابة", en: "Sign in to the portal" } };
    }
    if (!t) { await done(ids, false, 0, "unknown", true); skipped++; continue; }
    const r = await sendLogged("notify_" + r0.kind, p.id, p.email, t);
    if (r.ok) { await done(ids, true, r.id); sent++; } else { await done(ids, false, 0, r.error); failed++; }
  }
  return { sent, failed, skipped };
}

// ---------- «نسيت كلمة المرور» ----------
const b64u = (u: Uint8Array) => btoa(String.fromCharCode(...u)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function forgot(ident: string) {
  const ok = { ok: true }; // لا نكشف هل الرقم موجود
  const ref = ident.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/\s+/g, "");
  if (!/^\d{8,9}$/.test(ref) || !ON) return ok;
  const hour = new Date(Date.now() - 3600e3).toISOString();
  const { count: perRef } = await admin.from("v108_pw_reset").select("hash", { count: "exact", head: true }).eq("ref_id", ref).gt("at", hour);
  const { count: all } = await admin.from("v108_pw_reset").select("hash", { count: "exact", head: true }).gt("at", new Date(Date.now() - 600e3).toISOString());
  if ((perRef || 0) >= 3 || (all || 0) >= 40) return ok;
  const { data: a } = await admin.from("v83_acc").select("user_id,role").eq("ref_id", ref).maybeSingle();
  if (!a) return ok;
  const t = TBL[a.role]; if (!t) return ok;
  const { data: h } = await admin.from(t).select("id,data").eq("id", ref).maybeSingle();
  const d = (h?.data || {}) as Record<string, unknown>;
  if (!h || d.deleted || String(d.active) === "false" || String(d.active) === "0") return ok;
  const p = person(ref, d);
  if (!EMAIL.test(p.email)) return ok;
  const tok = b64u(crypto.getRandomValues(new Uint8Array(32)));
  await admin.from("v108_pw_reset").insert({ hash: await sha(tok), ref_id: ref, user_id: a.user_id, exp: new Date(Date.now() + 30 * 60e3).toISOString() });
  const B = await brand();
  const url = B.base + "#/reset/" + tok;
  await sendLogged("forgot", ref, p.email, {
    subject: "إعادة تعيين كلمة المرور — معهد التمهيد / Reset Your Password — At-Tamhid",
    titleAr: "إعادة تعيين كلمة المرور", titleEn: "Reset Your Password", dearAr: dearA(p, a.role === "student" ? "student" : "staff"), dearEn: dearE(p),
    ar: `طُلبت إعادة تعيين كلمة المرور لحسابكم ذي الرقم ${ref}. اضغطوا الزر أدناه لاختيار كلمة مرور جديدة. الرابط صالح 30 دقيقة ولمرة واحدة فقط.`,
    en: `A password reset was requested for your account number ${ref}. Press the button to choose a new password. The link is valid for 30 minutes and can be used once.`,
    btn: { url, ar: "تعيين كلمة مرور جديدة", en: "Set a new password" },
    noteAr: "إن لم تطلبوا ذلك فتجاهلوا هذه الرسالة، ولن تتغير كلمة المرور.", noteEn: "If you did not request this, ignore this message; your password will not change.",
  });
  await alog("forgot", ref, ref, p.email.replace(/^(.{2}).*(@.*)$/, "$1***$2"));
  return ok;
}
async function tokRow(token: string) {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
  const { data } = await admin.from("v108_pw_reset").select("*").eq("hash", await sha(token)).maybeSingle();
  if (!data || data.used_at || Date.parse(data.exp) < Date.now()) return null;
  return data as { hash: string; ref_id: string; user_id: string; exp: string };
}
async function resetCheck(token: string) {
  const r = await tokRow(token);
  return r ? { ok: true, ref_id: r.ref_id, exp: r.exp } : { error: "invalid" };
}
async function resetPw(token: string, password: string) {
  const r = await tokRow(token);
  if (!r) return { error: "invalid" };
  if (!strong(password)) return { error: "weak" };
  const c = await accChange(r.user_id, password) as { ok?: boolean; error?: string };
  if (!c.ok) return c;
  await admin.from("v108_pw_reset").update({ used_at: new Date().toISOString() }).eq("ref_id", r.ref_id).is("used_at", null);
  await admin.from("v83_acc").update({ fails: 0, locked_until: null }).eq("user_id", r.user_id);
  await alog("pw_reset_self", r.ref_id, r.ref_id);
  try {
    const { data: a } = await admin.from("v83_acc").select("role").eq("user_id", r.user_id).maybeSingle();
    const t = a ? TBL[a.role] : ""; const { data: h } = t ? await admin.from(t).select("data").eq("id", r.ref_id).maybeSingle() : { data: null };
    const p = person(r.ref_id, (h?.data || {}) as Record<string, unknown>);
    if (EMAIL.test(p.email)) {
      const B = await brand();
      await sendLogged("pw_changed", r.ref_id, p.email, {
        subject: "تم تغيير كلمة المرور — معهد التمهيد / Password Changed — At-Tamhid", titleAr: "تم تغيير كلمة المرور", titleEn: "Your Password Was Changed",
        dearAr: dearA(p, a?.role === "student" ? "student" : "staff"), dearEn: dearE(p),
        ar: `تغيّرت كلمة المرور لحسابكم ذي الرقم ${r.ref_id} الآن. إن لم تكونوا أنتم من غيّرها فتواصلوا فوراً مع قسم القبول والتسجيل.`,
        en: `The password for your account number ${r.ref_id} has just been changed. If this was not you, contact the Admission & Registration Department immediately.`,
        btn: { url: B.base + "?p=" + encodeURIComponent(r.ref_id), ar: "الدخول إلى البوابة", en: "Sign in to the portal" } });
    }
  } catch { /* */ }
  return { ok: true, ref_id: r.ref_id };
}
