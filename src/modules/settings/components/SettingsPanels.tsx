"use client";

import { Card } from "@/src/components/ui/card";
import { SETTINGS_TABS } from "@/src/modules/settings/constants";
import type { useSettings } from "@/src/modules/settings/hooks/useSettings";

type SettingsData = ReturnType<typeof useSettings>;

function PanelWrapper({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <section className="os-panel p-6">
            <header className="mb-6"><h3 className="dos-text-h3">{title}</h3><p className="dos-text-body-sm text-[var(--dos-text-secondary)]">{description}</p></header>
            {children}
        </section>
    );
}

export function SettingsOverviewPanel({ data }: { data: SettingsData }) {
    return (
        <PanelWrapper title="Settings Overview" description="Manage organization, team, security, and preferences.">
            <div className="grid gap-3 sm:grid-cols-2">
                 <div className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4">
                     <p className="font-semibold text-[var(--dos-text-primary)]">Organization</p>
                     <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Organization settings and workspace management</p>
                 </div>
            </div>
        </PanelWrapper>
    );
}

export function OrganizationSettingsPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Organization" description="Organization settings">...</PanelWrapper>; }
export function TeamManagementPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Team" description="Manage team">...</PanelWrapper>; }
export function RolesPermissionsPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Roles" description="Permissions">...</PanelWrapper>; }
export function BrandingPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Branding" description="Customization">...</PanelWrapper>; }
export function PreferencesPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Preferences" description="User preferences">...</PanelWrapper>; }
export function SecurityPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Security" description="Security settings">...</PanelWrapper>; }
export function AuditPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Audit" description="Logs">...</PanelWrapper>; }
export function IntegrationsPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Integrations" description="Integrations">...</PanelWrapper>; }
export function NotificationsPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Notifications" description="Manage notifications">...</PanelWrapper>; }
export function BackupPanel({ data }: { data: SettingsData }) { return <PanelWrapper title="Backup" description="Data backup">...</PanelWrapper>; }
