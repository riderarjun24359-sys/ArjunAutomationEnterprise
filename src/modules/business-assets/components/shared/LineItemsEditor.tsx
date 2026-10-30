"use client";

import { Button } from "@/src/design-os/components/Button";
import { Input } from "@/src/design-os/components/Input";
import type { LineItem } from "../../types";

interface LineItemsEditorProps {
    items: LineItem[];
    onChange: (items: LineItem[]) => void;
    currency?: string;
}

export function LineItemsEditor({ items, onChange, currency = "INR" }: LineItemsEditorProps) {
    const update = (id: string, field: keyof LineItem, value: string | number) => {
        onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    const add = () => {
        onChange([...items, { id: `li-${Date.now()}`, description: "", quantity: 1, unitPrice: 0 }]);
    };

    const remove = (id: string) => {
        if (items.length <= 1) return;
        onChange(items.filter((item) => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    return (
        <div className="space-y-4" aria-label="Line items editor">
            {items.map((item, index) => (
                <div key={item.id} className="grid gap-3 rounded-lg border border-[var(--dos-border)] p-4 sm:grid-cols-12">
                    <div className="sm:col-span-5">
                        <label htmlFor={`desc-${item.id}`} className="sr-only">Description row {index + 1}</label>
                        <Input
                            id={`desc-${item.id}`}
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => update(item.id, "description", e.target.value)}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity row {index + 1}</label>
                        <Input
                            id={`qty-${item.id}`}
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => update(item.id, "quantity", Number(e.target.value))}
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor={`price-${item.id}`} className="sr-only">Unit price row {index + 1}</label>
                        <Input
                            id={`price-${item.id}`}
                            type="number"
                            placeholder="Unit price"
                            value={item.unitPrice}
                            onChange={(e) => update(item.id, "unitPrice", Number(e.target.value))}
                        />
                    </div>
                    <div className="flex items-center justify-between sm:col-span-2">
                        <span className="text-sm text-[var(--dos-text-secondary)]">
                            {currency} {(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                        <Button variant="ghost" onClick={() => remove(item.id)} aria-label={`Remove row ${index + 1}`}>
                            Remove
                        </Button>
                    </div>
                </div>
            ))}
            <div className="flex items-center justify-between">
                <Button variant="secondary" onClick={add} aria-label="Add line item">
                    Add Line Item
                </Button>
                <p className="text-sm font-medium text-[var(--dos-text-primary)]">
                    Subtotal: {currency} {subtotal.toFixed(2)}
                </p>
            </div>
        </div>
    );
}
