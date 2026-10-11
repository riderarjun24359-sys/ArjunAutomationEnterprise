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

## First-customer services motion (delivery engagements)

For the initial services customer (platform implementation offer), follow the
persisted lifecycle — every step below maps to implemented code and records:

1. **Capture** — public lead form (`/contact`) with consent; deduped per-org
   into `sales_leads`; consent proof in `sales_audit_logs` metadata.
2. **Qualify** — move through `open → qualified → proposal → negotiation →
   won/lost` in the sales pipeline; log follow-ups as `sales_activities`
   with due dates (`getDueFollowUps` lists what is due — owners act, nothing
   auto-sends).
3. **Discover** — run the questionnaire
   (`src/modules/brand-os/content/sales-kit/discovery-questionnaire.md`) and
   persist answers via `buildDiscoveryInterviewInput` +
   `businessAnalystService.createInterview` on the engagement.
4. **Propose** — draft from the catalog (`buildProposalDraft`), persist via
   `businessAnalystService.createProposal`, version via requirement versions.
   Customer approval is a human `createReviewApproval` row
   (`pending → approved`). No e-signature is claimed: use the external
   signing handoff and file the signed copy before proceeding.
5. **Onboard** — work `buildOnboardingChecklist` with the customer; track
   state in `cop_onboarding_wizards` rows, never in mock profiles.
6. **Execute** — projects, milestones, tasks (`todo → in_progress →
   review → done`, terminal states enforced); pipeline runs record `pending`
   until a worker result is recorded — never mark complete from a queue row.
7. **Verify + accept** — record real quality verifications; deployment stays
   blocked until all pass (`canAdvanceToStage`); acceptance is an explicit
   `delivery-acceptance` review approval (`buildAcceptanceApprovalInput`).
8. **Invoice (manual, until provider mapping is live)** — create the invoice
   in the finance module (unique number enforced); share invoice number,
   amount, currency, due date, and UPI/bank transfer details with the
   customer over an approved channel; on receipt of a transfer reference,
   record a manual payment (amount ≤ outstanding balance enforced).
9. **Reconcile** — match provider events to invoices with
   `reconcileProviderEvent`; discrepancies stay open for human review.
   Refunds need a human approval id + reason and can never exceed paid.
10. **Support** — log tickets in `support_tickets` with SLA; work
    `selectOverdueTickets`/`selectResponseBreaches` weekly; renewals via
    `csd_renewal_forecasts` worked through `selectRenewalsDue` 30 days out.

Human approval stays mandatory before external messages, contracts,
charges, refunds, or irreversible actions. No step above invents prospects,
approvals, payments, or completed work.
