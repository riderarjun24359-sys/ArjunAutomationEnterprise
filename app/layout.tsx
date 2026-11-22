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
    applicationName: LAUNCH_KIT_SEO.siteName,
    authors: [{ name: LAUNCH_KIT_SEO.siteName }],
    creator: LAUNCH_KIT_SEO.siteName,
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: LAUNCH_KIT_SEO.siteUrl,
        siteName: LAUNCH_KIT_SEO.siteName,
        title: LAUNCH_KIT_SEO.defaultTitle,
        description: LAUNCH_KIT_SEO.defaultDescription,
    },
    twitter: {
        card: "summary_large_image",
        title: LAUNCH_KIT_SEO.defaultTitle,
        description: LAUNCH_KIT_SEO.defaultDescription,
    },
    icons: {
        icon: [{ url: SOFT_LAUNCH_BRANDING.faviconPath, type: "image/svg+xml" }],
        shortcut: [{ url: SOFT_LAUNCH_BRANDING.favicon32Path, sizes: "32x32", type: "image/png" }],
        apple: [{ url: SOFT_LAUNCH_BRANDING.appleTouchIconPath, sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
    themeColor: SOFT_LAUNCH_BRANDING.primaryColor,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en-IN" suppressHydrationWarning className="h-full antialiased">
            <body className="min-h-screen bg-white text-slate-900">{children}</body>
        </html>
    );
}
