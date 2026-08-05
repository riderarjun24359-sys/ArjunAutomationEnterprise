# Logos — Vertex Arc Mark

Official Arjun Automation Enterprises logo assets. **Production files included.**

## Contents

| File | Description |
|------|-------------|
| `primary-horizontal.svg` | Symbol + wordmark + ENTERPRISES subline |
| `secondary-horizontal.svg` | Symbol + wordmark (compact) |
| `primary-vertical.svg` | Stacked vertical layout |
| `symbol-only.svg` | Mark only — default indigo |
| `symbol-only-light.svg` | White mark for dark backgrounds |
| `symbol-only-dark.svg` | Dark indigo mark |
| `monogram.svg` | Mark on indigo rounded square |
| `monochrome-white.svg` | Full logo white |
| `monochrome-indigo.svg` | Full logo indigo |
| `app-icon.svg` | 512×512 app store icon |
| `favicon.svg` | 32×32 browser favicon |

Public copies: `/public/brand/logos/`

## React Usage

```tsx
import { BrandLogo, BrandSymbol } from "@/src/modules/brand-os";

<BrandLogo variant="secondary" />
<BrandSymbol className="h-8 w-8" light />
```

See `content/logo-system.md` for complete rules.
