"use client";

import { useState } from "react";
import { Button } from "@/src/design-os/components/Button";
import { Input } from "@/src/design-os/components/Input";
import { Textarea } from "@/src/design-os/components/Textarea";
import { EmptyState } from "@/src/design-os/components/EmptyState";

export function FeedbackForm() {
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    if (submitted) {
        return <EmptyState title="Feedback received" description="Thanks — your soft-launch feedback was captured locally for the support team." />;
    }

    return (
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@") || message.trim().length < 8) return;
                setSubmitted(true);
            }}
        >
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Name" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required aria-label="Email" />
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share feedback about soft launch..." required aria-label="Feedback" rows={5} />
            <Button type="submit">Submit feedback</Button>
        </form>
    );
}
