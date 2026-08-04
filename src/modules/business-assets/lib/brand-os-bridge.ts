import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const BRAND_OS_ROOT = join(process.cwd(), "src", "modules", "brand-os");

export const BRAND_OS_CONTENT_PATHS = {
    companyProfile: "content/company-profile.md",
    brandBook: "content/brand-book.md",
    visualIdentity: "content/visual-identity.md",
    services: {
        index: "content/services/index.md",
        platformImplementation: "content/services/platform-implementation.md",
        industryPackDeployment: "content/services/industry-pack-deployment.md",
        aiWorkerIntegration: "content/services/ai-worker-integration.md",
        enterpriseConsulting: "content/services/enterprise-consulting.md",
        managedSupport: "content/services/managed-support.md",
    },
    salesKit: {
        proposal: "content/sales-kit/proposal-template.md",
        quotation: "content/sales-kit/quotation-template.md",
        sow: "content/sales-kit/statement-of-work.md",
    },
} as const;

export function readBrandOsContent(relativePath: string): string {
    const normalized = relativePath.replace(/\\/g, "/");
    if (normalized.includes("..")) throw new Error("Invalid brand-os path");
    const full = join(BRAND_OS_ROOT, normalized);
    if (!existsSync(full)) return "";
    return readFileSync(full, "utf8");
}

export function getBrandOsCompanyProfile(): string {
    return readBrandOsContent(BRAND_OS_CONTENT_PATHS.companyProfile);
}

export function getBrandOsServiceContent(slug: string): string {
    return readBrandOsContent(`content/services/${slug}.md`);
}

export function getBrandOsSalesTemplate(name: keyof typeof BRAND_OS_CONTENT_PATHS.salesKit): string {
    return readBrandOsContent(BRAND_OS_CONTENT_PATHS.salesKit[name]);
}
