export const SAAS_ROOT_DOMAIN = "arjunautomations.com";

export const RESERVED_SUBDOMAINS = new Set([
  "www", "app", "admin", "api", "demo", "status", "support", "mail",
  "ftp", "auth", "assets", "cdn", "docs",
]);

export type TenantHostResolution =
  | { kind: "root"; hostname: string }
  | { kind: "reserved"; hostname: string; subdomain: string }
  | { kind: "tenant-subdomain"; hostname: string; slug: string }
  | { kind: "custom-domain"; hostname: string }
  | { kind: "unknown-host"; hostname: string };

function normalizeHostname(input: string): string {
  return input.trim().toLowerCase().replace(/\\.$/, "").split(":")[0] ?? "";
}

/**
 * Pure host classification only. Tenant identity must still be verified by
 * looking up an active/verified organization_domains record server-side.
 * Never treat a client-provided slug as authorization.
 */
export function resolveTenantHost(
  input: string,
  rootDomain = SAAS_ROOT_DOMAIN,
): TenantHostResolution {
  const hostname = normalizeHostname(input);
  const root = normalizeHostname(rootDomain);

  if (!hostname || !root) return { kind: "unknown-host", hostname };
  if (hostname === root) return { kind: "root", hostname };

  if (hostname.endsWith("." + root)) {
    const subdomain = hostname.slice(0, -(root.length + 1));
    if (!subdomain || subdomain.includes(".")) {
      return { kind: "unknown-host", hostname };
    }
    if (RESERVED_SUBDOMAINS.has(subdomain)) {
      return { kind: "reserved", hostname, subdomain };
    }
    if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain)) {
      return { kind: "unknown-host", hostname };
    }
    return { kind: "tenant-subdomain", hostname, slug: subdomain };
  }

  return { kind: "custom-domain", hostname };
}
