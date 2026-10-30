import {
    EI_CALENDAR_PROVIDERS,
    EI_PAYMENT_PROVIDERS,
    EI_SOCIAL_PLATFORMS,
    type EiCalendarProvider,
    type EiPaymentProvider,
    type EiSocialPlatform,
} from "../constants";
import type {
    AiProviderCenter,
    CalendarProductivityBoard,
    CloudStorageBoard,
    EmailIntegrationBoard,
    EnterpriseIntegrationsRawData,
    EnterpriseIntegrationsSnapshot,
    ExecutiveIntegrationDashboard,
    IntegrationHealthDashboard,
    PaymentIntegrationCenter,
    SecretsManagerBoard,
    SocialPublishingHub,
    WebhookManagerBoard,
} from "../types";

function money(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export function classifySocialPlatform(type: string, name = ""): EiSocialPlatform | null {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("linkedin")) return "linkedin";
    if (s.includes("facebook") || s.includes("meta")) return "facebook";
    if (s.includes("instagram") || s.includes("ig ")) return "instagram";
    if (s.includes("twitter") || s.includes(" x ") || s === "x" || s.startsWith("x ") || s.includes("x.com")) {
        return "x";
    }
    if (s.includes("youtube") || s.includes("yt ")) return "youtube";
    return null;
}

export function classifyPaymentProvider(type: string, name = ""): EiPaymentProvider | "other" {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("stripe")) return "stripe";
    if (s.includes("razorpay") || s.includes("razor")) return "razorpay";
    return "other";
}

export function classifyCalendarProvider(type: string, name = ""): EiCalendarProvider | null {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("google") || s.includes("gcal")) return "google_calendar";
    if (s.includes("outlook") || s.includes("microsoft") || s.includes("office365") || s.includes("graph")) {
        return "outlook";
    }
    return null;
}

export function isAiProvider(type: string, name = ""): boolean {
    const s = `${type} ${name}`.toLowerCase();
    return (
        s.includes("openai")
        || s.includes("anthropic")
        || s.includes("claude")
        || s.includes("gemini")
        || s.includes("llm")
        || s.includes("ai provider")
        || s.includes("gpt")
    );
}

export function isStorageProvider(type: string, name = "", category = ""): boolean {
    const s = `${type} ${name} ${category}`.toLowerCase();
    return (
        s.includes("storage")
        || s.includes("s3")
        || s.includes("gcs")
        || s.includes("blob")
        || s.includes("drive")
        || s.includes("bucket")
        || s.includes("asset")
    );
}

export function secretRotationHealth(
    rotationDueAt: string | null,
    status: string,
): "healthy" | "rotate_soon" | "overdue" | "unknown" {
    if (/revok|disabled|expired/i.test(status)) return "overdue";
    if (!rotationDueAt) return "unknown";
    const t = new Date(rotationDueAt).getTime();
    if (!Number.isFinite(t)) return "unknown";
    const days = (t - Date.now()) / 86_400_000;
    if (days < 0) return "overdue";
    if (days <= 30) return "rotate_soon";
    return "healthy";
}

export const eiPure = {
    money,
    avg,
    classifySocialPlatform,
    classifyPaymentProvider,
    classifyCalendarProvider,
    isAiProvider,
    isStorageProvider,
    secretRotationHealth,
};

