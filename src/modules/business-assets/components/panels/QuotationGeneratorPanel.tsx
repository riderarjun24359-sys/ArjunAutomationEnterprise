"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { useBusinessAssets } from "../../hooks/useBusinessAssets";
import { saveDocument } from "../../lib/document-library";
import { DocumentPreview } from "../shared/DocumentPreview";
import { ExportActions } from "../shared/ExportActions";
import { LineItemsEditor } from "../shared/LineItemsEditor";
import { SignaturePad } from "../shared/SignaturePad";
import { FieldInput, FieldTextarea } from "../shared/FormField";
import type { QuotationFormData } from "../../types";

export function QuotationGeneratorPanel() {
    const { state, update, service } = useBusinessAssets();
    const form = state.quotation;

    const setForm = (patch: Partial<QuotationFormData>) => update("quotation", { ...form, ...patch });

    const totals = service.calculateLineItemsTotal(form.lineItems, form.discountPercent, form.taxPercent);

    const buildContent = () =>
        [
            `# Quotation — ${form.reference}`,
            `Client: ${form.client.company}`,
            `Currency: ${form.currency}`,
            `Valid Until: ${form.validUntil}`,
            `Status: ${form.approvalStatus}`,
            "",
            "## Line Items",
            ...form.lineItems.map(
                (item, i) => `${i + 1}. ${item.description} — ${form.currency} ${(item.quantity * item.unitPrice).toFixed(2)}`,
            ),
            "",
            `Subtotal: ${form.currency} ${totals.subtotal.toFixed(2)}`,
            `Discount (${form.discountPercent}%): -${form.currency} ${totals.discount.toFixed(2)}`,
            `Tax (${form.taxPercent}%): ${form.currency} ${totals.tax.toFixed(2)}`,
            `Total: ${form.currency} ${totals.total.toFixed(2)}`,
            "",
            form.notes,
        ].join("\n");

    const statusVariant = form.approvalStatus === "approved" ? "success" : form.approvalStatus === "rejected" ? "error" : "info";

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Quotation Details</h3>
                    <Badge variant={statusVariant}>{form.approvalStatus}</Badge>
                </div>
                <FieldInput id="quote-ref" label="Reference" value={form.reference} onChange={(e) => setForm({ reference: e.target.value })} />
                <FieldInput id="quote-currency" label="Currency" value={form.currency} onChange={(e) => setForm({ currency: e.target.value })} />
                <FieldInput id="quote-valid" label="Valid Until" type="date" value={form.validUntil} onChange={(e) => setForm({ validUntil: e.target.value })} />
                <FieldInput id="quote-client" label="Client Company" value={form.client.company} onChange={(e) => setForm({ client: { ...form.client, company: e.target.value } })} />
                <LineItemsEditor items={form.lineItems} onChange={(items) => setForm({ lineItems: items })} currency={form.currency} />
                <div className="grid grid-cols-2 gap-4">
                    <FieldInput id="quote-discount" label="Discount %" type="number" value={form.discountPercent} onChange={(e) => setForm({ discountPercent: Number(e.target.value) })} />
                    <FieldInput id="quote-tax" label="Tax %" type="number" value={form.taxPercent} onChange={(e) => setForm({ taxPercent: Number(e.target.value) })} />
                </div>
                <FieldTextarea id="quote-notes" label="Notes" rows={3} value={form.notes} onChange={(e) => setForm({ notes: e.target.value })} />
                <div className="flex flex-wrap gap-2" role="group" aria-label="Approval workflow">
                    <Button variant="secondary" onClick={() => setForm({ approvalStatus: "pending" })}>Submit for Approval</Button>
                    <Button variant="primary" onClick={() => setForm({ approvalStatus: "approved" })}>Approve</Button>
                    <Button variant="danger" onClick={() => setForm({ approvalStatus: "rejected" })}>Reject</Button>
                </div>
                <SignaturePad value={form.signatureDataUrl} onChange={(sig) => setForm({ signatureDataUrl: sig })} />
            </Card>
            <div className="space-y-4">
                <DocumentPreview content={buildContent()} title="Quotation Preview" />
                <ExportActions title={`Quotation ${form.reference}`} content={buildContent()} filename={`quotation-${form.reference}`} signatureDataUrl={form.signatureDataUrl} />
                <button type="button" className="text-sm text-emerald-600 underline" onClick={() => saveDocument({ type: "quotation", title: `Quotation ${form.reference}`, content: buildContent() })}>
                    Save to library
                </button>
            </div>
        </div>
    );
}
