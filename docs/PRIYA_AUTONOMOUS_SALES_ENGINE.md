# Priya Autonomous AI Sales Engine

## Status and release boundary

This is the implementation specification for the Priya autonomous inbound/outbound sales engine in Arjun Automation OS. It extends the existing AI voice foundation and CRM; it is not a second application.

**Outbound sales is opt-in only.** This implementation does not expose cold-call campaigns. Priya may place a sales follow-up only when the contact explicitly requested that follow-up, the consent is recorded against the same Indian E.164 number, the consent is recent and not revoked, the number is not suppressed, and the conservative calling window is open. Confirm the current TRAI, DND, access-provider and telephony-provider requirements for the exact calling use case before enabling production calls.

All live provider calls remain disabled until the required environment variables, approved Indian telephony number, provider account, human QA and compliance review are complete.

## Architecture

```
Website / inbound calls / WhatsApp / manually qualified leads
                         |
                 Arjun OS CRM
                         |
          Priya Sales Orchestrator (server)
              |          |          |
         Voice adapter  Quote tool  Consent ledger
          Vapi/Retell     INR floor   Opt-in / revoke
              |          |          |
              +----------+----------+
                         |
             Supabase sales operations
       leads / deals / follow-ups / call events
                         |
              Jarvis executive reporting
```

The existing Sarvam adapter remains available for the earlier foundation. Set `ARJUN_VOICE_PROVIDER=vapi` or `retell` to select the new provider-neutral outbound adapter.

## API routes added

| Route | Purpose | Authentication |
|---|---|---|
| `POST /api/ai-sales/consents` | Admin-recorded consent evidence | Arjun OS session + automationManage |
| `POST /api/ai-sales/tools/record-consent` | Record explicit verbal consent during a call | Bearer `PRIYA_SALES_TOOL_SECRET` |
| `POST /api/ai-sales/tools/capture-lead` | Capture a verified caller and structured qualification profile | Bearer `PRIYA_SALES_TOOL_SECRET` |
| `POST /api/ai-sales/outbound` | Start a consented Priya outbound call | Arjun OS session + automationManage |
| `POST /api/ai-sales/dispatch-followups` | Claim and dispatch due consented follow-ups | Bearer `PRIYA_SALES_DISPATCH_SECRET` |
| `POST /api/ai-sales/followups` | Schedule a consent-verified future callback/follow-up | Arjun OS session + automationManage |
| `POST /api/ai-sales/jarvis/call` | Trigger an owner-only or scheduled Jarvis briefing call | Owner session or Bearer `PRIYA_JARVIS_DISPATCH_SECRET` |
| `GET /api/ai-sales/pricing` | Read organization pricing policy | Arjun OS session + automationManage |
| `PUT /api/ai-sales/pricing` | Configure founder-approved prices and discount caps | Arjun OS session + automationManage |
| `POST /api/ai-sales/tools/quote` | Calculate and record a quote within the approved INR floor/cap | Bearer `PRIYA_SALES_TOOL_SECRET` |
| `POST /api/ai-sales/tools/opt-out` | Suppress a number and revoke all recorded consents | Bearer `PRIYA_SALES_TOOL_SECRET` |
| `POST /api/ai-sales/tools/call-event` | Internal normalized call-event ingestion endpoint | Bearer `PRIYA_SALES_WEBHOOK_SECRET` |
| `POST /api/ai-sales/webhooks/vapi` | Verify Vapi server secret and normalize call lifecycle events | Vapi `x-vapi-secret` |
| `POST /api/ai-sales/webhooks/retell` | Verify Retell HMAC signature and normalize call lifecycle events | Retell `x-retell-signature`

All organization-scoped database operations use the server-only Supabase service-role client after authentication or tool-secret validation. Do not call these routes from unauthenticated browser code.

## Required server environment

