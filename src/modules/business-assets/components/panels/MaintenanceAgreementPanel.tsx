"use client";

import { Card } from "@/src/design-os/components/Card";
import { useBusinessAssets } from "../../hooks/useBusinessAssets";
import { saveDocument } from "../../lib/document-library";
import { DocumentPreview } from "../shared/DocumentPreview";
import { ExportActions } from "../shared/ExportActions";
import { SignaturePad } from "../shared/SignaturePad";
import { FieldInput, FieldTextarea } from "../shared/FormField";

export function MaintenanceAgreementPanel() {
    const { state, update } = useBusinessAssets();
    const form = state.maintenanceAgreement;

    const setForm = (patch: Partial<typeof form>) => update("maintenanceAgreement", { ...form, ...patch });

    const buildContent = () =>
        [
            `# Maintenance & Support Agreement — ${form.reference}`,
            `Client: ${form.counterparty}`,
            `Effective Date: ${form.effectiveDate}`,
            `SLA Tier: ${form.slaTier}`,
            `Response Time: ${form.responseTime}`,
            "",
            "## Agreement Content",
            form.content,
            "",
            "## Renewal Terms",
            form.renewalTerms,
            "",
            "## Escalation Tiers",
            form.escalationTiers,
        ].join("\n");

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
                <h3 className="text-lg font-semibold">Maintenance Agreement</h3>
                <FieldInput id="maint-ref" label="Reference" value={form.reference} onChange={(e) => setForm({ reference: e.target.value })} />
                <FieldInput id="maint-client" label="Client" value={form.counterparty} onChange={(e) => setForm({ counterparty: e.target.value })} />
                <FieldInput id="maint-date" label="Effective Date" type="date" value={form.effectiveDate} onChange={(e) => setForm({ effectiveDate: e.target.value })} />
                <FieldInput id="maint-sla" label="SLA Tier" value={form.slaTier} onChange={(e) => setForm({ slaTier: e.target.value })} />
                <FieldInput id="maint-response" label="Response Time" value={form.responseTime} onChange={(e) => setForm({ responseTime: e.target.value })} />
                <FieldTextarea id="maint-renewal" label="Renewal Terms" rows={3} value={form.renewalTerms} onChange={(e) => setForm({ renewalTerms: e.target.value })} />
                <FieldTextarea id="maint-escalation" label="Escalation Tiers" rows={3} value={form.escalationTiers} onChange={(e) => setForm({ escalationTiers: e.target.value })} />
                <FieldTextarea id="maint-content" label="Agreement Content" rows={12} value={form.content} onChange={(e) => setForm({ content: e.target.value })} />
                <SignaturePad value={form.signatureDataUrl} onChange={(sig) => setForm({ signatureDataUrl: sig })} />
            </Card>
            <div className="space-y-4">
                <DocumentPreview content={buildContent()} title="Maintenance Agreement Preview" />
                <ExportActions title={`Maintenance Agreement ${form.reference}`} content={buildContent()} filename={`maintenance-${form.reference}`} signatureDataUrl={form.signatureDataUrl} />
                <button type="button" className="text-sm text-emerald-600 underline" onClick={() => saveDocument({ type: "maintenance-agreement", title: `Maintenance ${form.reference}`, content: buildContent() })}>
                    Save to library
                </button>
            </div>
        </div>
    );
}
