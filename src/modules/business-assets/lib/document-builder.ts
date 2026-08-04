import type { BusinessDocumentType } from "../types";

export interface BuildDocumentOptions {
    title: string;
    sections: { heading?: string; body: string }[];
    signatureDataUrl?: string;
    footer?: string;
}

export function buildMarkdown(options: BuildDocumentOptions): string {
    const parts: string[] = [`# ${options.title}`, ""];
    for (const section of options.sections) {
        if (section.heading) {
            parts.push(`## ${section.heading}`, "");
        }
        parts.push(section.body, "");
    }
    if (options.signatureDataUrl) {
        parts.push("## Digital Signature", "", `![Signature](${options.signatureDataUrl})`, "");
    }
    if (options.footer) {
        parts.push("---", options.footer);
    }
    return parts.join("\n");
}

export function buildHtml(options: BuildDocumentOptions): string {
    const sectionsHtml = options.sections
        .map((s) => {
            const heading = s.heading ? `<h2>${escapeHtml(s.heading)}</h2>` : "";
            const body = s.body.split("\n").map((line) => `<p>${escapeHtml(line)}</p>`).join("");
            return heading + body;
        })
        .join("");
    const sig = options.signatureDataUrl
        ? `<h2>Digital Signature</h2><img src="${options.signatureDataUrl}" alt="Signature" style="max-width:240px;" />`
        : "";
    const footer = options.footer ? `<hr/><footer><small>${escapeHtml(options.footer)}</small></footer>` : "";
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${escapeHtml(options.title)}</title></head><body><h1>${escapeHtml(options.title)}</h1>${sectionsHtml}${sig}${footer}</body></html>`;
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
