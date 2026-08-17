"use client";

import { BookOpen, Briefcase, CheckCircle2, FileText, FolderOpen, Palette, XCircle } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { StatCard } from "@/src/components/ui/StatCard";
import { BRAND_ASSET_FOLDERS, getAllDocuments, getDocumentsByCategory } from "@/src/modules/brand-os/lib/documents";
import { BRAND_OS_THEME } from "@/src/modules/brand-os/constants";

interface BrandOsOverviewProps {
    brandBookComplete: boolean;
    brandBookPresent: number;
    brandBookTotal: number;
    onSelectDocument: (documentId: string) => void;
}

export function BrandOsOverview({ brandBookComplete, brandBookPresent, brandBookTotal, onSelectDocument }: BrandOsOverviewProps) {
    const allDocs = getAllDocuments();
    const foundationDocs = getDocumentsByCategory("foundation");
    const serviceDocs = getDocumentsByCategory("services");
    const salesDocs = getDocumentsByCategory("sales-kit");

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Foundation Docs" value={String(foundationDocs.length)} detail="Brand book, visual identity, profile" trend="up" />
                <StatCard title="Service Library" value={String(serviceDocs.length)} detail="Core service definitions" trend="up" />
                <StatCard title="Sales Kit" value={String(salesDocs.length)} detail="Templates and questionnaires" trend="up" />
                <StatCard title="Asset Folders" value={String(BRAND_ASSET_FOLDERS.length)} detail="Logos, icons, templates, more" trend="up" />
            </div>

            <Card hover>
                <div className="flex items-start gap-4">
                    {brandBookComplete ? (
                        <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-600" />
                    ) : (
                        <XCircle className="h-8 w-8 shrink-0 text-amber-500" />
                    )}
                    <div>
                        <h3 className="text-lg font-semibold">Brand Book Completeness</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {brandBookPresent} of {brandBookTotal} required sections present
                            {brandBookComplete ? " — complete" : " — review missing sections"}
                        </p>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card hover>
                    <div className="mb-4 flex items-center gap-2">
                        <BookOpen className={`h-5 w-5 ${BRAND_OS_THEME.text}`} />
                        <h3 className="font-semibold">Foundation</h3>
                    </div>
                    <ul className="space-y-2">
                        {foundationDocs.map((doc) => (
                            <li key={doc.id}>
                                <button type="button" onClick={() => onSelectDocument(doc.id)} className={`text-sm ${BRAND_OS_THEME.text} hover:underline`}>
                                    {doc.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card hover>
                    <div className="mb-4 flex items-center gap-2">
                        <Briefcase className={`h-5 w-5 ${BRAND_OS_THEME.text}`} />
                        <h3 className="font-semibold">Service Library</h3>
                    </div>
                    <ul className="space-y-2">
                        {serviceDocs.map((doc) => (
                            <li key={doc.id}>
                                <button type="button" onClick={() => onSelectDocument(doc.id)} className={`text-sm ${BRAND_OS_THEME.text} hover:underline`}>
                                    {doc.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card hover>
                    <div className="mb-4 flex items-center gap-2">
                        <FileText className={`h-5 w-5 ${BRAND_OS_THEME.text}`} />
                        <h3 className="font-semibold">Sales Kit</h3>
                    </div>
                    <ul className="space-y-2">
                        {salesDocs.map((doc) => (
                            <li key={doc.id}>
                                <button type="button" onClick={() => onSelectDocument(doc.id)} className={`text-sm ${BRAND_OS_THEME.text} hover:underline`}>
                                    {doc.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card hover>
                    <div className="mb-4 flex items-center gap-2">
                        <FolderOpen className={`h-5 w-5 ${BRAND_OS_THEME.text}`} />
                        <h3 className="font-semibold">Asset Library</h3>
                    </div>
                    <ul className="space-y-2">
                        {BRAND_ASSET_FOLDERS.map((folder) => (
                            <li key={folder} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Palette className="h-3.5 w-3.5" />
                                brand-assets/{folder}/
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <Card>
                <p className="text-sm text-slate-500">
                    {allDocs.length} official documents in the Brand OS registry. This module is the authoritative brand foundation — not a database-backed operational layer.
                </p>
            </Card>
        </div>
    );
}
