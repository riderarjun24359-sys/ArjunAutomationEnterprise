import Link from "next/link";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

const FOOTER_LINKS = {
    company: [
        { label: "About", href: MARKETING_ROUTES.about },
        { label: "Careers", href: MARKETING_ROUTES.careers },
        { label: "Contact", href: MARKETING_ROUTES.contact },
    ],
    solutions: [
        { label: "Services", href: MARKETING_ROUTES.services },
        { label: "Industries", href: MARKETING_ROUTES.industries },
        { label: "Solutions", href: MARKETING_ROUTES.solutions },
        { label: "Portfolio", href: MARKETING_ROUTES.portfolio },
    ],
    resources: [
        { label: "Blog", href: MARKETING_ROUTES.blog },
        { label: "Case Studies", href: MARKETING_ROUTES.caseStudies },
        { label: "Automation Guide", href: MARKETING_ROUTES.launchAutomation },
        { label: "CRM Guide", href: MARKETING_ROUTES.launchCrm },
    ],
    legal: [
        { label: "Privacy Policy", href: MARKETING_ROUTES.privacy },
        { label: "Terms of Service", href: MARKETING_ROUTES.terms },
        { label: "Cookie Policy", href: MARKETING_ROUTES.cookies },
    ],
};

/** Zero-JS marketing footer for fast first paint. */
export function MarketingFooterStatic() {
    return (
        <footer className="border-t border-[var(--premium-border)] bg-slate-950 text-slate-300" aria-label="Site footer">
            <div className="premium-container py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link href={MARKETING_ROUTES.home} className="inline-block">
                            <BrandLogo variant="inverse" className="max-h-8" label="Arjun Automation Enterprises" />
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                            Enterprise automation. Without the enterprise wait. One platform, every operation, AI-native from the ground up.
                        </p>
                        <p className="mt-4 text-sm text-slate-400">sales@arjunautomation.com</p>
                    </div>

                    {Object.entries({ Company: FOOTER_LINKS.company, Solutions: FOOTER_LINKS.solutions, Resources: FOOTER_LINKS.resources }).map(
                        ([title, links]) => (
                            <div key={title}>
                                <h3 className="text-sm font-semibold text-white">{title}</h3>
                                <ul className="mt-3 space-y-2">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="text-slate-400 hover:text-indigo-400">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ),
                    )}

                    <div>
                        <h3 className="text-sm font-semibold text-white">Legal</h3>
                        <ul className="mt-3 space-y-2">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-slate-400 hover:text-indigo-400">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
                    © {new Date().getFullYear()} Arjun Automation. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
