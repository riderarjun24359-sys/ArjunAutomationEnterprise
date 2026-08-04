# API Documentation

## Authentication

All business API routes require Supabase session authentication unless noted.

## Endpoints

### POST `/api/launch-kit/contact`

Lead intake (requires `X-Platform-Key` header matching `PLATFORM_LEAD_API_KEY`).

**Body:** `{ name, email, company?, phone?, message?, source }`

**Response:** `{ success: true, lead: { processed, leadId } }`

Rate limit: 10/min per IP.

### POST `/api/business-assets/export/pdf`

Requires auth + `clientsManage` permission.

**Body:** `{ title, content, signatureDataUrl? }`

### POST `/api/business-assets/export/docx`

Requires auth + `clientsManage` permission.

**Body:** `{ title, content?, html? }`

### GET `/api/brand-os/documents/[slug]`

Requires auth + `settingsManage` permission.

## SDK

Use module SDKs via Mission Core — never call capability services directly across module boundaries.
