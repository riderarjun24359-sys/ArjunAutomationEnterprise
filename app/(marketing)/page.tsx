import type { Metadata } from "next";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumHomePage } from "@/src/modules/company-launch-kit/components/premium/PremiumHomePage";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Arjun Automation — Run Your Business on One Platform",
    description:
        "Arjun Automation helps growing organizations replace fragmented tools with a unified operating system — CRM, projects, finance, and industry workflows in one secure platform.",
    path: "/",
});

export default function HomePage() {
    return (
        <>
            <MarketingStructuredData
                title="Arjun Automation — Run Your Business on One Platform"
                description="Arjun Automation helps growing organizations replace fragmented tools with a unified operating system — CRM, projects, finance, and industry workflows in one secure platform."
                path="/"
                breadcrumbs={[{ name: "Home", path: "/" }]}
            />
            <PremiumHomePage />
        </>
    );
}
