import type { AuditLog } from "@/src/modules/database/types/core";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class AuditRepository extends BaseRepository<AuditLog> {
  protected table = "audit_logs";

  async list(query: RepositoryQuery = {}) {
    const normalized = this.buildQuery(query);
    return { table: this.table, query: normalized };
  }

  async create(input: Omit<AuditLog, "id" | "created_at">) {
    return { table: this.table, input } as const;
  }
}
