import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, signatureDataUrl } = body as {
            title?: string;
            content?: string;
            signatureDataUrl?: string;
        };

        if (!title || !content) {
            return NextResponse.json({ error: "title and content required" }, { status: 400 });
        }

        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const margin = 20;
        const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
        let y = margin;

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        const titleLines = doc.splitTextToSize(title, maxWidth);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 8 + 6;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        for (const line of content.split("\n")) {
            if (y > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                y = margin;
            }
            const wrapped = doc.splitTextToSize(line || " ", maxWidth);
            doc.text(wrapped, margin, y);
            y += wrapped.length * 5 + 2;
        }

        if (signatureDataUrl) {
            try {
                doc.addImage(signatureDataUrl, "PNG", margin, y, 60, 25);
            } catch {
                /* skip invalid signature */
            }
        }

        const pdfBuffer = doc.output("arraybuffer");
        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${title.replace(/[^a-z0-9-_]/gi, "-")}.pdf"`,
            },
        });
    } catch {
        return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
    }
}
