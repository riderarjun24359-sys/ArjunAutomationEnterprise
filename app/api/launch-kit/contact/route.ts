import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required").max(200),
    email: z.string().email("Valid email is required"),
    company: z.string().max(200).optional().default(""),
    phone: z.string().max(50).optional().default(""),
    message: z.string().max(5000).optional().default(""),
    source: z.string().min(1).max(100),
});

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const parsed = contactSchema.safeParse(body);

        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message ?? "Invalid form data";
            return NextResponse.json({ success: false, error: firstError }, { status: 400 });
        }

        const { name, email, company, phone, message, source } = parsed.data;

        // Log lead submission (no secrets, no external API calls)
        console.info("[launch-kit/contact]", {
            timestamp: new Date().toISOString(),
            source,
            name,
            email,
            company: company || undefined,
            phone: phone || undefined,
            messageLength: message.length,
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
}
