"use client";

import { useMemo, useState } from "react";
import { searchEverything } from "../services/smart-search.service";
import { useExecutiveShellStore } from "@/src/store/executive.store";
import type { SmartSearchResult } from "../types";

export function useSmartSearch() {
    const snapshot = useExecutiveShellStore((s) => s.snapshot);
    const [query, setQuery] = useState("");

    const results = useMemo(
        () => searchEverything(query, snapshot),
        [query, snapshot],
    );

    return { query, setQuery, results };
}

export type { SmartSearchResult };
