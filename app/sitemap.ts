import type { MetadataRoute } from "next";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { CASE_STUDY_ITEMS } from "@/src/modules/company-launch-kit/data/case-studies";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { SERVICE_ITEMS } from "@/src/modules/company-launch-kit/data/services";
import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = LAUNCH_KIT_SEO.siteUrl;

    const staticRoutes = [
        MARKETING_ROUTES.home,
        MARKETING_ROUTES.about,
        MARKETING_ROUTES.services,
        MARKETING_ROUTES.industries,
        MARKETING_ROUTES.solutions,
        MARKETING_ROUTES.portfolio,
        MARKETING_ROUTES.caseStudies,
        MARKETING_ROUTES.pricing,
        MARKETING_ROUTES.faq,
        MARKETING_ROUTES.resources,
        MARKETING_ROUTES.sitemap,
        MARKETING_ROUTES.blog,
        MARKETING_ROUTES.careers,
        MARKETING_ROUTES.contact,
        MARKETING_ROUTES.privacy,
        MARKETING_ROUTES.terms,
        MARKETING_ROUTES.cookies,
        MARKETING_ROUTES.launchAutomation,
        MARKETING_ROUTES.launchCrm,
    ];

    return [
        ...staticRoutes.map((path) => ({
            url: `${base}${path}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: path === "/" ? 1 : 0.8,
        })),
        ...SERVICE_ITEMS.map((item) => ({
            url: `${base}${MARKETING_ROUTES.serviceItem(item.slug)}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.75,
        })),
        ...PORTFOLIO_ITEMS.map((item) => ({
            url: `${base}/portfolio/${item.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
        ...CASE_STUDY_ITEMS.map((item) => ({
            url: `${base}${MARKETING_ROUTES.caseStudyItem(item.slug)}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
        ...BLOG_POSTS.map((post) => ({
            url: `${base}/blog/${post.slug}`,
            lastModified: new Date(post.publishedAt),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
    ];
}
