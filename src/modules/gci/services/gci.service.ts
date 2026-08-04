import { defaultGciPreferences, resolveLocale, translateContent } from "../lib/localization";
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

export class GciService {
    private preferences: GciPreferences = defaultGciPreferences();

    getPreferences(): GciPreferences {
        return { ...this.preferences };
    }

    setPreferences(prefs: Partial<GciPreferences>): GciPreferences {
        this.preferences = { ...this.preferences, ...prefs };
        return this.getPreferences();
    }

    setClientLocale(clientId: string, locale: SupportedLanguage): GciPreferences {
        this.preferences.clientLocaleOverrides = {
            ...this.preferences.clientLocaleOverrides,
            [clientId]: locale,
        };
        return this.getPreferences();
    }

    translate(input: TranslateContentInput): TranslateContentResult {
        const result = translateContent(
            input.content,
            input.title ?? "",
            input.targetLocale,
            input.sourceLocale ?? "en",
        );
        return { locale: input.targetLocale, ...result };
    }

    resolveClientLocale(clientId: string, browserLocale?: string): SupportedLanguage {
        return resolveLocale(this.preferences, clientId, browserLocale);
    }

    buildPortalContent(clientId: string, locale?: SupportedLanguage): GciPortalContent {
        const resolved = locale ?? this.resolveClientLocale(clientId);
        const dashboard = this.translate({
            content: "Your client success dashboard with progress, files, and approvals.",
            title: "Client Portal Dashboard",
            targetLocale: resolved,
        });
        return {
            clientId,
            locale: resolved,
            dashboard: { locale: resolved, title: dashboard.title, body: dashboard.body },
            notifications: [
                this.buildLocalized(resolved, "Onboarding Complete", "AI onboarding analysis finished."),
                this.buildLocalized(resolved, "Milestone Ready", "Next delivery milestone is ready for review."),
            ],
            documents: [
                this.buildLocalized(resolved, "Statement of Work", "Project scope and deliverables."),
                this.buildLocalized(resolved, "Proposal", "Commercial proposal and pricing."),
            ],
            assistantPrompt: `Assist client ${clientId} in ${resolved} with onboarding, delivery, and renewal.`,
        };
    }

    buildEmailContent(templateId: string, locale: SupportedLanguage, vars: Record<string, string>): GciEmailContent {
        const subject = this.translate({
            content: "",
            title: vars.subject ?? "Client Success Update",
            targetLocale: locale,
        }).title;
        const body = this.translate({
            content: vars.body ?? "Your project update is ready for review.",
            title: "",
            targetLocale: locale,
        }).body;
        return { subject, body, locale, templateId };
    }

    buildNotification(
        title: string,
        message: string,
        locale: SupportedLanguage,
        channel: GciNotificationContent["channel"],
    ): GciNotificationContent {
        const t = this.translate({ content: message, title, targetLocale: locale });
        return { id: `gci-notif-${Date.now()}`, title: t.title, message: t.body, locale, channel };
    }

    buildDocumentContent(title: string, content: string, locale: SupportedLanguage): LocalizedContent {
        const t = this.translate({ content, title, targetLocale: locale });
        return { locale, title: t.title, body: t.body };
    }

    buildAssistantContent(clientId: string, query: string, locale?: SupportedLanguage): LocalizedContent {
        const resolved = locale ?? this.resolveClientLocale(clientId);
        return this.buildDocumentContent(
            "AI Success Manager",
            `Response for "${query}" — personalized guidance for client ${clientId}.`,
            resolved,
        );
    }

    private buildLocalized(locale: SupportedLanguage, title: string, body: string): LocalizedContent {
        const t = this.translate({ content: body, title, targetLocale: locale });
        return { locale, title: t.title, body: t.body };
    }
}

export const gciService = new GciService();
