import type { GocSocialPlatform } from "./constants";

export interface BlogArticleRow {
    id: string;
    title: string;
    contentType: string;
    wordCountTarget: number;
    status: string;
    role: "pillar" | "supporting" | "cluster" | "generator";
}

export interface TopicClusterRow {
    id: string;
    name: string;
    keywordFocus: string;
    searchIntent: string;
    status: string;
}

export interface MetaSeoRow {
    id: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    schemaType: string;
}

export interface FaqRow {
    id: string;
    question: string;
    category: string;
    answerRef: string;
    status: string;
}

export interface InternalLinkSuggestion {
    fromId: string;
    fromTitle: string;
    toId: string;
    toTitle: string;
    reason: string;
}

export interface AiBlogStudio {
    articles: BlogArticleRow[];
    topicClusters: TopicClusterRow[];
    pillarPages: BlogArticleRow[];
    supportingArticles: BlogArticleRow[];
    internalLinks: InternalLinkSuggestion[];
    meta: MetaSeoRow[];
    faqs: FaqRow[];
    schemaReadyCount: number;
}

export interface LandingPageRow {
    id: string;
    name: string;
    pageType: string;
    seoFocus: string;
    status: string;
    kind: "product" | "industry" | "campaign" | "case_study" | "other";
}

export interface ConversionCopyRow {
    id: string;
    name: string;
    ctaType: string;
    conversionGoal: string;
    status: string;
}

export interface LandingPageGenerator {
    pages: LandingPageRow[];
    productPages: LandingPageRow[];
    industryPages: LandingPageRow[];
    campaignPages: LandingPageRow[];
    caseStudyPages: LandingPageRow[];
    conversionCopy: ConversionCopyRow[];
}

export interface SocialPostRow {
    id: string;
    name: string;
    platform: GocSocialPlatform | string;
    postType: string;
    tone: string;
    status: string;
}

export interface SocialContentEngine {
    posts: SocialPostRow[];
    byPlatform: Array<{ platform: string; count: number }>;
    youtubeDescriptions: SocialPostRow[];
}

export interface EmailSequenceRow {
    id: string;
    name: string;
    campaignType: string;
    subjectLine: string;
    status: string;
    sequenceKind: "welcome" | "product_update" | "newsletter" | "reengagement" | "nurture" | "other";
}

export interface EmailContent {
    sequences: EmailSequenceRow[];
    welcome: EmailSequenceRow[];
    productUpdates: EmailSequenceRow[];
    newsletters: EmailSequenceRow[];
    reengagement: EmailSequenceRow[];
    nurturing: EmailSequenceRow[];
}

export interface BrandVoiceRow {
    id: string;
    name: string;
    tone: string;
    style: string;
    formality: string;
    status: string;
}

export interface ApprovedMessageRow {
    id: string;
    title: string;
    type: string;
    audience: string;
    status: string;
}

export interface TerminologyRow {
    id: string;
    name: string;
    version: string;
    category: string;
    status: string;
}

export interface DuplicateSignal {
    id: string;
    leftTitle: string;
    rightTitle: string;
    similarity: number;
}

export interface ApprovalQueueRow {
    id: string;
    title: string;
    contentType: string;
    approverRef: string;
    status: string;
}

export interface BrandCompliance {
    voices: BrandVoiceRow[];
    terminology: TerminologyRow[];
    approvedMessaging: ApprovedMessageRow[];
    qualityScore: number | null;
    duplicates: DuplicateSignal[];
    approvalQueue: ApprovalQueueRow[];
    pendingApprovals: number;
}

export interface KeywordClusterRow {
    id: string;
    name: string;
    keywordFocus: string;
    searchIntent: string;
    cluster: string;
    status: string;
}

export interface SeoRecommendation {
    id: string;
    target: string;
    recommendation: string;
    priority: "high" | "medium" | "low";
}

