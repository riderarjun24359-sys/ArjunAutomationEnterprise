"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { documentsService } from "@/src/modules/documents/services/documents.service";
import type {
    AccessGrantSummary,
    ActivityLogSummary,
    ApprovalSummary,
    ArchiveSummary,
    CreateAccessGrantInput,
    CreateApprovalInput,
    CreateDocumentInput,
    CreateEsignInput,
    CreateFolderInput,
    CreateRetentionPolicyInput,
    CreateShareInput,
    CreateTagInput,
    CreateTemplateInput,
    CreateVersionInput,
    CrossModuleLinks,
    DocumentAuditEntry,
    DocumentReport,
    DocumentSummary,
    DocumentsDashboardStats,
    EsignSummary,
    FolderSummary,
    PreviewSummary,
    RetentionPolicySummary,
    SearchIndexSummary,
    ShareSummary,
    TagSummary,
    TemplateSummary,
    UpdateApprovalStatusInput,
    UpdateArchiveRestoreInput,
    UpdateEsignStatusInput,
    VersionSummary,
} from "@/src/modules/documents/types";

export function useDocuments() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DocumentsDashboardStats | null>(null);
    const [folders, setFolders] = useState<FolderSummary[]>([]);
    const [documents, setDocuments] = useState<DocumentSummary[]>([]);
    const [tags, setTags] = useState<TagSummary[]>([]);
    const [versions, setVersions] = useState<VersionSummary[]>([]);
    const [approvals, setApprovals] = useState<ApprovalSummary[]>([]);
    const [esignPreparations, setEsignPreparations] = useState<EsignSummary[]>([]);
    const [shares, setShares] = useState<ShareSummary[]>([]);
    const [accessGrants, setAccessGrants] = useState<AccessGrantSummary[]>([]);
    const [templates, setTemplates] = useState<TemplateSummary[]>([]);
    const [previews, setPreviews] = useState<PreviewSummary[]>([]);
    const [searchIndex, setSearchIndex] = useState<SearchIndexSummary[]>([]);
    const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicySummary[]>([]);
    const [archives, setArchives] = useState<ArchiveSummary[]>([]);
    const [activityLogs, setActivityLogs] = useState<ActivityLogSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<DocumentAuditEntry[]>([]);
    const [report, setReport] = useState<DocumentReport | null>(null);
    const [crossModuleLinks, setCrossModuleLinks] = useState<CrossModuleLinks | null>(null);
    const [folderOptions, setFolderOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [documentOptions, setDocumentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [employeeOptions, setEmployeeOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchDocumentsData = useCallback(async () => {
        if (!user) {
            return {
                dashboardStats: null, folderList: [], documentList: [], tagList: [], versionList: [], approvalList: [], esignList: [], shareList: [], accessList: [], templateList: [], previewList: [], searchList: [], retentionList: [], archiveList: [], activityList: [], auditLogList: [], documentReport: null, crossLinks: null, folders: [], docs: [], clients: [], employees: [],
            };
        }
        const [dashboardStats, folderList, documentList, tagList, versionList, approvalList, esignList, shareList, accessList, templateList, previewList, searchList, retentionList, archiveList, activityList, auditLogList, documentReport, crossLinks, folders, docs, clients, employees] = await Promise.all([
            documentsService.getDashboardStats(user.id, user.email, user.fullName),
            documentsService.getFolders(user.id, user.email, user.fullName),
            documentsService.getDocuments(user.id, user.email, user.fullName),
            documentsService.getTags(user.id, user.email, user.fullName),
            documentsService.getVersions(user.id, user.email, user.fullName),
            documentsService.getApprovals(user.id, user.email, user.fullName),
            documentsService.getEsignPreparations(user.id, user.email, user.fullName),
            documentsService.getShares(user.id, user.email, user.fullName),
            documentsService.getAccessGrants(user.id, user.email, user.fullName),
            documentsService.getTemplates(user.id, user.email, user.fullName),
            documentsService.getPreviews(user.id, user.email, user.fullName),
            documentsService.getSearchIndex(user.id, user.email, user.fullName),
            documentsService.getRetentionPolicies(user.id, user.email, user.fullName),
            documentsService.getArchives(user.id, user.email, user.fullName),
            documentsService.getActivityLogs(user.id, user.email, user.fullName),
            documentsService.getAuditLogs(user.id, user.email, user.fullName),
            documentsService.getReport(user.id, user.email, user.fullName),
            documentsService.getCrossModuleLinks(user.id, user.email, user.fullName),
            documentsService.getFolderOptions(user.id, user.email, user.fullName),
            documentsService.getDocumentOptions(user.id, user.email, user.fullName),
            documentsService.getClientOptions(user.id, user.email, user.fullName),
            documentsService.getEmployeeOptions(user.id, user.email, user.fullName),
        ]);
        return { dashboardStats, folderList, documentList, tagList, versionList, approvalList, esignList, shareList, accessList, templateList, previewList, searchList, retentionList, archiveList, activityList, auditLogList, documentReport, crossLinks, folders, docs, clients, employees };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchDocumentsData>>) => {
        setStats(data.dashboardStats);
        setFolders(data.folderList);
        setDocuments(data.documentList);
        setTags(data.tagList);
        setVersions(data.versionList);
        setApprovals(data.approvalList);
        setEsignPreparations(data.esignList);
        setShares(data.shareList);
        setAccessGrants(data.accessList);
        setTemplates(data.templateList);
        setPreviews(data.previewList);
        setSearchIndex(data.searchList);
        setRetentionPolicies(data.retentionList);
        setArchives(data.archiveList);
        setActivityLogs(data.activityList);
        setAuditLogs(data.auditLogList);
        setReport(data.documentReport);
        setCrossModuleLinks(data.crossLinks);
        setFolderOptions(data.folders);
        setDocumentOptions(data.docs);
        setClientOptions(data.clients);
        setEmployeeOptions(data.employees);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchDocumentsData()); }, [fetchDocumentsData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchDocumentsData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchDocumentsData, applyData]);

    const createFolder = useCallback(async (input: CreateFolderInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createFolder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocument = useCallback(async (input: CreateDocumentInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createDocument(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTag = useCallback(async (input: CreateTagInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createTag(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVersion = useCallback(async (input: CreateVersionInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApproval = useCallback(async (input: CreateApprovalInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createApproval(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const updateApprovalStatus = useCallback(async (approvalId: string, input: UpdateApprovalStatusInput) => { if (!user) throw new Error("Authentication required"); await documentsService.updateApprovalStatus(user.id, user.email, approvalId, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEsignPreparation = useCallback(async (input: CreateEsignInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createEsignPreparation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const updateEsignStatus = useCallback(async (esignId: string, input: UpdateEsignStatusInput) => { if (!user) throw new Error("Authentication required"); await documentsService.updateEsignStatus(user.id, user.email, esignId, input, user.fullName); await refresh(); }, [user, refresh]);
    const createShare = useCallback(async (input: CreateShareInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createShare(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAccessGrant = useCallback(async (input: CreateAccessGrantInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createAccessGrant(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemplate = useCallback(async (input: CreateTemplateInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetentionPolicy = useCallback(async (input: CreateRetentionPolicyInput) => { if (!user) throw new Error("Authentication required"); await documentsService.createRetentionPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const updateArchiveRestore = useCallback(async (archiveId: string, input: UpdateArchiveRestoreInput) => { if (!user) throw new Error("Authentication required"); await documentsService.updateArchiveRestore(user.id, user.email, archiveId, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading, stats, folders, documents, tags, versions, approvals, esignPreparations, shares, accessGrants, templates, previews, searchIndex, retentionPolicies, archives, activityLogs, auditLogs, report, crossModuleLinks, folderOptions, documentOptions, clientOptions, employeeOptions,
        createFolder, createDocument, createTag, createVersion, createApproval, updateApprovalStatus, createEsignPreparation, updateEsignStatus, createShare, createAccessGrant, createTemplate, createRetentionPolicy, updateArchiveRestore, refresh,
    };
}
