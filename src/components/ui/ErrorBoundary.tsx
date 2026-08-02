"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Dashboard error boundary", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                    <p className="font-semibold">Dashboard temporarily unavailable</p>
                    <p className="mt-2">We could not render the executive overview. Please try again shortly.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
