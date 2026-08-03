import { restaurantService } from "@/src/modules/restaurant/services/restaurant.service";
import type { RstSdkRegisterBrandInput, RstSdkConfigureMenuInput, RstSdkRunOrderWorkflowInput } from "@/src/modules/restaurant/types";

export class RestaurantClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerBrand(input: RstSdkRegisterBrandInput) {
        return restaurantService.sdkRegisterBrand(this.authUserId, this.email, input, this.fullName);
    }

    async configureMenu(input: RstSdkConfigureMenuInput) {
        return restaurantService.sdkConfigureMenu(this.authUserId, this.email, input, this.fullName);
    }

    async runOrderWorkflow(input: RstSdkRunOrderWorkflowInput) {
        return restaurantService.sdkRunOrderWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getRestaurantHubs() {
        return restaurantService.getRestaurantHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return restaurantService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return restaurantService.getPipelineInfo();
    }
}

export function createRestaurantClient(authUserId: string, email: string, fullName?: string | null): RestaurantClient {
    return new RestaurantClient(authUserId, email, fullName);
}

export { restaurantService };
