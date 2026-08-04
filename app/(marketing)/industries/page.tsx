import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Industries",
    description:
        "Arjun Automation serves restaurants, healthcare, education, retail, professional services, technology, and manufacturing with industry-specific OS packs.",
    path: "/industries",
});

const industries = [
    { name: "Restaurants & Hospitality", useCases: "Multi-location ops, kitchen workflows, POS integration", pack: "Restaurant OS" },
    { name: "Healthcare", useCases: "Patient flow, clinical ops, pharmacy, lab integration", pack: "Hospital OS" },
    { name: "Education", useCases: "Student lifecycle, academics, parent portals, finance", pack: "School OS" },
    { name: "Retail", useCases: "Inventory, POS, customer loyalty, multi-store analytics", pack: "Retail OS" },
    { name: "Professional Services", useCases: "CRM, projects, billing, client portals", pack: "Core Platform" },
    { name: "Technology & SaaS", useCases: "Internal ops, customer success, launch readiness", pack: "Core Platform" },
    { name: "Manufacturing & Distribution", useCases: "Inventory, procurement, workflow automation", pack: "Core Platform + ERP Integration" },
];

export default function IndustriesPage() {
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-indigo-950">Industries We Serve</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Pre-built industry OS packs accelerate deployment by 60–70% compared to greenfield configuration.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="pb-4 pr-4 text-sm font-semibold text-indigo-950">Industry</th>
                                    <th className="pb-4 pr-4 text-sm font-semibold text-indigo-950">Primary Use Cases</th>
                                    <th className="pb-4 text-sm font-semibold text-indigo-950">Recommended Pack</th>
                                </tr>
                            </thead>
                            <tbody>
                                {industries.map((ind) => (
                                    <tr key={ind.name} className="border-b border-slate-100">
                                        <td className="py-4 pr-4 font-medium text-indigo-950">{ind.name}</td>
                                        <td className="py-4 pr-4 text-sm text-slate-600">{ind.useCases}</td>
                                        <td className="py-4 text-sm text-indigo-700">{ind.pack}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-8 text-sm text-slate-600">
                        Explore our <Link href={MARKETING_ROUTES.portfolio} className="text-indigo-700 hover:text-indigo-600">portfolio</Link> for industry-specific case studies.
                    </p>
                </div>
            </section>

            <CtaSection title="Industry-specific automation" description="Tell us about your industry and operational challenges. We will recommend the right pack and go-live plan." />
        </>
    );
}
