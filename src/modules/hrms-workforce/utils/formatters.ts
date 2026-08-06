export function clampScore(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}

export function money(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100) / 100;
}

export function daysBetween(start: string, end: string): number {
    const a = new Date(start).getTime();
    const b = new Date(end).getTime();
    if (Number.isNaN(a) || Number.isNaN(b)) return 0;
    return Math.max(1, Math.floor((b - a) / 86400000) + 1);
}

export function employeeFullName(first: string, last: string): string {
    return `${first} ${last}`.trim();
}

export const HR_AUDIT_ENTITY_TYPES = [
    "employee",
    "department",
    "designation",
    "attendance",
    "leave",
    "payroll",
    "performance",
    "job_opening",
    "job_candidate",
    "onboarding",
    "offboarding",
    "hr",
] as const;
