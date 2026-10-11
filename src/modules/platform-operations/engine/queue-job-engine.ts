import { QUEUE_TYPES } from "../constants";
import type { JobQueue, QueueType } from "../types";

const queueStore: JobQueue[] = [];

/**
 * In-memory job counters (no worker, no persistence).
 *
 * Queues start at zero — previous random seeds fabricated backlog and
 * throughput. `enqueueJob` records real enqueue calls in this process only;
 * nothing here executes work. A durable worker with retries, idempotency,
 * and dead-letter handling is still required before claiming autonomous
 * background execution.
 */
export function initializeQueues(): JobQueue[] {
    if (queueStore.length > 0) return queueStore;
    QUEUE_TYPES.forEach((type) => {
        queueStore.push({
            id: `queue-${type}`,
            name: type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            type,
            pending: 0,
            processing: 0,
            failed: 0,
            completed: 0,
            avgLatencyMs: 0,
        });
    });
    return queueStore;
}

export function getJobQueues(): JobQueue[] {
    return initializeQueues();
}

export function enqueueJob(queueType: QueueType, jobName: string): { queued: boolean; queueId: string; jobName: string } {
    const queue = queueStore.find((q) => q.type === queueType);
    if (queue) queue.pending += 1;
    return { queued: true, queueId: queue?.id ?? `queue-${queueType}`, jobName };
}

export function scheduleJob(queueType: QueueType, jobName: string, runAt: string): { scheduled: boolean; runAt: string } {
    enqueueJob(queueType, jobName);
    return { scheduled: true, runAt };
}

export function getQueueBacklog(): number {
    return getJobQueues().reduce((sum, q) => sum + q.pending, 0);
}

initializeQueues();
