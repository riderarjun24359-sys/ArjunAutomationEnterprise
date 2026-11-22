# Arjun Automation Enterprises — Website

This repository contains the public website and the application code. The public marketing pages use Next.js App Router.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Edit public website content

- English home page: `app/(marketing)/page.tsx`
- Telugu home page: `app/(marketing)/te/page.tsx`
- Services: `app/(marketing)/services/page.tsx` and `app/(marketing)/te/services/page.tsx`
- School software: `app/(marketing)/school-erp/page.tsx` and `app/(marketing)/te/school-erp/page.tsx`
- Demos: `app/(marketing)/demos/page.tsx` and `app/(marketing)/te/demos/page.tsx`
- Pricing: `app/(marketing)/pricing/page.tsx` and `app/(marketing)/te/pricing/page.tsx`
- About: `app/(marketing)/about/page.tsx` and `app/(marketing)/te/about/page.tsx`
- Contact: `app/(marketing)/contact/page.tsx` and `app/(marketing)/te/contact/page.tsx`
- Brand contact details: `src/config/company-profile.ts`
- Design tokens: `src/modules/company-launch-kit/design-system/marketing-light.css`
- Header and footer: `src/modules/company-launch-kit/components/MarketingHeader.tsx` and `MarketingFooterStatic.tsx`

Keep English and Telugu pages aligned. Do not add customer names, quotes, ratings, business addresses or claims unless the owner supplies them.

## Vercel environment variables

Add these in the staging project's Preview/Staging environment as applicable:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Email provider API key for contact enquiries |
| `RESEND_FROM` | Verified sender address used by the email provider |
| `NEXT_PUBLIC_SUPABASE_URL` | Database URL used by the shared rate limiter |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used by the rate limiter; never expose it to browser code |
| `NEXT_PUBLIC_DEMO_LINK_SUPERMARKET` | Optional working supermarket demo URL |
| `NEXT_PUBLIC_DEMO_LINK_SCHOOL` | Optional working school demo URL |
| `NEXT_PUBLIC_DEMO_SCREENSHOT` | Optional real school software screenshot URL |
| `NEXT_PUBLIC_SCHOOL_DEMO_VIDEO` | Optional real school demo video URL |
| `NEXT_PUBLIC_FOUNDER_NAME` | Optional founder name |
| `NEXT_PUBLIC_FOUNDER_PHOTO` | Optional founder photo URL |
| `NEXT_PUBLIC_FOUNDER_STORY` | Optional founder story approved by the owner |
| `NEXT_PUBLIC_ENQUIRY_RETENTION` | Approved retention period wording for the privacy page |

The contact form sends to `sales@arjunautomations.com`. Email sending will fail until the provider key and verified sender are configured. If sending fails, the form offers a WhatsApp message containing the entered details.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build
```

## Staging deployment

1. Make website changes on `staging/premium-rebuild-2026-11`.
2. Push commits to that branch.
3. Check the Vercel project `arjunautomationos-staging` and verify the deployment is ready.
4. Test the staging URL on mobile and desktop.
5. Do not promote or merge from this workflow. Production release is a separate owner decision.
