"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { CONSULTATION_STATUS_OPTIONS } from "../../constants";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function ConsultationPanel({ data }: { data: BusinessPlatformData }) {
    const [title, setTitle] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [requirements, setRequirements] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title || !scheduledAt) return;
        setSubmitting(true);
        try {
            await data.scheduleConsultation({ title, scheduledAt, requirements });
            setTitle("");
            setScheduledAt("");
            setRequirements("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card>
                <h2 className="text-lg font-semibold">Consultation calendar</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Book discovery calls, capture requirements, and AI summaries</p>
                <div className="mt-6 space-y-3">
                    {data.consultations.length === 0 ? (
                        <EmptyState title="No consultations scheduled" description="Book your first discovery consultation." />
                    ) : (
                        data.consultations.map((c) => (
                            <div key={c.id} className="rounded-xl border border-[var(--dos-border)] p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="font-medium">{c.title}</p>
                                    <Badge variant={c.status === "scheduled" ? "info" : "default"}>{c.status}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                                    {new Date(c.scheduledAt).toLocaleString()} · {c.durationMinutes} min
                                </p>
                                {c.requirements && <p className="mt-2 text-xs">{c.requirements}</p>}
                            </div>
                        ))
                    )}
                </div>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold">Book consultation</h2>
                <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Consultation title"
                        className="rounded-xl border border-[var(--dos-border)] px-3 py-2 text-sm"
                        required
                    />
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="rounded-xl border border-[var(--dos-border)] px-3 py-2 text-sm"
                        required
                    />
                    <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Initial requirements"
                        rows={3}
                        className="rounded-xl border border-[var(--dos-border)] px-3 py-2 text-sm"
                    />
                    <Button type="submit" disabled={submitting}>{submitting ? "Booking..." : "Schedule consultation"}</Button>
                </form>
                <ul className="mt-6 space-y-1 text-xs text-[var(--dos-text-secondary)]">
                    {CONSULTATION_STATUS_OPTIONS.map((s) => (
                        <li key={s.value}>{s.label}: {data.consultations.filter((c) => c.status === s.value).length}</li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}
