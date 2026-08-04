"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { CLIENT_SUCCESS_STORAGE_KEY } from "../constants";
import {
    buildDefaultClientSuccessState,
    clientSuccessCapabilityService,
} from "../services/client-success-capability.service";
import type { ClientSuccessState } from "../types";
import type { ClientSummary } from "@/src/modules/crm/types";
import type { SupportedLanguage } from "@/src/modules/gci/types";
import type { ChangeRequestInput } from "../types";

function loadInitialState(): ClientSuccessState {
    if (typeof window === "undefined") return buildDefaultClientSuccessState();
    try {
        const raw = localStorage.getItem(CLIENT_SUCCESS_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as ClientSuccessState;
            return { ...buildDefaultClientSuccessState(), ...parsed };
        }
    } catch {
        /* use defaults */
    }
    return buildDefaultClientSuccessState();
}

export function useClientSuccessCapability() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id ?? "";
    const email = user?.email ?? "";
    const fullName = user?.fullName;

    const [state, setState] = useState<ClientSuccessState>(loadInitialState);
    const [clients, setClients] = useState<ClientSummary[]>([]);
    const [loading, setLoading] = useState(Boolean(authUserId));
    const [actionLoading, setActionLoading] = useState(false);

    const ctx = useMemo(() => ({ authUserId, email, fullName }), [authUserId, email, fullName]);

    const persist = useCallback((next: ClientSuccessState) => {
        setState(next);
        localStorage.setItem(CLIENT_SUCCESS_STORAGE_KEY, JSON.stringify(next));
    }, []);

    useEffect(() => {
        if (!authUserId) return;
        let cancelled = false;
        clientSuccessCapabilityService.loadClients(ctx).then((list) => {
            if (cancelled) return;
            setClients(list);
            if (list.length > 0 && !state.selectedClientId) {
                persist({ ...state, selectedClientId: list[0].id });
            }
            setLoading(false);
        }).catch(() => {
            if (!cancelled) setLoading(false);
        });
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUserId, email]);

    const selectClient = useCallback((clientId: string) => {
        persist({ ...state, selectedClientId: clientId });
    }, [persist, state]);

    const setClientLanguage = useCallback((clientId: string, locale: SupportedLanguage) => {
        const next = clientSuccessCapabilityService.setClientLanguage(clientId, locale, state);
        persist(next);
    }, [persist, state]);

    const runAiOnboarding = useCallback(async (clientId: string) => {
        setActionLoading(true);
        try {
            const { state: next } = await clientSuccessCapabilityService.runAiOnboarding(ctx, clientId, state);
            persist(next);
        } finally {
            setActionLoading(false);
        }
    }, [ctx, persist, state]);

    const provisionProjectWorkspace = useCallback(async (clientId: string) => {
        setActionLoading(true);
        try {
            const { state: next } = await clientSuccessCapabilityService.provisionProjectWorkspace(ctx, clientId, state);
            persist(next);
        } finally {
            setActionLoading(false);
        }
    }, [ctx, persist, state]);

    const submitChangeRequest = useCallback(async (input: ChangeRequestInput) => {
        setActionLoading(true);
        try {
            const { state: next } = await clientSuccessCapabilityService.submitChangeRequest(ctx, input, state);
            persist(next);
        } finally {
            setActionLoading(false);
        }
    }, [ctx, persist, state]);

    const selectedClientId = state.selectedClientId;
    const selectedClient = clients.find((c) => c.id === selectedClientId) ?? null;

    const portalData = selectedClientId
        ? clientSuccessCapabilityService.getClientPortalData(selectedClientId, state)
        : null;
    const communication = selectedClientId
        ? clientSuccessCapabilityService.getCommunicationCenter(selectedClientId, state)
        : null;
    const approvals = selectedClientId
        ? clientSuccessCapabilityService.getApprovalCenter(selectedClientId, state)
        : null;
    const delivery = selectedClientId
        ? clientSuccessCapabilityService.getDeliveryCenter(selectedClientId, state)
        : null;
    const health = selectedClientId
        ? clientSuccessCapabilityService.getCustomerHealth(selectedClientId, state)
        : null;
    const renewal = selectedClientId
        ? clientSuccessCapabilityService.getRenewalGrowth(selectedClientId, state)
        : null;
    const insights = selectedClientId
        ? clientSuccessCapabilityService.getAiSuccessManagerInsights(selectedClientId, state)
        : null;

    return {
        state,
        clients,
        selectedClientId,
        selectedClient,
        loading,
        actionLoading,
        selectClient,
        setClientLanguage,
        runAiOnboarding,
        provisionProjectWorkspace,
        submitChangeRequest,
        portalData,
        communication,
        approvals,
        delivery,
        health,
        renewal,
        insights,
        onboarding: selectedClientId ? state.onboarding[selectedClientId] : null,
        workspace: selectedClientId ? state.workspaces[selectedClientId] : null,
        changeRequests: state.changeRequests.filter((cr) => !selectedClientId || cr.clientId === selectedClientId),
        service: clientSuccessCapabilityService,
    };
}
