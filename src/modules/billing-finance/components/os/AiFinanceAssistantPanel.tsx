"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { AiFinanceAssistant } from "../../types/os";

function safeFinancialText(text: string): string {
    return text
        .replace(/\$\s?[\d,]+(?:\.\d+)?/g, "amount hidden pending INR normalization")
        .replace(/\bUSD\b/gi, "source currency")
        .replace(/\bUS dollars?\b/gi, "source currency");
}

export function AiFinanceAssistantPanel({ assistant }: { assistant: AiFinanceAssistant }) {
    if (!assistant.dailySummary) {
        return <EmptyState title="No AI summary" description="Assistant output is generated from the live Billing & Finance snapshot." />;
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Daily Summary</h3>
                <p className="mt-3 text-sm text-[var(--dos-text-primary)]">{safeFinancialText(assistant.dailySummary)}</p>
                <p className="mt-3 text-xs text-[var(--dos-text-tertiary)]">Generated {new Date(assistant.generatedAt).toLocaleString()}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Executive Summary</h3>
                <p className="mt-3 text-sm text-[var(--dos-text-primary)]">{safeFinancialText(assistant.executiveSummary)}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Accounts Needing Attention</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {assistant.accountsNeedingAttention.length === 0 ? <p className="text-sm text-[var(--dos-text-tertiary)]">None right now</p> : assistant.accountsNeedingAttention.map((account) => <Badge key={account} variant="warning">{account}</Badge>)}
                </div>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Collection Recommendations</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">{assistant.collectionRecommendations.map((item) => <li key={item}>• {safeFinancialText(item)}</li>)}</ul>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Subscription Insights</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">{assistant.subscriptionInsights.length === 0 ? <li>No subscription insights</li> : assistant.subscriptionInsights.map((item) => <li key={item}>• {safeFinancialText(item)}</li>)}</ul>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Revenue Insights</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">{assistant.revenueInsights.map((item) => <li key={item}>• {safeFinancialText(item)}</li>)}</ul>
            </Card>
        </div>
    );
}
