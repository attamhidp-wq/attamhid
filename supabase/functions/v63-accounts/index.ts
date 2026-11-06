// v63-accounts — الجزء الخاص بالبريد الرسمي (إرسال عبر Gmail SMTP)
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
async function loadCred() {
  if (ON && TOKEN) return;
  try {
    const { data } = await admin.rpc("v82_mail_cred");
    const c = (data || {}) as { user?: string; pass?: string; token?: string };
    TOKEN = String(c.token || "");
    if (ON) return;
    GUSER = String(c.user || "").trim();
    GPASS = String(c.pass || "").replace(/\s+/g, "");
    ON = !!(GUSER && GPASS);
  } catch { /* يبقى غير مفعّل */ }
}

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
function compose(b: MailIn) {
  const pw = b.pw && b.cred_with ? b.pw : "";
  const ch = pw ? String(b.cred_with).split("{{PW}}").join(pw) : String(b.cred_without || "");
  const ct = pw ? String(b.cred_with_text || b.cred_without_text || "").split("{{PW}}").join(pw) : String(b.cred_without_text || "");
  const html = String(b.html || "").split("[[CRED]]").join(ch);
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

async function deliver(b: MailIn) {
  const { html, text } = compose(b);
  const name = String(b.from_name || "معهد التمهيد للدراسات الإسلامية واللغوية").replace(/["<>\r\n]/g, "").slice(0, 120);
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
}

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty */ }
  const action = String(body.action || "");
  await loadCred();

  if (action === "probe") return json({ ok: true, v: "v83-accounts", mail: ON });

  // فحص ذاتي من الخادم: يرسل رسالة اختبار إلى بريد المعهد نفسه؛ محمي برمز في الخزنة
  if (action === "selftest") {
    if (!TOKEN || String(body.token || "") !== TOKEN) return json({ error: "forbidden" });
    if (!ON) return json({ error: "mail_off" });
    try {
      await deliver({ to: GUSER, subject: "اختبار البريد الرسمي — معهد التمهيد / Mail test — At-Tamhid", text: "هذه رسالة اختبار آلية من نظام معهد التمهيد للتحقق من عمل البريد الرسمي. لا يلزم الرد.\n\nThis is an automatic test message from the At-Tamhid system to verify official email. No reply needed." });
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
      st.reveal2 = await accAdmin("reveal", { ref_id: ref }, fake);
      const lg2 = await accLogin(ref, "NewPassw0rd99") as { ok?: boolean; must_change?: boolean };
      st.login2 = { ok: lg2.ok, must_change: lg2.must_change };
      st.list = ((await accAdmin("list", {}, fake)) as { items?: unknown[] }).items?.length;
    } catch (e) { st.error = String((e as Error)?.message || e); }
    st.remove = await accAdmin("remove", { ref_id: ref }, fake);
    await admin.from("faculty").delete().eq("id", ref);
    await admin.from("v63_acc_log").delete().eq("ref_id", ref);
    return json({ ok: true, st });
  }

  // ---------- v83: الدخول بالرقم (عام) ----------
  if (action === "login") return json(await accLogin(String(body.ident || ""), String(body.password || "")));

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
  const known = ["mail_status", "mail_ready", "mail", "mail_log", "retry_due"];
  if (!known.includes(action)) return json({ error: "fn_unavailable" });

  if (action === "mail_status") return json({ ok: true, on: ON, from: GUSER || null, provider: "gmail" });

  if (action === "mail_ready") {
    return json({ ok: true, key: ON, fromOk: ON, from: GUSER || "", domain: "gmail.com", domainStatus: ON ? "verified" : "unknown", cron: false, webhook: false, provider: "gmail" });
  }

  if (action === "mail_log") {
    const lim = Math.min(Math.max(Number(body.limit) || 100, 1), 500);
    const { data, error } = await admin.from("v63_mail_log")
      .select("id,at,type,ref_id,to_addr,subject,status,error,attempts,sent_at").order("at", { ascending: false }).limit(lim);
    if (error) return json({ error: "db", detail: error.message });
    return json({ ok: true, items: (data || []).map((r) => ({ ...r, to: r.to_addr })) });
  }

  if (action === "mail") {
    if (!ON) return json({ error: "mail_off" });
    const b = body as MailIn & { type?: string; ref_id?: string };
    if (!b.to || !EMAIL.test(String(b.to))) return json({ error: "no_email" });
    const payload = { to: b.to, subject: b.subject, html: b.html, text: b.text, cred_with: b.cred_with, cred_with_text: b.cred_with_text, cred_without: b.cred_without, cred_without_text: b.cred_without_text, from_name: b.from_name, reply_to: b.reply_to, attachments: b.attachments };
    const pw = await initPw(b.ref_id);
    const { data: row } = await admin.from("v63_mail_log").insert({ type: b.type || null, ref_id: b.ref_id || null, to_addr: String(b.to), subject: String(b.subject || "").slice(0, 300), by_user: me.id, payload, attempts: 1 }).select("id").single();
    try {
      await deliver({ ...payload, pw });
      if (row) await admin.from("v63_mail_log").update({ status: "sent", sent_at: new Date().toISOString(), payload: null }).eq("id", row.id);
      if (pw) await alog("send", b.ref_id || null, me.email || "admin", String(b.to));
      return json({ ok: true, id: row?.id, password_included: !!pw });
    } catch (e) {
      const msg = String((e as Error)?.message || e).slice(0, 500);
      if (row) await admin.from("v63_mail_log").update({ status: "failed", error: msg }).eq("id", row.id);
      return json({ error: "send_failed", detail: msg });
    }
  }

  if (action === "retry_due") {
    if (!ON) return json({ error: "mail_off" });
    const { data } = await admin.from("v63_mail_log").select("id,payload,attempts").eq("status", "failed").lt("attempts", 5).not("payload", "is", null).order("at").limit(20);
    let sent = 0, failed = 0;
    for (const r of data || []) {
      try {
        await deliver(r.payload as MailIn);
        await admin.from("v63_mail_log").update({ status: "sent", sent_at: new Date().toISOString(), attempts: r.attempts + 1, error: null, payload: null }).eq("id", r.id);
        sent++;
      } catch (e) {
        await admin.from("v63_mail_log").update({ attempts: r.attempts + 1, error: String((e as Error)?.message || e).slice(0, 500) }).eq("id", r.id);
        failed++;
      }
    }
    return json({ ok: true, due: (data || []).length, sent, failed });
  }

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
      const h = await holder(ref, role);
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
    if (a.init_exp && Date.parse(a.init_exp) < Date.now()) return { error: "expired" };
    await alog("reveal", ref, by);
    return { ok: true, password: await dec(a.init_enc), expires: a.init_exp };
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
  if (a?.init_enc && (await dec(a.init_enc)) === password) return { error: "weak" };
  const up = await admin.auth.admin.updateUserById(uid, { password });
  if (up.error) return { error: "weak", detail: up.error.message };
  if (a) {
    await admin.from("v83_acc").update({ init_enc: null, init_exp: null, must_change: false, changed_at: new Date().toISOString() }).eq("user_id", uid);
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
