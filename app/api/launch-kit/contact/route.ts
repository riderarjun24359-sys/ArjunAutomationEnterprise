import { NextResponse } from "next/server";
import { z } from "zod";
import { secureApiRoute, logApiAudit } from "@/src/lib/api-security";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required").max(200),
    email: z.string().email("Valid email is required"),
    company: z.string().max(200).optional().default(""),
    phone: z.string().max(50).optional().default(""),
    message: z.string().max(5000).optional().default(""),
    source: z.string().min(1).max(100),
});

export async function POST(request: Request) {
    const { context, error } = await secureApiRoute(request, {
        allowPublic: true,
        publicApiKeyEnv: "PLATFORM_LEAD_API_KEY",
        rateLimit: 10,
        rateLimitKey: "lead-intake",
    });
    if (error || !context) return error ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body: unknown = await request.json();
        const parsed = contactSchema.safeParse(body);

        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message ?? "Invalid form data";
            return NextResponse.json({ success: false, error: firstError }, { status: 400 });
        }

        const { name, email, company, phone, message, source } = parsed.data;

        const { customerJourneyService } = await import("@/src/modules/mission-core/services/customer-journey.service");
        const leadResult = await customerJourneyService.intakeLead(
            { name, email, company, phone, message, source },
            {
                authUserId: context.user.id,
                email: context.user.email,
                fullName: context.user.fullName,
                organizationId: context.organizationId,
            },
        );

        await logApiAudit({
            action: "lead_captured",
            userId: context.user.id,
            organizationId: context.organizationId,
            metadata: { email, source, processed: leadResult.processed },
        });

        return NextResponse.json({ success: true, lead: leadResult });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid request";
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
