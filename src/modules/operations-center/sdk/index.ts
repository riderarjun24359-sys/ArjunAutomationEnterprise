import { operationsCenterService } from "@/src/modules/operations-center/services/operations-center.service";
import type { EocSdkPublishEventInput, EocSdkScheduleJobInput, EocSdkTriggerAlertInput } from "@/src/modules/operations-center/types";

export class OperationsCenterClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async publishEvent(input: EocSdkPublishEventInput) {
        return operationsCenterService.sdkPublishEvent(this.authUserId, this.email, input, this.fullName);
    }

    async scheduleJob(input: EocSdkScheduleJobInput) {
        return operationsCenterService.sdkScheduleJob(this.authUserId, this.email, input, this.fullName);
    }

    async triggerAlert(input: EocSdkTriggerAlertInput) {
        return operationsCenterService.sdkTriggerAlert(this.authUserId, this.email, input, this.fullName);
    }

    async getOperationsCenters() {
        return operationsCenterService.getOperationsCenters(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return operationsCenterService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return operationsCenterService.getPipelineInfo();
    }
}

export function createOperationsCenterClient(authUserId: string, email: string, fullName?: string | null): OperationsCenterClient {
    return new OperationsCenterClient(authUserId, email, fullName);
}

export { operationsCenterService };
