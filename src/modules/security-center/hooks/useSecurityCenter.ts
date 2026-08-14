"use client";

import { useCallback, useEffect, useState } from "react";
import { SECURITY_CENTER_STORAGE_KEY } from "../constants";
import { securityCenterService } from "../services/security-center.service";
import type { SecurityCenterState, SecurityRole } from "../types";

const DEFAULT_USER = {
    authUserId: "platform-user",
    email: "security@arjunautomations.com",
    fullName: "Security Admin",
    orgId: "org-default",
    role: "admin" as SecurityRole,
};

function buildDefaultState(): SecurityCenterState {
    return {
        authMethods: [],
        mfaStatus: { enrolled: false, methods: [], policyEnforced: false },
        roles: securityCenterService.getRoles(),
        apiKeys: [],
        secrets: securityCenterService.listSecrets(),
        auditEvents: [],
        threatAlerts: [],
        orgChecks: [],
        dashboard: {
            authMethodsEnabled: 0,
            mfaEnrollmentRate: 0,
            activeThreats: 0,
            auditEventsToday: 0,
            apiKeysActive: 0,
            secretsValid: false,
            orgIsolationScore: 0,
            lastCheckedAt: new Date().toISOString(),
        },
    };
}

async function loadSecurityCenterState(): Promise<SecurityCenterState> {
    const { authUserId, email, fullName, orgId } = DEFAULT_USER;
    const [authMethods, mfaStatus, orgChecks, auditEvents, threatAlerts, dashboard] = await Promise.all([
        securityCenterService.getAuthenticationStatus(authUserId, email, fullName),
        securityCenterService.getMfaStatus(authUserId, email, fullName),
        securityCenterService.verifyOrganizationIsolation(orgId),
        securityCenterService.getAuditCenter(orgId),
        securityCenterService.runThreatDetection(authUserId, email, fullName),
        securityCenterService.getSecurityDashboard(authUserId, email, orgId, fullName),
    ]);
    return {
        authMethods,
        mfaStatus,
        roles: securityCenterService.getRoles(),
        apiKeys: [],
        secrets: securityCenterService.listSecrets(),
        auditEvents,
        threatAlerts,
        orgChecks,
        dashboard,
    };
}

export function useSecurityCenter() {
    const [state, setState] = useState<SecurityCenterState>(buildDefaultState);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        const next = await loadSecurityCenterState();
        setState(next);
        localStorage.setItem(SECURITY_CENTER_STORAGE_KEY, JSON.stringify(next));
        setLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;
        void loadSecurityCenterState().then((next) => {
            if (cancelled) return;
            setState(next);
            localStorage.setItem(SECURITY_CENTER_STORAGE_KEY, JSON.stringify(next));
            setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { state, loading, refresh, service: securityCenterService };
}

