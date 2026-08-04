"use client";

import { useCallback, useEffect, useState } from "react";
import { PLATFORM_OPERATIONS_STORAGE_KEY } from "../constants";
import { platformOperationsService } from "../services/platform-operations.service";
import type { PlatformOperationsState } from "../types";

function buildDefaultState(): PlatformOperationsState {
    return platformOperationsService.getFullState();
}

function loadPlatformOperationsState(): PlatformOperationsState {
    return platformOperationsService.getFullState();
}

export function usePlatformOperations() {
    const [state, setState] = useState<PlatformOperationsState>(buildDefaultState);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        const next = loadPlatformOperationsState();
        setState(next);
        localStorage.setItem(PLATFORM_OPERATIONS_STORAGE_KEY, JSON.stringify(next));
        setLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const next = loadPlatformOperationsState();
        queueMicrotask(() => {
            if (cancelled) return;
            setState(next);
            localStorage.setItem(PLATFORM_OPERATIONS_STORAGE_KEY, JSON.stringify(next));
            setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { state, loading, refresh, service: platformOperationsService };
}
