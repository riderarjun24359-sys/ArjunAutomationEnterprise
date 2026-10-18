import Link from "next/link";
import type { ReactNode } from "react";

function renderInline(text: string) {
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        const href = match[2];
        const isExternal = href.startsWith("http");
        parts.push(
            isExternal ? (
                <a key={match.index} href={href} className="text-orange-500 hover:text-orange-600" target="_blank" rel="noopener noreferrer">
                    {match[1]}
                </a>
            ) : (
                <Link key={match.index} href={href} className="text-orange-500 hover:text-orange-600">
                    {match[1]}
                </Link>
            ),
        );
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}

export function MarkdownContent({ content }: { content: string }) {
    const blocks = content.split("\n\n");

    return (
        <div className="space-y-4">
            {blocks.map((block, i) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith("## ")) {
                    return (
                        <h2 key={i} className="mt-8 text-xl font-semibold text-orange-950">
                            {trimmed.slice(3)}
                        </h2>
                    );
                }

                if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                    return (
                        <p key={i} className="font-semibold text-orange-950">
                            {trimmed.slice(2, -2)}
                        </p>
                    );
                }

                if (trimmed.startsWith("- ")) {
                    const items = trimmed.split("\n").filter((line) => line.startsWith("- "));
                    return (
                        <ul key={i} className="list-disc space-y-1 pl-6 text-slate-600">
                            {items.map((item, j) => (
                                <li key={j}>{renderInline(item.slice(2))}</li>
                            ))}
                        </ul>
                    );
                }

                return (
                    <p key={i} className="text-slate-600 leading-relaxed">
                        {renderInline(trimmed)}
                    </p>
                );
            })}
        </div>
    );
}
