# Arjun Automation OS — Enterprise Platform

Production-ready enterprise operating system with Mission Core orchestration, 60+ capabilities, and Design OS UI.

## Quick Start

```bash
npm install
cp .env.example .env.local   # configure Supabase + PLATFORM_LEAD_API_KEY
npm run dev
```

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
npm run production-remediation:verify
```

## Core Routes

| Route | Module |
|---|---|
| /mission-core | Central orchestrator |
| /security-center | Enterprise security |
| /platform-operations | Production reliability |
| /ai-foundation | AI governance |
| /client-success | Customer lifecycle |
