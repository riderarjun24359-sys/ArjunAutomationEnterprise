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
        estimate: "Hours instead of weeks",
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
    tagline: "AI-first delivery. Hours to first version. Enterprise rigor after validation.",
    policySummary: AI_DELIVERY_POLICY_SUMMARY,
    firstVersion: "⚡ AI-generated first version within hours.",
    rapidDelivery: "🚀 Rapid production delivery.",
    enterpriseDeployment: "⚙ Enterprise deployment after validation.",
    timelineNote: "📈 Timeline finalized after discovery and integration assessment.",
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
