import type { GciPreferences, SupportedLanguage } from "../types";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "hi", "es", "fr", "de", "ar", "ja", "pt"];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
    ar: "Arabic",
    ja: "Japanese",
    pt: "Portuguese",
};

const LOCALE_ALIASES: Record<string, SupportedLanguage> = {
    en: "en",
    "en-us": "en",
    "en-gb": "en",
    hi: "hi",
    "hi-in": "hi",
    es: "es",
    "es-es": "es",
    "es-mx": "es",
    fr: "fr",
    "fr-fr": "fr",
    de: "de",
    "de-de": "de",
    ar: "ar",
    "ar-sa": "ar",
    ja: "ja",
    "ja-jp": "ja",
    pt: "pt",
    "pt-br": "pt",
    "pt-pt": "pt",
};

const TRANSLATION_HINTS: Record<SupportedLanguage, Record<string, string>> = {
    en: {},
    hi: { "Welcome": "स्वागत", "Dashboard": "डैशबोर्ड", "Client Portal": "क्लाइंट पोर्टल" },
    es: { "Welcome": "Bienvenido", "Dashboard": "Panel", "Client Portal": "Portal del Cliente" },
    fr: { "Welcome": "Bienvenue", "Dashboard": "Tableau de bord", "Client Portal": "Portail Client" },
    de: { "Welcome": "Willkommen", "Dashboard": "Dashboard", "Client Portal": "Kundenportal" },
    ar: { "Welcome": "مرحباً", "Dashboard": "لوحة التحكم", "Client Portal": "بوابة العميل" },
    ja: { "Welcome": "ようこそ", "Dashboard": "ダッシュボード", "Client Portal": "クライアントポータル" },
    pt: { "Welcome": "Bem-vindo", "Dashboard": "Painel", "Client Portal": "Portal do Cliente" },
};

export function resolveLocale(
    preferences: GciPreferences,
    clientId?: string,
    browserLocale?: string,
): SupportedLanguage {
    if (clientId && preferences.clientLocaleOverrides?.[clientId]) {
        return preferences.clientLocaleOverrides[clientId];
    }
    if (preferences.autoDetect && browserLocale) {
        const normalized = browserLocale.toLowerCase();
        if (LOCALE_ALIASES[normalized]) return LOCALE_ALIASES[normalized];
        const prefix = normalized.split("-")[0];
        if (LOCALE_ALIASES[prefix]) return LOCALE_ALIASES[prefix];
    }
    return preferences.preferredLanguage;
}

export function translateContent(
    content: string,
    title: string,
    targetLocale: SupportedLanguage,
    sourceLocale: SupportedLanguage = "en",
): { title: string; body: string; translated: boolean } {
    if (targetLocale === sourceLocale) {
        return { title, body: content, translated: false };
    }

    const hints = TRANSLATION_HINTS[targetLocale];
    let translatedTitle = title;
    let translatedBody = content;

    for (const [en, localized] of Object.entries(hints)) {
        translatedTitle = translatedTitle.replace(new RegExp(en, "g"), localized);
        translatedBody = translatedBody.replace(new RegExp(en, "g"), localized);
    }

    const localeTag = `[${targetLocale.toUpperCase()}]`;
    if (translatedTitle === title && translatedBody === content) {
        translatedTitle = `${localeTag} ${title}`;
        translatedBody = `${localeTag} ${content}`;
    }

    return { title: translatedTitle, body: translatedBody, translated: true };
}

export function defaultGciPreferences(): GciPreferences {
    return {
        preferredLanguage: "en",
        fallbackLanguage: "en",
        autoDetect: true,
        clientLocaleOverrides: {},
    };
}
