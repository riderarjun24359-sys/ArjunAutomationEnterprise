import { schoolService } from "@/src/modules/school/services/school.service";
import type {
    SchSdkRegisterCampusInput,
    SchSdkConfigureAdmissionInput,
    SchSdkRunExamWorkflowInput,
} from "@/src/modules/school/types";

export class SchoolClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerCampus(input: SchSdkRegisterCampusInput) {
        return schoolService.sdkRegisterCampus(this.authUserId, this.email, input, this.fullName);
    }

    async configureAdmission(input: SchSdkConfigureAdmissionInput) {
        return schoolService.sdkConfigureAdmission(this.authUserId, this.email, input, this.fullName);
    }

    async runExamWorkflow(input: SchSdkRunExamWorkflowInput) {
        return schoolService.sdkRunExamWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getSchoolHubs() {
        return schoolService.getSchoolHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return schoolService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return schoolService.getPipelineInfo();
    }
}

export function createSchoolClient(authUserId: string, email: string, fullName?: string | null): SchoolClient {
    return new SchoolClient(authUserId, email, fullName);
}

export { schoolService };
