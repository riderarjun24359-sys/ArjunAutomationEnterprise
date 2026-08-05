"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { PROPOSAL_STATUS_OPTIONS } from "../../constants";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function ProposalsPanel({ data }: { data: BusinessPlatformData }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title || !amount) return;
        setSubmitting(true);
        try {
            await data.createProposal({ title, totalAmount: Number(amount) });
            setTitle("");
            setAmount("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card>
                <h2 className="text-lg font-semibold">Proposal builder</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Templates, pricing, version history, approval workflow, PDF generation</p>
                <div className="mt-6 space-y-3">
                    {data.proposals.length === 0 ? (
                        <EmptyState title="No proposals" description="Create a proposal from consultation outcomes." />
                    ) : (
                        data.proposals.map((p) => (
                            <div key={p.id} className="rounded-xl border border-[var(--dos-border)] p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="font-medium">{p.title}</p>
                                    <Badge variant={p.approvalStatus === "pending" ? "warning" : "success"}>{p.status}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                                    v{p.version} · ${p.totalAmount.toLocaleString()} · {p.documentRef}
                                </p>
                                <p className="mt-1 text-xs text-indigo-600">Approval: {p.approvalStatus}</p>
                            </div>
                        ))
                    )}
                </div>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold">Create proposal</h2>
                <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Proposal title" className="rounded-xl border border-[var(--dos-border)] px-3 py-2 text-sm" required />
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Total amount" className="rounded-xl border border-[var(--dos-border)] px-3 py-2 text-sm" required />
                    <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create draft proposal"}</Button>
                </form>
                <ul className="mt-6 space-y-1 text-xs text-[var(--dos-text-secondary)]">
                    {PROPOSAL_STATUS_OPTIONS.slice(0, 4).map((s) => (
                        <li key={s.value}>{s.label}: {data.proposals.filter((p) => p.status === s.value).length}</li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}
