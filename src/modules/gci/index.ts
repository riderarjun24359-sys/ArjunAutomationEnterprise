export { createGciClient, gciService } from "./sdk";
export { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, translateContent, resolveLocale, defaultGciPreferences } from "./lib/localization";
export type {
    SupportedLanguage,
    LocalizedContent,
    GciPreferences,
    GciPortalContent,
    GciEmailContent,
    GciNotificationContent,
    TranslateContentInput,
    TranslateContentResult,
} from "./types";
