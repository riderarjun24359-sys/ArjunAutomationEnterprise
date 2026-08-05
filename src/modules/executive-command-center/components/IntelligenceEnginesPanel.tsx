"use client";

import { useState } from "react";
import { AlertTriangle, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { Card } from "@/src/design-os/components/Card";
import { Tabs } from "@/src/design-os/components/Tabs";
import type {
    ExecutiveAttentionItem,
    ExecutiveOpportunityItem,
    ExecutiveRecommendationItem,
    ExecutiveRiskItem,
} from "../types";

function SeverityDot({ severity }: { severity: string }) {
    const colors: Record<string, string> = {
        critical: "bg-red-500",
        high: "bg-orange-500",
        medium: "bg-amber-500",
        low: "bg-emerald-500",
    };
    return <span className={`h-2 w-2 rounded-full ${colors[severity] ?? colors.low}`} />;
}

function AttentionList({ items }: { items: ExecutiveAttentionItem[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                    <SeverityDot severity={item.severity} />
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                        {item.actionHref ? (
                            <a href={item.actionHref} className="mt-2 inline-block text-xs font-medium text-[var(--dos-brand-primary)] hover:underline">
                                {item.actionLabel ?? "View"}
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
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
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
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
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
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dos-brand-primary)]" />
                    <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                        {item.requiresApproval ? (
                            <p className="mt-1 text-xs text-amber-600">Requires approval before execution</p>
                        ) : null}
                    </div>
                </li>
            ))}
        </ul>
    );
}

interface IntelligenceEnginesPanelProps {
    attention: ExecutiveAttentionItem[];
    risks: ExecutiveRiskItem[];
    opportunities: ExecutiveOpportunityItem[];
    recommendations: ExecutiveRecommendationItem[];
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
        <Card>
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--dos-brand-primary)]" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Unified intelligence engines</h3>
            </div>
            <div className="mt-4">
                <Tabs tabs={tabs} active={tab} onChange={setTab} />
            </div>
            <div className="mt-4">
                {tab === "attention" && <AttentionList items={attention} />}
                {tab === "risks" && <RiskList items={risks} />}
                {tab === "opportunities" && <OpportunityList items={opportunities} />}
                {tab === "recommendations" && <RecommendationList items={recommendations} />}
            </div>
        </Card>
    );
}
