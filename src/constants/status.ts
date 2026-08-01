export const ENTITY_STATUS = {
    draft: "draft",
    pending: "pending",
    active: "active",
    completed: "completed",
    cancelled: "cancelled",
    archived: "archived",
} as const;

export type EntityStatus = (typeof ENTITY_STATUS)[keyof typeof ENTITY_STATUS];

export const STATUS_STYLES: Record<EntityStatus, string> = {
    draft: "bg-slate-100 text-slate-700",
    pending: "bg-amber-100 text-amber-700",
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-rose-100 text-rose-700",
    archived: "bg-zinc-100 text-zinc-700",
};
