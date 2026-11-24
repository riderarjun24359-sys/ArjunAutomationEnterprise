# Arjun AI Voice Agent — Legacy Sarvam Notes

> This document describes the earlier Sarvam-specific foundation. The current preferred runtime is Dograh. Follow [PRIYA_DOGRAH_SETUP.md](./PRIYA_DOGRAH_SETUP.md) for the active integration path. Do not treat the old provider setup below as provisioned or live.

## Product scope

Arjun Automation's internal AI receptionist and customer-requested callback assistant.

- Public identity: **Arjun Automation AI Assistant**
- Languages: Telugu and English, including natural code-mixed conversations
- Channels: inbound calls and outbound customer-requested callbacks
- CRM destination: Arjun OS / Supabase
- Human owner: founder handoff for qualified or sensitive conversations
- Initial rollout: test calls first; no cold-call campaigns

## Architecture

```
Customer phone
   | inbound / requested callback
Approved Indian telephony connection
   |
Voice runtime (Dograh preferred; Sarvam adapter retained as legacy option)
   | HMAC-SHA256 signed call-completion webhook
Vercel Next.js API
   | session-protected actions / server-only service-role writes
Supabase
   | organization-scoped consent ledger + call events
Arjun OS CRM / AI Sales Lead Engine
```

The Sarvam client is isolated in `src/modules/ai-voice-agent/providers/sarvam-client.ts`.
Do not call Sarvam from browser code. Never expose the API key or webhook secret.

## Provider setup

1. Create a Sarvam account and open Voice Agents.
2. Create an agent named **Arjun Automation AI Assistant**.
3. Configure Telugu + English and allow natural code-mixing.
4. Configure the voice prompt using the safe behaviour requirements below.
5. Create a telephony connection and verify the number in the Sarvam workspace.
6. Create a webhook config pointing to:
   `https://www.arjunautomations.com/api/webhooks/sarvam/voice`
7. Copy the webhook signing secret once and store it as `SARVAM_VOICE_WEBHOOK_SECRET` in Vercel server environment variables. Sarvam returns this secret only when the webhook config is created.
8. Add the webhook metadata `organization_id` and `direction` to the inbound deployment configuration. For outbound calls, the application supplies organization and call-event metadata.
9. Deploy inbound only after a human has tested the agent, phone number, transfer behaviour and webhook.

The webhook verifies Sarvam's documented `Sarvam-Signature` and `Sarvam-Timestamp` headers using HMAC-SHA256 over the raw request body, and rejects deliveries older than five minutes. Do not use an inline unsigned webhook URL.

## Required server environment variables

```env
SARVAM_VOICE_API_KEY=
SARVAM_VOICE_ORG_ID=
SARVAM_VOICE_WORKSPACE_ID=
SARVAM_VOICE_APP_ID=
SARVAM_VOICE_APP_VERSION=1
SARVAM_VOICE_CONNECTION_ID=
SARVAM_VOICE_AGENT_PHONE_NUMBER=
SARVAM_VOICE_WEBHOOK_ID=
SARVAM_VOICE_WEBHOOK_SECRET=
SARVAM_VOICE_TOOL_SECRET=
ARJUN_VOICE_ORGANIZATION_ID=
ARJUN_VOICE_INBOUND_ENABLED=false
ARJUN_VOICE_OUTBOUND_ENABLED=false
```

