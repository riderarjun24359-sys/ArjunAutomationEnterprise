"use client";

import { useCallback, useState } from "react";
import { CRITICAL_ACTION_PREFIXES } from "../constants";
import { executiveCommandCenterService } from "../services/executive-command-center.service";
import type { CopilotMessage, ExecutiveCommandCenterSnapshot } from "../types";

function isCriticalAction(text: string): boolean {
    const lower = text.toLowerCase();
    return CRITICAL_ACTION_PREFIXES.some((prefix) => lower.startsWith(prefix) || lower.includes(` ${prefix} `));
}

function buildAssistantReply(snapshot: ExecutiveCommandCenterSnapshot, userMessage: string): CopilotMessage {
    const ctx = executiveCommandCenterService.buildCopilotContext(snapshot);
    const critical = isCriticalAction(userMessage);

    let content = `Based on ${ctx.organizationName} signals (unified score ${ctx.unifiedScore}%):\n\n`;

    if (ctx.topRisks.length) {
        content += `**Risks:** ${ctx.topRisks.join("; ")}\n\n`;
    }
    if (ctx.topOpportunities.length) {
        content += `**Opportunities:** ${ctx.topOpportunities.join("; ")}\n\n`;
    }
    if (ctx.pendingRecommendations > 0) {
        content += `There are ${ctx.pendingRecommendations} recommendations awaiting review. I can summarize them but will not execute critical actions without your approval.\n\n`;
    }

    if (/risk|security|debt|architecture/i.test(userMessage)) {
        content += "CTO Intelligence suggests reviewing security posture and EIP failure logs if scores drop below target.";
    } else if (/revenue|sales|pipeline|forecast/i.test(userMessage)) {
        content += "Business Intelligence: review revenue forecasts in EIP and open proposals in the Business Platform.";
    } else if (/client|renewal|support/i.test(userMessage)) {
        content += "Customer Intelligence: check pending AI recommendations and scheduled consultations.";
    } else if (/project|schedule|delivery|milestone/i.test(userMessage)) {
        content += "Project Intelligence: triage open tasks and review active project count against team capacity.";
    } else {
        content += snapshot.brief.summary;
    }

    if (critical) {
        content += "\n\n⚠️ This request may involve a critical action. Approval is required before execution.";
    }

    return {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content,
        requiresApproval: critical,
        timestamp: new Date().toISOString(),
    };
}

export function useExecutiveCopilot(snapshot: ExecutiveCommandCenterSnapshot | null) {
    const [messages, setMessages] = useState<CopilotMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Executive Copilot ready. I know your business, architecture, clients, and operations. Ask for recommendations — critical actions require your approval.",
            timestamp: new Date().toISOString(),
        },
    ]);
    const [pendingApproval, setPendingApproval] = useState<CopilotMessage | null>(null);

    const sendMessage = useCallback(
        (text: string) => {
            const trimmed = text.trim();
            if (!trimmed) return;

            const userMsg: CopilotMessage = {
                id: `user-${Date.now()}`,
                role: "user",
                content: trimmed,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, userMsg]);

            if (!snapshot) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `assistant-${Date.now()}`,
                        role: "assistant",
                        content: "Connect your workspace to receive contextual executive intelligence.",
                        timestamp: new Date().toISOString(),
                    },
                ]);
                return;
            }

            const reply = buildAssistantReply(snapshot, trimmed);
            if (reply.requiresApproval) {
                setPendingApproval(reply);
            } else {
                setMessages((prev) => [...prev, reply]);
            }
        },
        [snapshot],
    );

    const approvePending = useCallback(() => {
        if (pendingApproval) {
            setMessages((prev) => [...prev, { ...pendingApproval, approved: true }]);
            setPendingApproval(null);
        }
    }, [pendingApproval]);

    const dismissPending = useCallback(() => setPendingApproval(null), []);

    return { messages, sendMessage, pendingApproval, approvePending, dismissPending };
}
