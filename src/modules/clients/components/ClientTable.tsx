import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { ClientDetail } from "@/src/modules/clients/types";

interface ClientTableProps {
    clients: ClientDetail[];
    selectedClientId?: string | null;
    onSelectClient: (id: string) => void;
}

export function ClientTable({ clients, selectedClientId, onSelectClient }: ClientTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Client roster" description="Enterprise accounts and lifecycle posture" />
            {clients.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No clients found" description="Adjust filters or create a new client profile." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {clients.map((client) => (
                        <button
                            key={client.id}
                            type="button"
                            onClick={() => onSelectClient(client.id)}
                            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                                selectedClientId === client.id
                                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/40"
                            }`}
                        >
                            <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {client.industry} • {client.manager} • {client.contactEmail}
                                </p>
                            </div>
                            <div className="text-right text-sm text-slate-600 dark:text-slate-300">
                                <p className="capitalize">{client.status.replace("_", " ")}</p>
                                <p>{client.revenue}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </Card>
    );
}
