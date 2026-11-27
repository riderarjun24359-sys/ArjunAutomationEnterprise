import { describe, expect, it } from "vitest";
import { resolveTenantHost } from "./tenant-host";

describe("resolveTenantHost", () => {
  it("classifies the apex domain", () => {
    expect(resolveTenantHost("ARJUNAUTOMATIONS.COM.")).toEqual({
      kind: "root", hostname: "arjunautomations.com",
    });
  });
  it("recognizes reserved platform subdomains", () => {
    expect(resolveTenantHost("app.arjunautomations.com")).toMatchObject({
      kind: "reserved", subdomain: "app",
    });
  });
  it("resolves tenant slug candidates without authorizing them", () => {
    expect(resolveTenantHost("sri-sai.arjunautomations.com")).toMatchObject({
      kind: "tenant-subdomain", slug: "sri-sai",
    });
  });
  it("rejects multi-level and malformed tenant subdomains", () => {
    expect(resolveTenantHost("a.b.arjunautomations.com").kind).toBe("unknown-host");
    expect(resolveTenantHost("-bad.arjunautomations.com").kind).toBe("unknown-host");
  });
  it("classifies other hostnames as custom domains for lookup", () => {
    expect(resolveTenantHost("school.example.in")).toMatchObject({
      kind: "custom-domain", hostname: "school.example.in",
    });
  });
});
