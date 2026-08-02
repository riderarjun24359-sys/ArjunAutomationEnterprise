"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { settingsService } from "@/src/modules/settings/services/settings.service";
import type {
    ApiKey,
    AuditConfiguration,
    BackupConfig,
    BrandingSettings,
    CreateApiKeyInput,
    CreateInvitationInput,
    CreateTeamInput,
    NotificationPreference,
    OrganizationInvitation,
    OrganizationPreferences,
    OrganizationSettings,
    RoleSummary,
    SecurityPolicy,
    SettingsDashboardStats,
    TeamMemberSummary,
    TeamSummary,
    UpdateAuditConfigInput,
    UpdateBrandingInput,
    UpdateNotificationPreferenceInput,
    UpdateOrganizationSettingsInput,
    UpdatePreferencesInput,
    UpdateSecurityPolicyInput,
    UpdateUserPreferencesInput,
    UserPreferences,
} from "@/src/modules/settings/types";

export function useSettings() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SettingsDashboardStats | null>(null);
    const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings | null>(null);
    const [branding, setBranding] = useState<BrandingSettings | null>(null);
    const [preferences, setPreferences] = useState<OrganizationPreferences | null>(null);
    const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
    const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicy | null>(null);
    const [auditConfig, setAuditConfig] = useState<AuditConfiguration | null>(null);
    const [teams, setTeams] = useState<TeamSummary[]>([]);
    const [members, setMembers] = useState<TeamMemberSummary[]>([]);
    const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
    const [roles, setRoles] = useState<RoleSummary[]>([]);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([]);
    const [backupConfigs, setBackupConfigs] = useState<BackupConfig[]>([]);

    const fetchSettings = useCallback(async () => {
        if (!user) {
            return {
                dashboardStats: null,
                orgSettings: null,
                brandingSettings: null,
                orgPreferences: null,
                personalPreferences: null,
                security: null,
                audit: null,
                teamList: [],
                memberList: [],
                invitationList: [],
                roleList: [],
                keyList: [],
                notificationList: [],
                backupList: [],
            };
        }

        const [
            dashboardStats,
            orgSettings,
            brandingSettings,
            orgPreferences,
            personalPreferences,
            security,
            audit,
            teamList,
            memberList,
            invitationList,
            roleList,
            keyList,
            notificationList,
            backupList,
        ] = await Promise.all([
            settingsService.getDashboardStats(user.id, user.email, user.fullName),
            settingsService.getOrganizationSettings(user.id, user.email, user.fullName),
            settingsService.getBranding(user.id, user.email, user.fullName),
            settingsService.getPreferences(user.id, user.email, user.fullName),
            settingsService.getUserPreferences(user.id, user.email, user.fullName),
            settingsService.getSecurityPolicy(user.id, user.email, user.fullName),
            settingsService.getAuditConfig(user.id, user.email, user.fullName),
            settingsService.getTeams(user.id, user.email, user.fullName),
            settingsService.getMembers(user.id, user.email, user.fullName),
            settingsService.getInvitations(user.id, user.email, user.fullName),
            settingsService.getRoles(user.id, user.email, user.fullName),
            settingsService.getApiKeys(user.id, user.email, user.fullName),
            settingsService.getNotificationPreferences(user.id, user.email, user.fullName),
            settingsService.getBackupConfigs(user.id, user.email, user.fullName),
        ]);

        return {
            dashboardStats,
            orgSettings,
            brandingSettings,
            orgPreferences,
            personalPreferences,
            security,
            audit,
            teamList,
            memberList,
            invitationList,
            roleList,
            keyList,
            notificationList,
            backupList,
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchSettings>>) => {
        setStats(data.dashboardStats);
        setOrganizationSettings(data.orgSettings);
        setBranding(data.brandingSettings);
        setPreferences(data.orgPreferences);
        setUserPreferences(data.personalPreferences);
        setSecurityPolicy(data.security);
        setAuditConfig(data.audit);
        setTeams(data.teamList);
        setMembers(data.memberList);
        setInvitations(data.invitationList);
        setRoles(data.roleList);
        setApiKeys(data.keyList);
        setNotificationPreferences(data.notificationList);
        setBackupConfigs(data.backupList);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => {
        const data = await fetchSettings();
        applyData(data);
    }, [fetchSettings, applyData]);

    useEffect(() => {
        let cancelled = false;

        void fetchSettings()
            .then((data) => {
                if (cancelled) return;
                applyData(data);
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [fetchSettings, applyData]);

    const updateOrganizationSettings = useCallback(async (input: UpdateOrganizationSettingsInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.updateOrganizationSettings(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateBranding = useCallback(async (input: UpdateBrandingInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.updateBranding(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updatePreferences = useCallback(async (input: UpdatePreferencesInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.updatePreferences(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateUserPreferences = useCallback(async (input: UpdateUserPreferencesInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.updateUserPreferences(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateSecurityPolicy = useCallback(async (input: UpdateSecurityPolicyInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.updateSecurityPolicy(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateAuditConfig = useCallback(async (input: UpdateAuditConfigInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.updateAuditConfig(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createTeam = useCallback(async (input: CreateTeamInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.createTeam(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createInvitation = useCallback(async (input: CreateInvitationInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.createInvitation(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createApiKey = useCallback(async (input: CreateApiKeyInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.createApiKey(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const revokeApiKey = useCallback(async (apiKeyId: string) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.revokeApiKey(user.id, user.email, apiKeyId, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateNotificationPreference = useCallback(async (preferenceId: string, input: UpdateNotificationPreferenceInput) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.updateNotificationPreference(user.id, user.email, preferenceId, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const runBackup = useCallback(async (configId: string) => {
        if (!user) throw new Error("Authentication required");
        await settingsService.runBackup(user.id, user.email, configId, user.fullName);
        await refresh();
    }, [user, refresh]);

    return {
        loading,
        stats,
        organizationSettings,
        branding,
        preferences,
        userPreferences,
        securityPolicy,
        auditConfig,
        teams,
        members,
        invitations,
        roles,
        apiKeys,
        notificationPreferences,
        backupConfigs,
        updateOrganizationSettings,
        updateBranding,
        updatePreferences,
        updateUserPreferences,
        updateSecurityPolicy,
        updateAuditConfig,
        createTeam,
        createInvitation,
        createApiKey,
        revokeApiKey,
        updateNotificationPreference,
        runBackup,
        refresh,
    };
}
