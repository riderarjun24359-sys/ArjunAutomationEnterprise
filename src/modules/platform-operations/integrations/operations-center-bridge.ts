import { operationsCenterService } from "@/src/modules/operations-center/services/operations-center.service";

/** Delegates to operations-center service — no duplicate monitoring logic. */
export async function getOperationsHealth(authUserId: string, email: string, fullName?: string | null) {
    return operationsCenterService.getOverallHealths(authUserId, email, fullName);
}

export async function getOperationsMetrics(authUserId: string, email: string, fullName?: string | null) {
    return operationsCenterService.getOperationsMetrics(authUserId, email, fullName);
}

export async function getOperationsFailures(authUserId: string, email: string, fullName?: string | null) {
    return operationsCenterService.getOperationsFailures(authUserId, email, fullName);
}

export async function getJobScheduler(authUserId: string, email: string, fullName?: string | null) {
    return operationsCenterService.getJobSchedulers(authUserId, email, fullName);
}

export { operationsCenterService };
