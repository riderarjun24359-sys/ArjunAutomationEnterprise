# Early Access Cohort Runbook

First real customer cohort — execution only (no schema or product changes).

## 1. Create first invite batch

Operator steps (Founder/Admin):

1. Open `/early-access` → **Early Access Management**
2. Confirm COP beta invitations / org invitations / identity invitations load from Supabase
3. Seed invite batch in production via existing COP/IDP invitation flows (or SQL insert into existing `cop_beta_invitations` / `organization_invitations` / `idp_invitations` — no new tables)
4. Capture invite codes (`invitation_key`) and share privately with cohort

Checklist:

- [ ] Invite emails listed
- [ ] Invite codes visible
- [ ] Cohort ref tagged (e.g. `ea-cohort-1`)

## 2. Configure waitlist approvals

1. Waitlist rows come from sales leads in wait/new/inbound states
2. Promote approved waitlist entries to invites
3. Approve COP beta organizations under **Organization approvals**

Checklist:

- [ ] Waitlist reviewed
- [ ] Approvals granted for enrolled orgs
- [ ] Founder notes captured for edge cases

## 3. Verify onboarding flow

1. Sign-up → `/auth/sign-up`
2. Verify email → `/auth/verify-email` (+ `verify-email.md` template)
3. Welcome → `/auth/welcome`
4. Onboarding wizard → `/onboarding`
5. Confirm CS onboarding workflows / success tasks appear in Early Access **Customer Success Console**

## 4. Verify email delivery

Requires `RESEND_API_KEY` or `SMTP_*` (+ from address).

Templates:

- `welcome.md`
- `verify-email.md`
- `invite-teammate.md`
- `password-reset.md`

Smoke: send one invite + one verify-email in production.

## 5. Verify founder alerts

1. `/early-access` → Founder Monitoring (new orgs, failed onboarding, daily summary)
2. `/founder-analytics` → Founder Alerts (revenue/payment/security)
3. Optional: `OPS_ALERT_WEBHOOK_URL` for external paging

## Cohort sign-off

| Role | Name | Date |
|---|---|---|
| Founder | | |
| Ops | | |
