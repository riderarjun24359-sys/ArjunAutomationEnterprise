import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { AiAgent } from "@/src/modules/automation/types";

interface AgentTableProps {
    agents: AiAgent[];
}

export function AgentTable({ agents }: AgentTableProps) {
    return (
        <Card hover>
            <SectionHeader title="AI agents" description="Enterprise agent roster for workflow automation" />
            {agents.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No agents configured" description="Create an AI agent to power workflow actions." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {agents.map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div>
                                <p className="font-medium">{agent.name}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{agent.model} • {agent.description || "No description"}</p>
                            </div>
                            <div className="text-right text-sm">
                                <p className="capitalize">{agent.status}</p>
                                <p className="text-xs text-slate-500">temp {agent.temperature}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
