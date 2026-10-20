# ⚡ SUPABASE FIX — LOGIN/SIGN-UP/EMAIL CONFIRMATION (Owner — 20 mins)

## Diagnostic result (2026-10-20)
- Sign-up API ✅ works (tested live — Supabase returns proper responses)
- Sign-in API ✅ works (tested live — proper `invalid_credentials`)
- UI forms ✅ render fine (tested in real browser)
- **Real problem: email confirmation mail delivery + Supabase URL config**

Gmail domain rejection test lo `email_address_invalid` vachindi — Supabase
throwaway domains block chestundi (adi birdu). Real gmail domain problems
unna: confirmation mail **radam**|% ra vachina **spam** lo — Supabase
built-in SMTP rate-limits (2 mail/hour) + reputation issues.

---

## ✅ FIX 1 — Custom SMTP (most important, 10 min)
Supabase Dashboard (https://supabase.com/dashboard) → project
`ixassghxogcabfcyjjtz` → **Authentication → SMTP Settings**

1. **Enable Custom SMTP** toggle ON
2. Recommended: **Resend** (free 100/day) — resend.com lo account + API key
   - Host: `smtp.resend.com` · Port: 465
   - Username: `resend` · Password: `<RESEND_API_KEY>`
   - Sender: `noreply@arjunautomations.com`
   - MAHN domain verify resend.com dashboard lo cheyandi
3. Minimum interval: `1 min` add (Rate limiting lo)
4. **Save** → "Send test email" cheyandi — meeku vachali

## ✅ FIX 2 — Redirect URLs whitelist (5 min)
Same Dashboard → **Authentication → URL Configuration**

1. **Site URL:** `https://www.arjunautomations.com`
2. **Redirect URLs** list lo ivi unnayi confirm cheyandi (lanti ve lekapothey add):
   - `https://www.arjunautomations.com/**`
   - https://www.arjunautomations.com/auth/callback
   - https://www.arjunautomations.com/auth/reset-password
   - https://www.arjunautomations.com/auth/welcome

## ✅ FIX 3 — Templates personalise (optional, 2 min)
**Authentication → Email Templates** — "Confirm signup" template lo
logo + Telugu greeting add cheyandi (optional)

## ✅ Plan activation (payments)
- Webhook design lo **manual reconciliation** untundi — UPI payment
  confirm chesey/plan active cheyadi **owner manual ga finance module**
  dashboard lo cheyali.
- Stripe/Razorway lo auto-ga + UPI manual confirm — honestly,
  day-one manual job.

---

**After Fix 1+2:** test garganta — meeku personal email tho signup chesi,
confirmation mail + login + `?` dashboard check cheyandi.
