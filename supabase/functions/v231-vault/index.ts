// v231-vault — مخزن خاص للنسخ الاحتياطية للمستودع وللمصدر (bucket خاص غير عام)
// لا أسرار مخزّنة: يُتحقق من هوية سير العمل برمز OIDC توقّعه GitHub لهذا المستودع ولملف vault.yml على main تحديداً،
// ثم يُعاد رابط موقَّع قصير العمر للرفع أو التنزيل. لا قراءة ولا كتابة لأي جهة أخرى.
import { createClient } from "jsr:@supabase/supabase-js@2";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SB_URL, SRK, { auth: { persistSession: false, autoRefreshToken: false } });
const ISS = "https://token.actions.githubusercontent.com";
const REPO = "attamhidp-wq/attamhid";
const AUD = "attamhid-vault";
const WF = REPO + "/.github/workflows/vault.yml@refs/heads/main";
const BUCKET = "repo-vault";
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
const b64u = (s: string) => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); };
let JWKS: { keys: Array<Record<string, unknown>> } | null = null;

async function verify(tok: string) {
  const parts = String(tok || "").split(".");
  if (parts.length !== 3) throw new Error("format");
  const [h, p, s] = parts;
  const hd = JSON.parse(new TextDecoder().decode(b64u(h)));
  const pl = JSON.parse(new TextDecoder().decode(b64u(p)));
  if (hd.alg !== "RS256") throw new Error("alg");
  const now = Math.floor(Date.now() / 1000);
  if (pl.iss !== ISS || pl.aud !== AUD || pl.repository !== REPO || pl.ref !== "refs/heads/main" || pl.workflow_ref !== WF) throw new Error("claims");
  if (!(typeof pl.exp === "number" && pl.exp > now) || (typeof pl.iat === "number" && pl.iat < now - 900)) throw new Error("time");
  let k = JWKS?.keys?.find((x) => x.kid === hd.kid);
  if (!k) { JWKS = await (await fetch(ISS + "/.well-known/jwks")).json(); k = JWKS?.keys?.find((x) => x.kid === hd.kid); }
  if (!k) throw new Error("kid");
  const key = await crypto.subtle.importKey("jwk", { kty: k.kty, n: k.n, e: k.e, alg: "RS256", ext: true } as JsonWebKey, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  if (!(await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64u(s), new TextEncoder().encode(h + "." + p)))) throw new Error("sig");
  return pl;
}

async function ensureBucket() {
  const { data } = await admin.storage.getBucket(BUCKET);
  if (data) { if (data.public) await admin.storage.updateBucket(BUCKET, { public: false }); return; }
  const { error } = await admin.storage.createBucket(BUCKET, { public: false });
  if (error && !/exist/i.test(error.message)) throw error;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty */ }
  try {
    const claims = await verify(String(body.oidc || ""));
    await ensureBucket();
    const op = String(body.op || "");
    const name = String(body.name || "");
    if (op === "list") {
      const { data, error } = await admin.storage.from(BUCKET).list("", { limit: 100, sortBy: { column: "name", order: "asc" } });
      if (error) throw error;
      return json({ ok: true, files: (data || []).map((f) => ({ name: f.name, size: (f.metadata as Record<string, unknown>)?.size })) });
    }
    if (!/^[a-z0-9][a-z0-9._-]{2,120}$/.test(name)) return json({ error: "name" }, 400);
    if (op === "put") {
      const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(name, { upsert: false });
      if (error) throw error;
      console.log("vault put", name, claims.run_id);
      return json({ ok: true, url: data.signedUrl });
    }
    if (op === "get") {
      const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(name, 300);
      if (error) throw error;
      console.log("vault get", name, claims.run_id);
      return json({ ok: true, url: data.signedUrl });
    }
    return json({ error: "op" }, 400);
  } catch (e) {
    return json({ error: "vault_failed", detail: String((e as Error)?.message || e).slice(0, 200) }, 500);
  }
});
