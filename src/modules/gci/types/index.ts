export type SupportedLanguage = "en" | "hi" | "es" | "fr" | "de" | "ar" | "ja" | "pt";

export interface LocalizedContent {
    locale: SupportedLanguage;
    title: string;
    body: string;
    metadata?: Record<string, string>;
}

export interface GciPreferences {
    preferredLanguage: SupportedLanguage;
    fallbackLanguage: SupportedLanguage;
    autoDetect: boolean;
    clientLocaleOverrides?: Record<string, SupportedLanguage>;
}

export interface GciPortalContent {
    clientId: string;
    locale: SupportedLanguage;
    dashboard: LocalizedContent;
    notifications: LocalizedContent[];
    documents: LocalizedContent[];
    assistantPrompt: string;
}

export interface GciEmailContent {
    subject: string;
    body: string;
    locale: SupportedLanguage;
    templateId: string;
}

export interface GciNotificationContent {
    id: string;
    title: string;
    message: string;
    locale: SupportedLanguage;
    channel: "email" | "portal" | "push" | "sms";
}

export interface TranslateContentInput {
    content: string;
    title?: string;
    targetLocale: SupportedLanguage;
    sourceLocale?: SupportedLanguage;
}

export interface TranslateContentResult {
    locale: SupportedLanguage;
    title: string;
    body: string;
    translated: boolean;
}
