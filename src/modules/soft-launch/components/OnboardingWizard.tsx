"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { FIRST_PROJECT_CHECKLIST, ONBOARDING_STEPS } from "@/src/modules/soft-launch/data/launch-assets";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { Input } from "@/src/design-os/components/Input";
import { ProgressIndicator } from "@/src/design-os/motion/components/ProgressIndicator";

const STORAGE_KEY = "aaos.soft-launch.onboarding.v1";

type WizardState = {
    step: number;
    orgName: string;
    orgSlug: string;
    workspaceName: string;
    inviteEmail: string;
    invites: string[];
    checklist: Record<string, boolean>;
};

function loadState(): WizardState {
    if (typeof window === "undefined") {
        return emptyState();
    }
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyState();
        return { ...emptyState(), ...JSON.parse(raw) } as WizardState;
    } catch {
        return emptyState();
    }
}

function emptyState(): WizardState {
    return {
        step: 0,
        orgName: "",
        orgSlug: "",
        workspaceName: "",
        inviteEmail: "",
        invites: [],
        checklist: Object.fromEntries(FIRST_PROJECT_CHECKLIST.map((item) => [item, false])),
    };
}

export function OnboardingWizard() {
    const [state, setState] = useState<WizardState>(() => loadState());

    const persist = (next: WizardState) => {
        setState(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
    };

    const progress = useMemo(() => Math.round(((state.step + 1) / ONBOARDING_STEPS.length) * 100), [state.step]);
    const step = ONBOARDING_STEPS[state.step] ?? ONBOARDING_STEPS[0];

    const next = () => persist({ ...state, step: Math.min(state.step + 1, ONBOARDING_STEPS.length - 1) });
    const back = () => persist({ ...state, step: Math.max(state.step - 1, 0) });

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Soft launch onboarding</p>
                <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{step.title}</h1>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{step.description}</p>
            </div>

            <ProgressIndicator value={progress} label={`Step ${state.step + 1} of ${ONBOARDING_STEPS.length}`} />

            <Card>
                {state.step === 0 ? (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-[var(--dos-text-primary)]">
                            Organization name
                            <Input
                                className="mt-2"
                                value={state.orgName}
                                onChange={(e) =>
                                    persist({
                                        ...state,
                                        orgName: e.target.value,
                                        orgSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                                    })
                                }
                                placeholder="Acme Operations"
                            />
                        </label>
                        <label className="block text-sm font-medium text-[var(--dos-text-primary)]">
                            Organization slug
                            <Input className="mt-2" value={state.orgSlug} onChange={(e) => persist({ ...state, orgSlug: e.target.value })} placeholder="acme-operations" />
                        </label>
                    </div>
                ) : null}

                {state.step === 1 ? (
                    <label className="block text-sm font-medium text-[var(--dos-text-primary)]">
                        Workspace name
                        <Input
                            className="mt-2"
                            value={state.workspaceName}
                            onChange={(e) => persist({ ...state, workspaceName: e.target.value })}
                            placeholder="Primary operations workspace"
                        />
                    </label>
                ) : null}

                {state.step === 2 ? (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                value={state.inviteEmail}
                                onChange={(e) => persist({ ...state, inviteEmail: e.target.value })}
                                placeholder="teammate@company.com"
                                type="email"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    if (!state.inviteEmail.includes("@")) return;
                                    persist({
                                        ...state,
                                        invites: [...state.invites, state.inviteEmail.trim()],
                                        inviteEmail: "",
                                    });
                                }}
                            >
                                Add
                            </Button>
                        </div>
                        <ul className="space-y-2 text-sm text-[var(--dos-text-secondary)]">
                            {state.invites.length === 0 ? <li>No invites yet — add at least one teammate when ready.</li> : null}
                            {state.invites.map((email) => (
                                <li key={email} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] px-3 py-2">
                                    {email}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {state.step === 3 ? (
                    <ul className="space-y-3">
                        {FIRST_PROJECT_CHECKLIST.map((item) => (
                            <li key={item}>
                                <label className="flex items-start gap-3 text-sm text-[var(--dos-text-primary)]">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={Boolean(state.checklist[item])}
                                        onChange={(e) =>
                                            persist({
                                                ...state,
                                                checklist: { ...state.checklist, [item]: e.target.checked },
                                            })
                                        }
                                    />
                                    <span>{item}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button type="button" variant="ghost" onClick={back} disabled={state.step === 0}>
                    Back
                </Button>
                <div className="flex gap-2">
                    {state.step < ONBOARDING_STEPS.length - 1 ? (
                        <Button type="button" onClick={next}>
                            Continue
                        </Button>
                    ) : (
                        <Link href={ROUTES.dashboard}>
                            <Button type="button">Go to dashboard</Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
