import { AuthShell } from "@/src/modules/auth/components/AuthShell";

export default function ResetPasswordPage() {
    return <AuthShell mode="reset-password" title="Set a new password" description="Choose a new password for your enterprise account." />;
}
