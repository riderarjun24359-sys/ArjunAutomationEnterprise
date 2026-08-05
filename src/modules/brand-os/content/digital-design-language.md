# Digital Design Language

> **Version:** 1.0 · **Status:** Official · **Implements:** Design OS

Unified rules for all Arjun Automation Enterprises product interfaces.

---

## Buttons

| Variant | Background | Text | Border | Radius |
|---------|------------|------|--------|--------|
| Primary | `#4338CA` | White | None | 12px |
| Secondary | Transparent | Slate 950 | Slate 200 | 12px |
| Ghost | Transparent | Indigo 700 | None | 8px |
| Destructive | Rose 600 | White | None | 12px |

- Minimum height: 44px (touch target)
- Focus: 2px ring indigo-500/50, offset 2px
- Disabled: 50% opacity, no pointer events
- Loading: spinner replaces label, maintain width

## Inputs

- Height: 40px (default), 48px (large)
- Border: 1px `#E2E8F0`
- Focus border: indigo-500
- Error border: rose-600 + error message below
- Label: 14px medium, 8px margin-bottom

## Cards

- Background: white / slate-900 (dark)
- Border: 1px slate-200 / slate-800
- Radius: 16px
- Padding: 24px
- Hover (interactive): border indigo-500/30, shadow brand

## Tables

- Header: 12px uppercase label style, slate-500
- Row height: 48px minimum
- Striped: optional slate-50 alternate
- Actions: right-aligned icon buttons

## Navigation

- Sidebar width: 256px expanded, 64px collapsed
- Active item: indigo-700 text, indigo-50 background
- Logo: BrandSymbol 24px + wordmark
- Mobile: drawer overlay, same hierarchy

## Modals

- Max width: lg (512px) default
- Backdrop: slate-950/40
- Animation: fade + scale 0.98→1, 250ms
- Close: Escape key + X button

## Empty States

- Icon: 32px Lucide, slate-400
- Headline: 18px semibold
- Description: 14px slate-500, max-w-sm
- CTA: single primary button

## Loading States

- **Content:** skeleton bars, pulse animation
- **Actions:** inline spinner in button
- **Page:** skeleton layout matching final structure
- Avoid full-screen spinners except auth transitions

## Notifications

- Position: bottom-right stack
- Duration: 5s default (success), persistent (error)
- Semantic background tints with border-left accent

## Charts

- Primary series: `#4338CA`
- Secondary: `#06B6D4`
- Tertiary: `#8B5CF6`
- Grid lines: slate-200, minimal
- Labels: 12px slate-500

## Icons

- Library: Lucide React
- Navigation: 20px outline
- Inline: 16px
- Feature: 24–32px
- Stroke: consistent 1.5–2px

## Animations

- Prefer CSS transitions over JavaScript
- Maximum 400ms for UI transitions
- Scroll reveals: opacity + translateY 20px max
- Never animate layout properties that cause CLS
- Always honor `prefers-reduced-motion`

---

*Reference implementation: `src/design-os/` · Tokens: `src/modules/brand-os/identity/tokens.ts`*
