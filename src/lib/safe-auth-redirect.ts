/**
 * Resolve an OAuth callback's post-login destination without allowing an
 * attacker-controlled next/redirectTo parameter to escape the application.
 */
export function resolveSafeAuthRedirect(input: {
    next: string | null;
    origin: string;
    fallback: string;
}): string {
    let base: URL;
    try {
        base = new URL(input.origin);
    } catch {
        return "/";
    }

    const fallback = new URL(input.fallback, base);
    const candidateValue = input.next?.trim();
    if (!candidateValue) return fallback.toString();
    // OAuth `next` is an application path, not an arbitrary relative URL.
    // Requiring one leading slash blocks @host, backslash and scheme tricks.
    if (!candidateValue.startsWith("/") || candidateValue.startsWith("//") || candidateValue.includes("\\\\")) {
        return fallback.toString();
    }

    try {
        const candidate = new URL(candidateValue, base);
        if (candidate.origin !== base.origin || candidate.username || candidate.password) {
            return fallback.toString();
        }
        return candidate.toString();
    } catch {
        return fallback.toString();
    }
}
