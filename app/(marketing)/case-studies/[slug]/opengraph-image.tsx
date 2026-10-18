import { CASE_STUDY_ITEMS } from "@/src/modules/company-launch-kit/data/case-studies";
import {
    OG_CONTENT_TYPE,
    OG_SIZE,
    extractStat,
    renderOgImage,
} from "@/src/modules/company-launch-kit/components/og/og-image";

export const alt = "Arjun Automation case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = CASE_STUDY_ITEMS.find((entry) => entry.slug === slug);

    if (!item) {
        return renderOgImage({ eyebrow: "Case study", title: "Arjun Automation case study" });
    }

    const parsed = extractStat(item.results);
    // Several titles already lead with the figure ("35% Increase in Qualified
    // Pipeline"), so repeating it in the stat block reads as a rendering bug.
    // Only surface the stat when it adds something the title doesn't already say.
    const statAlreadyInTitle = parsed ? item.title.includes(parsed.stat) : false;

    return renderOgImage({
        eyebrow: item.industry,
        title: item.title,
        stat: statAlreadyInTitle ? undefined : parsed?.stat,
        statLabel: statAlreadyInTitle ? undefined : parsed?.label,
        footer: item.client,
    });
}
