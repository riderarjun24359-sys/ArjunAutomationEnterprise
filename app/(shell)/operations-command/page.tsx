"use client";

import { motion } from "framer-motion";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { OperationsPulse } from "@/src/modules/operations/components/OperationsPulse";
import { OperationsExceptionField } from "@/src/modules/operations/components/OperationsExceptionField";
import { OperationsWorkQueue } from "@/src/modules/operations/components/OperationsWorkQueue";
import { OperationsSystemState } from "@/src/modules/operations/components/OperationsSystemState";
import { OperationsActivity } from "@/src/modules/operations/components/OperationsActivity";
import { useOperationsSnapshot } from "@/src/modules/operations/hooks/useOperationsSnapshot";

export default function OperationsCommandPage() {
    const { snapshot, loading } = useOperationsSnapshot();

    if (loading) {
        return <div className="mx-auto max-w-7xl p-6"><LoadingState label="Loading Operations Command" /></div>;
    }

    if (!snapshot) {
        return <div className="mx-auto max-w-7xl p-6 text-[var(--dos-text-secondary)]">Unable to load operational data.</div>;
    }

    const lastUpdated = new Date(snapshot.fetchedAt).toLocaleTimeString();

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8 p-6">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--dos-text-primary)]">Operations Command</h1>
                    <p className="text-[var(--dos-text-secondary)]">Enterprise-wide operational situational awareness</p>
                </div>
                <div className="text-sm text-[var(--dos-text-tertiary)] text-right">
                    Last updated: {lastUpdated}
                </div>
            </motion.header>

            <OperationsPulse snapshot={snapshot} />

            <div className="grid gap-8 lg:grid-cols-2">
                <OperationsSystemState serviceStatus={snapshot.serviceStatus} />
                <OperationsExceptionField exceptions={snapshot.exceptions} />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <OperationsWorkQueue workQueue={snapshot.workQueue} />
                <OperationsActivity activity={snapshot.activity} />
            </div>
        </PageTransition>
    );
}

// Wrapper for transition component
function PageTransition({ children, className }: { children: React.ReactNode, className: string }) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={className}>{children}</motion.div>;
}
