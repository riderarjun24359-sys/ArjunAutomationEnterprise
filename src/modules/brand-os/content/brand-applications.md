# Brand Applications Guide

> **Version:** 1.0 · **Status:** Official

Specifications for applying the Arjun Automation Enterprises identity across touchpoints.

---

## Business Card

- **Size:** 90 × 50 mm
- **Template:** `brand-assets/templates/business-card.svg`
- **Front:** Primary horizontal logo, name, title, contact
- **Back:** Symbol centered on indigo-900 background (optional)
- **Paper:** 350gsm matte, soft-touch laminate recommended

## Letterhead

- **Size:** A4 (210 × 297 mm)
- **Template:** `brand-assets/templates/letterhead.svg`
- **Header:** Secondary logo top-left, company address top-right
- **Footer:** Symbol watermark at 4% opacity, page number
- **Margins:** 25mm all sides

## Proposal

- **Cover:** `brand-assets/templates/proposal-cover.svg`
- **Interior:** Letterhead header on each page
- **Typography:** Inter, H1 30px for section titles
- **Accent:** Indigo horizontal rule before major sections

## Invoice

- **Header template:** `brand-assets/templates/invoice-header.svg`
- **Logo:** Secondary horizontal, left aligned
- **Invoice number:** Right aligned, mono font
- **Table:** Line items with slate-200 borders

## Email Signature

```
[Symbol 32px]  Full Name
               Title · Arjun Automation Enterprises
               email@arjunautomation.com · +1 (555) 000-0000
               arjunautomation.com
```

- Use `symbol-only.svg` at 32px
- No background images in signature
- Maximum 4 lines

## Social Media Kit

| Asset | Size | File |
|-------|------|------|
| LinkedIn Banner | 1584 × 396 | `social/linkedin-banner.svg` |
| Social Avatar | 400 × 400 | `social/social-avatar.svg` |
| OG Default | 1200 × 630 | `public/launch-kit/og-default.svg` |

## Website Identity

- Header: `BrandLogo variant="secondary"` at max-height 36px
- Footer: Monochrome white logo on slate-950
- Favicon: `favicon.svg` via Next.js `app/icon.tsx`
- Theme color: `#4338CA`

## Dashboard Identity

- Sidebar: `BrandSymbol` 24px + "Automation OS" label
- Login/auth pages: Primary vertical logo centered
- Empty states: Symbol at 20% opacity watermark

## Presentation Template

- **Aspect:** 16:9
- **Template:** `brand-assets/presentations/slide-master.svg`
- **Title slide:** Vertical logo, indigo gradient band
- **Content slides:** Secondary logo top-left, 12-column grid

## Document Templates

All PDF exports use:
- Inter or Segoe UI fallback
- `#4338CA` for headings and rules
- `#0F172A` body text
- Logo on first page header only (unless cover)

---

*Templates are SVG for infinite scaling. Replace placeholder contact details before client use.*