Existing Arjun OS:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ARJUN_VOICE_ORGANIZATION_ID` — exact organization UUID, never accepted from model input

Sales engine:
- `ARJUN_AI_SALES_OUTBOUND_ENABLED=false` — keep false until release gates pass
- `ARJUN_VOICE_PROVIDER=vapi` — `vapi` or `retell`
- `PRIYA_SALES_TOOL_SECRET` — high-entropy secret shared only with voice-platform tool authentication
- `PRIYA_SALES_WEBHOOK_SECRET` — separate high-entropy internal secret used by verified provider webhook handlers when forwarding normalized events
- `VAPI_PRIYA_WEBHOOK_SECRET` — Vapi Server URL secret; Vapi sends it in `x-vapi-secret`
- `RETELL_WEBHOOK_API_KEY` — Retell API key marked as the webhook key in Retell settings; used to verify `x-retell-signature`
- `PRIYA_SALES_DISPATCH_SECRET` — high-entropy secret for the n8n scheduled follow-up dispatcher
- `PRIYA_JARVIS_DISPATCH_SECRET` — high-entropy secret for scheduled/triggered Jarvis calls
- `ARJUN_PERSONAL_PHONE_NUMBER` — owner's personal +91 E.164 number, server-only
- `ARJUN_JARVIS_OWNER_USER_ID` — Arjun OS user UUID allowed to trigger manual Jarvis calls
- `ARJUN_JARVIS_CALLS_ENABLED=false` — keep disabled until provider and owner configuration are complete

Vapi:
- `VAPI_PRIVATE_KEY`
- `VAPI_PRIYA_ASSISTANT_ID`
- `VAPI_PHONE_NUMBER_ID`
- `VAPI_JARVIS_ASSISTANT_ID`

Retell:
- `RETELL_API_KEY`
- `RETELL_PRIYA_AGENT_ID`
- `RETELL_FROM_NUMBER`
- `RETELL_JARVIS_AGENT_ID`

Never commit these values. Configure them in the hosting provider's encrypted server environment.

## Vapi outbound configuration

Use a Vapi phone assistant with the Priya sales prompt and dynamic variables. The server adapter calls the current Vapi create-call endpoint `POST https://api.vapi.ai/call` with:
- `assistantId`
- `phoneNumberId`
- `customer.number` in E.164 format
- `assistantOverrides.variableValues` containing lead name, company name, requirement, call purpose, preferred language and the internal `call_event_id`; it also attaches the same ID in call metadata for webhook correlation

Set the Vapi phone number or assistant Server URL to `POST /api/ai-sales/webhooks/vapi` and configure Server URL Secret as `VAPI_PRIYA_WEBHOOK_SECRET`. Vapi lifecycle events are verified there and correlated to the CRM call event using call metadata. Create the following function tools separately; set each tool's server URL to the corresponding Arjun OS route and configure Bearer authentication with `PRIYA_SALES_TOOL_SECRET`.

### capture_qualified_lead

Parameters:

```json
{
  "type": "object",
  "properties": {
    "interactionId": { "type": "string" },
    "leadName": { "type": "string" },
    "companyName": { "type": "string" },
    "email": { "type": "string" },
    "phoneNumber": { "type": "string" },
    "city": { "type": "string" },
    "industry": { "type": "string" },
    "painPoint": { "type": "string" },
    "serviceInterest": { "type": "string" },
    "decisionMaker": { "type": "string" },
    "budgetRange": { "type": "string" },
    "buyingTimeline": { "type": "string" },
    "nextAction": { "type": "string" },
    "callSummary": { "type": "string" },
    "direction": { "type": "string", "enum": ["inbound", "outbound"] },
    "durationSeconds": { "type": "number" },
    "consentToStore": { "type": "boolean", "const": true },
    "followUpRequested": { "type": "boolean" }
  },
  "required": ["interactionId", "leadName", "phoneNumber", "consentToStore"],
  "additionalProperties": false
}
```

Endpoint: `POST /api/ai-sales/tools/capture-lead`. The server verifies the provider call ID and caller number against a tracked call event, stores a structured qualification profile, and computes a deterministic lead score.

### record_caller_consent

