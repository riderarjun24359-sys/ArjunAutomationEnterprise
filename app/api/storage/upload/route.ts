import { NextResponse } from "next/server";
import { secureApiRoute, apiError, apiSuccess, logApiAudit } from "@/src/lib/api-security";
import { supabaseServer } from "@/src/lib/supabase-server";
import {
    DEFAULT_STORAGE_BUCKET,
    STORAGE_MAX_BYTES,
    buildObjectPath,
    validateUploadInput,
} from "@/src/lib/storage-security";
import { measureAsync, opsLog, enqueueAlert } from "@/src/lib/ops-monitoring";

export async function POST(request: Request) {
    const { context, error } = await secureApiRoute(request, { rateLimit: 20, rateLimitKey: "storage-upload" });
    if (error) return error;
    if (!context?.organizationId) {
        return apiError("Organization context required", 403);
    }

    const form = await request.formData().catch(() => null);
    if (!form) return apiError("Expected multipart form data", 400);

    const file = form.get("file");
    if (!(file instanceof File)) {
        return apiError("Missing file field", 400);
    }

    const validation = validateUploadInput({
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
    });
    if (!validation.ok) {
        return apiError(validation.error ?? "Upload validation failed", 400);
    }

    const client = await supabaseServer();
    if (!client) {
        return apiError("Storage unavailable", 503);
    }

    const objectPath = buildObjectPath(context.organizationId, context.user.id, validation.normalizedName ?? file.name);
    const bucket = DEFAULT_STORAGE_BUCKET;

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploaded = await measureAsync("storage.upload", async () => {
            return client.storage.from(bucket).upload(objectPath, buffer, {
                contentType: validation.mime,
                upsert: false,
            });
        });

        if (uploaded.error) {
            opsLog("error", "Storage upload failed", "api/storage/upload", { message: uploaded.error.message });
            enqueueAlert("warning", "Storage upload failed", uploaded.error.message, "storage");
            return apiError(uploaded.error.message, 502);
        }

        await logApiAudit({
            action: "create",
            userId: context.user.id,
            organizationId: context.organizationId,
            metadata: { bucket, path: objectPath, mime: validation.mime, size: validation.size },
        });

        return apiSuccess({
            bucket,
            path: objectPath,
            mime: validation.mime,
            size: validation.size,
            maxBytes: STORAGE_MAX_BYTES,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        return apiError(message, 500);
    }
}

export async function GET() {
    return NextResponse.json({
        maxBytes: STORAGE_MAX_BYTES,
        bucket: DEFAULT_STORAGE_BUCKET,
        allowedMime: (await import("@/src/lib/storage-security")).STORAGE_ALLOWED_MIME,
    });
}
