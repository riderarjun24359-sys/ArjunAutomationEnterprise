import type { Metadata } from "next";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Services",
    description:
        "Platform implementation, industry pack deployment, AI worker integration, enterprise consulting, and managed support from Arjun Automation.",
    path: "/services",
});

const services = [
    {
        title: "Platform Implementation",
        description: "Full Arjun Automation OS deployment, configuration, and integration with your existing systems.",
        deliverables: ["Tenant provisioning", "Module configuration", "Integration setup", "UAT and go-live support"],
        timeline: "8–12 weeks",
    },
    {
        title: "Industry Pack Deployment",
        description: "Restaurant, Hospital, School, or Retail OS go-live with industry-specific workflows and dashboards.",
        deliverables: ["Industry pack activation", "Location setup", "Workflow configuration", "Staff training"],
        timeline: "6–10 weeks",
    },
    {
        title: "AI Worker Integration",
        description: "Activate BA, Solution Architect, Dev Factory, QA, DevOps, and Customer Success AI agents.",
        deliverables: ["Worker configuration", "Approval workflows", "Audit trail setup", "Team training"],
        timeline: "2–4 weeks",
    },
    {
        title: "Enterprise Consulting",
        description: "Operating model design, automation strategy, and transformation roadmap for complex organizations.",
        deliverables: ["Current-state assessment", "Target architecture", "Roadmap and business case", "Executive workshops"],
        timeline: "2–6 weeks",
    },
    {
        title: "Managed Support",
        description: "24/7 platform monitoring, updates, and customer success for production environments.",
        deliverables: ["Monitoring and alerting", "Platform updates", "Dedicated CSM", "SLA-backed response"],
        timeline: "Ongoing",
    },
];

export default function ServicesPage() {
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-indigo-950">Services</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Structured delivery from discovery to hypercare — with transparent timelines and milestone-based billing.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {services.map((service) => (
                            <article key={service.title} className="rounded-2xl border border-slate-200 p-8">
                                <h2 className="text-xl font-semibold text-indigo-950">{service.title}</h2>
                                <p className="mt-3 text-slate-600 leading-relaxed">{service.description}</p>
                                <p className="mt-4 text-sm font-medium text-indigo-700">Timeline: {service.timeline}</p>
                                <h3 className="mt-4 text-sm font-semibold text-indigo-950">Key Deliverables</h3>
                                <ul className="mt-2 space-y-1">
                                    {service.deliverables.map((d) => (
                                        <li key={d} className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-700" aria-hidden="true" />
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <CtaSection />
        </>
    );
}
