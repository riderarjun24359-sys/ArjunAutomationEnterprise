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

export function NdaGeneratorPanel() {
    const { state, update } = useBusinessAssets();
    const form = state.nda;

    const onUpdate = (patch: Partial<LegalDocumentFormData>) => update("nda", { ...form, ...patch });

    const buildContent = () =>
        [
            `# Non-Disclosure Agreement`,
            `Reference: ${form.reference}`,
            `Counterparty: ${form.counterparty}`,
            `Effective Date: ${form.effectiveDate}`,
            "",
            form.content,
        ].join("\n");

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
                <h3 className="text-lg font-semibold">Non-Disclosure Agreement</h3>
                <div>
                    <label htmlFor="nda-ref" className="mb-1 block text-sm font-medium">Reference</label>
                    <Input id="nda-ref" value={form.reference} onChange={(e) => onUpdate({ reference: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="nda-party" className="mb-1 block text-sm font-medium">Counterparty</label>
                    <Input id="nda-party" value={form.counterparty} onChange={(e) => onUpdate({ counterparty: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="nda-date" className="mb-1 block text-sm font-medium">Effective Date</label>
                    <Input id="nda-date" type="date" value={form.effectiveDate} onChange={(e) => onUpdate({ effectiveDate: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="nda-content" className="mb-1 block text-sm font-medium">Document Content</label>
                    <Textarea id="nda-content" rows={16} value={form.content} onChange={(e) => onUpdate({ content: e.target.value })} />
                </div>
                <SignaturePad value={form.signatureDataUrl} onChange={(sig) => onUpdate({ signatureDataUrl: sig })} />
            </Card>
            <div className="space-y-4">
                <DocumentPreview content={buildContent()} title="NDA Preview" />
                <ExportActions title="Non-Disclosure Agreement" content={buildContent()} filename={`nda-${form.reference}`} signatureDataUrl={form.signatureDataUrl} />
                <button type="button" className="text-sm text-emerald-600 underline" onClick={() => saveDocument({ type: "nda", title: `NDA ${form.reference}`, content: buildContent() })}>
                    Save to library
                </button>
            </div>
        </div>
    );
}
