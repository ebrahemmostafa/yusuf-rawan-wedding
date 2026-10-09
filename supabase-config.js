/* =========================================================
   Supabase connection (used by index.html and responses.html).
   Supabase → Project Settings → API:
     url – "Project URL"
     key – the public "anon" / "publishable" key (NEVER the service_role / secret key)
   ========================================================= */
const SUPABASE = {
  url: "",
  key: "",
};

async function supabaseRequest(path, body) {
  const headers = {
    apikey: SUPABASE.key,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  // Legacy anon keys are JWTs and also go in the Authorization header.
  if (SUPABASE.key.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE.key}`;
  const res = await fetch(`${SUPABASE.url.replace(/\/$/, "")}/rest/v1/${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).message || ""; } catch {}
    const error = new Error(detail || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
