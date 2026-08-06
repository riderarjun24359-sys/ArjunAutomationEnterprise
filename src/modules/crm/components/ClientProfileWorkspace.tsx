"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { ClientProfileBundle } from "../types/enterprise";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">{title}</p>
            <div className="mt-2 space-y-2">{children}</div>
        </div>
    );
}

export function ClientProfileWorkspace({ profile }: { profile: ClientProfileBundle | null }) {
    if (!profile) {
        return (
            <EmptyState
                title="Select a client"
                description="Open a client from the directory to view timeline, notes, files, contacts, meetings, tasks, projects, and revenue."
            />
        );
    }

    const { client } = profile;

    return (
        <div className="space-y-4">
            <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-semibold text-[var(--dos-text-primary)]">{client.name}</h3>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{client.companyProfile}</p>
                        <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{client.contactEmail} · {client.phone || "No phone"}</p>
                    </div>
                    <div className="text-right">
                        <Badge variant="success">{client.status}</Badge>
                        <p className="mt-2 text-sm font-medium">{profile.revenue.label}</p>
                        <p className="text-xs text-[var(--dos-text-tertiary)]">{profile.revenue.detail}</p>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Section title="Timeline">
                    {profile.timeline.length === 0 ? <p className="text-sm text-[var(--dos-text-tertiary)]">No timeline events</p> : profile.timeline.map((item) => (
                        <div key={item.id}>
                            <p className="text-sm font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{item.detail}</p>
                            <p className="text-[10px] text-[var(--dos-text-tertiary)]">{item.time} · {item.kind}</p>
                        </div>
                    ))}
                </Section>
                <Section title="Notes">
                    {profile.notes.length === 0 ? <p className="text-sm text-[var(--dos-text-tertiary)]">No notes</p> : profile.notes.map((n) => (
                        <div key={n.id}>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{n.detail}</p>
                        </div>
                    ))}
                </Section>
                <Section title="Files">
                    {profile.files.length === 0 ? <p className="text-sm text-[var(--dos-text-tertiary)]">No files</p> : profile.files.map((f) => (
                        <div key={f.id} className="flex justify-between gap-2 text-sm">
                            <span>{f.name}</span>
                            <span className="text-xs text-[var(--dos-text-tertiary)]">{f.updatedAt}</span>
                        </div>
                    ))}
                </Section>
                <Section title="Contacts">
                    {profile.contacts.length === 0 ? <p className="text-sm text-[var(--dos-text-tertiary)]">No contacts</p> : profile.contacts.map((c) => (
                        <div key={c.id}>
                            <p className="text-sm font-medium">{c.name}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{c.email} · {c.phone}</p>
                        </div>
                    ))}
                </Section>
                <Section title="Meetings">
                    {profile.meetings.length === 0 ? <p className="text-sm text-[var(--dos-text-tertiary)]">No meetings</p> : profile.meetings.map((m) => (
                        <div key={m.id}>
                            <p className="text-sm font-medium">{m.title}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{m.when} · {m.status}</p>
                        </div>
                    ))}
                </Section>
                <Section title="Tasks">
                    {profile.tasks.length === 0 ? <p className="text-sm text-[var(--dos-text-tertiary)]">No linked tasks</p> : profile.tasks.map((t) => (
                        <div key={t.id} className="flex justify-between gap-2 text-sm">
                            <span>{t.title}</span>
                            <Badge variant="default">{t.status}</Badge>
                        </div>
                    ))}
                </Section>
                <Section title="Projects">
                    {profile.projects.length === 0 ? <p className="text-sm text-[var(--dos-text-tertiary)]">No projects</p> : profile.projects.map((p) => (
                        <div key={p.id}>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{p.status} · {p.progress}%</p>
                        </div>
                    ))}
                </Section>
                <Section title="Revenue">
                    <p className="text-lg font-semibold text-[var(--dos-text-primary)]">{profile.revenue.label}</p>
                    <p className="text-sm text-[var(--dos-text-secondary)]">{profile.revenue.detail}</p>
                </Section>
            </div>
        </div>
    );
}
