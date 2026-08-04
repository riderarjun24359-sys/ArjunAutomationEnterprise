"use client";

import { Card } from "@/src/design-os/components/Card";
import { Input } from "@/src/design-os/components/Input";
import { Textarea } from "@/src/design-os/components/Textarea";
import { useBusinessAssets } from "../../hooks/useBusinessAssets";
import { saveDocument } from "../../lib/document-library";
import { DocumentPreview } from "../shared/DocumentPreview";
import { ExportActions } from "../shared/ExportActions";
import { SignaturePad } from "../shared/SignaturePad";
import type { LegalDocumentFormData } from "../../types";

export function ClientAgreementPanel() {
    const { state, update } = useBusinessAssets();
    const form = state.clientAgreement;

    const onUpdate = (patch: Partial<LegalDocumentFormData>) => update("clientAgreement", { ...form, ...patch });

    const buildContent = () =>
        [
            `# Master Services Agreement`,
            `Reference: ${form.reference}`,
            `Client: ${form.counterparty}`,
            `Effective Date: ${form.effectiveDate}`,
            "",
            form.content,
        ].join("\n");

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
                <h3 className="text-lg font-semibold">Master Services Agreement</h3>
                <div>
                    <label htmlFor="msa-ref" className="mb-1 block text-sm font-medium">Reference</label>
                    <Input id="msa-ref" value={form.reference} onChange={(e) => onUpdate({ reference: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="msa-client" className="mb-1 block text-sm font-medium">Client</label>
                    <Input id="msa-client" value={form.counterparty} onChange={(e) => onUpdate({ counterparty: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="msa-date" className="mb-1 block text-sm font-medium">Effective Date</label>
                    <Input id="msa-date" type="date" value={form.effectiveDate} onChange={(e) => onUpdate({ effectiveDate: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="msa-content" className="mb-1 block text-sm font-medium">Agreement Content</label>
                    <Textarea id="msa-content" rows={16} value={form.content} onChange={(e) => onUpdate({ content: e.target.value })} />
                </div>
                <SignaturePad value={form.signatureDataUrl} onChange={(sig) => onUpdate({ signatureDataUrl: sig })} />
            </Card>
            <div className="space-y-4">
                <DocumentPreview content={buildContent()} title="Client Agreement Preview" />
                <ExportActions title="Master Services Agreement" content={buildContent()} filename={`client-agreement-${form.reference}`} signatureDataUrl={form.signatureDataUrl} />
                <button type="button" className="text-sm text-emerald-600 underline" onClick={() => saveDocument({ type: "client-agreement", title: `MSA ${form.reference}`, content: buildContent() })}>
                    Save to library
                </button>
            </div>
        </div>
    );
}
