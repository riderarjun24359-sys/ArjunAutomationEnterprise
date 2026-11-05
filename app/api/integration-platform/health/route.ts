import { NextResponse } from "next/server";
import { verifyIntegrationApiKey } from "@/src/lib/integration-api-key-auth";

/**
 * Minimal authenticated health endpoint for integration clients.
 * All protected integration API routes should reuse verifyIntegrationApiKey.
 */
export async function GET(request: Request) {
    const authorization = request.headers.get("authorization") ?? "";
    const match = /^Bearer\s+(.+)$/i.exec(authorization);
    if (!match) {
        return NextResponse.json({ error: "API key required" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    const verified = await verifyIntegrationApiKey(match[1].trim());
    if (!verified) {
        return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json(
        { ok: true, apiVersion: verified.apiVersion, service: "Arjun Automation Enterprise Integration API" },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}
