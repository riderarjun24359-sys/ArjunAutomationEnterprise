"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import { FIRST_PROJECT_CHECKLIST, ONBOARDING_STEPS } from "@/src/modules/soft-launch/data/launch-assets";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { Input } from "@/src/design-os/components/Input";
import { Select } from "@/src/design-os/components/Select";
import { LoadingState } from "@/src/design-os/components/LoadingState";
import { ProgressIndicator } from "@/src/design-os/motion/components/ProgressIndicator";

type ServerOrg = { id: string; name: string; slug: string; status: string } | null;
type ServerTeam = { id: string; name: string; slug: string };
type ServerInvite = { id: string; email: string; roleName: string; status: string; expiresAt: string | null };
type MyInvite = ServerInvite & { organization: { name: string; slug: string } | null };

async function readJson(res: Response): Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> {
    let body: Record<string, unknown> = {};
    try {
        body = (await res.json()) as Record<string, unknown>;
    } catch {
        body = {};
    }
    return { ok: res.ok, status: res.status, body };
}

export function OnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [org, setOrg] = useState<ServerOrg>(null);
    const [teams, setTeams] = useState<ServerTeam[]>([]);
    const [invites, setInvites] = useState<ServerInvite[]>([]);
    const [myInvites, setMyInvites] = useState<MyInvite[]>([]);
    const [orgName, setOrgName] = useState("");
    const [orgSlug, setOrgSlug] = useState("");
    const [teamName, setTeamName] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");
    const [actionError, setActionError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [checklist, setChecklist] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(FIRST_PROJECT_CHECKLIST.map((item) => [item, false])),
    );

    // Pure fetch: no state updates, safe to call from any path.
    const fetchState = useCallback(async () => {
        const [statusRes, mineRes, teamsRes, invitesRes] = await Promise.all([
            fetch("/api/organization/provision", { cache: "no-store" }),
            fetch("/api/organization/invitations/mine", { cache: "no-store" }),
            fetch("/api/organization/teams", { cache: "no-store" }),
            fetch("/api/organization/invitations", { cache: "no-store" }),
        ]);
        return {
            status: await readJson(statusRes),
            mine: await readJson(mineRes),
            teams: await readJson(teamsRes),
            invites: await readJson(invitesRes),
        };
    }, []);

    type WizardStateParts = Awaited<ReturnType<typeof fetchState>>;

    const applyState = useCallback(
        (parts: WizardStateParts) => {
            if (parts.status.status === 401) {
                router.replace(ROUTES.auth.signIn);
                return;
            }
            if (!parts.status.ok) throw new Error("Could not load organization state.");
            setOrg(parts.status.body.organization as ServerOrg);
            setMyInvites(parts.mine.ok ? ((parts.mine.body.invitations as MyInvite[]) ?? []) : []);
            setTeams(parts.teams.ok ? ((parts.teams.body.teams as ServerTeam[]) ?? []) : []);
            setInvites(parts.invites.ok ? ((parts.invites.body.invitations as ServerInvite[]) ?? []) : []);
        },
        [router],
    );

    // Event-path reload with spinner (retry button, post-action refreshes).
    const refresh = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            applyState(await fetchState());
        } catch {
            setLoadError("Could not load organization state. Check your connection and retry.");
        } finally {
            setLoading(false);
        }
    }, [applyState, fetchState]);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const parts = await fetchState();
                if (!cancelled) applyState(parts);
            } catch {
                if (!cancelled) setLoadError("Could not load organization state. Check your connection and retry.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, [applyState, fetchState]);

    // Already provisioned: onboarding is done — hand off to the dashboard.
    useEffect(() => {
        if (!loading && !loadError && org) {
            router.replace(ROUTES.dashboard);
        }
    }, [loading, loadError, org, router]);

    const progress = useMemo(() => Math.round(((step + 1) / ONBOARDING_STEPS.length) * 100), [step]);
    const stepMeta = ONBOARDING_STEPS[step] ?? ONBOARDING_STEPS[0];

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <LoadingState />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <Card>
                    <p className="text-sm text-[var(--dos-text-primary)]">{loadError}</p>
                    <div className="mt-4">
                        <Button type="button" onClick={() => void refresh()}>
                            Retry
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (org) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <Card>
                    <p className="text-sm text-[var(--dos-text-primary)]">
                        {org.name} is ready — taking you to your dashboard.
                    </p>
                </Card>
            </div>
        );
    }

    const runAction = async (fn: () => Promise<string | null>) => {
        setBusy(true);
        setActionError(null);
        try {
            const failure = await fn();
            if (failure) {
                setActionError(failure);
            } else {
                await refresh();
            }
        } catch {
            setActionError("Something went wrong. Please retry.");
        } finally {
            setBusy(false);
        }
    };

    const provision = () =>
        runAction(async () => {
            const res = await fetch("/api/organization/provision", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name: orgName, slug: orgSlug || undefined }),
            });
            const { ok, status, body } = await readJson(res);
            if (ok) return null;
            if (status === 409) return "That organization slug is taken — try another.";
            return String(body.detail ?? body.error ?? "Provisioning failed.");
        });

    const createTeam = () =>
        runAction(async () => {
            const res = await fetch("/api/organization/teams", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name: teamName }),
            });
            const { ok, status, body } = await readJson(res);
            if (ok) {
                setTeamName("");
                return null;
            }
            if (status === 409) return "A workspace with that name already exists here.";
            return String(body.detail ?? body.error ?? "Workspace creation failed.");
        });

    const sendInvite = () =>
        runAction(async () => {
            const res = await fetch("/api/organization/invitations", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email: inviteEmail, roleName: inviteRole }),
            });
            const { ok, body } = await readJson(res);
            if (ok) {
                setInviteEmail("");
                return null;
            }
            return String(body.detail ?? body.error ?? "Invitation failed.");
        });

    const acceptInvite = (invitationId: string) =>
        runAction(async () => {
            const res = await fetch("/api/organization/invitations/accept", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ invitationId }),
            });
            const { ok, body } = await readJson(res);
            if (ok) return null;
            return String(body.error ?? "Accept failed.");
        });

    const next = () => setStep((s) => Math.min(s + 1, ONBOARDING_STEPS.length - 1));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Soft launch onboarding</p>
                <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{stepMeta.title}</h1>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{stepMeta.description}</p>
            </div>

            <ProgressIndicator value={progress} label={`Step ${step + 1} of ${ONBOARDING_STEPS.length}`} />

            {actionError ? (
                <Card>
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                        {actionError}
                    </p>
                </Card>
            ) : null}

            <Card>
                {myInvites.length > 0 ? (
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-[var(--dos-text-primary)]">
                            You have pending workspace invitations — accept one to join instead of creating a new organization.
                        </p>
                        <ul className="space-y-2">
                            {myInvites.map((invite) => (
                                <li
                                    key={invite.id}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] px-3 py-2 text-sm"
                                >
                                    <span className="text-[var(--dos-text-secondary)]">
                                        {invite.organization?.name ?? "Unknown workspace"} · {invite.roleName} · expires{" "}
                                        {invite.expiresAt ?? "—"}
                                    </span>
                                    <Button type="button" variant="secondary" disabled={busy} onClick={() => void acceptInvite(invite.id)}>
                                        Accept & join
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {step === 0 ? (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-[var(--dos-text-primary)]">
                            Organization name
                            <Input
                                className="mt-2"
                                value={orgName}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setOrgName(name);
                                    setOrgSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                                }}
                                placeholder="Acme Operations"
                            />
                        </label>
                        <label className="block text-sm font-medium text-[var(--dos-text-primary)]">
                            Organization slug
                            <Input
                                className="mt-2"
                                value={orgSlug}
                                onChange={(e) => setOrgSlug(e.target.value)}
                                placeholder="acme-operations"
                            />
                        </label>
                        <Button type="button" disabled={busy || !orgName.trim()} onClick={() => void provision()}>
                            Create organization
                        </Button>
                        <p className="text-xs text-[var(--dos-text-tertiary)]">
                            Creates your tenant and makes you its founder. Safe to retry — you will never get two organizations.
                        </p>
                    </div>
                ) : null}

                {step === 1 ? (
                    <div className="space-y-4">
                        <p className="text-sm text-[var(--dos-text-secondary)]">
                            Workspaces organize teams inside your organization. This step is optional — you can skip it.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Primary operations workspace"
                            />
                            <Button type="button" variant="secondary" disabled={busy || !teamName.trim()} onClick={() => void createTeam()}>
                                Add
                            </Button>
                        </div>
                        <ul className="space-y-2 text-sm text-[var(--dos-text-secondary)]">
                            {teams.length === 0 ? <li>No workspaces yet.</li> : null}
                            {teams.map((team) => (
                                <li key={team.id} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] px-3 py-2">
                                    {team.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {step === 2 ? (
                    <div className="space-y-4">
                        <p className="text-sm text-[var(--dos-text-secondary)]">
                            Invite teammates by email. They join by signing in and accepting from this page — no email
                            delivery is configured yet, so share the invite out-of-band.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="teammate@company.com"
                                type="email"
                            />
                            <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} aria-label="Invite role">
                                <option value="viewer">Viewer</option>
                                <option value="member">Member</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </Select>
                            <Button type="button" variant="secondary" disabled={busy || !inviteEmail.includes("@")} onClick={() => void sendInvite()}>
                                Invite
                            </Button>
                        </div>
                        <ul className="space-y-2 text-sm text-[var(--dos-text-secondary)]">
                            {invites.length === 0 ? <li>No invites yet.</li> : null}
                            {invites.map((invite) => (
                                <li key={invite.id} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] px-3 py-2">
                                    {invite.email} · {invite.roleName} · {invite.status}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {step === 3 ? (
                    <div className="space-y-4">
                        <ul className="space-y-2 text-sm">
                            <li className="text-[var(--dos-text-primary)]">Organization provisioned — this page only appears once it is.</li>
                            <li className="text-[var(--dos-text-primary)]">
                                {teams.length > 0 ? `${teams.length} workspace(s) ready.` : "No workspace yet (optional)."}
                            </li>
                            <li className="text-[var(--dos-text-primary)]">
                                {invites.length > 0 ? `${invites.length} invite(s) recorded.` : "No invites sent (optional)."}
                            </li>
                        </ul>
                        <ul className="space-y-3">
                            {FIRST_PROJECT_CHECKLIST.map((item) => (
                                <li key={item}>
                                    <label className="flex items-start gap-3 text-sm text-[var(--dos-text-primary)]">
                                        <input
                                            type="checkbox"
                                            className="mt-1"
                                            checked={Boolean(checklist[item])}
                                            onChange={(e) => setChecklist({ ...checklist, [item]: e.target.checked })}
                                        />
                                        <span>{item}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
                    Back
                </Button>
                <div className="flex gap-2">
                    {step < ONBOARDING_STEPS.length - 1 ? (
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
