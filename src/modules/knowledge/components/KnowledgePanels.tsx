"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { COMPONENT_TYPE_OPTIONS, ENTRY_CATEGORY_OPTIONS, KNOWLEDGE_PERMISSIONS, MODULE_SOURCE_OPTIONS, PATTERN_TYPE_OPTIONS } from "@/src/modules/knowledge/constants";
import type { useKnowledge } from "@/src/modules/knowledge/hooks/useKnowledge";
import {
    adrFormSchema, aiContextFormSchema, clientMemoryFormSchema, componentFormSchema, crossLinkFormSchema, documentationFormSchema, entryFormSchema, patternFormSchema, permissionGrantFormSchema, projectMemoryFormSchema, promptFormSchema, searchFormSchema, semanticIndexFormSchema, solutionFormSchema, versionFormSchema,
    type AdrFormValues, type AiContextFormValues, type ClientMemoryFormValues, type ComponentFormValues, type CrossLinkFormValues, type DocumentationFormValues, type EntryFormValues, type PatternFormValues, type PermissionGrantFormValues, type ProjectMemoryFormValues, type PromptFormValues, type SearchFormValues, type SemanticIndexFormValues, type SolutionFormValues, type VersionFormValues,
} from "@/src/modules/knowledge/schemas";

type KnowledgeData = ReturnType<typeof useKnowledge>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-amber-600">{meta}</p> : null}</div>;
}

export function KnowledgeOverviewPanel({ data }: { data: KnowledgeData }) {
    const links = data.crossModuleLinks;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Knowledge summary" description="Enterprise knowledge and memory metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Repository" subtitle={`${data.stats?.totalEntries ?? 0} entries`} />
                <ListCard title="Solutions" subtitle={`${data.stats?.totalSolutions ?? 0} reusable solutions`} />
                <ListCard title="Prompts" subtitle={`${data.stats?.totalPrompts ?? 0} prompt knowledge`} />
                <ListCard title="Versions" subtitle={`${data.stats?.versionRecords ?? 0} version records`} />
            </div></Card>
            <Card hover><SectionHeader title="Cross-module knowledge linking" description="Knowledge linked across CRM, Projects, Finance, HR, Inventory, Sales, Support, Documents, Automation, Analytics, and AI Orchestration" /><div className="mt-6 space-y-3">
                {links ? (<>
                    <ListCard title="CRM" subtitle={`${links.crmLinks} links`} meta="Client intelligence" />
                    <ListCard title="Projects" subtitle={`${links.projectLinks} links`} meta="Delivery memory" />
                    <ListCard title="AI Orchestration" subtitle={`${links.aiLinks} links`} meta="AI context integration" />
                    <ListCard title="Documents" subtitle={`${links.documentsLinks} links`} meta="Documentation knowledge" />
                </>) : <EmptyState title="No cross-module data" description="Cross-module links will appear as knowledge is connected." />}
            </div></Card>
        </div>
    );
}

