import { join } from "node:path";

export const BRAND_OS_MODULE_ROOT = join(process.cwd(), "src", "modules", "brand-os");

export function resolveBrandOsContentPath(relativePath: string): string {
    const normalized = relativePath.replace(/\\/g, "/");
    if (normalized.includes("..")) {
        throw new Error("Invalid content path");
    }
    return join(BRAND_OS_MODULE_ROOT, normalized);
}