Parameters:
```json
{
  "type": "object",
  "properties": {
    "phoneNumber": { "type": "string", "description": "Verified caller mobile in +91 E.164 format" },
    "interactionId": { "type": "string", "description": "Provider call or interaction ID" },
    "purpose": {
      "type": "string",
      "enum": ["requested_callback", "requested_sales_followup"]
    },
    "explicitConsent": { "type": "boolean", "const": true }
  },
  "required": ["phoneNumber", "interactionId", "purpose", "explicitConsent"],
  "additionalProperties": false
}
```
Endpoint: `POST /api/ai-sales/tools/record-consent`.

### calculate_approved_quote

Parameters:
```json
{
  "type": "object",
  "properties": {
    "leadId": { "type": "string" },
    "serviceCode": { "type": "string" },
    "requestedDiscountPercent": { "type": "number", "minimum": 0, "maximum": 100 }
  },
  "required": ["leadId", "serviceCode"],
  "additionalProperties": false
}
```
Endpoint: `POST /api/ai-sales/tools/quote`.

### register_do_not_call

Parameters:
```json
{
  "type": "object",
  "properties": {
    "phoneNumber": { "type": "string" },
    "source": { "type": "string" }
  },
  "required": ["phoneNumber"],
  "additionalProperties": false
}
```
Endpoint: `POST /api/ai-sales/tools/opt-out`.

For Vapi, configure each function's server URL and Bearer auth in the tool's server settings. Do not put the shared secret in the function description or model-visible arguments.

## Retell configuration

Set the Retell agent/workspace webhook URL to `POST /api/ai-sales/webhooks/retell`. In Retell Settings → API Keys, mark the verification key as the webhook key and store it as `RETELL_WEBHOOK_API_KEY`. The endpoint validates the `x-retell-signature` HMAC and a five-minute timestamp window before normalizing events. Create equivalent Retell Custom Functions:
- `record_caller_consent` → `POST /api/ai-sales/tools/record-consent`
- `calculate_approved_quote` → `POST /api/ai-sales/tools/quote`
- `register_do_not_call` → `POST /api/ai-sales/tools/opt-out`

Use the same JSON parameter schemas above and configure the same server-side Bearer secret in Retell's tool authentication settings. Retell outbound calls use `POST https://api.retellai.com/v2/create-phone-call` with the configured `from_number`, E.164 `to_number`, `override_agent_id` and `retell_llm_dynamic_variables`.

The selected provider is controlled only by server configuration. Never allow the caller or the LLM to select a provider or override a phone number.

## Founder pricing and negotiation policy

The pricing table is intentionally empty and inactive after migration. The founder must create and activate a policy for each sellable service before Priya can quote it.

Each policy contains:
- Service code and display name
- INR list price
- INR minimum price
- Maximum discount percentage
- Active flag

The server rejects a policy where the maximum discount would reduce the list price below the minimum price. The quote tool:
1. Loads the active policy for the current server-side organization.
2. Calculates the maximum allowed discount.
3. Never returns a price below the configured floor.
4. Records the quote against the CRM lead and creates/updates a sales deal.
5. Flags any request above the approved discount cap for founder approval.

If no active policy exists, Priya must not invent or estimate a price. She offers a discovery call and founder-approved quotation instead.

**No discount values are pre-seeded.** Set real floors and discount caps only after the founder decides the actual unit economics for each service.

## CRM pipeline

The new `ai_sales_deals` table uses these stages:
- `new`
- `contacted`
- `qualified`
- `demo_booked`
- `proposal_sent`
- `negotiation`
- `won`
- `lost`
- `nurture`

The existing `sales_leads` table remains the lead source of truth. `ai_sales_deals` stores quote values, discount approval state and next action time. `ai_sales_activity` stores a minimal audit trail for Priya, Jarvis, founder and system actions.

Suggested qualification fields for the CRM and agent variables:
- Name and business name
- E.164 phone number
- City and industry
- Primary pain point
- Service interest
- Decision-maker status
- Budget range only when volunteered
- Buying timeline
- Consent purpose, evidence reference and timestamp
- Lead score and next action

Do not store full call transcripts in the consent ledger. Apply the platform's privacy and retention policy to recordings and any separately approved transcript storage.

## Follow-up engine

