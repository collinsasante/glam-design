# Security Notice

## ⚠️ Current Architecture: Client-Side with Cloudflare Environment Variables

This application is deployed on Cloudflare Pages/Workers with API keys stored in Cloudflare's environment variables (secure).

### Current Setup

```
┌─────────┐      ┌────────────────────┐      ┌─────────────┐
│ Browser │ ───> │ Cloudflare Worker  │ ───> │ Airtable    │
│         │      │ (Edge Function)    │      │ Cloudinary  │
└─────────┘      └────────────────────┘      └─────────────┘
                  ↑
                  API Keys in Cloudflare
                  Environment Variables (secure)
```

### Local Development Setup

1. **Copy config.js.example to config.js**
   ```bash
   cp assets/js/config.js.example assets/js/config.js
   ```

2. **Edit config.js with your API keys FOR LOCAL DEVELOPMENT ONLY**
   - Get Airtable API key: https://airtable.com/create/tokens
   - Get Cloudflare credentials: https://cloudinary.com/console
   - ⚠️ These keys are for local testing only

3. **NEVER commit config.js to git**
   - It's already in `.gitignore`
   - Production uses Cloudflare environment variables

### Production Deployment (Cloudflare)

API keys are stored in Cloudflare environment variables (not in code):

1. **Set Environment Variables in Cloudflare Dashboard**:
   - Navigate to: Workers & Pages → Your Project → Settings → Environment Variables
   - Add:
     - `AIRTABLE_BASE_ID`
     - `AIRTABLE_TABLE_ID`
     - `AIRTABLE_API_KEY`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_UPLOAD_PRESET`

2. **Access in Cloudflare Worker/Function**:
   ```javascript
   export async function onRequest(context) {
     const airtableKey = context.env.AIRTABLE_API_KEY;
     // Keys never exposed to browser
   }
   ```

### Security Checklist

- [x] API keys stored in Cloudflare environment variables (production)
- [x] config.js in .gitignore (not committed)
- [ ] Rotate API keys if they were previously committed
- [ ] Clean git history of any exposed keys
- [ ] Add rate limiting in Cloudflare Worker
- [ ] Add input validation in edge function
- [ ] Enable CORS restrictions

### If Keys Were Previously Exposed

1. **Immediately revoke the old keys**:
   - Airtable: https://airtable.com/create/tokens
   - Cloudinary: https://cloudinary.com/console

2. **Generate new keys**

3. **Update Cloudflare environment variables** (production)

4. **Update local config.js** (development, do not commit)

5. **Clean git history** to remove exposed keys:
   ```bash
   # Using BFG Repo-Cleaner (recommended)
   java -jar bfg.jar --delete-files config.js
   java -jar bfg.jar --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

### Resources

- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Cloudinary Security Best Practices](https://cloudinary.com/documentation/security)

---

**Architecture**: Cloudflare Workers/Pages with environment variables
**Last Updated**: 2024

## Server-side Airtable access (2026-10)

The Airtable key is **never sent to the browser**. Pages call our Cloudflare Pages Functions, which hold the key:

| Endpoint | Used by | Protection |
|---|---|---|
| `POST /api/submit` | FDA, non-FDA and logo forms | field allow-list, Cloudinary-only file URLs, honeypot, length limits |
| `GET /api/track?order=ORD-00012&phone=1234` | track-design | needs the order number **and** the last 4 phone digits, and returns only the first name, product, date and design URL |
| `POST /api/feedback` | Design Review | field allow-list, `ORD-` project format |
| `GET /api/staff/submissions` | generate-review-link (staff) | `X-Staff-Token` must equal `STAFF_TOKEN` |

**Cloudflare Pages environment variables** (Production and Preview):

| Variable | Notes |
|---|---|
| `AIRTABLE_API_KEY` | a personal access token scoped to this base only, `data.records:read` + `data.records:write` |
| `AIRTABLE_BASE_ID` | the base |
| `STAFF_TOKEN` | a long random password for the staff tool |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET` | public; still injected into pages |

**Airtable**: the `Submissions` table needs an **Autonumber** field named **`Order Number`**. That number *is* the customer's `ORD-00012`. Earlier order numbers were just list positions, which differed between pages; don't rely on old ones.

Tests: `node --test tests/functions.test.mjs` (Airtable is mocked).
