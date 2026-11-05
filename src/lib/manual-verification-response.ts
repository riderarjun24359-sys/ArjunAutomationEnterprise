/**
 * Validate the redirect returned by Supabase's email verification endpoint.
 * A 3xx alone is not proof of success: Supabase also redirects failed
 * verification attempts to the configured callback with error parameters.
 */
export function isSuccessfulManualVerifyRedirect(input: {
    status: number;
    location: string | null;
    appOrigin?: string;
}): boolean {
    if (input.status < 300 || input.status >= 400 || !input.location) return false;

    let destination: URL;
    try {
        destination = new URL(input.location, "https://project.supabase.co");
    } catch {
        return false;
    }

    const appOrigin = input.appOrigin ?? "https://www.arjunautomations.com";
    if (destination.origin !== appOrigin || destination.pathname !== "/auth/callback") return false;
    if (destination.searchParams.has("error") || destination.searchParams.has("error_code")) return false;

    // Supabase returns a PKCE code or an implicit-flow access token after a
    // successful verify. An empty redirect is not sufficient evidence.
    return Boolean(
        destination.searchParams.get("code") ||
        destination.hash.includes("access_token=") ||
        destination.hash.includes("refresh_token="),
    );
}
