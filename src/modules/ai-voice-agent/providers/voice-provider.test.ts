import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createJarvisOutboundCall, createPriyaOutboundCall, getVoiceProviderName, isValidIndianE164 } from "./voice-provider";

afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe("isValidIndianE164", () => {
    it("accepts valid Indian mobile numbers in E.164 format", () => {
        expect(isValidIndianE164("+919876543210")).toBe(true);
        expect(isValidIndianE164("+916123456789")).toBe(true);
    });

    it("rejects numbers without the +91 country prefix", () => {
        expect(isValidIndianE164("9876543210")).toBe(false);
        expect(isValidIndianE164("0919876543210")).toBe(false);
    });

    it("rejects invalid Indian mobile prefixes and lengths", () => {
        expect(isValidIndianE164("+915123456789")).toBe(false);
        expect(isValidIndianE164("+91987654321")).toBe(false);
        expect(isValidIndianE164("+9198765432100")).toBe(false);
    });

    it("rejects formatting characters and whitespace", () => {
        expect(isValidIndianE164("+91 9876543210")).toBe(false);
        expect(isValidIndianE164("+91-9876543210")).toBe(false);
    });
});


describe("provider-neutral voice adapter contracts (mocked; no live calls)", () => {
    it("defaults to Vapi and sends Priya variables to the configured assistant", async () => {
        vi.stubEnv("ARJUN_VOICE_PROVIDER", "vapi");
        vi.stubEnv("VAPI_PRIVATE_KEY", "test-vapi-key");
        vi.stubEnv("VAPI_PRIYA_ASSISTANT_ID", "test-priya-assistant");
        vi.stubEnv("VAPI_PHONE_NUMBER_ID", "test-phone-number");
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: "vapi-test-call" }) });
        vi.stubGlobal("fetch", fetchMock);

        expect(getVoiceProviderName()).toBe("vapi");
        const result = await createPriyaOutboundCall({
            phoneNumber: "+919876543210",
            variables: {
                lead_name: "Test Lead",
                company_name: "Test Company",
                requirement: "Website automation",
                call_purpose: "requested_callback",
                preferred_language: "te",
                call_event_id: "test-event-001",
            },
        });

        expect(result).toEqual({ provider: "vapi", providerCallId: "vapi-test-call" });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toBe("https://api.vapi.ai/call");
        const request = fetchMock.mock.calls[0][1] as RequestInit;
        expect(JSON.parse(String(request.body))).toMatchObject({
            assistantId: "test-priya-assistant",
            phoneNumberId: "test-phone-number",
            customer: { number: "+919876543210" },
            metadata: { call_event_id: "test-event-001", agent: "priya" },
        });
    });

    it("sends Priya variables to Retell when Retell is selected", async () => {
        vi.stubEnv("ARJUN_VOICE_PROVIDER", "retell");
        vi.stubEnv("RETELL_API_KEY", "test-retell-key");
        vi.stubEnv("RETELL_FROM_NUMBER", "+911234567890");
        vi.stubEnv("RETELL_PRIYA_AGENT_ID", "test-retell-priya");
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ call_id: "retell-test-call" }) });
        vi.stubGlobal("fetch", fetchMock);

        const result = await createPriyaOutboundCall({
            phoneNumber: "+919876543210",
            variables: {
                lead_name: "Test Lead",
                company_name: "Test Company",
                requirement: "CRM setup",
                call_purpose: "requested_sales_followup",
            },
        });

        expect(result).toEqual({ provider: "retell", providerCallId: "retell-test-call" });
        expect(fetchMock.mock.calls[0][0]).toBe("https://api.retellai.com/v2/create-phone-call");
        const request = fetchMock.mock.calls[0][1] as RequestInit;
        expect(JSON.parse(String(request.body))).toMatchObject({
            from_number: "+911234567890",
            to_number: "+919876543210",
            override_agent_id: "test-retell-priya",
            metadata: { agent: "priya" },
        });
    });

    it("starts a Dograh Priya callback with consent-approved context", async () => {
        vi.stubEnv("ARJUN_VOICE_PROVIDER", "dograh");
        vi.stubEnv("DOGRAH_API_URL", "https://voice.example.test/");
        vi.stubEnv("DOGRAH_API_KEY", "dgr-test-key");
        vi.stubEnv("DOGRAH_PRIYA_WORKFLOW_UUID", "priya-workflow-uuid");
        vi.stubEnv("DOGRAH_TELEPHONY_CONFIGURATION_ID", "42");
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ status: "initiated", workflow_run_id: 9876 }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const result = await createPriyaOutboundCall({
            phoneNumber: "+919876543210",
            variables: {
                lead_name: "Test Lead",
                company_name: "Test Company",
                requirement: "School ERP enquiry",
                call_purpose: "requested_callback",
                preferred_language: "te",
                call_event_id: "dograh-event-001",
            },
        });

        expect(result).toEqual({ provider: "dograh", providerCallId: "9876" });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toBe("https://voice.example.test/api/v1/public/agent/priya-workflow-uuid");
        const request = fetchMock.mock.calls[0][1] as RequestInit;
        expect(new Headers(request.headers).get("X-API-Key")).toBe("dgr-test-key");
        expect(JSON.parse(String(request.body))).toEqual({
            phone_number: "+919876543210",
            initial_context: {
                lead_name: "Test Lead",
                company_name: "Test Company",
                requirement: "School ERP enquiry",
                call_purpose: "requested_callback",
                preferred_language: "te",
                call_event_id: "dograh-event-001",
                agent: "priya",
            },
            telephony_configuration_id: 42,
        });
    });

    it("uses the Dograh Jarvis workflow for owner briefings", async () => {
        vi.stubEnv("ARJUN_VOICE_PROVIDER", "dograh");
        vi.stubEnv("DOGRAH_API_KEY", "dgr-test-key");
        vi.stubEnv("DOGRAH_JARVIS_WORKFLOW_UUID", "jarvis-workflow-uuid");
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ workflow_run_id: 9877 }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const result = await createJarvisOutboundCall({
            phoneNumber: "+919876543210",
            variables: {
                mrr_inr: "Not available",
                new_leads_today: 2,
                demos_booked_today: 1,
                urgent_highlight: "No urgent items",
                trigger_reason: "requested test",
                call_event_id: "jarvis-dograh-001",
            },
        });

        expect(result).toEqual({ provider: "dograh", providerCallId: "9877" });
        expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8000/api/v1/public/agent/jarvis-workflow-uuid");
        const request = fetchMock.mock.calls[0][1] as RequestInit;
        expect(JSON.parse(String(request.body))).toMatchObject({
            phone_number: "+919876543210",
            initial_context: {
                mrr_inr: "Not available",
                new_leads_today: "2",
                demos_booked_today: "1",
                agent: "jarvis",
            },
        });
    });

    it("fails closed when provider credentials are missing", async () => {
        vi.stubEnv("ARJUN_VOICE_PROVIDER", "vapi");
        vi.stubEnv("VAPI_PRIVATE_KEY", "");
        vi.stubGlobal("fetch", vi.fn());

        await expect(createPriyaOutboundCall({
            phoneNumber: "+919876543210",
            variables: {
                lead_name: "Test",
                company_name: "Test",
                requirement: "Test",
                call_purpose: "requested_callback",
            },
        })).rejects.toThrow("Missing server configuration: VAPI_PRIVATE_KEY");
        expect(fetch).not.toHaveBeenCalled();
    });

    it("uses the selected provider for Jarvis owner briefings", async () => {
        vi.stubEnv("ARJUN_VOICE_PROVIDER", "vapi");
        vi.stubEnv("VAPI_PRIVATE_KEY", "test-vapi-key");
        vi.stubEnv("VAPI_JARVIS_ASSISTANT_ID", "test-jarvis-assistant");
        vi.stubEnv("VAPI_PHONE_NUMBER_ID", "test-phone-number");
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: "vapi-jarvis-test-call" }) });
        vi.stubGlobal("fetch", fetchMock);

        const result = await createJarvisOutboundCall({
            phoneNumber: "+919876543210",
            variables: {
                mrr_inr: "Not available",
                new_leads_today: 2,
                demos_booked_today: 1,
                urgent_highlight: "No urgent items",
                trigger_reason: "test",
                call_event_id: "jarvis-test-event",
            },
        });
        expect(result).toEqual({ provider: "vapi", providerCallId: "vapi-jarvis-test-call" });
        const request = fetchMock.mock.calls[0][1] as RequestInit;
        expect(JSON.parse(String(request.body))).toMatchObject({
            assistantId: "test-jarvis-assistant",
            metadata: { agent: "jarvis", call_event_id: "jarvis-test-event" },
        });
    });
});
