import { env } from "@/src/lib/env";

export const appConfig = {
    name: env.NEXT_PUBLIC_APP_NAME,
    description: "Custom software, AI automation and business systems for schools and growing businesses.",
    url: env.NEXT_PUBLIC_APP_URL,
    defaultLocale: "en",
    supportedLocales: ["en", "te"],
} as const;

export const appFeatures = [
    "Custom software",
    "AI automation",
    "Business systems",
] as const;
