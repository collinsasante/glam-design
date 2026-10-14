// POST /api/feedback — a review comment from the Design Review page.
import { FEEDBACK, airtable, configured, json, pick } from "../_shared/airtable.js";

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: "Server is not configured." }, 500);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (body && body.website) return json({ ok: true });
  const fields = pick(body, ["Project ID", "Customer Name", "Reviewer Name", "Feedback", "Timestamp"], 4000);
  if (!fields["Feedback"]) return json({ error: "Please write a comment." }, 400);
  if (fields["Project ID"] && !/^ORD-\d{1,7}$/.test(fields["Project ID"])) return json({ error: "Invalid project." }, 400);
  for (const k of ["Position X", "Position Y"]) {
    const n = Number(body[k]);
    fields[k] = Number.isFinite(n) ? n.toFixed(2) : "0";
  }
  const marker = Number(body["Marker Number"]);
  if (Number.isInteger(marker) && marker > 0 && marker < 10000) fields["Marker Number"] = marker;
  const r = await airtable(env, encodeURIComponent(FEEDBACK), { method: "POST", body: JSON.stringify({ fields, typecast: true }) });
  if (!r.ok) return json({ error: "Could not save your feedback. Please try again." }, 502);
  return json({ ok: true });
}
