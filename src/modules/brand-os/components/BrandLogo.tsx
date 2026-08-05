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

const LOGO_DIMENSIONS: Record<BrandLogoVariant, { width: number; height: number }> = {
    horizontal: { width: 200, height: 30 },
    secondary: { width: 180, height: 30 },
    vertical: { width: 80, height: 100 },
    symbol: { width: 32, height: 32 },
    monogram: { width: 32, height: 32 },
    inverse: { width: 200, height: 30 },
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
            className={cn("h-auto w-auto max-h-9", className)}
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
