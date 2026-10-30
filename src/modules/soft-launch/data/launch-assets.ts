import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { ROUTES } from "@/src/constants/routes";

export type SoftLaunchPlanId = "free_trial" | "starter" | "professional" | "enterprise";

export interface SoftLaunchPlan {
    id: SoftLaunchPlanId;
    name: string;
    priceLabel: string;
    billingNote: string;
    description: string;
    highlighted?: boolean;
    limits: {
        users: string;
        projects: string;
        storage: string;
        apiCalls: string;
    };
    features: string[];
    cta: { label: string; href: string };
}

export const SOFT_LAUNCH_PLANS: SoftLaunchPlan[] = [
    {
        id: "free_trial",
        name: "Free Trial",
        priceLabel: "Free",
        billingNote: "14 days · no card required",
        description: "Explore the full workspace with standard usage limits.",
        limits: { users: "5", projects: "3", storage: "2 GB", apiCalls: "10k / month" },
        features: ["CRM + Projects", "Executive dashboard", "Email support", "Guided onboarding wizard"],
        cta: { label: "Start free trial", href: `${ROUTES.auth.signUp}?plan=free_trial` },
    },
    {
        id: "starter",
        name: "Starter",
        priceLabel: "Contact for INR Pricing",
        billingNote: "per organization / month",
        description: "For small teams consolidating CRM and delivery.",
        limits: { users: "15", projects: "25", storage: "25 GB", apiCalls: "100k / month" },
        features: ["Everything in Free Trial", "Billing & invoices", "Basic integrations", "Help center access"],
        cta: { label: "Choose Starter", href: `${ROUTES.auth.signUp}?plan=starter` },
    },
    {
        id: "professional",
        name: "Professional",
        priceLabel: "Contact for INR Pricing",
        billingNote: "per organization / month",
        description: "For growing companies running multi-module operations.",
        highlighted: true,
        limits: { users: "50", projects: "Unlimited", storage: "200 GB", apiCalls: "1M / month" },
        features: [
            "Everything in Starter",
            "Customer Success + HRMS",
            "Integration Hub",
            "Priority support",
            "Upgrade controls",
        ],
        cta: { label: "Choose Professional", href: `${ROUTES.auth.signUp}?plan=professional` },
    },
    {
        id: "enterprise",
        name: "Enterprise",
        priceLabel: "Custom Enterprise Pricing — INR",
        billingNote: "annual · volume pricing",
        description: "For regulated and multi-entity enterprises.",
        limits: { users: "Unlimited", projects: "Unlimited", storage: "Custom", apiCalls: "Custom" },
        features: [
            "Everything in Professional",
            "Security Center + SSO readiness",
            "Dedicated CSM",
            "Custom SLAs",
            "Private onboarding",
        ],
        cta: { label: "Contact sales", href: MARKETING_ROUTES.contact },
    },
];

export const SOFT_LAUNCH_FEATURES = [
    {
        title: "Executive Command Center",
        description: "Live KPIs, risks, opportunities, and cross-module widgets in one premium dashboard.",
    },
    {
        title: "CRM & Revenue Ops",
        description: "Client directory, pipeline, communications, and analytics powered by live Supabase data.",
    },
    {
        title: "Projects & Delivery",
        description: "Plan work, track tasks, and keep delivery aligned with customer outcomes.",
    },
    {
        title: "Customer Success",
        description: "Health scores, renewals, and success playbooks for long-term retention.",
    },
    {
        title: "Billing & Finance",
        description: "Subscriptions, invoices, payments, and finance assistant surfaces.",
    },
    {
        title: "HRMS & Workforce",
        description: "People ops, attendance, payroll readiness, ATS, and training workflows.",
    },
    {
        title: "Integration Hub",
        description: "API keys, webhooks, connectors, and developer-facing controls.",
    },
    {
        title: "Security & Compliance",
        description: "RBAC, MFA, audit explorer, compliance packs, and backup/DR visibility.",
    },
];

export const ONBOARDING_STEPS = [
    { id: "organization", title: "Organization setup", description: "Confirm company name, slug, and operating status." },
    { id: "workspace", title: "Workspace creation", description: "Create your first operational workspace/team." },
    { id: "invite", title: "Invite teammates", description: "Send invites for admins and operators." },
    { id: "checklist", title: "First project checklist", description: "Complete the go-live checklist." },
] as const;

export const FIRST_PROJECT_CHECKLIST = [
    "Create organization profile",
    "Add at least one teammate invite",
    "Create first project",
    "Connect CRM lead or client",
    "Review Security Center baseline",
    "Bookmark Help Center & FAQ",
] as const;

export const HELP_CENTER_TOPICS = [
    {
        title: "Getting started",
        body: "Create your account to launch the onboarding wizard — it sets up your organization, workspace, and first project checklist.",
        // Auth-gated wizard is not reachable for logged-out visitors; the public
        // path into it is the sign-up page.
        href: ROUTES.auth.signUp,
    },
    { title: "Billing & plans", body: "Compare Free Trial, Starter, Professional, and Enterprise limits on the pricing page.", href: MARKETING_ROUTES.pricing },
    {
        title: "Security basics",
        body: "Multi-factor authentication, role-based access control, and audit logging are built into the platform. Read how we handle data in the privacy policy.",
        // Security Center is an in-app route; the public destination is the
        // privacy policy plus a way to ask for the security overview.
        href: MARKETING_ROUTES.privacy,
    },
    { title: "Contact support", body: "Reach sales or support through Contact Us for platform assistance.", href: MARKETING_ROUTES.contact },
] as const;

export const SOFT_LAUNCH_BRANDING = {
    productName: "Arjun Automation",
    tagline: "Enterprise operating system for modern operations",
    primaryColor: "#4338ca",
    faviconPath: "/brand/favicon.svg",
    logoPath: "/brand/logos/favicon.svg",
    /**
     * Raster icons. Apple touch icons and PWA manifest icons must be PNG —
     * iOS ignores an SVG `apple-touch-icon`, so a "Save to Home Screen" from
     * Safari previously produced a blank tile. Rendered from
     * `public/brand/logos/app-icon.svg`.
     */
    appleTouchIconPath: "/brand/icons/apple-touch-icon.png",
    icon192Path: "/brand/icons/icon-192.png",
    icon512Path: "/brand/icons/icon-512.png",
    favicon32Path: "/brand/icons/favicon-32.png",
    /**
     * Fallback only. Route-level `opengraph-image.tsx` files override this with
     * real per-page PNGs, because X/LinkedIn/Facebook/WhatsApp cannot render the
     * SVG this path used to serve (blank share cards on every link).
     */
    ogImagePath: "/launch-kit/og-default.svg",
    supportEmail: "support@arjunautomations.com",
    salesEmail: "sales@arjunautomations.com",
} as const;

export const DOMAIN_READINESS = {
    canonicalHost: "www.arjunautomations.com",
    requiredDns: ["A/ALIAS to hosting provider", "CNAME www → apex or CDN", "TXT for email auth (SPF/DKIM/DMARC)"],
    tls: "HTTPS enforced via platform edge",
    env: ["NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "PLATFORM_LEAD_API_KEY"],
} as const;

