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
        images: [{ url: SOFT_LAUNCH_BRANDING.ogImagePath, width: 1200, height: 630, alt: LAUNCH_KIT_SEO.siteName }],
    },
    twitter: {
        card: "summary_large_image",
        site: LAUNCH_KIT_SEO.twitterHandle,
        title: LAUNCH_KIT_SEO.defaultTitle,
        description: LAUNCH_KIT_SEO.defaultDescription,
        images: [SOFT_LAUNCH_BRANDING.ogImagePath],
    },
    icons: {
        icon: [{ url: SOFT_LAUNCH_BRANDING.faviconPath, type: "image/svg+xml" }],
        shortcut: [SOFT_LAUNCH_BRANDING.faviconPath],
        apple: [{ url: SOFT_LAUNCH_BRANDING.logoPath }],
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

