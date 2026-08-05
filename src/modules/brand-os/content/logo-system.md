# Logo System — Vertex Arc Mark

> **Version:** 1.0 · **Status:** Official

## Symbol Anatomy

The **Vertex Arc Mark** is the proprietary symbol of Arjun Automation Enterprises.

```
        ▲ Vertex (growth, precision)
       / \
      /   \
     /─────\  Crossbar (integration)
    (       )
     ╰─────╯  Arc (continuous automation)
```

## Asset Inventory

All files in `brand-assets/logos/`:

| File | Description |
|------|-------------|
| `primary-horizontal.svg` | Symbol + wordmark + ENTERPRISES subline |
| `secondary-horizontal.svg` | Symbol + wordmark (compact) |
| `primary-vertical.svg` | Stacked layout |
| `symbol-only.svg` | Mark only — indigo on transparent |
| `symbol-only-light.svg` | White mark for dark backgrounds |
| `symbol-only-dark.svg` | Dark indigo for light backgrounds |
| `monogram.svg` | Symbol on indigo rounded square |
| `monochrome-white.svg` | Full logo white |
| `monochrome-indigo.svg` | Full logo indigo |
| `app-icon.svg` | 512×512 app store icon |
| `favicon.svg` | 32×32 browser favicon |

Public copies: `public/brand/logos/`

## Safe Area

```
┌─────────────────────────────┐
│         SAFE AREA           │
│    ┌─────────────────┐      │
│    │  LOGO / SYMBOL  │      │
│    └─────────────────┘      │
│         (= symbol H)        │
└─────────────────────────────┘
```

## Minimum Sizes

- **Horizontal logo:** 120px digital / 30mm print
- **Symbol only:** 24px digital / 8mm print
- **Favicon:** 32×32 (use favicon.svg)

## Usage Matrix

| Context | Variant |
|---------|---------|
| Website header | secondary-horizontal |
| Email signature | symbol-only + text |
| Dark footer | monochrome-white |
| Light documents | primary-horizontal |
| App icon | app-icon or monogram |
| Favicon | favicon.svg |
| Social avatar | monogram |
| Presentation title | primary-vertical |

## Prohibited Modifications

- No rotation, skew, or stretch
- No drop shadows or outer glow on the mark
- No gradient fills inside the symbol strokes
- No replacement of Inter wordmark with other typefaces in SVG exports
- No "AA" text badge — deprecated placeholder

## React Integration

```tsx
import { BrandLogo, BrandSymbol } from "@/src/modules/brand-os/components/BrandLogo";

<BrandLogo variant="secondary" priority />
<BrandSymbol className="h-8 w-8" />
```
