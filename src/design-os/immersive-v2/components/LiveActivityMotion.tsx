"use client";

import { ActivityFeed, type ActivityItem } from "@/src/design-os/dashboard/ActivityFeed";
import { cn } from "@/src/lib/cn";

/** Live activity feed animations reuse Design OS ActivityFeed (layout-aware). */
export function LiveActivityMotion({
    items,
    className,
}: {
    items: ActivityItem[];
    className?: string;
}) {
    return (
        <div className={cn("immersive-live-activity", className)}>
            <ActivityFeed items={items} />
        </div>
    );
}
