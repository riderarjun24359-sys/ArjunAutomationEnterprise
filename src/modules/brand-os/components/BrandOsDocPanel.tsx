"use client";

import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { renderMarkdown } from "@/src/modules/brand-os/lib/markdown";
import type { BrandDocument } from "@/src/modules/brand-os/types";

interface BrandOsDocPanelProps {
    document: BrandDocument;
}

export function BrandOsDocPanel({ document }: BrandOsDocPanelProps) {
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetch(`/api/brand-os/documents/${document.id}`)
            .then(async (res) => {
                if (!res.ok) throw new Error(`Failed to load document (${res.status})`);
                return res.json() as Promise<{ content: string }>;
            })
            .then((data) => {
                if (!cancelled) setContent(data.content);
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [document.id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <LoadingState label={`Loading ${document.title}`} />;
    }

    if (error || !content) {
        return (
            <Card>
                <p className="text-sm text-rose-600">Unable to load document: {error ?? "Unknown error"}</p>
            </Card>
        );
    }

    return (
        <Card className="print:border-0 print:shadow-none">
            <SectionHeader
                title={document.title}
                description={document.description}
                action={
                    <div className="flex flex-col items-end gap-1">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 rounded-full bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 print:hidden"
                        >
                            <Printer className="h-4 w-4" />
                            Print / PDF
                        </button>
                        {document.pdfReady ? (
                            <p className="max-w-xs text-right text-xs text-slate-500 print:hidden">
                                Use browser Print → Save as PDF for export
                            </p>
                        ) : null}
                    </div>
                }
            />
            <article className="prose-brand mt-8 max-w-none text-slate-800 dark:text-slate-200">
                {renderMarkdown(content)}
            </article>
        </Card>
    );
}
