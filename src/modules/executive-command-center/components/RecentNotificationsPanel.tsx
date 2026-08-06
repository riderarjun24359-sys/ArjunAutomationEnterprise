"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import type { ExecutiveNotification } from "../types";

const severityClass: Record<ExecutiveNotification["severity"], string> = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-amber-100 text-amber-800",
    low: "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-tertiary)]",
};

export function RecentNotificationsSkeleton() {
    return (
        <Card aria-busy="true" aria-label="Loading notifications">
            <SkeletonLoader className="h-3 w-40" />
            <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                        <SkeletonLoader className="h-4 w-3/4" />
                        <SkeletonLoader className="mt-2 h-3 w-full" />
                        <SkeletonLoader className="mt-2 h-3 w-20" />
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function RecentNotificationsPanel({ notifications }: { notifications: ExecutiveNotification[] }) {
    return (
        <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                Recent Notifications
            </h3>
            <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                    <EmptyState
                        className="border-0 bg-transparent p-4"
                        title="No notifications"
                        description="Activity and audit events from your organization will show up here."
                    />
                ) : (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${severityClass[item.severity]}`}
                                >
                                    {item.severity}
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                                {item.time}
                                {item.source ? ` · ${item.source}` : ""}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
