# Final Pre-Deployment Review — Arjun Automation Public Website

Date: 2026-10-15
Repo: `/Users/prashantharjun/Downloads/ArjunAutomationEnterprise-audit` (branch `main`, base HEAD `277e28e`)
Status: **Code is deployment-ready; deployment itself is NOT performed and NOT authorized.**

This document reports a *review* of the completed 2026-10-15 audit + visual redesign
workstream, plus the defects found and fixed during the review. Every number below was
produced by running the command shown or reading the file cited. No test result, metric,
customer, or uptime figure was fabricated.

---

## 1. Scope and method

- Inspected the working-tree diff, both prior reports, and the actual page/component/API
  implementations behind the public site.
- Re-ran the full gate set (TypeScript, ESLint, unit tests, production build, all
  public-website verifiers, chained `predeploy:verify`, and the Playwright E2E suite).
- Added a new runtime integrity suite, `e2e/predeploy-review.spec.ts` (9 tests), because the
  existing `scripts/verify-public-website.mjs` is source-string based and never checks real
  HTTP responses.
- Reviewed the contact/feedback/search forms and the environment they require.

**Stated limitation (must be read):** this model has **no image input**, so I could **not
visually inspect** the PNG screenshots in `reports/visual/`. Instead I measured the rendered
pages programmatically in real Chromium (overflow, header/h1 containment, touch-target sizes,
heading counts, image alt text, dead affordances, link resolution, computed tokens, focus
visibility). All visual-quality statements below are backed by those DOM/computed-style
measurements, not by eyeballing pixels. Lighthouse / Core Web Vitals were **not** available in
this environment and were therefore **not** measured.

---

## 2. Files changed by this review

New / changed by this review only:

| File | Change | Why |
| --- | --- | --- |
| `e2e/predeploy-review.spec.ts` | **new** (9 tests) | Runtime integrity: sitemap crawl, whole-site claim scan, security headers, metadata contract, one-`h1`, image alt, dead anchors, internal-link resolution, 24×24 touch targets, JSON-LD parse |
| `app/(marketing)/portfolio/[slug]/page.tsx` | +4/−1 | Detail page presented outcome figures with no illustrative label (index page has one) — added the disclaimer |
| `app/(marketing)/case-studies/[slug]/page.tsx` | +3/−1 | Same gap as above — added the illustrative disclaimer |
| `src/modules/company-launch-kit/components/MarketingFooterStatic.tsx` | footer link class `+py-1` | Footer link targets were 20px tall (< 24×24 WCAG 2.2 AA) |
| `src/modules/company-launch-kit/components/NewsletterSignup.tsx` | rewritten | Was a public fake-success control (“Check your inbox for confirmation”, nothing sent) |
| `src/modules/soft-launch/components/FeedbackForm.tsx` | rewritten | Was a public fake-success control (“captured locally”, nothing stored) |

**Preserved untouched** (pre-existing user/other work — not mine): `docs/GO_LIVE_CHECKLIST.md`,
`src/lib/lead-notify.ts`, `src/lib/lead-notify.test.ts`, `home-content.ts`, `pricing.ts`,
`services.ts`, `trust-conversion-content.ts`, and the untracked
`STAGING_COMPLETION_REPORT.md`, `src/lib/commercial-ledger*.ts`,
`src/lib/production-payments.test.ts`, `content-integrity.test.ts`, `*.bak`,
`supabase/migration-preflight-202610100002.sql`, `docs/WEBSITE-AUDIT-2026-10-15.md`.

The redesign workstream from the previous session (uncommitted) is unchanged by this review:
`src/design-os/css/design-os.css`, `premium.css`, `HeroSection.tsx`, `MarketingHeaderStatic.tsx`,
`TrustConversionModule.tsx` + `trust-conversion` sections, `trust-conversion.css`,
`HeroProductConcept.tsx`, `SectionHeader.tsx`, `e2e/visual-redesign.spec.ts`,
`docs/WEBSITE-REDESIGN-2026-10-15.md`, `reports/`.

---

## 2b. Defects found and fixed during this review

