import { readFileSync, existsSync } from "node:fs";
import { NextResponse } from "next/server";
import { verifyBrandBookCompleteness } from "@/src/modules/brand-os/lib/completeness";
import { BRAND_DOCUMENTS } from "@/src/modules/brand-os/lib/documents";
import { resolveBrandOsContentPath } from "@/src/modules/brand-os/lib/content-path";
import { secureApiRoute, logApiAudit } from "@/src/lib/api-security";

interface RouteContext {
    params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
    const { context: authCtx, error } = await secureApiRoute(request, { permission: "settingsManage", rateLimit: 60 });
    if (error || !authCtx) return error ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await context.params;
    const doc = BRAND_DOCUMENTS[slug];

    if (!doc) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const fullPath = resolveBrandOsContentPath(doc.path);
    if (!existsSync(fullPath)) {
        return NextResponse.json({ error: "Content file missing" }, { status: 404 });
    }

    const content = readFileSync(fullPath, "utf8");
    const payload: { content: string; completeness?: ReturnType<typeof verifyBrandBookCompleteness> } = { content };

    if (slug === "brand-book") {
        payload.completeness = verifyBrandBookCompleteness(content);
    }

    await logApiAudit({
        action: "brand_document_access",
        userId: authCtx.user.id,
        organizationId: authCtx.organizationId,
        metadata: { slug },
    });

    return NextResponse.json(payload);
}
