/**
 * In-memory fake of the supabase-js client surface used by the organization
 * API routes. Supports only the chained calls the routes make; anything else
 * throws loudly so tests fail instead of passing vacuously.
 */

type Row = Record<string, unknown>;
type DbError = { code?: string; message: string } | null;

export interface FakeFailure {
    table: string;
    op: "select" | "insert" | "update" | "delete";
    error: { code?: string; message: string };
}

export class FakeSupabase {
    readonly tables = new Map<string, Row[]>();
    failures: FakeFailure[] = [];

    seed(table: string, rows: Row[]): void {
        this.tables.set(table, rows.map((r) => ({ ...r })));
    }

    rows(table: string): Row[] {
        return this.tables.get(table) ?? [];
    }

    failOn(failure: FakeFailure): void {
        this.failures.push(failure);
    }

    failureFor(table: string, op: FakeFailure["op"]): DbError {
        return this.failures.find((f) => f.table === table && f.op === op)?.error ?? null;
    }

    from(table: string): FakeQuery {
        return new FakeQuery(this, table);
    }
}

class FakeQuery {
    private filters: Array<(row: Row) => boolean> = [];
    private orderKey: string | null = null;
    private orderAsc = true;
    private limitCount: number | null = null;
    private pendingInsert: Row[] | null = null;
    private pendingUpdate: Row | null = null;
    private isDelete = false;

    constructor(
        private readonly db: FakeSupabase,
        private readonly table: string,
    ) {}

    select(): this {
        return this;
    }

    eq(col: string, value: unknown): this {
        this.filters.push((row) => row[col] === value);
        return this;
    }

    in(col: string, values: unknown[]): this {
        this.filters.push((row) => values.includes(row[col]));
        return this;
    }

    order(col: string, opts?: { ascending?: boolean }): this {
        this.orderKey = col;
        this.orderAsc = opts?.ascending !== false;
        return this;
    }

    limit(n: number): this {
        this.limitCount = n;
        return this;
    }

    insert(rows: Row | Row[]): this {
        this.pendingInsert = Array.isArray(rows) ? rows : [rows];
        return this;
    }

    update(patch: Row): this {
        this.pendingUpdate = patch;
        return this;
    }

    delete(): this {
        this.isDelete = true;
        return this;
    }

    private matched(): Row[] {
        let rows = (this.db.tables.get(this.table) ?? []).filter((row) => this.filters.every((f) => f(row)));
        if (this.orderKey) {
            const key = this.orderKey;
            const asc = this.orderAsc;
            rows = [...rows].sort((a, b) => {
                const av = a[key];
                const bv = b[key];
                if (av == null && bv == null) return 0;
                if (av == null) return asc ? 1 : -1;
                if (bv == null) return asc ? -1 : 1;
                if (av < bv) return asc ? -1 : 1;
                if (av > bv) return asc ? 1 : -1;
                return 0;
            });
        }
        if (this.limitCount !== null) rows = rows.slice(0, this.limitCount);
        return rows;
    }

    async maybeSingle(): Promise<{ data: Row | null; error: DbError }> {
        if (this.pendingInsert) {
            const err = this.db.failureFor(this.table, "insert");
            if (err) return { data: null, error: err };
            const store = this.db.tables.get(this.table) ?? [];
            const inserted = this.pendingInsert.map((row) => ({
                id: `id-${Math.random().toString(36).slice(2, 10)}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ...row,
            }));
            store.push(...inserted);
            this.db.tables.set(this.table, store);
            return { data: inserted[0] ?? null, error: null };
        }
        if (this.pendingUpdate) {
            const err = this.db.failureFor(this.table, "update");
            if (err) return { data: null, error: err };
            const rows = this.matched();
            const first = rows[0] ?? null;
            if (first) Object.assign(first, this.pendingUpdate);
            return { data: first, error: null };
        }
        const err = this.db.failureFor(this.table, "select");
        if (err) return { data: null, error: err };
        const rows = this.matched();
        return { data: rows[0] ?? null, error: null };
    }

    then<TResult1 = { data: Row[]; error: DbError }, TResult2 = never>(
        onfulfilled?: ((value: { data: Row[]; error: DbError }) => TResult1 | Promise<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | Promise<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
        const run = async (): Promise<{ data: Row[]; error: DbError }> => {
            if (this.isDelete) {
                const err = this.db.failureFor(this.table, "delete");
                if (err) return { data: [], error: err };
                const store = this.db.tables.get(this.table) ?? [];
                const doomed = new Set(this.matched());
                this.db.tables.set(
                    this.table,
                    store.filter((row) => !doomed.has(row)),
                );
                return { data: [], error: null };
            }
            const err = this.db.failureFor(this.table, "select");
            if (err) return { data: [], error: err };
            return { data: this.matched(), error: null };
        };
        return run().then(onfulfilled, onrejected);
    }
}
