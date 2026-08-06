/**
 * Storage security — MIME allowlist, size limits, path validation.
 * No schema changes; used by secure upload / signed-url APIs.
 */

export const STORAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export const STORAGE_ALLOWED_MIME = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export type StorageAllowedMime = (typeof STORAGE_ALLOWED_MIME)[number];

export const DEFAULT_STORAGE_BUCKET = "organization-uploads";

export interface StorageValidationResult {
    ok: boolean;
    error?: string;
    normalizedName?: string;
    mime?: string;
    size?: number;
}

const SAFE_NAME = /^[a-zA-Z0-9._-]+$/;

export function sanitizeFileName(name: string): string {
    const base = name.split(/[/\\]/).pop() ?? "file";
    const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180);
    return cleaned.length > 0 ? cleaned : `file-${Date.now()}`;
}

export function isAllowedMime(mime: string | null | undefined): mime is StorageAllowedMime {
    if (!mime) return false;
    return (STORAGE_ALLOWED_MIME as readonly string[]).includes(mime.toLowerCase());
}

export function validateUploadInput(input: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
}): StorageValidationResult {
    const normalizedName = sanitizeFileName(input.fileName);
    if (!SAFE_NAME.test(normalizedName)) {
        return { ok: false, error: "Invalid file name" };
    }
    if (!isAllowedMime(input.mimeType)) {
        return { ok: false, error: `MIME type not allowed: ${input.mimeType || "unknown"}` };
    }
    if (!Number.isFinite(input.sizeBytes) || input.sizeBytes <= 0) {
        return { ok: false, error: "Invalid file size" };
    }
    if (input.sizeBytes > STORAGE_MAX_BYTES) {
        return { ok: false, error: `File exceeds ${STORAGE_MAX_BYTES} byte limit` };
    }
    return {
        ok: true,
        normalizedName,
        mime: input.mimeType.toLowerCase(),
        size: input.sizeBytes,
    };
}

export function buildObjectPath(organizationId: string, profileId: string, fileName: string): string {
    const safeOrg = organizationId.replace(/[^a-zA-Z0-9-]/g, "");
    const safeProfile = profileId.replace(/[^a-zA-Z0-9-]/g, "");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `${safeOrg}/${safeProfile}/${stamp}-${sanitizeFileName(fileName)}`;
}

export function validateSignedUrlRequest(input: {
    bucket?: string;
    path?: string;
    expiresIn?: number;
}): { ok: boolean; error?: string; bucket: string; path: string; expiresIn: number } {
    const bucket = (input.bucket || DEFAULT_STORAGE_BUCKET).trim();
    const path = (input.path || "").trim();
    const expiresIn = input.expiresIn ?? 300;

    if (!bucket || bucket.includes("..")) {
        return { ok: false, error: "Invalid bucket", bucket, path, expiresIn };
    }
    if (!path || path.includes("..") || path.startsWith("/")) {
        return { ok: false, error: "Invalid object path", bucket, path, expiresIn };
    }
    if (!Number.isFinite(expiresIn) || expiresIn < 30 || expiresIn > 3600) {
        return { ok: false, error: "expiresIn must be between 30 and 3600 seconds", bucket, path, expiresIn };
    }
    return { ok: true, bucket, path, expiresIn };
}
