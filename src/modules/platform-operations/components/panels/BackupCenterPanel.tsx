"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function BackupCenterPanel() {
    const { state, loading } = usePlatformOperations();

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {state.backups.map((b) => (
                <Card key={b.id} hover>
                    <div className="flex items-center justify-between">
                        <p className={`font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>{b.type}</p>
                        <Badge variant={b.status === "verified" ? "success" : b.status === "failed" ? "error" : "default"}>
                            {loading ? "—" : b.status}
                        </Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                        {(b.sizeBytes / (1024 * 1024)).toFixed(1)} MB · {b.createdAt.slice(0, 10)}
                    </p>
                    {b.restoreSimulated && <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Restore simulated</p>}
                </Card>
            ))}
        </div>
    );
}
