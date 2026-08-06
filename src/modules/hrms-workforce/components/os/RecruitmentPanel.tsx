"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { RecruitmentItem } from "../../types/os";

export function RecruitmentPanel({ items }: { items: RecruitmentItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No candidates" description="ATS loads from live job openings and candidates in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.candidateName}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.openingTitle}</p>
                        </div>
                        <Badge variant="info">{item.stage}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>{item.email}</span>
                        <span>{item.departmentName}</span>
                        <span>Opening {item.openingStatus}</span>
                        <span>{new Date(item.appliedAt).toLocaleDateString()}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
