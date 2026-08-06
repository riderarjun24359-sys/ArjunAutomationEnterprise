"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { LeadKanbanColumn, LeadPipelineStage, PipelineLead } from "../types/enterprise";

const STAGES: LeadPipelineStage[] = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];

export function LeadKanbanBoard({
    columns,
    movingLeadId,
    onMove,
}: {
    columns: LeadKanbanColumn[];
    movingLeadId: string | null;
    onMove: (lead: PipelineLead, stage: LeadPipelineStage) => void;
}) {
    const total = columns.reduce((s, c) => s + c.leads.length, 0);

    return (
        <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Lead Management</h3>
            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Kanban pipeline · scoring · source tracking · {total} leads</p>

            {total === 0 ? (
                <EmptyState className="mt-4" title="No leads yet" description="Sales leads and CRM leads from Supabase appear here." />
            ) : (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {columns.map((column) => (
                        <div key={column.stage} className="min-w-[220px] flex-1 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-3">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-semibold text-[var(--dos-text-primary)]">{column.label}</p>
                                <Badge variant="default">{column.leads.length}</Badge>
                            </div>
                            <div className="space-y-2">
                                {column.leads.map((lead) => (
                                    <div key={lead.id} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-3">
                                        <p className="font-medium text-[var(--dos-text-primary)]">{lead.company}</p>
                                        <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{lead.name} · {lead.email}</p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            <Badge variant="info">Score {lead.score}</Badge>
                                            <Badge variant="default">{lead.source}</Badge>
                                        </div>
                                        <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">Owner {lead.owner}</p>
                                        <label className="mt-2 block text-[10px] uppercase tracking-wide text-[var(--dos-text-tertiary)]">
                                            Move stage
                                            <select
                                                className="mt-1 w-full rounded border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-2 py-1 text-xs"
                                                value={lead.stage}
                                                disabled={movingLeadId === lead.id}
                                                onChange={(e) => onMove(lead, e.target.value as LeadPipelineStage)}
                                            >
                                                {STAGES.map((stage) => (
                                                    <option key={stage} value={stage}>{stage}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
