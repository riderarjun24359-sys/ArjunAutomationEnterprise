import Link from "next/link";
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

export function MarketingFooter() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50" aria-label="Site footer">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link href={MARKETING_ROUTES.home} className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">AA</span>
                            <span className="text-lg font-semibold text-orange-950">Arjun Automation</span>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm text-slate-600">
                            Enterprise automation. Without the enterprise wait. One platform, every operation, AI-native from the ground up.
                        </p>
                        <p className="mt-4 text-sm text-slate-500">
                            sales@arjunautomations.com
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-orange-950">Company</h3>
                        <ul className="mt-3 space-y-2">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-slate-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-orange-950">Solutions</h3>
                        <ul className="mt-3 space-y-2">
                            {FOOTER_LINKS.solutions.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-slate-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-orange-950">Resources</h3>
                        <ul className="mt-3 space-y-2">
                            {FOOTER_LINKS.resources.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-slate-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
                    <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Arjun Automation. All rights reserved.</p>
                    <div className="flex gap-4">
                        {FOOTER_LINKS.legal.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm text-slate-500 hover:text-orange-500">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

