"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AgentsPanel, AiAnalyticsPanel, AiAuditPanel, AiOverviewPanel, CostsPanel, HealthPanel, PermissionsPanel, PromptsPanel, ProvidersPanel, RateLimitsPanel, RetryPanel, RoutingPanel, SdkPanel, SessionsPanel, TasksPanel, UsagePanel,
} from "@/src/modules/ai-orchestration/components/AiOrchestrationPanels";
import { AiOrchestrationStats } from "@/src/modules/ai-orchestration/components/AiOrchestrationStats";
import { AI_ORCHESTRATION_TABS } from "@/src/modules/ai-orchestration/constants";
import { useAiOrchestration } from "@/src/modules/ai-orchestration/hooks/useAiOrchestration";

const tabs = [
    { id: AI_ORCHESTRATION_TABS.overview, label: "Overview" },
    { id: AI_ORCHESTRATION_TABS.providers, label: "Providers" },
    { id: AI_ORCHESTRATION_TABS.routing, label: "Routing" },
    { id: AI_ORCHESTRATION_TABS.agents, label: "Agents" },
    { id: AI_ORCHESTRATION_TABS.prompts, label: "Prompts" },
    { id: AI_ORCHESTRATION_TABS.tasks, label: "Tasks" },
    { id: AI_ORCHESTRATION_TABS.sessions, label: "Sessions" },
    { id: AI_ORCHESTRATION_TABS.usage, label: "Usage" },
    { id: AI_ORCHESTRATION_TABS.costs, label: "Costs" },
    { id: AI_ORCHESTRATION_TABS.rateLimits, label: "Rate Limits" },
    { id: AI_ORCHESTRATION_TABS.permissions, label: "Permissions" },
    { id: AI_ORCHESTRATION_TABS.health, label: "Health" },
    { id: AI_ORCHESTRATION_TABS.retry, label: "Retry" },
    { id: AI_ORCHESTRATION_TABS.audit, label: "Audit" },
    { id: AI_ORCHESTRATION_TABS.analytics, label: "Analytics" },
    { id: AI_ORCHESTRATION_TABS.sdk, label: "SDK" },
] as const;

export function AiOrchestrationPage() {
    const ai = useAiOrchestration();
    const [activeTab, setActiveTab] = useState<(typeof AI_ORCHESTRATION_TABS)[keyof typeof AI_ORCHESTRATION_TABS]>(AI_ORCHESTRATION_TABS.overview);

    if (ai.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading enterprise AI orchestration layer" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-600">AI Infrastructure</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise AI Orchestration Layer</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Core AI infrastructure for provider registry, multi-model routing, agent registry, prompt templates, task execution, session management, usage and cost tracking, rate limiting, permissions, health monitoring, retry/fallback, audit history, analytics, and the shared AI SDK used by all enterprise modules.
                </p>
            </motion.header>
            <AiOrchestrationStats stats={ai.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-slate-200 text-slate-600 hover:border-violet-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === AI_ORCHESTRATION_TABS.overview ? <AiOverviewPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.providers ? <ProvidersPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.routing ? <RoutingPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.agents ? <AgentsPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.prompts ? <PromptsPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.tasks ? <TasksPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.sessions ? <SessionsPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.usage ? <UsagePanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.costs ? <CostsPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.rateLimits ? <RateLimitsPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.permissions ? <PermissionsPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.health ? <HealthPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.retry ? <RetryPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.audit ? <AiAuditPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.analytics ? <AiAnalyticsPanel data={ai} /> : null}
            {activeTab === AI_ORCHESTRATION_TABS.sdk ? <SdkPanel data={ai} /> : null}
        </div>
    );
}
