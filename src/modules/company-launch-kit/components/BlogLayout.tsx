import Link from "next/link";
import type { ReactNode } from "react";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export interface BlogLayoutProps {
    title: string;
    excerpt: string;
    author: string;
    publishedAt: string;
    readTime: string;
    category: string;
    children: ReactNode;
}

export function BlogLayout({ title, excerpt, author, publishedAt, readTime, category, children }: BlogLayoutProps) {
    return (
        <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
            <Link href={MARKETING_ROUTES.blog} className="text-sm font-medium text-orange-500 hover:text-orange-600">
                &larr; Back to Blog
            </Link>
            <header className="mt-6">
                <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-orange-500">{category}</span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-orange-950 sm:text-4xl">{title}</h1>
                <p className="mt-4 text-lg text-slate-600">{excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>{author}</span>
                    <span>{new Date(publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    <span>{readTime}</span>
                </div>
            </header>
            <div className="prose prose-slate mt-10 max-w-none prose-headings:text-orange-950 prose-a:text-orange-500">
                {children}
            </div>
        </article>
    );
}
