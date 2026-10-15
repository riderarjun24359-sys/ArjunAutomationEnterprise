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
import { SectionHeader } from "@/src/modules/trust-conversion/components/ui/SectionHeader";
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
                <SectionHeader id="services-preview-heading" title={title} subtitle={subtitle} />

                <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {services.map((service, index) => {
                        const Icon = ICONS[service.icon] ?? Code2;
                        const delayClass = index % 3 === 0 ? "" : `tc-reveal-delay-${Math.min(index % 3, 3)}`;
                        return (
                            <li key={service.title} className={`tc-reveal ${delayClass}`.trim()}>
                                <article className="premium-card flex h-full flex-col p-6">
                                    <div className="flex items-start gap-4">
                                        <span className="premium-card-icon">
                                            <Icon className="h-6 w-6" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                                                {service.title}
                                            </h3>
                                            <p className="mt-1.5 text-sm font-medium text-[var(--premium-accent)]">
                                                {service.businessValue}
                                            </p>
                                        </div>
                                    </div>

                                    <ul
                                        className="mt-5 flex-1 space-y-2"
                                        aria-label={`${service.title} key benefits`}
                                    >
                                        {service.benefits.map((benefit) => (
                                            <li
                                                key={benefit}
                                                className="flex items-start gap-2.5 text-sm text-[var(--dos-text-secondary)]"
                                            >
                                                <span
                                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--dos-brand-primary)]"
                                                    aria-hidden="true"
                                                />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={service.cta.href}
                                        className="mt-6 inline-flex items-center justify-center rounded-full border border-[var(--dos-border-strong)] bg-[var(--dos-surface-elevated)] px-4 py-2.5 text-sm font-semibold text-[var(--dos-text-primary)] transition duration-200 hover:border-[var(--dos-brand-primary)] hover:bg-[var(--dos-brand-primary)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2"
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
