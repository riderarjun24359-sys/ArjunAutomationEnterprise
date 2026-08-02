"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AGENT_TYPE_OPTIONS, AI_PERMISSIONS, MODULE_SOURCE_OPTIONS, PROVIDER_KEY_OPTIONS, ROUTING_STRATEGY_OPTIONS } from "@/src/modules/ai-orchestration/constants";
import type { useAiOrchestration } from "@/src/modules/ai-orchestration/hooks/useAiOrchestration";
import {
    agentFormSchema, modelRouteFormSchema, permissionGrantFormSchema, promptTemplateFormSchema, providerFormSchema, rateLimitFormSchema, retryPolicyFormSchema, sessionFormSchema, taskFormSchema,
    type AgentFormValues, type ModelRouteFormValues, type PermissionGrantFormValues, type PromptTemplateFormValues, type ProviderFormValues, type RateLimitFormValues, type RetryPolicyFormValues, type SessionFormValues, type TaskFormValues,
} from "@/src/modules/ai-orchestration/schemas";

type AiData = ReturnType<typeof useAiOrchestration>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-violet-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-violet-600">{meta}</p> : null}</div>;
}

export function AiOverviewPanel({ data }: { data: AiData }) {
    const links = data.crossModuleLinks;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Orchestration summary" description="Core AI infrastructure metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Providers" subtitle={`${data.stats?.totalProviders ?? 0} registered`} />
                <ListCard title="Agents" subtitle={`${data.stats?.activeAgents ?? 0} active`} />
                <ListCard title="Tasks" subtitle={`${data.stats?.pendingTasks ?? 0} pending`} />
                <ListCard title="Tokens" subtitle={`${(data.stats?.totalTokens ?? 0).toLocaleString()} used`} />
            </div></Card>
            <Card hover><SectionHeader title="Cross-module integration" description="AI sessions across CRM, Projects, Finance, HR, Inventory, Sales, Support, Documents, Automation, Analytics, Settings" /><div className="mt-6 space-y-3">
                {links ? (<>
                    <ListCard title="CRM" subtitle={`${links.crmSessions} sessions`} meta="Client intelligence" />
                    <ListCard title="Projects" subtitle={`${links.projectSessions} sessions`} meta="Delivery orchestration" />
                    <ListCard title="Finance" subtitle={`${links.financeSessions} sessions`} meta="Financial analysis" />
                    <ListCard title="Automation" subtitle={`${links.automationSessions} sessions`} meta="Workflow agents" />
                    <ListCard title="Documents" subtitle={`${links.documentsSessions} sessions`} meta="Content intelligence" />
                </>) : <EmptyState title="No cross-module data" description="Session metrics will appear once AI orchestration is active." />}
            </div></Card>
        </div>
    );
}

