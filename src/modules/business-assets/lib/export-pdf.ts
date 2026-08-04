"use client";

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
    const lines = options.content.split("\n");
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
    a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}
