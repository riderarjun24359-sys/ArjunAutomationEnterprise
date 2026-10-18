import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import {
    OG_CONTENT_TYPE,
    OG_SIZE,
    extractStat,
    renderOgImage,
} from "@/src/modules/company-launch-kit/components/og/og-image";

export const alt = "Arjun Automation solution";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = PORTFOLIO_ITEMS.find((entry) => entry.slug === slug);

    if (!item) {
        return renderOgImage({ eyebrow: "Solution", title: "Arjun Automation solution" });
    }

    const parsed = extractStat(item.results);
    const statAlreadyInTitle = parsed ? item.title.includes(parsed.stat) : false;

    return renderOgImage({
        eyebrow: item.category,
        title: item.title,
        subtitle: item.tagline,
        stat: statAlreadyInTitle ? undefined : parsed?.stat,
        statLabel: statAlreadyInTitle ? undefined : parsed?.label,
        footer: "Solution design",
    });
}
