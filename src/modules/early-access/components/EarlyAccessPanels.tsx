"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    CustomerSuccessConsole,
    EarlyAccessManagement,
    FeedbackSystem,
    FounderMonitoring,
    ReleaseManagement,
} from "../types";

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

export function EarlyAccessManagementPanel({ management }: { management: EarlyAccessManagement }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Pending invites" value={String(management.pendingInviteCount)} />
                <Metric label="Pending org approvals" value={String(management.pendingApprovalCount)} />
                <Metric label="Waitlist" value={String(management.waitlist.length)} />
                <Metric label="Founder notes" value={String(management.founderNotes.length)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Invite management</h3>
                    {management.invites.length === 0 ? (
                        <EmptyState title="No invites" description="Beta, organization, and identity invitations appear from Supabase." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {management.invites.map((i) => (
                                <li key={`${i.source}-${i.id}`} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>
                                        {i.email}
                                        <span className="block text-[var(--dos-text-tertiary)]">
                                            {i.source}
                                            {i.cohort ? ` · ${i.cohort}` : ""}
                                        </span>
                                    </span>
                                    <Badge variant={i.status.toLowerCase().includes("accept") ? "success" : "warning"}>{i.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Invite codes</h3>
                    {management.inviteCodes.length === 0 ? (
                        <EmptyState title="No invite codes" description="Invitation keys from beta/identity invites list here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {management.inviteCodes.map((c) => (
                                <li key={`${c.source}-${c.code}-${c.email}`} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <code className="text-[var(--dos-text-primary)]">{c.code}</code>
                                    <span className="text-[var(--dos-text-secondary)]">{c.email}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Waitlist</h3>
                    {management.waitlist.length === 0 ? (
                        <EmptyState title="Waitlist empty" description="Sales leads in wait/new/inbound states surface here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {management.waitlist.map((w) => (
                                <li key={w.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>
                                        {w.name}
                                        <span className="block text-[var(--dos-text-tertiary)]">{w.email}</span>
                                    </span>
                                    <Badge variant="info">{w.score}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Organization approvals</h3>
                    {management.organizationApprovals.length === 0 ? (
                        <EmptyState title="No beta organizations" description="COP beta organizations and approval status appear here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {management.organizationApprovals.map((o) => (
                                <li key={o.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>
                                        {o.name}
                                        <span className="block text-[var(--dos-text-tertiary)]">{o.cohort || "—"}</span>
                                    </span>
                                    <Badge variant={o.betaStatus.toLowerCase().includes("approv") ? "success" : "warning"}>{o.betaStatus}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Founder notes</h3>
                    {management.founderNotes.length === 0 ? (
                        <EmptyState title="No founder notes" description="Founder OS insights load live from Supabase." />
                    ) : (
                        <ul className="mt-3 space-y-3 text-sm">
                            {management.founderNotes.map((n) => (
                                <li key={n.id} className="border-b border-[var(--dos-border-subtle)] pb-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-[var(--dos-text-primary)]">{n.title}</p>
                                        <Badge variant="info">{n.type}</Badge>
                                    </div>
                                    <p className="mt-1 text-[var(--dos-text-secondary)]">{n.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function CustomerSuccessConsolePanel({ success }: { success: CustomerSuccessConsole }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Onboarding completion" value={success.onboardingCompletionRate != null ? `${success.onboardingCompletionRate}%` : "—"} />
                <Metric label="Failed onboarding" value={String(success.failedOnboardingCount)} />
                <Metric label="First-login events" value={String(success.firstLogins.length)} />
                <Metric label="Success tasks" value={String(success.successTasks.length)} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">First-login tracking</h3>
                    {success.firstLogins.length === 0 ? (
                        <EmptyState title="No first-login events" description="Activity logs mentioning login/sign-in appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {success.firstLogins.map((e) => (
                                <li key={e.id} className="border-b border-[var(--dos-border-subtle)] py-2">
                                    <p className="font-medium text-[var(--dos-text-primary)]">{e.title}</p>
                                    <p className="text-[var(--dos-text-tertiary)]">{e.at}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Onboarding completion</h3>
                    {success.onboarding.length === 0 ? (
                        <EmptyState title="No onboarding workflows" description="CS onboarding workflows from Supabase list here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {success.onboarding.map((o) => (
                                <li key={o.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{o.name}</span>
                                    <Badge variant={o.status.toLowerCase().includes("complete") ? "success" : "warning"}>{o.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Feature adoption</h3>
                    {success.featureAdoption.length === 0 ? (
                        <EmptyState title="No adoption data" description="CS adoption tracking percentages appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {success.featureAdoption.map((a) => (
                                <li key={a.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{a.name}</span>
                                    <span>{a.percent}%</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Customer health timeline</h3>
                    {success.healthTimeline.length === 0 ? (
                        <EmptyState title="No health timeline" description="CS health scores and operated health snapshots appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {success.healthTimeline.map((h) => (
                                <li key={h.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>
                                        {h.name}
                                        <span className="block text-[var(--dos-text-tertiary)]">{h.at}</span>
                                    </span>
                                    <Badge variant={h.score >= 70 ? "success" : "warning"}>{h.score}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Success tasks</h3>
                    {success.successTasks.length === 0 ? (
                        <EmptyState title="No success tasks" description="HR onboarding tasks linked to plans appear here." />
                    ) : (
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
                            {success.successTasks.map((t) => (
                                <li key={t.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{t.title}</span>
                                    <Badge variant="info">{t.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function FeedbackSystemPanel({ feedback }: { feedback: FeedbackSystem }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="NPS" value={feedback.nps.score != null ? String(feedback.nps.score) : "—"} />
                <Metric label="NPS / CSAT responses" value={String(feedback.nps.responses)} />
                <Metric label="Bug reports" value={String(feedback.bugReports.length)} />
                <Metric label="Feature requests" value={String(feedback.featureRequests.length)} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">In-app feedback</h3>
                    {feedback.inAppFeedback.length === 0 ? (
                        <EmptyState title="No feedback" description="COP feedback collection rows appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {feedback.inAppFeedback.map((f) => (
                                <li key={f.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>
                                        {f.title}
                                        <span className="block text-[var(--dos-text-tertiary)]">{f.type}</span>
                                    </span>
                                    <Badge variant="info">{f.rating ?? "—"}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Session feedback</h3>
                    {feedback.sessionFeedback.length === 0 ? (
                        <EmptyState title="No session feedback" description="Feedback typed as session/NPS surfaces here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {feedback.sessionFeedback.map((f) => (
                                <li key={f.id} className="border-b border-[var(--dos-border-subtle)] py-2">
                                    {f.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Bug reporting</h3>
                    {feedback.bugReports.length === 0 ? (
                        <EmptyState title="No bugs" description="COP bug reports appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {feedback.bugReports.map((b) => (
                                <li key={b.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{b.title}</span>
                                    <Badge variant="error">{b.severity}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Feature requests</h3>
                    {feedback.featureRequests.length === 0 ? (
                        <EmptyState title="No feature requests" description="COP feature requests appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {feedback.featureRequests.map((r) => (
                                <li key={r.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{r.title}</span>
                                    <Badge variant="info">{r.priority}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function FounderMonitoringPanel({ monitoring }: { monitoring: FounderMonitoring }) {
    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Daily executive summary</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--dos-text-secondary)]">{monitoring.dailyExecutiveSummary}</p>
            </Card>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Live customer activity</h3>
                    {monitoring.liveActivity.length === 0 ? (
                        <EmptyState title="No activity" description="Organization activity logs stream here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {monitoring.liveActivity.map((a) => (
                                <li key={a.id} className="border-b border-[var(--dos-border-subtle)] py-2">
                                    <p className="font-medium text-[var(--dos-text-primary)]">{a.title || a.action}</p>
                                    <p className="text-[var(--dos-text-tertiary)]">{a.at}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">New organization alerts</h3>
                    {monitoring.newOrganizationAlerts.length === 0 ? (
                        <EmptyState title="No new orgs (7d)" description="Recently created organizations and beta enrollments appear here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {monitoring.newOrganizationAlerts.map((o) => (
                                <li key={o.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{o.name}</span>
                                    <Badge variant="success">{o.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Failed onboarding alerts</h3>
                    {monitoring.failedOnboardingAlerts.length === 0 ? (
                        <EmptyState title="No failed onboarding" description="Failed/stuck CS onboarding workflows alert here." />
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm">
                            {monitoring.failedOnboardingAlerts.map((a) => (
                                <li key={a.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{a.name}</span>
                                    <Badge variant="error">{a.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive briefings</h3>
                    {monitoring.briefings.length === 0 ? (
                        <EmptyState title="No briefings" description="COP executive briefings appear here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {monitoring.briefings.map((b) => (
                                <li key={b.id} className="border-b border-[var(--dos-border-subtle)] py-2">
                                    <p className="font-medium text-[var(--dos-text-primary)]">{b.title}</p>
                                    <p className="text-[var(--dos-text-secondary)]">{b.summary}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function ReleaseManagementPanel({ releases }: { releases: ReleaseManagement }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Changelog</h3>
                    {releases.changelog.length === 0 ? (
                        <EmptyState title="No changelog" description="ELR release notes and COP release channels appear here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {releases.changelog.map((c) => (
                                <li key={c.id} className="border-b border-[var(--dos-border-subtle)] py-2">
                                    <p className="font-medium text-[var(--dos-text-primary)]">{c.version}</p>
                                    <p className="text-[var(--dos-text-secondary)]">{c.summary}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Release notes</h3>
                    {releases.releaseNotes.length === 0 ? (
                        <EmptyState title="No release notes" description="ELR release notes load from Supabase." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {releases.releaseNotes.map((n) => (
                                <li key={n.id} className="border-b border-[var(--dos-border-subtle)] py-2">
                                    <p className="font-medium text-[var(--dos-text-primary)]">{n.version}</p>
                                    <p className="text-[var(--dos-text-secondary)]">{n.summary}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Hotfix deployment log</h3>
                    {releases.hotfixLog.length === 0 ? (
                        <EmptyState title="No deployments" description="ELR deployment plans (hotfix-first ordering) appear here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {releases.hotfixLog.map((h) => (
                                <li key={h.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>
                                        {h.name}
                                        <span className="block text-[var(--dos-text-tertiary)]">
                                            {h.version} · {h.strategy}
                                        </span>
                                    </span>
                                    <Badge variant="info">{h.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Incident log</h3>
                    {releases.incidentLog.length === 0 ? (
                        <EmptyState title="No incidents" description="ELR critical issues, launch failures, and COP platform failures appear here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {releases.incidentLog.map((i) => (
                                <li key={i.id} className="border-b border-[var(--dos-border-subtle)] py-2">
                                    <div className="flex justify-between gap-2">
                                        <p className="font-medium text-[var(--dos-text-primary)]">{i.title}</p>
                                        <Badge variant="error">{i.severity}</Badge>
                                    </div>
                                    <p className="text-[var(--dos-text-secondary)]">{i.summary}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}
