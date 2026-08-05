"use client";

import { create } from "zustand";
import type { ExecutiveCommandCenterSnapshot } from "@/src/modules/executive-command-center/types";

interface ExecutiveShellState {
    commandPaletteOpen: boolean;
    commandPaletteQuery: string;
    copilotOpen: boolean;
    snapshot: ExecutiveCommandCenterSnapshot | null;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleCommandPalette: () => void;
    setCommandPaletteQuery: (query: string) => void;
    setCopilotOpen: (open: boolean) => void;
    toggleCopilot: () => void;
    setSnapshot: (snapshot: ExecutiveCommandCenterSnapshot | null) => void;
}

export const useExecutiveShellStore = create<ExecutiveShellState>()((set) => ({
    commandPaletteOpen: false,
    commandPaletteQuery: "",
    copilotOpen: false,
    snapshot: null,
    setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
    setCommandPaletteQuery: (query) => set({ commandPaletteQuery: query }),
    setCopilotOpen: (open) => set({ copilotOpen: open }),
    toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
    setSnapshot: (snapshot) => set({ snapshot }),
}));
