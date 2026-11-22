# Staging website rebuild — QA report

## Scope and source

- Repository: `riderarjun24359-sys/ArjunAutomationEnterprise`
- Working branch: `staging/premium-rebuild-2026-11`
- Staging Vercel project: `arjunautomationos-staging`
- Latest source commit in this report: `94c43d460b5152866aa5617259449fe412d64411`
- No production deployment was performed.
- No merge to the production branch was performed.

## Deployment status

The latest successful branch preview deployment available in Vercel is:

- URL: https://arjunautomationos-staging-q1ytkchow-arjun-automation.vercel.app
- Deployment: `dpl_8eYF3ebc3rW3LaB3ANwJ2wxQRyXa`
- State: READY
- Deployed commit: `164e35a7817dac8805bcd186566e875da7447ed0`

This deployment is older than the source commit above and does not contain the latest branch changes. A new deployment request was rejected by Vercel with HTTP 402 because the team exceeded its 100-deployments-per-day API limit; the response specified a 24-hour retry period. Therefore the latest source has not been deployed or built on Vercel yet. The preview URL above is a previous checkpoint, not a final acceptance URL.

The staging project's preview environment variable `NEXT_PUBLIC_APP_URL` was set for this branch to `https://arjunautomationos-staging-arjun-automation.vercel.app` so future branch builds use a staging canonical URL.

## Phase status

| Phase | Status | Evidence / remaining work |
|---|---|---|
| 1. Audit and clean-up | PARTIAL | Added explicit 301 redirects for the requested retired routes; removed the cookie and refund pages; replaced obsolete business defaults. A full repository-wide route and phrase scan is still required. |
| 2. Design system | PARTIAL | Added light-theme tokens, typography, controls and the noindex style guide. Visual contrast and layout checks at 360, 768 and 1280 pixels have not been run. |
| 3. Global layout | PARTIAL | Added the five-link header, keyboard-aware mobile drawer, language switch, footer, breadcrumbs and footer-aware WhatsApp control. Device and screen-reader tests remain. |
| 4. Home page | PARTIAL | Rebuilt English and Telugu home pages with the requested sections. Optional founder, screenshot and demo sections stay hidden until their values are supplied. Visual QA remains. |
| 5. Inner pages | PARTIAL | Rebuilt Services, School Software, Demos, Pricing, About, Contact, Thank You, Privacy, Terms and 404 content in English and Telugu. Link and content QA remains. |
| 6. Contact form | PARTIAL | Implemented the requested fields, client/server validation, honeypot, per-IP rate-limit key, email notification and WhatsApp fallback. Email delivery is not configured or tested. |
| 7. Telugu | PARTIAL | Added Telugu pages for the public routes and a translation review file. The root HTML language is switched client-side after hydration; server-rendered Telugu HTML language still needs a route-level solution. Native-speaker review remains. |
| 8. SEO and performance | FAIL | Canonical metadata, language alternates, sitemap, robots and service JSON-LD were updated. Per-page OG images, cookieless analytics and actual Lighthouse scores are not complete. |
| 9. Accessibility and security | PARTIAL | Added keyboard handling, focus styles, security headers and reduced-motion rules. WCAG contrast, 200% zoom, touch, keyboard and screen-reader testing has not been completed. |
| 10. Clean-up | PARTIAL | Updated README, removed the old header component and retired pages. The full application still contains unrelated internal routes and needs a broader dead-code and route audit. |
| 11. Full staging QA | FAIL | The latest branch source has not been deployed because of the Vercel daily deployment limit. The latest source has not received browser QA, form delivery tests or Lighthouse runs. |

## QA checks

1. **Forbidden phrases:** No exact forbidden phrase or wrong phone number was found in the changed public website files that were scanned. This was not a complete scan of every file and every rendered route; overall status remains PARTIAL.
2. **Phone:** Public business profile, tel link, WhatsApp link and contact pages use `7337027357` / `+91 73370 27357`. The entire repository has not yet been exhaustively scanned.
3. **Brand:** Updated public header, footer, metadata and JSON-LD use Arjun Automation Enterprises; the header short form is Arjun Automation. A full internal-app scan remains.
4. **Links and redirects:** Requested redirects are configured with HTTP 301. Every route and external destination has not been browser-tested. Demo cards remain hidden when no demo URL is configured.
5. **Responsive and contrast:** Not verified at 360, 768 and 1280 pixels. FAIL pending browser screenshots and contrast checks.
6. **Keyboard and touch:** Header drawer has Escape handling, focus trapping, body scroll lock and `aria-expanded`; the language switch and accordion are implemented. Full keyboard/touch testing has not been run.
7. **Contact form:** Client/server validation and the WhatsApp fallback are implemented. Email delivery and valid/invalid/spam submissions have not been tested against a configured provider.
8. **Dummy content:** Founder content, demo cards, screenshot and pricing cards are hidden until real values are supplied. No placeholder text is intended to be visible on the public pages. Full route scan remains.
9. **Lighthouse:** Not run. No performance, accessibility, best-practices or SEO scores are claimed.

