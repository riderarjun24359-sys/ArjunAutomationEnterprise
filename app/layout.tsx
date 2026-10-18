import type { Metadata, Viewport } from "next";
import { appConfig } from "@/src/config/app";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";
import { SOFT_LAUNCH_BRANDING } from "@/src/modules/soft-launch/data/launch-assets";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(LAUNCH_KIT_SEO.siteUrl),
    title: {
        default: LAUNCH_KIT_SEO.defaultTitle,
        template: `%s | ${LAUNCH_KIT_SEO.siteName}`,
    },
    description: appConfig.description,
    applicationName: SOFT_LAUNCH_BRANDING.productName,
    keywords: [...LAUNCH_KIT_SEO.defaultKeywords],
    authors: [{ name: LAUNCH_KIT_SEO.siteName }],
    creator: LAUNCH_KIT_SEO.siteName,
    openGraph: {
        type: "website",
        locale: LAUNCH_KIT_SEO.locale,
        url: LAUNCH_KIT_SEO.siteUrl,
        siteName: LAUNCH_KIT_SEO.siteName,
        title: LAUNCH_KIT_SEO.defaultTitle,
        description: LAUNCH_KIT_SEO.defaultDescription,
        // `images` is intentionally omitted. Marketing routes supply their own
        // `opengraph-image.tsx` (a real PNG); the app-shell routes are behind
        // auth and are never shared publicly.
    },
    twitter: {
        card: "summary_large_image",
        site: LAUNCH_KIT_SEO.twitterHandle,
        title: LAUNCH_KIT_SEO.defaultTitle,
        description: LAUNCH_KIT_SEO.defaultDescription,
    },
    icons: {
        // SVG for modern browsers, PNG fallbacks for older clients and crawlers.
        icon: [
            { url: SOFT_LAUNCH_BRANDING.faviconPath, type: "image/svg+xml" },
            { url: SOFT_LAUNCH_BRANDING.icon192Path, type: "image/png", sizes: "192x192" },
        ],
        shortcut: [
            { url: SOFT_LAUNCH_BRANDING.faviconPath, type: "image/svg+xml" },
            { url: SOFT_LAUNCH_BRANDING.favicon32Path, type: "image/png", sizes: "32x32" },
        ],
        // Must be a PNG — iOS does not render an SVG apple-touch-icon.
        apple: [{ url: SOFT_LAUNCH_BRANDING.appleTouchIconPath, sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
    themeColor: SOFT_LAUNCH_BRANDING.primaryColor,
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="h-full antialiased">
            <body className="min-h-screen bg-background text-foreground">{children}</body>
        </html>
    );
}

