"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ESCALATION_TRIGGER_OPTIONS } from "@/src/modules/support/constants";
import type { useSupport } from "@/src/modules/support/hooks/useSupport";
import {
    attachmentFormSchema,
    cannedResponseFormSchema,
    categoryFormSchema,
    escalationRuleFormSchema,
    knowledgeArticleFormSchema,
    noteFormSchema,
    portalSettingsFormSchema,
    priorityFormSchema,
    queueFormSchema,
    slaFormSchema,
    ticketFormSchema,
    type AttachmentFormValues,
    type CannedResponseFormValues,
    type CategoryFormValues,
    type EscalationRuleFormValues,
    type KnowledgeArticleFormValues,
    type NoteFormValues,
    type PortalSettingsFormValues,
    type PriorityFormValues,
    type QueueFormValues,
    type SlaFormValues,
    type TicketFormValues,
} from "@/src/modules/support/schemas";

type SupportData = ReturnType<typeof useSupport>;

const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";

function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return (
        <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">
            {loading ? "Saving..." : label}
        </button>
    );
}

function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-slate-500">{subtitle}</p>
            {meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}
        </div>
    );
}

export function SupportOverviewPanel({ data }: { data: SupportData }) {
    const links = data.crossModuleLinks;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Support summary" description="Current ticket and service desk coverage" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <ListCard title="Open tickets" subtitle={`${data.stats?.openTickets ?? 0} awaiting resolution`} />
                    <ListCard title="Resolved" subtitle={`${data.stats?.resolvedTickets ?? 0} closed tickets`} />
                    <ListCard title="SLA compliance" subtitle={`${data.stats?.slaCompliance ?? 0}% on-time resolution`} />
                    <ListCard title="Avg satisfaction" subtitle={`${data.stats?.avgSatisfaction ?? 0} / 5 rating`} />
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Cross-module integration" description="Links to CRM, Projects, HR, Finance, Automation, Analytics, and Settings" />
                <div className="mt-6 space-y-3">
                    {links ? (
                        <>
                            <ListCard title="CRM" subtitle={`${links.crmClients} clients with support tickets`} meta="Customer relationship linkage" />
                            <ListCard title="Projects" subtitle={`${links.projectTickets} project-linked tickets`} meta="Delivery context" />
                            <ListCard title="HR" subtitle={`${links.hrAgents} agents assigned`} meta="Agent workforce" />
                            <ListCard title="Finance" subtitle={`${links.financeInvoices} invoice-linked tickets`} meta="Billing support" />
                            <ListCard title="Automation" subtitle={`${links.automationTriggers} escalation triggers`} meta="Workflow automation" />
                            <ListCard title="Analytics" subtitle={`${links.analyticsMetrics} support metrics`} meta="Reporting dashboards" />
                            <ListCard title="Settings" subtitle={links.settingsConfigured ? "Portal configured" : "Portal not configured"} meta="Customer portal settings" />
                        </>
                    ) : (
                        <EmptyState title="No cross-module data" description="Integration metrics will appear once support data is available." />
                    )}
                </div>
            </Card>
        </div>
    );
}

