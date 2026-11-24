import "server-only";

export type VoiceProviderName = "vapi" | "retell" | "dograh";

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

export interface JarvisBriefingVariables {
    mrr_inr: string;
    new_leads_today: number;
    demos_booked_today: number;
    urgent_highlight: string;
    trigger_reason: string;
    call_event_id: string;
}

function requiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`Missing server configuration: ${name}`);
    return value;
}

export function getVoiceProviderName(): VoiceProviderName {
    const value = (process.env.ARJUN_VOICE_PROVIDER ?? "vapi").trim().toLowerCase();
    if (value !== "vapi" && value !== "retell" && value !== "dograh") {
        throw new Error("ARJUN_VOICE_PROVIDER must be vapi, retell, or dograh");
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

async function createDograhCall(input: {
    phoneNumber: string;
    workflowUuid: string;
    initialContext: Record<string, string>;
}): Promise<OutboundVoiceCallResult> {
    const apiKey = requiredEnv("DOGRAH_API_KEY");
    const baseUrl = (process.env.DOGRAH_API_URL ?? "http://localhost:8000").trim().replace(/\\/+$/, "");
    const workflowUuid = input.workflowUuid.trim();
    if (!workflowUuid) throw new Error("Missing server configuration: Dograh workflow UUID");

    const telephonyConfigId = process.env.DOGRAH_TELEPHONY_CONFIGURATION_ID?.trim();
    const payload: Record<string, unknown> = {
        phone_number: input.phoneNumber,
        initial_context: input.initialContext,
    };
    if (telephonyConfigId) {
        if (!/^\\d+$/.test(telephonyConfigId)) {
            throw new Error("Invalid server configuration: DOGRAH_TELEPHONY_CONFIGURATION_ID");
        }
        payload.telephony_configuration_id = Number(telephonyConfigId);
    }

    const response = await fetch(`${baseUrl}/api/v1/public/agent/${encodeURIComponent(workflowUuid)}`, {
        method: "POST",
        headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
        throw new Error(`Dograh call request failed with HTTP ${response.status}`);
    }
    const result = await response.json() as { workflow_run_id?: string | number };
    if (result.workflow_run_id === undefined || result.workflow_run_id === null) {
        throw new Error("Dograh did not return a workflow run ID");
    }
    return { provider: "dograh", providerCallId: String(result.workflow_run_id) };
}

export async function createPriyaOutboundCall(
    input: OutboundVoiceCallInput,
): Promise<OutboundVoiceCallResult> {
    if (!isValidIndianE164(input.phoneNumber)) {
        throw new Error("A valid Indian E.164 phone number is required");
    }

    const provider = getVoiceProviderName();
    const callEventId = input.variables.call_event_id ?? "";

    if (provider === "dograh") {
        return createDograhCall({
            phoneNumber: input.phoneNumber,
            workflowUuid: requiredEnv("DOGRAH_PRIYA_WORKFLOW_UUID"),
            initialContext: {
                lead_name: input.variables.lead_name,
                company_name: input.variables.company_name,
                requirement: input.variables.requirement,
                call_purpose: input.variables.call_purpose,
                preferred_language: input.variables.preferred_language ?? "auto",
                call_event_id: callEventId,
                agent: "priya",
            },
        });
    }

    if (provider === "vapi") {
        const result = await postJson<{ id?: string }>(
            "https://api.vapi.ai/call",
            requiredEnv("VAPI_PRIVATE_KEY"),
            {
                assistantId: requiredEnv("VAPI_PRIYA_ASSISTANT_ID"),
                phoneNumberId: requiredEnv("VAPI_PHONE_NUMBER_ID"),
                customer: { number: input.phoneNumber },
                metadata: { call_event_id: callEventId, agent: "priya" },
                assistantOverrides: {
                    variableValues: {
                        lead_name: input.variables.lead_name,
                        company_name: input.variables.company_name,
                        requirement: input.variables.requirement,
                        call_purpose: input.variables.call_purpose,
                        preferred_language: input.variables.preferred_language ?? "auto",
                        call_event_id: callEventId,
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
            metadata: { call_event_id: callEventId, agent: "priya" },
            retell_llm_dynamic_variables: {
                lead_name: input.variables.lead_name,
                company_name: input.variables.company_name,
                requirement: input.variables.requirement,
                call_purpose: input.variables.call_purpose,
                preferred_language: input.variables.preferred_language ?? "auto",
                call_event_id: callEventId,
            },
        },
    );

    if (!result.call_id) throw new Error("Retell did not return a call ID");
    return { provider, providerCallId: result.call_id };
}

export async function createJarvisOutboundCall(input: {
    phoneNumber: string;
    variables: JarvisBriefingVariables;
}): Promise<OutboundVoiceCallResult> {
    if (!isValidIndianE164(input.phoneNumber)) {
        throw new Error("A valid Indian E.164 number is required for Jarvis");
    }

    const provider = getVoiceProviderName();

    if (provider === "dograh") {
        return createDograhCall({
            phoneNumber: input.phoneNumber,
            workflowUuid: requiredEnv("DOGRAH_JARVIS_WORKFLOW_UUID"),
            initialContext: {
                mrr_inr: input.variables.mrr_inr,
                new_leads_today: String(input.variables.new_leads_today),
                demos_booked_today: String(input.variables.demos_booked_today),
                urgent_highlight: input.variables.urgent_highlight,
                trigger_reason: input.variables.trigger_reason,
                call_event_id: input.variables.call_event_id,
                agent: "jarvis",
            },
        });
    }

    if (provider === "vapi") {
        const result = await postJson<{ id?: string }>(
            "https://api.vapi.ai/call",
            requiredEnv("VAPI_PRIVATE_KEY"),
            {
                assistantId: requiredEnv("VAPI_JARVIS_ASSISTANT_ID"),
                phoneNumberId: requiredEnv("VAPI_PHONE_NUMBER_ID"),
                customer: { number: input.phoneNumber },
                metadata: { call_event_id: input.variables.call_event_id, agent: "jarvis" },
                assistantOverrides: {
                    variableValues: {
                        mrr_inr: input.variables.mrr_inr,
                        new_leads_today: String(input.variables.new_leads_today),
                        demos_booked_today: String(input.variables.demos_booked_today),
                        urgent_highlight: input.variables.urgent_highlight,
                        trigger_reason: input.variables.trigger_reason,
                        call_event_id: input.variables.call_event_id,
                    },
                },
            },
        );
        if (!result.id) throw new Error("Vapi did not return a Jarvis call ID");
        return { provider, providerCallId: result.id };
    }

    const result = await postJson<{ call_id?: string }>(
        "https://api.retellai.com/v2/create-phone-call",
        requiredEnv("RETELL_API_KEY"),
        {
            from_number: requiredEnv("RETELL_FROM_NUMBER"),
            to_number: input.phoneNumber,
            override_agent_id: requiredEnv("RETELL_JARVIS_AGENT_ID"),
            metadata: { call_event_id: input.variables.call_event_id, agent: "jarvis" },
            retell_llm_dynamic_variables: {
                mrr_inr: input.variables.mrr_inr,
                new_leads_today: String(input.variables.new_leads_today),
                demos_booked_today: String(input.variables.demos_booked_today),
                urgent_highlight: input.variables.urgent_highlight,
                trigger_reason: input.variables.trigger_reason,
                call_event_id: input.variables.call_event_id,
            },
        },
    );
    if (!result.call_id) throw new Error("Retell did not return a Jarvis call ID");
    return { provider, providerCallId: result.call_id };
}
