"use client";

import { Bell } from "lucide-react";
import { Dropdown, DropdownItem } from "@/src/design-os/components/Dropdown";
import { Badge } from "@/src/design-os/components/Badge";

export function NotificationCenter({ count = 0, items }: { count?: number; items: { id: string; title: string; time: string }[] }) {
    return (
        <Dropdown
            trigger={
                <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] text-[var(--dos-text-secondary)] hover:text-[var(--dos-text-primary)]" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {count > 0 ? <Badge variant="error" className="absolute -right-1 -top-1 min-w-[18px] justify-center px-1 py-0 text-[10px]">{count}</Badge> : null}
                </button>
            }
        >
            {items.length === 0 ? <DropdownItem>No notifications</DropdownItem> : items.map((item) => (
                <DropdownItem key={item.id}>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-[var(--dos-text-tertiary)]">{item.time}</p>
                </DropdownItem>
            ))}
        </Dropdown>
    );
}
