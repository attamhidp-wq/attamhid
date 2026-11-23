// v231-dbx — نسخة احتياطية خارجية لقاعدة البيانات في المخزن الخاص repo-vault، مع استعادة تجريبية.
// البيانات لا تغادر Supabase: الدالة تقرأ بالاتصال الداخلي وتكتب إلى المخزن الخاص، والمشغّل يتلقى أعداداً وبصمات فقط.
// الهوية: رمز OIDC لملف vault.yml على main في هذا المستودع وحده.
import postgres from "npm:postgres@3.4.4";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// تخزين مباشر عبر واجهة Storage (بلا مكتبة إضافية لتقليل زمن الإقلاع)
const ST = SB_URL + "/storage/v1/object/" + "repo-vault" + "/";
async function put(path: string, body: Uint8Array, type: string) {
  const r = await fetch(ST + path, { method: "POST", headers: { Authorization: "Bearer " + SRK, apikey: SRK, "Content-Type": type, "x-upsert": "true" }, body });
  if (!r.ok) throw new Error("upload " + r.status + " " + (await r.text()).slice(0, 120));
}
async function get(path: string) {
  const r = await fetch(ST + path, { headers: { Authorization: "Bearer " + SRK, apikey: SRK } });
  if (!r.ok) throw new Error("download " + r.status);
  return new Uint8Array(await r.arrayBuffer());
}
const ISS = "https://token.actions.githubusercontent.com";
const REPO = "attamhidp-wq/attamhid";
const AUD = "attamhid-vault";
const WF = REPO + "/.github/workflows/vault.yml@refs/heads/main";
const SCRATCH = "rst_v231";
const SCHEMAS = ["public", "bk_v226", "bk_v230", "supabase_migrations"];
const EXTRA = [["auth", "users"], ["auth", "identities"], ["auth", "mfa_factors"], ["storage", "buckets"], ["storage", "objects"], ["cron", "job"]];
const TARGET = 64 * 1024; // v240: حجم تقريبي لكل جزء من حجم الجدول المضغوط (النص المصدَّر أكبر بأضعاف؛ الأجزاء الصغيرة لا تتجاوز مهلة الدالة)
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
  if (!(typeof pl.exp === "number" && pl.exp > now) || (typeof pl.iat === "number" && pl.iat < now - 3600)) throw new Error("time");
  let k = JWKS?.keys?.find((x) => x.kid === hd.kid);
  if (!k) { JWKS = await (await fetch(ISS + "/.well-known/jwks")).json(); k = JWKS?.keys?.find((x) => x.kid === hd.kid); }
  if (!k) throw new Error("kid");
  const key = await crypto.subtle.importKey("jwk", { kty: k.kty, n: k.n, e: k.e, alg: "RS256", ext: true } as JsonWebKey, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  if (!(await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64u(s), new TextEncoder().encode(h + "." + p)))) throw new Error("sig");
  return pl;
}

