"use client";

import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { useBusinessAssets } from "../../hooks/useBusinessAssets";
import { saveDocument } from "../../lib/document-library";
import { DocumentPreview } from "../shared/DocumentPreview";
import { ExportActions } from "../shared/ExportActions";
import { SignaturePad } from "../shared/SignaturePad";
import { FieldInput, FieldTextarea } from "../shared/FormField";
import type { SowFormData, SowMilestone } from "../../types";

export function SowGeneratorPanel() {
    const { state, update } = useBusinessAssets();
    const form = state.sow;

    const setForm = (patch: Partial<SowFormData>) => update("sow", { ...form, ...patch });

    const updateMilestone = (id: string, patch: Partial<SowMilestone>) => {
        setForm({
            milestones: form.milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        });
    };

    const addMilestone = () => {
        setForm({
            milestones: [
                ...form.milestones,
                { id: `m-${Date.now()}`, name: "", week: "", deliverable: "", acceptanceCriteria: "" },
            ],
        });
    };

    const buildContent = () =>
        [
            `# Statement of Work — ${form.reference}`,
            `Project: ${form.projectTitle}`,
            `Client: ${form.client.company}`,
            "",
            "## Scope",
            form.scope,
            "",
            "## Milestones",
            ...form.milestones.map(
                (m) => `### ${m.name} (Week ${m.week})\nDeliverable: ${m.deliverable}\nAcceptance: ${m.acceptanceCriteria}`,
            ),
            "",
            "## Terms",
            form.terms,
            "",
            "## Acceptance",
            form.acceptanceTerms,
        ].join("\n");

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
                <h3 className="text-lg font-semibold">Enterprise SOW Builder</h3>
                <FieldInput id="sow-ref" label="SOW Reference" value={form.reference} onChange={(e) => setForm({ reference: e.target.value })} />
                <FieldInput id="sow-title" label="Project Title" value={form.projectTitle} onChange={(e) => setForm({ projectTitle: e.target.value })} />
                <FieldInput id="sow-client" label="Client Company" value={form.client.company} onChange={(e) => setForm({ client: { ...form.client, company: e.target.value } })} />
                <FieldTextarea id="sow-scope" label="Scope of Work" rows={5} value={form.scope} onChange={(e) => setForm({ scope: e.target.value })} />
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Milestones</h4>
                    {form.milestones.map((m) => (
                        <div key={m.id} className="space-y-2 rounded-lg border border-[var(--dos-border)] p-3">
                            <FieldInput id={`sow-m-name-${m.id}`} label="Name" value={m.name} onChange={(e) => updateMilestone(m.id, { name: e.target.value })} />
                            <FieldInput id={`sow-m-week-${m.id}`} label="Week" value={m.week} onChange={(e) => updateMilestone(m.id, { week: e.target.value })} />
                            <FieldInput id={`sow-m-del-${m.id}`} label="Deliverable" value={m.deliverable} onChange={(e) => updateMilestone(m.id, { deliverable: e.target.value })} />
                            <FieldTextarea id={`sow-m-acc-${m.id}`} label="Acceptance Criteria" rows={2} value={m.acceptanceCriteria} onChange={(e) => updateMilestone(m.id, { acceptanceCriteria: e.target.value })} />
                        </div>
                    ))}
                    <Button variant="secondary" onClick={addMilestone}>Add Milestone</Button>
                </div>
                <FieldTextarea id="sow-terms" label="Terms" rows={3} value={form.terms} onChange={(e) => setForm({ terms: e.target.value })} />
                <FieldTextarea id="sow-accept" label="Acceptance Terms" rows={3} value={form.acceptanceTerms} onChange={(e) => setForm({ acceptanceTerms: e.target.value })} />
                <SignaturePad value={form.signatureDataUrl} onChange={(sig) => setForm({ signatureDataUrl: sig })} />
            </Card>
            <div className="space-y-4">
                <DocumentPreview content={buildContent()} title="SOW Preview" />
                <ExportActions title={`SOW ${form.reference}`} content={buildContent()} filename={`sow-${form.reference}`} signatureDataUrl={form.signatureDataUrl} />
                <button type="button" className="text-sm text-emerald-600 underline" onClick={() => saveDocument({ type: "sow", title: `SOW ${form.reference}`, content: buildContent() })}>
                    Save to library
                </button>
            </div>
        </div>
    );
}
