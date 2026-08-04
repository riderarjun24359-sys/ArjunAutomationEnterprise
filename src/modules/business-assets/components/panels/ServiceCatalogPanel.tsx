"use client";

import { useState } from "react";
import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { Textarea } from "@/src/design-os/components/Textarea";
import { useBusinessAssets } from "../../hooks/useBusinessAssets";
import { saveDocument } from "../../lib/document-library";
import { DocumentPreview } from "../shared/DocumentPreview";
import { ExportActions } from "../shared/ExportActions";
import type { ServiceCatalogItem } from "../../types";

export function ServiceCatalogPanel() {
    const { state, update } = useBusinessAssets();
    const [selectedId, setSelectedId] = useState(state.servicesCatalog[0]?.id ?? "");

    const selected = state.servicesCatalog.find((s) => s.id === selectedId);

    const updateService = (patch: Partial<ServiceCatalogItem>) => {
        if (!selected) return;
        update(
            "servicesCatalog",
            state.servicesCatalog.map((s) => (s.id === selected.id ? { ...s, ...patch } : s)),
        );
    };

    const buildContent = () => {
        if (!selected) return "";
        return [
            `# ${selected.name}`,
            "",
            "## Overview",
            selected.overview,
            "",
            "## Benefits",
            ...selected.benefits.map((b) => `- ${b}`),
            "",
            "## Deliverables",
            ...selected.deliverables.map((d) => `- ${d}`),
            "",
            "## Timeline",
            selected.timeline,
            "",
            "## Pricing",
            selected.pricingPlaceholder,
            "",
            "## Industries",
            ...selected.industries.map((i) => `- ${i}`),
            "",
            "## Technology",
            ...selected.technology.map((t) => `- ${t}`),
            "",
            "## FAQ",
            ...selected.faq.map((f) => `**Q:** ${f.question}\n**A:** ${f.answer}`),
        ].join("\n");
    };

    const buildCatalogContent = () =>
        state.servicesCatalog.map((s) => `# ${s.name}\n${s.overview}\n`).join("\n---\n\n");

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {state.servicesCatalog.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedId(s.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedId === s.id ? "bg-emerald-600 text-white" : "bg-[var(--dos-surface-secondary)] text-[var(--dos-text-secondary)]"}`}
                        aria-pressed={selectedId === s.id}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            {selected && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">{selected.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {selected.industries.map((i) => (
                                <Badge key={i}>{i}</Badge>
                            ))}
                        </div>
                        <label htmlFor="svc-overview" className="mt-4 block text-sm font-medium">Overview</label>
                        <Textarea id="svc-overview" rows={4} value={selected.overview} onChange={(e) => updateService({ overview: e.target.value })} className="mt-1" />
                        <label htmlFor="svc-timeline" className="mt-4 block text-sm font-medium">Timeline</label>
                        <Textarea id="svc-timeline" rows={2} value={selected.timeline} onChange={(e) => updateService({ timeline: e.target.value })} className="mt-1" />
                        <label htmlFor="svc-pricing" className="mt-4 block text-sm font-medium">Pricing</label>
                        <Textarea id="svc-pricing" rows={2} value={selected.pricingPlaceholder} onChange={(e) => updateService({ pricingPlaceholder: e.target.value })} className="mt-1" />
                    </Card>
                    <div className="space-y-4">
                        <DocumentPreview content={buildContent()} title={selected.name} />
                        <ExportActions title={`${selected.name} — Service Catalog`} content={buildContent()} filename={`service-${selected.slug}`} />
                    </div>
                </div>
            )}

            <Card>
                <h3 className="text-lg font-semibold">Full Catalog Export</h3>
                <div className="mt-4">
                    <ExportActions
                        title="Arjun Automation — Service Catalog"
                        content={buildCatalogContent()}
                        filename="service-catalog"
                    />
                    <button
                        type="button"
                        className="mt-3 text-sm text-emerald-600 underline"
                        onClick={() => saveDocument({ type: "service-catalog", title: "Service Catalog", content: buildCatalogContent() })}
                    >
                        Save catalog to library
                    </button>
                </div>
            </Card>
        </div>
    );
}