## Remaining placeholders

- `NEXT_PUBLIC_FOUNDER_NAME`
- `NEXT_PUBLIC_FOUNDER_PHOTO`
- `NEXT_PUBLIC_FOUNDER_STORY`
- `NEXT_PUBLIC_DEMO_SCREENSHOT`
- `NEXT_PUBLIC_DEMO_LINK_SUPERMARKET`
- `NEXT_PUBLIC_DEMO_LINK_SCHOOL`
- `NEXT_PUBLIC_SCHOOL_DEMO_VIDEO`
- `NEXT_PUBLIC_ENQUIRY_RETENTION` (the retention section stays hidden until this is supplied)
- `[PRICES]` (price cards stay hidden; the site explains scope-based quotes instead)
- Working hours and a response-time statement were not supplied, so they are not displayed.
- A data-safety statement was not supplied, so the related FAQ item is not displayed.

## Vercel environment variables to add

Required before contact form email can work:

- `RESEND_API_KEY`
- `RESEND_FROM` — a sender address verified with the email provider.

Required for shared database-backed rate limiting:

- `SUPABASE_SERVICE_ROLE_KEY` — server-only; never expose it in client code. The staging project currently has this variable present but empty, so the current fallback is per-process and is not a shared per-IP limit.

Already present in the staging project's preview environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional content variables are listed in the repository README.

## Changed files

- `README.md`
- `TRANSLATION_REVIEW.md`
- `app/(marketing)/about/page.tsx`
- `app/(marketing)/contact/page.tsx`
- `app/(marketing)/cookies/page.tsx` (removed)
- `app/(marketing)/demos/page.tsx`
- `app/(marketing)/layout.tsx`
- `app/(marketing)/page.tsx`
- `app/(marketing)/pricing/page.tsx`
- `app/(marketing)/privacy/page.tsx`
- `app/(marketing)/refund/page.tsx` (removed)
- `app/(marketing)/school-erp/page.tsx`
- `app/(marketing)/services/page.tsx`
- `app/(marketing)/styleguide/page.tsx`
- `app/(marketing)/te/about/page.tsx`
- `app/(marketing)/te/contact/page.tsx`
- `app/(marketing)/te/demos/page.tsx`
- `app/(marketing)/te/page.tsx`
- `app/(marketing)/te/pricing/page.tsx`
- `app/(marketing)/te/privacy/page.tsx`
- `app/(marketing)/te/school-erp/page.tsx`
- `app/(marketing)/te/services/page.tsx`
- `app/(marketing)/te/terms/page.tsx`
- `app/(marketing)/te/thank-you/page.tsx`
- `app/(marketing)/terms/page.tsx`
- `app/(marketing)/thank-you/page.tsx`
- `app/api/contact/route.ts`
- `app/layout.tsx`
- `app/manifest.ts`
- `app/not-found.tsx`
- `app/sitemap.ts`
- `next.config.ts`
- `public/brand/logos/arjun-symbol.svg`
- `src/config/app.ts`
- `src/config/company-profile.ts`
- `src/lib/env.ts`
- `src/lib/seo.ts`
- `src/modules/company-launch-kit/components/LanguageToggle.tsx`
- `src/modules/company-launch-kit/components/LocalContactForm.tsx`
- `src/modules/company-launch-kit/components/MarketingBreadcrumbs.tsx`
- `src/modules/company-launch-kit/components/MarketingFooterStatic.tsx`
- `src/modules/company-launch-kit/components/MarketingHeader.tsx`
- `src/modules/company-launch-kit/components/MarketingHeaderStatic.tsx` (removed)
- `src/modules/company-launch-kit/components/MarketingLayout.tsx`
- `src/modules/company-launch-kit/components/WhatsAppFloat.tsx`
- `src/modules/company-launch-kit/config/seo-defaults.ts`
- `src/modules/company-launch-kit/design-system/marketing-light.css`

## Promotion — owner action only

Do not promote until the latest branch has a successful staging deployment and every FAIL above is retested.

1. Wait for the Vercel deployment quota to reset or resolve the account's deployment limit.
2. Deploy `staging/premium-rebuild-2026-11` to the `arjunautomationos-staging` project.
3. Open the new staging URL and complete the browser, form, link, responsive and Lighthouse checks.
4. In GitHub, create a pull request from `staging/premium-rebuild-2026-11` into `main`; review the complete diff and checks.
5. Only after explicit owner approval, merge that pull request. The production project `arjunautomationos-enterprise` should then build from its production branch and serve the production domain. Do not promote a deployment from the separate staging project as if it belonged to the production project.
