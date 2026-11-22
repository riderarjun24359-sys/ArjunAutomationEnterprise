import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
    const secret = process.env.PRIYA_SALES_TOOL_SECRET;
    const header = request.headers.get("authorization") ?? "";
    if (!secret || !header.startsWith("Bearer ")) return false;
    const supplied = Buffer.from(header.slice(7));
    const expected = Buffer.from(secret);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function clean(value: unknown, max: number): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
    if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    const bookingUrl = process.env.N8N_DEMO_BOOKING_WEBHOOK_URL?.trim();
    const bookingSecret = process.env.N8N_DEMO_BOOKING_WEBHOOK_SECRET;
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Sales organization is not configured" }, { status: 503 });
    }
    if (!bookingUrl || !bookingSecret) {
        return NextResponse.json({ error: "Google Calendar demo booking is not configured" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const leadId = clean(body.leadId, 80);
    const startAt = typeof body.startAt === "string" ? new Date(body.startAt) : new Date(NaN);
    const attendeeName = clean(body.attendeeName, 120);
    const attendeeEmail = clean(body.attendeeEmail, 254).toLowerCase();

    if (!leadId || Number.isNaN(startAt.getTime())) {
        return NextResponse.json({ error: "A CRM lead ID and ISO date-time are required" }, { status: 400 });
    }
    if (startAt.getTime() < Date.now() + 5 * 60_000 || startAt.getTime() > Date.now() + 30 * 24 * 60 * 60_000) {
        return NextResponse.json({ error: "Demo time must be at least five minutes from now and within 30 days" }, { status: 400 });
    }
    if (attendeeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail)) {
        return NextResponse.json({ error: "Invalid attendee email" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "CRM storage is not configured" }, { status: 503 });

    const { data: lead, error: leadError } = await client.from("sales_leads")
        .select("id, lead_name, company_name, email, phone")
        .eq("id", leadId)
        .eq("organization_id", organizationId)
        .maybeSingle();

    if (leadError) return NextResponse.json({ error: "Could not verify CRM lead" }, { status: 500 });
    if (!lead) return NextResponse.json({ error: "CRM lead not found" }, { status: 404 });

    const startIso = startAt.toISOString();
    const endIso = new Date(startAt.getTime() + 20 * 60_000).toISOString();

    const { data: localMeetings, error: meetingsError } = await client.from("sales_meetings")
        .select("id, scheduled_at, duration_minutes")
        .eq("organization_id", organizationId)
        .eq("status", "scheduled")
        .gte("scheduled_at", new Date(startAt.getTime() - 24 * 60 * 60_000).toISOString())
        .lte("scheduled_at", new Date(startAt.getTime() + 20 * 60_000).toISOString());

    if (meetingsError) return NextResponse.json({ error: "Could not verify existing CRM meetings" }, { status: 500 });

    const overlaps = (localMeetings ?? []).some((meeting) => {
        const existingStart = new Date(meeting.scheduled_at).getTime();
        const existingEnd = existingStart + Number(meeting.duration_minutes ?? 20) * 60_000;
        return startAt.getTime() < existingEnd && startAt.getTime() + 20 * 60_000 > existingStart;
    });
    if (overlaps) {
        return NextResponse.json({
            success: false,
            available: false,
            alternatives: [],
            message: "That slot conflicts with an existing Arjun Automation meeting. Ask the caller for another time; do not claim an alternative is free until the calendar service checks it.",
        }, { status: 409 });
    }

    let calendarResult: Record<string, unknown>;
    try {
        const response = await fetch(bookingUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${bookingSecret}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                leadId,
                leadName: attendeeName || lead.lead_name,
                companyName: lead.company_name,
                attendeeEmail: attendeeEmail || lead.email,
                attendeePhone: lead.phone,
                startAt: startIso,
                endAt: endIso,
                durationMinutes: 20,
                timeZone: "Asia/Kolkata",
            }),
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) return NextResponse.json({ error: "Calendar booking service is temporarily unavailable" }, { status: 502 });
        calendarResult = await response.json() as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Calendar booking service timed out" }, { status: 504 });
    }

    if (calendarResult.status === "busy" || calendarResult.available === false) {
        return NextResponse.json({
            success: false,
            available: false,
            alternatives: Array.isArray(calendarResult.alternatives) ? calendarResult.alternatives : [],
            message: "The requested Google Calendar slot is busy.",
        }, { status: 409 });
    }

    const eventId = clean(calendarResult.eventId, 200);
    const meetLink = clean(calendarResult.meetLink, 500);
    if (calendarResult.status !== "booked" || !eventId || !/^https:\/\//i.test(meetLink)) {
        return NextResponse.json({ error: "Calendar service returned an incomplete booking response" }, { status: 502 });
    }

    const { data: meeting, error: meetingInsertError } = await client.from("sales_meetings")
        .insert({
            organization_id: organizationId,
            lead_id: leadId,
            title: `ArjunAutomations Demo — ${attendeeName || lead.lead_name}`,
            location: "Google Meet",
            meeting_url: meetLink,
            scheduled_at: startIso,
            duration_minutes: 20,
            status: "scheduled",
            attendee_names: attendeeName || lead.lead_name,
        })
        .select("id, title, meeting_url, scheduled_at, duration_minutes")
        .single();

    if (meetingInsertError || !meeting) {
        return NextResponse.json({
            success: false,
            calendarEventCreated: true,
            eventId,
            meetLink,
            error: "Google Calendar event was created but CRM meeting record needs reconciliation",
        }, { status: 202 });
    }

    const { data: activeDeal } = await client.from("ai_sales_deals")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("lead_id", leadId)
        .not("stage", "in", "(won,lost)")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (activeDeal) {
        await client.from("ai_sales_deals").update({
            stage: "demo_booked",
            next_action_at: startIso,
            updated_at: new Date().toISOString(),
        }).eq("id", activeDeal.id).eq("organization_id", organizationId);
    } else {
        await client.from("ai_sales_deals").insert({
            organization_id: organizationId,
            lead_id: leadId,
            stage: "demo_booked",
            next_action_at: startIso,
        });
    }

    await client.from("sales_leads").update({ status: "demo_booked", updated_at: new Date().toISOString() })
        .eq("id", leadId)
        .eq("organization_id", organizationId);

    await client.from("ai_sales_activity").insert({
        organization_id: organizationId,
        lead_id: leadId,
        actor: "priya",
        event_type: "demo_booked",
        summary: "Priya booked a 20-minute Google Meet demo",
        metadata: { meeting_id: meeting.id, calendar_event_id: eventId, start_at: startIso, meet_link: meetLink },
    });

    return NextResponse.json({
        success: true,
        available: true,
        meeting,
        eventId,
        meetLink,
        message: "The 20-minute demo is booked in Asia/Kolkata time.",
    }, { status: 201 });
}
