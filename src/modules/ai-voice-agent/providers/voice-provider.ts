import "server-only";

export type VoiceProviderName = "vapi" | "retell";

export interface PriyaCallVariables {
    lead_name: string;
    company_name: string;
    requirement: string;
    call_purpose: "requested_callback" | "requested_sales_followup";
    preferred_language?: "te" | "en" | "hi" | "auto";
    call_event_id?: string;
}

export interface OutboundVoiceCallInput {
    phoneNumber: string;
    variables: PriyaCallVariables;
}

export interface OutboundVoiceCallResult {
    provider: VoiceProviderName;
    providerCallId: string;
}

function requiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`Missing server configuration: ${name}`);
    return value;
}

export function getVoiceProviderName(): VoiceProviderName {
    const value = (process.env.ARJUN_VOICE_PROVIDER ?? "vapi").trim().toLowerCase();
    if (value !== "vapi" && value !== "retell") {
        throw new Error("ARJUN_VOICE_PROVIDER must be either vapi or retell");
    }
    return value;
}

export function isValidIndianE164(phoneNumber: string): boolean {
    return /^\+91[6-9]\d{9}$/.test(phoneNumber);
}

async function postJson<T>(url: string, token: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
        // Do not forward provider response bodies; they can contain PII.
        throw new Error(`Voice provider request failed with HTTP ${response.status}`);
    }

    return (await response.json()) as T;
}

export async function createPriyaOutboundCall(
    input: OutboundVoiceCallInput,
): Promise<OutboundVoiceCallResult> {
    if (!isValidIndianE164(input.phoneNumber)) {
        throw new Error("A valid Indian E.164 phone number is required");
    }

    const provider = getVoiceProviderName();

    if (provider === "vapi") {
        const result = await postJson<{ id?: string }>(
            "https://api.vapi.ai/call",
            requiredEnv("VAPI_PRIVATE_KEY"),
            {
                assistantId: requiredEnv("VAPI_PRIYA_ASSISTANT_ID"),
                phoneNumberId: requiredEnv("VAPI_PHONE_NUMBER_ID"),
                customer: { number: input.phoneNumber },
                assistantOverrides: {
                    variableValues: {
                        lead_name: input.variables.lead_name,
                        company_name: input.variables.company_name,
                        requirement: input.variables.requirement,
                        call_purpose: input.variables.call_purpose,
                        preferred_language: input.variables.preferred_language ?? "auto",
                call_event_id: input.variables.call_event_id ?? "",
                        call_event_id: input.variables.call_event_id ?? "",
                    },
                },
            },
        );

        if (!result.id) throw new Error("Vapi did not return a call ID");
        return { provider, providerCallId: result.id };
    }

    const result = await postJson<{ call_id?: string }>(
        "https://api.retellai.com/v2/create-phone-call",
        requiredEnv("RETELL_API_KEY"),
        {
            from_number: requiredEnv("RETELL_FROM_NUMBER"),
            to_number: input.phoneNumber,
            override_agent_id: requiredEnv("RETELL_PRIYA_AGENT_ID"),
            metadata: { call_event_id: input.variables.call_event_id ?? "" },
            retell_llm_dynamic_variables: {
                lead_name: input.variables.lead_name,
                company_name: input.variables.company_name,
                requirement: input.variables.requirement,
                call_purpose: input.variables.call_purpose,
                preferred_language: input.variables.preferred_language ?? "auto",
            },
        },
    );

    if (!result.call_id) throw new Error("Retell did not return a call ID");
    return { provider, providerCallId: result.call_id };
}