Existing Arjun OS variables are also required:
`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Implemented API foundation

- `POST /api/ai-voice-agent/consents`: authenticated admin records evidence of a customer-requested callback.
- `POST /api/ai-voice-agent/outbound`: authenticated admin can start a callback only when an active callback consent exists and the outbound feature flag is explicitly enabled.
- `POST /api/ai-voice-agent/deployments`: authenticated admin can activate the inbound phone line only when the inbound feature flag is enabled and the request includes `confirmGoLive: true`.
- `POST /api/ai-voice-agent/tools/capture-lead`: authenticated Sarvam API tool (Bearer secret) saves a qualified call lead into the existing `sales_leads` CRM table and writes a sales call log. A per-organization interaction ledger prevents duplicate lead creation on provider retries.
- `POST /api/webhooks/sarvam/voice`: receives call outcomes and stores minimal call metadata.

All new database tables have RLS enabled and are not granted to browser roles. The API uses the server-only service-role client only after authentication and organization checks.

## Consent and telecom rollout gate

The first release is **not** a cold-outbound dialler. It only supports callbacks requested by a customer and backed by recorded evidence. Do not import scraped lists or call random mobile numbers.

Before any promotional or bulk A2P campaign, obtain the applicable access-provider / registered telemarketer onboarding, designated number series, consent and DND preference checks, and advance A2P/auto-dialer declarations required by the current Indian telecom framework. Have the telephony provider confirm the exact registration path for this entity and use case. Keep promotional campaigns disabled until that review is complete.

## Sarvam API tool configuration

Create a real API tool named `capture_arjun_lead` with lifecycle `on_end` (or call it during the conversation only after the caller agrees to share contact details). Configure:

- Method: `POST`
- URL: `https://www.arjunautomations.com/api/ai-voice-agent/tools/capture-lead`
- Authentication: Bearer token, stored using Sarvam's secure workspace Secrets input; secret value must equal `SARVAM_VOICE_TOOL_SECRET` on Vercel.
- Body fields: `interactionId` = Sarvam Interaction ID; `callerConsent` = explicit yes from the caller to save their contact details; `leadName`, `companyName`, `email`, `phoneNumber`, `requirement`, `callSummary`, `followUpRequested`, and `preferredCallbackAt` = agent variables. The endpoint refuses to save unless `callerConsent=true`. Do not send the full transcript.
- Timeout: 8 seconds. On failure, tell the caller a team member will follow up only if the caller has requested it; never claim the CRM save succeeded.

Set `ARJUN_VOICE_ORGANIZATION_ID` to the exact Arjun Automation Enterprise organization UUID. The endpoint ignores any organization ID supplied by the model and always uses this server-side tenant setting. The endpoint uses a server-only service-role client, bearer-secret verification, payload limits, E.164 validation, and an idempotency table. This tool is for the company's own lead capture; it is not a generic multi-tenant customer endpoint.

## Approved company knowledge

Use `docs/ARJUN_AI_VOICE_AGENT_KNOWLEDGE_BASE.md` as the source of truth for company services, public INR starting prices, delivery process, contact details and claims the agent must never invent. Upload its approved content into the Sarvam agent knowledge base or paste it into the agent instructions before live testing. The knowledge base is based on the current public website and must be updated when the website or founder-approved offers change.

## Agent system prompt

You are Arjun Automation's AI assistant. Start by identifying yourself as an AI assistant. Speak naturally in Telugu or English based on the caller's preference; code-mix only when the caller does. Keep responses concise, respectful and conversational.

You may explain only services and pricing contained in the approved company knowledge base. Never invent clients, case studies, guarantees, prices, discounts, certifications or delivery dates. Do not claim a meeting, callback, quotation or booking is confirmed unless the connected tool confirms it.

For inbound enquiries, identify the caller's business type and requested help, capture their preferred callback time, and offer a human handoff when requested. For outbound calls, call only people with a recorded customer-requested callback consent; state the purpose of the callback and stop immediately if they ask not to be called again.

When the caller asks for a callback or demo, ask permission to record their name and best contact details, then invoke `capture_arjun_lead` with the Interaction ID and concise structured fields. Invoke it only after the caller agrees. Never send a transcript or sensitive personal information. If the tool reports a duplicate, processing, or error state, do not claim a new lead was saved.\n\nDo not provide medical, legal, financial or other regulated professional advice. Do not collect passwords, OTPs, card details or unnecessary sensitive personal information. Escalate complaints, negotiation, custom quotations, security questions and uncertain answers to the founder.

## Cost model (published Sarvam rates; excluding GST)

- Voice agent: ₹3.50 per minute pay-as-you-go below 3,000 minutes/month.
- Telephony and phone-number charges are additional.
- Sarvam's listed rented number charge is ₹59 per 30 days; telephony is listed separately at ₹0.20 per 30-second pulse when using Sarvam telephony.
- Exotel / other BYOT provider bills separately under its own plan and contract.

Examples for voice-agent minutes only:
- 100 minutes: ₹350
- 300 minutes: ₹1,050
- 500 minutes: ₹1,750
- 1,000 minutes: ₹3,500

Check the live provider rate card before committing to a paid plan.

## Current implementation boundary

The code and database foundation are committed on a feature branch, not production. Real calls remain disabled by default. No Sarvam account, telephony number, agent, deployment, secrets or production database migration has been configured by this code change. Those require the owner's provider account and credentials.