export function buildAiProviderCenter(data: EnterpriseIntegrationsRawData): AiProviderCenter {
    const openaiEnv = data.envHealth.find((e) => e.key === "OPENAI_API_KEY")?.configured ?? false;
    const aiServices = data.connectedServices.filter((s) => isAiProvider(s.provider_type, s.service_name));
    const aiConfigs = data.connectorConfigs.filter((c) => isAiProvider(c.provider_type, c.config_name));

    const rowsFromAgents = data.aiAgents.map((a) => {
        const usage = data.apiUsage.find((u) => /openai|ai|llm|chat|complet/i.test(u.endpoint)) 
            ?? data.apiUsage[0];
        const requests = usage?.request_count ?? Math.max(1, a.max_tokens / 1000);
        const errors = usage?.error_count ?? 0;
        const costPer1k = /gpt-4|opus|sonnet/i.test(a.model) ? 0.03 : 0.002;
        return {
            id: a.id,
            name: a.name,
            provider: /openai|gpt/i.test(a.model) ? "openai" : "multi-provider",
            model: a.model,
            status: a.status,
            usageRequests: requests,
            errorCount: errors,
            estimatedCostUsd: money((a.max_tokens / 1000) * costPer1k * Math.max(1, requests / 100)),
            rateLimitRpm: data.rateLimits[0]?.rate_limit_rpm ?? 60,
        };
    });

    const rowsFromServices = aiServices.map((s) => ({
        id: s.id,
        name: s.service_name,
        provider: /openai/i.test(s.provider_type) ? "openai" : s.provider_type,
        model: aiConfigs.find((c) => c.provider_type === s.provider_type)?.api_version || "default",
        status: s.connector_status || s.status,
        usageRequests: data.apiUsage.reduce((sum, u) => sum + u.request_count, 0),
        errorCount: data.apiUsage.reduce((sum, u) => sum + u.error_count, 0),
        estimatedCostUsd: money(data.apiUsage.reduce((sum, u) => sum + u.request_count, 0) * 0.002),
        rateLimitRpm: data.rateLimits[0]?.rate_limit_rpm ?? 60,
    }));

    const rows = rowsFromAgents.length ? rowsFromAgents : rowsFromServices;
    if (openaiEnv && !rows.some((r) => r.provider === "openai")) {
        rows.push({
            id: "openai-env",
            name: "OpenAI (environment)",
            provider: "openai",
            model: "env-configured",
            status: "ready",
            usageRequests: data.apiUsage.reduce((s, u) => s + u.request_count, 0),
            errorCount: data.apiUsage.reduce((s, u) => s + u.error_count, 0),
            estimatedCostUsd: money(data.apiUsage.reduce((s, u) => s + u.request_count, 0) * 0.002),
            rateLimitRpm: data.rateLimits[0]?.rate_limit_rpm ?? 60,
        });
    }

    return {
        rows,
        openaiConfigured: openaiEnv || rows.some((r) => r.provider === "openai"),
        multiProviderReady: rows.length > 1 || aiServices.length + data.aiAgents.length > 1,
        totalUsage: rows.reduce((s, r) => s + r.usageRequests, 0),
        totalCostUsd: money(rows.reduce((s, r) => s + r.estimatedCostUsd, 0)),
        rateLimitMonitors: data.rateLimits.map((r) => ({
            name: r.limit_name,
            rpm: r.rate_limit_rpm,
            status: r.status,
        })),
    };
}

export function buildSecretsManager(data: EnterpriseIntegrationsRawData): SecretsManagerBoard {
    const vaultSecrets = data.secrets.map((s) => ({
        id: s.id,
        name: s.secret_name,
        vaultRef: s.vault_ref ? `${s.vault_ref.slice(0, 8)}…` : "vault",
        status: s.secret_status || s.status,
        rotationDueAt: s.rotation_due_at || "",
        health: secretRotationHealth(s.rotation_due_at, s.secret_status || s.status),
    }));

    // Surface API key metadata without exposing hashes
    const apiKeys = data.apiKeys.map((k) => ({
        id: k.id,
        name: k.key_name,
        prefix: k.key_prefix,
        status: k.status,
        lastUsedAt: k.last_used_at || "",
        expiresAt: k.expires_at || "",
    }));

    const rotationReminders =
        vaultSecrets.filter((s) => s.health === "rotate_soon" || s.health === "overdue").length
        + apiKeys.filter((k) => {
            if (!k.expiresAt) return false;
            const t = new Date(k.expiresAt).getTime();
            return Number.isFinite(t) && t - Date.now() < 86_400_000 * 30;
        }).length;

    return {
        vaultSecrets,
        apiKeys,
        envHealth: data.envHealth,
        envConfiguredCount: data.envHealth.filter((e) => e.configured).length,
        rotationReminders,
    };
}

export function buildEmailIntegration(data: EnterpriseIntegrationsRawData): EmailIntegrationBoard {
    const emailChannels = data.emailChannels.filter((c) =>
        /email|smtp|mail/i.test(`${c.channel_type} ${c.channel_name}`),
    );
    const channels = (emailChannels.length ? emailChannels : data.emailChannels).map((c) => ({
        id: c.id,
        name: c.channel_name,
        type: c.channel_type,
        enabled: c.is_enabled,
        status: c.status,
    }));

    const smtpEnv =
        (data.envHealth.find((e) => e.key === "SMTP_HOST")?.configured ?? false)
        && (data.envHealth.find((e) => e.key === "SMTP_USER")?.configured ?? false);

    return {
        channels,
        smtpArchitecture: smtpEnv || channels.some((c) => /smtp|email/i.test(c.type)),
        deliveryLogs: data.emailQueue.slice(0, 40).map((q) => ({
            id: q.id,
            recipient: q.recipient,
            subject: q.subject,
            status: q.delivery_status || q.status,
            deliveredAt: q.delivered_at || "",
            failure: q.failure_reason,
        })),
        retryQueue:
            data.emailQueue.filter((q) => q.retry_count > 0 || /retry|pending|queued/i.test(q.delivery_status)).length
            + data.deliveryFailures.length,
        templates: data.emailTemplates.map((t) => ({
            id: t.id,
            name: t.template_name,
            status: t.status,
        })),
    };
}

