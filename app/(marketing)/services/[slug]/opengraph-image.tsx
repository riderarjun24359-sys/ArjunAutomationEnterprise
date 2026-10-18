import { SERVICE_ITEMS } from "@/src/modules/company-launch-kit/data/services";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/src/modules/company-launch-kit/components/og/og-image";

export const alt = "Arjun Automation services";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = SERVICE_ITEMS.find((entry) => entry.slug === slug);

    return renderOgImage({
        eyebrow: "Service",
        title: item?.title ?? "Arjun Automation service",
        subtitle: item?.tagline ?? "Enterprise automation, delivered as a working system.",
        footer: "arjunautomations.com/services",
    });
}
