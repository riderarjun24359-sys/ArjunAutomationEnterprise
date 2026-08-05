"use client";

import { Card } from "@/src/design-os/components/Card";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function SettingsPanel({ data }: { data: BusinessPlatformData }) {
    const s = data.settings;
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <h2 className="text-lg font-semibold">Organization</h2>
                <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-[var(--dos-text-secondary)]">Teams</dt><dd>{s?.teams.length ?? 0}</dd></div>
                    <div className="flex justify-between"><dt className="text-[var(--dos-text-secondary)]">Clients</dt><dd>{s?.clients.length ?? 0}</dd></div>
                    <div className="flex justify-between"><dt className="text-[var(--dos-text-secondary)]">API keys</dt><dd>{s?.apiKeys.length ?? 0}</dd></div>
                </dl>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold">Platform settings</h2>
                <ul className="mt-4 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    <li>Brand — Organization branding and identity</li>
                    <li>Integrations — CRM, finance, and external connectors</li>
                    <li>Security — MFA, RBAC, tenant isolation</li>
                    <li>Audit logs — Full action trail</li>
                    <li>Notifications — Email and in-app alerts</li>
                </ul>
            </Card>
        </div>
    );
}
