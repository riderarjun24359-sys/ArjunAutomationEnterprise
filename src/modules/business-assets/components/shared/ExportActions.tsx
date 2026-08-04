"use client";

import { Button } from "@/src/design-os/components/Button";
import { downloadPdf, exportToPdf } from "../../lib/export-pdf";
import { downloadDocx, exportToDocx } from "../../lib/export-docx";
import { buildHtml } from "../../lib/document-builder";

interface ExportActionsProps {
    title: string;
    content: string;
    filename: string;
    signatureDataUrl?: string;
}

export function ExportActions({ title, content, filename, signatureDataUrl }: ExportActionsProps) {
    const handlePdf = async () => {
        const blob = await exportToPdf({ title, content, signatureDataUrl });
        downloadPdf(blob, filename);
    };

    const handleDocx = () => {
        const html = buildHtml({ title, sections: [{ body: content }], signatureDataUrl, footer: "© Arjun Automation." });
        const blob = exportToDocx({ title, html });
        downloadDocx(blob, filename);
    };

    return (
        <div className="flex flex-wrap gap-3" role="group" aria-label="Export actions">
            <Button variant="primary" onClick={handlePdf} aria-label="Export as PDF">
                Export PDF
            </Button>
            <Button variant="secondary" onClick={handleDocx} aria-label="Export as Word document">
                Export DOCX
            </Button>
        </div>
    );
}
