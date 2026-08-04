"use client";

import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/src/design-os/components/Button";

interface SignaturePadProps {
    value?: string;
    onChange: (dataUrl: string | undefined) => void;
    label?: string;
}

export function SignaturePad({ value, onChange, label = "Digital Signature" }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);

    useEffect(() => {
        if (value && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            const img = new Image();
            img.onload = () => ctx?.drawImage(img, 0, 0);
            img.src = value;
        }
    }, [value]);

    const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        if ("touches" in e) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        drawing.current = true;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { x, y } = getPos(e, canvas);
        ctx.beginPath();
        ctx.moveTo(x, y);
    }, []);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!drawing.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { x, y } = getPos(e, canvas);
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#1e293b";
        ctx.lineTo(x, y);
        ctx.stroke();
    }, []);

    const endDraw = useCallback(() => {
        drawing.current = false;
        const canvas = canvasRef.current;
        if (canvas) onChange(canvas.toDataURL("image/png"));
    }, [onChange]);

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        onChange(undefined);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--dos-text-primary)]">{label}</label>
            <canvas
                ref={canvasRef}
                width={400}
                height={120}
                className="w-full max-w-md cursor-crosshair rounded-lg border border-[var(--dos-border)] bg-white dark:bg-slate-900"
                aria-label={label}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
            />
            <Button variant="ghost" onClick={clear} aria-label="Clear signature">
                Clear Signature
            </Button>
        </div>
    );
}
