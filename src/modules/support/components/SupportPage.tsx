"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AgentsPanel,
    AttachmentsPanel,
    CannedResponsesPanel,
    EscalationPanel,
    KnowledgeBasePanel,
    NotesPanel,
    PortalPanel,
    PrioritiesPanel,
    QueuesPanel,
    SatisfactionPanel,
    SlasPanel,
    SupportAuditPanel,
    SupportCategoriesPanel,
    SupportOverviewPanel,
    SupportReportsPanel,
    TicketsPanel,
} from "@/src/modules/support/components/SupportPanels";
import { SupportStats } from "@/src/modules/support/components/SupportStats";
import { SUPPORT_TABS } from "@/src/modules/support/constants";
import { useSupport } from "@/src/modules/support/hooks/useSupport";

const tabs = [
    { id: SUPPORT_TABS.overview, label: "Overview" },
    { id: SUPPORT_TABS.tickets, label: "Tickets" },
    { id: SUPPORT_TABS.categories, label: "Categories" },
    { id: SUPPORT_TABS.priorities, label: "Priorities" },
    { id: SUPPORT_TABS.slas, label: "SLAs" },
    { id: SUPPORT_TABS.queues, label: "Queues" },
    { id: SUPPORT_TABS.agents, label: "Agents" },
    { id: SUPPORT_TABS.portal, label: "Portal" },
    { id: SUPPORT_TABS.notes, label: "Notes" },
    { id: SUPPORT_TABS.attachments, label: "Attachments" },
    { id: SUPPORT_TABS.knowledgeBase, label: "Knowledge Base" },
    { id: SUPPORT_TABS.cannedResponses, label: "Canned Responses" },
    { id: SUPPORT_TABS.escalation, label: "Escalation" },
    { id: SUPPORT_TABS.satisfaction, label: "Satisfaction" },
    { id: SUPPORT_TABS.reports, label: "Reports" },
    { id: SUPPORT_TABS.audit, label: "Audit" },
] as const;

export function SupportPage() {
    const support = useSupport();
    const [activeTab, setActiveTab] = useState<(typeof SUPPORT_TABS)[keyof typeof SUPPORT_TABS]>(SUPPORT_TABS.overview);

    if (support.loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <LoadingState label="Loading customer support and service management data" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Service Desk</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Customer Support & Service Management</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Manage support tickets, categories, priorities, SLAs, queues, agent assignment, customer portal, internal notes, attachments, knowledge base, canned responses, escalation rules, satisfaction ratings, reports, and audit history from one Supabase-backed workspace.
                </p>
            </motion.header>

            <SupportStats stats={support.stats} />

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === SUPPORT_TABS.overview ? <SupportOverviewPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.tickets ? <TicketsPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.categories ? <SupportCategoriesPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.priorities ? <PrioritiesPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.slas ? <SlasPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.queues ? <QueuesPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.agents ? <AgentsPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.portal ? <PortalPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.notes ? <NotesPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.attachments ? <AttachmentsPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.knowledgeBase ? <KnowledgeBasePanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.cannedResponses ? <CannedResponsesPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.escalation ? <EscalationPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.satisfaction ? <SatisfactionPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.reports ? <SupportReportsPanel data={support} /> : null}
            {activeTab === SUPPORT_TABS.audit ? <SupportAuditPanel data={support} /> : null}
        </div>
    );
}
