# Architecture Guide

## Platform Layers

1. **Mission Core** — Orchestration, event bus, workflow engine, shared service registry
2. **Capabilities** — 60+ business modules registered in `PLATFORM_CAPABILITIES`
3. **Shared Services** — auth, AI, GCI, audit, notifications, documentEngine, search, analytics, integrations
4. **Design OS** — Enterprise UI system
5. **Database** — Supabase PostgreSQL with RLS

## Orchestration Rules

- No direct capability-to-capability communication
- All inter-capability actions via Mission Core `executeCapabilityAction`
- All AI via shared service `"ai"` through Mission Core
- Workflow steps invoke real capability SDKs (no stub `processed: true`)

## Key Modules

| Module | Route | Role |
|---|---|---|
| Mission Core | /mission-core | Orchestrator |
| Security Center | /security-center | Identity & security |
| Platform Operations | /platform-operations | Reliability |
| AI Foundation | /ai-foundation | AI governance |
| Client Success | /client-success | Customer lifecycle |

## Customer Journey

Website → Lead (sales) → CRM → Proposal (businessAssets) → Agreement → Onboarding (clientSuccess) → Project → Delivery → Invoice (finance) → Payment → Support → Renewal

## Integration Pattern

```
Client → Mission Core → executeCapabilityAction → Capability SDK → Database
                     → invokeSharedService("ai") → AI Orchestration
```
