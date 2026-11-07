// mail-hook (v108) — يستقبل حالة تسليم الرسائل من Resend (Webhook موقَّع بـ Svix) ويحدّث «سجل الإرسال»
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const res = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

let SECRET = "", AT = 0;
async function secret() {
  if (SECRET && Date.now() - AT < 5 * 60e3) return SECRET;
  const { data } = await admin.rpc("v108_hook_secret");
  SECRET = String(data || ""); AT = Date.now();
  return SECRET;
}
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
function same(a: string, b: string) { if (a.length !== b.length) return false; let x = 0; for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i); return x === 0; }
async function verify(req: Request, body: string) {
  const sec = await secret();
  if (!/^whsec_/.test(sec)) return false;
  const id = req.headers.get("svix-id") || "", ts = req.headers.get("svix-timestamp") || "", sig = req.headers.get("svix-signature") || "";
  if (!id || !ts || !sig) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", unb64(sec.slice(6)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = b64(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${ts}.${body}`))));
  return sig.split(" ").some((p) => { const [v, s] = p.split(","); return v === "v1" && !!s && same(s, mac); });
}
const RANK: Record<string, number> = { sent: 1, delayed: 2, delivered: 3, opened: 3, clicked: 3, bounced: 4, complained: 4, failed: 4 };
const MAP: Record<string, string> = { "email.sent": "sent", "email.delivered": "delivered", "email.delivery_delayed": "delayed", "email.bounced": "bounced", "email.complained": "complained", "email.failed": "failed" };

Deno.serve(async (req) => {
  if (req.method !== "POST") return res({ ok: true });
  const body = await req.text();
  if (!(await verify(req, body))) return res({ error: "bad_signature" }, 401);
  let ev: { type?: string; created_at?: string; data?: Record<string, unknown> } = {};
  try { ev = JSON.parse(body); } catch { return res({ error: "bad_json" }, 400); }
  const st = MAP[String(ev.type || "")];
  const mid = String(ev.data?.email_id || "");
  if (!st || !mid) return res({ ok: true, ignored: ev.type || "" });
  const { data: row } = await admin.from("v63_mail_log").select("id,delivery").eq("msg_id", mid).maybeSingle();
  if (!row) return res({ ok: true, unknown: mid });
  if ((RANK[row.delivery || ""] || 0) > RANK[st]) return res({ ok: true, kept: row.delivery });
  const b = (ev.data?.bounce || ev.data?.failed || {}) as Record<string, unknown>;
  const detail = [b.type, b.subType, b.message || b.reason].filter(Boolean).join(" — ").slice(0, 400) || null;
  await admin.from("v63_mail_log").update({ delivery: st, delivery_at: ev.created_at || new Date().toISOString(), delivery_detail: detail }).eq("id", row.id);
  return res({ ok: true, id: row.id, delivery: st });
});
