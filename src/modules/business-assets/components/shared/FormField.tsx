"use client";

import { Input, type InputProps } from "@/src/design-os/components/Input";
import { Textarea } from "@/src/design-os/components/Textarea";
import { Select } from "@/src/design-os/components/Select";

export function FieldInput({ label, id, ...props }: InputProps & { label: string; id: string }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-[var(--dos-text-primary)]">{label}</label>
            <Input id={id} {...props} />
        </div>
    );
}

export function FieldTextarea({ label, id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; id: string }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-[var(--dos-text-primary)]">{label}</label>
            <Textarea id={id} {...props} />
        </div>
    );
}

export function FieldSelect({
    label,
    id,
    options,
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string; options: { value: string; label: string }[] }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-[var(--dos-text-primary)]">{label}</label>
            <Select id={id} {...props}>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </Select>
        </div>
    );
}
