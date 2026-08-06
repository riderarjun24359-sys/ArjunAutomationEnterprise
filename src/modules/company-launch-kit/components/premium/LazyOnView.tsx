"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

type LazyOnViewProps = {
    loader: () => Promise<{ default: ComponentType }>;
    minHeight?: string;
    rootMargin?: string;
};

/** Loads section JS only when near viewport — reduces initial TBT. */
export function LazyOnView({ loader, minHeight = "32rem", rootMargin = "200px 0px" }: LazyOnViewProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [Component, setComponent] = useState<ComponentType | null>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node || Component) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                observer.disconnect();
                void loader().then((mod) => setComponent(() => mod.default));
            },
            { rootMargin, threshold: 0.01 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [Component, loader, rootMargin]);

    return (
        <div ref={ref} style={{ minHeight: Component ? undefined : minHeight }} aria-hidden={!Component}>
            {Component ? <Component /> : null}
        </div>
    );
}
