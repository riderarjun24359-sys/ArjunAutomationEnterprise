import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/src/modules/company-launch-kit/components/og/og-image";

export const alt = "Arjun Automation blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((entry) => entry.slug === slug);

    if (!post) {
        return renderOgImage({ eyebrow: "Insights", title: "Arjun Automation insights" });
    }

    return renderOgImage({
        eyebrow: "Insights",
        title: post.title,
        subtitle: post.excerpt,
        footer: "Read the article",
    });
}
