"use client";

import { useState } from "react";
import { AlertTriangle, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import { Tabs } from "@/src/design-os/components/Tabs";
import {
    ExecutiveAttentionItem,
    ExecutiveRiskItem,
    ExecutiveOpportunityItem,
    ExecutiveRecommendationItem,
} from "../types";

interface IntelligenceEnginesPanelProps {
    attention: ExecutiveAttentionItem[];
    risks: ExecutiveRiskItem[];
    opportunities: ExecutiveOpportunityItem[];
    recommendations: ExecutiveRecommendationItem[];
}

function SeverityDot({ severity }: { severity: string }) {
    const colors: Record<string, string> = {
        critical: "bg-[var(--dos-text-critical)]",
        high: "bg-[var(--dos-text-warning)]",
        medium: "bg-amber-500",
        low: "bg-[var(--dos-text-success)]",
    };
    return <span className={`h-2 w-2 rounded-full ${colors[severity] ?? colors.low}`} />;
}

function AttentionList({ items }: { items: ExecutiveAttentionItem[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] bg-[var(--dos-surface-foundation)]/50 p-4 transition-colors hover:border-[var(--dos-border)]">
                    <SeverityDot severity={item.severity} />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--dos-text-secondary)]">{item.detail}</p>
                        {item.actionHref ? (
                            <a href={item.actionHref} className="mt-3 inline-block text-xs font-semibold text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)]">
                                {item.actionLabel ?? "View"} →
                            </a>
                        ) : null}
                    </div>
                </li>
            ))}
        </ul>
    );
}

function RiskList({ items }: { items: ExecutiveRiskItem[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] bg-[var(--dos-surface-foundation)]/50 p-4 transition-colors hover:border-[var(--dos-border)]">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dos-text-critical)]" />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--dos-text-secondary)]">{item.detail}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function OpportunityList({ items }: { items: ExecutiveOpportunityItem[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] bg-[var(--dos-surface-foundation)]/50 p-4 transition-colors hover:border-[var(--dos-border)]">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dos-brand-accent)]" />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--dos-text-secondary)]">{item.detail}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function RecommendationList({ items }: { items: ExecutiveRecommendationItem[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] bg-[var(--dos-surface-foundation)]/50 p-4 transition-colors hover:border-[var(--dos-border)]">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dos-brand-primary)]" />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--dos-text-secondary)]">{item.detail}</p>
                        {item.requiresApproval ? (
                            <p className="mt-2 text-xs font-medium text-[var(--dos-text-warning)]">Requires approval</p>
                        ) : null}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export function IntelligenceEnginesPanel({
    attention,
    risks,
    opportunities,
    recommendations,
}: IntelligenceEnginesPanelProps) {
    const [tab, setTab] = useState("attention");
    const tabs = [
        { id: "attention", label: `Attention (${attention.length})` },
        { id: "risks", label: `Risks (${risks.length})` },
        { id: "opportunities", label: `Opportunities (${opportunities.length})` },
        { id: "recommendations", label: `Next steps (${recommendations.length})` },
    ];

    return (
        <IntelligentContainer material="base" className="flex flex-col">
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--dos-brand-primary)]" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--dos-text-tertiary)]">Unified intelligence engines</h3>
            </div>
            <div className="mt-6">
                <Tabs tabs={tabs} active={tab} onChange={setTab} />
            </div>
            <div className="mt-6">
                {tab === "attention" && <AttentionList items={attention} />}
                {tab === "risks" && <RiskList items={risks} />}
                {tab === "opportunities" && <OpportunityList items={opportunities} />}
                {tab === "recommendations" && <RecommendationList items={recommendations} />}
            </div>
        </IntelligentContainer>
    );
}
