/**
 * Session security helpers — validation, expiry, refresh checks.
 * Does not change auth product flows; hardens server-side checks only.
 */

export interface SessionValidationResult {
    valid: boolean;
    reason?: "missing" | "expired" | "invalid_token" | "refresh_required";
    expiresAt?: string | null;
    expiresInSeconds?: number | null;
}

const CLOCK_SKEW_SECONDS = 30;

export function isSessionExpired(expiresAtIso: string | null | undefined, nowMs = Date.now()): boolean {
    if (!expiresAtIso) return true;
    const expiresMs = Date.parse(expiresAtIso);
    if (!Number.isFinite(expiresMs)) return true;
    return expiresMs <= nowMs + CLOCK_SKEW_SECONDS * 1000;
}

export function secondsUntilExpiry(expiresAtIso: string | null | undefined, nowMs = Date.now()): number | null {
    if (!expiresAtIso) return null;
    const expiresMs = Date.parse(expiresAtIso);
    if (!Number.isFinite(expiresMs)) return null;
    return Math.max(0, Math.floor((expiresMs - nowMs) / 1000));
}

export function validateAccessTokenShape(token: string | null | undefined): boolean {
    if (!token || typeof token !== "string") return false;
    const parts = token.split(".");
    return parts.length === 3 && parts.every((p) => p.length > 0);
}

export function buildSessionValidation(input: {
    accessToken?: string | null;
    expiresAt?: string | null;
    requireRefreshWindowSeconds?: number;
}): SessionValidationResult {
    if (!input.accessToken || !validateAccessTokenShape(input.accessToken)) {
        return { valid: false, reason: "invalid_token", expiresAt: input.expiresAt ?? null };
    }

    if (isSessionExpired(input.expiresAt)) {
        return { valid: false, reason: "expired", expiresAt: input.expiresAt ?? null, expiresInSeconds: 0 };
    }

    const expiresInSeconds = secondsUntilExpiry(input.expiresAt);
    const refreshWindow = input.requireRefreshWindowSeconds ?? 120;
    if (expiresInSeconds !== null && expiresInSeconds <= refreshWindow) {
        return {
            valid: true,
            reason: "refresh_required",
            expiresAt: input.expiresAt ?? null,
            expiresInSeconds,
        };
    }

    return { valid: true, expiresAt: input.expiresAt ?? null, expiresInSeconds };
}
