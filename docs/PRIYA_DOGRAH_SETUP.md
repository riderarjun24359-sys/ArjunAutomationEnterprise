# Priya Voice Agent — Dograh Setup and Integration

## Decision

Dograh is the preferred voice runtime for Priya because it is BSD-2-Clause licensed, self-hostable, supports inbound and outbound telephony, and exposes a documented API Trigger, HTTP tools, pre-call data fetch and post-call webhooks.

Repository: https://github.com/dograh-hq/dograh  
Documentation: https://docs.dograh.com  
License: BSD 2-Clause.

This integration keeps Arjun's existing consent ledger, CRM, follow-up controls and Jarvis reporting. Dograh replaces the voice runtime only when explicitly selected with `ARJUN_VOICE_PROVIDER=dograh`. Vapi and Retell adapters remain available.

## Important cost boundary

- Dograh self-hosted software has no per-minute Dograh platform fee.
- Browser Test Audio / Test Chat can be used without a phone number.
- Real calls to Indian mobile or landline numbers still require an eligible telecom/SIP provider, number provisioning, KYC and paid call minutes.
- A self-hosted server and hosted AI inference may also cost money. Local models can reduce API usage but need sufficient CPU/GPU and RAM.
- Do not promise unlimited concurrent calls or bypass telecom charges with SIM gateways.

## 1. Local browser test

Install Docker Desktop on the Mac or Linux machine that will run the service. Then run:

```bash
curl -o docker-compose.yaml https://raw.githubusercontent.com/dograh-hq/dograh/main/docker-compose.yaml
curl -o start_docker.sh https://raw.githubusercontent.com/dograh-hq/dograh/main/scripts/start_docker.sh
chmod +x start_docker.sh
ENABLE_TELEMETRY=false ./start_docker.sh
```

Open `http://localhost:3010`, create the first owner account, and create a Dograh API key under Developers. Store the key in a server-side secret manager; Dograh displays it only once.

The local stack is for browser testing. A phone carrier cannot reach a private laptop URL for inbound calls. Production phone use requires a publicly reachable HTTPS Dograh server and a configured telephony provider.

## 2. Create Priya workflow in Dograh

Create and publish a workflow named **Arjun Automation — Priya**.

Required behaviour:
- Telugu and English; natural Tenglish when the caller code-mixes.
- Identify as an AI assistant, never as a human employee.
- Ask one question at a time; understand business type, problem, service interest, budget range (only if volunteered), decision-maker and timeline.
- Explain only the approved company facts in `ARJUN_AI_VOICE_AGENT_KNOWLEDGE_BASE.md`.
- Do not invent prices, customers, testimonials, results, guarantees, addresses or delivery dates.
- Never cold-call. Outbound is only for a verified, recent, customer-requested callback or sales follow-up.
- Ask separately for permission to store contact details. Do not treat callback consent as consent to store data.
- Stop and record opt-out requests. Do not call suppressed numbers.
- Escalate custom pricing, complaints, security questions and uncertain answers to the founder.

Add an **API Trigger** node for outbound. Copy the production trigger UUID into `DOGRAH_PRIYA_WORKFLOW_UUID`. The backend sends the destination number and context using Dograh's documented `POST /api/v1/public/agent/{uuid}` API.

Add a **Pre-Call Data Fetch** to the inbound Start Call node:
- URL: `https://YOUR-ARJUN-APP-HOST/api/ai-sales/dograh/pre-call`
- Method: POST
- Authentication: Bearer token using the exact value of `PRIYA_SALES_TOOL_SECRET`
- The endpoint creates an organization-scoped inbound call event and returns `call_event_id`, `interaction_id`, caller number and called number in `initial_context`.

For outbound workflows, add an HTTP tool/node early in the connected-call path named `mark_priya_call_connected`:
- URL: `https://YOUR-ARJUN-APP-HOST/api/ai-sales/dograh/mark-connected`
- Method: POST
- Header: `Authorization: Bearer <PRIYA_SALES_TOOL_SECRET>`
- JSON body:
```json
{
  "callEventId": "{{initial_context.call_event_id}}",
  "workflowRunId": "{{workflow_run_id}}",
  "phoneNumber": "{{initial_context.phone_number}}"
}
```
- This changes only the matching, pre-created outbound call event from queued to connected. If it fails, the workflow must not claim that CRM tracking is active.

Add an HTTP tool named `record_requested_callback_consent`:
- URL: `https://YOUR-ARJUN-APP-HOST/api/ai-sales/tools/record-consent`
- Method: POST
- Header: `Authorization: Bearer <PRIYA_SALES_TOOL_SECRET>`
- Call only after the inbound caller explicitly requests a future callback and says yes to that purpose.
- Body fields: `phoneNumber`, `interactionId` (Dograh `workflow_run_id`), `purpose` (`requested_callback` or `requested_sales_followup`), `explicitConsent: true`.
- Do not call this to manufacture consent for an outbound prospect. The endpoint verifies the active inbound caller and do-not-contact suppression.

