import { createGciClient } from "@/src/modules/gci/sdk";
import { GCI_PRESERVATION_RULES } from "../constants";
import type { SupportedLanguage } from "@/src/modules/gci/types";

const client = createGciClient();

/** All AI must use GCI — language adaptation preserves business intent, technical meaning, legal terminology, and professional tone. */
export function adaptAiContent(content: string, locale: SupportedLanguage, title?: string) {
    return client.translate({ content, title, targetLocale: locale });
}

export function buildLocalizedAiAssistantContent(clientId: string, query: string, locale?: SupportedLanguage) {
    return client.buildAssistantContent(clientId, query, locale);
}

export function resolveAiLocale(clientId: string, browserLocale?: string): SupportedLanguage {
    return client.resolveClientLocale(clientId, browserLocale);
}

export { createGciClient, GCI_PRESERVATION_RULES };
