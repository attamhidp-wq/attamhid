// v230: فحص آلية الاستيراد البعيد للدوال (يرد بنص ثابت فقط)
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const ok = typeof createClient === "function";
Deno.serve(() => new Response(JSON.stringify({ ok, v: "v230-probe" }), { headers: { "Content-Type": "application/json" } }));
