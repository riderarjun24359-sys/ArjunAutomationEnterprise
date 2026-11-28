"use client";

import { useCallback, useEffect, useState } from "react";

const PRODUCTS = [
    { key: "school", name: "School Management", description: "Admissions, students, attendance, fees and parent communication" },
    { key: "retail", name: "Retail & POS", description: "Products, inventory, billing, sales and supplier management" },
    { key: "clinic", name: "Clinic Management", description: "Patients, appointments, prescriptions and follow-ups" },
    { key: "business", name: "Business Management", description: "CRM, projects, clients, invoices and operations" },
    { key: "automation", name: "AI Automation", description: "Workflows, WhatsApp integrations, webhooks and AI agents" },
] as const;

type ProductKey = (typeof PRODUCTS)[number]["key"];

export function OrganizationProductsSettings() {
    const [selected, setSelected] = useState<ProductKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [canManage, setCanManage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/organization/products", { cache: "no-store" });
            const body = await response.json() as { products?: unknown; canManage?: boolean; error?: string };
            if (!response.ok) throw new Error(body.error ?? "Could not load product access.");
            const products = Array.isArray(body.products)
                ? body.products.filter((value): value is ProductKey => PRODUCTS.some((product) => product.key === value))
                : [];
            setSelected(products);
            setCanManage(body.canManage === true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load product access.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    function toggle(product: ProductKey, checked: boolean) {
        setSelected((current) => checked
            ? [...current.filter((value) => value !== product), product]
            : current.filter((value) => value !== product));
        setNotice(null);
    }

    async function save() {
        if (selected.length === 0) {
            setError("Keep at least one product enabled.");
            return;
        }
        setSaving(true);
        setError(null);
        setNotice(null);
        try {
            const response = await fetch("/api/organization/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: selected }),
            });
            const body = await response.json() as { error?: string };
            if (!response.ok) throw new Error(body.error ?? "Could not save product access.");
            setNotice("Product access updated successfully.");
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not save product access.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-8">
            <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Organization settings</p>
                <h1 className="text-2xl font-semibold text-[var(--dos-text-primary)]">Products & access</h1>
                <p className="max-w-2xl text-sm text-[var(--dos-text-secondary)]">
                    Choose which Arjun Automation products this organization uses. Disabled products are hidden from navigation and their protected data remains stored but unavailable until re-enabled.
                </p>
            </header>

            {loading ? (
                <div className="rounded-xl border border-[var(--dos-border)] p-6 text-sm text-[var(--dos-text-secondary)]">Loading product access…</div>
            ) : (
                <>
                    <section className="grid gap-3 md:grid-cols-2">
                        {PRODUCTS.map((product) => (
                            <label key={product.key} className="flex cursor-pointer gap-3 rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface)] p-4 transition-colors hover:border-[var(--dos-border-strong)]">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 accent-[var(--dos-accent)]"
                                    checked={selected.includes(product.key)}
                                    disabled={!canManage || saving}
                                    onChange={(event) => toggle(product.key, event.target.checked)}
                                />
                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-[var(--dos-text-primary)]">{product.name}</span>
                                    <span className="mt-1 block text-xs leading-5 text-[var(--dos-text-secondary)]">{product.description}</span>
                                    <span className="mt-2 block text-xs font-medium text-[var(--dos-text-tertiary)]">
                                        {selected.includes(product.key) ? "Enabled" : "Disabled"}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </section>

                    {!canManage && (
                        <p className="text-sm text-[var(--dos-text-secondary)]">Only an organization admin or founder can change product access. You can view the current selection.</p>
                    )}
                    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                    {notice && <p role="status" className="text-sm text-green-700">{notice}</p>}

                    {canManage && (
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => void save()}
                                disabled={saving || selected.length === 0}
                                className="rounded-lg bg-[var(--dos-accent)] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Saving…" : "Save product access"}
                            </button>
                            <span className="text-xs text-[var(--dos-text-tertiary)]">{selected.length} of {PRODUCTS.length} products enabled</span>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
