import { AuthShell } from "@/src/modules/auth/components/AuthShell";

export default function ForgotPasswordPage() {
    return <AuthShell mode="forgot-password" title="Recover your access" description="Enter your email to receive a password recovery link." />;
}
