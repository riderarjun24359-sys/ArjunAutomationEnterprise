import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/src/modules/company-launch-kit/components/og/og-image";
import { HERO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

/**
 * Home page share card.
 *
 * The title/subtitle are pulled from `HERO_CONTENT` rather than hardcoded.
 * A previous version hardcoded the old headline ("Run your business on one
 * intelligent system") while the page itself had already been rewritten to
 * "Stop losing work in the gaps between your tools" — so the share card
 * advertised something the site no longer said. Sourcing both from one place
 * makes that class of drift impossible.
 */
export const alt = "Arjun Automation — AI automation for business operations";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
    return renderOgImage({
        eyebrow: "AI automation platform",
        title: HERO_CONTENT.headline,
        subtitle: "Missed enquiries, retyped data and tasks nobody chases — connected into one workflow.",
    });
}
