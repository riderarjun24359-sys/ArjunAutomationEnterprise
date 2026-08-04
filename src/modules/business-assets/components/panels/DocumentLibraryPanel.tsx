"use client";

import { useMemo, useState } from "react";
import { Card } from "@/src/design-os/components/Card";
import { FieldInput } from "../shared/FormField";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Dialog } from "@/src/design-os/components/Dialog";
import { getAllDocuments, searchDocuments, deleteDocument } from "../../lib/document-library";
import { downloadPdf, exportToPdf } from "../../lib/export-pdf";
import { downloadDocx, exportToDocx } from "../../lib/export-docx";
import { buildHtml } from "../../lib/document-builder";
import type { DocumentCategory, StoredDocument } from "../../types";

const CATEGORIES: { value: DocumentCategory | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "profile", label: "Profile" },
    { value: "catalog", label: "Catalog" },
    { value: "sales", label: "Sales" },
    { value: "finance", label: "Finance" },
    { value: "legal", label: "Legal" },
];

export function DocumentLibraryPanel() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<DocumentCategory | "all">("all");
    const [preview, setPreview] = useState<StoredDocument | null>(null);
    const [refresh, setRefresh] = useState(0);

    const docs = useMemo(() => {
        void refresh;
        const all = query ? searchDocuments(query) : getAllDocuments();
        return category === "all" ? all : all.filter((d) => d.category === category);
    }, [query, category, refresh]);

    const handleDownloadPdf = async (doc: StoredDocument) => {
        const blob = await exportToPdf({ title: doc.title, content: doc.content });
        downloadPdf(blob, doc.title);
    };

    const handleDownloadDocx = (doc: StoredDocument) => {
        const html = buildHtml({ title: doc.title, sections: [{ body: doc.content }], footer: "© Arjun Automation." });
        downloadDocx(exportToDocx({ title: doc.title, html }), doc.title);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
                <FieldInput id="lib-search" label="Search documents" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or content..." className="min-w-[240px]" />
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => setCategory(c.value)}
                            className={`rounded-full px-3 py-1 text-sm ${category === c.value ? "bg-emerald-600 text-white" : "bg-[var(--dos-surface-secondary)]"}`}
                            aria-pressed={category === c.value}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {docs.length === 0 ? (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">No documents found. Generate and save documents from other panels.</p></Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {docs.map((doc) => (
                        <Card key={doc.id}>
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-[var(--dos-text-primary)]">{doc.title}</h3>
                                <Badge>{doc.category}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                                v{doc.version} · {new Date(doc.updatedAt).toLocaleDateString()}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Button variant="secondary" onClick={() => setPreview(doc)}>Preview</Button>
                                <Button variant="ghost" onClick={() => handleDownloadPdf(doc)}>PDF</Button>
                                <Button variant="ghost" onClick={() => handleDownloadDocx(doc)}>DOCX</Button>
                                <Button variant="danger" onClick={() => { deleteDocument(doc.id); setRefresh((r) => r + 1); }}>Delete</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!preview} onClose={() => setPreview(null)} title={preview?.title ?? "Preview"}>
                {preview && (
                    <div className="space-y-4">
                        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">{preview.content}</pre>
                        {preview.versions.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold">Version History</h4>
                                <ul className="mt-2 space-y-1 text-xs text-[var(--dos-text-secondary)]">
                                    {preview.versions.map((v) => (
                                        <li key={v.version}>v{v.version} — {new Date(v.savedAt).toLocaleString()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </div>
    );
}
