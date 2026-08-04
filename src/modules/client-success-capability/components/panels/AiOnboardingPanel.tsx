"use client";

import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { Badge } from "@/src/design-os/components/Badge";
import { SimpleTable } from "../shared/SimpleTable";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";
import { AI_DELIVERY_LEVELS } from "@/src/constants/ai-delivery-model";

export function AiOnboardingPanel() {
    const { selectedClientId, onboarding, runAiOnboarding, actionLoading } = useClientSuccessCapability();

    if (!selectedClientId) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to begin AI onboarding.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">AI Onboarding</h2>
                    <p className="text-sm text-[var(--dos-text-secondary)]">AI-first requirement analysis, stakeholder mapping, and success planning.</p>
                </div>
                <Button onClick={() => runAiOnboarding(selectedClientId)} disabled={actionLoading}>
                    {onboarding ? "Re-run Analysis" : "Run AI Onboarding"}
                </Button>
            </div>

            {onboarding ? (
                <>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <KpiCard title="Stakeholders" value={onboarding.stakeholders.length} />
                        <KpiCard title="Goals" value={onboarding.goals.length} />
                        <KpiCard title="Checklist Done" value={onboarding.checklist.filter((c) => c.completed).length} suffix={`/${onboarding.checklist.length}`} />
                    </div>

                    <Card>
                        <h3 className="mb-2 font-semibold text-[var(--dos-text-primary)]">AI Analysis</h3>
                        <p className="text-sm text-[var(--dos-text-secondary)]">{onboarding.aiAnalysis}</p>
                    </Card>

                    <Card>
                        <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">AI Delivery Levels</h3>
                        <div className="space-y-2">
                            {AI_DELIVERY_LEVELS.map((level) => {
                                const item = onboarding.checklist.find((c) => c.deliveryLevel === level.level);
                                return (
                                    <div key={level.level} className="flex items-center justify-between rounded-lg border border-[var(--dos-border-subtle)] p-3">
                                        <div>
                                            <p className="font-medium text-[var(--dos-text-primary)]">{level.title}</p>
                                            <p className="text-xs text-[var(--dos-text-secondary)]">{level.estimate}</p>
                                        </div>
                                        <Badge variant={item?.completed ? "success" : "default"}>{item?.completed ? "Done" : "Pending"}</Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <SimpleTable
                        headers={["Name", "Role", "Influence"]}
                        rows={onboarding.stakeholders.map((s) => [s.name, s.role, s.influence])}
                    />
                </>
            ) : (
                <Card><p className="text-[var(--dos-text-secondary)]">No onboarding profile yet. Run AI onboarding to analyze requirements and create the success plan.</p></Card>
            )}
        </div>
    );
}