export function buildSocialPublishingHub(data: EnterpriseIntegrationsRawData): SocialPublishingHub {
    const accounts: SocialPublishingHub["accounts"] = [];

    for (const s of [...data.connectedServices, ...data.marketplace.map((m) => ({
        id: m.id,
        service_name: m.connector_name,
        provider_type: m.provider_type,
        connector_status: m.status,
        credentials_ref: "",
        status: m.status,
    }))]) {
        const platform = classifySocialPlatform(s.provider_type, s.service_name);
        if (!platform) continue;
        accounts.push({
            platform,
            name: s.service_name,
            status: s.connector_status || s.status,
            architecture: "official integration architecture",
        });
    }

    for (const platform of EI_SOCIAL_PLATFORMS) {
        if (!accounts.some((a) => a.platform === platform)) {
            accounts.push({
                platform,
                name: `${platform} architecture`,
                status: "ready",
                architecture: "provider-agnostic publishing slot",
            });
        }
    }

    return {
        accounts,
        byPlatform: EI_SOCIAL_PLATFORMS.map((platform) => ({
            platform,
            count: accounts.filter((a) => a.platform === platform).length,
        })),
        publishingQueue: data.installations.map((i) => ({
            id: i.id,
            name: i.installation_key,
            status: i.connector_status || i.status,
            detail: "marketplace installation",
        })),
        deliveryHistory: data.webhookDeliveryLogs.slice(0, 30).map((l) => ({
            id: l.id,
            event: l.event_type,
            status: l.delivery_status,
            at: l.delivered_at || "",
        })),
    };
}

export function buildPaymentIntegrationCenter(data: EnterpriseIntegrationsRawData): PaymentIntegrationCenter {
    const connectors = data.paymentConnectors.map((p) => ({
        id: p.id,
        name: p.connector_name,
        provider: classifyPaymentProvider(p.provider_type, p.connector_name),
        status: p.connector_status || p.status,
    }));

    for (const provider of EI_PAYMENT_PROVIDERS) {
        if (!connectors.some((c) => c.provider === provider)) {
            const envOk =
                provider === "stripe"
                    ? data.envHealth.find((e) => e.key === "STRIPE_SECRET_KEY")?.configured
                    : data.envHealth.find((e) => e.key === "RAZORPAY_KEY_ID")?.configured;
            connectors.push({
                id: `arch-${provider}`,
                name: `${provider} architecture`,
                provider,
                status: envOk ? "env-ready" : "architecture",
            });
        }
    }

    return {
        connectors,
        stripeArchitecture: connectors.some((c) => c.provider === "stripe"),
        razorpayArchitecture: connectors.some((c) => c.provider === "razorpay"),
        webhooksMonitored:
            data.incomingWebhooks.filter((w) => /stripe|razorpay|payment/i.test(`${w.provider_type} ${w.webhook_name}`))
                .length || data.incomingWebhooks.length,
        paymentEvents: data.paymentTransactions.map((t) => ({
            id: t.id,
            provider: t.provider_type,
            amount: money(t.amount),
            currency: t.currency,
            status: t.transaction_status || t.status,
            at: t.processed_at || "",
        })),
        retryQueue: data.paymentRetries.length,
    };
}