const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha = async (u: Uint8Array) => hex(await crypto.subtle.digest("SHA-256", u));
async function gz(u: Uint8Array) { return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer()); }
async function gunz(u: Uint8Array) { return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer()); }
async function readAll(r: AsyncIterable<Uint8Array>) { const out: Uint8Array[] = []; let n = 0; for await (const c of r) { out.push(c); n += c.length; } const u = new Uint8Array(n); let o = 0; for (const c of out) { u.set(c, o); o += c.length; } return u; }
const qi = (s: string) => '"' + s.replace(/"/g, '""') + '"';
const okName = (s: string) => /^[a-z0-9][a-z0-9._-]{2,80}$/.test(s);

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty */ }
  const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false, max: 1, idle_timeout: 5 });
  try {
    await verify(String(body.oidc || ""));
    const op = String(body.op || "");
    const set = String(body.set || "");
    if (!okName(set)) return json({ error: "set" }, 400);
    if (op === "plan") {
      const rows = await sql`select n.nspname s, c.relname t, c.reltuples::bigint est, pg_total_relation_size(c.oid) sz
        from pg_class c join pg_namespace n on n.oid=c.relnamespace
        where c.relkind in ('r','p') and (n.nspname = any(${SCHEMAS}) or (n.nspname||'.'||c.relname) = any(${EXTRA.map((x) => x.join("."))}))
        order by 1,2`;
      const plan = [];
      // v248: نطاق «core» = البيانات الأساسية دون النسخ الداخلية القديمة وسجل التغييرات الضخم (يُنسخان في مجموعة مستقلة «logs»)
      const BIG = ["public.v79_change_log", "public.v79_backups", "public.audit_log"];
      const scope = String(body.scope || "all");
      const pick = (r: { s: string; t: string }) => scope === "core" ? !/^bk_/.test(r.s) && !BIG.includes(r.s + "." + r.t) : scope === "logs" ? BIG.includes(r.s + "." + r.t) : true;
      for (const r of rows.filter(pick)) {
        const [{ n }] = await sql.unsafe(`select count(*)::bigint n from ${qi(r.s)}.${qi(r.t)}`);
        const per = Number(n) === 0 ? 1 : Math.max(1, Math.ceil(Number(n) * TARGET / Math.max(1, Number(r.sz))));
        const parts = Math.max(1, Math.ceil(Number(n) / per));
        plan.push({ s: r.s, t: r.t, rows: Number(n), per, parts });
      }
      return json({ ok: true, plan });
    }
    if (op === "ddl") {
      // بنية قاعدة البيانات: الجداول وأعمدتها، القيود، الفهارس، العروض، الدوال، المشغلات، سياسات RLS، الصلاحيات
      const [d] = await sql`select jsonb_build_object(
        'tables', (select jsonb_agg(jsonb_build_object('s',n.nspname,'t',c.relname,'rls',c.relrowsecurity,'cols',
            (select jsonb_agg(jsonb_build_object('c',a.attname,'type',format_type(a.atttypid,a.atttypmod),'nn',a.attnotnull,'def',pg_get_expr(ad.adbin,ad.adrelid)) order by a.attnum)
             from pg_attribute a left join pg_attrdef ad on ad.adrelid=a.attrelid and ad.adnum=a.attnum where a.attrelid=c.oid and a.attnum>0 and not a.attisdropped)))
          from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind in ('r','p') and n.nspname = any(${SCHEMAS})),
        'constraints', (select jsonb_agg(jsonb_build_object('s',n.nspname,'t',c.relname,'n',k.conname,'def',pg_get_constraintdef(k.oid))) from pg_constraint k join pg_class c on c.oid=k.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname = any(${SCHEMAS})),
        'indexes', (select jsonb_agg(indexdef) from pg_indexes where schemaname = any(${SCHEMAS})),
        'views', (select jsonb_agg(jsonb_build_object('s',schemaname,'v',viewname,'def',definition)) from pg_views where schemaname = any(${SCHEMAS})),
        'functions', (select jsonb_agg(pg_get_functiondef(p.oid)) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname = any(${SCHEMAS}) and p.prokind in ('f','p')),
        'triggers', (select jsonb_agg(pg_get_triggerdef(tg.oid)) from pg_trigger tg join pg_class c on c.oid=tg.tgrelid join pg_namespace n on n.oid=c.relnamespace where not tg.tgisinternal and n.nspname = any(${SCHEMAS})),
        'policies', (select jsonb_agg(to_jsonb(p)) from pg_policies p where schemaname = any(${SCHEMAS}) or schemaname='storage'),
        'table_grants', (select jsonb_agg(jsonb_build_object('s',table_schema,'t',table_name,'g',grantee,'p',privilege_type)) from information_schema.role_table_grants where table_schema = any(${SCHEMAS})),
        'routine_grants', (select jsonb_agg(jsonb_build_object('s',routine_schema,'f',routine_name,'g',grantee)) from information_schema.role_routine_grants where routine_schema = any(${SCHEMAS})),
        'cron', (select jsonb_agg(jsonb_build_object('name',jobname,'schedule',schedule,'command',command,'active',active)) from cron.job)
      ) d`;
      const raw = new TextEncoder().encode(JSON.stringify(d.d));
      const path = `${set}/_ddl.json.gz`;
      await put(path, await gz(raw), "application/gzip");
      const back = await gunz(await get(path));
      return json({ ok: true, path, bytes: raw.length, sha256: await sha(raw), roundtrip: (await sha(back)) === (await sha(raw)),
        counts: Object.fromEntries(Object.entries(d.d as Record<string, unknown[]>).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])) });
    }
    if (op === "manifest") {
      const raw = new TextEncoder().encode(JSON.stringify(body.manifest || {}));
      await put(`${set}/_manifest.json`, raw, "application/json");
      return json({ ok: true, sha256: await sha(raw) });
    }
    const s = String(body.s || ""), t = String(body.t || "");
    const part = Number(body.part || 0), per = Number(body.per || 0);
    const [{ ok: exists }] = await sql`select exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname=${s} and c.relname=${t} and c.relkind in ('r','p')) ok`;
    if (!exists || !(per > 0) || part < 0) return json({ error: "target" }, 400);
    const path = `${set}/${s}.${t}.${String(part).padStart(4, "0")}.csv`;
    // ترتيب المعرّفات الفيزيائية وحدها (خفيف) ثم جلب الصفوف بها، بدل فرز الصفوف كاملة
    const sel = (src: string) => `select * from ${src} where ctid = any(array(select ctid from ${src} order by ctid offset ${part * per} limit ${per})) order by ctid`;
    // v248: تصدير CSV بالاستعلام العادي بدل COPY TO (تدفّق COPY كان يعلق في بعض الجداول حتى تنتهي مهلة الدالة)
    const csvOf = async (schema: string, table: string, query: string) => {
      const cols = (await sql`select column_name c from information_schema.columns where table_schema=${schema} and table_name=${table} order by ordinal_position`).map((r) => String(r.c));
      const rows = await sql.unsafe(`select ${cols.map((c) => qi(c) + "::text as " + qi(c)).join(", ")} from (${query}) z`);
      const q = (v: unknown) => v === null || v === undefined ? "" : '"' + String(v).replace(/"/g, '""') + '"';
      const lines = [cols.map(q).join(",")];
      for (const r of rows) lines.push(cols.map((c) => q((r as Record<string, unknown>)[c])).join(","));
      return new TextEncoder().encode(lines.join("\n") + "\n");
    };
    if (op === "export") {
      const raw = await csvOf(s, t, sel(qi(s) + "." + qi(t)));
      const [{ n }] = await sql.unsafe(`select count(*)::int n from (${sel(qi(s) + "." + qi(t))}) x`);
      const h = await sha(raw);
      await put(path, raw, "text/csv");
      return json({ ok: true, path, rows: n, bytes: raw.length, sha256: h });
    }
    if (op === "restore") {
      // استعادة تجريبية: يُنزَّل الجزء من المخزن ويُحمَّل في جدول مؤقت بالبنية نفسها، ثم يُصدَّر ثانية وتُقارن البصمة والعدد.
      const raw = await get(path);
      const tmp = qi(SCRATCH) + "." + qi((s + "__" + t).slice(0, 52) + "_" + part); // جدول مؤقت لكل جزء (الأجزاء تعمل بالتوازي)
      await sql.unsafe(`create schema if not exists ${qi(SCRATCH)}`);
      await sql.unsafe(`revoke all on schema ${qi(SCRATCH)} from public, anon, authenticated`);
      await sql.unsafe(`drop table if exists ${tmp}`);
      await sql.unsafe(`create table ${tmp} (like ${qi(s)}.${qi(t)})`);
      const w = await sql.unsafe(`copy ${tmp} from stdin with (format csv, header)`).writable();
      await new Promise<void>((res, rej) => { w.on("error", rej); w.on("finish", () => res()); w.write(raw); w.end(); });
      const [{ n }] = await sql.unsafe(`select count(*)::int n from ${tmp}`);
      const tname = (s + "__" + t).slice(0, 52) + "_" + part;
      const back = await csvOf(SCRATCH, tname, `select * from ${tmp} order by ctid`);
      const h = await sha(back);
      await sql.unsafe(`drop table ${tmp}`);
      return json({ ok: true, path, rows: n, sha256: h });
    }
    return json({ error: "op" }, 400);
  } catch (e) {
    const detail = String((e as Error)?.message || e).slice(0, 300); console.error("dbx_failed", String(body.op || ""), String(body.t || ""), detail);
    return json({ error: "dbx_failed", detail }, 500);
  } finally {
    try { await sql.end({ timeout: 2 }); } catch { /* ignore */ }
  }
});
