export const ORGANIZATION_TABS = {
    overview: "overview",
    workspaces: "workspaces",
    members: "members",
    invitations: "invitations",
    settings: "settings",
} as const;

export const ROLE_OPTIONS = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "member", label: "Member" },
    { value: "viewer", label: "Viewer" },
] as const;
