export const ROUTES = {
    home: "/",
    auth: {
        signIn: "/auth/sign-in",
        signUp: "/auth/sign-up",
        forgotPassword: "/auth/forgot-password",
    },
    dashboard: "/dashboard",
    organization: "/organization",
    crm: "/crm",
    clients: "/clients",
    projects: "/projects",
    tasks: "/tasks",
    finance: "/finance",
    ai: "/ai",
    analytics: "/analytics",
    automation: "/automation",
    settings: "/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