export interface SeoIntelligence {
    keywordClusters: KeywordClusterRow[];
    intentBreakdown: Array<{ intent: string; count: number }>;
    readabilityScore: number | null;
    contentScore: number | null;
    recommendations: SeoRecommendation[];
}

export interface GrowthOsContentSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    blog: AiBlogStudio;
    landing: LandingPageGenerator;
    social: SocialContentEngine;
    email: EmailContent;
    compliance: BrandCompliance;
    seo: SeoIntelligence;
}

export interface GrowthOsContentRawData {
    organizationId: string;
    membershipRole: string | null;
    blogTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        word_count_target: number;
        content_type: string;
        status: string;
    }>;
    blogGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        topic_category: string;
        word_count: number;
        status: string;
    }>;
    websiteTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        page_type: string;
        seo_focus: string;
        status: string;
    }>;
    caseStudyTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        industry: string;
        outcome_type: string;
        status: string;
    }>;
    seoAssistants: Array<{
        id: string;
        assistant_name: string;
        assistant_status: string;
        keyword_focus: string;
        search_intent: string;
        status: string;
    }>;
    ideaGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        content_type: string;
        output_format: string;
        status: string;
    }>;
    faqs: Array<{
        id: string;
        faq_question: string;
        faq_category: string;
        answer_ref: string;
        faq_status: string;
        status: string;
    }>;
    ctaGenerators: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        cta_type: string;
        conversion_goal: string;
        status: string;
    }>;
    industries: Array<{
        id: string;
        industry_name: string;
        vertical: string;
        segment: string;
        status: string;
    }>;
    campaignBuilders: Array<{
        id: string;
        builder_name: string;
        builder_status: string;
        campaign_type: string;
        asset_count: number;
        status: string;
    }>;
    socialTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        platform: string;
        post_type: string;
        status: string;
    }>;
    captions: Array<{
        id: string;
        generator_name: string;
        generator_status: string;
        platform: string;
        tone: string;
        status: string;
    }>;
    youtubeTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        video_format: string;
        duration_seconds: number;
        status: string;
    }>;
    channels: Array<{
        id: string;
        channel_name: string;
        channel_status: string;
        platform: string;
        post_type: string;
        status: string;
    }>;
    emailTemplates: Array<{
        id: string;
        template_name: string;
        template_status: string;
        campaign_type: string;
        subject_line: string;
        status: string;
    }>;
    brandVoice: Array<{
        id: string;
        voice_name: string;
        voice_tone: string;
        voice_style: string;
        formality_level: string;
        status: string;
    }>;
    brandGuidelines: Array<{
        id: string;
        guideline_name: string;
        guideline_category: string;
        version: string;
        guideline_status: string;
        status: string;
    }>;
    brandRulebook: Array<{
        id: string;
        rulebook_name: string;
        rulebook_version: string;
        rulebook_status: string;
        status: string;
    }>;
    messaging: Array<{
        id: string;
        messaging_title: string;
        messaging_type: string;
        audience_segment: string;
        messaging_status: string;
        status: string;
    }>;
    messagingLibrary: Array<{
        id: string;
        message_title: string;
        message_type: string;
        audience_segment: string;
        message_status: string;
        status: string;
    }>;
    approvalQueue: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        approver_ref: string;
        queue_status: string;
        status: string;
    }>;
    approvalCenter: Array<{
        id: string;
        approval_title: string;
        content_type: string;
        approver_ref: string;
        approval_status: string;
        status: string;
    }>;
    growthMetrics: Array<{
        overall_growth_score: number;
        brand_health_score: number;
        marketing_overview_score: number;
        content_calendar_count: number;
    }>;
    contentPerformance: Array<{
        id: string;
        performance_title: string;
        performance_score: number;
        content_type: string;
    }>;
    drafts: Array<{
        id: string;
        queue_title: string;
        content_type: string;
        queue_status: string;
        status: string;
    }>;
}
