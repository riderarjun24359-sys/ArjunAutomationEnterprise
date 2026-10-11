# Arjun Automation OS — Enterprise Platform

Production-ready enterprise operating system with Mission Core orchestration, 60+ capabilities, and Design OS UI.

## Quick Start (local-first, zero paid keys)

```bash
npm install
cp .env.example .env.local   # optional for local UI; Supabase not required to boot
npm run dev
```

No Gemini, Vercel, Stripe, Resend, or Sentry credentials are needed for local
build, tests, or startup. See [Local-First Runbook](docs/LOCAL_FIRST_RUNBOOK.md)
for what works offline and what still needs Supabase/hosted services.

## Documentation

- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Admin Guide](docs/ADMIN_GUIDE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Operations Runbook](docs/OPERATIONS_RUNBOOK.md)
- [Disaster Recovery](docs/DISASTER_RECOVERY.md)
- [Security Policy](SECURITY.md)

## Verification

```bash
npm run test:unit
npm run build
npm run production:verify
```

See [Local-First Runbook](docs/LOCAL_FIRST_RUNBOOK.md) for the full offline matrix.

## Core Routes

| Route | Module |
|---|---|
| /mission-core | Central orchestrator |
| /security-center | Enterprise security |
| /platform-operations | Production reliability |
| /ai-foundation | AI governance |
| /client-success | Customer lifecycle |
