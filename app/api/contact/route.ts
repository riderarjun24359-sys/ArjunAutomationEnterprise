import { NextResponse } from "next/server";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { notifyOwnerOfLead } from "@/src/lib/lead-notify";

export async function POST(request: Request) {
    const rate = await checkRateLimit("public-contact-form", 8, 60_000);
    if (!rate.allowed) return NextResponse.json({ success: false, error: "Please wait before sending another enquiry." }, { status: 429 });

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: "Invalid form submission." }, { status: 400 });
    }
    if (!body || typeof body !== "object") return NextResponse.json({ success: false, error: "Invalid form submission." }, { status: 400 });

    const data = body as Record<string, unknown>;
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const phone = typeof data.phone === "string" ? data.phone.trim() : "";
    const businessType = typeof data.businessType === "string" ? data.businessType.trim() : "";
    const message = typeof data.message === "string" ? data.message.trim() : "";
    const honeypot = typeof data.website === "string" ? data.website.trim() : "";

    if (honeypot) return NextResponse.json({ success: true, emailSent: false });
    if (!name || name.length > 120 || !/^[6-9][0-9]{9}$/.test(phone) || !["School", "College", "Shop or Supermarket", "Clinic", "Other"].includes(businessType) || !message || message.length > 2000) {
        return NextResponse.json({ success: false, error: "Please check your details and try again." }, { status: 400 });
    }

    const env = {
        ...process.env,
        LEAD_OWNER_EMAIL: process.env.LEAD_OWNER_EMAIL?.trim() || process.env.NEXT_PUBLIC_COMPANY_EMAIL?.trim() || "",
    };
    const notification = await notifyOwnerOfLead({
        leadId: crypto.randomUUID(),
        leadName: name,
        leadEmail: "",
        company: businessType,
        phone,
        message,
        source: "website-contact-form",
        consentVersion: "contact-form-submission",
        receivedAt: new Date().toISOString(),
    }, { env });

    return NextResponse.json({ success: true, emailSent: notification.ok });
}
