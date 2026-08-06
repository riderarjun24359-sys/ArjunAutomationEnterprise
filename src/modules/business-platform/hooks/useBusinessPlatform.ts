"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { businessPlatformService } from "../services/business-platform.service";
import type {
    AiRecommendation,
    BusinessPlatformDashboard,
    ClientPortalSummary,
    ConsultationRecord,
    CreateConsultationInput,
    CreateProposalInput,
    LifecycleEvent,
    ProposalRecord,
    TeamMemberSummary,
} from "../types";
import type { LeadSummary } from "@/src/modules/sales/types";
import type { ProjectSummary } from "@/src/modules/projects/types";
import type { Invoice, Payment } from "@/src/modules/finance/types";
import { fetchLeads } from "../integrations/sales-bridge";
import { fetchProjects } from "../integrations/projects-bridge";
import { fetchInvoices, fetchPayments } from "../integrations/finance-bridge";

export function useBusinessPlatform() {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<BusinessPlatformDashboard | null>(null);
    const [leads, setLeads] = useState<LeadSummary[]>([]);
    const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
    const [proposals, setProposals] = useState<ProposalRecord[]>([]);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [team, setTeam] = useState<TeamMemberSummary[]>([]);
    const [portalSummaries, setPortalSummaries] = useState<ClientPortalSummary[]>([]);
    const [lifecycleEvents, setLifecycleEvents] = useState<LifecycleEvent[]>([]);
    const [aiRecommendations, setAiRecommendations] = useState<AiRecommendation[]>([]);
    const [analytics, setAnalytics] = useState<Awaited<ReturnType<typeof businessPlatformService.getAnalyticsOverview>> | null>(null);
    const [settings, setSettings] = useState<Awaited<ReturnType<typeof businessPlatformService.getSettingsOverview>> | null>(null);

    const ctx = user
        ? { authUserId: user.id, email: user.email, fullName: user.fullName }
        : null;

    const refresh = useCallback(async () => {
        if (!ctx) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [
                dash,
                leadList,
                consultList,
                proposalList,
                projectList,
                invoiceList,
                paymentList,
                teamList,
                portalList,
                events,
                aiRecs,
                analyticsData,
                settingsData,
            ] = await Promise.all([
                businessPlatformService.getDashboard(ctx),
                fetchLeads(ctx.authUserId, ctx.email, ctx.fullName),
                businessPlatformService.getConsultations(ctx),
                businessPlatformService.getProposals(ctx),
                fetchProjects(ctx.authUserId, ctx.email, ctx.fullName),
                fetchInvoices(ctx.authUserId, ctx.email, ctx.fullName),
                fetchPayments(ctx.authUserId, ctx.email, ctx.fullName),
                businessPlatformService.getTeamSummaries(ctx),
                businessPlatformService.getClientPortalSummaries(ctx),
                businessPlatformService.getLifecycleEvents(ctx),
                businessPlatformService.getAiRecommendations(ctx),
                businessPlatformService.getAnalyticsOverview(ctx),
                businessPlatformService.getSettingsOverview(ctx),
            ]);
            setDashboard(dash);
            setLeads(leadList);
            setConsultations(consultList);
            setProposals(proposalList);
            setProjects(projectList);
            setInvoices(invoiceList);
            setPayments(paymentList);
            setTeam(teamList);
            setPortalSummaries(portalList);
            setLifecycleEvents(events);
            setAiRecommendations(aiRecs);
            setAnalytics(analyticsData);
            setSettings(settingsData);
        } finally {
            setLoading(false);
        }
    }, [ctx]);

    useEffect(() => {
        const id = window.setTimeout(() => {
            void refresh();
        }, 0);
        return () => window.clearTimeout(id);
    }, [refresh]);

    const scheduleConsultation = useCallback(
        async (input: CreateConsultationInput) => {
            if (!ctx) return;
            await businessPlatformService.scheduleConsultation(ctx, input);
            await refresh();
        },
        [ctx, refresh],
    );

    const createProposal = useCallback(
        async (input: CreateProposalInput) => {
            if (!ctx) return;
            await businessPlatformService.createProposal(ctx, input);
            await refresh();
        },
        [ctx, refresh],
    );

    const approveAiRecommendation = useCallback(
        async (id: string) => {
            if (!ctx) return;
            await businessPlatformService.approveAiRecommendation(ctx, id);
            await refresh();
        },
        [ctx, refresh],
    );

    const dismissAiRecommendation = useCallback(
        async (id: string) => {
            if (!ctx) return;
            await businessPlatformService.dismissAiRecommendation(ctx, id);
            await refresh();
        },
        [ctx, refresh],
    );

    const provisionPortal = useCallback(
        async (clientId: string) => {
            if (!ctx) return;
            await businessPlatformService.provisionPortalForClient(ctx, clientId);
            await refresh();
        },
        [ctx, refresh],
    );

    const startProject = useCallback(
        async (clientId: string, clientName: string) => {
            if (!ctx) return;
            await businessPlatformService.startProjectForClient(ctx, clientId, clientName);
            await refresh();
        },
        [ctx, refresh],
    );

    return {
        loading,
        dashboard,
        leads,
        consultations,
        proposals,
        projects,
        invoices,
        payments,
        team,
        portalSummaries,
        lifecycleEvents,
        aiRecommendations,
        analytics,
        settings,
        refresh,
        scheduleConsultation,
        createProposal,
        approveAiRecommendation,
        dismissAiRecommendation,
        provisionPortal,
        startProject,
    };
}

export type BusinessPlatformData = ReturnType<typeof useBusinessPlatform>;
