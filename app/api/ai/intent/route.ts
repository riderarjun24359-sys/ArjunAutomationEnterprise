import { NextRequest, NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";
import { IntentResponseSchema } from "@/src/design-os/navigation/intent";

/**
 * Command-palette intent interpretation.
 *
 * Requires an authenticated session and is rate-limited (30/min). The
 * interpretation itself is NOT implemented yet (`interpretIntent` is an
 * explicit stub that returns null), so this endpoint reports 501 Not
 * Implemented with an explicit reason instead of a misleading generic 400.
 * The client falls back to local command/entity search on any non-OK status.
 */
export async function POST(req: NextRequest) {
    const { context, error } = await secureApiRoute(req, {
        rateLimitKey: "ai-intent",
        rateLimit: 30,
    });
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const rawInput = (body as { rawInput?: unknown } | null)?.rawInput;
    if (typeof rawInput !== "string" || rawInput.trim().length === 0) {
        return NextResponse.json({ error: "rawInput is required" }, { status: 400 });
    }

    const response = await aiOrchestrationService.interpretIntent(
        context.user.id,
        context.user.email,
        { rawInput: rawInput.trim() },
        context.user.fullName,
    );

    if (!response) {
        return NextResponse.json(
            {
                error: "Intent interpretation is not implemented",
                code: "not_implemented",
                detail: "Local command and entity search remain available in the palette.",
            },
            { status: 501 },
        );
    }

    const validation = IntentResponseSchema.safeParse(response);
    if (!validation.success) {
        return NextResponse.json({ error: "Invalid intent format" }, { status: 502 });
    }

    const { primaryIntent, candidates } = validation.data;

    // Validate primaryIntent
    if (primaryIntent && !aiOrchestrationService.validateIntent(primaryIntent.moduleHref)) {
        return NextResponse.json({ error: "Unauthorized or invalid route" }, { status: 403 });
    }

    // Validate candidates
    const authorizedCandidates = candidates.filter(c => aiOrchestrationService.validateIntent(c.moduleHref));

    return NextResponse.json({
        primaryIntent,
        candidates: authorizedCandidates
    });
}
