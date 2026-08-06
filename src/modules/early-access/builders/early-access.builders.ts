import type {
    CustomerSuccessConsole,
    EarlyAccessManagement,
    EarlyAccessRawData,
    EarlyAccessSnapshot,
    FeedbackSystem,
    FounderMonitoring,
    ReleaseManagement,
} from "../types";
import { earlyAccessDeniedMessage } from "../access";

function isPending(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("pending") || s.includes("invited") || s.includes("sent") || s.includes("await") || s === "open";
}

function isFailed(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("fail") || s.includes("stuck") || s.includes("blocked") || s.includes("abandoned");
}

function isWaitlistStatus(status: string, source: string): boolean {
    const s = `${status} ${source}`.toLowerCase();
    return s.includes("wait") || s.includes("queue") || s.includes("new") || s.includes("lead") || s.includes("inbound");
}

export function createEmptyEarlyAccessSnapshot(accessGranted: boolean, reason?: string): EarlyAccessSnapshot {
    const now = new Date().toISOString();
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason: reason,
        fetchedAt: now,
        management: {
            invites: [],
            waitlist: [],
            inviteCodes: [],
            organizationApprovals: [],
            founderNotes: [],
            pendingInviteCount: 0,
            pendingApprovalCount: 0,
        },
        success: {
            firstLogins: [],
            onboarding: [],
            onboardingCompletionRate: null,
            featureAdoption: [],
            healthTimeline: [],
            successTasks: [],
            failedOnboardingCount: 0,
        },
        feedback: {
            inAppFeedback: [],
            nps: { score: null, responses: 0, averageRating: null },
            bugReports: [],
            featureRequests: [],
            sessionFeedback: [],
        },
        monitoring: {
            liveActivity: [],
            newOrganizationAlerts: [],
            failedOnboardingAlerts: [],
            dailyExecutiveSummary: "No live Early Access signals yet.",
            briefings: [],
        },
        releases: {
            changelog: [],
            releaseNotes: [],
            hotfixLog: [],
            incidentLog: [],
        },
    };
}

export function buildEarlyAccessManagement(data: EarlyAccessRawData): EarlyAccessManagement {
    const invites = [
        ...data.betaInvites.map((i) => ({
            id: i.id,
            email: i.invitee_email,
            code: i.invitation_key,
            status: i.invitation_status || i.status,
            source: "beta" as const,
            cohort: i.cohort_ref,
            sentAt: i.sent_at,
        })),
        ...data.orgInvites.map((i) => ({
            id: i.id,
            email: i.email,
            code: i.id.slice(0, 8).toUpperCase(),
            status: i.status,
            source: "organization" as const,
            sentAt: i.created_at,
        })),
        ...data.idpInvites.map((i) => ({
            id: i.id,
            email: i.email,
            code: i.invitation_key,
            status: i.status,
            source: "identity" as const,
            sentAt: i.created_at,
        })),
    ].sort((a, b) => Date.parse(b.sentAt) - Date.parse(a.sentAt));

    const waitlist = data.salesLeads
        .filter((l) => isWaitlistStatus(l.status, l.source))
        .map((l) => ({
            id: l.id,
            name: l.lead_name,
            email: l.email,
            source: l.source || "sales",
            status: l.status,
            score: l.score,
            createdAt: l.created_at,
        }))
        .slice(0, 50);

    const inviteCodes = invites
        .filter((i) => Boolean(i.code))
        .map((i) => ({ code: i.code, email: i.email, status: i.status, source: i.source }));

    const organizationApprovals = data.betaOrgs.map((o) => ({
        id: o.id,
        name: o.org_name,
        betaStatus: o.beta_status,
        cohort: o.cohort_ref,
        enrolledAt: o.enrolled_at ?? null,
        status: o.status,
    }));

    const founderNotes = data.founderInsights.map((n) => ({
        id: n.id,
        title: n.title,
        type: n.insight_type,
        content: n.content,
        confidence: n.confidence_score,
        status: n.status,
        createdAt: n.created_at,
    }));

    return {
        invites: invites.slice(0, 80),
        waitlist,
        inviteCodes: inviteCodes.slice(0, 80),
        organizationApprovals,
        founderNotes: founderNotes.slice(0, 40),
        pendingInviteCount: invites.filter((i) => isPending(i.status)).length,
        pendingApprovalCount: organizationApprovals.filter((o) => isPending(o.betaStatus) || isPending(o.status)).length,
    };
}

