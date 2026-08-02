export const ROUTES = {
    home: "/",
    auth: {
        signIn: "/auth/sign-in",
        signUp: "/auth/sign-up",
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password",
        callback: "/auth/callback",
    },
    dashboard: "/dashboard",
    organization: "/organization",
    crm: "/crm",
    projects: "/projects",
    clients: "/clients",
    tasks: "/tasks",
    finance: "/finance",
    ai: "/ai",
    analytics: "/analytics",
    automation: "/automation",
    settings: "/settings",
    hr: "/hr",
    inventory: "/inventory",
    support: "/support",
    sales: "/sales",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
