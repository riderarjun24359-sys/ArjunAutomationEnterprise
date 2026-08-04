"use client";

import { Card } from "@/src/design-os/components/Card";
import { useBusinessAssets } from "../../hooks/useBusinessAssets";
import { saveDocument } from "../../lib/document-library";
import { DocumentPreview } from "../shared/DocumentPreview";
import { ExportActions } from "../shared/ExportActions";
import { SignaturePad } from "../shared/SignaturePad";
import { FieldInput, FieldTextarea } from "../shared/FormField";
import type { ProposalFormData } from "../../types";

export function ProposalGeneratorPanel() {
    const { state, update } = useBusinessAssets();
    const form = state.proposal;

    const setForm = (patch: Partial<ProposalFormData>) => update("proposal", { ...form, ...patch });

    const buildContent = () =>
        [
            `# Proposal — ${form.client.company || "[Client]"}`,
            `Reference: ${form.reference}`,
            `Valid Until: ${form.validUntil}`,
            "",
            "## Executive Summary",
            form.executiveSummary,
            "",
            "## Scope",
            form.scope,
            "",
            "## Deliverables",
            ...form.deliverables.filter(Boolean).map((d) => `- ${d}`),
            "",
            "## Timeline",
            form.timeline,
            "",
            "## Commercials",
            form.commercials,
            "",
            "## Terms",
            form.terms,
            "",
            `Prepared for: ${form.client.name} (${form.client.email})`,
        ].join("\n");

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
                <h3 className="text-lg font-semibold">Client Information</h3>
                <FieldInput id="prop-ref" label="Reference" value={form.reference} onChange={(e) => setForm({ reference: e.target.value })} />
                <FieldInput id="prop-valid" label="Valid Until" type="date" value={form.validUntil} onChange={(e) => setForm({ validUntil: e.target.value })} />
                <FieldInput id="prop-name" label="Client Name" value={form.client.name} onChange={(e) => setForm({ client: { ...form.client, name: e.target.value } })} />
                <FieldInput id="prop-co" label="Company" value={form.client.company} onChange={(e) => setForm({ client: { ...form.client, company: e.target.value } })} />
                <FieldInput id="prop-email" label="Email" type="email" value={form.client.email} onChange={(e) => setForm({ client: { ...form.client, email: e.target.value } })} />
                <FieldTextarea id="prop-summary" label="Executive Summary" rows={4} value={form.executiveSummary} onChange={(e) => setForm({ executiveSummary: e.target.value })} />
                <FieldTextarea id="prop-scope" label="Scope" rows={4} value={form.scope} onChange={(e) => setForm({ scope: e.target.value })} />
                <FieldTextarea id="prop-timeline" label="Timeline" rows={3} value={form.timeline} onChange={(e) => setForm({ timeline: e.target.value })} />
                <FieldTextarea id="prop-commercials" label="Commercials" rows={3} value={form.commercials} onChange={(e) => setForm({ commercials: e.target.value })} />
                <FieldTextarea id="prop-terms" label="Terms" rows={4} value={form.terms} onChange={(e) => setForm({ terms: e.target.value })} />
                <SignaturePad value={form.signatureDataUrl} onChange={(sig) => setForm({ signatureDataUrl: sig })} />
            </Card>
            <div className="space-y-4">
                <DocumentPreview content={buildContent()} title="Proposal Preview" />
                <ExportActions title={`Proposal — ${form.client.company || "Draft"}`} content={buildContent()} filename={`proposal-${form.reference}`} signatureDataUrl={form.signatureDataUrl} />
                <button type="button" className="text-sm text-emerald-600 underline" onClick={() => saveDocument({ type: "proposal", title: `Proposal ${form.reference}`, content: buildContent() })}>
                    Save to library
                </button>
            </div>
        </div>
    );
}
