import type { UserProfile } from "@/src/modules/database/types/core";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class ProfileRepository extends BaseRepository<UserProfile> {
    protected table = "user_profiles";

    async list(query: RepositoryQuery = {}) {
        const normalized = this.buildQuery(query);
        return { table: this.table, query: normalized };
    }

    async getByAuthUser(authUserId: string) {
        return { table: this.table, authUserId } as const;
    }

    async create(input: Omit<UserProfile, "id" | "created_at" | "updated_at">) {
        return { table: this.table, input } as const;
    }
}
