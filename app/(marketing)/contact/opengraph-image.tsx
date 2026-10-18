import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/src/modules/company-launch-kit/components/og/og-image";

export const alt = "Talk to Arjun Automation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
    return renderOgImage({
        eyebrow: "Contact",
        title: "Book a free consultation",
        subtitle: "Tell us your operational challenge. We respond within one business day.",
        footer: "arjunautomations.com/contact",
    });
}
