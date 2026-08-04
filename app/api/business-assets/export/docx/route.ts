import { NextResponse } from "next/server";
import { secureApiRoute, logApiAudit } from "@/src/lib/api-security";

export async function POST(request: Request) {
    const { context, error } = await secureApiRoute(request, { permission: "clientsManage", rateLimit: 30 });
    if (error || !context) return error ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { title, content, html } = body as {
            title?: string;
            content?: string;
            html?: string;
        };

        if (!title) {
            return NextResponse.json({ error: "title required" }, { status: 400 });
        }

        const docHtml = html ?? `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/><title>${title}</title></head><body><h1>${title}</h1><pre>${content ?? ""}</pre></body></html>`;

        await logApiAudit({
            action: "docx_export",
            userId: context.user.id,
            organizationId: context.organizationId,
            metadata: { title },
        });

        return new NextResponse(docHtml, {
            headers: {
                "Content-Type": "application/msword",
                "Content-Disposition": `attachment; filename="${title.replace(/[^a-z0-9-_]/gi, "-")}.doc"`,
            },
        });
    } catch {
        return NextResponse.json({ error: "DOCX generation failed" }, { status: 500 });
    }
}