export function ProvidersPanel({ data }: { data: AiData }) {
    const form = useForm<ProviderFormValues>({ resolver: zodResolver(providerFormSchema), defaultValues: { name: "", providerKey: "openai", apiBaseUrl: "", isDefault: false } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="AI provider registry" description="Registered LLM and AI service providers" /><div className="mt-6 space-y-3">
                {data.providers.length === 0 ? <EmptyState title="No providers" description="Register AI providers to enable orchestration." /> : data.providers.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.providerKey} • ${p.apiBaseUrl}`} meta={`${p.status} • ${p.routeCount} routes${p.isDefault ? " • Default" : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Register provider" description="Add a new AI provider" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProvider(v))}>
                <input {...form.register("name")} placeholder="Provider name" className={inputClass} />
                <select {...form.register("providerKey")} className={inputClass}>{PROVIDER_KEY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("apiBaseUrl")} placeholder="API base URL" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Register provider" />
            </form></Card>
        </div>
    );
}

export function RoutingPanel({ data }: { data: AiData }) {
    const form = useForm<ModelRouteFormValues>({ resolver: zodResolver(modelRouteFormSchema), defaultValues: { name: "", providerId: "", modelId: "", priority: 1, routingStrategy: "priority", fallbackProviderId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Multi-model routing" description="Route requests across models and providers" /><div className="mt-6 space-y-3">
                {data.modelRoutes.length === 0 ? <EmptyState title="No routes" description="Configure model routes for intelligent routing." /> : data.modelRoutes.map((r) => (
                    <ListCard key={r.id} title={r.name} subtitle={`${r.providerName} • ${r.modelId}`} meta={`Priority ${r.priority} • ${r.routingStrategy} • ${r.agentCount} agents${r.fallbackProviderName ? ` • Fallback: ${r.fallbackProviderName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create route" description="Define a model routing rule" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModelRoute(v))}>
                <input {...form.register("name")} placeholder="Route name" className={inputClass} />
                <select {...form.register("providerId")} className={inputClass}><option value="">Provider</option>{data.providerOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <input {...form.register("modelId")} placeholder="Model ID" className={inputClass} />
                <input type="number" {...form.register("priority", { valueAsNumber: true })} placeholder="Priority" className={inputClass} />
                <select {...form.register("routingStrategy")} className={inputClass}>{ROUTING_STRATEGY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create route" />
            </form></Card>
        </div>
    );
}

export function AgentsPanel({ data }: { data: AiData }) {
    const form = useForm<AgentFormValues>({ resolver: zodResolver(agentFormSchema), defaultValues: { name: "", agentType: "general", providerId: "", modelRouteId: "", workflowAgentId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="AI agent registry" description="Orchestration agents for future AI roles" /><div className="mt-6 space-y-3">
                {data.agents.length === 0 ? <EmptyState title="No agents" description="Register orchestration agents." /> : data.agents.map((a) => (
                    <ListCard key={a.id} title={a.name} subtitle={`${a.agentType} • ${a.providerName ?? "No provider"}`} meta={`${a.status} • ${a.taskCount} tasks • ${a.capabilities.join(", ") || "No capabilities"}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Register agent" description="Add orchestration agent" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAgent(v))}>
                <input {...form.register("name")} placeholder="Agent name" className={inputClass} />
                <select {...form.register("agentType")} className={inputClass}>{AGENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("providerId")} className={inputClass}><option value="">Provider</option>{data.providerOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <select {...form.register("modelRouteId")} className={inputClass}><option value="">Model route</option>{data.routeOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
                <select {...form.register("workflowAgentId")} className={inputClass}><option value="">Workflow agent (optional)</option>{data.workflowAgentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Register agent" />
            </form></Card>
        </div>
    );
}

export function PromptsPanel({ data }: { data: AiData }) {
    const form = useForm<PromptTemplateFormValues>({ resolver: zodResolver(promptTemplateFormSchema), defaultValues: { name: "", templateKey: "", category: "general", content: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Prompt template management" description="Reusable prompts for all modules" /><div className="mt-6 space-y-3">
                {data.promptTemplates.length === 0 ? <EmptyState title="No templates" description="Create prompt templates for AI tasks." /> : data.promptTemplates.map((t) => (
                    <ListCard key={t.id} title={t.name} subtitle={`${t.templateKey} • ${t.category}`} meta={`v${t.version} • ${t.status} • ${t.contentPreview}...`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create template" description="Add prompt template" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPromptTemplate(v))}>
                <input {...form.register("name")} placeholder="Template name" className={inputClass} />
                <input {...form.register("templateKey")} placeholder="Template key" className={inputClass} />
                <input {...form.register("category")} placeholder="Category" className={inputClass} />
                <textarea {...form.register("content")} placeholder="Prompt content" rows={4} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create template" />
            </form></Card>
        </div>
    );
}

export function TasksPanel({ data }: { data: AiData }) {
    const form = useForm<TaskFormValues>({ resolver: zodResolver(taskFormSchema), defaultValues: { taskType: "", agentId: "", sessionId: "", providerId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="AI task execution engine" description="Queued and completed AI tasks" /><div className="mt-6 space-y-3">
                {data.taskExecutions.length === 0 ? <EmptyState title="No tasks" description="Submit tasks through the execution engine." /> : data.taskExecutions.map((t) => (
                    <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <div><p className="font-medium">{t.taskType}</p><p className="text-sm text-slate-500">{t.agentName ?? "No agent"} • {t.providerName ?? "No provider"} • {t.modelUsed || "Pending"}</p><p className="mt-1 text-xs text-violet-600">{t.status} • {t.tokensUsed} tokens • {t.durationMs}ms</p></div>
                        {t.status === "pending" ? <button type="button" onClick={() => data.updateTaskStatus(t.id, { status: "completed", modelUsed: "gpt-4o", tokensUsed: 100, durationMs: 500 })} className="rounded-full border border-violet-300 px-4 py-2 text-sm text-violet-700">Complete</button> : null}
                    </div>
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Queue task" description="Submit a new AI task" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTaskExecution(v))}>
                <input {...form.register("taskType")} placeholder="Task type" className={inputClass} />
                <select {...form.register("agentId")} className={inputClass}><option value="">Agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <select {...form.register("sessionId")} className={inputClass}><option value="">Session</option>{data.sessionOptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Queue task" />
            </form></Card>
        </div>
    );
}

export function SessionsPanel({ data }: { data: AiData }) {
    const form = useForm<SessionFormValues>({ resolver: zodResolver(sessionFormSchema), defaultValues: { sessionKey: "", agentId: "", moduleSource: "crm", entityType: "", entityId: "", expiresAt: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Session management" description="Orchestration context sessions for all modules" /><div className="mt-6 space-y-3">
                {data.sessions.length === 0 ? <EmptyState title="No sessions" description="Create sessions to maintain AI context." /> : data.sessions.map((s) => (
                    <ListCard key={s.id} title={s.sessionKey} subtitle={`${s.moduleSource} • ${s.entityType} • ${s.agentName ?? "No agent"}`} meta={`${s.status}${s.expiresAt ? ` • Expires ${new Date(s.expiresAt).toLocaleDateString()}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create session" description="Open orchestration session" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSession(v))}>
                <input {...form.register("sessionKey")} placeholder="Session key" className={inputClass} />
                <select {...form.register("agentId")} className={inputClass}><option value="">Agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <select {...form.register("moduleSource")} className={inputClass}>{MODULE_SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("entityType")} placeholder="Entity type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create session" />
            </form></Card>
        </div>
    );
}

export function UsagePanel({ data }: { data: AiData }) {
    return (
        <Card hover><SectionHeader title="AI usage tracking" description="Token and request usage across providers" /><div className="mt-6 space-y-3">
            {data.usageRecords.length === 0 ? <EmptyState title="No usage records" description="Usage will be tracked as tasks execute." /> : data.usageRecords.map((u) => (
                <ListCard key={u.id} title={u.providerName ?? "Unknown provider"} subtitle={`${u.agentName ?? "No agent"} • ${u.requestCount} requests`} meta={`In: ${u.tokensInput} • Out: ${u.tokensOutput} • ${new Date(u.recordedAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function CostsPanel({ data }: { data: AiData }) {
    return (
        <Card hover><SectionHeader title="Cost tracking" description="AI spend by provider and pricing model" /><div className="mt-6 space-y-3">
            {data.costRecords.length === 0 ? <EmptyState title="No cost records" description="Costs will appear as usage is billed." /> : data.costRecords.map((c) => (
                <ListCard key={c.id} title={c.providerName ?? "Unknown provider"} subtitle={`$${c.costUsd.toFixed(6)} • ${c.pricingModel}`} meta={new Date(c.recordedAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function RateLimitsPanel({ data }: { data: AiData }) {
    const form = useForm<RateLimitFormValues>({ resolver: zodResolver(rateLimitFormSchema), defaultValues: { scopeType: "organization", scopeId: "", requestsPerMinute: 60, tokensPerDay: 1000000 } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Rate limiting" description="Request and token quotas" /><div className="mt-6 space-y-3">
                {data.rateLimits.length === 0 ? <EmptyState title="No rate limits" description="Configure rate limits to protect providers." /> : data.rateLimits.map((l) => (
                    <ListCard key={l.id} title={`${l.scopeType}: ${l.scopeName}`} subtitle={`${l.requestsPerMinute} req/min • ${l.tokensPerDay.toLocaleString()} tokens/day`} meta={l.isActive ? "Active" : "Inactive"} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rate limit" description="Define quota scope" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRateLimit(v))}>
                <input {...form.register("scopeType")} placeholder="Scope type" className={inputClass} />
                <input type="number" {...form.register("requestsPerMinute", { valueAsNumber: true })} placeholder="Requests per minute" className={inputClass} />
                <input type="number" {...form.register("tokensPerDay", { valueAsNumber: true })} placeholder="Tokens per day" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create rate limit" />
            </form></Card>
        </div>
    );
}

export function PermissionsPanel({ data }: { data: AiData }) {
    const form = useForm<PermissionGrantFormValues>({ resolver: zodResolver(permissionGrantFormSchema), defaultValues: { granteeType: "employee", granteeId: "", permissionKey: "ai.execute", resourceType: "all", resourceId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="AI permissions" description="Granular access control for AI operations" /><div className="mt-6 space-y-3">
                {data.permissionGrants.length === 0 ? <EmptyState title="No permission grants" description="Grant AI permissions to users and agents." /> : data.permissionGrants.map((g) => (
                    <ListCard key={g.id} title={g.permissionKey} subtitle={`${g.granteeType} • ${g.granteeName ?? "Unassigned"}`} meta={`${g.resourceType} • ${g.isActive ? "Active" : "Inactive"}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Grant permission" description="Assign AI permission" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPermissionGrant(v))}>
                <select {...form.register("permissionKey")} className={inputClass}>{AI_PERMISSIONS.map((p) => <option key={p} value={p}>{p}</option>)}</select>
                <select {...form.register("granteeId")} className={inputClass}><option value="">Grantee</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("resourceType")} placeholder="Resource type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Grant permission" />
            </form></Card>
        </div>
    );
}

export function HealthPanel({ data }: { data: AiData }) {
    return (
        <Card hover><SectionHeader title="Provider health monitoring" description="Latency and availability checks" /><div className="mt-6 space-y-3">
            {data.healthChecks.length === 0 ? <EmptyState title="No health checks" description="Provider health will be monitored automatically." /> : data.healthChecks.map((h) => (
                <ListCard key={h.id} title={h.providerName} subtitle={`${h.status} • ${h.latencyMs}ms latency`} meta={`${h.errorMessage || "No errors"} • Checked ${new Date(h.lastCheckedAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RetryPanel({ data }: { data: AiData }) {
    const form = useForm<RetryPolicyFormValues>({ resolver: zodResolver(retryPolicyFormSchema), defaultValues: { name: "", maxRetries: 3, backoffStrategy: "exponential", fallbackRouteId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Retry and fallback engine" description="Resilience policies for AI execution" /><div className="mt-6 space-y-3">
                {data.retryPolicies.length === 0 ? <EmptyState title="No retry policies" description="Define retry and fallback strategies." /> : data.retryPolicies.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.maxRetries} retries • ${p.backoffStrategy}`} meta={`Fallback: ${p.fallbackRouteName ?? "None"} • ${p.isActive ? "Active" : "Inactive"}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create policy" description="Add retry/fallback policy" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetryPolicy(v))}>
                <input {...form.register("name")} placeholder="Policy name" className={inputClass} />
                <input type="number" {...form.register("maxRetries", { valueAsNumber: true })} placeholder="Max retries" className={inputClass} />
                <input {...form.register("backoffStrategy")} placeholder="Backoff strategy" className={inputClass} />
                <select {...form.register("fallbackRouteId")} className={inputClass}><option value="">Fallback route</option>{data.routeOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create policy" />
            </form></Card>
        </div>
    );
}

export function AiAuditPanel({ data }: { data: AiData }) {
    return (
        <Card hover><SectionHeader title="AI audit history" description="Complete orchestration audit trail" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function AiAnalyticsPanel({ data }: { data: AiData }) {
    const report = data.report;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="AI analytics" description="Orchestration performance metrics" /><div className="mt-6 space-y-3">
                {data.analytics.length === 0 ? <EmptyState title="No analytics" description="Analytics will populate as tasks execute." /> : data.analytics.map((m) => (
                    <ListCard key={m.id} title={m.metricKey} subtitle={`Value: ${m.metricValue}`} meta={`${new Date(m.periodStart).toLocaleDateString()} – ${new Date(m.periodEnd).toLocaleDateString()}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Task distribution" description="Execution summary" /><div className="mt-6 space-y-3">
                {(report?.tasksByStatus ?? []).length === 0 ? <EmptyState title="No report data" description="Reports will populate once tasks exist." /> : (report?.tasksByStatus ?? []).map((item) => (
                    <ListCard key={item.label} title={item.label} subtitle={`${item.count} tasks`} />
                ))}
            </div></Card>
        </div>
    );
}

export function SdkPanel({ data }: { data: AiData }) {
    return (
        <Card hover><SectionHeader title="Shared AI SDK" description="Import from @/src/modules/ai-orchestration/sdk for all modules" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createAiOrchestrationClient()" subtitle="Factory for module-scoped AI client with auth context" meta="Used by CRM, Projects, Finance, HR, and all enterprise modules" />
            <ListCard title="client.resolveRoute()" subtitle="Resolve optimal model route with fallback support" meta={`${data.modelRoutes.length} routes configured`} />
            <ListCard title="client.executeTask()" subtitle="Queue AI task through orchestration engine with routing" meta={`${data.agents.length} agents available`} />
            <ListCard title="client.getPromptTemplates()" subtitle="Access shared prompt templates by module category" meta={`${data.promptTemplates.length} templates registered`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";

const ai = createAiOrchestrationClient(userId, email, fullName);
const route = await ai.resolveRoute("priority");
const result = await ai.executeTask({
  taskType: "analysis",
  moduleSource: "crm",
  inputPayload: { clientId: "..." },
});`}</pre>
        </div></Card>
    );
}
