"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function ErrorManagementPanel() {
    const { state, loading } = usePlatformOperations();
    const openErrors = state.errors.filter((e) => !e.resolved);

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>Open Errors</p>
                <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{loading ? "—" : openErrors.length}</p>
            </Card>
            <div className="grid gap-4">
                {state.errors.slice(0, 6).map((err) => (
                    <Card key={err.id} hover>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-medium text-[var(--dos-text-primary)]">{err.message}</p>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{err.source} · {err.type}</p>
                                {err.retryRecommendation && (
                                    <p className="mt-2 text-sm text-[var(--dos-text-tertiary)]">{err.retryRecommendation}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {err.aiAssisted && <Badge variant="info">AI</Badge>}
                                <Badge variant={err.resolved ? "success" : "error"}>{err.resolved ? "resolved" : "open"}</Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