export function buildCustomerSuccessConsole(data: EarlyAccessRawData): CustomerSuccessConsole {
    const firstLogins = data.activityLogs
        .filter((a) => {
            const hay = `${a.action} ${a.title}`.toLowerCase();
            return hay.includes("login") || hay.includes("sign_in") || hay.includes("signed in") || hay.includes("first");
        })
        .map((a) => ({
            id: a.id,
            title: a.title || a.action,
            detail: a.detail,
            at: a.created_at,
        }))
        .slice(0, 30);

    const onboarding = data.onboardingWorkflows.map((w) => ({
        id: w.id,
        name: w.name,
        status: w.status,
        updatedAt: w.updated_at,
    }));

    const failedOnboardingCount = onboarding.filter((o) => isFailed(o.status)).length;
    const completed = onboarding.filter((o) => o.status.toLowerCase().includes("complete") || o.status.toLowerCase().includes("done")).length;
    const fromMetrics = data.operatedMetrics[0]?.onboarding_completion_rate;
    const onboardingCompletionRate =
        fromMetrics != null
            ? Math.round(Number(fromMetrics) * (Number(fromMetrics) <= 1 ? 100 : 1) * 10) / 10
            : onboarding.length
              ? Math.round((completed / onboarding.length) * 1000) / 10
              : null;

    const featureAdoption = data.adoption
        .map((a) => ({
            id: a.id,
            name: a.name,
            percent: a.adoption_percent,
            status: a.status,
        }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 30);

    const healthTimeline = [
        ...data.healthScores.map((h) => ({
            id: h.id,
            name: h.name,
            score: h.overall_score,
            status: h.status,
            at: h.updated_at || h.created_at,
        })),
        ...data.operatedHealth.map((h, idx) => ({
            id: `ops-health-${idx}-${h.health_date}`,
            name: "Operated health",
            score: h.overall_score,
            status: h.onboarding_status,
            at: h.health_date,
        })),
    ]
        .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
        .slice(0, 40);

    const successTasks = data.onboardingTasks.map((t) => ({
        id: t.id,
        title: t.title || t.name || "Onboarding task",
        status: t.status,
        planId: t.plan_id,
        updatedAt: t.updated_at || t.created_at,
    }));

    return {
        firstLogins,
        onboarding,
        onboardingCompletionRate,
        featureAdoption,
        healthTimeline,
        successTasks: successTasks.slice(0, 50),
        failedOnboardingCount,
    };
}

export function buildFeedbackSystem(data: EarlyAccessRawData): FeedbackSystem {
    const inAppFeedback = data.feedback.map((f) => ({
        id: f.id,
        title: f.feedback_title,
        type: f.feedback_type,
        rating: f.rating,
        status: f.status,
        at: f.collected_at,
    }));

    const sessionFeedback = inAppFeedback.filter((f) => f.type.toLowerCase().includes("session") || f.type.toLowerCase().includes("nps"));

    const sat = data.satisfaction;
    const averageRating = sat.length ? Math.round((sat.reduce((s, r) => s + r.rating, 0) / sat.length) * 10) / 10 : null;
    const npsScore =
        sat.length > 0
            ? Math.round(((sat.filter((r) => r.rating >= 4).length - sat.filter((r) => r.rating <= 2).length) / sat.length) * 100)
            : inAppFeedback.filter((f) => f.rating != null).length
              ? Math.round(
                    ((inAppFeedback.filter((f) => (f.rating ?? 0) >= 4).length - inAppFeedback.filter((f) => (f.rating ?? 0) <= 2).length) /
                        inAppFeedback.length) *
                        100,
                )
              : null;

    return {
        inAppFeedback: inAppFeedback.slice(0, 50),
        nps: { score: npsScore, responses: sat.length || inAppFeedback.length, averageRating },
        bugReports: data.bugs.map((b) => ({
            id: b.id,
            title: b.bug_title,
            severity: b.severity,
            status: b.bug_status || b.status,
            at: b.reported_at,
        })),
        featureRequests: data.featureRequests.map((r) => ({
            id: r.id,
            title: r.request_title,
            priority: r.priority,
            status: r.request_status || r.status,
            at: r.submitted_at,
        })),
        sessionFeedback: sessionFeedback.slice(0, 30),
    };
}

export function buildFounderMonitoring(
    data: EarlyAccessRawData,
    success: CustomerSuccessConsole,
    management: EarlyAccessManagement,
): FounderMonitoring {
    const liveActivity = data.activityLogs.slice(0, 40).map((a) => ({
        id: a.id,
        title: a.title,
        action: a.action,
        detail: a.detail,
        at: a.created_at,
    }));

    const cutoff7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newOrganizationAlerts = [
        ...data.organizations
            .filter((o) => Date.parse(o.created_at) >= cutoff7)
            .map((o) => ({ id: o.id, name: o.name, at: o.created_at, status: o.status })),
        ...data.betaOrgs
            .filter((o) => Date.parse(o.created_at) >= cutoff7)
            .map((o) => ({ id: o.id, name: o.org_name, at: o.created_at, status: o.beta_status })),
    ].slice(0, 20);

    const failedOnboardingAlerts = success.onboarding
        .filter((o) => isFailed(o.status))
        .map((o) => ({ id: o.id, name: o.name, status: o.status, at: o.updatedAt }));

    const briefings = data.briefings.map((b) => ({
        id: b.id,
        title: b.briefing_title,
        type: b.briefing_type,
        summary: b.summary,
        at: b.briefing_date,
    }));

    const dailyExecutiveSummary =
        briefings.find((b) => b.type.toLowerCase().includes("daily"))?.summary ||
        [
            `Early Access: ${management.pendingInviteCount} pending invites, ${management.pendingApprovalCount} org approvals.`,
            `Onboarding completion ${success.onboardingCompletionRate ?? "n/a"}% · failed ${success.failedOnboardingCount}.`,
            `New orgs (7d): ${newOrganizationAlerts.length}. Live activity samples: ${liveActivity.length}.`,
            briefings[0] ? `Latest briefing: ${briefings[0].title}.` : "No executive briefing rows yet.",
        ].join(" ");

    return {
        liveActivity,
        newOrganizationAlerts,
        failedOnboardingAlerts,
        dailyExecutiveSummary,
        briefings: briefings.slice(0, 20),
    };
}

export function buildReleaseManagement(data: EarlyAccessRawData): ReleaseManagement {
    const releaseNotes = data.releaseNotes.map((n) => ({
        id: n.id,
        version: n.version_ref,
        summary: n.note_summary,
        status: n.status,
        at: n.published_at || n.created_at,
    }));

    const changelog = [
        ...data.releaseNotes.map((n) => ({
            id: n.id,
            version: n.version_ref,
            summary: n.note_summary,
            publishedAt: n.published_at ?? null,
            status: n.status,
        })),
        ...data.releaseChannels.map((c) => ({
            id: c.id,
            version: c.release_version,
            summary: `${c.channel_name} · ${c.channel_status}`,
            publishedAt: c.published_at ?? null,
            status: c.status,
        })),
    ].slice(0, 40);

    const hotfixLog = data.deploymentPlans
        .map((d) => ({
            id: d.id,
            name: d.plan_name,
            version: d.target_version,
            strategy: d.deployment_strategy,
            status: d.status,
            at: d.scheduled_at || d.created_at,
        }))
        .sort((a, b) => {
            const ah = /hotfix|patch|emergency/i.test(`${a.strategy} ${a.name}`) ? 0 : 1;
            const bh = /hotfix|patch|emergency/i.test(`${b.strategy} ${b.name}`) ? 0 : 1;
            return ah - bh || Date.parse(b.at) - Date.parse(a.at);
        })
        .slice(0, 30);

    const incidentLog = [
        ...data.criticalIssues.map((i) => ({
            id: i.id,
            title: i.issue_title,
            severity: i.issue_severity,
            summary: i.issue_summary,
            at: i.detected_at,
            status: i.status,
        })),
        ...data.launchFailures.map((f) => ({
            id: f.id,
            title: f.failure_type,
            severity: "high",
            summary: f.error_message,
            at: f.failed_at,
            status: f.status,
        })),
        ...data.platformFailures.map((f) => ({
            id: f.id,
            title: String(f.failure_title ?? f.failure_type ?? "Failure"),
            severity: "high",
            summary: String(f.failure_type ?? ""),
            at: f.created_at,
            status: f.status,
        })),
    ]
        .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
        .slice(0, 40);

    return { changelog, releaseNotes, hotfixLog, incidentLog };
}

export function buildEarlyAccessSnapshot(data: EarlyAccessRawData): EarlyAccessSnapshot {
    const management = buildEarlyAccessManagement(data);
    const success = buildCustomerSuccessConsole(data);
    const feedback = buildFeedbackSystem(data);
    const monitoring = buildFounderMonitoring(data, success, management);
    const releases = buildReleaseManagement(data);

    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: data.fetchedAt,
        management,
        success,
        feedback,
        monitoring,
        releases,
    };
}

export { earlyAccessDeniedMessage };
