"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { CommunicationChannel, CommunicationItem } from "../types/enterprise";

const CHANNELS: Array<"all" | CommunicationChannel> = ["all", "email", "call", "whatsapp", "comment", "meeting"];

export function CommunicationCenterPanel({ items }: { items: CommunicationItem[] }) {
    const [channel, setChannel] = useState<"all" | CommunicationChannel>("all");
    const filtered = channel === "all" ? items : items.filter((i) => i.channel === channel);

    return (
        <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Communication Center</h3>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Email, calls, WhatsApp, meetings, internal comments</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {CHANNELS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setChannel(c)}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                channel === c
                                    ? "bg-[var(--dos-brand-primary)] text-white"
                                    : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto">
                {filtered.length === 0 ? (
                    <EmptyState className="border-0 bg-transparent p-4" title="No communications" description="Live email, call, WhatsApp, and comment records will show here." />
                ) : (
                    filtered.map((item) => (
                        <div key={item.id} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                            <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                                <Badge variant="default">{item.channel}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                            <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{item.relativeTime} · {item.actor}</p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
