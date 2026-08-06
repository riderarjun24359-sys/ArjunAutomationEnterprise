export function clampScore(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}

export function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object" && "name" in item) return String((item as { name: unknown }).name);
            return JSON.stringify(item);
        })
        .filter(Boolean);
}

export function mapComplianceFramework(raw: string): "ISO 27001" | "SOC 2" | "GDPR" | "Other" {
    const v = raw.toLowerCase();
    if (v.includes("iso") || v.includes("27001")) return "ISO 27001";
    if (v.includes("soc")) return "SOC 2";
    if (v.includes("gdpr") || v.includes("privacy")) return "GDPR";
    return "Other";
}
