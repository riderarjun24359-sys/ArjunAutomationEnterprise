"use client";

import { Card } from "@/src/design-os/components/Card";
import type { ExecutiveFeedItem } from "../types";

export function ExecutiveFeed({ items }: { items: ExecutiveFeedItem[] }) {
    return (
        <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Global executive feed</h3>
            <div className="mt-4 space-y-3">
                {items.length === 0 ? (
                    <p className="text-sm text-[var(--dos-text-tertiary)]">No feed items yet.</p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                                </div>
                                <span className="shrink-0 rounded-full bg-[var(--dos-surface-tertiary)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--dos-text-tertiary)]">
                                    {item.tag}
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{item.time} · {item.module}</p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
