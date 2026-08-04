"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { SimpleTable } from "../shared/SimpleTable";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";

export function CommunicationCenterPanel() {
    const { communication } = useClientSuccessCapability();

    if (!communication) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to view communications.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Communication Center</h2>
                <p className="text-sm text-[var(--dos-text-secondary)]">Email timeline, meeting summaries, AI summaries, and reminders.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <KpiCard title="Emails" value={communication.emails.length} />
                <KpiCard title="Meetings" value={communication.meetings.length} />
                <KpiCard title="Reminders" value={communication.reminders.filter((r) => !r.sent).length} />
            </div>

            <Card>
                <h3 className="mb-3 font-semibold">Email Timeline</h3>
                <SimpleTable
                    headers={["Subject", "Direction", "Date", "Summary"]}
                    rows={communication.emails.map((e) => [e.subject, e.direction, e.date.slice(0, 10), e.summary.slice(0, 60)])}
                />
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-3 font-semibold">Meeting Summaries</h3>
                    {communication.meetings.map((m) => (
                        <div key={m.id} className="mb-3 border-b border-[var(--dos-border-subtle)] pb-3">
                            <p className="font-medium">{m.title}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{m.date.slice(0, 10)}</p>
                            <p className="mt-1 text-sm">{m.aiSummary}</p>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="mb-3 font-semibold">AI Summaries</h3>
                    {communication.aiSummaries.map((s) => (
                        <div key={s.id} className="mb-3">
                            <div className="flex items-center gap-2">
                                <p className="font-medium">{s.topic}</p>
                                <Badge variant="info">AI</Badge>
                            </div>
                            <p className="text-sm text-[var(--dos-text-secondary)]">{s.summary}</p>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}
