import type { Metadata } from "next";
import "@/src/modules/company-launch-kit/design-system/premium.css";
import { Inter } from "next/font/google";
import { MarketingLayout } from "@/src/modules/company-launch-kit/components/MarketingLayout";
import { env } from "@/src/lib/env";
import { buildMetadata } from "@/src/lib/seo";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "optional",
    preload: true,
    adjustFontFallback: true,
});

export const metadata: Metadata = {
    ...buildMetadata({
        title: "Arjun Automation — AI Automation for Business Operations",
        description:
            "Arjun Automation connects the tools growing organizations already run into one AI-automated workflow — CRM, projects, finance, and industry workflows on a single secure platform.",
        path: "/",
    }),
    ...(env.NEXT_PUBLIC_GSC_VERIFICATION
        ? { verification: { google: env.NEXT_PUBLIC_GSC_VERIFICATION } }
        : {}),
};

export default function MarketingRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${inter.variable} font-[family-name:var(--font-inter)] antialiased`}>
            <MarketingLayout>{children}</MarketingLayout>
        </div>
    );
}
