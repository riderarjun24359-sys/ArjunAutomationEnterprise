import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "School ERP Software",
    description:
        "Attendance, fees, parent communication, and report cards on one dashboard for schools, trusts, and group institutions — powered by Arjun Automation OS.",
    path: "/school-erp",
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "School ERP", path: PAGE.path },
];

const modules = [
    {
        title: "Attendance",
        body: "Mark period-wise or daily attendance in seconds, with absence alerts reaching parents the same morning.",
    },
    {
        title: "Fees & Billing",
        body: "Fee structures by grade and term, online payments, instant receipts, and automatic late-fee reminders.",
    },
    {
        title: "Parent Communication",
        body: "Broadcast circulars, event notices, and emergency alerts by class, section, or the whole school.",
    },
    {
        title: "Report Cards",
        body: "Enter marks once and generate term reports with grades, ranks, and teacher remarks — print-ready.",
    },
    {
        title: "Admissions & Enquiry Desk",
        body: "Track enquiries through application, interview, and offer so nothing slips during admission season.",
    },
    {
        title: "Staff & Timetable",
        body: "Manage teacher records, subject allocation, and timetables alongside the classes they teach.",
    },
];

/**
 * School ERP landing page.
 *
 * This route previously rendered nothing (the file existed but was empty),
 * which failed `next build` with a TypeScript module error. Schools remain a
 * supported industry — see INDUSTRIES_CONTENT and the School OS pack — so the
 * route now hosts the school-specific positioning that used to live on the
 * homepage, with every claim kept factual and every CTA pointing at a public
 * marketing destination.
 */
export default function SchoolErpPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="School ERP Software"
                description="Replace paper registers, spreadsheet fee ledgers, and scattered parent groups with one system your team can use from the first day of term."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />

                <section aria-labelledby="school-modules-heading">
                    <h2 id="school-modules-heading" className="text-xl font-semibold">
                        Everything the front office needs
                    </h2>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {modules.map((item) => (
                            <div key={item.title} className="premium-card p-6">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="school-next-heading" className="mt-12">
                    <h2 id="school-next-heading" className="text-xl font-semibold">
                        How to evaluate it
                    </h2>
                    <p className="mt-4 max-w-3xl text-[var(--premium-fg-muted)] leading-relaxed">
                        School ERP is delivered as an industry pack on Arjun Automation OS, so it shares one login,
                        one student record, and one audit trail with any other module you add later. Review{" "}
                        <Link href={MARKETING_ROUTES.pricing} className="text-[var(--dos-brand-primary)] underline">
                            pricing
                        </Link>
                        , explore{" "}
                        <Link href={MARKETING_ROUTES.industries} className="text-[var(--dos-brand-primary)] underline">
                            industries we serve
                        </Link>
                        , or ask us about migrating a term of your existing data before you commit.
                    </p>
                </section>
            </PremiumPageShell>

            <CtaSection
                title="See your school running on one dashboard"
                description="Book a demo and we will walk through attendance, fees, and parent communication with your own workflows in mind."
                primaryLabel="Book a Demo"
                primaryHref={MARKETING_ROUTES.contact}
                secondaryLabel="See pricing"
                secondaryHref={MARKETING_ROUTES.pricing}
            />
        </>
    );
}
