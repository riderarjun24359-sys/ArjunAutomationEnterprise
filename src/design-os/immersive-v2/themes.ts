export type ImmersiveDayPart = "morning" | "afternoon" | "evening" | "night";

export interface ImmersiveTheme {
    dayPart: ImmersiveDayPart;
    label: string;
    greeting: string;
    gradient: string;
    accent: string;
    lighting: string;
}

export function resolveDayPart(date = new Date()): ImmersiveDayPart {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
}

export function resolveImmersiveTheme(date = new Date()): ImmersiveTheme {
    const dayPart = resolveDayPart(date);
    switch (dayPart) {
        case "morning":
            return {
                dayPart,
                label: "Morning clarity",
                greeting: "Good morning",
                gradient: "radial-gradient(1200px 600px at 12% -10%, rgba(99,102,241,0.22), transparent 55%), radial-gradient(900px 500px at 88% 0%, rgba(6,182,212,0.16), transparent 50%)",
                accent: "rgba(99, 102, 241, 0.35)",
                lighting: "0 0 80px rgba(99,102,241,0.12)",
            };
        case "afternoon":
            return {
                dayPart,
                label: "Afternoon focus",
                greeting: "Good afternoon",
                gradient: "radial-gradient(1100px 580px at 8% -8%, rgba(67,56,202,0.18), transparent 55%), radial-gradient(860px 480px at 92% 8%, rgba(16,185,129,0.12), transparent 48%)",
                accent: "rgba(16, 185, 129, 0.28)",
                lighting: "0 0 72px rgba(16,185,129,0.1)",
            };
        case "evening":
            return {
                dayPart,
                label: "Evening momentum",
                greeting: "Good evening",
                gradient: "radial-gradient(1200px 620px at 10% -12%, rgba(139,92,246,0.22), transparent 54%), radial-gradient(900px 520px at 90% 4%, rgba(245,158,11,0.12), transparent 50%)",
                accent: "rgba(139, 92, 246, 0.32)",
                lighting: "0 0 88px rgba(139,92,246,0.14)",
            };
        default:
            return {
                dayPart,
                label: "Night operations",
                greeting: "Welcome back",
                gradient: "radial-gradient(1100px 600px at 14% -10%, rgba(67,56,202,0.28), transparent 52%), radial-gradient(820px 460px at 86% 6%, rgba(6,182,212,0.14), transparent 48%)",
                accent: "rgba(6, 182, 212, 0.3)",
                lighting: "0 0 96px rgba(6,182,212,0.12)",
            };
    }
}

export function personalizeGreeting(theme: ImmersiveTheme, fullName?: string | null): string {
    const first = (fullName ?? "").trim().split(/\s+/)[0];
    if (first) return `${theme.greeting}, ${first}`;
    return theme.greeting;
}
