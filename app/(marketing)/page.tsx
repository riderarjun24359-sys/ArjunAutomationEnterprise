import type { Metadata } from "next";
import { PremiumHomePage } from "@/src/modules/company-launch-kit/components/premium/PremiumHomePage";
import { JsonLd } from "@/src/modules/company-launch-kit/components/JsonLd";
import { buildMetadata, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Arjun Automation — Enterprise Automation. Without the Enterprise Wait.",
    description:
        "Arjun Automation OS unifies CRM, projects, finance, AI workers, and industry packs into one secure platform. Most clients go live in 90 days.",
    path: "/",
});

export default function HomePage() {
    return (
        <>
            <JsonLd data={buildOrganizationJsonLd()} />
            <JsonLd
                data={buildWebPageJsonLd({
                    title: "Arjun Automation — Enterprise Automation. Without the Enterprise Wait.",
                    description: "Arjun Automation OS unifies CRM, projects, finance, AI workers, and industry packs into one secure platform.",
                    path: "/",
                })}
            />
            <PremiumHomePage />
        </>
    );
}
