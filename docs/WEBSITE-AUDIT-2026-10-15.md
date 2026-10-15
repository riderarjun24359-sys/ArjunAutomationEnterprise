# Public Website Audit & Integrity Remediation — 2026-10-15

Scope: the public marketing site (`app/(marketing)`, `src/modules/company-launch-kit`,
`src/modules/trust-conversion`) served at `https://www.arjunautomations.com`.

Method: repository inspection, gate execution (tsc / eslint / vitest / next build),
Playwright browser journeys, and a production-render check (`next start` + HTTP).

---

## A. Repository findings

- **Framework**: Next.js `16.4.0` (App Router), React `19.2.4`, TypeScript, Tailwind v4
  (`@import "tailwindcss"` in `app/globals.css`), Vitest + jsdom, Playwright.
- **Public site**: `app/(marketing)/layout.tsx` → `MarketingLayout`
  (`MarketingHeaderStatic` + `MarketingFooterStatic`, `premium.css` theme).
  Homepage = `PremiumHomePage` → `HeroSection` + `TrustConversionModule`.
- **Design system already exists**: `src/design-os/css/design-os.css` tokens
  (`--dos-*`), `src/modules/company-launch-kit/design-system/premium.css`
  (`--premium-*`), shared premium UI in `company-launch-kit/components/premium/ui`.
- **Navigation/SEO plumbing is real**: `config/routes.ts`, `lib/seo.ts`
  (`buildMetadata`), `sitemap.xml`, `robots.txt`, JSON-LD
  (`MarketingStructuredData`), security headers (`next.config.ts`).
- **No dead affordances found in the public site**: no `href="#"`, no empty
  `onClick`, no TODO/FIXME/"coming soon" placeholders; every internal link
  resolves to a real route in `app/(marketing)`.
- The deployed site matches this repository's copy (hero
  "Run your business on one intelligent system." + trust module).

## B. Baseline gate status (before changes)

| Gate | Result |
| --- | --- |
| `npx tsc --noEmit` | clean (no output) |
| `npm run lint` | 0 errors, 378 warnings (unused vars) |
| `npm run test:unit` (vitest) | 282 passed |
| `npm run build` | success, 175/175 static pages |

## C. Root causes / real defects found

The primary integrity defects were **unverifiable claims in shipped public copy**,
not broken code (`rules 6, 8, 13` of the directive):

1. **Fabricated client proof.** `TrustedBySection` rendered target industries
   under the literal label **"Trusted by"** with `aria-label="Enterprise clients"`,
   presenting industry codes (MFG/HLT/...) as if they were client logos. No
   clients exist.
2. **Unverifiable round-the-clock / SLA claims** in homepage and service copy:
   - `trust-conversion-content.ts`: "24/7 platform monitoring, SLA-backed support
     tiers", "24/7 intelligent support", "SLA tiers".
   - `home-content.ts`: Managed Support "24/7 platform monitoring…", FAQ answer
     "24/7 monitoring … SLA-backed response times".
   - `pricing.ts`: Enterprise tier "24/7 SLA-backed support" / "24/7 monitoring
     and response".
   - `services.ts` (managed-support): tagline/description/solutions/process/
     technologies/FAQ asserting 24/7 and SLA-backed delivery.
3. **Uptime-style metric overstated.** The trust counter **"10 Live Health
   Endpoints"** was unsupported: the repository exposes 2 health routes and 2
   additional status routes (`ops/health`, `production-readiness/health`,
   `ops/ready`, `ops/live` = 4).

Verifiable counters were checked and left intact: **130** pages (actual 130),
**90+** authenticated routes (actual 94), **68** versioned DB migrations
(actual versioned count, excluding one non-versioned `20260805_*` file).

## D. Files changed

- `src/modules/trust-conversion/components/sections/TrustedBySection.tsx`
  — "Trusted by" → "Industries we build for"; aria-label "Enterprise clients" →
  "Industries we build for".
- `src/modules/trust-conversion/data/trust-conversion-content.ts`
  — 3 claims qualified; 4th counter corrected (`10 Live Health Endpoints` →
  `4 Health & Status Endpoints`).
- `src/modules/company-launch-kit/data/home-content.ts`
  — Managed Support + FAQ claims qualified; hero stats counter corrected.
- `src/modules/company-launch-kit/data/pricing.ts`
  — Enterprise support tier reframed as extended-coverage (terms by agreement).
- `src/modules/company-launch-kit/data/services.ts`
  — Managed Support copy qualified (tagline, description, solutions, process,
  technologies, FAQ).
- **New test**: `src/modules/company-launch-kit/data/content-integrity.test.ts`
  — regression guard that fails if `24/7`, `SLA-backed`, `99.9% uptime`,
  `Live Health Endpoints`, or a "Trusted by" client implication is reintroduced
  into public marketing content.

No database, migration, auth, security, or application-logic changes were made.

## E. Verification evidence (after changes)

| Gate | Result |
| --- | --- |
| `content-integrity.test.ts` | 5/5 passed |
| `npx tsc --noEmit` | clean |
| `npm run test:unit` | 287 passed (59 files) |
| `npm run build` | exit 0, 175/175 static pages |
| `npm run trust-conversion:verify` | 40/40 |
| `npm run company-launch-kit:verify` | 89/89 |
| `npm run public-website:verify` | pass |
| `npm run ai-delivery-model:verify` | 6/6 |
| `npm run test:e2e` (Playwright/chromium) | 42 passed, 2 skipped |
| Production render (`next start` :3100, HTTP 200) | `Industries we build for` present; `Trusted by`, `24/7`, `SLA-backed` absent; counter `4 · Health & Status Endpoints` rendered |

## F. Outstanding / not done

- **No full visual redesign was performed.** The site already ships a premium
  design-token system (`design-os` + `premium`), so replacing it would be
  subjective churn against rule 3 ("preserve useful architecture"). Design
  direction is unchanged pending an explicit owner decision.
- **Internal (non-public) content still contains the same class of claims** and
  was intentionally left untouched to keep this change reviewable:
  `src/modules/business-assets/data/services-catalog.ts` (incl. "99.9% uptime
  SLA"), `src/modules/brand-os/content/**` (company-profile, managed-support.md),
  and various business-asset templates. These are not imported by any
  `app/(marketing)` route. Recommended follow-up: apply the same qualification,
  or gate them behind "draft/negotiation" status.
- **`public-site/components/sections/Operations.tsx`** ("24/7 Operations") is not
  mounted in any route; left as-is but flagged here.
- Playwright ran against **chromium only**; no cross-browser (WebKit/Firefox)
  matrix, no performance trace/Core Web Vitals measurement, and no Lighthouse
  run were performed in this pass.
- E2E was run against a local dev server, not against production.

## F2. Deployment

No deployment was performed. All changes are **local working-tree changes**.
They ship only when the owner builds and deploys.

## G. Ownership / honesty statement

Every number in this document was produced by running the command shown or
reading the file cited. No send, payment, customer, testimonial, uptime figure,
or business result was fabricated. Pre-existing user working-tree changes were
preserved untouched.
