import "server-only";

export interface SarvamVoiceConfig {
    apiKey: string;
    organizationId: string;
    workspaceId: string;
    appId: string;
    appVersion: number;
    connectionId: string;
    agentPhoneNumber: string;
    webhookId: string;
}

export interface SarvamOutboundCallResult {
    attempt_id: string;
}

export interface SarvamDeploymentResult {
    deployment_id: string;
    status?: string;
    channel_direction?: string;
}

function requiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`Missing server configuration: ${name}`);
    return value;
}

export function getSarvamVoiceConfig(): SarvamVoiceConfig {
    const appVersion = Number(requiredEnv("SARVAM_VOICE_APP_VERSION"));
    if (!Number.isInteger(appVersion) || appVersion < 1) {
        throw new Error("Invalid server configuration: SARVAM_VOICE_APP_VERSION");
    }

    return {
        apiKey: requiredEnv("SARVAM_VOICE_API_KEY"),
        organizationId: requiredEnv("SARVAM_VOICE_ORG_ID"),
        workspaceId: requiredEnv("SARVAM_VOICE_WORKSPACE_ID"),
        appId: requiredEnv("SARVAM_VOICE_APP_ID"),
        appVersion,
        connectionId: requiredEnv("SARVAM_VOICE_CONNECTION_ID"),
        agentPhoneNumber: requiredEnv("SARVAM_VOICE_AGENT_PHONE_NUMBER"),
        webhookId: requiredEnv("SARVAM_VOICE_WEBHOOK_ID"),
    };
}

async function sarvamRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const config = getSarvamVoiceConfig();
    const response = await fetch(`https://apps.sarvam.ai${path}`, {
        method: "POST",
        headers: {
            "X-API-Key": config.apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
        // Provider response bodies can contain identifiers or customer data.
        // Keep them out of application logs and client-facing errors.
        throw new Error(`Sarvam Voice API request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
}

export function isValidIndianE164(phone: string): boolean {
    return /^\+91[6-9]\d{9}$/.test(phone);
}

export async function createSarvamOutboundCall(input: {
    phoneNumber: string;
    organizationId: string;
    callEventId: string;
}): Promise<SarvamOutboundCallResult> {
    if (!isValidIndianE164(input.phoneNumber)) {
        throw new Error("Phone number must be a valid Indian E.164 number");
    }

    const config = getSarvamVoiceConfig();
    return sarvamRequest<SarvamOutboundCallResult>(
        `/api/outbounds/v1/orgs/${encodeURIComponent(config.organizationId)}/workspaces/${encodeURIComponent(config.workspaceId)}/outbounds`,
        {
            app_config: {
                app_id: config.appId,
                app_version: config.appVersion,
                connection_config: {
                    connection_id: config.connectionId,
                    agent_phone_number: config.agentPhoneNumber,
                },
            },
            user_config: { user_phone_number: input.phoneNumber },
            webhook_config: {
                webhook_id: config.webhookId,
                metadata: {
                    organization_id: input.organizationId,
                    call_event_id: input.callEventId,
                    direction: "outbound",
                },
            },
        },
    );
}

export async function createSarvamInboundDeployment(input: {
    organizationId: string;
    name?: string;
}): Promise<SarvamDeploymentResult> {
    const config = getSarvamVoiceConfig();
    return sarvamRequest<SarvamDeploymentResult>(
        `/api/app-authoring/v1/orgs/${encodeURIComponent(config.organizationId)}/workspaces/${encodeURIComponent(config.workspaceId)}/deployments`,
        {
            name: input.name ?? "Arjun AI Inbound",
            app_id: config.appId,
            app_version: config.appVersion,
            connection_configs: [
                {
                    connection_id: config.connectionId,
                    phone_numbers: [config.agentPhoneNumber],
                },
            ],
            description: "Arjun Automation Enterprise Telugu and English AI receptionist",
            webhook_config: {
                webhook_id: config.webhookId,
                metadata: {
                    organization_id: input.organizationId,
                    direction: "inbound",
                },
            },
        },
    );
}
