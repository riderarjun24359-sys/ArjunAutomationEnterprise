import { FAQ_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

type FaqAccordionStaticProps = {
    title?: string;
    items?: { question: string; answer: string }[];
};

export function FaqAccordionStatic({ title = FAQ_CONTENT.title, items = FAQ_CONTENT.items }: FaqAccordionStaticProps) {
    return (
        <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-2xl font-bold sm:text-3xl">
                {title}
            </h2>
            <div className="mt-8 space-y-3">
                {items.map((item) => (
                    <details
                        key={item.question}
                        className="group overflow-hidden rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)]"
                    >
                        <summary className="cursor-pointer list-none px-6 py-4 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                            <span className="flex items-center justify-between gap-4">
                                {item.question}
                                <span
                                    className="shrink-0 text-[var(--premium-fg-muted)] transition group-open:rotate-180 motion-reduce:transition-none"
                                    aria-hidden="true"
                                >
                                    ▼
                                </span>
                            </span>
                        </summary>
                        <p className="px-6 pb-4 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}
