"use client";

import { motion } from "framer-motion";
import { ChevronRight, Users } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { useOrganization } from "@/src/modules/organization/hooks/useOrganization";
import { ORGANIZATION_TABS } from "@/src/modules/organization/constants";
import { useState } from "react";

const tabs = [
    { id: ORGANIZATION_TABS.overview, label: "Overview" },
    { id: ORGANIZATION_TABS.workspaces, label: "Workspaces" },
    { id: ORGANIZATION_TABS.members, label: "Members" },
    { id: ORGANIZATION_TABS.invitations, label: "Invitations" },
    { id: ORGANIZATION_TABS.settings, label: "Settings" },
];

export function OrganizationPage() {
    const { organizations, workspaces, members, invitations, loading } = useOrganization();
    const [activeTab, setActiveTab] = useState<(typeof ORGANIZATION_TABS)[keyof typeof ORGANIZATION_TABS]>(ORGANIZATION_TABS.overview);

    if (loading) {
        return <LoadingState />;
    }

    const organization = organizations[0];

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
                <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Organization Control Center</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Manage multi-tenant operations and workspace health</h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Coordinate org-level strategy, workspace deployment, team membership, and invitation flow from a single control surface.</p>
                        </div>
                        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">Enterprise-ready governance</div>
                    </div>
                </motion.header>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {!organization ? (
                    <EmptyState title="No organization yet" description="Create your first organization to unlock workspace governance." />
                ) : (
                    <>
                        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                            <Card hover className="min-h-[220px]">
                                <SectionHeader title={organization.name} description={`@${organization.slug} • ${organization.status}`} />
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Members</p>
                                        <p className="mt-1 text-xl font-semibold">{organization.memberCount}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Workspaces</p>
                                        <p className="mt-1 text-xl font-semibold">{organization.workspaceCount}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Updated</p>
                                        <p className="mt-1 text-xl font-semibold">{organization.updatedAt}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card hover>
                                <SectionHeader title="Governance snapshot" description="Current operational posture" />
                                <div className="mt-6 space-y-3">
                                    {[
                                        { label: "Active workspaces", value: workspaces.length.toString() },
                                        { label: "Pending invitations", value: invitations.filter((invite) => invite.status === "pending").length.toString() },
                                        { label: "Team roles", value: "4 configured" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                                            <span className="font-semibold">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </section>

                        {activeTab === ORGANIZATION_TABS.overview ? (
                            <section className="grid gap-6 xl:grid-cols-3">
                                <Card hover>
                                    <SectionHeader title="Workspaces" description="Active deployments" />
                                    <div className="mt-6 space-y-3">
                                        {workspaces.map((workspace) => (
                                            <div key={workspace.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                                <div>
                                                    <p className="font-medium">{workspace.name}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{workspace.slug}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <Users className="h-4 w-4" /> {workspace.memberCount}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card hover>
                                    <SectionHeader title="Members" description="Current roster" />
                                    <div className="mt-6 space-y-3">
                                        {members.map((member) => (
                                            <div key={member.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                                <p className="font-medium">{member.fullName ?? member.email}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{member.roleName} • {member.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card hover>
                                    <SectionHeader title="Invitations" description="Pending participation" />
                                    <div className="mt-6 space-y-3">
                                        {invitations.map((invitation) => (
                                            <div key={invitation.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                                <div>
                                                    <p className="font-medium">{invitation.email}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{invitation.roleName} • {invitation.status}</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-slate-400" />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </section>
                        ) : null}

                        {activeTab === ORGANIZATION_TABS.workspaces ? (
                            <Card hover>
                                <SectionHeader title="Workspace overview" description="Shared operating boundaries" />
                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    {workspaces.map((workspace) => (
                                        <div key={workspace.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                            <p className="font-semibold">{workspace.name}</p>
                                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{workspace.slug}</p>
                                            <div className="mt-4 flex items-center justify-between text-sm">
                                                <span>{workspace.status}</span>
                                                <span>{workspace.memberCount} members</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ) : null}

                        {activeTab === ORGANIZATION_TABS.members ? (
                            <Card hover>
                                <SectionHeader title="Member directory" description="Roles and access" />
                                <div className="mt-6 space-y-3">
                                    {members.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                            <div>
                                                <p className="font-medium">{member.fullName ?? member.email}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                                            </div>
                                            <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{member.roleName}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ) : null}

                        {activeTab === ORGANIZATION_TABS.invitations ? (
                            <Card hover>
                                <SectionHeader title="Invitation queue" description="Pending and accepted invites" />
                                <div className="mt-6 space-y-3">
                                    {invitations.map((invitation) => (
                                        <div key={invitation.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                            <div>
                                                <p className="font-medium">{invitation.email}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{invitation.roleName} • expires {invitation.expiresAt}</p>
                                            </div>
                                            <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{invitation.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ) : null}

                        {activeTab === ORGANIZATION_TABS.settings ? (
                            <Card hover>
                                <SectionHeader title="Organization settings" description="Status and governance" />
                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">The settings experience is scaffolded to support future configuration, profile, permission, and notification updates.</p>
                                </div>
                            </Card>
                        ) : null}
                    </>
                )}
        </div>
    );
}
