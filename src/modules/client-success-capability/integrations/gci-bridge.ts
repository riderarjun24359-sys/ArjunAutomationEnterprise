import { createGciClient } from "@/src/modules/gci/sdk";
import { SUPPORTED_LANGUAGES } from "@/src/modules/gci/lib/localization";
import type { GciPreferences, SupportedLanguage } from "@/src/modules/gci/types";

const client = createGciClient();

export function resolveClientLocale(clientId: string, browserLocale?: string): SupportedLanguage {
    return client.resolveClientLocale(clientId, browserLocale);
}

export function setClientPreferredLanguage(clientId: string, locale: SupportedLanguage): GciPreferences {
    return client.setClientLocale(clientId, locale);
}

export function buildLocalizedPortalContent(clientId: string, locale?: SupportedLanguage) {
    return client.buildPortalContent(clientId, locale);
}

export function buildLocalizedEmail(templateId: string, locale: SupportedLanguage, vars: Record<string, string>) {
    return client.buildEmailContent(templateId, locale, vars);
}

export function buildLocalizedNotification(
    title: string,
    message: string,
    locale: SupportedLanguage,
    channel: "email" | "portal" | "push" | "sms" = "portal",
) {
    return client.buildNotification(title, message, locale, channel);
}

export function buildAiAssistantContent(clientId: string, query: string, locale?: SupportedLanguage) {
    return client.buildAssistantContent(clientId, query, locale);
}

export { createGciClient, SUPPORTED_LANGUAGES };