| # | Defect | Severity | Fix |
| --- | --- | --- | --- |
| 1 | `NewsletterSignup` (mounted on `/blog`) showed “Thank you for subscribing. Check your inbox for confirmation.” while sending **nothing**. | High (false claim) | Rewritten to an honest block pointing at the real contact form; no subscription is implied. |
| 2 | `FeedbackForm` (mounted on `/feedback`) reported “captured locally for the support team” while storing **nothing** (React state only). | High (false claim) | Rewritten to submit through the real, consent-gated pipeline (`LeadForm` → `POST /api/launch-kit/contact`, source `feedback-page`). |
| 3 | Portfolio and case-study **detail** pages presented outcome metrics (“35% increase…”, “100% sales team adoption…”, “99.7% integration uptime…”) with **no** “illustrative” label, though the index pages carry one. | Medium (integrity) | Added the same illustrative disclaimer to both detail-page intros. |
| 4 | Footer link touch targets were 20 CSS px tall (< the 24×24 WCAG 2.2 AA minimum). | Low (a11y) | Added `py-1` to the footer link class (now ≥ 32 px tall). |

Regression guards were added to `e2e/predeploy-review.spec.ts` for the removed false copy
(`check your inbox for confirmation`, `captured locally for the support team`) so they cannot
silently return.

---

## 3. Public claims verification

The banned-claim scan now runs over the **rendered HTML of every sitemap URL** (≈46 public
pages), not just the homepage. Patterns checked: `24/7`, `SLA-backed`, `99.9% uptime/SLA`,
`Live Health Endpoints`, `Trusted by`, plus the two removed false-success strings.
Result: **no hits**.

Supporting facts:
- Portfolio index, case-studies index, and homepage already disclose that outcome figures are
  illustrative targets, not audited client measurements; the two detail pages now do too.
- Portfolio “screenshots” are rendered as **labelled placeholders** (`screenshotSlots` → text
  boxes), not `<img>` tags — so there are no broken images and no fabricated UI screenshots.
- The `content-integrity.test.ts` guard covers only 4 files and does **not** cover
  `portfolio.ts` / `case-studies.ts`; the runtime scan above compensates, but extending the
  unit guard to those files is recommended follow-up.

Residual (owner-awareness, not blockers) unverifiable-ish copy still live: `home-content.ts`
“Continuous health monitoring with live status endpoints” and the managed-support FAQ’s
“defined response times”; the contact page’s “respond within one business day” service
promise; and `buildOrganizationJsonLd()` `sameAs` links to `linkedin.com/company/arjunautomation`
and `twitter.com/arjunautomation` — **verify those profiles exist, or remove them from the
structured data.**

---

## 4. Contact / demo form behaviour (reviewed, not executed against production)

- `src/modules/company-launch-kit/components/LeadForm.tsx` — client validation, `role="alert"`
  errors, disabled loading state, redirects to `/thank-you` **only** on a real `success: true`.
- `app/api/launch-kit/contact/route.ts` — honest status codes: 400 (invalid), 429 (rate limit,
  10/60 s), **503** with an explicit “not configured” message when storage/org is missing, 200
  only after a real insert + audit write. Dedup returns the existing lead id. Owner notification
  is fail-open and never changes the response.
- `/thank-you` is `noIndex` and claims only receipt, not a timeline beyond “one business day”.

**No message was sent, no payment made, no production data changed.**

### Production environment prerequisites (owner action)