export function TicketsPanel({ data }: { data: SupportData }) {
    const form = useForm<TicketFormValues>({
        resolver: zodResolver(ticketFormSchema),
        defaultValues: { ticketNumber: "", subject: "", description: "", categoryId: "", priorityId: "", queueId: "", clientId: "", assignedAgentId: "" },
    });

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Support tickets" description="Customer issues and service requests" />
                <div className="mt-6 space-y-3">
                    {data.tickets.length === 0 ? (
                        <EmptyState title="No tickets" description="Create tickets to manage customer support." />
                    ) : (
                        data.tickets.map((ticket) => (
                            <div key={ticket.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <div>
                                    <p className="font-medium">{ticket.ticketNumber} — {ticket.subject}</p>
                                    <p className="text-sm text-slate-500">{ticket.clientName ?? "No client"} • {ticket.priorityName ?? "No priority"} • {ticket.agentName ?? "Unassigned"}</p>
                                    <p className="mt-1 text-xs text-emerald-600">{ticket.categoryName ?? "Uncategorized"} • {ticket.queueName ?? "No queue"} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => data.updateTicketStatus(ticket.id, { status: ticket.status === "open" ? "resolved" : "open" })}
                                    className="rounded-full border border-emerald-300 px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
                                >
                                    {ticket.status}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Create ticket" description="Open a new support ticket" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createTicket(values))}>
                    <input {...form.register("ticketNumber")} placeholder="Ticket number" className={inputClass} />
                    <input {...form.register("subject")} placeholder="Subject" className={inputClass} />
                    <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                    <select {...form.register("categoryId")} className={inputClass}>
                        <option value="">Select category</option>
                        {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select {...form.register("priorityId")} className={inputClass}>
                        <option value="">Select priority</option>
                        {data.priorities.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select {...form.register("queueId")} className={inputClass}>
                        <option value="">Select queue</option>
                        {data.queues.map((q) => <option key={q.id} value={q.id}>{q.name}</option>)}
                    </select>
                    <select {...form.register("clientId")} className={inputClass}>
                        <option value="">Select client</option>
                        {data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select {...form.register("assignedAgentId")} className={inputClass}>
                        <option value="">Assign agent</option>
                        {data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <SaveButton loading={form.formState.isSubmitting} label="Create ticket" />
                </form>
            </Card>
        </div>
    );
}

export function SupportCategoriesPanel({ data }: { data: SupportData }) {
    const form = useForm<CategoryFormValues>({ resolver: zodResolver(categoryFormSchema), defaultValues: { name: "", slug: "", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Ticket categories" description="Classify support requests" />
                <div className="mt-6 space-y-3">
                    {data.categories.length === 0 ? <EmptyState title="No categories" description="Create categories to organize tickets." /> : data.categories.map((cat) => (
                        <ListCard key={cat.id} title={cat.name} subtitle={cat.description || cat.slug} meta={`${cat.ticketCount} tickets`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add category" description="Create a new ticket category" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createCategory(values))}>
                    <input {...form.register("name")} placeholder="Category name" className={inputClass} />
                    <input {...form.register("slug")} placeholder="Slug" className={inputClass} />
                    <input {...form.register("description")} placeholder="Description" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add category" />
                </form>
            </Card>
        </div>
    );
}

export function PrioritiesPanel({ data }: { data: SupportData }) {
    const form = useForm<PriorityFormValues>({ resolver: zodResolver(priorityFormSchema), defaultValues: { name: "", level: 3, color: "#64748b", responseHours: 24 } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Priorities" description="Ticket urgency levels" />
                <div className="mt-6 space-y-3">
                    {data.priorities.length === 0 ? <EmptyState title="No priorities" description="Define priority levels for tickets." /> : data.priorities.map((pri) => (
                        <ListCard key={pri.id} title={pri.name} subtitle={`Level ${pri.level} • ${pri.responseHours}h response`} meta={`${pri.ticketCount} tickets`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add priority" description="Create a new priority level" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createPriority(values))}>
                    <input {...form.register("name")} placeholder="Priority name" className={inputClass} />
                    <input type="number" {...form.register("level", { valueAsNumber: true })} placeholder="Level (1=highest)" className={inputClass} />
                    <input {...form.register("color")} placeholder="Color hex" className={inputClass} />
                    <input type="number" {...form.register("responseHours", { valueAsNumber: true })} placeholder="Response hours" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add priority" />
                </form>
            </Card>
        </div>
    );
}

export function SlasPanel({ data }: { data: SupportData }) {
    const form = useForm<SlaFormValues>({ resolver: zodResolver(slaFormSchema), defaultValues: { name: "", priorityId: "", firstResponseMinutes: 60, resolutionMinutes: 480 } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="SLAs" description="Service level agreements" />
                <div className="mt-6 space-y-3">
                    {data.slas.length === 0 ? <EmptyState title="No SLAs" description="Define SLAs for response and resolution targets." /> : data.slas.map((sla) => (
                        <ListCard key={sla.id} title={sla.name} subtitle={`${sla.priorityName ?? "All priorities"}`} meta={`First response: ${sla.firstResponseMinutes}min • Resolution: ${sla.resolutionMinutes}min • ${sla.isActive ? "Active" : "Inactive"}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add SLA" description="Create a new service level agreement" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createSla(values))}>
                    <input {...form.register("name")} placeholder="SLA name" className={inputClass} />
                    <select {...form.register("priorityId")} className={inputClass}>
                        <option value="">All priorities</option>
                        {data.priorities.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" {...form.register("firstResponseMinutes", { valueAsNumber: true })} placeholder="First response (minutes)" className={inputClass} />
                    <input type="number" {...form.register("resolutionMinutes", { valueAsNumber: true })} placeholder="Resolution (minutes)" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add SLA" />
                </form>
            </Card>
        </div>
    );
}

export function QueuesPanel({ data }: { data: SupportData }) {
    const form = useForm<QueueFormValues>({ resolver: zodResolver(queueFormSchema), defaultValues: { name: "", code: "", description: "", defaultAssigneeId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Queues" description="Ticket routing and assignment queues" />
                <div className="mt-6 space-y-3">
                    {data.queues.length === 0 ? <EmptyState title="No queues" description="Create queues to route tickets." /> : data.queues.map((queue) => (
                        <ListCard key={queue.id} title={`${queue.code} — ${queue.name}`} subtitle={queue.description} meta={`Default: ${queue.defaultAssigneeName ?? "Unassigned"} • ${queue.ticketCount} tickets • ${queue.isActive ? "Active" : "Inactive"}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add queue" description="Create a new support queue" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createQueue(values))}>
                    <input {...form.register("name")} placeholder="Queue name" className={inputClass} />
                    <input {...form.register("code")} placeholder="Queue code" className={inputClass} />
                    <input {...form.register("description")} placeholder="Description" className={inputClass} />
                    <select {...form.register("defaultAssigneeId")} className={inputClass}>
                        <option value="">Default assignee (optional)</option>
                        {data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <SaveButton loading={form.formState.isSubmitting} label="Add queue" />
                </form>
            </Card>
        </div>
    );
}

export function AgentsPanel({ data }: { data: SupportData }) {
    return (
        <Card hover>
            <SectionHeader title="Agent assignment" description="Support agent workload and ticket distribution" />
            <div className="mt-6 space-y-3">
                {data.agents.length === 0 ? (
                    <EmptyState title="No agent assignments" description="Agents will appear when tickets are assigned to employees." />
                ) : (
                    data.agents.map((agent) => (
                        <ListCard key={agent.agentId} title={agent.agentName} subtitle={`${agent.assignedTickets} total assigned`} meta={`${agent.openTickets} open • ${agent.resolvedTickets} resolved`} />
                    ))
                )}
            </div>
        </Card>
    );
}

export function PortalPanel({ data }: { data: SupportData }) {
    const form = useForm<PortalSettingsFormValues>({
        resolver: zodResolver(portalSettingsFormSchema),
        defaultValues: {
            portalEnabled: data.portalSettings?.portalEnabled ?? true,
            welcomeMessage: data.portalSettings?.welcomeMessage ?? "",
            allowTicketCreation: data.portalSettings?.allowTicketCreation ?? true,
            showKnowledgeBase: data.portalSettings?.showKnowledgeBase ?? true,
            customDomain: data.portalSettings?.customDomain ?? "",
        },
    });

    return (
        <Card hover>
            <SectionHeader title="Customer portal" description="Self-service portal configuration for customers" />
            <form className="mt-6 grid max-w-xl gap-4" onSubmit={form.handleSubmit(async (values) => data.updatePortalSettings(values))}>
                <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" {...form.register("portalEnabled")} className="rounded" />
                    Enable customer portal
                </label>
                <textarea {...form.register("welcomeMessage")} placeholder="Welcome message" rows={3} className={inputClass} />
                <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" {...form.register("allowTicketCreation")} className="rounded" />
                    Allow ticket creation
                </label>
                <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" {...form.register("showKnowledgeBase")} className="rounded" />
                    Show knowledge base
                </label>
                <input {...form.register("customDomain")} placeholder="Custom domain" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Save portal settings" />
            </form>
        </Card>
    );
}

export function NotesPanel({ data }: { data: SupportData }) {
    const form = useForm<NoteFormValues>({ resolver: zodResolver(noteFormSchema), defaultValues: { ticketId: "", body: "", isInternal: true } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Internal notes" description="Agent notes and customer-visible replies" />
                <div className="mt-6 space-y-3">
                    {data.notes.length === 0 ? <EmptyState title="No notes" description="Notes will appear on tickets." /> : data.notes.map((note) => (
                        <ListCard key={note.id} title={note.ticketNumber} subtitle={note.body} meta={`${note.isInternal ? "Internal" : "Customer-visible"} • ${new Date(note.createdAt).toLocaleString()}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add note" description="Add a note to a ticket" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createNote(values))}>
                    <select {...form.register("ticketId")} className={inputClass}>
                        <option value="">Select ticket</option>
                        {data.tickets.map((t) => <option key={t.id} value={t.id}>{t.ticketNumber} — {t.subject}</option>)}
                    </select>
                    <textarea {...form.register("body")} placeholder="Note content" rows={4} className={inputClass} />
                    <label className="flex items-center gap-3 text-sm">
                        <input type="checkbox" {...form.register("isInternal")} className="rounded" />
                        Internal note (hidden from customer)
                    </label>
                    <SaveButton loading={form.formState.isSubmitting} label="Add note" />
                </form>
            </Card>
        </div>
    );
}

export function AttachmentsPanel({ data }: { data: SupportData }) {
    const form = useForm<AttachmentFormValues>({ resolver: zodResolver(attachmentFormSchema), defaultValues: { ticketId: "", fileName: "", fileUrl: "", fileSize: 0, mimeType: "application/octet-stream" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Attachments" description="Files attached to support tickets" />
                <div className="mt-6 space-y-3">
                    {data.attachments.length === 0 ? <EmptyState title="No attachments" description="Attachments will appear when files are uploaded." /> : data.attachments.map((att) => (
                        <ListCard key={att.id} title={att.fileName} subtitle={att.ticketNumber} meta={`${att.mimeType} • ${(att.fileSize / 1024).toFixed(1)} KB • ${new Date(att.createdAt).toLocaleDateString()}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add attachment" description="Record a file attachment" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createAttachment(values))}>
                    <select {...form.register("ticketId")} className={inputClass}>
                        <option value="">Select ticket</option>
                        {data.tickets.map((t) => <option key={t.id} value={t.id}>{t.ticketNumber}</option>)}
                    </select>
                    <input {...form.register("fileName")} placeholder="File name" className={inputClass} />
                    <input {...form.register("fileUrl")} placeholder="File URL" className={inputClass} />
                    <input type="number" {...form.register("fileSize", { valueAsNumber: true })} placeholder="File size (bytes)" className={inputClass} />
                    <input {...form.register("mimeType")} placeholder="MIME type" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add attachment" />
                </form>
            </Card>
        </div>
    );
}

export function KnowledgeBasePanel({ data }: { data: SupportData }) {
    const form = useForm<KnowledgeArticleFormValues>({ resolver: zodResolver(knowledgeArticleFormSchema), defaultValues: { title: "", slug: "", content: "", categoryId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Knowledge base" description="Self-service articles and documentation" />
                <div className="mt-6 space-y-3">
                    {data.knowledgeArticles.length === 0 ? <EmptyState title="No articles" description="Create knowledge base articles." /> : data.knowledgeArticles.map((article) => (
                        <ListCard key={article.id} title={article.title} subtitle={article.categoryName ?? "Uncategorized"} meta={`${article.status} • ${article.viewCount} views`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add article" description="Create a knowledge base article" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createKnowledgeArticle(values))}>
                    <input {...form.register("title")} placeholder="Article title" className={inputClass} />
                    <input {...form.register("slug")} placeholder="Slug" className={inputClass} />
                    <textarea {...form.register("content")} placeholder="Content" rows={4} className={inputClass} />
                    <select {...form.register("categoryId")} className={inputClass}>
                        <option value="">Select category</option>
                        {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <SaveButton loading={form.formState.isSubmitting} label="Add article" />
                </form>
            </Card>
        </div>
    );
}

export function CannedResponsesPanel({ data }: { data: SupportData }) {
    const form = useForm<CannedResponseFormValues>({ resolver: zodResolver(cannedResponseFormSchema), defaultValues: { title: "", shortcut: "", body: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Canned responses" description="Pre-written reply templates" />
                <div className="mt-6 space-y-3">
                    {data.cannedResponses.length === 0 ? <EmptyState title="No canned responses" description="Create templates for common replies." /> : data.cannedResponses.map((resp) => (
                        <ListCard key={resp.id} title={resp.title} subtitle={resp.body} meta={`Shortcut: ${resp.shortcut}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add canned response" description="Create a reply template" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createCannedResponse(values))}>
                    <input {...form.register("title")} placeholder="Title" className={inputClass} />
                    <input {...form.register("shortcut")} placeholder="Shortcut (e.g. /ack)" className={inputClass} />
                    <textarea {...form.register("body")} placeholder="Response body" rows={4} className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add response" />
                </form>
            </Card>
        </div>
    );
}

export function EscalationPanel({ data }: { data: SupportData }) {
    const form = useForm<EscalationRuleFormValues>({ resolver: zodResolver(escalationRuleFormSchema), defaultValues: { name: "", triggerCondition: "sla_breach", escalationLevel: 1, targetQueueId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Escalation rules" description="Automated ticket escalation policies" />
                <div className="mt-6 space-y-3">
                    {data.escalationRules.length === 0 ? <EmptyState title="No escalation rules" description="Define rules for automatic escalation." /> : data.escalationRules.map((rule) => (
                        <ListCard key={rule.id} title={rule.name} subtitle={`Trigger: ${rule.triggerCondition}`} meta={`Level ${rule.escalationLevel} → ${rule.targetQueueName ?? "No queue"} • Notify: ${rule.notifyAgentName ?? "None"} • ${rule.isActive ? "Active" : "Inactive"}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add escalation rule" description="Create an escalation policy" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createEscalationRule(values))}>
                    <input {...form.register("name")} placeholder="Rule name" className={inputClass} />
                    <select {...form.register("triggerCondition")} className={inputClass}>
                        {ESCALATION_TRIGGER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <input type="number" {...form.register("escalationLevel", { valueAsNumber: true })} placeholder="Escalation level" className={inputClass} />
                    <select {...form.register("targetQueueId")} className={inputClass}>
                        <option value="">Target queue (optional)</option>
                        {data.queues.map((q) => <option key={q.id} value={q.id}>{q.name}</option>)}
                    </select>
                    <SaveButton loading={form.formState.isSubmitting} label="Add rule" />
                </form>
            </Card>
        </div>
    );
}

export function SatisfactionPanel({ data }: { data: SupportData }) {
    return (
        <Card hover>
            <SectionHeader title="Satisfaction ratings" description="Customer satisfaction (CSAT) scores" />
            <div className="mt-6 space-y-3">
                {data.satisfactionRatings.length === 0 ? (
                    <EmptyState title="No ratings" description="Satisfaction ratings will appear after ticket resolution." />
                ) : (
                    data.satisfactionRatings.map((rating) => (
                        <ListCard key={rating.id} title={`${rating.rating}/5 — ${rating.ticketNumber}`} subtitle={rating.comment || "No comment"} meta={new Date(rating.submittedAt).toLocaleDateString()} />
                    ))
                )}
            </div>
        </Card>
    );
}

export function SupportReportsPanel({ data }: { data: SupportData }) {
    const report = data.report;
    if (!report) return <EmptyState title="No reports" description="Support reports will appear once data is available." />;

    const sections = [
        { title: "Tickets by status", rows: report.ticketsByStatus.map((row) => `${row.status}: ${row.count}`) },
        { title: "Tickets by category", rows: report.ticketsByCategory.map((row) => `${row.category}: ${row.count}`) },
        { title: "Tickets by priority", rows: report.ticketsByPriority.map((row) => `${row.priority}: ${row.count}`) },
        { title: "Satisfaction distribution", rows: report.satisfactionDistribution.map((row) => `${row.rating}: ${row.count}`) },
        { title: "Queue workload", rows: report.queueWorkload.map((row) => `${row.queue}: ${row.count}`) },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
                <Card key={section.title} hover>
                    <SectionHeader title={section.title} description="Support analytics snapshot" />
                    <div className="mt-6 space-y-2">
                        {section.rows.length === 0 ? <p className="text-sm text-slate-500">No data</p> : section.rows.map((row) => <p key={row} className="text-sm">{row}</p>)}
                    </div>
                </Card>
            ))}
        </div>
    );
}

export function SupportAuditPanel({ data }: { data: SupportData }) {
    return (
        <Card hover>
            <SectionHeader title="Audit history" description="Support change log and compliance trail" />
            <div className="mt-6 space-y-3">
                {data.auditLogs.length === 0 ? (
                    <EmptyState title="No audit entries" description="Audit logs will appear as support changes are recorded." />
                ) : (
                    data.auditLogs.map((entry) => (
                        <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={new Date(entry.createdAt).toLocaleString()} />
                    ))
                )}
            </div>
        </Card>
    );
}
