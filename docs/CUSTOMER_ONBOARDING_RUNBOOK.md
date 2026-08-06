# Customer Onboarding Runbook

How operators and first customers move from invite to productive workspace on go-live.

## Customer journey (happy path)

1. **Invite / discover** — marketing site or private invite link
2. **Sign-up** — `/auth/sign-up`
3. **Verify email** — `/auth/verify-email` (template: `verify-email.md`)
4. **Welcome** — `/auth/welcome` (template: `welcome.md`)
5. **Onboarding wizard** — `/onboarding`
   - Organization profile
   - Workspace defaults
   - First project checklist
6. **Core product** — CRM / Projects / Executive surfaces as entitled by plan
7. **Upgrade (optional)** — `/pricing` → `/pricing/upgrade`

## Operator checklist per new customer

- [ ] Account created and email verified
- [ ] Organization created; `PLATFORM_ORGANIZATION_ID` not confused with customer org
- [ ] Onboarding wizard completed (or assisted)
- [ ] Storage upload smoke (logo / doc) succeeds
- [ ] Plan entitlement correct (free trial / starter / professional / enterprise)
- [ ] If paid: Stripe customer + webhook events received
- [ ] Support contact recorded; help center `/help` shared

## Email dependencies

| Template | Path | When |
|---|---|---|
| Verify email | `src/modules/soft-launch/content/emails/verify-email.md` | After sign-up |
| Welcome | `src/modules/soft-launch/content/emails/welcome.md` | After verify |
| Invite teammate | `src/modules/soft-launch/content/emails/invite-teammate.md` | Team invite |

Provider must be configured (`RESEND_API_KEY` or SMTP_*) before cohort launch.

## Support scripts

- Point users to `/help`, `/faq`, `/feedback`
- For access issues: confirm auth redirect URLs + email delivery logs
- For billing: Stripe dashboard + webhook secret alignment
- For data: Security Center audit + Platform Operations

## Failure handling during onboarding

| Symptom | Action |
|---|---|
| Email not received | Check provider env, spam, Resend/SMTP logs; resend verify |
| Onboarding stuck | Clear local onboarding storage key; retry `/onboarding` |
| Upload fails | MIME/size limits; bucket policies; auth session |
| Upgrade fails | Stripe keys/mode; webhook; plan ID mapping |
| Widespread failure | Pause invites; execute `docs/ROLLBACK_RUNBOOK.md` |

## Go-Live gates

Before inviting the next cohort, confirm:

```bash
curl -fsS "$PRODUCTION_BASE_URL/api/ops/go-live"
```

Dashboard: `/go-live` — onboarding assets + security + email/payment tasks acceptable.
