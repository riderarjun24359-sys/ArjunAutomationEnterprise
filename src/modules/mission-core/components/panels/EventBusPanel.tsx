"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { Select } from "@/src/design-os/components/Select";
import { PLATFORM_EVENTS } from "../../constants";
import { useMissionCore } from "../../hooks/useMissionCore";

export function EventBusPanel() {
    const { events, capabilities, publishEvent, subscribeToEvents, actionLoading } = useMissionCore();
    const [eventType, setEventType] = useState<string>(PLATFORM_EVENTS[0]);
    const [source, setSource] = useState("mission-core");
    const [subscribeCap, setSubscribeCap] = useState("clientSuccess");

    const handlePublish = () => {
        void publishEvent(eventType, source, { publishedAt: new Date().toISOString() });
    };

    const handleSubscribe = () => {
        subscribeToEvents(subscribeCap, [eventType, "*"]);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Publish Event</h3>
                    <div className="space-y-3">
                        <Select value={eventType} onChange={(e) => setEventType(e.target.value)} aria-label="Event type">
                            {PLATFORM_EVENTS.map((evt) => (
                                <option key={evt} value={evt}>{evt}</option>
                            ))}
                        </Select>
                        <Select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Source capability">
                            {capabilities.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Select>
                        <Button onClick={handlePublish} disabled={actionLoading}>Publish</Button>
                    </div>
                </Card>
                <Card>
                    <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Subscribe</h3>
                    <div className="space-y-3">
                        <Select value={subscribeCap} onChange={(e) => setSubscribeCap(e.target.value)} aria-label="Subscribe capability">
                            {capabilities.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Select>
                        <Button variant="secondary" onClick={handleSubscribe}>Subscribe to {eventType}</Button>
                    </div>
                </Card>
            </div>

            <div>
                <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Event Log</h3>
                <div className="space-y-2">
                    {events.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-secondary)]">No events yet.</p>
                    ) : (
                        events.slice().reverse().map((evt) => (
                            <Card key={evt.id}>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-[var(--dos-text-primary)]">{evt.type}</span>
                                    <Badge variant="info">{evt.source}</Badge>
                                </div>
                                <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">
                                    {evt.timestamp} · {evt.id}
                                </p>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
