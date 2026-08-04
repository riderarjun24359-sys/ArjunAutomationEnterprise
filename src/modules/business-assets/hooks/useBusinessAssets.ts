"use client";

import { useCallback, useState } from "react";
import { STORAGE_KEY } from "../constants";
import { businessAssetsService } from "../services/business-assets.service";
import type { BusinessAssetsState } from "../types";

function loadInitialState(): BusinessAssetsState {
    if (typeof window === "undefined") return businessAssetsService.getDefaultState();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as BusinessAssetsState;
            return { ...businessAssetsService.getDefaultState(), ...parsed };
        }
    } catch {
        /* use defaults */
    }
    return businessAssetsService.getDefaultState();
}

export function useBusinessAssets() {
    const [state, setState] = useState<BusinessAssetsState>(loadInitialState);

    const persist = useCallback((next: BusinessAssetsState) => {
        setState(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }, []);

    const update = useCallback(
        <K extends keyof BusinessAssetsState>(key: K, value: BusinessAssetsState[K]) => {
            setState((prev) => {
                const next = { ...prev, [key]: value };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                return next;
            });
        },
        [],
    );

    const reset = useCallback(() => {
        const defaults = businessAssetsService.getDefaultState();
        persist(defaults);
    }, [persist]);

    return { state, loaded: true, update, persist, reset, service: businessAssetsService };
}
