import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { notifyOwnerOfLead } from "@/src/lib/lead-notify";

const clean = (value: unknown, max: number) =>
    typeof value === "string" ? value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";

const allowedBusinessTypes = ["School", "College", "Shop or Supermarket", "Clinic", "Other"];

export async function POST(request: Request) {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
    const ipKey = createHash("sha256").update(ip).digest("hex");
    const rate = await checkRateLimit(`website-contact:${ipKey}`, 5, 60 * 60 * 1000);
    if (!rate.allowed) {
        return NextResponse.json({ success: false, error: "Please wait before sending another enquiry." }, { status: 429 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: "Invalid form submission." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
        return NextResponse.json({ success: false, error: "Invalid form submission." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    if (clean(data.website, 200)) return NextResponse.json({ success: true });

    const name = clean(data.name, 120);
    const phone = clean(data.phone, 10);
    const email = clean(data.email, 254);
    const businessType = clean(data.businessType, 40);
    const message = clean(data.message, 1000);
    const consent = data.consent === true;

    if (
        name.length < 1 ||
        !/^[6-9]\d{9}$/.test(phone) ||
        (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
        !allowedBusinessTypes.includes(businessType) ||
        message.length < 10 ||
        message.length > 1000 ||
        !consent
    ) {
        return NextResponse.json({ success: false, error: "Please check all required details and try again." }, { status: 400 });
    }

    const notification = await notifyOwnerOfLead({
        leadId: crypto.randomUUID(),
        leadName: name,
        leadEmail: email,
        company: businessType,
        phone,
        message,
        source: "website-contact-form",
        consentVersion: "contact-enquiry-consent-v1",
        receivedAt: new Date().toISOString(),
    }, {
        env: {
            ...process.env,
            LEAD_OWNER_EMAIL: "sales@arjunautomations.com",
        },
    });

    if (!notification.ok) {
        return NextResponse.json({ success: false, error: "Could not send your enquiry." }, { status: 503 });
    }

    return NextResponse.json({ success: true });
}