`ai_sales_followups` is a durable, idempotent queue. Every voice follow-up references a consent row and CRM lead. The founder/admin follow-up API creates pending queue rows only after verifying the lead, matching consent, consent age/revocation and suppression ledger. The SQL claim function uses `FOR UPDATE SKIP LOCKED`, rechecks consent and suppression, and only claims work during the configured IST calling window. The authenticated dispatcher rechecks consent and suppression immediately before each provider call. The n8n Schedule Trigger should call `POST /api/ai-sales/dispatch-followups` every minute with the dispatcher Bearer secret. The outbound API rechecks:
- Organization match
- Consent ID, phone number and purpose match
- Consent has not been revoked and is no older than 30 days
- Number is not in `ai_sales_suppressions`
- Current local time is Monday-Saturday, 09:00-19:00 Asia/Kolkata
- Outbound feature flag is enabled

The idempotency key prevents the same follow-up from being dispatched twice. A production scheduler/worker must claim due queue rows atomically, apply retry/backoff, update call outcomes and stop after opt-out. Do not use a client-side timer as the worker.

Recommended follow-up cadence, only within the contact's requested scope:
1. First call at the time explicitly requested by the prospect.
2. One follow-up if the prospect asks for a reminder.
3. One final follow-up only if the prospect explicitly agrees to it.
4. Stop immediately on refusal, opt-out, invalid number, complaint or provider/DND block.

No automatic repeated sales cadence is enabled by default.

## Priya system prompt — sales edition

You are Priya, the AI Sales Executive and receptionist for ArjunAutomations. Always disclose that you are an AI assistant. Speak naturally in Telugu, Tenglish, Indian English, Hindi or Hinglish according to the caller's language.

Your job is to help inbound callers and to make only consented outbound calls. Be consultative, brief, accurate and respectful. Ask one question at a time. Understand the business, the process the customer wants to improve, the urgency and who makes the decision. Do not interrogate the caller.

Explain only relevant services from the approved company knowledge base. Do not invent clients, testimonials, outcomes, integrations, prices, discounts, delivery dates or guarantees.

For outbound calls, state your identity and the exact reason for the call. If the person says they did not request the call, asks you to stop, or says not to call again, apologise, invoke register_do_not_call, and end the call. Never argue or attempt another pitch after an opt-out.

Before saving a lead, ask permission to save the caller's contact details and requirement. Only an unambiguous yes permits capture_qualified_lead. Before recording a callback or sales-follow-up permission, clearly ask whether the person wants ArjunAutomations to call them again about the stated requirement. Only an unambiguous yes permits record_caller_consent. The tool verifies the phone number and provider interaction against a tracked inbound call event. Do not infer consent from continuing the conversation, sharing a phone number, or asking for information.

For pricing, use calculate_approved_quote only after a CRM lead ID and approved service code are available. Never calculate a discount yourself. You may negotiate only within the tool's returned approved price and discount limit. If the customer requests a lower price, use the tool's counter-offer and explain that any further reduction needs founder approval. Never promise an unapproved discount, custom payment term, scope change or contract.

Offer a demo when it helps the customer decide. A demo is not booked until the calendar tool confirms it. A payment is not received until the payment provider verifies it. Never claim a deal is won merely because the customer sounds interested.

Capture a concise, factual call summary and agreed next action. Do not collect OTPs, passwords, card numbers or unnecessary sensitive data. Escalate legal, security, contractual, refund, complaint and exceptional pricing requests to the founder.

## Jarvis voice assistant setup

