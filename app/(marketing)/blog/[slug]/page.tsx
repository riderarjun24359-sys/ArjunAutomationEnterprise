import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/src/modules/company-launch-kit/components/BlogLayout";
import { MarkdownContent } from "@/src/modules/company-launch-kit/components/MarkdownContent";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { BLOG_POSTS, getBlogPost } from "@/src/modules/company-launch-kit/data/blog";
import { buildMetadata } from "@/src/lib/seo";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) return {};
    return buildMetadata({
        title: post.title,
        description: post.excerpt,
        path: `/blog/${slug}`,
    });
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) notFound();

    return (
        <>
            <BlogLayout
                title={post.title}
                excerpt={post.excerpt}
                author={post.author}
                publishedAt={post.publishedAt}
                readTime={post.readTime}
                category={post.category}
            >
                <MarkdownContent content={post.content} />
            </BlogLayout>
            <CtaSection />
        </>
    );
}
