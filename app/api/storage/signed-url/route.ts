import { secureApiRoute, apiError, apiSuccess, logApiAudit } from "@/src/lib/api-security";
import { supabaseServer } from "@/src/lib/supabase-server";
import { validateSignedUrlRequest } from "@/src/lib/storage-security";
import { measureAsync, opsLog } from "@/src/lib/ops-monitoring";

export async function POST(request: Request) {
    const { context, error } = await secureApiRoute(request, { rateLimit: 40, rateLimitKey: "storage-signed-url" });
    if (error) return error;
    if (!context?.organizationId) {
        return apiError("Organization context required", 403);
    }

    const body = (await request.json().catch(() => null)) as
        | { bucket?: string; path?: string; expiresIn?: number }
        | null;
    if (!body) return apiError("Invalid JSON body", 400);

    const validated = validateSignedUrlRequest(body);
    if (!validated.ok) {
        return apiError(validated.error ?? "Invalid signed URL request", 400);
    }

    if (!validated.path.startsWith(`${context.organizationId}/`)) {
        return apiError("Object path is outside organization scope", 403);
    }

    const client = await supabaseServer();
    if (!client) return apiError("Storage unavailable", 503);

    try {
        const result = await measureAsync("storage.signedUrl", async () => {
            return client.storage.from(validated.bucket).createSignedUrl(validated.path, validated.expiresIn);
        });

        if (result.error || !result.data?.signedUrl) {
            opsLog("warn", "Signed URL creation failed", "api/storage/signed-url", {
                message: result.error?.message,
            });
            return apiError(result.error?.message ?? "Unable to create signed URL", 502);
        }

        await logApiAudit({
            action: "view",
            userId: context.user.id,
            organizationId: context.organizationId,
            metadata: { bucket: validated.bucket, path: validated.path, expiresIn: validated.expiresIn },
        });

        return apiSuccess({
            bucket: validated.bucket,
            path: validated.path,
            expiresIn: validated.expiresIn,
            signedUrl: result.data.signedUrl,
        });
    } catch (err) {
        return apiError(err instanceof Error ? err.message : "Signed URL failed", 500);
    }
}
