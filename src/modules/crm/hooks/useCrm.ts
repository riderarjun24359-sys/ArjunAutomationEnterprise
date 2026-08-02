"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type { ActivitySummary, ClientDetail, ClientSummary, CrmDashboardStats, DealSummary, LeadSummary, TaskSummary } from "@/src/modules/crm/types";

export function useCrm() {
    const user = useAuthStore((state) => state.user);
    const [clients, setClients] = useState<ClientSummary[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
    const [leads, setLeads] = useState<LeadSummary[]>([]);
    const [deals, setDeals] = useState<DealSummary[]>([]);
    const [activities, setActivities] = useState<ActivitySummary[]>([]);
    const [tasks, setTasks] = useState<TaskSummary[]>([]);
    const [stats, setStats] = useState<CrmDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!user) {
                if (!cancelled) {
                    setLoading(false);
                }
                return;
            }

            try {
                const [clientList, leadList, dealList, activityList, taskList, dashboardStats] = await Promise.all([
                    crmService.getClients(user.id, user.email, user.fullName),
                    crmService.getLeads(user.id, user.email, user.fullName),
                    crmService.getDeals(user.id, user.email, user.fullName),
                    crmService.getActivities(user.id, user.email, user.fullName),
                    crmService.getTasks(user.id, user.email, user.fullName),
                    crmService.getDashboardStats(user.id, user.email, user.fullName),
                ]);

                if (!cancelled) {
                    setClients(clientList);
                    setLeads(leadList);
                    setDeals(dealList);
                    setActivities(activityList);
                    setTasks(taskList);
                    setStats(dashboardStats);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [user]);

    const selectClient = async (id: string) => {
        if (!user) {
            return;
        }

        const client = await crmService.getClient(user.id, user.email, id, user.fullName);
        setSelectedClient(client ?? null);
    };

    return { clients, selectedClient, leads, deals, activities, tasks, stats, loading, selectClient };
}
