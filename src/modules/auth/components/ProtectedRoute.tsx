"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { useAuthStore } from "@/src/store/auth.store";
import { ROUTES } from "@/src/constants/routes";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRouteContent({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isHydrated = useAuthStore((state) => state.isHydrated);

    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.replace(`${ROUTES.auth.signIn}?redirectTo=${encodeURIComponent(window.location.pathname)}`);
        }
    }, [isAuthenticated, isHydrated, router]);

    if (!isHydrated) {
        return <LoadingState label="Checking authentication" />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    return (
        <Suspense fallback={<LoadingState label="Checking authentication" />}>
            <ProtectedRouteContent>{children}</ProtectedRouteContent>
        </Suspense>
    );
}
