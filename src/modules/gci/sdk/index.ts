import { gciService } from "../services/gci.service";
import type {
    GciEmailContent,
    GciNotificationContent,
    GciPortalContent,
    GciPreferences,
    LocalizedContent,
    SupportedLanguage,
    TranslateContentInput,
    TranslateContentResult,
} from "../types";

export class GciClient {
    getPreferences(): GciPreferences {
        return gciService.getPreferences();
    }

    setPreferences(prefs: Partial<GciPreferences>): GciPreferences {
        return gciService.setPreferences(prefs);
    }

    setClientLocale(clientId: string, locale: SupportedLanguage): GciPreferences {
        return gciService.setClientLocale(clientId, locale);
    }

    translate(input: TranslateContentInput): TranslateContentResult {
        return gciService.translate(input);
    }

    resolveClientLocale(clientId: string, browserLocale?: string): SupportedLanguage {
        return gciService.resolveClientLocale(clientId, browserLocale);
    }

    buildPortalContent(clientId: string, locale?: SupportedLanguage): GciPortalContent {
        return gciService.buildPortalContent(clientId, locale);
    }

    buildEmailContent(templateId: string, locale: SupportedLanguage, vars: Record<string, string>): GciEmailContent {
        return gciService.buildEmailContent(templateId, locale, vars);
    }

    buildNotification(
        title: string,
        message: string,
        locale: SupportedLanguage,
        channel: GciNotificationContent["channel"],
    ): GciNotificationContent {
        return gciService.buildNotification(title, message, locale, channel);
    }

    buildDocumentContent(title: string, content: string, locale: SupportedLanguage): LocalizedContent {
        return gciService.buildDocumentContent(title, content, locale);
    }

    buildAssistantContent(clientId: string, query: string, locale?: SupportedLanguage): LocalizedContent {
        return gciService.buildAssistantContent(clientId, query, locale);
    }
}

export function createGciClient(): GciClient {
    return new GciClient();
}

export { gciService };
