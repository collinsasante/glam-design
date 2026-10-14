// node --test tests/  — Pages Functions with Airtable mocked (no network, no real key).
import test from "node:test";
import assert from "node:assert/strict";
import { onRequestPost as submit } from "../functions/api/submit.js";
import { onRequestGet as track } from "../functions/api/track.js";
import { onRequestPost as feedback } from "../functions/api/feedback.js";
import { onRequestGet as staff } from "../functions/api/staff/submissions.js";
import { onRequest as middleware } from "../functions/_middleware.js";

const env = { AIRTABLE_API_KEY: "patSECRET", AIRTABLE_BASE_ID: "appBASE", STAFF_TOKEN: "staff-123", CLOUDINARY_CLOUD_NAME: "cloud" };
let calls = [];
function mockAirtable(responder) {
  calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    const { status = 200, body = {} } = responder(String(url), init) || {};
    return new Response(JSON.stringify(body), { status });
  };
}
const post = (body) => new Request("https://design.example/api/x", { method: "POST", body: JSON.stringify(body) });
const get = (path, headers = {}) => new Request("https://design.example" + path, { headers });

test("submit: whitelists fields, server sets terms/date, keeps only Cloudinary files", async () => {
  mockAirtable(() => ({ body: { id: "rec1" } }));
  const res = await submit({ env, request: post({
    fields: { "Customer Name": " Ama ", "Phone Number": "0241234567", "Product Name": "Shea", "Expiry Date": "2027-01-31",
      "Manufacturing Date": "", "Design URL": "https://evil", "Terms Accepted": "No", Hacker: "x" },
    files: ["https://res.cloudinary.com/x/a.png", "https://evil.example/b.png"],
  }) });
  assert.equal(res.status, 200);
  const sent = JSON.parse(calls[0].init.body).fields;
  assert.equal(sent["Customer Name"], "Ama");
  assert.equal(sent["Expiry Date"], "2027-01-31");
  assert.ok(!("Manufacturing Date" in sent), "empty date dropped");
  assert.ok(!("Design URL" in sent) && !("Hacker" in sent), "unknown fields dropped");
  assert.equal(sent["Terms Accepted"], "Yes");
  assert.equal(sent["Files Uploaded"], "https://res.cloudinary.com/x/a.png");
  assert.match(calls[0].url, /\/appBASE\/Submissions$/);
  assert.equal(calls[0].init.headers.Authorization, "Bearer patSECRET");
});

test("submit: requires name and phone; honeypot is silently ignored", async () => {
  mockAirtable(() => ({}));
  assert.equal((await submit({ env, request: post({ fields: { "Customer Name": "Ama" } }) })).status, 400);
  const hp = await submit({ env, request: post({ website: "spam", fields: { "Customer Name": "B", "Phone Number": "1" } }) });
  assert.equal(hp.status, 200);
  assert.equal(calls.length, 0);
});

test("submit: Airtable error is not leaked to the browser", async () => {
  mockAirtable(() => ({ status: 401, body: { error: "AUTHENTICATION_REQUIRED patSECRET" } }));
  const res = await submit({ env, request: post({ fields: { "Customer Name": "A", "Phone Number": "0241234567" } }) });
  assert.equal(res.status, 502);
  assert.ok(!(await res.text()).includes("patSECRET"));
});

test("track: needs order + matching phone; returns only safe fields", async () => {
  const rec = { id: "rec9", fields: { "Order Number": 12, "Customer Name": "Ama Mensah", "Phone Number": "024 123 4567",
    "Product Name": "Shea", "Submission Date": "2026-10-01", "Design URL": "https://res.cloudinary.com/d.png", Ingredients: "secret" } };
  mockAirtable(() => ({ body: { records: [rec] } }));
  const ok = await (await track({ env, request: get("/api/track?order=ORD-00012&phone=4567") })).json();
  assert.equal(ok.status, "ready");
  assert.equal(ok.order, "ORD-00012");
  assert.equal(ok.firstName, "Ama");
  assert.ok(!("Ingredients" in ok) && !JSON.stringify(ok).includes("024"), "no phone or other fields returned");
  assert.match(decodeURIComponent(calls[0].url), /filterByFormula=\{Order Number\}=12/);
  assert.equal((await track({ env, request: get("/api/track?order=ORD-00012&phone=9999") })).status, 404);
  assert.equal((await track({ env, request: get("/api/track?order=12&phone=4567") })).status, 400, "ORD prefix required");
  assert.equal((await track({ env, request: get("/api/track?order=ord12&phone=4567") })).status, 200, "case-insensitive, dash optional");
});

test("track: rejects malformed input without calling Airtable", async () => {
  mockAirtable(() => ({}));
  for (const q of ["?order=rec123&phone=4567", "?order=ORD-12", "?order=ORD-12')&phone=1234", "?order=ORD-1&phone=12"]) {
    assert.equal((await track({ env, request: get("/api/track" + q) })).status, 400, q);
  }
  assert.equal(calls.length, 0);
});

test("track: design not ready", async () => {
  mockAirtable(() => ({ body: { records: [{ id: "r", fields: { "Phone Number": "0241234567" } }] } }));
  assert.equal((await (await track({ env, request: get("/api/track?order=ORD-3&phone=4567") })).json()).status, "in_progress");
});

test("feedback: validates and whitelists", async () => {
  mockAirtable(() => ({ body: { id: "r" } }));
  assert.equal((await feedback({ env, request: post({ Feedback: "" }) })).status, 400);
  assert.equal((await feedback({ env, request: post({ Feedback: "x", "Project ID": "ORD-1' OR 1" }) })).status, 400);
  const res = await feedback({ env, request: post({ "Project ID": "ORD-00012", Feedback: "Bigger logo", "Position X": 12.3456, "Marker Number": 2, Evil: "x" }) });
  assert.equal(res.status, 200);
  const sent = JSON.parse(calls[0].init.body).fields;
  assert.equal(sent["Position X"], "12.35");
  assert.equal(sent["Marker Number"], 2);
  assert.ok(!("Evil" in sent));
  assert.match(calls[0].url, /Design%20Feedback$/);
});

test("staff: token required (constant-time compare), returns minimal fields", async () => {
  mockAirtable(() => ({ body: { records: [{ id: "r1", fields: { "Order Number": 7, "Customer Name": "Ama", "Phone Number": "0241234567" } }] } }));
  assert.equal((await staff({ env, request: get("/api/staff/submissions") })).status, 401);
  assert.equal((await staff({ env, request: get("/api/staff/submissions", { "x-staff-token": "wrong-12" }) })).status, 401);
  const res = await staff({ env, request: get("/api/staff/submissions", { "x-staff-token": "staff-123" }) });
  const data = await res.json();
  assert.equal(data.records[0].orderNumber, 7);
  assert.ok(!JSON.stringify(data).includes("024"), "no phone numbers");
  assert.equal((await staff({ env: { ...env, STAFF_TOKEN: "" }, request: get("/api/staff/submissions", { "x-staff-token": "" }) })).status, 500);
});

test("middleware: never injects the Airtable key or base into pages", async () => {
  const res = await middleware({ env, next: async () => new Response("<html><head></head><body></body></html>", { headers: { "content-type": "text/html" } }) });
  const html = await res.text();
  assert.ok(!html.includes("patSECRET") && !html.includes("appBASE") && !html.includes("AIRTABLE"));
  assert.ok(html.includes("CLOUDINARY_CLOUD_NAME"));
});
