# ⚡ SUPABASE FIX — LOGIN/SIGN-UP/EMAIL CONFIRMATION (Owner — 20 mins)

## Diagnostic result (2026-10-20)
- Sign-up API ✅ works (tested live — Supabase returns proper responses)
- Sign-in API ✅ works (tested live — proper `invalid_credentials`)
- UI forms ✅ render fine (tested in real browser)
- **REAL ROOT CAUSE (2026-10-20 owner report): confirmation email link
  velte `http://localhost:3000` ki veltundi → "localhost refused to connect".
  Supabase Dashboard **Site URL = localhost:3000** ga set ayyi undi — adi
  email links nilocalhost ki generate chestundi.**

**RESCUE (already live):** `/auth/fix-confirmation` page — customer localhost
link paste cheyadam tho in-place confirm chesochu (appku dashboard fix after
open anthe). Dashboard lo Site URL fix kuda cheyyandhi.

Gmail domain rejection test lo `email_address_invalid` vachindi — Supabase
throwaway domains block chestundi (adi birdu). Real gmail domain problems
unna: confirmation mail **radam**|% ra vachina **spam** lo — Supabase
built-in SMTP rate-limits (2 mail/hour) + reputation issues.

---

## ✅ FIX 0 — Site URL + redirects (MOST URGENT — localhost link cause, 5 min)
Supabase Dashboard → **Authentication → URL Configuration**

1. **Site URL:** `https://www.arjunautomations.com` ← ippatti varaku localhost:3000 ga undi — email link localhost enuku velthundo its RESCUE
2. **Redirect URLs** list lo ivi lekapothey ADD:
   - `https://www.arjunautomations.com/**`
   - https://www.arjunautomations.com/auth/callback
   - https://www.arjunautomations.com/auth/reset-password
   - https://www.arjunautomations.com/auth/welcome
3. **Save** → test: customer signup email lo link ippudu **http site ki velthundi**.

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

## ⚠️ IMPORTANT — Deploy Manual Rule (2026-10-20 learning)
Repo deploy workflow **automatic push-trigger LEKUNDA** drinking.
Code commit+push only repo ki veltundi, live site ki velladhu!

Site deploy = GitHub Actions **manual job**:
    gh workflow run production-deploy.yml --ref main -f action=deploy-production
(or) GitHub.com → Actions → "Production Early Access Deploy" → Run workflow → action: `deploy-production`

Personal iddari deploy ki nuvvu code push chesakapadu
**deploy-production** action run cheyali for site ni update cheyyatam ki.

---

**After Fix 1+2:** test garganta — meeku personal email tho signup chesi,
confirmation mail + login + `?` dashboard check cheyandi.
