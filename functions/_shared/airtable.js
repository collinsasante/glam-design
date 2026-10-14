// Server-side Airtable access for Cloudflare Pages Functions.
// The API key lives only in the Pages environment (AIRTABLE_API_KEY) and never reaches the browser.

export const SUBMISSIONS = "Submissions";
export const FEEDBACK = "Design Feedback";
// Stable customer-facing order number: an Airtable *Autonumber* field on Submissions.
export const ORDER_NUMBER_FIELD = "Order Number";

export function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extraHeaders },
  });
}

export function configured(env) {
  return Boolean(env.AIRTABLE_API_KEY && env.AIRTABLE_BASE_ID);
}

export async function airtable(env, path, init = {}) {
  const res = await fetch(`https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${env.AIRTABLE_API_KEY}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

/** Keep only allowed keys, trimmed strings, capped length, and drop empties (Airtable rejects "" for dates). */
export function pick(input, allowed, maxLen = 5000) {
  const out = {};
  if (!input || typeof input !== "object") return out;
  for (const key of allowed) {
    const v = input[key];
    if (typeof v !== "string") continue;
    const s = v.trim().slice(0, maxLen);
    if (s) out[key] = s;
  }
  return out;
}

/** Last 4 digits of a phone number, or "" */
export function last4(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  return d.length >= 4 ? d.slice(-4) : "";
}

export function escapeFormula(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/** Constant-time string comparison */
export function safeEqual(a, b) {
  a = String(a || "");
  b = String(b || "");
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
