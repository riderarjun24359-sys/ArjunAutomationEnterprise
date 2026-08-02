"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { CLIENT_STATUS_FILTERS } from "@/src/modules/clients/constants";
import { clientService } from "@/src/modules/clients/services/client.service";
import type {
    ClientActivitySummary,
    ClientContactSummary,
    ClientDashboardStats,
    ClientDetail,
    ClientProjectSummary,
    ClientStatusFilter,
    CreateClientInput,
    UpdateClientInput,
} from "@/src/modules/clients/types";

export function useClients() {
    const user = useAuthStore((state) => state.user);
    const [clients, setClients] = useState<ClientDetail[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
    const [clientProjects, setClientProjects] = useState<ClientProjectSummary[]>([]);
    const [clientContacts, setClientContacts] = useState<ClientContactSummary[]>([]);
    const [clientActivities, setClientActivities] = useState<ClientActivitySummary[]>([]);
    const [stats, setStats] = useState<ClientDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ClientStatusFilter>(CLIENT_STATUS_FILTERS.all);

    const fetchClientsData = useCallback(async () => {
        if (!user) {
            return { clientList: [], dashboardStats: null };
        }

        const [clientList, dashboardStats] = await Promise.all([
            clientService.getClients(user.id, user.email, user.fullName),
            clientService.getDashboardStats(user.id, user.email, user.fullName),
        ]);

        return { clientList, dashboardStats };
    }, [user]);

    const loadData = useCallback(async () => {
        const { clientList, dashboardStats } = await fetchClientsData();
        setClients(clientList);
        setStats(dashboardStats);
        setLoading(false);
    }, [fetchClientsData]);

    useEffect(() => {
        let cancelled = false;

        void fetchClientsData().then(({ clientList, dashboardStats }) => {
            if (cancelled) {
                return;
            }

            setClients(clientList);
            setStats(dashboardStats);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [fetchClientsData]);

    const selectClient = useCallback(
        async (id: string) => {
            if (!user) {
                return;
            }

            const [client, projects, contacts, activities] = await Promise.all([
                clientService.getClient(user.id, user.email, id, user.fullName),
                clientService.getClientProjects(user.id, user.email, id, user.fullName),
                clientService.getClientContacts(user.id, user.email, id, user.fullName),
                clientService.getClientActivities(user.id, user.email, id, user.fullName),
            ]);

            setSelectedClient(client ?? null);
            setClientProjects(projects);
            setClientContacts(contacts);
            setClientActivities(activities);
        },
        [user],
    );

    const createClient = useCallback(
        async (input: CreateClientInput) => {
            if (!user) {
                throw new Error("Authentication required");
            }

            const client = await clientService.createClient(user.id, user.email, input, user.fullName);
            await loadData();
            await selectClient(client.id);
            return client;
        },
        [user, loadData, selectClient],
    );

    const updateClient = useCallback(
        async (id: string, input: UpdateClientInput) => {
            if (!user) {
                throw new Error("Authentication required");
            }

            const client = await clientService.updateClient(user.id, user.email, id, input, user.fullName);
            await loadData();
            if (client) {
                await selectClient(id);
            }
            return client;
        },
        [user, loadData, selectClient],
    );

    const deleteClient = useCallback(
        async (id: string) => {
            if (!user) {
                return false;
            }

            const deleted = await clientService.deleteClient(user.id, user.email, id, user.fullName);
            if (deleted) {
                if (selectedClient?.id === id) {
                    setSelectedClient(null);
                    setClientProjects([]);
                    setClientContacts([]);
                    setClientActivities([]);
                }
                await loadData();
            }
            return deleted;
        },
        [user, loadData, selectedClient?.id],
    );

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            if (statusFilter !== CLIENT_STATUS_FILTERS.all && client.status !== statusFilter) {
                return false;
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    client.name.toLowerCase().includes(query) ||
                    client.contactEmail.toLowerCase().includes(query) ||
                    client.manager.toLowerCase().includes(query) ||
                    client.industry.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [clients, statusFilter, searchQuery]);

    return {
        clients: filteredClients,
        allClients: clients,
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
        refresh: loadData,
    };
}
