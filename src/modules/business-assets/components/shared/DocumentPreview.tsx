"use client";

interface DocumentPreviewProps {
    content: string;
    title?: string;
}

export function DocumentPreview({ content, title }: DocumentPreviewProps) {
    return (
        <div
            className="max-h-[480px] overflow-y-auto rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-6"
            aria-label={title ? `Preview: ${title}` : "Document preview"}
        >
            {title && <h3 className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">{title}</h3>}
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--dos-text-secondary)]">{content}</pre>
        </div>
    );
}
