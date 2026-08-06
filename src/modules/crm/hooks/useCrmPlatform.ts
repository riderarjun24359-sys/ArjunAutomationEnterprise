"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { crmService } from "../services/crm.service";
import { queryDirectory } from "../services/crm-enterprise-builders";
import type {
    ClientProfileBundle,
    CrmEnterpriseSnapshot,
    DirectoryQuery,
    LeadPipelineStage,
} from "../types/enterprise";

const defaultQuery: DirectoryQuery = {
    search: "",
    status: "all",
    owner: "all",
    tag: "all",
    page: 1,
    pageSize: 8,
};

export function useCrmPlatform() {
    const user = useAuthStore((s) => s.user);
    const [snapshot, setSnapshot] = useState<CrmEnterpriseSnapshot | null>(null);
    const [profile, setProfile] = useState<ClientProfileBundle | null>(null);
    const [directoryQuery, setDirectoryQuery] = useState<DirectoryQuery>(defaultQuery);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [movingLeadId, setMovingLeadId] = useState<string | null>(null);

    const directory = snapshot ? queryDirectory(snapshot.directory, directoryQuery) : null;

    const refresh = async () => {
        if (!user) {
            setSnapshot(null);
            setProfile(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await crmService.getEnterpriseSnapshot(user.id, user.email, user.fullName);
            setSnapshot(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load CRM platform");
            setSnapshot(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        const timer = window.setTimeout(() => {
            void (async () => {
                if (!user) {
                    if (!cancelled) {
                        setSnapshot(null);
                        setLoading(false);
                        setError(null);
                    }
                    return;
                }
                if (!cancelled) {
                    setLoading(true);
                    setError(null);
                }
                try {
                    const data = await crmService.getEnterpriseSnapshot(user.id, user.email, user.fullName);
                    if (!cancelled) setSnapshot(data);
                } catch (err) {
                    if (!cancelled) {
                        setError(err instanceof Error ? err.message : "Failed to load CRM platform");
                        setSnapshot(null);
                    }
                } finally {
                    if (!cancelled) setLoading(false);
                }
            })();
        }, 0);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [user]);

    const selectClient = async (clientId: string) => {
        if (!user) return;
        const next = await crmService.getClientProfile(user.id, user.email, clientId, user.fullName);
        setProfile(next);
    };

    const moveLead = async (leadId: string, stage: LeadPipelineStage, origin: "sales_lead" | "crm_lead") => {
        if (!user) return false;
        setMovingLeadId(leadId);
        try {
            const ok = await crmService.moveLeadStage(user.id, user.email, leadId, stage, origin, user.fullName);
            if (ok) await refresh();
            return ok;
        } finally {
            setMovingLeadId(null);
        }
    };

    const updateDirectoryQuery = (patch: Partial<DirectoryQuery>) => {
        setDirectoryQuery((prev) => ({
            ...prev,
            ...patch,
            page:
                patch.page ??
                (patch.search !== undefined || patch.status !== undefined || patch.owner !== undefined || patch.tag !== undefined
                    ? 1
                    : prev.page),
        }));
    };

    return {
        snapshot,
        profile,
        directory,
        directoryQuery,
        loading,
        error,
        movingLeadId,
        selectClient,
        moveLead,
        updateDirectoryQuery,
        refresh,
        setProfile,
    };
}
