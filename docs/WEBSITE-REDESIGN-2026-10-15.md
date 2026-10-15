# Website Visual Redesign — 2026-10-15

Premium visual pass over the public marketing site (`https://www.arjunautomations.com`),
sitting on top of the 2026-10-15 integrity remediation recorded in
[`WEBSITE-AUDIT-2026-10-15.md`](./WEBSITE-AUDIT-2026-10-15.md).

**Status: implemented and verified locally. Not deployed** — no deployment was authorised,
so nothing in this document is live yet.

---

## 1. Root cause

The site already ships a token-based design system, but **47 `--dos-*` custom properties
were referenced in ~350 places and defined nowhere** (they existed only as TypeScript
constants under `src/design-os/tokens/*`, never emitted as CSS). Every `var(--dos-…)`
therefore fell back to its property's initial value:

| Missing token(s) | Rendered consequence |
| --- | --- |
| `--dos-radius-{lg,md,2xl,3xl,full}` | square corners on every token-rounded surface |
| `--dos-shadow-*`, `--dos-elevation-*` | no elevation — the whole page was flat |
| `--dos-glass-bg/-border/-blur` | transparent "glass" panels |
| `--dos-border-focus`, `--dos-border-strong` | **no visible keyboard focus ring** |
| `--dos-{accent,error,info,success,warning}` + muted variants | semantic colour collapsed to defaults |
| `--dos-font-display` | `.font-display` was a no-op (it also overrode nothing, luckily) |

Measured on the **deployed (pre-change)** site vs **local (post-change)**, 1440px:

| Metric | Before (deployed) | After (local) |
| --- | --- | --- |
| Elements using `rounded-[var(--dos-radius…)]` | 1 | 30 |
| …of those resolving to `0px` radius | **1 / 1** | **0 / 30** |
| Cards/panels/header/footer with a box-shadow | **0 / 38** | **46 / 48** |
| Hero `<h1>` size | 72px | 60px (tighter, two-line balance) |
| `"Trusted by"` unverified claim rendered | present | absent |
| `"24/7"` unverified claim rendered | present | absent |

---

## 2. What changed

### 2.1 Design-token layer (the real fix)

- **`src/design-os/css/design-os.css`** — appended a documented *token-completion layer*:
  radii, elevation/shadows, glass, semantic colour (+ muted variants), semantic text,
  overlay surfaces, `--dos-duration-fast`, and z-layers. Theme-independent tokens live in
  `:root`; colour/elevation/focus tokens get `.dark` overrides. This is additive — no
  existing declaration was altered.

### 2.2 Shared premium primitives

- **`src/modules/company-launch-kit/design-system/premium.css`**
  - `.font-display` now resolves `var(--font-inter, var(--dos-font-sans))` so headings use
    the self-hosted Inter that `app/(marketing)/layout.tsx` provides (previously a no-op).
  - New shared utilities: `.premium-card`, `.premium-card-icon`, `.premium-eyebrow`,
    `.premium-chip`, `.premium-cta-panel`, `.premium-cta-grid`, `.hero-grid-bg`.
  - Reduced-motion coverage extended to the new primitives.

- **`src/modules/trust-conversion/styles/trust-conversion.css`** — `.tc-card`, `.tc-logo`,
  `.tc-badge`, `.tc-timeline-line`, `.tc-step-dot` are now token-driven (were hard-coded
  hex/`rem` values), and gain elevation + hover states.

- **`src/modules/trust-conversion/components/ui/SectionHeader.tsx`** *(new)* — one section
  header so every band shares the same type scale, spacing and colour instead of each page
  hand-rolling its own `<h2>`.

### 2.3 Hero — honest, server-rendered product visual

- **`HeroSection.tsx`** rewritten:
  - **Dropped the three.js/WebGL hero** (`ArjunOSVisualization` + `Environment3D`) and the
    `framer-motion` background `Spotlight`/`AnimatedGridPattern`. The hero is now a **server
    component** with pure-CSS atmosphere (`.hero-grid-bg` + blurred brand blooms) and CSS
    entrance (`.hero-fade-up`). The homepage now ships **no WebGL and no animation-library
    JavaScript**.
  - Two-column layout: copy (eyebrow → headline → subhead → CTAs → honest trust bullets from
    `HERO_CONTENT`) beside the product visual.
  - CTAs now come from `HERO_CONTENT.primaryCta/secondaryCta` (single source of truth).

- **`src/modules/company-launch-kit/components/premium/ui/HeroProductConcept.tsx`** (new) —
  a server-rendered **interface concept**: window chrome, module rail, KPI sparkline tiles and
  a workflow list. It is explicitly labelled `Product concept` and captioned
  *"Illustrative interface concept — not live customer data."* No fabricated logos, metrics,
  or live status feeds.

### 2.3 Section recomposition

All five trust sections now use `SectionHeader` + the shared primitives:

- **`TrustedBySection`** — industries strip of real industry tiles, "Industries served" /
  "Technologies mastered" chip panels, "Built-in security & governance" cards, and a platform
  scale counter row. (Keeps `clientLogos`, `industries`, `technologies`, `badges`, `counters`.)
