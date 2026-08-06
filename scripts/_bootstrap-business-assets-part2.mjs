/**
 * Bootstrap V5 Business Assets OS — Part 2 (lib, schemas, components, routes)
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();
const brandRoot = join(root, "src", "modules", "brand-os");
const clkRoot = join(root, "src", "modules", "company-launch-kit");

function write(rel, content) {
    const full = join(root, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
    console.log("wrote", rel);
}

function readSrc(base, rel) {
    const p = join(base, rel);
    return existsSync(p) ? readFileSync(p, "utf8") : "";
}

const proposalTpl = readSrc(brandRoot, "content/sales-kit/proposal-template.md");
const quotationTpl = readSrc(brandRoot, "content/sales-kit/quotation-template.md");
const sowTpl = readSrc(brandRoot, "content/sales-kit/statement-of-work.md");
const ndaTpl = readSrc(clkRoot, "content/documents/nda.md");
const clientTpl = readSrc(clkRoot, "content/documents/client-agreement.md");
const invoiceTpl = readSrc(clkRoot, "content/documents/invoice.md");

const maintenanceTpl = `# Maintenance & Support Agreement

> **Arjun Automation — Managed Support Agreement**

---

## Parties

**Provider:** Arjun Automation
**Client:** [Client Company Name]
**Effective Date:** [Date]
**Agreement Reference:** AA-MSA-[YYYY]-[###]

---

## 1. Service Description

Arjun Automation will provide managed platform support services for the Client's Arjun Automation OS deployment, including monitoring, maintenance, user support, and customer success as defined in this Agreement.

---

## 2. SLA Tiers

| Tier | P1 Response | P2 Response | Coverage | Uptime SLA |
|------|-------------|-------------|----------|------------|
| Standard | 8 business hours | 24 business hours | Business hours | 99.5% |
| Premium | 4 hours | 8 hours | 24/7 P1 | 99.9% |
| Enterprise | 1 hour | 4 hours | 24/7 all | 99.95% |

---

## 3. Response & Escalation

**Tier 1:** Support desk — initial triage and known-issue resolution
**Tier 2:** Platform engineering — configuration and integration issues
**Tier 3:** Core engineering — platform defects and critical incidents
**Executive Escalation:** CSM → VP Customer Success → CEO (Enterprise tier)

---

## 4. Renewal Terms

This Agreement renews automatically for successive 12-month periods unless either party provides 60 days written notice of non-renewal. Pricing adjustments capped at 5% annually with 90 days advance notice.

---

## 5. Termination

Either party may terminate with 90 days written notice. Client data export assistance provided for 30 days post-termination.

---

*© Arjun Automation. Official Maintenance Agreement Template.*`;

function esc(s) {
    return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

for (const [name, content] of [
    ["proposal", proposalTpl],
    ["quotation", quotationTpl],
    ["invoice", invoiceTpl],
    ["sow", sowTpl],
    ["nda", ndaTpl],
    ["client-agreement", clientTpl],
    ["maintenance-agreement", maintenanceTpl],
]) {
    write(`src/modules/business-assets/data/templates/${name}.ts`, `export const DEFAULT_${name.toUpperCase().replace(/-/g, "_")}_TEMPLATE = \`${esc(content)}\`;\n`);
}

write("src/modules/business-assets/schemas/index.ts", `import { z } from "zod";

export const clientInfoSchema = z.object({
    name: z.string().min(1, "Contact name required"),
    company: z.string().min(1, "Company name required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(1, "Phone required"),
    address: z.string().min(1, "Address required"),
});

export const lineItemSchema = z.object({
    id: z.string(),
    description: z.string().min(1),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
    taxRate: z.number().min(0).max(100).optional(),
});

export const proposalFormSchema = z.object({
    templateId: z.string(),
    client: clientInfoSchema,
    reference: z.string().min(1),
    validUntil: z.string().min(1),
    executiveSummary: z.string().min(10),
    scope: z.string().min(10),
    deliverables: z.array(z.string()),
    timeline: z.string().min(1),
    commercials: z.string().min(1),
    terms: z.string().min(1),
    signatureDataUrl: z.string().optional(),
});

export const quotationFormSchema = z.object({
    reference: z.string().min(1),
    client: clientInfoSchema,
    currency: z.string().min(1),
    validUntil: z.string().min(1),
    lineItems: z.array(lineItemSchema).min(1),
    discountPercent: z.number().min(0).max(100),
    taxPercent: z.number().min(0).max(100),
    notes: z.string(),
    approvalStatus: z.enum(["draft", "pending", "approved", "rejected"]),
    signatureDataUrl: z.string().optional(),
});

export const invoiceFormSchema = z.object({
    invoiceNumber: z.string().min(1),
    invoiceDate: z.string().min(1),
    dueDate: z.string().min(1),
    client: clientInfoSchema,
    gstin: z.string(),
    lineItems: z.array(lineItemSchema).min(1),
    cgstPercent: z.number().min(0).max(100),
    sgstPercent: z.number().min(0).max(100),
    igstPercent: z.number().min(0).max(100),
    paymentTerms: z.string().min(1),
    status: z.enum(["draft", "sent", "paid"]),
    signatureDataUrl: z.string().optional(),
});

export const sowMilestoneSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    week: z.string().min(1),
    deliverable: z.string().min(1),
    acceptanceCriteria: z.string().min(1),
});

export const sowFormSchema = z.object({
    reference: z.string().min(1),
    client: clientInfoSchema,
    projectTitle: z.string().min(1),
    scope: z.string().min(10),
    milestones: z.array(sowMilestoneSchema).min(1),
    terms: z.string().min(1),
    acceptanceTerms: z.string().min(1),
    signatureDataUrl: z.string().optional(),
});

export const legalDocumentSchema = z.object({
    reference: z.string().min(1),
    counterparty: z.string().min(1),
    effectiveDate: z.string().min(1),
    content: z.string().min(10),
    signatureDataUrl: z.string().optional(),
});

export const maintenanceAgreementSchema = legalDocumentSchema.extend({
    slaTier: z.string().min(1),
    responseTime: z.string().min(1),
    renewalTerms: z.string().min(1),
    escalationTiers: z.string().min(1),
});

export const companyProfileSectionSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
});

export const companyProfileSchema = z.object({
    sections: z.array(companyProfileSectionSchema).min(13),
    updatedAt: z.string(),
});
`);

write("src/modules/business-assets/lib/brand-os-bridge.ts", `import { readFileSync, existsSync } from "node:fs";
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
    const normalized = relativePath.replace(/\\\\/g, "/");
    if (normalized.includes("..")) throw new Error("Invalid brand-os path");
    const full = join(BRAND_OS_ROOT, normalized);
    if (!existsSync(full)) return "";
    return readFileSync(full, "utf8");
}

export function getBrandOsCompanyProfile(): string {
    return readBrandOsContent(BRAND_OS_CONTENT_PATHS.companyProfile);
}

export function getBrandOsServiceContent(slug: string): string {
    return readBrandOsContent(\`content/services/\${slug}.md\`);
}

export function getBrandOsSalesTemplate(name: keyof typeof BRAND_OS_CONTENT_PATHS.salesKit): string {
    return readBrandOsContent(BRAND_OS_CONTENT_PATHS.salesKit[name]);
}
`);

write("src/modules/business-assets/lib/document-builder.ts", `import type { BusinessDocumentType } from "../types";

export interface BuildDocumentOptions {
    title: string;
    sections: { heading?: string; body: string }[];
    signatureDataUrl?: string;
    footer?: string;
}

export function buildMarkdown(options: BuildDocumentOptions): string {
    const parts: string[] = [\`# \${options.title}\`, ""];
    for (const section of options.sections) {
        if (section.heading) {
            parts.push(\`## \${section.heading}\`, "");
        }
        parts.push(section.body, "");
    }
    if (options.signatureDataUrl) {
        parts.push("## Digital Signature", "", \`![Signature](\${options.signatureDataUrl})\`, "");
    }
    if (options.footer) {
        parts.push("---", options.footer);
    }
    return parts.join("\\n");
}

export function buildHtml(options: BuildDocumentOptions): string {
    const sectionsHtml = options.sections
        .map((s) => {
            const heading = s.heading ? \`<h2>\${escapeHtml(s.heading)}</h2>\` : "";
            const body = s.body.split("\\n").map((line) => \`<p>\${escapeHtml(line)}</p>\`).join("");
            return heading + body;
        })
        .join("");
    const sig = options.signatureDataUrl
        ? \`<h2>Digital Signature</h2><img src="\${options.signatureDataUrl}" alt="Signature" style="max-width:240px;" />\`
        : "";
    const footer = options.footer ? \`<hr/><footer><small>\${escapeHtml(options.footer)}</small></footer>\` : "";
    return \`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>\${escapeHtml(options.title)}</title></head><body><h1>\${escapeHtml(options.title)}</h1>\${sectionsHtml}\${sig}\${footer}</body></html>\`;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function buildDocumentFromType(
    type: BusinessDocumentType,
    data: Record<string, unknown>,
): { markdown: string; html: string } {
    const title = String(data.title ?? type);
    const content = String(data.content ?? "");
    const signatureDataUrl = data.signatureDataUrl as string | undefined;
    const opts: BuildDocumentOptions = {
        title,
        sections: [{ body: content }],
        signatureDataUrl,
        footer: "© Arjun Automation. Confidential.",
    };
    return { markdown: buildMarkdown(opts), html: buildHtml(opts) };
}
`);

write("src/modules/business-assets/lib/export-pdf.ts", `"use client";

import { jsPDF } from "jspdf";

export interface PdfExportOptions {
    title: string;
    content: string;
    filename?: string;
    signatureDataUrl?: string;
}

export async function exportToPdf(options: PdfExportOptions): Promise<Blob> {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(options.title, maxWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 8 + 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = options.content.split("\\n");
    for (const line of lines) {
        if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }
        const wrapped = doc.splitTextToSize(line || " ", maxWidth);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5 + 2;
    }

    if (options.signatureDataUrl) {
        if (y > doc.internal.pageSize.getHeight() - 50) {
            doc.addPage();
            y = margin;
        }
        doc.setFont("helvetica", "bold");
        doc.text("Digital Signature", margin, y);
        y += 8;
        try {
            doc.addImage(options.signatureDataUrl, "PNG", margin, y, 60, 25);
        } catch {
            doc.setFont("helvetica", "normal");
            doc.text("[Signature attached]", margin, y);
        }
    }

    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text("© Arjun Automation", margin, doc.internal.pageSize.getHeight() - 10);

    return doc.output("blob");
}

export function downloadPdf(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".pdf") ? filename : \`\${filename}.pdf\`;
    a.click();
    URL.revokeObjectURL(url);
}
`);

write("src/modules/business-assets/lib/export-docx.ts", `"use client";

export interface DocxExportOptions {
    title: string;
    html: string;
    filename?: string;
}

export function exportToDocx(options: DocxExportOptions): Blob {
    const html = options.html.startsWith("<!DOCTYPE")
        ? options.html
        : \`<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/><title>\${options.title}</title></head><body>\${options.html}</body></html>\`;
    return new Blob([html], { type: "application/msword" });
}

export function downloadDocx(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".doc") ? filename : \`\${filename}.doc\`;
    a.click();
    URL.revokeObjectURL(url);
}
`);

write("src/modules/business-assets/lib/document-library.ts", `import type { BusinessDocumentType, DocumentCategory, StoredDocument, DocumentVersion } from "../types";
import { DOCUMENT_TYPE_CATEGORIES } from "../constants";

const LIBRARY_KEY = "arjun-business-assets-library";

function readLibrary(): StoredDocument[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(LIBRARY_KEY);
        return raw ? (JSON.parse(raw) as StoredDocument[]) : [];
    } catch {
        return [];
    }
}

function writeLibrary(docs: StoredDocument[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(docs));
}

export function getAllDocuments(): StoredDocument[] {
    return readLibrary();
}

export function getDocumentsByCategory(category: DocumentCategory): StoredDocument[] {
    return readLibrary().filter((d) => d.category === category);
}

export function searchDocuments(query: string): StoredDocument[] {
    const q = query.toLowerCase();
    return readLibrary().filter(
        (d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q) || d.type.includes(q),
    );
}

export function saveDocument(input: {
    id?: string;
    type: BusinessDocumentType;
    title: string;
    content: string;
    html?: string;
}): StoredDocument {
    const docs = readLibrary();
    const now = new Date().toISOString();
    const category = DOCUMENT_TYPE_CATEGORIES[input.type];

    if (input.id) {
        const idx = docs.findIndex((d) => d.id === input.id);
        if (idx >= 0) {
            const existing = docs[idx];
            const version: DocumentVersion = {
                version: existing.version,
                content: existing.content,
                savedAt: existing.updatedAt,
            };
            const updated: StoredDocument = {
                ...existing,
                title: input.title,
                content: input.content,
                html: input.html,
                updatedAt: now,
                version: existing.version + 1,
                versions: [...existing.versions, version],
            };
            docs[idx] = updated;
            writeLibrary(docs);
            return updated;
        }
    }

    const doc: StoredDocument = {
        id: input.id ?? \`doc-\${Date.now()}\`,
        type: input.type,
        title: input.title,
        category,
        content: input.content,
        html: input.html,
        createdAt: now,
        updatedAt: now,
        version: 1,
        versions: [],
    };
    docs.unshift(doc);
    writeLibrary(docs);
    return doc;
}

export function deleteDocument(id: string): void {
    writeLibrary(readLibrary().filter((d) => d.id !== id));
}

export function getDocumentById(id: string): StoredDocument | undefined {
    return readLibrary().find((d) => d.id === id);
}
`);

write("src/modules/business-assets/lib/validation.ts", `import {
    proposalFormSchema,
    quotationFormSchema,
    invoiceFormSchema,
    sowFormSchema,
    legalDocumentSchema,
    maintenanceAgreementSchema,
    companyProfileSchema,
} from "../schemas";
import type { BusinessDocumentType } from "../types";

export function validateBusinessDocument(type: BusinessDocumentType, data: unknown) {
    switch (type) {
        case "proposal":
            return proposalFormSchema.safeParse(data);
        case "quotation":
            return quotationFormSchema.safeParse(data);
        case "invoice":
            return invoiceFormSchema.safeParse(data);
        case "sow":
            return sowFormSchema.safeParse(data);
        case "nda":
        case "client-agreement":
            return legalDocumentSchema.safeParse(data);
        case "maintenance-agreement":
            return maintenanceAgreementSchema.safeParse(data);
        case "company-profile":
            return companyProfileSchema.safeParse(data);
        default:
            return { success: true as const, data };
    }
}
`);

console.log("Part 2 bootstrap complete (batch 1)");
