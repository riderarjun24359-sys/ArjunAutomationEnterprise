import Image from "next/image";
import { cn } from "@/src/lib/cn";

export type BrandLogoVariant = "horizontal" | "secondary" | "vertical" | "symbol" | "monogram" | "inverse" | "blue";
const LOCKUP = "/brand/logos/arjun-enterprise.svg";
const SYMBOL = "/brand/logos/arjun-symbol.svg";
const LOGO_PATHS: Record<BrandLogoVariant, string> = {
    horizontal: LOCKUP, secondary: LOCKUP, vertical: LOCKUP, symbol: SYMBOL,
    monogram: SYMBOL, inverse: LOCKUP, blue: LOCKUP,
};
const LOGO_DIMENSIONS: Record<BrandLogoVariant, { width: number; height: number }> = {
    horizontal: { width: 900, height: 240 }, secondary: { width: 900, height: 240 },
    vertical: { width: 900, height: 240 }, symbol: { width: 256, height: 256 },
    monogram: { width: 256, height: 256 }, inverse: { width: 900, height: 240 }, blue: { width: 900, height: 240 },
};
export type BrandLogoProps = { variant?: BrandLogoVariant; className?: string; priority?: boolean; label?: string };
export function BrandLogo({ variant = "secondary", className, priority = false, label = "Arjun Automation Enterprises" }: BrandLogoProps) {
    const src = LOGO_PATHS[variant];
    const { width, height } = LOGO_DIMENSIONS[variant];
    return <Image src={src} alt={label} width={width} height={height} priority={priority} unoptimized className={cn("h-auto w-auto max-h-10", className)} />;
}
export function BrandSymbol({ className, light = false }: { className?: string; light?: boolean }) {
    return <Image src={SYMBOL} alt="Arjun Automation" width={256} height={256} unoptimized className={className} />;
}
