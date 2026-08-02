import type { StorageObject } from "@/src/modules/database/types/core";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class StorageRepository extends BaseRepository<StorageObject> {
    protected table = "storage_objects";

    async list(query: RepositoryQuery = {}) {
        const normalized = this.buildQuery(query);
        return { table: this.table, query: normalized };
    }

    async create(input: Omit<StorageObject, "id" | "created_at" | "updated_at">) {
        return { table: this.table, input } as const;
    }
}