export function buildCalendarProductivity(data: EnterpriseIntegrationsRawData): CalendarProductivityBoard {
    const providers: CalendarProductivityBoard["providers"] = [];
    for (const s of data.connectedServices) {
        const provider = classifyCalendarProvider(s.provider_type, s.service_name);
        if (!provider) continue;
        providers.push({
            provider,
            name: s.service_name,
            status: s.connector_status || s.status,
            architecture: "live connector",
        });
    }
    for (const provider of EI_CALENDAR_PROVIDERS) {
        if (!providers.some((p) => p.provider === provider)) {
            providers.push({
                provider,
                name: `${provider} architecture`,
                status: "ready",
                architecture: "provider-agnostic calendar slot",
            });
        }
    }

    return {
        providers,
        googleArchitecture: providers.some((p) => p.provider === "google_calendar"),
        outlookArchitecture: providers.some((p) => p.provider === "outlook"),
        meetings: data.marketplace
            .filter((m) => /calendar|meeting|schedule/i.test(`${m.category} ${m.connector_name}`))
            .map((m) => ({
                id: m.id,
                name: m.connector_name,
                status: m.status,
                detail: m.description || m.category,
            })),
        reminders: data.retryPolicies.length + data.emailQueue.filter((q) => /remind/i.test(q.subject)).length,
    };
}

export function buildCloudStorage(data: EnterpriseIntegrationsRawData): CloudStorageBoard {
    const storageServices = data.connectedServices.filter((s) =>
        isStorageProvider(s.provider_type, s.service_name),
    );
    const storageMarket = data.marketplace.filter((m) =>
        isStorageProvider(m.provider_type, m.connector_name, m.category),
    );

    return {
        abstractionReady: true,
        uploads: [...storageServices, ...storageMarket.map((m) => ({
            id: m.id,
            service_name: m.connector_name,
            provider_type: m.provider_type,
            connector_status: m.status,
            credentials_ref: "",
            status: m.status,
        }))].map((s) => ({
            id: s.id,
            name: s.service_name,
            status: s.connector_status || s.status,
            detail: s.provider_type,
        })),
        assetLibrary: data.marketplace
            .filter((m) => /asset|media|file|storage/i.test(`${m.category} ${m.connector_name}`))
            .map((m) => ({
                id: m.id,
                name: m.connector_name,
                category: m.category || "storage",
                status: m.status,
            })),
        storageUsageScore: avg(data.connectorHealth.map((h) => h.health_score)),
    };
}

export function buildWebhookManager(data: EnterpriseIntegrationsRawData): WebhookManagerBoard {
    return {
        incoming: data.incomingWebhooks.map((w) => ({
            id: w.id,
            name: w.webhook_name,
            path: w.endpoint_path,
            enabled: w.is_enabled,
            signatureValidation: Boolean(w.webhook_signing_key_hash),
            status: w.status,
        })),
        outgoing: data.outgoingWebhooks.map((w) => ({
            id: w.id,
            name: w.webhook_name,
            target: w.target_url,
            enabled: w.is_enabled,
            signatureValidation: Boolean(w.webhook_signing_key_hash),
            status: w.status,
        })),
        retryPolicy: [
            ...data.retryPolicies.map((p) => ({
                id: p.id,
                name: p.policy_name,
                status: p.status,
                detail: `max_retries ${p.max_retries}`,
            })),
            ...data.webhookDeadLetters.map((d) => ({
                id: d.id,
                name: d.event_type,
                status: d.status,
                detail: `retries ${d.retry_count} · ${d.last_error}`,
            })),
        ],
        eventLogs: data.webhookDeliveryLogs.map((l) => ({
            id: l.id,
            event: l.event_type,
            httpStatus: l.http_status,
            status: l.delivery_status,
            latencyMs: l.latency_ms,
            at: l.delivered_at || "",
        })),
        deadLetters: data.webhookDeadLetters.length,
    };
}

export function buildIntegrationHealthDashboard(data: EnterpriseIntegrationsRawData): IntegrationHealthDashboard {
    const health = data.integrationHealth[0];
    const metric = data.integrationMetrics[0];
    return {
        connectedServices: health?.active_connectors ?? data.connectedServices.length,
        syncStatus: data.accountingSync.map((s) => ({
            id: s.id,
            entity: s.entity_type,
            status: s.sync_status || s.status,
            lastSyncAt: s.last_sync_at || "",
            records: s.records_synced,
        })),
        errorMonitoring: data.integrationFailures.length + data.deliveryFailures.length,
        uptimePercent: health?.uptime_percent ?? null,
        latencyP95Ms: avg(data.latencyMetrics.map((l) => l.p95_ms).filter((n) => n > 0))
            ?? avg(data.paymentHealth.map((p) => p.latency_ms).filter((n) => n > 0)),
        overallScore: health?.overall_score ?? metric?.overall_success_rate ?? avg(data.connectorHealth.map((h) => h.health_score)),
    };
}

