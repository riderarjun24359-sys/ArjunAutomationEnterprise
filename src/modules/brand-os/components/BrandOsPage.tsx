"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandOsDocPanel } from "@/src/modules/brand-os/components/BrandOsDocPanel";
import { BrandOsOverview } from "@/src/modules/brand-os/components/BrandOsOverview";
import { BRAND_OS_TAB_LIST, BRAND_OS_TABS, BRAND_OS_THEME } from "@/src/modules/brand-os/constants";
import { getAllDocuments, getDocumentById, getDocumentsByCategory } from "@/src/modules/brand-os/lib/documents";
import type { BrandDocument } from "@/src/modules/brand-os/types";

export function BrandOsPage() {
    const [activeTab, setActiveTab] = useState<string>(BRAND_OS_TABS.overview);
    const [selectedDocId, setSelectedDocId] = useState<string>("brand-book");
    const [brandBookComplete, setBrandBookComplete] = useState(false);
    const [brandBookPresent, setBrandBookPresent] = useState(0);
    const [brandBookTotal, setBrandBookTotal] = useState(18);

    useEffect(() => {
        fetch("/api/brand-os/documents/brand-book")
            .then((res) => res.json())
            .then((data: { content: string; completeness?: { complete: boolean; totalPresent: number; totalRequired: number } }) => {
                if (data.completeness) {
                    setBrandBookComplete(data.completeness.complete);
                    setBrandBookPresent(data.completeness.totalPresent);
                    setBrandBookTotal(data.completeness.totalRequired);
                }
            })
            .catch(() => undefined);
    }, []);

    const handleSelectDocument = (documentId: string) => {
        setSelectedDocId(documentId);
        const doc = getDocumentById(documentId);
        if (doc?.category === "services") {
            setActiveTab(BRAND_OS_TABS.services);
        } else if (doc?.category === "sales-kit") {
            setActiveTab(BRAND_OS_TABS.salesKit);
        } else if (documentId === "brand-book") {
            setActiveTab(BRAND_OS_TABS.brandBook);
        } else if (documentId === "visual-identity") {
            setActiveTab(BRAND_OS_TABS.visualIdentity);
        } else if (documentId === "company-profile") {
            setActiveTab(BRAND_OS_TABS.companyProfile);
        }
    };

    const resolveActiveDocument = (): BrandDocument | undefined => {
        if (activeTab === BRAND_OS_TABS.brandBook) return getDocumentById("brand-book");
        if (activeTab === BRAND_OS_TABS.visualIdentity) return getDocumentById("visual-identity");
        if (activeTab === BRAND_OS_TABS.companyProfile) return getDocumentById("company-profile");
        if (activeTab === BRAND_OS_TABS.services || activeTab === BRAND_OS_TABS.salesKit) {
            return getDocumentById(selectedDocId);
        }
        return undefined;
    };

    const activeDocument = resolveActiveDocument();
    const serviceDocs = getDocumentsByCategory("services");
    const salesDocs = getDocumentsByCategory("sales-kit");

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-orange-950 dark:text-orange-100">
            <motion.header
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-[2rem] border ${BRAND_OS_THEME.border} ${BRAND_OS_THEME.surface} p-6 shadow-sm backdrop-blur`}
            >
                <p className={`text-sm font-medium uppercase tracking-[0.24em] ${BRAND_OS_THEME.text}`}>V2 Brand OS</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Official Arjun Automation Brand Foundation</h1>
                <p className="mt-3 max-w-2xl text-sm text-orange-600 dark:text-orange-400">
                    Authoritative brand book, visual identity, service library, company profile, sales kit, and asset library — documentation-first, PDF-ready, and separate from operational growth engine tables.
                </p>
            </motion.header>

            <div className="flex flex-wrap gap-2 print:hidden">
                {BRAND_OS_TAB_LIST.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                            setActiveTab(tab.id);
                            if (tab.id === BRAND_OS_TABS.brandBook) setSelectedDocId("brand-book");
                            if (tab.id === BRAND_OS_TABS.visualIdentity) setSelectedDocId("visual-identity");
                            if (tab.id === BRAND_OS_TABS.companyProfile) setSelectedDocId("company-profile");
                            if (tab.id === BRAND_OS_TABS.services) setSelectedDocId("services-index");
                            if (tab.id === BRAND_OS_TABS.salesKit) setSelectedDocId("proposal-template");
                        }}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            activeTab === tab.id
                                ? `${BRAND_OS_THEME.bg} text-white`
                                : `border border-slate-200 text-orange-500 hover:border-orange-300 dark:border-slate-800 dark:text-orange-300`
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === BRAND_OS_TABS.overview ? (
                <BrandOsOverview
                    brandBookComplete={brandBookComplete}
                    brandBookPresent={brandBookPresent}
                    brandBookTotal={brandBookTotal}
                    onSelectDocument={handleSelectDocument}
                />
            ) : null}

            {activeTab === BRAND_OS_TABS.assets ? (
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/90">
                    <h2 className="text-lg font-semibold">Brand Asset Library</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Asset folders live at <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">src/modules/brand-os/brand-assets/</code>. Each folder includes a README with purpose and usage rules.
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {getAllDocuments().length > 0
                            ? ["logos", "icons", "fonts", "social", "templates", "presentations", "proposals", "backgrounds", "illustrations"].map((folder) => (
                                  <li key={folder} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                                      brand-assets/{folder}/
                                  </li>
                              ))
                            : null}
                    </ul>
                </div>
            ) : null}

            {(activeTab === BRAND_OS_TABS.services || activeTab === BRAND_OS_TABS.salesKit) && activeDocument ? (
                <div className="flex flex-wrap gap-2 print:hidden">
                    {(activeTab === BRAND_OS_TABS.services ? serviceDocs : salesDocs).map((doc) => (
                        <button
                            key={doc.id}
                            type="button"
                            onClick={() => setSelectedDocId(doc.id)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                selectedDocId === doc.id ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" : "text-orange-600 hover:bg-indigo-50 dark:text-orange-400"
                            }`}
                        >
                            {doc.title}
                        </button>
                    ))}
                </div>
            ) : null}

            {activeDocument && activeTab !== BRAND_OS_TABS.overview && activeTab !== BRAND_OS_TABS.assets ? (
                <BrandOsDocPanel key={activeDocument.id} document={activeDocument} />
            ) : null}
        </div>
    );
}
