# Integration API key lifecycle

## Issuance

Use the authenticated same-origin endpoint:

`POST /api/integration-platform/api-keys`

Request body:

```json
{
  "integrationHubId": "UUID",
  "keyName": "production-client",
  "apiVersion": "v1"
}
```

The endpoint:
- Requires a valid Supabase user session and same-origin request.
- Resolves the organization from the selected integration hub; it never trusts a client-supplied organization ID.
- Requires an active organization membership with `super_admin`, `admin`, `founder`, or `owner` role.
- Rate-limits issuance to five attempts per user per minute.
- Generates a high-entropy token and stores only its SHA-256 digest.
- Returns the plaintext token once with `Cache-Control: no-store`.

The browser UI displays the secret once after creation. It cannot be retrieved later. The client must store it securely.

## Validation in API handlers

Server-side API handlers must call `validateIntegrationApiKey(token)` from
`src/modules/integration-platform/lib/api-key-auth.ts`. The helper queries the
organization-scoped integration key record by its public prefix, verifies the
stored digest with a constant-time comparison, rejects expired or revoked keys,
and updates `last_used_at` with both key ID and organization ID in the filter.

Do not use the legacy process-local Security Center key map for authentication.
Do not expose the service-role client or digest fields to browser code.

## Release gate

The endpoint and validator are code changes only. Before production use, validate
them against a separate Supabase staging project, test active/inactive/expired
keys and cross-organization isolation, and confirm the migration chain is applied
there. No production migrations or deployments are performed by this runbook.

## Rotation and revocation

Use the same authenticated same-origin endpoint with `PATCH /api/integration-platform/api-keys`.

Revoke request:

```json
{
  "action": "revoke",
  "apiKeyId": "UUID",
  "integrationHubId": "UUID"
}
```

Rotate request:

```json
{
  "action": "rotate",
  "apiKeyId": "UUID",
  "integrationHubId": "UUID"
}
```

Both actions require an active organization owner/admin membership, resolve the organization from the hub, and scope the update by key ID + organization ID + hub ID. Revocation changes status to `revoked`; rotation replaces the prefix and digest so the old token stops authenticating. The new plaintext token is returned once with `Cache-Control: no-store`. Management attempts are rate-limited.

## Protected API example

A minimal authenticated integration endpoint is available at:

`GET /api/v1/integration/health`

Send the issued key as `Authorization: Bearer <token>`. The key must have an
active `integration:health:read` scope with `read` (or wildcard) permission.
Create that scope for the selected API key in the Integration Platform dashboard.
Missing credentials return 401; invalid, expired, or revoked credentials return
401; a valid key without the required scope returns 403. Responses are
`Cache-Control: no-store` and do not expose organization data.
