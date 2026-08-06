import type { OrganizationOperationsData } from "./organization-operations-data.service";
import type { ActivityModuleFilter, ActivityTimelineItem } from "../types";

export function formatRelativeTimestamp(iso: string, nowMs = Date.now()): string {
    const diffMs = nowMs - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
    const months = Math.floor(days / 30);
    return `${months} mo ago`;
}

export function mapEntityTypeToModule(entityType: string | null | undefined): ActivityModuleFilter {
    const t = (entityType ?? "").toLowerCase();
    if (["client", "contact", "company", "lead", "sales_lead", "opportunity", "crm"].some((k) => t.includes(k))) {
        return "crm";
    }
    if (["project", "milestone"].some((k) => t.includes(k))) return "projects";
    if (["task"].some((k) => t.includes(k))) return "tasks";
    if (["invoice", "payment", "expense", "estimate", "finance", "billing"].some((k) => t.includes(k))) {
        return "finance";
    }
    return "system";
}

export function buildActivityTimeline(data: OrganizationOperationsData, nowMs = Date.now()): ActivityTimelineItem[] {
    const fromActivities = data.activities.map((a) => ({
        id: `act-${a.id}`,
        title: a.title || `${a.action} ${a.entity_type}`,
        detail: a.detail || `${a.entity_type} · ${a.action}`,
        module: mapEntityTypeToModule(a.entity_type),
        entityType: a.entity_type,
        action: a.action,
        occurredAt: a.created_at,
        relativeTime: formatRelativeTimestamp(a.created_at, nowMs),
        source: "activity" as const,
    }));

    const fromAudits = data.audits.map((log) => ({
        id: `audit-${log.id}`,
        title: `${log.action} ${log.entity_type ?? "record"}`,
        detail: log.entity_type ? `${log.entity_type} ${log.entity_id ?? ""}`.trim() : "System audit event",
        module: mapEntityTypeToModule(log.entity_type),
        entityType: log.entity_type ?? "system",
        action: String(log.action),
        occurredAt: log.created_at,
        relativeTime: formatRelativeTimestamp(log.created_at, nowMs),
        source: "audit" as const,
    }));

    return [...fromActivities, ...fromAudits]
        .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
        .slice(0, 40);
}

export function filterActivityTimeline(
    items: ActivityTimelineItem[],
    module: ActivityModuleFilter | "all",
): ActivityTimelineItem[] {
    if (module === "all") return items;
    return items.filter((item) => item.module === module);
}
