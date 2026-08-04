"use client";

import { Fragment } from "react";

function inlineFormat(text: string): React.ReactNode[] {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return <code key={index} className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">{part.slice(1, -1)}</code>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
            return <a key={index} href={linkMatch[2]} className="text-indigo-700 underline dark:text-indigo-400">{linkMatch[1]}</a>;
        }
        return <Fragment key={index}>{part}</Fragment>;
    });
}

export function renderMarkdown(content: string): React.ReactNode[] {
    const lines = content.split("\n");
    const nodes: React.ReactNode[] = [];
    let listItems: string[] = [];
    let listType: "ul" | "ol" | null = null;
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let key = 0;

    const flushList = () => {
        if (listItems.length === 0 || !listType) return;
        const Tag = listType === "ol" ? "ol" : "ul";
        nodes.push(
            <Tag key={key++} className={`my-4 ${listType === "ol" ? "list-decimal" : "list-disc"} space-y-1 pl-6`}>
                {listItems.map((item, i) => (
                    <li key={i}>{inlineFormat(item)}</li>
                ))}
            </Tag>,
        );
        listItems = [];
        listType = null;
    };

    for (const line of lines) {
        if (line.startsWith("```")) {
            if (inCodeBlock) {
                nodes.push(
                    <pre key={key++} className="my-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                        <code>{codeLines.join("\n")}</code>
                    </pre>,
                );
                codeLines = [];
                inCodeBlock = false;
            } else {
                flushList();
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            codeLines.push(line);
            continue;
        }

        if (line.trim() === "") {
            flushList();
            continue;
        }

        if (line.startsWith("# ")) {
            flushList();
            nodes.push(<h1 key={key++} className="mb-4 text-3xl font-semibold">{line.slice(2)}</h1>);
            continue;
        }
        if (line.startsWith("## ")) {
            flushList();
            nodes.push(<h2 key={key++} className="mb-3 mt-8 border-b border-slate-200 pb-2 text-2xl font-semibold dark:border-slate-700">{line.slice(3)}</h2>);
            continue;
        }
        if (line.startsWith("### ")) {
            flushList();
            nodes.push(<h3 key={key++} className="mb-2 mt-6 text-xl font-semibold">{line.slice(4)}</h3>);
            continue;
        }

        if (line.startsWith("> ")) {
            flushList();
            nodes.push(
                <blockquote key={key++} className="my-4 border-l-4 border-indigo-300 pl-4 italic text-slate-600 dark:border-indigo-600 dark:text-slate-400">
                    {inlineFormat(line.slice(2))}
                </blockquote>,
            );
            continue;
        }

        if (line.startsWith("---")) {
            flushList();
            nodes.push(<hr key={key++} className="my-8 border-slate-200 dark:border-slate-700" />);
            continue;
        }

        const ulMatch = line.match(/^[-*]\s+(.*)/);
        if (ulMatch) {
            if (listType !== "ul") {
                flushList();
                listType = "ul";
            }
            listItems.push(ulMatch[1] ?? "");
            continue;
        }

        const olMatch = line.match(/^\d+\.\s+(.*)/);
        if (olMatch) {
            if (listType !== "ol") {
                flushList();
                listType = "ol";
            }
            listItems.push(olMatch[1] ?? "");
            continue;
        }

        if (line.startsWith("|")) {
            flushList();
            nodes.push(
                <p key={key++} className="my-2 overflow-x-auto font-mono text-sm text-slate-700 dark:text-slate-300">
                    {line}
                </p>,
            );
            continue;
        }

        const checkboxMatch = line.match(/^- \[([ x])\]\s+(.*)/);
        if (checkboxMatch) {
            if (listType !== "ul") {
                flushList();
                listType = "ul";
            }
            const checked = checkboxMatch[1] === "x";
            listItems.push(`${checked ? "☑" : "☐"} ${checkboxMatch[2]}`);
            continue;
        }

        flushList();
        nodes.push(<p key={key++} className="my-3 leading-relaxed">{inlineFormat(line)}</p>);
    }

    flushList();
    if (inCodeBlock && codeLines.length > 0) {
        nodes.push(
            <pre key={key++} className="my-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                <code>{codeLines.join("\n")}</code>
            </pre>,
        );
    }

    return nodes;
}
