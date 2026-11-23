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

    // Signed URLs are restricted to the dedicated tenant-upload bucket.
    // Accepting arbitrary bucket names here could expose unrelated/private
    // storage namespaces even when the object path has an organization prefix.
    if (bucket !== DEFAULT_STORAGE_BUCKET) {
        return { ok: false, error: "Bucket is not allowed", bucket, path, expiresIn };
    }
    if (!path || path.includes("..") || path.startsWith("/")) {
        return { ok: false, error: "Invalid object path", bucket, path, expiresIn };
    }
    if (!Number.isFinite(expiresIn) || expiresIn < 30 || expiresIn > 3600) {
        return { ok: false, error: "expiresIn must be between 30 and 3600 seconds", bucket, path, expiresIn };
    }
    return { ok: true, bucket, path, expiresIn };
}


/**
 * Verify that uploaded bytes match the declared media type before storage.
 * Browser-provided File.type is user-controlled and is not a content check.
 */
export function validateFileContent(mime: string, bytes: Uint8Array): boolean {
    if (bytes.byteLength === 0) return false;
    const startsWith = (...signature: number[]) =>
        signature.every((value, index) => bytes[index] === value);
    const asciiAt = (offset: number, value: string) =>
        Array.from(value).every((character, index) => bytes[offset + index] === character.charCodeAt(0));

    switch (mime.toLowerCase()) {
        case "image/png":
            return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
        case "image/jpeg":
            return startsWith(0xff, 0xd8, 0xff);
        case "image/gif":
            return asciiAt(0, "GIF87a") || asciiAt(0, "GIF89a");
        case "image/webp":
            return asciiAt(0, "RIFF") && asciiAt(8, "WEBP");
        case "application/pdf":
            return asciiAt(0, "%PDF-");
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            // Office Open XML documents are ZIP containers.
            return startsWith(0x50, 0x4b, 0x03, 0x04) ||
                startsWith(0x50, 0x4b, 0x05, 0x06) ||
                startsWith(0x50, 0x4b, 0x07, 0x08);
        case "text/plain":
        case "text/csv":
            try {
                const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
                return !text.includes("\\u0000");
            } catch {
                return false;
            }
        default:
            return false;
    }
}
