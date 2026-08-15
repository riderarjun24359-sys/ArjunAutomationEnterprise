"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";
import type { DbBackupConfig } from "@/src/modules/database/types/platform";

const ACME_ORG_ID = '11111111-1111-1111-1111-111111111111';

export function BackupCenterPanel() {
    const { service } = usePlatformOperations();
    const [configs, setConfigs] = useState<DbBackupConfig[]>([]);

    useEffect(() => {
        let mounted = true;
        service.getBackupConfigs(ACME_ORG_ID).then((data) => {
            if (mounted) setConfigs(data);
        });
        return () => { mounted = false };
    }, [service]);

    const loadConfigs = useCallback(async () => {
        const data = await service.getBackupConfigs(ACME_ORG_ID);
        setConfigs(data);
    }, [service]);

    const handleCreateConfig = async () => {
        await service.createBackupConfig(ACME_ORG_ID, "Production Database Backup");
        loadConfigs();
    };

    const handleTriggerBackup = async (configId: string) => {
        await service.triggerBackup(ACME_ORG_ID, configId);
        alert("Backup triggered.");
        loadConfigs();
    };

    return (
        <div className="space-y-4">
            {configs.length === 0 && (
                <Card>
                    <p>No backup configurations found for Acme Enterprise.</p>
                    <Button onClick={handleCreateConfig} className="mt-2">
                        Create Default Backup Config
                    </Button>
                </Card>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
                {configs.map((c) => (
                    <Card key={c.id} hover>
                        <div className="flex items-center justify-between">
                            <p className={`font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>{c.name}</p>
                            <Badge variant={c.is_enabled ? "success" : "default"}>
                                {c.is_enabled ? "Enabled" : "Disabled"}
                            </Badge>
                        </div>
                        <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                            Destination: {c.destination} · Cron: {c.schedule_cron}
                        </p>
                        <div className="mt-4">
                            <Button onClick={() => handleTriggerBackup(c.id)} disabled={!c.is_enabled}>
                                Trigger Backup
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
