"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useBusinessAssets } from "../../hooks/useBusinessAssets";
import { saveDocument } from "../../lib/document-library";
import { DocumentPreview } from "../shared/DocumentPreview";
import { ExportActions } from "../shared/ExportActions";
import { LineItemsEditor } from "../shared/LineItemsEditor";
import { SignaturePad } from "../shared/SignaturePad";
import { FieldInput, FieldTextarea, FieldSelect } from "../shared/FormField";
import type { InvoiceFormData } from "../../types";

export function InvoiceGeneratorPanel() {
    const { state, update, service } = useBusinessAssets();
    const form = state.invoice;

    const setForm = (patch: Partial<InvoiceFormData>) => update("invoice", { ...form, ...patch });

    const gst = service.calculateInvoiceGst(form.lineItems, form.cgstPercent, form.sgstPercent, form.igstPercent);

    const buildContent = () =>
        [
            `# Tax Invoice — ${form.invoiceNumber}`,
            `Invoice Date: ${form.invoiceDate}`,
            `Due Date: ${form.dueDate}`,
            `Status: ${form.status}`,
            `GSTIN: ${form.gstin || "N/A"}`,
            "",
            `Bill To: ${form.client.company}`,
            `${form.client.name} — ${form.client.email}`,
            form.client.address,
            "",
            "## Line Items",
            ...form.lineItems.map(
                (item, i) => `${i + 1}. ${item.description} — INR ${(item.quantity * item.unitPrice).toFixed(2)}`,
            ),
            "",
            `Subtotal: INR ${gst.subtotal.toFixed(2)}`,
            `CGST (${form.cgstPercent}%): INR ${gst.cgstAmount.toFixed(2)}`,
            `SGST (${form.sgstPercent}%): INR ${gst.sgstAmount.toFixed(2)}`,
            `IGST (${form.igstPercent}%): INR ${gst.igstAmount.toFixed(2)}`,
            `Total: INR ${gst.total.toFixed(2)}`,
            "",
            `Payment Terms: ${form.paymentTerms}`,
            "",
            "[QR Code Placeholder — UPI/Payment Link]",
        ].join("\n");

    const statusVariant = form.status === "paid" ? "success" : form.status === "sent" ? "info" : "warning";

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">GST Invoice</h3>
                    <Badge variant={statusVariant}>{form.status}</Badge>
                </div>
                <FieldInput id="inv-num" label="Invoice Number" value={form.invoiceNumber} onChange={(e) => setForm({ invoiceNumber: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                    <FieldInput id="inv-date" label="Invoice Date" type="date" value={form.invoiceDate} onChange={(e) => setForm({ invoiceDate: e.target.value })} />
                    <FieldInput id="inv-due" label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ dueDate: e.target.value })} />
                </div>
                <FieldInput id="inv-gstin" label="GSTIN" value={form.gstin} onChange={(e) => setForm({ gstin: e.target.value })} placeholder="22AAAAA0000A1Z5" />
                <FieldInput id="inv-client" label="Client Company" value={form.client.company} onChange={(e) => setForm({ client: { ...form.client, company: e.target.value } })} />
                <LineItemsEditor items={form.lineItems} onChange={(items) => setForm({ lineItems: items })} currency="INR" />
                <div className="grid grid-cols-3 gap-4">
                    <FieldInput id="inv-cgst" label="CGST %" type="number" value={form.cgstPercent} onChange={(e) => setForm({ cgstPercent: Number(e.target.value) })} />
                    <FieldInput id="inv-sgst" label="SGST %" type="number" value={form.sgstPercent} onChange={(e) => setForm({ sgstPercent: Number(e.target.value) })} />
                    <FieldInput id="inv-igst" label="IGST %" type="number" value={form.igstPercent} onChange={(e) => setForm({ igstPercent: Number(e.target.value) })} />
                </div>
                <FieldTextarea id="inv-terms" label="Payment Terms" rows={2} value={form.paymentTerms} onChange={(e) => setForm({ paymentTerms: e.target.value })} />
                <FieldSelect
                    id="inv-status"
                    label="Status"
                    value={form.status}
                    onChange={(e) => setForm({ status: e.target.value as InvoiceFormData["status"] })}
                    options={[
                        { value: "draft", label: "Draft" },
                        { value: "sent", label: "Sent" },
                        { value: "paid", label: "Paid" },
                    ]}
                />
                <div className="rounded-lg border border-dashed border-[var(--dos-border)] p-4 text-center text-sm text-[var(--dos-text-tertiary)]" aria-label="QR code placeholder">
                    QR Code Placeholder — Payment Link
                </div>
                <SignaturePad value={form.signatureDataUrl} onChange={(sig) => setForm({ signatureDataUrl: sig })} />
            </Card>
            <div className="space-y-4">
                <DocumentPreview content={buildContent()} title="Invoice Preview" />
                <ExportActions title={`Invoice ${form.invoiceNumber}`} content={buildContent()} filename={`invoice-${form.invoiceNumber}`} signatureDataUrl={form.signatureDataUrl} />
                <button type="button" className="text-sm text-emerald-600 underline" onClick={() => saveDocument({ type: "invoice", title: `Invoice ${form.invoiceNumber}`, content: buildContent() })}>
                    Save to library
                </button>
            </div>
        </div>
    );
}
