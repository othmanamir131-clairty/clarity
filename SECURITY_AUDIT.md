# Clarity Security & Legal Audit
*Completed: June 10, 2026*

---

## Summary

Overall the codebase is in solid shape. Auth is enforced on every API route, rate limiting is in place, Stripe webhooks are properly signature-verified, and user data is isolated via Supabase RLS. There are **4 issues to fix** — one high severity, two medium, one low — and a few legal notes.

---

## 🔴 HIGH — Stripe Checkout Has No Auth Check

**File:** `app/api/stripe/checkout/route.ts`

The checkout endpoint accepts a `userId` from the request body without verifying the caller is logged in. Any anonymous request to this endpoint can create a Stripe checkout session for any userId.

**Risk:** Someone who knows another user's UUID could initiate a checkout that (if completed) would upgrade that user's account — at the attacker's own expense. More importantly, this is a clean auth gap that should be closed.

**Fix — add this block at the top of the POST handler, before the `try`:**

```typescript
// Auth check
const cookieStore = await cookies()
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
)
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: 'You must be logged in to subscribe.' }, { status: 401 })
}
// Use the verified user id, not the client-supplied one
const verifiedUserId = user.id
```

Then replace `userId: userId || ''` in the metadata with `userId: verifiedUserId`.

Also add these imports at the top:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
```

---

## 🟠 MEDIUM — XSS Risk in AI Output Rendering

**Files:** `app/page.tsx` (line 727), `app/content/page.tsx`, `app/report/page.tsx`

All three use `dangerouslySetInnerHTML` to render AI-generated text. The content is only lightly transformed (newlines → `<br>`, `**text**` → `<strong>`). If a prompt-injection attack caused Claude to output `<img src=x onerror="...">` or a `<script>` tag, it would execute in the user's browser.

**Fix — sanitize before inserting HTML.** Install DOMPurify:
```bash
npm install dompurify @types/dompurify
```

Then wrap every `dangerouslySetInnerHTML` call:
```typescript
import DOMPurify from 'dompurify'

// Instead of:
dangerouslySetInnerHTML={{ __html: msg.content.replace(...) }}

// Use:
dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content.replace(...)) }}
```

---

## 🟠 MEDIUM — Missing Security Headers

**File:** `next.config.ts`

No HTTP security headers are set. This leaves the site open to clickjacking and content-type sniffing.

**Fix — add headers to `next.config.ts`:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## 🟡 LOW — Vulnerable/Deprecated Dependency

**File:** `package.json`

- `xlsx: ^0.18.5` — This version has a known prototype pollution vulnerability (CVE-2023-30533). If you're generating Excel files, replace with the maintained fork `exceljs` instead.
- `@supabase/auth-helpers-nextjs: ^0.15.0` — This package is officially deprecated. You already use `@supabase/ssr` everywhere (correct), so this package can be removed entirely.

**Fix:**
```bash
npm uninstall @supabase/auth-helpers-nextjs
npm uninstall xlsx
npm install exceljs
```

---

## ✅ What's Already Good

| Area | Status |
|------|--------|
| Auth on all API routes | ✅ Every route checks `supabase.auth.getUser()` |
| Rate limiting | ✅ All routes rate-limited (5–20 req/min depending on cost) |
| Token caps | ✅ Daily token caps prevent bill drainage |
| Input validation & length limits | ✅ 10,000 char cap on chat, empty-check on all inputs |
| Stripe webhook signature | ✅ `stripe.webhooks.constructEvent()` properly verified |
| Service role key isolation | ✅ Only used in webhook (server-only), never client |
| `.env` files gitignored | ✅ `.gitignore` covers `.env*` |
| User data isolation | ✅ All DB queries use `eq('user_id', userId)` with RLS |
| XSS on user messages | ✅ User-typed content is NOT passed through `dangerouslySetInnerHTML` |
| HTTPS | ✅ Enforced by Vercel |
| No secrets in client code | ✅ Only `NEXT_PUBLIC_` vars exposed client-side, which is correct |
| Privacy policy | ✅ Exists at `/privacy` |
| Terms of service | ✅ Exists at `/terms` |

---

## ⚖️ Legal Notes

### 1. Terms of Service — AI Training Clause (Fix This)
Section 13 of Terms says you may use data "to train and improve our AI models (unless you opt out)." Two problems:
- You use Anthropic's API — you cannot train models on user data through it anyway. This claim is misleading.
- There's no opt-out mechanism.

**Fix:** Change the sentence to: *"We use your data solely to provide the service. We do not use your content to train AI models."*

### 2. Pricing Mismatch in Terms
Terms shows Pro at $29.99/mo and Premium at $59.99/mo. Make sure these match your actual Stripe prices and what's shown on `/pricing`.

### 3. Home Address in Privacy Policy
Your home address (20306 New Rochelle St, Walnut, CA 91789) is publicly listed. Consider using a PO Box or registered agent address instead for privacy.

### 4. No Cookie Consent Banner
If any EU users visit (or if you add any analytics tools later), you'll need a GDPR cookie consent banner. For now this is low risk since you don't currently run tracking scripts, but add one before adding any analytics.

### 5. Age Requirement
Terms requires users to be 18+. Good — this limits COPPA liability. Ensure you're not actively marketing to under-18s.

---

## Priority Fix Order

1. **RIGHT NOW:** Fix the Stripe checkout auth gap (15 min fix)
2. **This week:** Add security headers to `next.config.ts` (5 min fix)
3. **This week:** Fix the AI training clause in Terms
4. **Soon:** Add DOMPurify to sanitize AI output
5. **Later:** Remove deprecated packages, replace `xlsx`
