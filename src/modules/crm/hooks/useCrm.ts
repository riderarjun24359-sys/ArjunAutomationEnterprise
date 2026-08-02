"use client";

import { useEffect, useState } from "react";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type { ActivitySummary, ClientDetail, ClientSummary, CrmDashboardStats, DealSummary, LeadSummary, TaskSummary } from "@/src/modules/crm/types";

export function useCrm() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [leads, setLeads] = useState<LeadSummary[]>([]);
  const [deals, setDeals] = useState<DealSummary[]>([]);
  const [activities, setActivities] = useState<ActivitySummary[]>([]);
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [stats, setStats] = useState<CrmDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [clientList, leadList, dealList, activityList, taskList, dashboardStats] = await Promise.all([
        crmService.getClients(),
        crmService.getLeads(),
        crmService.getDeals(),
        crmService.getActivities(),
        crmService.getTasks(),
        crmService.getDashboardStats(),
      ]);

      setClients(clientList);
      setLeads(leadList);
      setDeals(dealList);
      setActivities(activityList);
      setTasks(taskList);
      setStats(dashboardStats);
      setLoading(false);
    };

    void load();
  }, []);

  const selectClient = async (id: string) => {
    const client = await crmService.getClient(id);
    setSelectedClient(client ?? null);
  };

  return { clients, selectedClient, leads, deals, activities, tasks, stats, loading, selectClient };
}
