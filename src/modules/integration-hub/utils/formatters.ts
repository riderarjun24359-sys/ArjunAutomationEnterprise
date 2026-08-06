export function clampScore(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}

export function normalizeProvider(value: string): string {
    return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function providerCategory(
    provider: string,
): "productivity" | "messaging" | "payments" | "meetings" | "other" {
    const p = normalizeProvider(provider);
    if (p.includes("stripe") || p.includes("razorpay") || p.includes("payment")) return "payments";
    if (p.includes("slack") || p.includes("whatsapp")) return "messaging";
    if (p.includes("zoom") || p.includes("meet")) return "meetings";
    if (p.includes("google") || p.includes("microsoft") || p.includes("office")) return "productivity";
    return "other";
}

export function displayProviderName(provider: string): string {
    const map: Record<string, string> = {
        google_workspace: "Google Workspace",
        microsoft_365: "Microsoft 365",
        slack: "Slack",
        whatsapp_business: "WhatsApp Business",
        stripe: "Stripe",
        razorpay: "Razorpay",
        zoom: "Zoom",
    };
    const key = normalizeProvider(provider);
    return map[key] ?? provider.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
