import { env } from "@/src/lib/env";

export const appConfig = {
    name: env.NEXT_PUBLIC_APP_NAME,
    description: "Enterprise AI Business Operating System",
    url: env.NEXT_PUBLIC_APP_URL,
    defaultLocale: "en",
    supportedLocales: ["en"],
} as const;

export const appFeatures = [
    "Secure authentication",
    "Reusable enterprise components",
    "Modular workflow orchestration",
    "Operational analytics",
] as const;
