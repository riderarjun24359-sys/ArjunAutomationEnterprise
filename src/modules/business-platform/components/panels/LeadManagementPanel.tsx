"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { LEAD_STATUS_OPTIONS } from "../../constants";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function LeadManagementPanel({ data }: { data: BusinessPlatformData }) {
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card>
                <h2 className="text-lg font-semibold">Lead pipeline</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Capture, score, track sources, and manage follow-ups</p>
                <div className="mt-6 space-y-3">
                    {data.leads.length === 0 ? (
                        <EmptyState title="No leads" description="Leads from website, sales, and referrals appear here." />
                    ) : (
                        data.leads.map((lead) => (
                            <div key={lead.id} className="rounded-xl border border-[var(--dos-border)] p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="font-medium">{lead.leadName}</p>
                                    <Badge variant="info">Score {lead.score}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{lead.companyName} · {lead.email}</p>
                                <p className="mt-2 text-xs text-indigo-600">
                                    {lead.source} · {lead.status} · {lead.assigneeName ?? "Unassigned"}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold">Pipeline status</h2>
                <ul className="mt-4 space-y-2">
                    {LEAD_STATUS_OPTIONS.map((s) => (
                        <li key={s.value} className="flex justify-between text-sm">
                            <span>{s.label}</span>
                            <span className="font-medium">{data.leads.filter((l) => l.status === s.value).length}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-6 text-xs text-[var(--dos-text-secondary)]">
                    AI recommendations for lead follow-ups appear in the AI Operations tab.
                </p>
            </Card>
        </div>
    );
}
