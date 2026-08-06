export interface InviteRow {
    id: string;
    email: string;
    code: string;
    status: string;
    source: "beta" | "organization" | "identity";
    cohort?: string;
    sentAt: string;
}

export interface WaitlistRow {
    id: string;
    name: string;
    email: string;
    source: string;
    status: string;
    score: number;
    createdAt: string;
}

export interface OrgApprovalRow {
    id: string;
    name: string;
    betaStatus: string;
    cohort: string;
    enrolledAt: string | null;
    status: string;
}

export interface FounderNoteRow {
    id: string;
    title: string;
    type: string;
    content: string;
    confidence: number;
    status: string;
    createdAt: string;
}

export interface EarlyAccessManagement {
    invites: InviteRow[];
    waitlist: WaitlistRow[];
    inviteCodes: Array<{ code: string; email: string; status: string; source: string }>;
    organizationApprovals: OrgApprovalRow[];
    founderNotes: FounderNoteRow[];
    pendingInviteCount: number;
    pendingApprovalCount: number;
}

export interface OnboardingRow {
    id: string;
    name: string;
    status: string;
    updatedAt: string;
}

export interface AdoptionRow {
    id: string;
    name: string;
    percent: number;
    status: string;
}

export interface HealthTimelineRow {
    id: string;
    name: string;
    score: number;
    status: string;
    at: string;
}

export interface SuccessTaskRow {
    id: string;
    title: string;
    status: string;
    planId?: string;
    updatedAt: string;
}

export interface CustomerSuccessConsole {
    firstLogins: Array<{ id: string; title: string; detail: string; at: string }>;
    onboarding: OnboardingRow[];
    onboardingCompletionRate: number | null;
    featureAdoption: AdoptionRow[];
    healthTimeline: HealthTimelineRow[];
    successTasks: SuccessTaskRow[];
    failedOnboardingCount: number;
}

export interface FeedbackRow {
    id: string;
    title: string;
    type: string;
    rating: number | null;
    status: string;
    at: string;
}

export interface FeedbackSystem {
    inAppFeedback: FeedbackRow[];
    nps: { score: number | null; responses: number; averageRating: number | null };
    bugReports: Array<{ id: string; title: string; severity: string; status: string; at: string }>;
    featureRequests: Array<{ id: string; title: string; priority: string; status: string; at: string }>;
    sessionFeedback: FeedbackRow[];
}

export interface FounderMonitoring {
    liveActivity: Array<{ id: string; title: string; action: string; detail: string; at: string }>;
    newOrganizationAlerts: Array<{ id: string; name: string; at: string; status: string }>;
    failedOnboardingAlerts: Array<{ id: string; name: string; status: string; at: string }>;
    dailyExecutiveSummary: string;
    briefings: Array<{ id: string; title: string; type: string; summary: string; at: string }>;
}

export interface ReleaseManagement {
    changelog: Array<{ id: string; version: string; summary: string; publishedAt: string | null; status: string }>;
    releaseNotes: Array<{ id: string; version: string; summary: string; status: string; at: string }>;
    hotfixLog: Array<{ id: string; name: string; version: string; strategy: string; status: string; at: string }>;
    incidentLog: Array<{ id: string; title: string; severity: string; summary: string; at: string; status: string }>;
}

export interface EarlyAccessSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    management: EarlyAccessManagement;
    success: CustomerSuccessConsole;
    feedback: FeedbackSystem;
    monitoring: FounderMonitoring;
    releases: ReleaseManagement;
}

export interface EarlyAccessRawData {
    organizationId: string;
    membershipRole: string | null;
    betaInvites: Array<{
        id: string;
        invitation_key: string;
        invitee_email: string;
        invitation_status: string;
        cohort_ref: string;
        sent_at: string;
        status: string;
    }>;
    orgInvites: Array<{
        id: string;
        email: string;
        role_name: string;
        status: string;
        expires_at: string;
        created_at: string;
    }>;
    idpInvites: Array<{
        id: string;
        invitation_key: string;
        email: string;
        status: string;
        role_name: string;
        created_at: string;
        expires_at: string;
    }>;
    betaOrgs: Array<{
        id: string;
        org_name: string;
        beta_status: string;
        cohort_ref: string;
        enrolled_at?: string | null;
        status: string;
        created_at: string;
    }>;
    organizations: Array<{ id: string; name: string; status: string; created_at: string }>;
    salesLeads: Array<{
        id: string;
        lead_name: string;
        email: string;
        source: string;
        status: string;
        score: number;
        created_at: string;
    }>;
    founderInsights: Array<{
        id: string;
        title: string;
        insight_type: string;
        content: string;
        confidence_score: number;
        status: string;
        created_at: string;
    }>;
    activityLogs: Array<{
        id: string;
        action: string;
        title: string;
        detail: string;
        created_at: string;
    }>;
    onboardingWorkflows: Array<{ id: string; name: string; status: string; updated_at: string; created_at: string }>;
    adoption: Array<{ id: string; name: string; adoption_percent: number; status: string }>;
    healthScores: Array<{ id: string; name: string; overall_score: number; status: string; updated_at: string; created_at: string }>;
    onboardingTasks: Array<{ id: string; title?: string; name?: string; status: string; plan_id?: string; updated_at: string; created_at: string }>;
    operatedMetrics: Array<{ onboarding_completion_rate: number; metric_date: string }>;
    operatedHealth: Array<{ overall_score: number; onboarding_status: string; summary: string; health_date: string }>;
    feedback: Array<{
        id: string;
        feedback_title: string;
        feedback_type: string;
        rating: number;
        collected_at: string;
        status: string;
    }>;
    satisfaction: Array<{ rating: number; submitted_at: string }>;
    bugs: Array<{ id: string; bug_title: string; severity: string; bug_status: string; reported_at: string; status: string }>;
    featureRequests: Array<{
        id: string;
        request_title: string;
        priority: string;
        request_status: string;
        submitted_at: string;
        status: string;
    }>;
    briefings: Array<{
        id: string;
        briefing_title: string;
        briefing_type: string;
        summary: string;
        briefing_date: string;
        status: string;
    }>;
    releaseNotes: Array<{
        id: string;
        version_ref: string;
        note_summary: string;
        change_log: Record<string, unknown>;
        published_at?: string | null;
        status: string;
        created_at: string;
    }>;
    releaseChannels: Array<{
        id: string;
        channel_name: string;
        release_version: string;
        channel_status: string;
        published_at?: string | null;
        status: string;
    }>;
    deploymentPlans: Array<{
        id: string;
        plan_name: string;
        target_version: string;
        deployment_strategy: string;
        status: string;
        scheduled_at?: string | null;
        created_at: string;
    }>;
    criticalIssues: Array<{
        id: string;
        issue_title: string;
        issue_severity: string;
        issue_summary: string;
        detected_at: string;
        status: string;
    }>;
    launchFailures: Array<{
        id: string;
        failure_type: string;
        error_message: string;
        failed_at: string;
        status: string;
    }>;
    platformFailures: Array<{
        id: string;
        failure_title?: string;
        failure_type?: string;
        status: string;
        created_at: string;
        [key: string]: unknown;
    }>;
    fetchedAt: string;
}
