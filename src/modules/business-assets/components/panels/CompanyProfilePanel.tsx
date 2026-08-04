"use client";

import { Card } from "@/src/design-os/components/Card";
import { Textarea } from "@/src/design-os/components/Textarea";
import { useBusinessAssets } from "../../hooks/useBusinessAssets";
import { saveDocument } from "../../lib/document-library";
import type { CompanyProfileSection } from "../../types";
import { DocumentPreview } from "../shared/DocumentPreview";
import { ExportActions } from "../shared/ExportActions";

export function CompanyProfilePanel() {
    const { state, update } = useBusinessAssets();

    const updateSection = (id: string, content: string) => {
        const sections = state.companyProfile.sections.map((s) =>
            s.id === id ? { ...s, content } : s,
        );
        update("companyProfile", { sections, updatedAt: new Date().toISOString() });
    };

    const buildContent = () =>
        state.companyProfile.sections
            .map((s: CompanyProfileSection) => `## ${s.title}\n\n${s.content}`)
            .join("\n\n");

    const handleSaveLibrary = () => {
        const content = buildContent();
        saveDocument({ type: "company-profile", title: "Arjun Automation — Company Profile", content });
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
                {state.companyProfile.sections.map((section) => (
                    <Card key={section.id}>
                        <label htmlFor={section.id} className="mb-2 block text-sm font-semibold text-[var(--dos-text-primary)]">
                            {section.title}
                        </label>
                        <Textarea
                            id={section.id}
                            rows={6}
                            value={section.content}
                            onChange={(e) => updateSection(section.id, e.target.value)}
                            aria-label={section.title}
                        />
                    </Card>
                ))}
                <button type="button" onClick={handleSaveLibrary} className="text-sm text-emerald-600 underline">
                    Save to Document Library
                </button>
            </div>
            <div className="space-y-4">
                <DocumentPreview content={buildContent()} title="Company Profile Preview" />
                <ExportActions title="Arjun Automation — Company Profile" content={buildContent()} filename="company-profile" />
            </div>
        </div>
    );
}
