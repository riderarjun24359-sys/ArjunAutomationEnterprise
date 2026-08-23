import { NextRequest, NextResponse } from "next/server";
import { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";
import { IntentResponseSchema } from "@/src/design-os/navigation/intent";

export async function POST(req: NextRequest) {
    const { rawInput } = await req.json();
    const authUserId = "system";
    const email = "system@arjunautomation.com";

    // Mock response for now: interpretIntent stub returns null
    const response = await aiOrchestrationService.interpretIntent(authUserId, email, { rawInput });

    if (!response) {
        return NextResponse.json({ error: "Failed to interpret intent" }, { status: 400 });
    }

    const validation = IntentResponseSchema.safeParse(response);
    if (!validation.success) {
        return NextResponse.json({ error: "Invalid intent format" }, { status: 400 });
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
