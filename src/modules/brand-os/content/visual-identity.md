# Arjun Automation — Visual Identity Guide

> **Document Type:** Visual Identity · **Version:** 2.0 · **Status:** Official · **PDF-Ready:** Yes

---

## Color System

### Primary Palette

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| **Brand Indigo** | `#4338CA` | `indigo-700` | Primary buttons, nav active states, headers |
| **Indigo Light** | `#6366F1` | `indigo-500` | Hover states, links, accents |
| **Indigo Dark** | `#312E81` | `indigo-900` | Dark mode surfaces, footer backgrounds |
| **Indigo Muted** | `#E0E7FF` | `indigo-100` | Backgrounds, badges, subtle highlights |

### Neutral Palette

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| **Slate Text** | `#0F172A` | `slate-950` | Primary body text (light mode) |
| **Slate Muted** | `#64748B` | `slate-500` | Secondary text, captions |
| **Surface** | `#FFFFFF` | `white` | Cards, panels, document backgrounds |
| **Border** | `#E2E8F0` | `slate-200` | Dividers, card borders |

### Semantic Colors

| Purpose | Color | Usage |
|---------|-------|-------|
| Success | `emerald-600` | Confirmations, healthy status |
| Warning | `amber-500` | Caution states, pending items |
| Error | `rose-600` | Failures, destructive actions |
| Info | `sky-600` | Informational callouts |

### Color Rules
- Brand OS module UI uses **indigo-700** as the primary theme color
- Do not use module-specific accent colors (pink for Growth Engine, emerald for Company Foundation) in Brand OS collateral
- Maintain WCAG AA contrast ratios minimum (4.5:1 for body text)

---

## Typography

### Primary Typeface — Inter
- **Usage:** UI, documents, marketing, presentations
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Source:** Google Fonts / system fallback stack

```css
font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
```

### Type Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 36–48px | 600–700 | Page heroes, cover pages |
| H1 | 30px | 600 | Document titles |
| H2 | 24px | 600 | Major sections |
| H3 | 20px | 600 | Subsections |
| Body | 16px | 400 | Paragraph text |
| Small | 14px | 400–500 | Captions, metadata |
| Label | 12px | 500 | Tags, uppercase labels |

### Typography Rules
- Line height: 1.5 for body, 1.2 for headings
- Letter-spacing: 0.24em for uppercase labels only
- Never use more than two typefaces in a single document
- PDF exports: embed Inter or use system-safe fallback (Segoe UI, Helvetica)

---

## Icon Style

- **Library:** Lucide React (outline style, consistent stroke width)
- **Stroke:** 1.5–2px at 24px base size
- **Style:** Outline only — no filled icons in navigation or brand materials
- **Brand OS Icon:** `Palette` (Lucide) for navigation
- **Sizing:** 16px (inline), 20px (nav), 24px (cards), 32px (feature highlights)

### Icon Color Rules
- Default: `text-indigo-700` / `dark:text-indigo-400`
- Muted: `text-slate-500`
- On primary background: `text-white`

---

## Logo Usage

### Logo Variants
Located in `brand-assets/logos/`:
- **Primary Logo** — Full wordmark + symbol (horizontal)
- **Symbol Only** — For favicons, app icons, small spaces
- **Monochrome** — White on dark backgrounds, indigo on light

### Clear Space
Minimum clear space = height of the "A" in Arjun on all sides.

### Minimum Size
- Digital: 120px width (full logo), 24px (symbol only)
- Print: 30mm width (full logo)

### Logo Don'ts
- ❌ Do not stretch, rotate, or skew
- ❌ Do not change logo colors outside approved palette
- ❌ Do not place on busy backgrounds without a contrast overlay
- ❌ Do not add effects (shadows, gradients, outlines)

---

## Spacing Rules

### Base Unit
**4px grid** — all spacing multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight inline spacing |
| `sm` | 8px | Icon gaps, compact lists |
| `md` | 16px | Standard padding, paragraph gaps |
| `lg` | 24px | Section spacing within cards |
| `xl` | 32px | Between major sections |
| `2xl` | 48px | Page section breaks |

### Layout
- **Max content width:** 1280px (`max-w-7xl`)
- **Card border radius:** 24px (`rounded-3xl`) for panels; 32px (`rounded-[2rem]`) for hero headers
- **Card padding:** 24px (`p-6`)

---

## Design Principles

1. **Clarity Over Decoration** — Every visual element serves comprehension
2. **Consistent Hierarchy** — Users should instantly know where they are and what matters
3. **Breathing Room** — Generous whitespace; never cram content
4. **Accessible by Default** — Color is never the only indicator; support keyboard and screen readers
5. **Document-First** — Brand OS content is designed for screen reading and PDF export
6. **Module Identity** — Brand OS uses indigo; other modules retain their own accent colors

---

## UI Design Language

### Shell & Navigation
- Sidebar: slate background with indigo active indicator
- Page headers: rounded hero card with uppercase label, title, description
- Tab navigation: pill buttons with indigo active fill

### Cards & Panels
```html
<!-- Standard card pattern -->
<div class="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
```

### Buttons
- **Primary:** `bg-indigo-700 hover:bg-indigo-600 text-white rounded-full px-4 py-2`
- **Secondary:** `border border-slate-200 text-indigo-700 rounded-full px-4 py-2`
- **Ghost:** `text-indigo-700 hover:bg-indigo-50`

### Document Viewer
- Prose styling with indigo accent links
- Print button with hint: "Use browser Print → Save as PDF for export"
- Monospace code blocks: `bg-slate-950 text-slate-100 rounded-2xl p-4`

### Dark Mode
- Surface: `dark:bg-indigo-950/80`
- Text: `dark:text-indigo-100`
- Borders: `dark:border-indigo-800`

---

*© Arjun Automation. Official Visual Identity Guide.*
