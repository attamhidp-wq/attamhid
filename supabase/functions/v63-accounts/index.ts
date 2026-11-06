// v63-accounts — الجزء الخاص بالبريد الرسمي (إرسال عبر Gmail SMTP)
// العمليات المنفّذة: probe, mail_status, mail_ready, mail, mail_log, retry_due
// أي عملية أخرى يُرجَع لها {error:'fn_unavailable'} فيبقى الموقع على مساره الاحتياطي الحالي (الدخول وغيره) دون تغيير.
// الأسرار المطلوبة في Supabase → Edge Functions → Secrets: GMAIL_USER, GMAIL_APP_PASSWORD
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
const GUSER = (Deno.env.get("GMAIL_USER") || "").trim();
const GPASS = (Deno.env.get("GMAIL_APP_PASSWORD") || "").replace(/\s+/g, "");
const ON = !!(GUSER && GPASS);
const admin = createClient(URL_, SRK, { auth: { persistSession: false } });

async function caller(req: Request) {
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!tok) return null;
  const { data } = await admin.auth.getUser(tok);
  const u = data?.user;
  if (!u) return null;
  const { data: p } = await admin.from("profiles").select("role,ref_id").eq("id", u.id).maybeSingle();
  return { id: u.id, role: p?.role || null };
}

let tx: ReturnType<typeof nodemailer.createTransport> | null = null;
function transport() {
  if (!tx) tx = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: GUSER, pass: GPASS } });
  return tx;
}

type Att = { filename?: string; content?: string; content_type?: string; content_id?: string };
type MailIn = { to?: string; subject?: string; html?: string; text?: string; cred_without?: string; cred_without_text?: string; from_name?: string; reply_to?: string; attachments?: Att[] };

// لا مخزن لكلمات المرور الأولى في هذا الإصدار: يُستعمل دائماً نص «بدون كلمة مرور»
function compose(b: MailIn) {
  const html = String(b.html || "").split("[[CRED]]").join(String(b.cred_without || ""));
  const text = String(b.text || "").split("[[CRED]]").join(String(b.cred_without_text || ""));
  return { html, text };
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

  if (action === "probe") return json({ ok: true, v: "v82-mail", mail: ON });

  const known = ["mail_status", "mail_ready", "mail", "mail_log", "retry_due"];
  if (!known.includes(action)) return json({ error: "fn_unavailable" });

  const me = await caller(req);
  if (!me || me.role !== "admin") return json({ error: "forbidden" });

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
    const payload = { to: b.to, subject: b.subject, html: b.html, text: b.text, cred_without: b.cred_without, cred_without_text: b.cred_without_text, from_name: b.from_name, reply_to: b.reply_to, attachments: b.attachments };
    const { data: row } = await admin.from("v63_mail_log").insert({ type: b.type || null, ref_id: b.ref_id || null, to_addr: String(b.to), subject: String(b.subject || "").slice(0, 300), by_user: me.id, payload, attempts: 1 }).select("id").single();
    try {
      await deliver(payload);
      if (row) await admin.from("v63_mail_log").update({ status: "sent", sent_at: new Date().toISOString(), payload: null }).eq("id", row.id);
      return json({ ok: true, id: row?.id, password_included: false });
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
