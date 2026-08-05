"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { Tabs } from "@/src/design-os/components/Tabs";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import { DELIVERY_ENGINE_TABS, DELIVERY_ENGINE_TAB_LIST, DELIVERY_ENGINE_THEME } from "../constants";
import { useDeliveryEngine } from "../hooks/useDeliveryEngine";
import { DeliveryPlaybookPipeline } from "./DeliveryPlaybookPipeline";
import {
    AiDeliveryAssistantPanel,
    AutomationPipelinesPanel,
    BlueprintLibraryPanel,
    ComponentLibraryPanel,
    DeliveryAnalyticsPanel,
    DeliveryPlaybookPanel,
    KnowledgeEnginePanel,
    QualityEnginePanel,
} from "./panels/DeliveryEnginePanels";

export function DeliveryEnginePage() {
    const [activeTab, setActiveTab] = useState<string>(DELIVERY_ENGINE_TABS.blueprints);
    const [newTitle, setNewTitle] = useState("");
    const data = useDeliveryEngine();

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">{DELIVERY_ENGINE_THEME.badge}</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">Delivery Engine</h1>
                <p className={`mt-2 max-w-3xl ${DELIVERY_ENGINE_THEME.text}`}>
                    Internal execution system for AI-accelerated client delivery. Every completed project makes future projects faster.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StaggerRevealItem>
                    <Card hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">Blueprints</p>
                        <p className="mt-1 text-2xl font-bold">{data.dashboard?.blueprintCount ?? 0}</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">Active deliveries</p>
                        <p className="mt-1 text-2xl font-bold">{data.dashboard?.activeEngagements ?? 0}</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">Quality pass rate</p>
                        <p className="mt-1 text-2xl font-bold">{data.dashboard?.qualityPassRate ?? 0}%</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">AI recommendations</p>
                        <p className="mt-1 text-2xl font-bold">{data.dashboard?.pendingAiRecommendations ?? 0}</p>
                    </Card>
                </StaggerRevealItem>
            </StaggerReveal>

            <Card>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-600">Delivery playbook pipeline</h2>
                <div className="mt-4">
                    <DeliveryPlaybookPipeline dashboard={data.dashboard} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="New engagement title..."
                        className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm outline-none"
                    />
                    <Button
                        size="sm"
                        disabled={!newTitle.trim()}
                        onClick={async () => {
                            await data.createEngagement({ title: newTitle.trim() });
                            setNewTitle("");
                        }}
                    >
                        Start delivery
                    </Button>
                </div>
            </Card>

            <Tabs tabs={DELIVERY_ENGINE_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))} active={activeTab} onChange={setActiveTab} />

            {data.loading ? (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Loading delivery engine...</p></Card>
            ) : (
                <>
                    {activeTab === DELIVERY_ENGINE_TABS.blueprints && <BlueprintLibraryPanel data={data} />}
                    {activeTab === DELIVERY_ENGINE_TABS.components && <ComponentLibraryPanel data={data} />}
                    {activeTab === DELIVERY_ENGINE_TABS.pipelines && <AutomationPipelinesPanel data={data} />}
                    {activeTab === DELIVERY_ENGINE_TABS.playbook && <DeliveryPlaybookPanel data={data} />}
                    {activeTab === DELIVERY_ENGINE_TABS.quality && <QualityEnginePanel data={data} />}
                    {activeTab === DELIVERY_ENGINE_TABS.knowledge && <KnowledgeEnginePanel data={data} />}
                    {activeTab === DELIVERY_ENGINE_TABS.analytics && <DeliveryAnalyticsPanel data={data} />}
                    {activeTab === DELIVERY_ENGINE_TABS.aiAssistant && <AiDeliveryAssistantPanel data={data} />}
                </>
            )}
        </PageTransition>
    );
}
