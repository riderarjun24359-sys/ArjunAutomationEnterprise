import Link from "next/link";
import {
    Bot,
    Code2,
    Globe,
    GraduationCap,
    MessageSquare,
    Plug,
    ShoppingCart,
    Users,
    Wrench,
    type LucideIcon,
} from "lucide-react";
import { SERVICES_PREVIEW_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";

const ICONS: Record<string, LucideIcon> = {
    bot: Bot,
    code: Code2,
    globe: Globe,
    graduation: GraduationCap,
    users: Users,
    cart: ShoppingCart,
    message: MessageSquare,
    plug: Plug,
    wrench: Wrench,
};

export function ServicesPreviewSection() {
    const { title, subtitle, services } = SERVICES_PREVIEW_CONTENT;

    return (
        <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="services-preview-heading">
            <div className="premium-container">
                <div className="tc-reveal mx-auto max-w-3xl text-center">
                    <h2 id="services-preview-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-3 text-[var(--premium-fg-muted)]">{subtitle}</p>
                </div>

                <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {services.map((service, index) => {
                        const Icon = ICONS[service.icon] ?? Code2;
                        const delayClass = index % 3 === 0 ? "" : `tc-reveal-delay-${Math.min(index % 3, 3)}`;
                        return (
                            <li key={service.title} className={`tc-reveal ${delayClass}`.trim()}>
                                <article className="tc-card flex h-full flex-col p-6">
                                    <div className="flex items-start gap-3">
                                        <Icon className="mt-0.5 h-6 w-6 shrink-0 text-indigo-700" aria-hidden="true" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                                            <p className="mt-2 text-sm font-medium text-indigo-800">{service.businessValue}</p>
                                        </div>
                                    </div>
                                    <ul className="mt-4 flex-1 space-y-1.5" aria-label={`${service.title} key benefits`}>
                                        {service.benefits.map((benefit) => (
                                            <li key={benefit} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" aria-hidden="true" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={service.cta.href}
                                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                                    >
                                        {service.cta.label}
                                    </Link>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
