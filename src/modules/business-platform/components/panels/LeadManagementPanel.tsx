"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { LEAD_STATUS_OPTIONS } from "../../constants";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function LeadManagementPanel({ data }: { data: BusinessPlatformData }) {
    return (
        <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
            <Card className="os-panel" hover={false}>
                <h2 className="dos-text-h2">Lead pipeline</h2>
                <p className="mt-2 text-[var(--dos-text-secondary)]">Capture, score, track sources, and manage follow-ups</p>
                <div className="mt-8 space-y-4">
                    {data.leads.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[var(--dos-border-strong)] p-12 text-center">
                            <p className="text-[var(--dos-text-secondary)]">No leads found</p>
                        </div>
                    ) : (
                        data.leads.map((lead) => (
                            <div key={lead.id} className="group flex items-center justify-between rounded-xl border border-[var(--dos-border-subtle)] bg-[var(--dos-surface)] p-5 transition-all hover:border-[var(--dos-border-focus)]">
                                <div>
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{lead.leadName}</p>
                                    <p className="mt-0.5 text-sm text-[var(--dos-text-secondary)]">{lead.companyName} · {lead.email}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant="info">Score {lead.score}</Badge>
                                    <p className="text-xs font-medium text-[var(--dos-brand-primary)]">
                                        {lead.source} · {lead.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
            <Card className="os-panel" hover={false}>
                <h2 className="dos-text-h3">Pipeline status</h2>
                <div className="mt-6 space-y-4">
                    {LEAD_STATUS_OPTIONS.map((s) => (
                        <div key={s.value} className="flex items-center justify-between border-b border-[var(--dos-border-subtle)] pb-2 text-sm">
                            <span className="text-[var(--dos-text-secondary)]">{s.label}</span>
                            <span className="font-mono text-lg font-bold">{data.leads.filter((l) => l.status === s.value).length}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 rounded-xl bg-[var(--dos-surface-tertiary)] p-4 text-xs text-[var(--dos-text-secondary)] border border-[var(--dos-border-subtle)]">
                    AI recommendations for lead follow-ups appear in the AI Operations tab.
                </div>
            </Card>
        </div>
    );
}
