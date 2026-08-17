"use client";

import { motion } from "framer-motion";
import { Building2, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ClientDetailPanel } from "@/src/modules/clients/components/ClientDetailPanel";
import { ClientFilters } from "@/src/modules/clients/components/ClientFilters";
import { ClientForm } from "@/src/modules/clients/components/ClientForm";
import { ClientStats } from "@/src/modules/clients/components/ClientStats";
import { ClientTable } from "@/src/modules/clients/components/ClientTable";
import { CLIENT_TABS } from "@/src/modules/clients/constants";
import { useClients } from "@/src/modules/clients/hooks/useClients";
import type { ClientFormValues } from "@/src/modules/clients/schemas";

const tabs = [
    { id: CLIENT_TABS.overview, label: "Overview" },
    { id: CLIENT_TABS.roster, label: "Roster" },
    { id: CLIENT_TABS.projects, label: "Projects" },
    { id: CLIENT_TABS.contacts, label: "Contacts" },
    { id: CLIENT_TABS.activity, label: "Activity" },
] as const;

export function ClientsPage() {
    const {
        clients,
        selectedClient,
        clientProjects,
        clientContacts,
        clientActivities,
        stats,
        loading,
        searchQuery,
        statusFilter,
        setSearchQuery,
        setStatusFilter,
        selectClient,
        createClient,
        updateClient,
        deleteClient,
    } = useClients();

    const [activeTab, setActiveTab] = useState<(typeof CLIENT_TABS)[keyof typeof CLIENT_TABS]>(CLIENT_TABS.overview);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const allProjects = useMemo(() => {
        if (!selectedClient) {
            return clientProjects;
        }

        return clientProjects;
    }, [clientProjects, selectedClient]);

    const handleCreateClient = async (values: ClientFormValues) => {
        await createClient(values);
        setShowCreateForm(false);
    };

    const handleUpdateClient = async (values: ClientFormValues) => {
        if (!selectedClient) {
            return;
        }

        await updateClient(selectedClient.id, values);
        setShowEditForm(false);
    };

    const handleDeleteClient = async (id: string) => {
        await deleteClient(id);
        setShowEditForm(false);
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <LoadingState label="Loading client management data" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Client Operations</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise client management and lifecycle</h1>
                        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Manage account profiles, delivery relationships, contacts, and lifecycle health from one Supabase-backed workspace.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setShowCreateForm((current) => !current);
                            setShowEditForm(false);
                        }}
                        className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                    >
                        <Plus className="h-4 w-4" />
                        {showCreateForm ? "Hide Form" : "New Client"}
                    </button>
                </div>
            </motion.header>

            <ClientStats stats={stats} />

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {showCreateForm ? <ClientForm onSubmit={handleCreateClient} onCancel={() => setShowCreateForm(false)} submitLabel="Create Client" /> : null}

            {activeTab === CLIENT_TABS.overview ? (
                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <ClientTable
                        clients={clients.slice(0, 5)}
                        selectedClientId={selectedClient?.id}
                        onSelectClient={(id) => void selectClient(id)}
                    />
                    <ClientDetailPanel
                        client={selectedClient}
                        projects={clientProjects}
                        contacts={clientContacts}
                        activities={clientActivities}
                        onDelete={(id) => void handleDeleteClient(id)}
                    />
                </section>
            ) : null}

            {activeTab === CLIENT_TABS.roster ? (
                <>
                    <ClientFilters
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                        onSearchChange={setSearchQuery}
                        onStatusChange={setStatusFilter}
                    />
                    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <ClientTable clients={clients} selectedClientId={selectedClient?.id} onSelectClient={(id) => void selectClient(id)} />
                        <div className="space-y-6">
                            {showEditForm && selectedClient ? (
                                <ClientForm
                                    defaultValues={{
                                        name: selectedClient.name,
                                        status: selectedClient.status,
                                        industry: selectedClient.industry,
                                        contactEmail: selectedClient.contactEmail,
                                        manager: selectedClient.manager,
                                        revenue: selectedClient.revenue,
                                        phone: selectedClient.phone,
                                        website: selectedClient.website,
                                        address: selectedClient.address,
                                        description: selectedClient.description,
                                    }}
                                    onSubmit={handleUpdateClient}
                                    onCancel={() => setShowEditForm(false)}
                                    submitLabel="Update Client"
                                />
                            ) : (
                                <ClientDetailPanel
                                    client={selectedClient}
                                    projects={clientProjects}
                                    contacts={clientContacts}
                                    activities={clientActivities}
                                    onDelete={(id) => void handleDeleteClient(id)}
                                />
                            )}
                            {selectedClient ? (
                                <button
                                    type="button"
                                    onClick={() => setShowEditForm((current) => !current)}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    {showEditForm ? "Hide Edit Form" : "Edit Client"}
                                </button>
                            ) : null}
                        </div>
                    </section>
                </>
            ) : null}

            {activeTab === CLIENT_TABS.projects ? (
                <Card hover>
                    <SectionHeader title="Client projects" description="Delivery relationships linked to client accounts" />
                    {selectedClient ? (
                        <div className="mt-6 space-y-3">
                            {allProjects.length === 0 ? (
                                <EmptyState title="No linked projects" description="This client does not have any linked delivery projects yet." />
                            ) : (
                                allProjects.map((project) => (
                                    <div key={project.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                        <div>
                                            <p className="font-medium">{project.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{project.owner} • {project.timeline}</p>
                                        </div>
                                        <div className="text-right text-sm">
                                            <p>{project.progress}%</p>
                                            <p>{project.budget}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="mt-6">
                            <EmptyState title="Select a client" description="Choose a client from the roster to inspect linked projects." />
                        </div>
                    )}
                </Card>
            ) : null}

            {activeTab === CLIENT_TABS.contacts ? (
                <Card hover>
                    <SectionHeader title="Client contacts" description="Primary and company contacts linked to client accounts" />
                    {selectedClient ? (
                        <div className="mt-6 space-y-3">
                            {clientContacts.length === 0 ? (
                                <EmptyState title="No contacts linked" description="This client does not have linked company contacts yet." />
                            ) : (
                                clientContacts.map((contact) => (
                                    <div key={contact.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                        <p className="font-medium">{contact.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{contact.title} • {contact.email} • {contact.phone}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="mt-6">
                            <EmptyState title="Select a client" description="Choose a client from the roster to inspect linked contacts." />
                        </div>
                    )}
                </Card>
            ) : null}

            {activeTab === CLIENT_TABS.activity ? (
                <Card hover>
                    <SectionHeader title="Client activity" description="Lifecycle events and profile changes" />
                    {selectedClient ? (
                        <div className="mt-6 space-y-3">
                            {clientActivities.length === 0 ? (
                                <EmptyState title="No activity yet" description="Create or update this client to record lifecycle activity." />
                            ) : (
                                clientActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                        <Sparkles className="h-4 w-4 text-emerald-600" />
                                        <div className="flex-1">
                                            <p className="font-medium">{activity.title}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{activity.detail}</p>
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{activity.timestamp}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="mt-6">
                            <EmptyState title="Select a client" description="Choose a client from the roster to inspect lifecycle activity." />
                        </div>
                    )}
                </Card>
            ) : null}

            {clients.length === 0 ? (
                <Card hover>
                    <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Create your first client to populate the enterprise roster.</p>
                    </div>
                </Card>
            ) : null}
        </div>
    );
}
