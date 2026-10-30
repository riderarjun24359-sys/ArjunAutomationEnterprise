"use client";

import { jsPDF } from "jspdf";
import type { BoardRoomSnapshot, FounderExecutiveDashboard } from "../types";

export async function exportBoardRoomPdf(input: {
    board: BoardRoomSnapshot;
    executive: FounderExecutiveDashboard;
    fileName?: string;
}): Promise<void> {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 48;
    let y = margin;
    const line = (text: string, size = 11, gap = 16) => {
        const lines = doc.splitTextToSize(text, 516);
        doc.setFontSize(size);
        for (const row of lines) {
            if (y > 720) {
                doc.addPage();
                y = margin;
            }
            doc.text(row, margin, y);
            y += gap;
        }
    };

    doc.setFont("helvetica", "bold");
    line("Arjun Automation — Board Room Snapshot", 16, 22);
    doc.setFont("helvetica", "normal");
    line(`Generated ${input.board.generatedAt}`, 10, 18);
    line(`MRR ₹${input.executive.mrrUsd.toLocaleString()} · ARR ₹${input.executive.arrUsd.toLocaleString()}`, 12, 18);

    doc.setFont("helvetica", "bold");
    line("Investor KPIs", 13, 20);
    doc.setFont("helvetica", "normal");
    for (const kpi of input.board.investorKpis) {
        line(`${kpi.label}: ${kpi.value}${kpi.note ? ` (${kpi.note})` : ""}`);
    }

    doc.setFont("helvetica", "bold");
    line("SaaS Metrics", 13, 20);
    doc.setFont("helvetica", "normal");
    for (const m of input.board.saasMetrics) {
        line(`${m.label}: ${m.value}`);
    }

    doc.setFont("helvetica", "bold");
    line("Executive Report", 13, 20);
    doc.setFont("helvetica", "normal");
    for (const row of input.board.executiveReportLines) {
        line(`• ${row}`);
    }

    doc.setFont("helvetica", "bold");
    line("Monthly Business Snapshot", 13, 20);
    doc.setFont("helvetica", "normal");
    line(input.board.monthlyBusinessSnapshot, 11, 14);

    doc.save(input.fileName ?? `arjun-board-room-${input.board.generatedAt.slice(0, 10)}.pdf`);
}
