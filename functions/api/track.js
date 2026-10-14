// GET /api/track?order=ORD-00012&phone=1234 — a customer's design status.
// Needs the stable order number AND the last 4 digits of the phone used, so orders can't be browsed.
import { ORDER_NUMBER_FIELD, SUBMISSIONS, airtable, configured, json, last4 } from "../_shared/airtable.js";

export async function onRequestGet({ request, env }) {
  if (!configured(env)) return json({ error: "Server is not configured." }, 500);
  const url = new URL(request.url);
  const m = /^ORD-?0*(\d{1,7})$/i.exec((url.searchParams.get("order") || "").trim());
  const phone4 = (url.searchParams.get("phone") || "").replace(/\D/g, "");
  if (!m || phone4.length !== 4) {
    return json({ error: "Enter your Order ID (e.g. ORD-00012) and the last 4 digits of your phone number." }, 400);
  }
  const formula = `{${ORDER_NUMBER_FIELD}}=${Number(m[1])}`;
  const r = await airtable(env, `${encodeURIComponent(SUBMISSIONS)}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`);
  if (!r.ok) {
    if (r.status === 422) return json({ error: "Order tracking is not set up yet. Please contact us." }, 500);
    return json({ error: "Unable to search orders. Please try again." }, 502);
  }
  const rec = r.data && r.data.records && r.data.records[0];
  const f = rec ? rec.fields : null;
  const matches = f && (last4(f["Phone Number"]) === phone4 || last4(f["Phone 2"]) === phone4);
  if (!matches) return json({ error: "Order not found. Please check your Order ID and phone number." }, 404);
  if (!f["Design URL"]) return json({ status: "in_progress" });
  return json({
    status: "ready",
    order: `ORD-${String(m[1]).padStart(5, "0")}`,
    firstName: String(f["Customer Name"] || "").trim().split(/\s+/)[0] || "",
    productName: f["Product Name"] || "",
    submissionDate: f["Submission Date"] || "",
    designUrl: f["Design URL"],
  });
}
