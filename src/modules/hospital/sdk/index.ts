import { hospitalService } from "@/src/modules/hospital/services/hospital.service";
import type {
    HspSdkRegisterCampusInput,
    HspSdkConfigurePatientRegistrationInput,
    HspSdkRunAppointmentWorkflowInput,
} from "@/src/modules/hospital/types";

export class HospitalClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerCampus(input: HspSdkRegisterCampusInput) {
        return hospitalService.sdkRegisterCampus(this.authUserId, this.email, input, this.fullName);
    }

    async configurePatientRegistration(input: HspSdkConfigurePatientRegistrationInput) {
        return hospitalService.sdkConfigurePatientRegistration(this.authUserId, this.email, input, this.fullName);
    }

    async runAppointmentWorkflow(input: HspSdkRunAppointmentWorkflowInput) {
        return hospitalService.sdkRunAppointmentWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getHospitalHubs() {
        return hospitalService.getHospitalHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return hospitalService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return hospitalService.getPipelineInfo();
    }
}

export function createHospitalClient(authUserId: string, email: string, fullName?: string | null): HospitalClient {
    return new HospitalClient(authUserId, email, fullName);
}

export { hospitalService };
