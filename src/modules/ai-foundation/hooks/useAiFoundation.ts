"use client";

import { useCallback, useEffect, useState } from "react";
import { AI_FOUNDATION_STORAGE_KEY } from "../constants";
import { aiFoundationService } from "../services/ai-foundation.service";
import type { AiFoundationState } from "../types";

function loadAiFoundationState(): AiFoundationState {
    return aiFoundationService.getFullState();
}

export function useAiFoundation() {
    const [state, setState] = useState<AiFoundationState>(loadAiFoundationState);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        const next = loadAiFoundationState();
        setState(next);
        localStorage.setItem(AI_FOUNDATION_STORAGE_KEY, JSON.stringify(next));
        setLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const next = loadAiFoundationState();
        queueMicrotask(() => {
            if (cancelled) return;
            setState(next);
            localStorage.setItem(AI_FOUNDATION_STORAGE_KEY, JSON.stringify(next));
            setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { state, loading, refresh, service: aiFoundationService };
}
