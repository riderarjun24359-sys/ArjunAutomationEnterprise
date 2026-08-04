"use client";

import { useState } from "react";
import { Tabs } from "@/src/design-os/components/Tabs";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import {
    SECURITY_CENTER_TABS,
    SECURITY_CENTER_TAB_LIST,
    SECURITY_CENTER_THEME,
} from "../constants";
import { AuthenticationPanel } from "./panels/AuthenticationPanel";
import { MfaPanel } from "./panels/MfaPanel";
import { RbacPanel } from "./panels/RbacPanel";
import { OrgIsolationPanel } from "./panels/OrgIsolationPanel";
import { ApiSecurityPanel } from "./panels/ApiSecurityPanel";
import { SecretsManagementPanel } from "./panels/SecretsManagementPanel";
import { AuditCenterPanel } from "./panels/AuditCenterPanel";
import { ThreatDetectionPanel } from "./panels/ThreatDetectionPanel";
import { SecurityDashboardPanel } from "./panels/SecurityDashboardPanel";
import { useSecurityCenter } from "../hooks/useSecurityCenter";

export function SecurityCenterPage() {
    const [activeTab, setActiveTab] = useState<string>(SECURITY_CENTER_TABS.dashboard);
    const { state, loading } = useSecurityCenter();

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">V8 Enterprise Security & Identity</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">
                    Security Center
                </h1>
                <p className="mt-2 max-w-3xl text-[var(--dos-text-secondary)]">
                    Platform hardening through Mission Core — authentication, MFA, RBAC, org isolation, API security, secrets, audit, and threat detection bridged to Enterprise Identity.
                </p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-3">
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${SECURITY_CENTER_THEME.text}`}>Panels</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">9</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${SECURITY_CENTER_THEME.text}`}>Roles</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{state.roles.length}</p>
                    </Card>
                </StaggerRevealItem>
                <StaggerRevealItem>
                    <Card hover>
                        <p className={`text-sm font-medium ${SECURITY_CENTER_THEME.text}`}>Isolation</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">
                            {loading ? "—" : `${state.dashboard.orgIsolationScore}%`}
                        </p>
                    </Card>
                </StaggerRevealItem>
            </StaggerReveal>

            <Tabs
                tabs={SECURITY_CENTER_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))}
                active={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === SECURITY_CENTER_TABS.authentication && <AuthenticationPanel />}
            {activeTab === SECURITY_CENTER_TABS.mfa && <MfaPanel />}
            {activeTab === SECURITY_CENTER_TABS.rbac && <RbacPanel />}
            {activeTab === SECURITY_CENTER_TABS.orgIsolation && <OrgIsolationPanel />}
            {activeTab === SECURITY_CENTER_TABS.apiSecurity && <ApiSecurityPanel />}
            {activeTab === SECURITY_CENTER_TABS.secrets && <SecretsManagementPanel />}
            {activeTab === SECURITY_CENTER_TABS.audit && <AuditCenterPanel />}
            {activeTab === SECURITY_CENTER_TABS.threatDetection && <ThreatDetectionPanel />}
            {activeTab === SECURITY_CENTER_TABS.dashboard && <SecurityDashboardPanel />}
        </PageTransition>
    );
}
