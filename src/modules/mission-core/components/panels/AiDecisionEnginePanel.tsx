"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { Select } from "@/src/design-os/components/Select";
import { PLATFORM_EVENTS } from "../../constants";
import { useMissionCore } from "../../hooks/useMissionCore";

export function AiDecisionEnginePanel() {
    const { lastDecision, makeAiDecision, capabilities } = useMissionCore();
    const [eventType, setEventType] = useState<string>(PLATFORM_EVENTS[0]);

    const handleDecide = () => {
        makeAiDecision(eventType);
    };

    return (
        <div className="space-y-6">
            <Card>
                <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">AI Routing Decision</h3>
                <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-[200px]">
                        <Select value={eventType} onChange={(e) => setEventType(e.target.value)} aria-label="Event type for routing">
                            {PLATFORM_EVENTS.map((evt) => (
                                <option key={evt} value={evt}>{evt}</option>
                            ))}
                        </Select>
                    </div>
                    <Button onClick={handleDecide}>Decide Routing</Button>
                </div>
            </Card>

            {lastDecision && (
                <Card>
                    <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Latest Decision</h3>
                    <dl className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-[var(--dos-text-secondary)]">Capability</dt>
                            <dd className="font-medium text-[var(--dos-text-primary)]">
                                {capabilities.find((c) => c.id === lastDecision.capabilityId)?.name ?? lastDecision.capabilityId}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-[var(--dos-text-secondary)]">Agent</dt>
                            <dd>{lastDecision.agentId}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-[var(--dos-text-secondary)]">Priority</dt>
                            <dd>
                                <Badge variant={lastDecision.priority === "critical" ? "error" : lastDecision.priority === "high" ? "warning" : "info"}>
                                    {lastDecision.priority}
                                </Badge>
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-[var(--dos-text-secondary)]">Escalation</dt>
                            <dd>{lastDecision.escalation ? "Yes" : "No"}</dd>
                        </div>
                        <div>
                            <dt className="text-[var(--dos-text-secondary)]">Routing</dt>
                            <dd className="mt-1 font-mono text-xs">{lastDecision.routing}</dd>
                        </div>
                        <div>
                            <dt className="text-[var(--dos-text-secondary)]">Reason</dt>
                            <dd className="mt-1 text-[var(--dos-text-primary)]">{lastDecision.reason}</dd>
                        </div>
                    </dl>
                </Card>
            )}
        </div>
    );
}
