"use client";

import { useState } from "react";
import { Tabs } from "@/src/design-os/components/Tabs";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import {
    BUSINESS_ASSETS_TABS,
    BUSINESS_ASSETS_TAB_LIST,
    BUSINESS_ASSETS_THEME,
} from "@/src/modules/business-assets/constants";
import { CompanyProfilePanel } from "./panels/CompanyProfilePanel";
import { ServiceCatalogPanel } from "./panels/ServiceCatalogPanel";
import { ProposalGeneratorPanel } from "./panels/ProposalGeneratorPanel";
import { QuotationGeneratorPanel } from "./panels/QuotationGeneratorPanel";
import { InvoiceGeneratorPanel } from "./panels/InvoiceGeneratorPanel";
import { SowGeneratorPanel } from "./panels/SowGeneratorPanel";
import { NdaGeneratorPanel } from "./panels/NdaGeneratorPanel";
import { ClientAgreementPanel } from "./panels/ClientAgreementPanel";
import { MaintenanceAgreementPanel } from "./panels/MaintenanceAgreementPanel";
import { DocumentLibraryPanel } from "./panels/DocumentLibraryPanel";

export function BusinessAssetsPage() {
    const [activeTab, setActiveTab] = useState<string>(BUSINESS_ASSETS_TABS.companyProfile);

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">V5 Business Assets OS</Badge>
                <h1 className={`mt-3 text-3xl font-bold text-[var(--dos-text-primary)]`}>
                    Business Assets Operating System
                </h1>
                <p className={`mt-2 max-w-3xl text-[var(--dos-text-secondary)]`}>
                    Production-ready company profile, service catalog, and document generators for proposals, quotations, invoices, SOWs, NDAs, and agreements — integrated with Brand OS and Design OS.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-3">
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${BUSINESS_ASSETS_THEME.text}`}>Sections</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">10</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${BUSINESS_ASSETS_THEME.text}`}>Services</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">5</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${BUSINESS_ASSETS_THEME.text}`}>Generators</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">7</p>
                    </Card>
                </StaggerRevealItem>
            </StaggerReveal>

            <Tabs
                tabs={BUSINESS_ASSETS_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))}
                active={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === BUSINESS_ASSETS_TABS.companyProfile && <CompanyProfilePanel />}
            {activeTab === BUSINESS_ASSETS_TABS.serviceCatalog && <ServiceCatalogPanel />}
            {activeTab === BUSINESS_ASSETS_TABS.proposal && <ProposalGeneratorPanel />}
            {activeTab === BUSINESS_ASSETS_TABS.quotation && <QuotationGeneratorPanel />}
            {activeTab === BUSINESS_ASSETS_TABS.invoice && <InvoiceGeneratorPanel />}
            {activeTab === BUSINESS_ASSETS_TABS.sow && <SowGeneratorPanel />}
            {activeTab === BUSINESS_ASSETS_TABS.nda && <NdaGeneratorPanel />}
            {activeTab === BUSINESS_ASSETS_TABS.clientAgreement && <ClientAgreementPanel />}
            {activeTab === BUSINESS_ASSETS_TABS.maintenanceAgreement && <MaintenanceAgreementPanel />}
            {activeTab === BUSINESS_ASSETS_TABS.documentLibrary && <DocumentLibraryPanel />}
        </PageTransition>
    );
}
