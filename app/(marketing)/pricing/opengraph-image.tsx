import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/src/modules/company-launch-kit/components/og/og-image";

export const alt = "Arjun Automation pricing — transparent, outcome-aligned";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
    return renderOgImage({
        eyebrow: "Pricing",
        title: "Transparent, outcome-aligned pricing",
        subtitle: "Clear scope tiers, milestone billing, and no hidden fees.",
        footer: "See pricing",
    });
}
