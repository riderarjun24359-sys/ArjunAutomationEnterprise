"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    CustomerEducation,
    FounderDailyBrief,
    ReferralEngine,
    SuccessMonitoring,
    TestimonialCenter,
} from "../types";

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

export function SuccessMonitoringPanel({ monitoring }: { monitoring: SuccessMonitoring }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Onboarding today" value={String(monitoring.onboardingToday.length)} />
                <Metric label="Active onboarding" value={String(monitoring.activeOnboardingCount)} />
                <Metric label="Completed" value={String(monitoring.completedOnboardingCount)} />
                <Metric
                    label="Avg time-to-value (days)"
                    value={monitoring.avgTimeToValueDays != null ? String(monitoring.avgTimeToValueDays) : "—"}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Daily onboarding dashboard</h3>
                    {monitoring.onboardingToday.length === 0 ? (
                        <EmptyState title="No onboarding activity today" description="CS workflows and CSD automations updated today appear here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {monitoring.onboardingToday.map((row) => (
                                <li key={row.id} className="flex items-center justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span className="text-[var(--dos-text-primary)]">{row.name}</span>
                                    <Badge variant="info">{row.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Activation funnel</h3>
                    {monitoring.funnel.length === 0 ? (
                        <EmptyState title="No funnel data" description="Activation stages derive from onboarding + milestones + adoption." />
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm">
                            {monitoring.funnel.map((stage) => (
                                <li key={stage.stage} className="flex items-center justify-between gap-2">
                                    <span>{stage.stage}</span>
                                    <span className="font-medium">
                                        {stage.count}
                                        {stage.conversionFromPreviousPercent != null
                                            ? ` · ${stage.conversionFromPreviousPercent}%`
                                            : ""}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Time-to-value tracking</h3>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                        Average adoption {monitoring.averageAdoptionPercent != null ? `${monitoring.averageAdoptionPercent}%` : "—"}
                    </p>
                    {monitoring.timeToValue.length === 0 ? (
                        <EmptyState title="No milestones" description="CSD milestone completion drives time-to-value." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {monitoring.timeToValue.map((row) => (
                                <li key={row.id} className="flex justify-between gap-2">
                                    <span>{row.name}</span>
                                    <span>{row.daysToValue != null ? `${row.daysToValue}d` : "in progress"}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Feature adoption metrics</h3>
                    {monitoring.featureAdoption.length === 0 ? (
                        <EmptyState title="No adoption metrics" description="cs_adoption_tracking, csd_adoption_analytics, and saas product adoption feed this list." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {monitoring.featureAdoption.map((row) => (
                                <li key={`${row.feature}-${row.measuredAt}`} className="flex justify-between gap-2">
                                    <span>{row.feature}</span>
                                    <span>{row.adoptionRate}%</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function ReferralEnginePanel({ referrals }: { referrals: ReferralEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Referral leads" value={String(referrals.totalReferralLeads)} />
                <Metric label="Converted" value={String(referrals.convertedReferrals)} />
                <Metric
                    label="Conversion rate"
                    value={referrals.conversionRatePercent != null ? `${referrals.conversionRatePercent}%` : "—"}
                />
                <Metric label="Pending rewards" value={String(referrals.pendingRewards)} />
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Refer-a-business workflow</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {referrals.workflowSteps.map((step) => (
                        <li key={step.step} className="rounded-[var(--dos-radius-md)] bg-[var(--dos-surface-tertiary)] p-3 text-sm">
                            <p className="font-medium text-[var(--dos-text-primary)]">{step.step}</p>
                            <p className="mt-1 text-2xl font-bold">{step.count}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{step.detail}</p>
                        </li>
                    ))}
                </ul>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Referral tracking</h3>
                    {referrals.referrals.length === 0 ? (
                        <EmptyState title="No referral leads" description="Sales leads with source containing “refer” appear here." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {referrals.referrals.map((r) => (
                                <li key={r.id} className="flex items-center justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <div>
                                        <p className="font-medium">{r.name}</p>
                                        <p className="text-xs text-[var(--dos-text-tertiary)]">
                                            {r.company} · {r.email}
                                        </p>
                                    </div>
                                    <Badge variant="info">{r.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Reward management & analytics</h3>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Total reward value {referrals.totalRewardValue}</p>
                    {referrals.rewards.length === 0 ? (
                        <EmptyState title="No rewards" description="Sales commissions and retail reward points power referral rewards." />
                    ) : (
                        <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
                            {referrals.rewards.map((r) => (
                                <li key={r.id} className="flex justify-between gap-2">
                                    <span>
                                        {r.label} · {r.kind}
                                    </span>
                                    <span>
                                        {r.amountOrPoints} · {r.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function TestimonialCenterPanel({ testimonials }: { testimonials: TestimonialCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Review requests" value={String(testimonials.reviewRequests.length)} />
                <Metric label="Success stories" value={String(testimonials.successStories.length)} />
                <Metric label="Case studies" value={String(testimonials.caseStudies.length)} />
                <Metric label="Pending approvals" value={String(testimonials.pendingApprovals)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">In-app review requests</h3>
                    {testimonials.reviewRequests.length === 0 ? (
                        <EmptyState title="No review requests" description="cop_feedback_collection rows drive in-app review inventory." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {testimonials.reviewRequests.map((r) => (
                                <li key={r.id} className="flex justify-between gap-2">
                                    <span>
                                        {r.title} · {r.type}
                                    </span>
                                    <Badge variant="info">{r.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Customer success stories</h3>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                        Avg rating {testimonials.averageRating ?? "—"} · NPS proxy {testimonials.npsProxy ?? "—"}
                    </p>
                    {testimonials.successStories.length === 0 ? (
                        <EmptyState title="No success stories" description="Support satisfaction ratings ≥4 with comments appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {testimonials.successStories.map((s) => (
                                <li key={s.id}>
                                    <p className="font-medium">{s.title}</p>
                                    <p className="text-xs text-[var(--dos-text-tertiary)]">Rating {s.rating}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Case study builder</h3>
                    {testimonials.caseStudies.length === 0 ? (
                        <EmptyState title="No case study templates" description="aage_case_study_templates from the growth engine list here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {testimonials.caseStudies.map((c) => (
                                <li key={c.id} className="flex justify-between gap-2">
                                    <span>
                                        {c.name} · {c.industry}
                                    </span>
                                    <Badge variant="info">{c.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Approval workflow</h3>
                    {testimonials.approvals.length === 0 ? (
                        <EmptyState title="No approvals queued" description="aage_approval_queue items for testimonials/case studies appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {testimonials.approvals.map((a) => (
                                <li key={a.id} className="flex justify-between gap-2">
                                    <span>
                                        {a.title} · {a.contentType}
                                    </span>
                                    <Badge variant="warning">{a.queueStatus}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function CustomerEducationPanel({ education }: { education: CustomerEducation }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Product tours" value={String(education.tours.length)} />
                <Metric label="Videos / tutorials" value={String(education.videos.length)} />
                <Metric label="Knowledge articles" value={String(education.knowledgeBase.length)} />
                <Metric
                    label="Learning progress"
                    value={
                        education.averageLearningProgressPercent != null
                            ? `${education.averageLearningProgressPercent}%`
                            : "—"
                    }
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Interactive product tours</h3>
                    {education.tours.length === 0 ? (
                        <EmptyState title="No tours" description="csd_product_tours power interactive walkthroughs." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {education.tours.map((t) => (
                                <li key={t.id} className="flex justify-between gap-2">
                                    <span>
                                        {t.name} · {t.stepCount} steps
                                    </span>
                                    <Badge variant="info">{t.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Video / tutorial hub</h3>
                    {education.videos.length === 0 ? (
                        <EmptyState title="No videos" description="csd_video_library items list here." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {education.videos.map((v) => (
                                <li key={v.id} className="flex justify-between gap-2">
                                    <span>
                                        {v.title} · {v.category}
                                    </span>
                                    <span>{v.durationMinutes}m</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Knowledge base</h3>
                    {education.knowledgeBase.length === 0 ? (
                        <EmptyState title="No articles" description="csd_knowledge_base_articles appear here." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {education.knowledgeBase.map((k) => (
                                <li key={k.id}>
                                    <p className="font-medium">{k.title}</p>
                                    <p className="text-xs text-[var(--dos-text-tertiary)]">{k.summary}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Onboarding checklists</h3>
                    {education.checklists.length === 0 && education.trainingPortals.length === 0 ? (
                        <EmptyState title="No checklists" description="saas_onboarding_checklists and training portals appear here." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {education.checklists.map((c) => (
                                <li key={c.id} className="flex justify-between gap-2">
                                    <span>
                                        {c.name} · {c.itemCount} items
                                    </span>
                                    <span>{c.completionPercent}%</span>
                                </li>
                            ))}
                            {education.trainingPortals.map((p) => (
                                <li key={p.id} className="flex justify-between gap-2">
                                    <span>
                                        Portal: {p.name} · {p.courseCount} courses
                                    </span>
                                    <Badge variant="info">{p.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function FounderDailyBriefPanel({ brief }: { brief: FounderDailyBrief }) {
    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Daily business summary</h3>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{brief.summary || "No brief summary yet."}</p>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="New orgs today" value={String(brief.newOrganizationsToday)} />
                <Metric label="New orgs (7d)" value={String(brief.newOrganizations7d)} />
                <Metric label="MRR" value={`$${brief.revenueMrrUsd}`} />
                <Metric label="New MRR" value={`$${brief.revenueNewMrrUsd}`} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Open support" value={String(brief.openSupportTickets)} />
                <Metric
                    label="Support satisfaction"
                    value={brief.supportSatisfactionAvg != null ? String(brief.supportSatisfactionAvg) : "—"}
                />
                <Metric
                    label="Product usage"
                    value={brief.productUsageAdoptionPercent != null ? `${brief.productUsageAdoptionPercent}%` : "—"}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Risks requiring attention</h3>
                    {brief.risks.length === 0 ? (
                        <EmptyState title="No open risks" description="CS risk analyses and founder risk register feed this list." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {brief.risks.map((r) => (
                                <li key={r.id} className="flex justify-between gap-2">
                                    <span>{r.title}</span>
                                    <Badge variant="warning">{r.level}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Briefings & insights</h3>
                    {brief.briefingRows.length === 0 && brief.insights.length === 0 ? (
                        <EmptyState title="No briefings" description="cop_executive_briefings and fo_founder_insights appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {brief.briefingRows.map((b) => (
                                <li key={b.id}>
                                    <p className="font-medium">{b.title}</p>
                                    <p className="text-xs text-[var(--dos-text-tertiary)]">{b.summary}</p>
                                </li>
                            ))}
                            {brief.insights.map((i) => (
                                <li key={i.id}>
                                    <p className="font-medium">{i.title}</p>
                                    <p className="text-xs text-[var(--dos-text-tertiary)]">{i.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}
