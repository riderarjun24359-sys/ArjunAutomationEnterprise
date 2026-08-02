export interface RepositoryQuery {
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export abstract class BaseRepository<T> {
  protected abstract table: string;

  protected buildQuery(query: RepositoryQuery = {}) {
    return {
      filters: query.filters ?? {},
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
      orderBy: query.orderBy ?? "created_at",
      orderDirection: query.orderDirection ?? "desc",
    } as const;
  }

  protected normalizeRecord(record: T): T {
    return record;
  }
}
