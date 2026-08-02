import type { OrganizationMember } from "@/src/modules/database/types/core";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class MembershipRepository extends BaseRepository<OrganizationMember> {
  protected table = "organization_members";

  async list(query: RepositoryQuery = {}) {
    const normalized = this.buildQuery(query);
    return { table: this.table, query: normalized };
  }

  async getByUser(userId: string) {
    return { table: this.table, userId } as const;
  }

  async create(input: Omit<OrganizationMember, "id" | "created_at" | "updated_at">) {
    return { table: this.table, input } as const;
  }
}
