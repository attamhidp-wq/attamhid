// v134-robot — جلسة المنفّذ الآلي (يعمل على GitHub Actions)
// لا أسرار مخزّنة: يُتحقق من هوية سير العمل برمز OIDC الذي توقّعه GitHub نفسها لهذا المستودع وهذا الملف تحديداً،
// ثم تُعيَّن كلمة مرور عشوائية جديدة لحساب المنفّذ في كل تشغيل وتُعاد له فقط.
import { createClient } from "jsr:@supabase/supabase-js@2";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SB_URL, SRK, { auth: { persistSession: false, autoRefreshToken: false } });
const ISS = "https://token.actions.githubusercontent.com";
const REPO = "attamhidp-wq/attamhid";
const AUD = "attamhid-robot";
const WF = REPO + "/.github/workflows/robot.yml@refs/heads/main";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

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
  if (!(typeof pl.exp === "number" && pl.exp > now) || (typeof pl.nbf === "number" && pl.nbf > now + 60) || (typeof pl.iat === "number" && pl.iat < now - 900)) throw new Error("time");
  let k = JWKS?.keys?.find((x) => x.kid === hd.kid);
  if (!k) { JWKS = await (await fetch(ISS + "/.well-known/jwks")).json(); k = JWKS?.keys?.find((x) => x.kid === hd.kid); }
  if (!k) throw new Error("kid");
  const key = await crypto.subtle.importKey("jwk", { kty: k.kty, n: k.n, e: k.e, alg: "RS256", ext: true } as JsonWebKey, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64u(s), new TextEncoder().encode(h + "." + p));
  if (!ok) throw new Error("sig");
  return pl;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty */ }
  let claims: Record<string, unknown>;
  try { claims = await verify(String(body.oidc || "")); } catch (e) { return json({ error: "forbidden", why: String((e as Error).message) }, 403); }
  try {
    const { data: any } = await admin.from("profiles").select("login_email").not("login_email", "is", null).neq("ref_id", "robot").limit(1).maybeSingle();
    const dom = String(any?.login_email || "").split("@")[1] || "robot.attamhid.local";
    const email = "robot@" + dom;
    const password = crypto.randomUUID() + "-" + crypto.randomUUID();
    const { data: pr } = await admin.from("profiles").select("id").eq("ref_id", "robot").eq("role", "admin").maybeSingle();
    let uid = pr?.id as string | undefined;
    if (uid) {
      const { error } = await admin.auth.admin.updateUserById(uid, { password, email_confirm: true });
      if (error) throw error;
    } else {
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { robot: true, name: "المنفّذ الآلي" } });
      if (error) throw error;
      uid = data.user!.id;
      const { error: e2 } = await admin.from("profiles").upsert({ id: uid, role: "admin", ref_id: "robot", login_email: email });
      if (e2) throw e2;
    }
    console.log("robot session", claims.run_id, claims.sha);
    return json({ ok: true, email, password });
  } catch (e) {
    return json({ error: "robot_failed", detail: String((e as Error)?.message || e).slice(0, 300) }, 500);
  }
});
