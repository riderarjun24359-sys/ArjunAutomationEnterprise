import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { ClientActivitySummary, ClientContactSummary, ClientDetail, ClientProjectSummary } from "@/src/modules/clients/types";

interface ClientDetailPanelProps {
    client: ClientDetail | null;
    projects: ClientProjectSummary[];
    contacts: ClientContactSummary[];
    activities: ClientActivitySummary[];
    onDelete?: (id: string) => void;
}

export function ClientDetailPanel({ client, projects, contacts, activities, onDelete }: ClientDetailPanelProps) {
    if (!client) {
        return (
            <Card hover>
                <SectionHeader title="Client detail" description="Selected account profile" />
                <div className="mt-6">
                    <EmptyState title="No client selected" description="Select a client from the roster to inspect profile, projects, and contacts." />
                </div>
            </Card>
        );
    }

    return (
        <Card hover>
            <SectionHeader title="Client detail" description="Selected account profile" />
            <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Account profile</p>
                            <p className="mt-2 text-xl font-semibold">{client.name}</p>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{client.description || "No description provided."}</p>
                        </div>
                        {onDelete ? (
                            <button
                                type="button"
                                onClick={() => onDelete(client.id)}
                                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                            >
                                Delete
                            </button>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                        <p className="mt-2 font-medium capitalize">{client.status.replace("_", " ")}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Revenue</p>
                        <p className="mt-2 font-medium">{client.revenue}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manager</p>
                        <p className="mt-2 font-medium">{client.manager}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Industry</p>
                        <p className="mt-2 font-medium capitalize">{client.industry}</p>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                        <p className="mt-2 font-medium">{client.contactEmail}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                        <p className="mt-2 font-medium">{client.phone || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:col-span-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Website</p>
                        <p className="mt-2 font-medium">{client.website || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:col-span-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Address</p>
                        <p className="mt-2 font-medium">{client.address || "—"}</p>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium">Linked projects ({projects.length})</p>
                    <div className="mt-3 space-y-2">
                        {projects.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No linked projects.</p>
                        ) : (
                            projects.map((project) => (
                                <div key={project.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium">{project.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{project.owner} • {project.timeline}</p>
                                        </div>
                                        <div className="text-right text-sm">
                                            <p>{project.progress}%</p>
                                            <p>{project.budget}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium">Contacts ({contacts.length})</p>
                    <div className="mt-3 space-y-2">
                        {contacts.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No contacts linked.</p>
                        ) : (
                            contacts.map((contact) => (
                                <div key={contact.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                    <p className="font-medium">{contact.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{contact.title} • {contact.email}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium">Recent activity ({activities.length})</p>
                    <div className="mt-3 space-y-2">
                        {activities.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No activity recorded yet.</p>
                        ) : (
                            activities.map((activity) => (
                                <div key={activity.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium">{activity.title}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{activity.detail}</p>
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{activity.timestamp}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
