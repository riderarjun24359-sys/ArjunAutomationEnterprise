"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type ParticleFieldProps = {
    className?: string;
    count?: number;
};

export function ParticleField({ className, count }: ParticleFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const isMobile = window.innerWidth < 768;
        const particleCount = count ?? (isMobile ? 30 : 80);
        let animationId: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth * devicePixelRatio;
            canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        };

        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.2,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
                ctx.fill();
            }
            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, [reduced, count]);

    if (reduced) return null;

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
