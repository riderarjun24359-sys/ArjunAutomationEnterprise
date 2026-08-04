# Arjun Automation OS — Developer Guide

## Setup

1. Copy `.env.example` to `.env.local`
2. Configure Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Optional: `PLATFORM_LEAD_API_KEY`, `PLATFORM_ORGANIZATION_ID`, `SUPABASE_DB_URL`
4. Run `npm install && npm run dev`

## Architecture

- **Mission Core** (`/mission-core`) — sole runtime orchestrator; all capability actions execute via `executeCapabilityAction`
- **Shared Services** — AI, GCI, audit, auth accessed via `invokeSharedService` only
- **Modules** — 60+ capabilities under `src/modules/`
- **Design OS** — UI system in `src/design-os/`

## Key Patterns

```typescript
// Capability execution (server)
import { executeCapabilityAction } from "@/src/modules/mission-core/engine/capability-executor";

// Shared AI service (never import ai-orchestration directly from capabilities)
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";

// API security
import { secureApiRoute } from "@/src/lib/api-security";
```

## Verification

```bash
npm run production-remediation:verify
npm run mission-core:verify
npm run security-center:verify
```

See `docs/ARCHITECTURE.md` for full platform map.
