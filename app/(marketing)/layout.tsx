import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MarketingLayout } from "@/src/modules/company-launch-kit/components/MarketingLayout";
import { env } from "@/src/lib/env";
import { buildMetadata } from "@/src/lib/seo";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    ...buildMetadata({
        title: "Arjun Automation — Enterprise Automation. Without the Enterprise Wait.",
        description:
            "Arjun Automation OS unifies CRM, projects, finance, AI workers, and industry packs into one secure platform. Most clients go live in 90 days.",
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