export function buildExecutiveIntegrationDashboard(
    data: EnterpriseIntegrationsRawData,
): ExecutiveIntegrationDashboard {
    const ai = buildAiProviderCenter(data);
    const health = buildIntegrationHealthDashboard(data);
    const payments = buildPaymentIntegrationCenter(data);
    const failures = data.integrationFailures.length + data.webhookDeadLetters.length + payments.retryQueue;

    const recommendations = [
        ai.openaiConfigured
            ? "OpenAI provider configured — monitor rate limits and token cost."
            : "Configure OPENAI_API_KEY via environment for AI execution.",
        health.overallScore != null && health.overallScore < 80
            ? "Integration health below target — review degraded connectors."
            : "Integration health within acceptable range.",
        failures > 0
            ? `${failures} failure/retry signals — prioritize dead-letter and payment retry queues.`
            : "No active failure backlog detected.",
        data.envHealth.filter((e) => !e.configured).length
            ? `Missing env secrets: ${data.envHealth.filter((e) => !e.configured).map((e) => e.key).join(", ")}.`
            : "All tracked environment secrets are present.",
        buildSecretsManager(data).rotationReminders > 0
            ? "Rotate vault secrets approaching expiry."
            : "Secret rotation schedule is healthy.",
    ];

    return {
        aiUsage: ai.totalUsage,
        integrationHealth: health.overallScore,
        costOverviewUsd: money(ai.totalCostUsd + payments.paymentEvents.reduce((s, e) => s + e.amount, 0) * 0.01),
        failureAlerts: failures,
        recommendations,
        summary:
            data.integrationHealth[0]?.summary
            || `AI usage ${ai.totalUsage}, health ${health.overallScore ?? "—"}, cost ₹${ai.totalCostUsd}.`,
    };
}

export function createEmptyEnterpriseIntegrationsSnapshot(
    accessGranted: boolean,
    reason?: string,
): EnterpriseIntegrationsSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason: reason,
        fetchedAt: new Date().toISOString(),
        aiProviders: {
            rows: [],
            openaiConfigured: false,
            multiProviderReady: false,
            totalUsage: 0,
            totalCostUsd: 0,
            rateLimitMonitors: [],
        },
        secrets: {
            vaultSecrets: [],
            apiKeys: [],
            envHealth: [],
            envConfiguredCount: 0,
            rotationReminders: 0,
        },
        email: {
            channels: [],
            smtpArchitecture: false,
            deliveryLogs: [],
            retryQueue: 0,
            templates: [],
        },
        social: {
            accounts: [],
            byPlatform: EI_SOCIAL_PLATFORMS.map((platform) => ({ platform, count: 0 })),
            publishingQueue: [],
            deliveryHistory: [],
        },
        payments: {
            connectors: [],
            stripeArchitecture: false,
            razorpayArchitecture: false,
            webhooksMonitored: 0,
            paymentEvents: [],
            retryQueue: 0,
        },
        calendar: {
            providers: [],
            googleArchitecture: false,
            outlookArchitecture: false,
            meetings: [],
            reminders: 0,
        },
        storage: {
            abstractionReady: true,
            uploads: [],
            assetLibrary: [],
            storageUsageScore: null,
        },
        webhooks: {
            incoming: [],
            outgoing: [],
            retryPolicy: [],
            eventLogs: [],
            deadLetters: 0,
        },
        health: {
            connectedServices: 0,
            syncStatus: [],
            errorMonitoring: 0,
            uptimePercent: null,
            latencyP95Ms: null,
            overallScore: null,
        },
        executive: {
            aiUsage: 0,
            integrationHealth: null,
            costOverviewUsd: 0,
            failureAlerts: 0,
            recommendations: [],
            summary: "",
        },
    };
}

export function buildEnterpriseIntegrationsSnapshot(
    data: EnterpriseIntegrationsRawData,
): EnterpriseIntegrationsSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        aiProviders: buildAiProviderCenter(data),
        secrets: buildSecretsManager(data),
        email: buildEmailIntegration(data),
        social: buildSocialPublishingHub(data),
        payments: buildPaymentIntegrationCenter(data),
        calendar: buildCalendarProductivity(data),
        storage: buildCloudStorage(data),
        webhooks: buildWebhookManager(data),
        health: buildIntegrationHealthDashboard(data),
        executive: buildExecutiveIntegrationDashboard(data),
    };
}
