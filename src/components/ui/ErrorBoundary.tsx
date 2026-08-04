"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "@/src/design-os/components/ErrorState";

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
                <ErrorState
                    title="Dashboard temporarily unavailable"
                    description="We could not render the executive overview. Please try again shortly."
                    onRetry={() => this.setState({ hasError: false })}
                />
            );
        }

        return this.props.children;
    }
}
