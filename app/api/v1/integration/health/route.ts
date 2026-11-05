import { NextRequest, NextResponse } from "next/server";
import { validateIntegrationApiKey } from "@/src/modules/integration-platform/lib/api-key-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const authorization = request.headers.get("authorization") ?? "";
    const match = /^Bearer ([^\s]+)$/i.exec(authorization);
    if (!match) {
        return NextResponse.json(
            { error: "A valid Bearer API key is required" },
            { status: 401, headers: { "WWW-Authenticate": "Bearer", "Cache-Control": "no-store" } },
        );
    }

    const credential = await validateIntegrationApiKey(match[1]);
    if (!credential) {
        return NextResponse.json(
            { error: "Invalid, expired, or revoked API key" },
            { status: 401, headers: { "WWW-Authenticate": "Bearer", "Cache-Control": "no-store" } },
        );
    }

    const hasReadScope = credential.scopes.some((scope) =>
        scope.scopeKey === "integration:health:read" &&
        (scope.permissions.includes("read") || scope.permissions.includes("*"))
    );

    if (!hasReadScope) {
        return NextResponse.json(
            { error: "The API key is missing the integration:health:read scope" },
            { status: 403, headers: { "Cache-Control": "no-store" } },
        );
    }

    return NextResponse.json(
        {
            status: "ok",
            apiVersion: credential.apiVersion,
            integrationHubId: credential.hubId,
        },
        { headers: { "Cache-Control": "no-store" } },
    );
}