For the contact/feedback/solutions/launch forms to succeed in production, these must be set
(all documented in `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PLATFORM_ORGANIZATION_ID`

If any is missing, the API honestly returns `503` and the forms display an error (they will
**not** fake success) — but to a visitor the forms look broken, so this is a **pre-flight
requirement**. Optional owner notification additionally needs `RESEND_API_KEY` + `RESEND_FROM`
(or `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM`). Locally `.env.local` contains only
`VERCEL_OIDC_TOKEN`, so local submissions correctly return the honest 503.

---

## 4b. Links, metadata, navigation, headers

Measured on a real server via `e2e/predeploy-review.spec.ts` (all passing):

- **robots.txt** advertises the sitemap and disallows `/dashboard`, `/company-launch-kit`,
  `/brand-os`, `/auth/`.
- **Every sitemap URL resolves < 400** (no 404/500 in the public crawl).
- **Internal links** collected from the key pages all resolve below 400; no `href="#"` or empty
  `href` on any key page.
- **Metadata contract** holds on `/`, `/about`, `/services`, `/services/platform-implementation`,
  `/pricing`, `/portfolio/crm`, `/case-studies/crm`, `/contact`, `/faq`: real `<title>`,
  ≥40-char description, absolute `rel=canonical`, `og:title`. JSON-LD blocks exist and parse.
- **One `<h1>` per page**; every `<img>` has `alt`.
- **Security headers present:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`,
  `X-DNS-Prefetch-Control: on`. **Not present: `Content-Security-Policy` and `Strict-Transport-Security`.**
  Recommend adding HSTS at the platform/CDN layer and a CSP as hardening (not a blocker).
- Responsive navigation, keyboard focus on the primary CTA, and no horizontal scroll at
  320/360/390/430/768/1024/1280/1440 px remain verified by `e2e/visual-redesign.spec.ts`.

---

## 5. Gate results (all re-run on the current tree)

| Gate | Result |
| --- | --- |
| `npx tsc --noEmit` | exit 0, clean |
| `npx eslint .` | exit 0 — **0 errors**, 378 warnings (pre-existing unused-vars) |
| `npx vitest run` | **287 passed** (59 files) |
| `npx next build` | exit 0 — BUILD_ID present, 161 app paths, 58 prerendered + 4 dynamic |
| `public-website:verify` | 48/48 |
| `company-launch-kit:verify` | 89/89 |
| `premium-website:verify` | 89/89 |
| `trust-conversion:verify` | 40/40 |
| `design-os:verify` | 72/72 |
| `soft-launch:verify` | 53/53 |
| `brand-os:verify` | 159/159 |
| `business-assets:verify` | 69/69 |
| `ai-delivery-model:verify` | 6/6 |
| `predeploy:verify` (chained production/readiness/go-live/RLS) | 6/6 |
| `npx playwright test --workers=1` | **70 passed, 2 skipped** (72 tests / 7 files) |

The 2 skipped E2E tests are auth-gated (`E2E_EMAIL`/`E2E_PASSWORD`) — by design.

**E2E flakiness note (environmental, not a regression):** with default full parallelism the dev
server cold-compiles many routes concurrently and each `page.screenshot()` waits on Google
Fonts, which is unreachable here; this produced timeout failures. Running `--workers=1`
(preferred) or against a prebuilt/preview server passes 70/70. This is a local harness
condition, not a product defect.

---

## 6. Pre-existing verifier failures (investigated, evidenced)

`premium-ui:verify` and `immersive-v2:verify` fail. I established each is **genuinely
pre-existing and unrelated**, using an isolated `git worktree` at base `HEAD` (`277e28e`) with
`node_modules` symlinked, and running the actual verifier scripts there:

| Verifier | At base HEAD (`277e28e`) | Current tree | Verdict |
| --- | --- | --- | --- |
| `premium-ui:verify` | **57/76** (19 fail) | **58/76** (18 fail) | Pre-existing; my token layer fixed one (`tokens:elevation_scale`) |
| `immersive-v2:verify` | **48/52** (4 fail) | **48/52** (same 4) | Pre-existing; unchanged |

Root cause proven from history: the verifiers assert CSS utility classes
(`.dos-gpu`, `.dos-glass-panel`, `.dos-focus-ring`, `.dos-ripple`, spacing/elevation utilities)
and motion components (`AiTypingText`, `AiThinkingIndicator`, `PhysicsPageTransition`) that were
**removed** from `src/design-os/css/design-os.css` when the design system was rewritten in commit
**`0000cb3` (2026-08-17)** — I verified the count went `3 → 0` for `.dos-gpu` and `1 → 0` for
`.dos-glass-panel` at that commit. The verifiers were left stale and were never updated to the
new architecture. `HEAD:src/design-os/css/design-os.css` contains **0** occurrences of these
symbols, and they exist nowhere else in `src` today.

Per instruction, I did **not** create fake components/utilities to satisfy these brittle checks.

Related real (but out-of-scope and pre-existing) a11y gap worth a follow-up: `src/design-os`
`Button`/`Input` put `dos-focus-ring`/`dos-ripple`/`dos-gpu` on real controls, and those classes
are undefined — so those design-os controls have `focus:outline-none` with **no visible focus
ring**. This affects admin/soft-launch UI, not the public marketing forms (which use their own
accessible components). It should be fixed in a dedicated design-os change.

---

## 7. Unresolved risks / owner decisions

1. **Deployment not performed and not authorized** (standing rule). The live site still serves
   the pre-audit, pre-redesign code (including the removed “Trusted by” / “24/7” copy). Nothing
   ships until you build and deploy.
2. **Production env vars** (see §4) must be set or the public forms return an honest 503.
3. **Missing CSP/HSTS** — hardening recommendation.
4. **`premium-ui:verify` / `immersive-v2:verify`** remain red pending a design-os verifier refresh
   or utility restoration; documented, not caused here.
5. **Content judgement call:** portfolio/case-study figures are now labelled illustrative
   everywhere. If you instead want them removed entirely, that is a content decision.
6. **JSON-LD `sameAs`** points at LinkedIn/Twitter profiles that may not exist; verify or remove.
7. **`reports/` and the new docs are untracked and not gitignored** — they are outside `public/`
   so they will not be served, but consider committing or ignoring them deliberately.

---

## 8. Rollback instructions

Nothing is committed. Only the changes made in **this review** are listed in §2.

Roll back **this review only** (keeps the redesign and your pre-existing work intact):

```bash
cd ~/Downloads/ArjunAutomationEnterprise-audit
git checkout -- "app/(marketing)/portfolio/[slug]/page.tsx" \
                "app/(marketing)/case-studies/[slug]/page.tsx"
# Footer/Newsletter/Feedback: restore the pre-review versions
git checkout -- src/modules/company-launch-kit/components/NewsletterSignup.tsx \
                src/modules/soft-launch/components/FeedbackForm.tsx
# MarketingFooterStatic.tsx was ALSO changed by the redesign — revert only the py-1 touch-target
# line by hand (re-add `inline-block rounded text-slate-400 ...` without `py-1`), do NOT
# `git checkout` the whole file or you will lose the redesign.
rm -f e2e/predeploy-review.spec.ts
```

Roll back the **entire** website workstream (redesign + review) safely and recoverably:

```bash
git stash push -u -m "website-redesign+predeploy-review-2026-10-15"   # recover later with: git stash pop
```

(This also stashes the pre-existing user changes; use only if you intend to shelve everything.)

Deployment rollback (once deployed) is at the platform level (Vercel): promote the previous
deployment, or `git revert` the deploy commit — the repo currently has no committed version of
these changes, so a rollback of a future commit is the intended path.

---

## 9. Recommendation: **GO (conditional)**

**GO — conditional.** The build is deployment-ready and every gate I can run passes. No NO-GO
condition was found in code, content integrity, forms, links, metadata, security headers, or
responsive behaviour. The pre-existing `premium-ui:verify` / `immersive-v2:verify` failures are
unrelated to this work and should not block the website release; track them separately.

Ready to deploy once these pre-flight conditions are met:

- [ ] Owner explicitly authorizes the deploy (required — no deployment is performed by me).
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PLATFORM_ORGANIZATION_ID` are
      confirmed set in the target environment (and, for owner alerts, `RESEND_API_KEY` +
      `RESEND_FROM`).
- [ ] Optionally add HSTS/CSP at the edge and verify the JSON-LD `sameAs` profiles exist.
- [ ] After deploy, re-run `e2e/predeploy-review.spec.ts` against the production URL
      (`PLAYWRIGHT_BASE_URL=https://www.arjunautomations.com`) and submit one real test lead
      through the live contact form to confirm the pipeline end-to-end.

This recommendation covers the **code**. It does not authorize the deploy, and it does not
authorize sending the paused Propmediate outreach — both remain your explicit decisions.
