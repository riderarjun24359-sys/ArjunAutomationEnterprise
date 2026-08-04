"use client";

import Link from "next/link";
import { ExternalLink, FileText, Globe, Mail, Image } from "lucide-react";
import { LAUNCH_KIT_SECTIONS, LAUNCH_KIT_THEME } from "@/src/modules/company-launch-kit/constants";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { LAUNCH_KIT_DOCUMENT_FILES, LAUNCH_KIT_EMAIL_FILES } from "@/src/modules/company-launch-kit/lib/documents";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";
import { SocialPostTemplate } from "@/src/modules/company-launch-kit/components/SocialPostTemplate";

const MARKETING_PAGES = [
    { label: "Home", href: MARKETING_ROUTES.home },
    { label: "About", href: MARKETING_ROUTES.about },
    { label: "Services", href: MARKETING_ROUTES.services },
    { label: "Industries", href: MARKETING_ROUTES.industries },
    { label: "Solutions", href: MARKETING_ROUTES.solutions },
    { label: "Portfolio", href: MARKETING_ROUTES.portfolio },
    { label: "Case Studies", href: MARKETING_ROUTES.caseStudies },
    { label: "Blog", href: MARKETING_ROUTES.blog },
    { label: "Careers", href: MARKETING_ROUTES.careers },
    { label: "Contact", href: MARKETING_ROUTES.contact },
    { label: "Privacy", href: MARKETING_ROUTES.privacy },
    { label: "Terms", href: MARKETING_ROUTES.terms },
    { label: "Cookies", href: MARKETING_ROUTES.cookies },
    { label: "Automation Guide", href: MARKETING_ROUTES.launchAutomation },
    { label: "CRM Guide", href: MARKETING_ROUTES.launchCrm },
];

export function CompanyLaunchKitPage() {
    return (
        <div className={`mx-auto flex max-w-7xl flex-col gap-8 text-indigo-950`}>
            <header className={`rounded-[2rem] border ${LAUNCH_KIT_THEME.border} ${LAUNCH_KIT_THEME.surface} p-6 shadow-sm`}>
                <p className={`text-sm font-medium uppercase tracking-[0.24em] ${LAUNCH_KIT_THEME.text}`}>V2 Company Launch Kit</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Complete Arjun Automation Launch</h1>
                <p className="mt-3 max-w-2xl text-sm text-indigo-600">
                    Public marketing website, portfolio, sales documents, email templates, marketing assets, SEO, and analytics — brand-consistent with Brand OS.
                </p>
                <Link
                    href={MARKETING_ROUTES.home}
                    target="_blank"
                    className={`mt-4 inline-flex items-center gap-2 rounded-lg ${LAUNCH_KIT_THEME.bg} px-4 py-2 text-sm font-medium text-white ${LAUNCH_KIT_THEME.bgHover}`}
                >
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    View Public Website
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
                {LAUNCH_KIT_SECTIONS.map((section) => (
                    <section key={section.id} className={`rounded-2xl border ${LAUNCH_KIT_THEME.border} bg-white p-6`}>
                        <h2 className="text-lg font-semibold text-indigo-950">{section.label}</h2>
                        <p className="mt-1 text-sm text-slate-600">{section.description}</p>
                    </section>
                ))}
            </div>

            <section className={`rounded-2xl border ${LAUNCH_KIT_THEME.border} bg-white p-6`}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-950">
                    <Globe className="h-5 w-5" aria-hidden="true" />
                    Marketing Pages ({MARKETING_PAGES.length})
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {MARKETING_PAGES.map((page) => (
                        <li key={page.href}>
                            <Link href={page.href} target="_blank" className="text-sm text-indigo-700 hover:text-indigo-600">
                                {page.label} →
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className={`rounded-2xl border ${LAUNCH_KIT_THEME.border} bg-white p-6`}>
                <h2 className="text-lg font-semibold text-indigo-950">Portfolio ({PORTFOLIO_ITEMS.length} items)</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {PORTFOLIO_ITEMS.map((item) => (
                        <li key={item.slug}>
                            <Link href={MARKETING_ROUTES.portfolioItem(item.slug)} target="_blank" className="text-sm text-indigo-700 hover:text-indigo-600">
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className={`rounded-2xl border ${LAUNCH_KIT_THEME.border} bg-white p-6`}>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-950">
                        <FileText className="h-5 w-5" aria-hidden="true" />
                        Sales Documents ({LAUNCH_KIT_DOCUMENT_FILES.length})
                    </h2>
                    <ul className="mt-4 space-y-2">
                        {LAUNCH_KIT_DOCUMENT_FILES.map((slug) => (
                            <li key={slug} className="text-sm text-slate-600">
                                {slug.replace(/-/g, " ")}.md
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={`rounded-2xl border ${LAUNCH_KIT_THEME.border} bg-white p-6`}>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-950">
                        <Mail className="h-5 w-5" aria-hidden="true" />
                        Email Templates ({LAUNCH_KIT_EMAIL_FILES.length})
                    </h2>
                    <ul className="mt-4 space-y-2">
                        {LAUNCH_KIT_EMAIL_FILES.map((slug) => (
                            <li key={slug} className="text-sm text-slate-600">
                                {slug.replace(/-/g, " ")}.md
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <section className={`rounded-2xl border ${LAUNCH_KIT_THEME.border} bg-white p-6`}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-950">
                    <Image className="h-5 w-5" aria-hidden="true" />
                    Blog Posts ({BLOG_POSTS.length})
                </h2>
                <ul className="mt-4 space-y-2">
                    {BLOG_POSTS.map((post) => (
                        <li key={post.slug}>
                            <Link href={MARKETING_ROUTES.blogPost(post.slug)} target="_blank" className="text-sm text-indigo-700 hover:text-indigo-600">
                                {post.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className={`rounded-2xl border ${LAUNCH_KIT_THEME.border} bg-white p-6`}>
                <h2 className="text-lg font-semibold text-indigo-950">Social Post Template Preview</h2>
                <div className="mt-6">
                    <SocialPostTemplate />
                </div>
            </section>
        </div>
    );
}
