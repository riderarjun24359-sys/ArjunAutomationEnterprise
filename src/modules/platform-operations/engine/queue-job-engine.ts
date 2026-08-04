import { QUEUE_TYPES } from "../constants";
import type { JobQueue, QueueType } from "../types";

const queueStore: JobQueue[] = [];

export function initializeQueues(): JobQueue[] {
    if (queueStore.length > 0) return queueStore;
    QUEUE_TYPES.forEach((type) => {
        queueStore.push({
            id: `queue-${type}`,
            name: type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            type,
            pending: Math.floor(Math.random() * 20),
            processing: Math.floor(Math.random() * 5),
            failed: Math.floor(Math.random() * 3),
            completed: Math.floor(Math.random() * 100),
            avgLatencyMs: Math.round(50 + Math.random() * 200),
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
