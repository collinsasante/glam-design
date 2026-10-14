// POST /api/submit — create a design submission (FDA, non-FDA or logo form).
import { SUBMISSIONS, airtable, configured, json, pick } from "../_shared/airtable.js";

const TEXT_FIELDS = [
  "Label Type", "Customer Name", "Phone Number", "Phone 2", "Product Name", "color", "Weight/Volume",
  "Ingredients", "Batch Number", "Country of Origin", "Manufacturer Details", "Directions for use",
  "Storage Instructions", "Label Dimensions", "Special Considerations",
];
const DATE_FIELDS = ["Manufacturing Date", "Expiry Date"];
const FILE_HOST = /^https:\/\/res\.cloudinary\.com\//;

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: "Server is not configured." }, 500);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  // Honeypot: real users never fill this hidden field.
  if (body && body.website) return json({ ok: true });

  const fields = pick(body && body.fields, TEXT_FIELDS, 5000);
  for (const f of DATE_FIELDS) {
    const v = body && body.fields && body.fields[f];
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) fields[f] = v;
  }
  if (!fields["Customer Name"] || !fields["Phone Number"]) {
    return json({ error: "Please enter your name and phone number." }, 400);
  }
  const files = Array.isArray(body.files) ? body.files.filter((u) => typeof u === "string" && FILE_HOST.test(u)).slice(0, 25) : [];
  fields["Files Uploaded"] = files.length ? files.join("\n") : "No files uploaded";
  fields["Terms Accepted"] = "Yes";
  fields["Submission Date"] = new Date().toISOString();

  const r = await airtable(env, encodeURIComponent(SUBMISSIONS), { method: "POST", body: JSON.stringify({ fields, typecast: true }) });
  if (!r.ok) return json({ error: "Submission failed. Please try again." }, 502);
  return json({ ok: true });
}