export function RepositoryPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<EntryFormValues>({ resolver: zodResolver(entryFormSchema), defaultValues: { title: "", slug: "", content: "", category: "general", clientId: "", projectId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Central knowledge repository" description="Organizational knowledge entries with versioning" /><div className="mt-6 space-y-3">
                {data.entries.length === 0 ? <EmptyState title="No entries" description="Create knowledge entries for your organization." /> : data.entries.map((e) => (
                    <ListCard key={e.id} title={e.title} subtitle={`${e.slug} • ${e.category}`} meta={`${e.status} • v${e.currentVersion}${e.clientName ? ` • ${e.clientName}` : ""}${e.projectName ? ` • ${e.projectName}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create entry" description="Add knowledge to the repository" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEntry(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("slug")} placeholder="Slug" className={inputClass} />
                <select {...form.register("category")} className={inputClass}>{ENTRY_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("content")} placeholder="Content" rows={4} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create entry" />
            </form></Card>
        </div>
    );
}

export function SearchPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<SearchFormValues>({ resolver: zodResolver(searchFormSchema), defaultValues: { query: "" } });
    const indexForm = useForm<SemanticIndexFormValues>({ resolver: zodResolver(semanticIndexFormSchema), defaultValues: { entryId: "", searchText: "", embeddingKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Semantic search" description="Search indexed knowledge content" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.searchKnowledge(v.query))}>
                <input {...form.register("query")} placeholder="Search query" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Search" />
            </form><div className="mt-6 space-y-3">
                {data.searchResults.length === 0 ? <EmptyState title="No search results" description="Enter a query to search the semantic index." /> : data.searchResults.map((r) => (
                    <ListCard key={`${r.entryId}-${r.matchPreview.slice(0, 20)}`} title={r.entryTitle} subtitle={r.matchPreview} meta={`Score: ${r.score}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Semantic index" description={`${data.semanticIndex.length} indexed records`} /><div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
                {data.semanticIndex.length === 0 ? <EmptyState title="No index records" description="Index records are created when entries are added." /> : data.semanticIndex.map((r) => (
                    <ListCard key={r.id} title={r.entryTitle} subtitle={r.searchTextPreview} meta={new Date(r.indexedAt).toLocaleString()} />
                ))}
            </div><form className="mt-6 grid gap-4" onSubmit={indexForm.handleSubmit(async (v) => data.createSemanticIndex(v))}>
                <select {...indexForm.register("entryId")} className={inputClass}><option value="">Entry</option>{data.entryOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <textarea {...indexForm.register("searchText")} placeholder="Search text" rows={3} className={inputClass} />
                <SaveButton loading={indexForm.formState.isSubmitting} label="Index content" />
            </form></Card>
        </div>
    );
}

export function SolutionsPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<SolutionFormValues>({ resolver: zodResolver(solutionFormSchema), defaultValues: { name: "", problemStatement: "", solutionSummary: "", implementationNotes: "", category: "general" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Reusable solution library" description="Documented solutions for recurring problems" /><div className="mt-6 space-y-3">
                {data.solutions.length === 0 ? <EmptyState title="No solutions" description="Add reusable solutions to the library." /> : data.solutions.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={s.problemPreview} meta={`${s.category} • ${s.status} • ${s.solutionPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add solution" description="Document a reusable solution" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSolution(v))}>
                <input {...form.register("name")} placeholder="Solution name" className={inputClass} />
                <textarea {...form.register("problemStatement")} placeholder="Problem statement" rows={2} className={inputClass} />
                <textarea {...form.register("solutionSummary")} placeholder="Solution summary" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add solution" />
            </form></Card>
        </div>
    );
}

export function AdrsPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<AdrFormValues>({ resolver: zodResolver(adrFormSchema), defaultValues: { title: "", context: "", decision: "", consequences: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Architecture decision records" description="Documented architectural decisions" /><div className="mt-6 space-y-3">
                {data.adrs.length === 0 ? <EmptyState title="No ADRs" description="Record architecture decisions." /> : data.adrs.map((a) => (
                    <ListCard key={a.id} title={`ADR-${a.adrNumber}: ${a.title}`} subtitle={a.contextPreview} meta={`${a.status} • ${a.decisionPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ADR" description="Record an architecture decision" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdr(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("context")} placeholder="Context" rows={2} className={inputClass} />
                <textarea {...form.register("decision")} placeholder="Decision" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create ADR" />
            </form></Card>
        </div>
    );
}

export function PromptsPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<PromptFormValues>({ resolver: zodResolver(promptFormSchema), defaultValues: { name: "", promptKey: "", category: "general", content: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Prompt knowledge base" description="Reusable prompts for AI capabilities" /><div className="mt-6 space-y-3">
                {data.prompts.length === 0 ? <EmptyState title="No prompts" description="Add prompts to the knowledge base." /> : data.prompts.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.promptKey} • ${p.category}`} meta={`${p.status} • ${p.contentPreview}...`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add prompt" description="Create prompt knowledge" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPrompt(v))}>
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("promptKey")} placeholder="Prompt key" className={inputClass} />
                <textarea {...form.register("content")} placeholder="Prompt content" rows={4} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add prompt" />
            </form></Card>
        </div>
    );
}

export function ProjectMemoryPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<ProjectMemoryFormValues>({ resolver: zodResolver(projectMemoryFormSchema), defaultValues: { projectId: "", memoryKey: "", summary: "", details: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Project memory" description="Persistent project context for AI capabilities" /><div className="mt-6 space-y-3">
                {data.projectMemories.length === 0 ? <EmptyState title="No project memory" description="Store project context for AI retrieval." /> : data.projectMemories.map((m) => (
                    <ListCard key={m.id} title={m.memoryKey} subtitle={`${m.projectName} • ${m.summary}`} meta={m.detailsPreview} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Store memory" description="Add project memory record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProjectMemory(v))}>
                <select {...form.register("projectId")} className={inputClass}><option value="">Project</option>{data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <input {...form.register("memoryKey")} placeholder="Memory key" className={inputClass} />
                <textarea {...form.register("summary")} placeholder="Summary" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Store memory" />
            </form></Card>
        </div>
    );
}

export function ClientMemoryPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<ClientMemoryFormValues>({ resolver: zodResolver(clientMemoryFormSchema), defaultValues: { clientId: "", memoryKey: "", summary: "", details: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Client memory" description="Persistent client context for AI capabilities" /><div className="mt-6 space-y-3">
                {data.clientMemories.length === 0 ? <EmptyState title="No client memory" description="Store client context for AI retrieval." /> : data.clientMemories.map((m) => (
                    <ListCard key={m.id} title={m.memoryKey} subtitle={`${m.clientName} • ${m.summary}`} meta={m.detailsPreview} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Store memory" description="Add client memory record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createClientMemory(v))}>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input {...form.register("memoryKey")} placeholder="Memory key" className={inputClass} />
                <textarea {...form.register("summary")} placeholder="Summary" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Store memory" />
            </form></Card>
        </div>
    );
}

export function ComponentsPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<ComponentFormValues>({ resolver: zodResolver(componentFormSchema), defaultValues: { name: "", componentType: "ui", description: "", usageGuidelines: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Component catalog" description="Reusable enterprise components" /><div className="mt-6 space-y-3">
                {data.components.length === 0 ? <EmptyState title="No components" description="Catalog reusable components." /> : data.components.map((c) => (
                    <ListCard key={c.id} title={c.name} subtitle={`${c.componentType} • ${c.descriptionPreview}`} meta={c.status} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add component" description="Register a component" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComponent(v))}>
                <input {...form.register("name")} placeholder="Component name" className={inputClass} />
                <select {...form.register("componentType")} className={inputClass}>{COMPONENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add component" />
            </form></Card>
        </div>
    );
}

export function PatternsPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<PatternFormValues>({ resolver: zodResolver(patternFormSchema), defaultValues: { name: "", patternType: "architecture", description: "", whenToUse: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pattern library" description="Enterprise design and integration patterns" /><div className="mt-6 space-y-3">
                {data.patterns.length === 0 ? <EmptyState title="No patterns" description="Document reusable patterns." /> : data.patterns.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.patternType} • ${p.descriptionPreview}`} meta={p.status} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add pattern" description="Document a pattern" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPattern(v))}>
                <input {...form.register("name")} placeholder="Pattern name" className={inputClass} />
                <select {...form.register("patternType")} className={inputClass}>{PATTERN_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("description")} placeholder="Description" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add pattern" />
            </form></Card>
        </div>
    );
}

export function DocumentationPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<DocumentationFormValues>({ resolver: zodResolver(documentationFormSchema), defaultValues: { title: "", docKey: "", moduleSource: "general", content: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Documentation knowledge" description="Module documentation for AI retrieval" /><div className="mt-6 space-y-3">
                {data.documentation.length === 0 ? <EmptyState title="No documentation" description="Add documentation knowledge." /> : data.documentation.map((d) => (
                    <ListCard key={d.id} title={d.title} subtitle={`${d.docKey} • ${d.moduleSource}`} meta={`${d.status} • ${d.contentPreview}...`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Add documentation" description="Create documentation knowledge" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocumentation(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("docKey")} placeholder="Doc key" className={inputClass} />
                <select {...form.register("moduleSource")} className={inputClass}>{MODULE_SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("content")} placeholder="Content" rows={4} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Add documentation" />
            </form></Card>
        </div>
    );
}

export function AiContextPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<AiContextFormValues>({ resolver: zodResolver(aiContextFormSchema), defaultValues: { contextKey: "", agentId: "", sessionId: "", entryId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="AI context management" description="Context payloads linked to AI Orchestration Layer" /><div className="mt-6 space-y-3">
                {data.aiContexts.length === 0 ? <EmptyState title="No AI contexts" description="Create contexts for AI capabilities." /> : data.aiContexts.map((c) => (
                    <ListCard key={c.id} title={c.contextKey} subtitle={`Agent: ${c.agentName ?? "None"} • Session: ${c.sessionKey ?? "None"}`} meta={`${c.status}${c.entryTitle ? ` • Entry: ${c.entryTitle}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create context" description="Link knowledge to AI orchestration" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAiContext(v))}>
                <input {...form.register("contextKey")} placeholder="Context key" className={inputClass} />
                <select {...form.register("agentId")} className={inputClass}><option value="">Agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <select {...form.register("sessionId")} className={inputClass}><option value="">Session</option>{data.sessionOptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                <select {...form.register("entryId")} className={inputClass}><option value="">Knowledge entry</option>{data.entryOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create context" />
            </form></Card>
        </div>
    );
}

export function VersionsPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<VersionFormValues>({ resolver: zodResolver(versionFormSchema), defaultValues: { entryId: "", content: "", changeSummary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Knowledge versioning" description="Version history for knowledge entries" /><div className="mt-6 space-y-3">
                {data.versions.length === 0 ? <EmptyState title="No versions" description="Versions are created when entries are updated." /> : data.versions.map((v) => (
                    <ListCard key={v.id} title={`${v.entryTitle} — v${v.versionNumber}`} subtitle={v.changeSummary} meta={new Date(v.createdAt).toLocaleString()} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create version" description="Publish a new version" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVersion(v))}>
                <select {...form.register("entryId")} className={inputClass}><option value="">Entry</option>{data.entryOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <textarea {...form.register("content")} placeholder="Updated content" rows={4} className={inputClass} />
                <input {...form.register("changeSummary")} placeholder="Change summary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create version" />
            </form></Card>
        </div>
    );
}

export function KnowledgeAnalyticsPanel({ data }: { data: KnowledgeData }) {
    const report = data.report;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Knowledge analytics" description="Usage and coverage metrics" /><div className="mt-6 space-y-3">
                {data.analytics.length === 0 ? <EmptyState title="No analytics" description="Analytics will populate as knowledge is used." /> : data.analytics.map((m) => (
                    <ListCard key={m.id} title={m.metricKey} subtitle={`Value: ${m.metricValue}`} meta={`${new Date(m.periodStart).toLocaleDateString()} – ${new Date(m.periodEnd).toLocaleDateString()}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Entries by category" description="Repository distribution" /><div className="mt-6 space-y-3">
                {(report?.entriesByCategory ?? []).length === 0 ? <EmptyState title="No report data" description="Reports will populate once entries exist." /> : (report?.entriesByCategory ?? []).map((item) => (
                    <ListCard key={item.label} title={item.label} subtitle={`${item.count} entries`} />
                ))}
            </div></Card>
        </div>
    );
}

export function KnowledgePermissionsPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<PermissionGrantFormValues>({ resolver: zodResolver(permissionGrantFormSchema), defaultValues: { granteeType: "employee", granteeId: "", permissionKey: "knowledge.view", resourceType: "all", resourceId: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Knowledge permissions" description="Granular access control for knowledge operations" /><div className="mt-6 space-y-3">
                {data.permissionGrants.length === 0 ? <EmptyState title="No permission grants" description="Grant knowledge permissions to users." /> : data.permissionGrants.map((g) => (
                    <ListCard key={g.id} title={g.permissionKey} subtitle={`${g.granteeType} • ${g.granteeName ?? "Unassigned"}`} meta={`${g.resourceType} • ${g.isActive ? "Active" : "Inactive"}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Grant permission" description="Assign knowledge permission" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPermissionGrant(v))}>
                <select {...form.register("permissionKey")} className={inputClass}>{KNOWLEDGE_PERMISSIONS.map((p) => <option key={p} value={p}>{p}</option>)}</select>
                <select {...form.register("granteeId")} className={inputClass}><option value="">Grantee</option>{data.employeeOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("resourceType")} placeholder="Resource type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Grant permission" />
            </form></Card>
        </div>
    );
}

export function CrossLinksPanel({ data }: { data: KnowledgeData }) {
    const form = useForm<CrossLinkFormValues>({ resolver: zodResolver(crossLinkFormSchema), defaultValues: { sourceModule: "crm", sourceEntityType: "", sourceEntityId: "", entryId: "", linkType: "reference" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cross-module knowledge linking" description="Links between modules and knowledge entries" /><div className="mt-6 space-y-3">
                {data.crossLinks.length === 0 ? <EmptyState title="No cross links" description="Link knowledge to module entities." /> : data.crossLinks.map((l) => (
                    <ListCard key={l.id} title={`${l.sourceModule} • ${l.sourceEntityType}`} subtitle={l.entryTitle ?? "No entry linked"} meta={`${l.linkType} • ${new Date(l.createdAt).toLocaleString()}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create link" description="Link module entity to knowledge" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCrossLink(v))}>
                <select {...form.register("sourceModule")} className={inputClass}>{MODULE_SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("sourceEntityType")} placeholder="Entity type" className={inputClass} />
                <select {...form.register("entryId")} className={inputClass}><option value="">Knowledge entry</option>{data.entryOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create link" />
            </form></Card>
        </div>
    );
}

export function KnowledgeAuditPanel({ data }: { data: KnowledgeData }) {
    return (
        <Card hover><SectionHeader title="Knowledge audit history" description="Complete audit trail for all knowledge operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function KnowledgeSdkPanel({ data }: { data: KnowledgeData }) {
    return (
        <Card hover><SectionHeader title="Shared Knowledge SDK" description="Import from @/src/modules/knowledge/sdk for all AI capabilities" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createKnowledgeClient()" subtitle="Factory for module-scoped knowledge client with auth context" meta="Used by AI Orchestration and all enterprise modules" />
            <ListCard title="client.search()" subtitle="Semantic search across indexed knowledge" meta={`${data.semanticIndex.length} indexed records`} />
            <ListCard title="client.resolveContext()" subtitle="Resolve or create AI context linked to orchestration" meta={`${data.aiContexts.length} contexts registered`} />
            <ListCard title="client.storeMemory()" subtitle="Store client or project memory for AI retrieval" meta={`${(data.projectMemories.length + data.clientMemories.length)} memory records`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";

const knowledge = createKnowledgeClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);

const results = await knowledge.search({ query: "migration strategy" });
const context = await knowledge.resolveContext({ contextKey: "crm-analysis", agentId });
await knowledge.storeMemory({ entityType: "client", entityId, memoryKey: "preferences", summary: "..." });`}</pre>
        </div></Card>
    );
}
