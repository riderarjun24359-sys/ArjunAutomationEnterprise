import type { UserProfile } from "@/src/modules/database/types/core";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class ProfileRepository extends BaseRepository<UserProfile> {
    protected table = "user_profiles";

    async list(query: RepositoryQuery = {}): Promise<UserProfile[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, "Failed to list profiles");
        return (data ?? []) as UserProfile[];
    }

    async getById(id: string): Promise<UserProfile | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, "Failed to get profile");
        return (data as UserProfile | null) ?? null;
    }

    async getByAuthUser(authUserId: string): Promise<UserProfile | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("auth_user_id", authUserId).maybeSingle();
        mapRepositoryError(error, "Failed to get profile");
        return (data as UserProfile | null) ?? null;
    }

    async upsertForAuthUser(input: { authUserId: string; email: string; fullName?: string | null }): Promise<UserProfile | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client
            .from(this.table)
            .upsert(
                {
                    auth_user_id: input.authUserId,
                    email: input.email,
                    full_name: input.fullName ?? null,
                },
                { onConflict: "auth_user_id" },
            )
            .select("*")
            .maybeSingle();

        mapRepositoryError(error, "Failed to upsert profile");
        return (data as UserProfile | null) ?? null;
    }
}
