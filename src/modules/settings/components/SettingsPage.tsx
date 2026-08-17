"use client";

import { useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AuditPanel,
    BackupPanel,
    BrandingPanel,
    IntegrationsPanel,
    NotificationsPanel,
    OrganizationSettingsPanel,
    PreferencesPanel,
    RolesPermissionsPanel,
    SecurityPanel,
    SettingsOverviewPanel,
    TeamManagementPanel,
} from "@/src/modules/settings/components/SettingsPanels";
import { SettingsStats } from "@/src/modules/settings/components/SettingsStats";
import { SETTINGS_TABS } from "@/src/modules/settings/constants";
import { useSettings } from "@/src/modules/settings/hooks/useSettings";

const tabs = [
    { id: SETTINGS_TABS.overview, label: "Overview" },
    { id: SETTINGS_TABS.organization, label: "Organization" },
    { id: SETTINGS_TABS.team, label: "Team" },
    { id: SETTINGS_TABS.roles, label: "Roles" },
    { id: SETTINGS_TABS.branding, label: "Branding" },
    { id: SETTINGS_TABS.preferences, label: "Preferences" },
    { id: SETTINGS_TABS.security, label: "Security" },
    { id: SETTINGS_TABS.audit, label: "Audit" },
    { id: SETTINGS_TABS.integrations, label: "Integrations" },
    { id: SETTINGS_TABS.notifications, label: "Notifications" },
    { id: SETTINGS_TABS.backup, label: "Backup" },
];

export function SettingsPage() {
    const settings = useSettings();
    const [activeTab, setActiveTab] = useState<(typeof SETTINGS_TABS)[keyof typeof SETTINGS_TABS]>(SETTINGS_TABS.overview);

    if (settings.loading) {
        return <LoadingState label="Loading settings systems" />;
    }

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">Settings OS Engine</Badge>
                <div>
                    <h1 className="dos-text-display">Settings Control</h1>
                    <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                        Enterprise configuration, organization management, security controls, and system preferences.
                    </p>
                </div>
            </header>

            <SettingsStats stats={settings.stats} />

            <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
                {activeTab === SETTINGS_TABS.overview ? <SettingsOverviewPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.organization ? <OrganizationSettingsPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.team ? <TeamManagementPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.roles ? <RolesPermissionsPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.branding ? <BrandingPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.preferences ? <PreferencesPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.security ? <SecurityPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.audit ? <AuditPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.integrations ? <IntegrationsPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.notifications ? <NotificationsPanel data={settings} /> : null}
                {activeTab === SETTINGS_TABS.backup ? <BackupPanel data={settings} /> : null}
            </section>
        </PageTransition>
    );
}
