// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";

/**
 * Finance guard enforcement against REAL Postgres (PGlite).
 *
 * Applies the ACTUAL `invoices`/`payments` table DDL extracted from
 * 202608020005_enterprise_finance.sql plus the ACTUAL prepared guards
 * migration 202610100003, then proves duplicates, bad statuses, negative
 * amounts, and overpayments are rejected while valid rows persist.
 */

const dir = join(dirname(fileURLToPath(import.meta.url)));
const read = (name: string): string => readFileSync(join(dir, name), "utf8");

function extractCreateTable(source: string, table: string): string {
    const match = source.match(
        new RegExp(`create table if not exists public\\.${table} \\([\\s\\S]*?\\n\\);`),
    );
    if (!match) throw new Error(`table ${table} not found in migration source`);
    return match[0];
}

const ORG = "11111111-1111-1111-1111-111111111111";
let db: PGlite;

beforeAll(async () => {
    db = new PGlite();
    const finance = read("202608020005_enterprise_finance.sql");
    await db.exec(`
      create table public.organizations (id uuid primary key);
      create table public.clients (id uuid primary key);
      create table public.projects (id uuid primary key);
      create table public.estimates (id uuid primary key);
      insert into public.organizations (id) values ('${ORG}');
    `);
    await db.exec(extractCreateTable(finance, "invoices"));
    await db.exec(extractCreateTable(finance, "payments"));
    await db.exec(read("202610100003_finance_invoice_guards.sql"));
}, 120_000);

afterAll(async () => {
    await db?.close();
});

describe("finance guards (PGlite)", () => {
    it("persists a valid invoice and payment", async () => {
        await db.exec(
            `insert into public.invoices (organization_id, number, status, subtotal, tax_amount, total, amount_paid) values ('${ORG}', 'INV-1', 'draft', 100, 18, 118, 0);`,
        );
        const inv = await db.query<{ id: string }>(`select id from public.invoices where number = 'INV-1';`);
        const id = (inv.rows[0] as { id: string }).id;
        await db.exec(
            `insert into public.payments (organization_id, invoice_id, amount, method, status) values ('${ORG}', '${id}', 118, 'wire', 'completed');`,
        );
        expect(id).toBeTruthy();
    });

    it("rejects duplicate invoice numbers per organization (case-insensitive)", async () => {
        await expect(
            db.exec(`insert into public.invoices (organization_id, number, status, total) values ('${ORG}', 'inv-1', 'draft', 10);`),
        ).rejects.toThrow(/duplicate|unique/i);
    });

    it("rejects unknown statuses", async () => {
        await expect(
            db.exec(`insert into public.invoices (organization_id, number, status, total) values ('${ORG}', 'INV-9', 'bogus', 10);`),
        ).rejects.toThrow(/check|constraint/i);
    });

    it("rejects negative amounts and overpayments", async () => {
        await expect(
            db.exec(`insert into public.invoices (organization_id, number, status, total, amount_paid) values ('${ORG}', 'INV-2', 'draft', 100, 150);`),
        ).rejects.toThrow(/check|constraint/i);
        await expect(
            db.exec(`insert into public.invoices (organization_id, number, status, total) values ('${ORG}', 'INV-3', 'draft', -5);`),
        ).rejects.toThrow(/check|constraint/i);
        await expect(
            db.exec(`insert into public.payments (organization_id, invoice_id, amount) values ('${ORG}', gen_random_uuid(), 0);`),
        ).rejects.toThrow(/check|constraint|violates foreign key/i);
    });
});
