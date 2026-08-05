import type { Metadata } from "next";
import { PremiumHomePage } from "@/src/modules/company-launch-kit/components/premium/PremiumHomePage";
import { JsonLd } from "@/src/modules/company-launch-kit/components/JsonLd";
import { buildMetadata, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Arjun Automation — Run Your Business on One Platform",
    description:
        "Arjun Automation helps growing organizations replace fragmented tools with a unified operating system — CRM, projects, finance, and industry workflows in one secure platform.",
    path: "/",
});

export default function HomePage() {
    return (
        <>
            <JsonLd data={buildOrganizationJsonLd()} />
            <JsonLd
                data={buildWebPageJsonLd({
                    title: "Arjun Automation — Run Your Business on One Platform",
                    description:
                        "Arjun Automation helps growing organizations replace fragmented tools with a unified operating system — CRM, projects, finance, and industry workflows in one secure platform.",
                    path: "/",
                })}
            />
            <PremiumHomePage />
        </>
    );
}