- **`WhyArjunSection`** — 8 value cards with icon tiles and outcome eyebrows.
- **`ServicesPreviewSection`** — 9 service cards: icon, business value, benefit list, CTA.
- **`DeliveryProcessSection`** — 9-step desktop rail + readable vertical timeline on mobile.
- **`TrustMetricsSection`** — 6 metric cards with icon tiles.
- **`TrustConversionModule`** — the closing CTA is now a dark-navy gradient
  `.premium-cta-panel` with an accent grid, replacing the flat `bg-indigo-950` box.

### 2.4 Chrome

- **`MarketingHeaderStatic`** — curated desktop nav (6 highest-intent links) beside the logo
  and CTA; the full 10-link `NAV_ITEMS` list lives in the mobile menu. The old single-row
  10-link nav was measured to overflow at 1024px. Sticky glass header, token focus rings,
  JS-free `<details>` mobile menu.
- **`MarketingFooterStatic`** — dark-navy footer, `inverse` (white) logo preserved, brand
  column, four link columns, contact action.

---

## 3. Verification (all run locally)

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `eslint .` | 0 errors (378 pre-existing warnings) |
| `vitest run` | **287 passed** |
| `next build` | exit 0, 175/175 routes |
| `trust-conversion:verify` | **40/40** |
| `premium-website:verify` (via trust-conversion) | pass |
| `public-website:verify` | pass |
| `company-launch-kit:verify` | pass |
| `brand-os:verify` | pass |
| `design-os:verify` | pass |
| `ai-delivery-model:verify` | pass |
| `business-assets:verify` | pass |
| `playwright test` (full e2e) | **61 passed, 2 skipped** (2 = auth-gated, as designed) |
| Undefined `--dos-*` tokens remaining | **0** |

### 3.1 New browser verifier

`e2e/visual-redesign.spec.ts` (19 tests) asserts the acceptance criteria in real Chromium:

- homepage renders with **no horizontal scroll** at **320 / 360 / 390 / 430 / 768 / 1024 /
  1280 / 1440px**, and no `header/main/footer/h1/h2` escapes the viewport at 1024px;
- the journey **homepage → primary CTA → contact → validation → honest result** works;
- services index → service detail works;
- mobile menu opens with the full link list; desktop nav resolves;
- keyboard focus is visible on the primary CTA;
- homepage/service/contact raise **no uncaught page errors**;
- design tokens resolve **and are consumed** (cards are rounded and shadowed);
- audit-banned claims (`24/7`, `SLA-backed`, `99.9%`, `Trusted by`, `Live Health Endpoints`)
  never render.

### 3.2 Screenshots

`reports/visual/` (untracked, 4.3 MB):

- `home-{320,360,390,430,768,1024,1280,1440}.png` — responsive homepage;
- `home-1440-fullpage.png`, `home-390-fullpage.png` — full-page desktop/mobile;
- `service-1440.png`, `contact-1440.png`, `contact-390.png`, `mobile-nav-390.png`;
- `baseline/home-1440.png`, `baseline/home-390.png` — the **deployed (pre-redesign)** site,
  captured for before/after comparison.

---

## 4. Honesty / integrity constraints preserved

- No fabricated customers, logos, testimonials, metrics, uptime, SLAs, or screenshots.
- The one product visual is explicitly a **labelled concept**, not presented as live data.
- The removed `24/7` / `SLA-backed` / `Trusted by` claims were **not** reintroduced; the
  `content-integrity.test.ts` guard still passes (5/5).
- Available services vs custom development remain distinguished (unchanged data).
- No deployment, no schema change, no payment/analytics wiring.

---

## 5. Known limitations / outstanding

1. **Not deployed.** All changes are local and uncommitted.
2. **`premium-ui:verify` (58/76) and `immersive-v2:verify` are failing — pre-existing and
   unrelated.** They assert artefacts that this repository has never contained
   (`.dos-gpu`, `.dos-glass-panel`, `.dos-focus-ring`, `.dos-text-body-sm`, `RouteTransition`
   in `DashboardShell.tsx`, `whileHover` in `Card.tsx`, `immersive-ambient`, `physics_page`).
   The token work is purely additive to `design-os.css`, so it cannot change those outcomes.
   These are tracked as a separate internal-UI backlog item, not marketing-site work.
3. **No Lighthouse/Core Web Vitals run.** Not available in this environment; not invented.
   Removing three.js and framer-motion from the homepage is expected to help, but no number
   is claimed.
4. **`AnimatedGridPattern.tsx` / `Spotlight.tsx` are now unused** (only the hero imported
   them). Left in place rather than deleted — no verifier references them, and removing them
   is an unrelated destructive change.
5. **Cross-browser:** Chromium only (matches the repo's existing e2e setup).
6. **Dark theme** is not surfaced on the marketing tree (light-first), so the `.dark` token
   overrides are defined but not exercised by public pages.
