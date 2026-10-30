/**
 * Arjun Automation — AI-First Delivery Policy
 * Mandatory delivery language for all modules, marketing, and business assets.
 * Do NOT advertise traditional fixed software implementation timelines.
 */

export const AI_DELIVERY_POLICY_SUMMARY =
    "Customers receive AI-accelerated delivery without compromising enterprise quality, security, or reliability.";

export const AI_DELIVERY_LEVELS = [
    {
        level: 1,
        title: "AI Requirement Analysis",
        description: "Understand requirements, systems, integrations, and success criteria.",
        estimate: "Focused analysis session",
    },
    {
        level: 2,
        title: "AI Solution Generation",
        description: "Generate the first complete working solution using our internal AI platform.",
        estimate: "First working version, not a production release",
    },
    {
        level: 3,
        title: "Expert Engineering Review",
        description: "Architecture review · Security review · Business validation · UX validation",
        estimate: "Structured enterprise review gates",
    },
    {
        level: 4,
        title: "Customer Validation",
        description: "Customer feedback · Minor revisions · Approval",
        estimate: "Collaborative validation cycle",
    },
    {
        level: 5,
        title: "Secure Production Deployment",
        description: "Deployment · Testing · Monitoring · Documentation",
        estimate: "Enterprise deployment after validation",
    },
] as const;

export const AI_DELIVERY_MARKETING = {
    tagline: "AI-first delivery. Fast to first working version. Enterprise rigor before go-live.",
    policySummary: AI_DELIVERY_POLICY_SUMMARY,

    /**
     * CREDIBILITY NOTE
     * ----------------
     * These lines previously promised an "AI-generated first version within
     * hours" on the same site that quotes Contact for INR Pricing implementation
     * fees. Buyers read the pairing as either a pricing error or a toy, and it
     * actively undercut the enterprise positioning.
     *
     * The claim is now scoped honestly: the *analysis* is fast, the first
     * working version follows quickly, and production deployment is gated on
     * validation. Speed is stated as a property of the method, not as a
     * substitute for the work — which is what enterprise buyers are actually
     * buying.
     */
    firstVersion: "⚡ Requirement analysis starts in the first session.",
    rapidDelivery: "🚀 A first working version follows shortly after.",
    enterpriseDeployment: "⚙ Production deployment happens only after validation.",
    timelineNote: "📈 Scope and schedule are finalized after discovery.",
    enterpriseRoadmap: "Delivery roadmap is finalized after technical discovery.",
    brandPosition:
        "Arjun Automation is an AI-first company. Customers buy speed, automation, quality, scalability, and reliability — not developer hours.",
} as const;

/** Short label for service cards — no fixed week/day durations */
export const AI_DELIVERY_SERVICE_LABEL = "AI-accelerated · Roadmap after requirement analysis";

/** Customer journey steps — AI-first, no fixed week ranges */
export const AI_DELIVERY_JOURNEY_STEPS = AI_DELIVERY_LEVELS.map((l) => ({
    phase: `Step ${l.level}`,
    title: l.title,
    description: `${l.description}${l.estimate ? ` (${l.estimate})` : ""}`,
}));

export const AI_DELIVERY_FAQ_IMPLEMENTATION = {
    question: "How long does implementation typically take?",
    answer: `${AI_DELIVERY_MARKETING.firstVersion} ${AI_DELIVERY_MARKETING.rapidDelivery} ${AI_DELIVERY_MARKETING.enterpriseDeployment} ${AI_DELIVERY_MARKETING.timelineNote} ${AI_DELIVERY_POLICY_SUMMARY} For large enterprise programs: ${AI_DELIVERY_MARKETING.enterpriseRoadmap}`,
};

/**
 * Extra FAQ entry making the pricing/timeline relationship explicit.
 *
 * Buyers on a five-figure implementation budget want to know why the fee is
 * not simply the number of hours spent. This answers that directly instead of
 * leaving it implied — which is what previously made the speed claims read as
 * a contradiction of the price list.
 */
export const AI_DELIVERY_FAQ_WHY_INVESTMENT = {
    question: "Why does implementation cost more than the time it takes to build a first version?",
    answer:
        "A first working version proves the approach. Going live is a different body of work: integrating with your existing systems, migrating data, hardening security, passing review gates, training your team, and owning the result once real users depend on it. We quote for the go-live, not the prototype — and the prototype is included, so you see the system working before you commit to the rest.",
} as const;

/** Forbidden in marketing/delivery copy — use verify script to scan */
export const FORBIDDEN_DELIVERY_TIMELINES = [
    "7 days",
    "14 days",
    "45 days",
    "go live in 90",
    "go-live in 90",
    "8–12 weeks",
    "8-12 weeks",
    "6–10 weeks",
    "6-10 weeks",
    "2–4 weeks",
    "2-4 weeks",
    "2–6 weeks",
    "2-6 weeks",
    "4–6 weeks",
    "4-6 weeks",
    "12–16 weeks",
    "12-16 weeks",
    "Average Go-Live",
    "90-day go-live",
    "90-day framework",
    "within [X] weeks",
    "Estimated Timeline:** [X weeks]",
    "Most clients go live in 90",
    "Enterprise Automation in 90 Days",
] as const;

export function formatDeliveryLevelsMarkdown(): string {
    return [
        "## AI-First Delivery Policy",
        "",
        "Every engagement follows:",
        "",
        ...AI_DELIVERY_LEVELS.map((l) => `${l.level}. **${l.title}** — ${l.description}`),
        "",
        AI_DELIVERY_POLICY_SUMMARY,
    ].join("\n");
}
