import Image from "next/image";
import { cn } from "@/src/lib/cn";

export type BrandLogoVariant = "horizontal" | "secondary" | "vertical" | "symbol" | "monogram" | "inverse";

const LOGO_PATHS: Record<BrandLogoVariant, string> = {
    horizontal: "/brand/logos/primary-horizontal.svg",
    secondary: "/brand/logos/secondary-horizontal.svg",
    vertical: "/brand/logos/primary-vertical.svg",
    symbol: "/brand/logos/symbol-only.svg",
    monogram: "/brand/logos/monogram.svg",
    inverse: "/brand/logos/monochrome-white.svg",
};

/**
 * Intrinsic sizes.
 *
 * These MUST match the `width`/`height` attributes baked into each SVG file.
 * `w-auto h-auto` in the class list tells the browser to fall back to the
 * image's intrinsic size; the logo SVGs therefore carry explicit dimensions
 * so the mark never collapses to zero.
 */
const LOGO_DIMENSIONS: Record<BrandLogoVariant, { width: number; height: number }> = {
    horizontal: { width: 320, height: 48 },
    secondary: { width: 260, height: 48 },
    vertical: { width: 80, height: 104 },
    symbol: { width: 48, height: 48 },
    monogram: { width: 48, height: 48 },
    inverse: { width: 260, height: 48 },
};

export type BrandLogoProps = {
    variant?: BrandLogoVariant;
    className?: string;
    priority?: boolean;
    /** Accessible label — defaults to company name */
    label?: string;
};

/** Enterprise brand logo — uses official SVG assets from Brand Identity System v1.0 */
export function BrandLogo({ variant = "secondary", className, priority = false, label = "Arjun Automation Enterprises" }: BrandLogoProps) {
    const src = LOGO_PATHS[variant];
    const { width, height } = LOGO_DIMENSIONS[variant];

    return (
        <Image
            src={src}
            alt={label}
            width={width}
            height={height}
            priority={priority}
            className={cn("h-auto max-h-9 w-auto", className)}
            unoptimized
        />
    );
}

/** Inline SVG symbol for tight spaces — zero external request */
export function BrandSymbol({ className, light = false }: { className?: string; light?: boolean }) {
    const stroke = light ? "#FFFFFF" : "#4338CA";
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Arjun Automation"
        >
            <path d="M8 36 L24 8 L40 36" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 28 H35" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M10 36 C16 42 32 42 38 36" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
    );
}
