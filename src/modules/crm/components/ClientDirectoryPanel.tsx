"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { DirectoryQuery, DirectoryResult } from "../types/enterprise";

export function ClientDirectoryPanel({
    directory,
    query,
    onQueryChange,
    onSelect,
}: {
    directory: DirectoryResult | null;
    query: DirectoryQuery;
    onQueryChange: (patch: Partial<DirectoryQuery>) => void;
    onSelect: (clientId: string) => void;
}) {
    if (!directory) {
        return <EmptyState title="No directory" description="Client directory will load from Supabase." />;
    }

    return (
        <Card>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Client Directory</h3>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{directory.total} clients · page {directory.page}/{directory.pageCount}</p>
                </div>
                <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
                    <input
                        value={query.search}
                        onChange={(e) => onQueryChange({ search: e.target.value })}
                        placeholder="Search clients"
                        className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm"
                    />
                    <select
                        value={query.status}
                        onChange={(e) => onQueryChange({ status: e.target.value })}
                        className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm"
                    >
                        <option value="all">All statuses</option>
                        {directory.statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        value={query.owner}
                        onChange={(e) => onQueryChange({ owner: e.target.value })}
                        className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm"
                    >
                        <option value="all">All owners</option>
                        {directory.owners.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                    <select
                        value={query.tag}
                        onChange={(e) => onQueryChange({ tag: e.target.value })}
                        className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm"
                    >
                        <option value="all">All tags</option>
                        {directory.tags.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {directory.items.length === 0 ? (
                    <EmptyState className="border-0 bg-transparent p-4" title="No clients match" description="Adjust search or filters. Empty when Supabase has no matching clients." />
                ) : (
                    directory.items.map((client) => (
                        <button
                            key={client.id}
                            type="button"
                            onClick={() => onSelect(client.id)}
                            className="flex w-full flex-col gap-2 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-4 text-left transition hover:border-[var(--dos-brand-primary)] sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{client.name}</p>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{client.companyProfile}</p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {client.tags.map((tag) => (
                                        <Badge key={tag} variant="default">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm text-[var(--dos-text-secondary)] sm:text-right">
                                <Badge variant={client.status === "at_risk" ? "warning" : client.status === "active" ? "success" : "default"}>{client.status}</Badge>
                                <p className="mt-2">Owner: {client.owner}</p>
                                <p>{client.revenueLabel}</p>
                            </div>
                        </button>
                    ))
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <button
                    type="button"
                    disabled={directory.page <= 1}
                    onClick={() => onQueryChange({ page: directory.page - 1 })}
                    className="rounded-full border border-[var(--dos-border)] px-3 py-1 text-xs disabled:opacity-40"
                >
                    Previous
                </button>
                <span className="text-xs text-[var(--dos-text-tertiary)]">Page {directory.page} of {directory.pageCount}</span>
                <button
                    type="button"
                    disabled={directory.page >= directory.pageCount}
                    onClick={() => onQueryChange({ page: directory.page + 1 })}
                    className="rounded-full border border-[var(--dos-border)] px-3 py-1 text-xs disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </Card>
    );
}
