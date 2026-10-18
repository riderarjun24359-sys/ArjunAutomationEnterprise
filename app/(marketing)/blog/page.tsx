import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/src/modules/company-launch-kit/components/NewsletterSignup";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Blog",
    description: "Insights on enterprise automation, AI workers, industry OS packs, and platform best practices from Arjun Automation.",
    path: "/blog",
});

export default function BlogPage() {
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-orange-950">Blog</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Enterprise automation insights, AI worker strategies, and platform best practices.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            {BLOG_POSTS.map((post) => (
                                <article key={post.slug} className="rounded-2xl border border-slate-200 p-8">
                                    <span className="text-xs font-medium text-orange-500">{post.category}</span>
                                    <h2 className="mt-2 text-2xl font-semibold text-orange-950">
                                        <Link href={MARKETING_ROUTES.blogPost(post.slug)} className="hover:text-orange-500">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p className="mt-3 text-slate-600">{post.excerpt}</p>
                                    <div className="mt-4 flex gap-4 text-sm text-slate-500">
                                        <span>{post.author}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <Link href={MARKETING_ROUTES.blogPost(post.slug)} className="mt-4 inline-block text-sm font-medium text-orange-500 hover:text-orange-600">
                                        Read article &rarr;
                                    </Link>
                                </article>
                            ))}
                        </div>
                        <div>
                            <NewsletterSignup />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
