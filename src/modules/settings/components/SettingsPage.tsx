"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { SettingsStats } from "@/src/modules/settings/components/SettingsStats";
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
] as const;

export function SettingsPage() {
    const settings = useSettings();
    const [activeTab, setActiveTab] = useState<(typeof SETTINGS_TABS)[keyof typeof SETTINGS_TABS]>(SETTINGS_TABS.overview);

    if (settings.loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <LoadingState label="Loading settings and administration data" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Administration</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise settings and administration</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Manage organization settings, teams, roles, branding, preferences, security, audit configuration, API keys, notifications, and backup policies from one Supabase-backed control center.
                </p>
            </motion.header>

            <SettingsStats stats={settings.stats} />

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

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
        </div>
    );
}
