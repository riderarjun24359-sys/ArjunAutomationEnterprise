"use client";

import { useState } from "react";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { Badge } from "@/src/design-os/components/Badge";
import { Input } from "@/src/design-os/components/Input";
import { Textarea } from "@/src/design-os/components/Textarea";
import { Select } from "@/src/design-os/components/Select";
import { FormField, FormLabel } from "@/src/design-os/components/Form";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";
import { changeRequestSchema } from "../../schemas";

export function ChangeRequestCenterPanel() {
    const { selectedClientId, changeRequests, submitChangeRequest, actionLoading } = useClientSuccessCapability();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId) return;
        const parsed = changeRequestSchema.safeParse({
            clientId: selectedClientId,
            title,
            description,
            requestedBy: "CS Manager",
            priority,
        });
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Validation failed");
            return;
        }
        setError("");
        await submitChangeRequest(parsed.data);
        setTitle("");
        setDescription("");
    };

    if (!selectedClientId) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to submit change requests.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Change Request Center</h2>
                <p className="text-sm text-[var(--dos-text-secondary)]">Submit change requests with AI impact analysis and approval workflow.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <FormField>
                            <FormLabel htmlFor="cr-title">Title</FormLabel>
                            <Input id="cr-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </FormField>
                        <FormField>
                            <FormLabel htmlFor="cr-desc">Description</FormLabel>
                            <Textarea id="cr-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </FormField>
                        <FormField>
                            <FormLabel htmlFor="cr-priority">Priority</FormLabel>
                            <Select id="cr-priority" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </Select>
                        </FormField>
                        {error && <p className="text-sm text-[var(--dos-error)]">{error}</p>}
                        <Button type="submit" disabled={actionLoading}>Submit Change Request</Button>
                    </div>
                </form>
            </Card>

            {changeRequests.map((cr) => (
                <Card key={cr.id}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{cr.title}</h3>
                        <Badge variant="warning">{cr.status}</Badge>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div><p className="text-xs font-medium">Business Impact</p><p className="text-sm">{cr.impactAnalysis.business}</p></div>
                        <div><p className="text-xs font-medium">Cost Impact</p><p className="text-sm">{cr.impactAnalysis.cost}</p></div>
                        <div><p className="text-xs font-medium">Risk</p><p className="text-sm">{cr.impactAnalysis.risk}</p></div>
                        <div><p className="text-xs font-medium">Timeline</p><p className="text-sm">{cr.impactAnalysis.timeline}</p></div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {cr.approvalWorkflow.map((step) => (
                            <Badge key={step.step} variant={step.status === "completed" ? "success" : "default"}>{step.step}</Badge>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
}
