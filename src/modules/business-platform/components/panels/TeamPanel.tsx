"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function TeamPanel({ data }: { data: BusinessPlatformData }) {
    return (
        <Card>
            <h2 className="text-lg font-semibold">Team</h2>
            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Roles, permissions, assignments, capacity, and performance</p>
            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--dos-border)]">
                            <th className="pb-3 pr-4">Name</th>
                            <th className="pb-3 pr-4">Role</th>
                            <th className="pb-3 pr-4">Department</th>
                            <th className="pb-3 pr-4">Capacity</th>
                            <th className="pb-3">Assignments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.team.length === 0 ? (
                            <tr><td colSpan={5}><EmptyState title="No team members" description="Add employees in HR module." /></td></tr>
                        ) : (
                            data.team.map((member) => (
                                <tr key={member.id} className="border-b border-[var(--dos-border)]">
                                    <td className="py-3 pr-4 font-medium">{member.name}</td>
                                    <td className="py-3 pr-4">{member.role}</td>
                                    <td className="py-3 pr-4">{member.department}</td>
                                    <td className="py-3 pr-4">{member.capacity}h/wk</td>
                                    <td className="py-3">{member.activeAssignments}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
