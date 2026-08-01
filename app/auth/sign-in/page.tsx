import { AuthShell } from "@/src/modules/auth/components/AuthShell";

export default function SignInPage() {
    return <AuthShell mode="sign-in" title="Welcome back" description="Sign in to your enterprise workspace with secure Supabase authentication." />;
}
