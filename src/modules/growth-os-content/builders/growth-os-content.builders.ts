import { GOC_SOCIAL_PLATFORMS } from "../constants";
import type {
    AiBlogStudio,
    BrandCompliance,
    EmailContent,
    GrowthOsContentRawData,
    GrowthOsContentSnapshot,
    LandingPageGenerator,
    LandingPageRow,
    SeoIntelligence,
    SocialContentEngine,
    SocialPostRow,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function normalizePlatform(platform: string): string {
    const p = platform.toLowerCase().trim();
    if (p === "twitter" || p === "x.com") return "x";
    if (p.includes("linked")) return "linkedin";
    if (p.includes("insta")) return "instagram";
    if (p.includes("face")) return "facebook";
    if (p.includes("thread")) return "threads";
    if (p.includes("you")) return "youtube";
    return p || "other";
}

function classifyLandingKind(pageType: string, name: string): LandingPageRow["kind"] {
    const s = `${pageType} ${name}`.toLowerCase();
    if (s.includes("case")) return "case_study";
    if (s.includes("campaign") || s.includes("launch")) return "campaign";
    if (s.includes("industr") || s.includes("vertical")) return "industry";
    if (s.includes("product") || s.includes("platform") || s.includes("service")) return "product";
    return "other";
}

function classifyEmailKind(campaignType: string, name: string): EmailContent["sequences"][number]["sequenceKind"] {
    const s = `${campaignType} ${name}`.toLowerCase();
    if (s.includes("welcome") || s.includes("onboard")) return "welcome";
    if (s.includes("update") || s.includes("release") || s.includes("product")) return "product_update";
    if (s.includes("news") || s.includes("digest")) return "newsletter";
    if (s.includes("re-engag") || s.includes("reengag") || s.includes("winback") || s.includes("dormant")) {
        return "reengagement";
    }
    if (s.includes("nurtur") || s.includes("lead") || s.includes("drip")) return "nurture";
    return "other";
}

function classifyBlogRole(
    contentType: string,
    name: string,
    wordCount: number,
): AiBlogStudio["articles"][number]["role"] {
    const s = `${contentType} ${name}`.toLowerCase();
    if (s.includes("pillar") || wordCount >= 2000) return "pillar";
    if (s.includes("cluster") || s.includes("topic")) return "cluster";
    if (s.includes("support") || s.includes("spoke")) return "supporting";
    return "generator";
}

function tokenize(text: string): Set<string> {
    return new Set(
        text
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((t) => t.length > 2),
    );
}

/** Jaccard similarity on live title tokens — duplicate signal without mock content. */
export function titleSimilarity(a: string, b: string): number {
    const left = tokenize(a);
    const right = tokenize(b);
    if (!left.size || !right.size) return 0;
    let inter = 0;
    for (const t of left) if (right.has(t)) inter += 1;
    const union = left.size + right.size - inter;
    return union === 0 ? 0 : Math.round((inter / union) * 1000) / 1000;
}

function clusterKey(keywordFocus: string, searchIntent: string): string {
    const tokens = [...tokenize(keywordFocus)].slice(0, 3).join("-") || "general";
    return `${searchIntent || "informational"}::${tokens}`;
}

function buildMetaDescription(title: string, focus: string): string {
    const base = focus.trim() || title.trim();
    const clipped = base.length > 150 ? `${base.slice(0, 147)}…` : base;
    return clipped || "Enterprise automation content from Arjun Automation.";
}

function buildMetaTitle(title: string, focus: string): string {
    const primary = focus.trim() || title.trim();
    return primary.length > 60 ? `${primary.slice(0, 57)}…` : primary;
}

export const gocPure = {
    avg,
    normalizePlatform,
    classifyLandingKind,
    classifyEmailKind,
    classifyBlogRole,
    titleSimilarity,
    clusterKey,
    buildMetaTitle,
    buildMetaDescription,
};

export function buildAiBlogStudio(data: GrowthOsContentRawData): AiBlogStudio {
    const fromTemplates = data.blogTemplates.map((t) => ({
        id: t.id,
        title: t.template_name,
        contentType: t.content_type,
        wordCountTarget: t.word_count_target,
        status: t.template_status || t.status,
        role: classifyBlogRole(t.content_type, t.template_name, t.word_count_target),
    }));
    const fromGenerators = data.blogGenerators.map((g) => ({
        id: g.id,
        title: g.generator_name,
        contentType: g.topic_category,
        wordCountTarget: g.word_count,
        status: g.generator_status || g.status,
        role: classifyBlogRole(g.topic_category, g.generator_name, g.word_count),
    }));
    const articles = [...fromTemplates, ...fromGenerators];
    const topicClusters = data.seoAssistants.map((s) => ({
        id: s.id,
        name: s.assistant_name,
        keywordFocus: s.keyword_focus,
        searchIntent: s.search_intent,
        status: s.assistant_status || s.status,
    }));
    const pillarPages = articles.filter((a) => a.role === "pillar");
    const supportingArticles = articles.filter((a) => a.role === "supporting" || a.role === "cluster");

    const internalLinks: AiBlogStudio["internalLinks"] = [];
    for (let i = 0; i < Math.min(articles.length, 12); i += 1) {
        for (let j = i + 1; j < Math.min(articles.length, 12); j += 1) {
            const sim = titleSimilarity(articles[i].title, articles[j].title);
            if (sim >= 0.2) {
                internalLinks.push({
                    fromId: articles[i].id,
                    fromTitle: articles[i].title,
                    toId: articles[j].id,
                    toTitle: articles[j].title,
                    reason: `Shared topic signals (${Math.round(sim * 100)}% token overlap)`,
                });
            }
        }
    }

    const meta = [
        ...data.websiteTemplates.map((w) => ({
            id: w.id,
            title: w.template_name,
            metaTitle: buildMetaTitle(w.template_name, w.seo_focus),
            metaDescription: buildMetaDescription(w.template_name, w.seo_focus),
            schemaType: "Article",
        })),
        ...data.blogTemplates.map((b) => ({
            id: b.id,
            title: b.template_name,
            metaTitle: buildMetaTitle(b.template_name, b.content_type),
            metaDescription: buildMetaDescription(b.template_name, b.content_type),
            schemaType: "BlogPosting",
        })),
    ];

    const faqs = data.faqs.map((f) => ({
        id: f.id,
        question: f.faq_question,
        category: f.faq_category,
        answerRef: f.answer_ref,
        status: f.faq_status || f.status,
    }));

    return {
        articles,
        topicClusters,
        pillarPages,
        supportingArticles,
        internalLinks,
        meta,
        faqs,
        schemaReadyCount: meta.filter((m) => Boolean(m.metaTitle && m.metaDescription)).length,
    };
}

export function buildLandingPageGenerator(data: GrowthOsContentRawData): LandingPageGenerator {
    const fromWebsite = data.websiteTemplates.map((w) => ({
        id: w.id,
        name: w.template_name,
        pageType: w.page_type,
        seoFocus: w.seo_focus,
        status: w.template_status || w.status,
        kind: classifyLandingKind(w.page_type, w.template_name),
    }));
    const fromCase = data.caseStudyTemplates.map((c) => ({
        id: c.id,
        name: c.template_name,
        pageType: c.outcome_type || "case_study",
        seoFocus: c.industry,
        status: c.template_status || c.status,
        kind: "case_study" as const,
    }));
    const fromIndustry = data.industries.map((i) => ({
        id: i.id,
        name: i.industry_name,
        pageType: i.vertical,
        seoFocus: i.segment,
        status: i.status,
        kind: "industry" as const,
    }));
    const fromCampaign = data.campaignBuilders.map((c) => ({
        id: c.id,
        name: c.builder_name,
        pageType: c.campaign_type,
        seoFocus: `${c.asset_count} assets`,
        status: c.builder_status || c.status,
        kind: "campaign" as const,
    }));
    const pages = [...fromWebsite, ...fromCase, ...fromIndustry, ...fromCampaign];
    return {
        pages,
        productPages: pages.filter((p) => p.kind === "product"),
        industryPages: pages.filter((p) => p.kind === "industry"),
        campaignPages: pages.filter((p) => p.kind === "campaign"),
        caseStudyPages: pages.filter((p) => p.kind === "case_study"),
        conversionCopy: data.ctaGenerators.map((c) => ({
            id: c.id,
            name: c.generator_name,
            ctaType: c.cta_type,
            conversionGoal: c.conversion_goal,
            status: c.generator_status || c.status,
        })),
    };
}

export function buildSocialContentEngine(data: GrowthOsContentRawData): SocialContentEngine {
    const posts: SocialPostRow[] = [
        ...data.socialTemplates.map((s) => ({
            id: s.id,
            name: s.template_name,
            platform: normalizePlatform(s.platform),
            postType: s.post_type,
            tone: "platform-native",
            status: s.template_status || s.status,
        })),
        ...data.captions.map((c) => ({
            id: c.id,
            name: c.generator_name,
            platform: normalizePlatform(c.platform),
            postType: "caption",
            tone: c.tone,
            status: c.generator_status || c.status,
        })),
        ...data.channels.map((c) => ({
            id: c.id,
            name: c.channel_name,
            platform: normalizePlatform(c.platform),
            postType: c.post_type,
            tone: "channel",
            status: c.channel_status || c.status,
        })),
        ...data.youtubeTemplates.map((y) => ({
            id: y.id,
            name: y.template_name,
            platform: "youtube" as const,
            postType: y.video_format,
            tone: `duration:${y.duration_seconds}s`,
            status: y.template_status || y.status,
        })),
    ];

    const byPlatform = GOC_SOCIAL_PLATFORMS.map((platform) => ({
        platform,
        count: posts.filter((p) => normalizePlatform(String(p.platform)) === platform).length,
    }));

    return {
        posts,
        byPlatform,
        youtubeDescriptions: posts.filter((p) => normalizePlatform(String(p.platform)) === "youtube"),
    };
}

export function buildEmailContent(data: GrowthOsContentRawData): EmailContent {
    const sequences = data.emailTemplates.map((e) => ({
        id: e.id,
        name: e.template_name,
        campaignType: e.campaign_type,
        subjectLine: e.subject_line,
        status: e.template_status || e.status,
        sequenceKind: classifyEmailKind(e.campaign_type, e.template_name),
    }));
    return {
        sequences,
        welcome: sequences.filter((s) => s.sequenceKind === "welcome"),
        productUpdates: sequences.filter((s) => s.sequenceKind === "product_update"),
        newsletters: sequences.filter((s) => s.sequenceKind === "newsletter"),
        reengagement: sequences.filter((s) => s.sequenceKind === "reengagement"),
        nurturing: sequences.filter((s) => s.sequenceKind === "nurture"),
    };
}

export function buildBrandCompliance(data: GrowthOsContentRawData): BrandCompliance {
    const voices = data.brandVoice.map((v) => ({
        id: v.id,
        name: v.voice_name,
        tone: v.voice_tone,
        style: v.voice_style,
        formality: v.formality_level,
        status: v.status,
    }));
    const terminology = [
        ...data.brandGuidelines.map((g) => ({
            id: g.id,
            name: g.guideline_name,
            version: g.version,
            category: g.guideline_category,
            status: g.guideline_status || g.status,
        })),
        ...data.brandRulebook.map((r) => ({
            id: r.id,
            name: r.rulebook_name,
            version: r.rulebook_version,
            category: "rulebook",
            status: r.rulebook_status || r.status,
        })),
    ];
    const approvedMessaging = [
        ...data.messaging.map((m) => ({
            id: m.id,
            title: m.messaging_title,
            type: m.messaging_type,
            audience: m.audience_segment,
            status: m.messaging_status || m.status,
        })),
        ...data.messagingLibrary.map((m) => ({
            id: m.id,
            title: m.message_title,
            type: m.message_type,
            audience: m.audience_segment,
            status: m.message_status || m.status,
        })),
    ];

    const titles = [
        ...data.drafts.map((d) => ({ id: d.id, title: d.queue_title })),
        ...data.blogTemplates.map((b) => ({ id: b.id, title: b.template_name })),
        ...data.blogGenerators.map((b) => ({ id: b.id, title: b.generator_name })),
    ];
    const duplicates: BrandCompliance["duplicates"] = [];
    for (let i = 0; i < Math.min(titles.length, 20); i += 1) {
        for (let j = i + 1; j < Math.min(titles.length, 20); j += 1) {
            const similarity = titleSimilarity(titles[i].title, titles[j].title);
            if (similarity >= 0.55) {
                duplicates.push({
                    id: `${titles[i].id}:${titles[j].id}`,
                    leftTitle: titles[i].title,
                    rightTitle: titles[j].title,
                    similarity,
                });
            }
        }
    }

    const approvalQueue = [
        ...data.approvalQueue.map((a) => ({
            id: a.id,
            title: a.queue_title,
            contentType: a.content_type,
            approverRef: a.approver_ref,
            status: a.queue_status || a.status,
        })),
        ...data.approvalCenter.map((a) => ({
            id: a.id,
            title: a.approval_title,
            contentType: a.content_type,
            approverRef: a.approver_ref,
            status: a.approval_status || a.status,
        })),
    ];
    const pendingApprovals = approvalQueue.filter((a) => {
        const s = a.status.toLowerCase();
        return s.includes("pending") || s.includes("review") || s.includes("await");
    }).length;

    const brandHealth = data.growthMetrics[0]?.brand_health_score;
    const perfAvg = avg(data.contentPerformance.map((p) => p.performance_score));
    const qualityScore =
        brandHealth != null && perfAvg != null
            ? avg([brandHealth, perfAvg])
            : brandHealth ?? perfAvg;

    return {
        voices,
        terminology,
        approvedMessaging,
        qualityScore,
        duplicates,
        approvalQueue,
        pendingApprovals,
    };
}

export function buildSeoIntelligence(data: GrowthOsContentRawData): SeoIntelligence {
    const keywordClusters = data.seoAssistants.map((s) => ({
        id: s.id,
        name: s.assistant_name,
        keywordFocus: s.keyword_focus,
        searchIntent: s.search_intent,
        cluster: clusterKey(s.keyword_focus, s.search_intent),
        status: s.assistant_status || s.status,
    }));

    const intentMap = new Map<string, number>();
    for (const k of keywordClusters) {
        const intent = k.searchIntent || "informational";
        intentMap.set(intent, (intentMap.get(intent) ?? 0) + 1);
    }

    const contentScore = avg(data.contentPerformance.map((p) => p.performance_score));
    const growth = data.growthMetrics[0];
    const readabilityScore =
        growth != null
            ? avg([growth.marketing_overview_score, growth.brand_health_score])
            : contentScore;

    const recommendations: SeoIntelligence["recommendations"] = [];
    for (const k of keywordClusters) {
        if (!k.keywordFocus.trim()) {
            recommendations.push({
                id: k.id,
                target: k.name,
                recommendation: "Add a keyword focus to unlock SEO-first generation.",
                priority: "high",
            });
        } else if ((k.searchIntent || "").toLowerCase() === "informational" && !k.keywordFocus.includes(" ")) {
            recommendations.push({
                id: `${k.id}-cluster`,
                target: k.name,
                recommendation: "Expand into a multi-word topic cluster for pillar coverage.",
                priority: "medium",
            });
        }
    }
    for (const p of data.contentPerformance) {
        if (p.performance_score < 50) {
            recommendations.push({
                id: p.id,
                target: p.performance_title,
                recommendation: "Optimize readability and on-page SEO; live performance score is below 50.",
                priority: "high",
            });
        }
    }

    return {
        keywordClusters,
        intentBreakdown: Array.from(intentMap.entries()).map(([intent, count]) => ({ intent, count })),
        readabilityScore,
        contentScore,
        recommendations,
    };
}

export function createEmptyGrowthOsContentSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): GrowthOsContentSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        blog: {
            articles: [],
            topicClusters: [],
            pillarPages: [],
            supportingArticles: [],
            internalLinks: [],
            meta: [],
            faqs: [],
            schemaReadyCount: 0,
        },
        landing: {
            pages: [],
            productPages: [],
            industryPages: [],
            campaignPages: [],
            caseStudyPages: [],
            conversionCopy: [],
        },
        social: { posts: [], byPlatform: GOC_SOCIAL_PLATFORMS.map((platform) => ({ platform, count: 0 })), youtubeDescriptions: [] },
        email: {
            sequences: [],
            welcome: [],
            productUpdates: [],
            newsletters: [],
            reengagement: [],
            nurturing: [],
        },
        compliance: {
            voices: [],
            terminology: [],
            approvedMessaging: [],
            qualityScore: null,
            duplicates: [],
            approvalQueue: [],
            pendingApprovals: 0,
        },
        seo: {
            keywordClusters: [],
            intentBreakdown: [],
            readabilityScore: null,
            contentScore: null,
            recommendations: [],
        },
    };
}

export function buildGrowthOsContentSnapshot(data: GrowthOsContentRawData): GrowthOsContentSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        blog: buildAiBlogStudio(data),
        landing: buildLandingPageGenerator(data),
        social: buildSocialContentEngine(data),
        email: buildEmailContent(data),
        compliance: buildBrandCompliance(data),
        seo: buildSeoIntelligence(data),
    };
}
