import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { createSarvamInboundDeployment } from "@/src/modules/ai-voice-agent/providers/sarvam-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 3,
    });
    if (secured.error) return secured.error;
    if (!secured.context?.organizationId) {
        return NextResponse.json({ error: "Organization context is required" }, { status: 403 });
    }

    if (process.env.ARJUN_VOICE_INBOUND_ENABLED !== "true") {
        return NextResponse.json({ error: "Inbound deployment is disabled until the agent and telephony number have passed manual testing" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (body.confirmGoLive !== true) {
        return NextResponse.json({ error: "Explicit confirmGoLive=true is required because this action activates the inbound phone line" }, { status: 400 });
    }

    try {
        const deployment = await createSarvamInboundDeployment({
            organizationId: secured.context.organizationId,
            name: "Arjun AI Inbound",
        });
        return NextResponse.json({
            success: true,
            deploymentId: deployment.deployment_id,
            status: deployment.status ?? "active",
            direction: deployment.channel_direction ?? "inbound",
        }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Could not create inbound deployment. Check the Sarvam connection and environment configuration." }, { status: 502 });
    }
}
