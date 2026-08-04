"use client";

import { useState } from "react";
import { Tabs } from "@/src/design-os/components/Tabs";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { Select } from "@/src/design-os/components/Select";
import { FormField, FormLabel } from "@/src/design-os/components/Form";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from "@/src/modules/gci/lib/localization";
import type { SupportedLanguage } from "@/src/modules/gci/types";
import {
    CLIENT_SUCCESS_TABS,
    CLIENT_SUCCESS_TAB_LIST,
    CLIENT_SUCCESS_THEME,
} from "../constants";
import { useClientSuccessCapability } from "../hooks/useClientSuccessCapability";
import { AiOnboardingPanel } from "./panels/AiOnboardingPanel";
import { ProjectWorkspacePanel } from "./panels/ProjectWorkspacePanel";
import { ClientPortalPanel } from "./panels/ClientPortalPanel";
import { CommunicationCenterPanel } from "./panels/CommunicationCenterPanel";
import { ApprovalCenterPanel } from "./panels/ApprovalCenterPanel";
import { ChangeRequestCenterPanel } from "./panels/ChangeRequestCenterPanel";
import { DeliveryCenterPanel } from "./panels/DeliveryCenterPanel";
import { CustomerHealthPanel } from "./panels/CustomerHealthPanel";
import { RenewalGrowthPanel } from "./panels/RenewalGrowthPanel";
import { AiSuccessManagerPanel } from "./panels/AiSuccessManagerPanel";

export function ClientSuccessCapabilityPage() {
    const [activeTab, setActiveTab] = useState<string>(CLIENT_SUCCESS_TABS.aiOnboarding);
    const {
        clients,
        selectedClientId,
        selectClient,
        setClientLanguage,
        state,
        loading,
    } = useClientSuccessCapability();

    const currentLocale: SupportedLanguage = selectedClientId
        ? (state.clientLocales[selectedClientId] ?? "en")
        : "en";

    const handleLocaleChange = (locale: SupportedLanguage) => {
        if (selectedClientId) setClientLanguage(selectedClientId, locale);
    };

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">V6 Client Success Capability</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">
                    Client Success Operating System
                </h1>
                <p className={`mt-2 max-w-3xl ${CLIENT_SUCCESS_THEME.text}`}>
                    AI-first client success for Arjun Automation — onboarding, delivery, health, renewal, and multilingual client experience via GCI.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-3">
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${CLIENT_SUCCESS_THEME.text}`}>Modules</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">10</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${CLIENT_SUCCESS_THEME.text}`}>Clients</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{clients.length}</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${CLIENT_SUCCESS_THEME.text}`}>Languages</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{SUPPORTED_LANGUAGES.length}</p>
                    </Card>
                </StaggerRevealItem>
            </StaggerReveal>

            <div className="flex flex-wrap items-end gap-4">
                <FormField className="min-w-[200px]">
                    <FormLabel htmlFor="client-select">Client</FormLabel>
                    <Select
                        id="client-select"
                        value={selectedClientId ?? ""}
                        onChange={(e) => selectClient(e.target.value)}
                        disabled={loading || clients.length === 0}
                    >
                        <option value="">Select client...</option>
                        {clients.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </Select>
                </FormField>

                <FormField className="min-w-[180px]">
                    <FormLabel htmlFor="gci-language">GCI Language</FormLabel>
                    <Select
                        id="gci-language"
                        value={currentLocale}
                        onChange={(e) => handleLocaleChange(e.target.value as SupportedLanguage)}
                        disabled={!selectedClientId}
                    >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</option>
                        ))}
                    </Select>
                </FormField>
            </div>

            <Tabs
                tabs={CLIENT_SUCCESS_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))}
                active={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === CLIENT_SUCCESS_TABS.aiOnboarding && <AiOnboardingPanel />}
            {activeTab === CLIENT_SUCCESS_TABS.projectWorkspace && <ProjectWorkspacePanel />}
            {activeTab === CLIENT_SUCCESS_TABS.clientPortal && <ClientPortalPanel />}
            {activeTab === CLIENT_SUCCESS_TABS.communicationCenter && <CommunicationCenterPanel />}
            {activeTab === CLIENT_SUCCESS_TABS.approvalCenter && <ApprovalCenterPanel />}
            {activeTab === CLIENT_SUCCESS_TABS.changeRequest && <ChangeRequestCenterPanel />}
            {activeTab === CLIENT_SUCCESS_TABS.deliveryCenter && <DeliveryCenterPanel />}
            {activeTab === CLIENT_SUCCESS_TABS.customerHealth && <CustomerHealthPanel />}
            {activeTab === CLIENT_SUCCESS_TABS.renewalGrowth && <RenewalGrowthPanel />}
            {activeTab === CLIENT_SUCCESS_TABS.aiSuccessManager && <AiSuccessManagerPanel />}
        </PageTransition>
    );
}