The owner-only call endpoint is \`POST /api/ai-sales/jarvis/call\`. It uses the personal number configured on the server; the browser or n8n payload cannot choose a destination number. Manual calls require the configured owner session. Scheduled and event-driven calls require \`PRIYA_JARVIS_DISPATCH_SECRET\`.

Set up a separate Jarvis assistant in Vapi or Retell with a calm British executive voice and the following system prompt:

You are Jarvis, Arjun's private executive briefing assistant for Arjun Automation Enterprise. You are speaking directly to Arjun. Address him as "Sir". Sound calm, precise, loyal, warm and lightly witty; never theatrical or excessively verbose.

You are an AI assistant. Give a concise briefing of about 45 seconds. Use only the dynamic values supplied by the server:
- MRR: {{mrr_inr}}
- New leads today: {{new_leads_today}}
- Demos booked today: {{demos_booked_today}}
- Urgent highlight: {{urgent_highlight}}
- Trigger reason: {{trigger_reason}}

If a metric says "Not reported", say it is not connected or not verified. Never invent revenue, MRR, payments, clients, deal values or completed work.

Open with: "Good morning, Sir. Jarvis here with your Arjun Automation briefing." Adapt the greeting to the local time when appropriate.

Brief in this order:
1. State the verified MRR status.
2. Report today's new leads and demos.
3. State the urgent highlight.
4. Recommend the single most useful next action. If a hot lead needs attention, recommend a prompt callback while respecting the prospect's agreed contact time. If a customer win is verified, suggest capturing a short case-study or demo clip only after customer permission.
5. Ask whether Arjun wants the detailed briefing sent by WhatsApp. Do not claim it was sent unless a messaging tool confirms success.

Do not place customer sales calls, offer discounts, change pricing, make payments, or disclose private customer data during this personal briefing. If Arjun says he is busy, offer to send a concise WhatsApp summary through a separately configured, approved messaging workflow.

For the scheduled briefing, be concise. For a hot-lead or verified-payment trigger, lead with the event and its verified details, then provide the same short KPI context.

## Jarvis reporting

Jarvis should report only persisted and verified data. Recommended daily briefing:
- New leads today
- Qualified leads today
- Outbound calls attempted, connected and completed
- Demos booked and attended
- Quotes issued and deals in negotiation
- Won deals and verified revenue
- Discounts granted and deals requiring founder approval
- Follow-ups due today and overdue
- Opt-outs and provider failures
- Three highest-priority next actions

MRR must come from active recurring billing/subscription records, not from one-time project wins. Weekly revenue must come from verified successful payment records. If the source is unavailable, say "not reported"; never estimate.

## n8n integration design

n8n may orchestrate:
1. CRM lead created → check consent → queue a requested follow-up.
2. Schedule Trigger (every minute) → `POST /api/ai-sales/dispatch-followups` with `PRIYA_SALES_DISPATCH_SECRET`; the database claims due rows atomically and the application performs the final consent check before dialing.
3. Vapi/Retell call lifecycle webhook → provider-specific Arjun OS webhook route verifies the Vapi secret or Retell HMAC signature → normalize and persist the event. For outbound calls, pass the internal `call_event_id` in call metadata so the event updates the pre-created CRM call row. For inbound calls, the provider call ID is stored as `interactionId`; only then can the verbal-consent and lead-capture tools bind to the verified caller record.
4. Verified Razorpay payment webhook → update billing/revenue → notify Jarvis.
5. Hot lead or high-value deal → notify founder through approved WhatsApp template.
6. Daily 09:00 Asia/Kolkata → call `POST /api/ai-sales/jarvis/call` with `PRIYA_JARVIS_DISPATCH_SECRET` and `triggerReason=daily_briefing`.
7. Verified hot-lead or Razorpay payment webhook → call the same endpoint with `triggerReason=hot_lead` or `triggerReason=razorpay_payment`; only trigger payment alerts after Razorpay signature and payment status verification.

The application APIs and database remain the source of truth. n8n must not bypass consent, discount policy, organization isolation or do-not-contact checks. Use provider-specific signature verification; do not accept unsigned public webhooks.

## Production release checklist

- Apply migrations in staging only after the repository's database migration and tenant-isolation gates pass.
- Configure founder-approved pricing policies; leave unapproved services inactive.
- Configure Vapi or Retell secrets in the server environment.
- Configure the approved Indian telephony number and complete provider KYC.
- Confirm access-provider, DND, consent and AI-call compliance for this exact use case.
- Test consent capture, opt-out, suppression, duplicate idempotency, calling window, price floor and discount cap.
- Test Telugu, Tenglish, English and Hindi with human listeners.
- Verify call-ended webhook signatures and deduplication.
- Run staging tests across two separate organizations.
- Keep `ARJUN_AI_SALES_OUTBOUND_ENABLED=false` until all gates are approved.
- Enable a small, owner-controlled pilot only after written release approval.
