import type { Metadata } from "next";
import "@/src/modules/company-launch-kit/design-system/premium.css";
import "@/src/modules/company-launch-kit/design-system/marketing-light.css";
import { Inter } from "next/font/google";
import { MarketingLayout } from "@/src/modules/company-launch-kit/components/MarketingLayout";
import { env } from "@/src/lib/env";
import { buildMetadata } from "@/src/lib/seo";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    preload: true,
    adjustFontFallback: true,
});

export const metadata: Metadata = {
    ...buildMetadata({
        title: "Arjun Automation Enterprises | Custom Software and AI Automation | Andhra Pradesh",
        description: "Custom software, AI automation and business systems for schools, colleges, retailers, clinics and growing businesses in Andhra Pradesh and Telangana.",
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
