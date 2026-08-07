export const EI_THEME = {
    title: "Enterprise Integration & AI Execution Platform",
    subtitle:
        "Production-ready integration infrastructure: AI providers, secrets, email, social publishing, payments, calendar, storage, webhooks, health, and executive cost intelligence — live multi-tenant Founder/Admin operations.",
} as const;

export const EI_TABS = {
    aiProviders: "aiProviders",
    secrets: "secrets",
    email: "email",
    social: "social",
    payments: "payments",
    calendar: "calendar",
    storage: "storage",
    webhooks: "webhooks",
    health: "health",
    executive: "executive",
} as const;

export type EiTab = (typeof EI_TABS)[keyof typeof EI_TABS];

export const EI_TAB_LIST: Array<{ id: EiTab; label: string }> = [
    { id: EI_TABS.aiProviders, label: "AI Provider Center" },
    { id: EI_TABS.secrets, label: "Secrets Manager" },
    { id: EI_TABS.email, label: "Email Integration" },
    { id: EI_TABS.social, label: "Social Publishing Hub" },
    { id: EI_TABS.payments, label: "Payment Integration Center" },
    { id: EI_TABS.calendar, label: "Calendar & Productivity" },
    { id: EI_TABS.storage, label: "Cloud Storage" },
    { id: EI_TABS.webhooks, label: "Webhook Manager" },
    { id: EI_TABS.health, label: "Integration Health Dashboard" },
    { id: EI_TABS.executive, label: "Executive Integration Dashboard" },
];

export const EI_SOCIAL_PLATFORMS = ["linkedin", "facebook", "instagram", "x", "youtube"] as const;
export type EiSocialPlatform = (typeof EI_SOCIAL_PLATFORMS)[number];

export const EI_PAYMENT_PROVIDERS = ["stripe", "razorpay"] as const;
export type EiPaymentProvider = (typeof EI_PAYMENT_PROVIDERS)[number];

export const EI_CALENDAR_PROVIDERS = ["google_calendar", "outlook"] as const;
export type EiCalendarProvider = (typeof EI_CALENDAR_PROVIDERS)[number];

/** Env keys checked for presence only — values are never read into UI. */
export const EI_ENV_SECRET_KEYS = [
    "OPENAI_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export type EiEnvSecretKey = (typeof EI_ENV_SECRET_KEYS)[number];