Add an HTTP tool named `capture_arjun_lead`:
- URL: `https://YOUR-ARJUN-APP-HOST/api/ai-sales/tools/capture-lead`
- Method: POST
- Header: `Authorization: Bearer <PRIYA_SALES_TOOL_SECRET>`
- Invoke only after the person explicitly agrees to save their contact details.
- Body fields: `interactionId` = Dograh `workflow_run_id`; `leadName`; `companyName`; `phoneNumber`; `email`; `city`; `industry`; `painPoint`; `serviceInterest`; `decisionMaker`; `budgetRange`; `buyingTimeline`; `nextAction`; `callSummary`; `direction` (`inbound` or `outbound`); `durationSeconds`; and `consentToStore: true`.
- Use only the caller number from the verified call context. Never let the model choose an organization ID.
- Never send a full transcript, password, OTP, card data or sensitive personal data.
- If the endpoint fails or returns a duplicate/processing state, do not say a new CRM lead was saved.

Add a **Webhook** node at the end of the workflow:
- Method: POST
- URL: `https://YOUR-ARJUN-APP-HOST/api/ai-sales/webhooks/dograh`
- Authentication: custom header `x-arjun-dograh-secret` with the value of `DOGRAH_WEBHOOK_SECRET`.
- Payload template:
```json
{
  "workflow_run_id": "{{workflow_run_id}}",
  "initial_context": {
    "call_event_id": "{{initial_context.call_event_id}}"
  },
  "gathered_context": {
    "call_disposition": "{{gathered_context.call_disposition}}",
    "lead_name": "{{gathered_context.lead_name}}",
    "company_name": "{{gathered_context.company_name}}",
    "service_interest": "{{gathered_context.service_interest}}",
    "next_action": "{{gathered_context.next_action}}"
  },
  "call_disposition": "{{call_disposition}}",
  "cost_info": {
    "call_duration_seconds": "{{cost_info.call_duration_seconds}}"
  },
  "recording_url": "{{recording_url}}",
  "transcript_url": "{{transcript_url}}"
}
```
The webhook is idempotent against the call event and workflow run ID. It stores only structured call metadata and recording/transcript links, not the full transcript.

## 3. Configure inbound phone routing

In Dograh, create a telephony configuration with an eligible provider (for example Vobiz or Plivo, subject to Indian number support and KYC). Add the approved phone number and assign the published Priya workflow as its inbound workflow.

The inbound number, telephony configuration and workflow must be tested with a real handset before enabling inbound calls. The provider must be able to reach the public HTTPS Dograh server and its media WebSocket endpoint.

## 4. Environment variables

Set these only in the server's secret manager; never commit real values:

```env
ARJUN_VOICE_PROVIDER=dograh
DOGRAH_API_URL=https://YOUR-PUBLIC-DOGRAH-HOST
DOGRAH_API_KEY=
DOGRAH_PRIYA_WORKFLOW_UUID=
DOGRAH_JARVIS_WORKFLOW_UUID=
DOGRAH_TELEPHONY_CONFIGURATION_ID=
DOGRAH_WEBHOOK_SECRET=
PRIYA_SALES_TOOL_SECRET=
ARJUN_VOICE_ORGANIZATION_ID=
ARJUN_AI_SALES_OUTBOUND_ENABLED=false
ARJUN_VOICE_INBOUND_ENABLED=false
ARJUN_VOICE_OUTBOUND_ENABLED=false
ARJUN_JARVIS_CALLS_ENABLED=false
```

The Arjun app must also have its existing Supabase server URL and service-role key. Do not expose them to browser code.

## 5. Test sequence and release gates

1. Run unit tests for the Dograh adapter; these mock HTTP and do not place a real call.
2. Start Dograh locally and test Telugu, English, interruptions, silence, corrections and opt-out using Test Audio.
3. Verify the inbound pre-call endpoint creates exactly one event per workflow run.
4. Verify `mark_priya_call_connected` changes only the matching outbound event.
5. Verify lead capture rejects missing consent, invalid numbers, wrong workflow run IDs and duplicate submissions.
6. Verify callback consent rejects an untracked caller and suppressed numbers.
7. Verify the post-call webhook rejects a missing/incorrect secret and updates only the matching organization call event.
8. Configure one KYC-approved test number and perform a human-supervised inbound call.
9. Perform one explicitly requested outbound callback to a test number whose consent is recorded.
10. Keep all production call flags false until all checks and Telugu/English human QA pass.

## Current boundary

The Arjun repository now has a Dograh outbound adapter, tests, inbound pre-call registration, live-call verification endpoint, post-call webhook receiver and this setup guide on `feat/priya-dograh-provider`.

This does **not** mean a Dograh server, provider account, phone number, workflow, API key, Supabase migration or live phone call has been provisioned. Those require access to a machine/server, provider accounts and their secrets. No real credentials are stored in this repository.
