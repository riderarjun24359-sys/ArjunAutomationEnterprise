import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/src/modules/company-launch-kit/components/og/og-image";

export const alt = "Arjun Automation — Run your business on one intelligent system";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
    return renderOgImage({
        eyebrow: "Enterprise automation",
        title: "Run your business on one intelligent system",
        subtitle: "CRM, projects, finance and industry workflows on one secure platform.",
        footer: "Enterprise automation, delivered as a working system",
    });
}
