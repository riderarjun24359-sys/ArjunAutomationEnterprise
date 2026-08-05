"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function ClientPortalPanel({ data }: { data: BusinessPlatformData }) {
    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-lg font-semibold">Client portal overview</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Dashboard, projects, files, invoices, messages, support, timeline, and approvals for each client
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.portalSummaries.length === 0 ? (
                    <EmptyState title="No active clients" description="Convert leads to clients to provision portals." />
                ) : (
                    data.portalSummaries.map((portal) => (
                        <Card key={portal.clientId} hover>
                            <p className="font-semibold">{portal.clientName}</p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-[var(--dos-text-secondary)]">Projects</span><p className="font-medium">{portal.projectsCount}</p></div>
                                <div><span className="text-[var(--dos-text-secondary)]">Invoices</span><p className="font-medium">{portal.openInvoices}</p></div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" onClick={() => data.provisionPortal(portal.clientId)}>Provision portal</Button>
                                <Button size="sm" variant="secondary" onClick={() => data.startProject(portal.clientId, portal.clientName)}>Start project</Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
