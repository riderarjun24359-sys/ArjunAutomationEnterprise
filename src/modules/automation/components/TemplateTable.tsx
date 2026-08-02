import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { WorkflowTemplate } from "@/src/modules/automation/types";

interface TemplateTableProps {
    templates: WorkflowTemplate[];
}

export function TemplateTable({ templates }: TemplateTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Workflow templates" description="Reusable automation blueprints" />
            {templates.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No templates available" description="Templates will appear once configured for your organization." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {templates.map((template) => (
                        <div key={template.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">{template.name}</p>
                                <span className="text-xs capitalize text-emerald-600">{template.category}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{template.description}</p>
                            <p className="mt-2 text-xs text-slate-500">{template.isPublic ? "Public template" : "Private template"}</p>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
