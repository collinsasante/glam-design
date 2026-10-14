// GET /api/staff/submissions — recent submissions for the staff review-link tool.
// Requires the X-Staff-Token header to match the STAFF_TOKEN environment variable.
import { ORDER_NUMBER_FIELD, SUBMISSIONS, airtable, configured, json, safeEqual } from "../../_shared/airtable.js";

export async function onRequestGet({ request, env }) {
  if (!configured(env) || !env.STAFF_TOKEN) return json({ error: "Server is not configured." }, 500);
  if (!safeEqual(request.headers.get("x-staff-token"), env.STAFF_TOKEN)) return json({ error: "Not authorised." }, 401);
  const qs = "?maxRecords=100&sort%5B0%5D%5Bfield%5D=Submission%20Date&sort%5B0%5D%5Bdirection%5D=desc";
  const r = await airtable(env, encodeURIComponent(SUBMISSIONS) + qs);
  if (!r.ok) return json({ error: "Could not load submissions." }, 502);
  return json({
    records: (r.data.records || []).map((rec) => ({
      id: rec.id,
      orderNumber: rec.fields[ORDER_NUMBER_FIELD] || null,
      customerName: rec.fields["Customer Name"] || "",
      productName: rec.fields["Product Name"] || "",
      submissionDate: rec.fields["Submission Date"] || "",
    })),
  });
}
