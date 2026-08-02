import type { Organization } from "@/src/modules/database/types/core";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class OrganizationRepository extends BaseRepository<Organization> {
  protected table = "organizations";

  async list(query: RepositoryQuery = {}) {
    const normalized = this.buildQuery(query);
    return { table: this.table, query: normalized };
  }

  async getBySlug(slug: string) {
    return { table: this.table, slug } as const;
  }

  async create(input: Omit<Organization, "id" | "created_at" | "updated_at">) {
    return { table: this.table, input } as const;
  }
}
