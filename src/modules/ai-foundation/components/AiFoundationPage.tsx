"use client";

import { useState } from "react";
import { Tabs } from "@/src/design-os/components/Tabs";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import {
    AI_FOUNDATION_TABS,
    AI_FOUNDATION_TAB_LIST,
    AI_FOUNDATION_THEME,
} from "../constants";
import { AiMemoryEnginePanel } from "./panels/AiMemoryEnginePanel";
import { KnowledgeGraphPanel } from "./panels/KnowledgeGraphPanel";
import { PromptManagementPanel } from "./panels/PromptManagementPanel";
import { AgentRegistryPanel } from "./panels/AgentRegistryPanel";
import { AiWorkflowEnginePanel } from "./panels/AiWorkflowEnginePanel";
import { EvaluationCenterPanel } from "./panels/EvaluationCenterPanel";
import { AiGovernancePanel } from "./panels/AiGovernancePanel";
import { CostUsageCenterPanel } from "./panels/CostUsageCenterPanel";
import { LearningPipelinePanel } from "./panels/LearningPipelinePanel";
import { ExecutiveDashboardPanel } from "./panels/ExecutiveDashboardPanel";
import { useAiFoundation } from "../hooks/useAiFoundation";

export function AiFoundationPage() {
    const [activeTab, setActiveTab] = useState<string>(AI_FOUNDATION_TABS.dashboard);
    const { state, loading } = useAiFoundation();

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">V10 AI Foundation V2.0</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">
                    AI Foundation
                </h1>
                <p className="mt-2 max-w-3xl text-[var(--dos-text-secondary)]">
                    Governed, reusable, measurable AI layer orchestrated through Mission Core — memory, knowledge graph, prompts, agents, workflows, evaluation, governance, cost tracking, and learning pipeline.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-3">
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>AI Health</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">
                            {loading ? "—" : `${state.dashboard.aiHealthScore}%`}
                        </p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Active Agents</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">
                            {loading ? "—" : state.dashboard.activeAgents}
                        </p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Panels</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">10</p>
                    </Card>
                </StaggerRevealItem>
            </StaggerReveal>

            <Tabs
                tabs={AI_FOUNDATION_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))}
                active={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === AI_FOUNDATION_TABS.memory && <AiMemoryEnginePanel />}
            {activeTab === AI_FOUNDATION_TABS.knowledgeGraph && <KnowledgeGraphPanel />}
            {activeTab === AI_FOUNDATION_TABS.prompts && <PromptManagementPanel />}
            {activeTab === AI_FOUNDATION_TABS.agents && <AgentRegistryPanel />}
            {activeTab === AI_FOUNDATION_TABS.workflows && <AiWorkflowEnginePanel />}
            {activeTab === AI_FOUNDATION_TABS.evaluation && <EvaluationCenterPanel />}
            {activeTab === AI_FOUNDATION_TABS.governance && <AiGovernancePanel />}
            {activeTab === AI_FOUNDATION_TABS.costUsage && <CostUsageCenterPanel />}
            {activeTab === AI_FOUNDATION_TABS.learning && <LearningPipelinePanel />}
            {activeTab === AI_FOUNDATION_TABS.dashboard && <ExecutiveDashboardPanel />}
        </PageTransition>
    );
}
