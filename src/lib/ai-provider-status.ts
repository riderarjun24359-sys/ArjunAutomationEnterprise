/**
 * Local-first AI provider status.
 *
 * Gemini / external LLM providers are OPTIONAL. The application must build,
 * start, and serve all non-generative features with zero AI credentials.
 *
 * - `local` is always available: deterministic, rule-based summaries computed
 *   from live Supabase data (see ai-executive-insights.service). It performs
 *   no network calls and never fabricates findings.
 * - External providers (`gemini`, `openai`, `anthropic`, `azure`, `google`)
 *   are enabled ONLY when the operator explicitly sets their key. Missing keys
 *   report a disabled state instead of throwing at startup/build.
 *
 * No Ollama adapter exists in this repository (verified 2026-10-10), so the
 * local deterministic fallback below is the zero-dependency default. Do not
 * add a duplicate Ollama adapter without removing this fallback first.
 */

export type AiProviderId = "local" | "gemini" | "openai" | "anthropic" | "azure" | "google";

export interface AiProviderStatus {
    id: AiProviderId;
    label: string;
    /** True when this provider can be used right now. */
    enabled: boolean;
    /** True when credentials (if any are required) are present. */
    configured: boolean;
    /** True when a key must be set before use. Always false for `local`. */
    requiresKey: boolean;
    /** Env var that enables this provider, if any. */
    envVar: string | null;
    /** Human-readable state for dashboards, logs, and health endpoints. Never includes secret values. */
    detail: string;
}

export interface AiStatusReport {
    providers: AiProviderStatus[];
    /** The provider the app will use for generative work, or `local` fallback. */
    activeProvider: AiProviderId;
    /** True when at least the local deterministic fallback is available (always true). */
    aiAvailable: boolean;
    /** True when at least one external LLM is configured. */
    externalLlmAvailable: boolean;
    /** Machine-readable reason when external LLM work is unavailable. */
    disabledReason: string | null;
}

function envPresent(env: NodeJS.ProcessEnv, key: string): boolean {
    return Boolean(env[key]?.trim());
}

export function getAiProviderStatus(env: NodeJS.ProcessEnv = process.env): AiStatusReport {
    const geminiConfigured = envPresent(env, "GEMINI_API_KEY") || envPresent(env, "GOOGLE_GENERATIVE_AI_API_KEY");
    const openaiConfigured = envPresent(env, "OPENAI_API_KEY");
    const anthropicConfigured = envPresent(env, "ANTHROPIC_API_KEY");
    const azureConfigured = envPresent(env, "AZURE_OPENAI_API_KEY");
    const googleConfigured = envPresent(env, "GOOGLE_AI_API_KEY") || geminiConfigured;

    const providers: AiProviderStatus[] = [
        {
            id: "local",
            label: "Local deterministic (no API key)",
            enabled: true,
            configured: true,
            requiresKey: false,
            envVar: null,
            detail: "Rule-based summaries from live data only; no external LLM call.",
        },
        {
            id: "gemini",
            label: "Google Gemini (optional)",
            enabled: geminiConfigured,
            configured: geminiConfigured,
            requiresKey: true,
            envVar: "GEMINI_API_KEY",
            detail: geminiConfigured
                ? "Gemini key present; operator opted in to external generation."
                : "GEMINI_API_KEY not set — external Gemini generation disabled; local fallback active.",
        },
        {
            id: "openai",
            label: "OpenAI (optional)",
            enabled: openaiConfigured,
            configured: openaiConfigured,
            requiresKey: true,
            envVar: "OPENAI_API_KEY",
            detail: openaiConfigured
                ? "OpenAI key present; operator opted in."
                : "OPENAI_API_KEY not set — OpenAI provider disabled.",
        },
        {
            id: "anthropic",
            label: "Anthropic (optional)",
            enabled: anthropicConfigured,
            configured: anthropicConfigured,
            requiresKey: true,
            envVar: "ANTHROPIC_API_KEY",
            detail: anthropicConfigured
                ? "Anthropic key present; operator opted in."
                : "ANTHROPIC_API_KEY not set — Anthropic provider disabled.",
        },
        {
            id: "azure",
            label: "Azure OpenAI (optional)",
            enabled: azureConfigured,
            configured: azureConfigured,
            requiresKey: true,
            envVar: "AZURE_OPENAI_API_KEY",
            detail: azureConfigured
                ? "Azure OpenAI key present; operator opted in."
                : "AZURE_OPENAI_API_KEY not set — Azure provider disabled.",
        },
        {
            id: "google",
            label: "Google AI (optional)",
            enabled: googleConfigured,
            configured: googleConfigured,
            requiresKey: true,
            envVar: "GOOGLE_AI_API_KEY",
            detail: googleConfigured
                ? "Google AI key present; operator opted in."
                : "GOOGLE_AI_API_KEY not set — Google AI provider disabled.",
        },
    ];

    const firstExternal = providers.find((p) => p.id !== "local" && p.enabled)?.id ?? null;
    return {
        providers,
        activeProvider: firstExternal ?? "local",
        aiAvailable: true,
        externalLlmAvailable: firstExternal !== null,
        disabledReason: firstExternal
            ? null
            : "no-external-llm-configured: using local deterministic fallback; set GEMINI_API_KEY (or another provider key) to enable external generation",
    };
}

/**
 * Returns true only when the operator explicitly enabled Gemini.
 * Use for provider-specific gates; never gate general build/readiness on this.
 */
export function isGeminiEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
    return envPresent(env, "GEMINI_API_KEY") || envPresent(env, "GOOGLE_GENERATIVE_AI_API_KEY");
}

/**
 * Describe AI availability without leaking secrets. Safe to log.
 */
export function describeAiStatus(env: NodeJS.ProcessEnv = process.env): string {
    const report = getAiProviderStatus(env);
    if (report.externalLlmAvailable) return `ai:active-provider=${report.activeProvider}`;
    return "ai:local-fallback (no external LLM configured)";
}
