import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { operationsSnapshotService } from "@/src/modules/operations/services/operations-snapshot.service";
import type { OperationsSnapshot } from "../types/snapshot";

export function useOperationsSnapshot() {
    const user = useAuthStore((state) => state.user);
    const [snapshot, setSnapshot] = useState<OperationsSnapshot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        operationsSnapshotService.getSnapshot(user.id, user.email, user.fullName)
            .then(setSnapshot)
            .finally(() => setLoading(false));
    }, [user]);

    return { snapshot, loading };
}
