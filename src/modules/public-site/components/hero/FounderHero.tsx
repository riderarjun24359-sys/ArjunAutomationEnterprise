"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FounderAsset } from '../founder/FounderAsset';

const Environment3D = dynamic(() => import('../3d/Environment3D'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-premium-bg-secondary animate-pulse rounded-2xl" />
});

export const FounderHero: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseXPos = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseYPos = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(mouseXPos);
        mouseY.set(mouseYPos);
    };

    return (
        <section 
            className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden premium-aurora"
            onMouseMove={handleMouseMove}
        >
            <div className="premium-container relative w-full h-[80vh] flex flex-col lg:flex-row items-center gap-12">
                
                {/* Content Layer */}
                <div className="flex-1 z-20 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
                            Run Your Business <br />
                            <span className="premium-gradient-text">On One Platform.</span>
                        </h1>
                    </motion.div>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg md:text-xl text-premium-fg-muted max-w-lg"
                    >
                        Arjun Automation replaces fragmented tools with a unified operating system — CRM, projects, finance, and industry workflows in one secure platform.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                    >
                        <button className="bg-premium-accent text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition shadow-lg">
                            Get Started
                        </button>
                    </motion.div>
                </div>

                {/* Spatial Experience Layer */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="flex-1 w-full h-full relative"
                    style={{ perspective: 1500 }}
                >
                    <div className="absolute inset-0">
                        <Suspense fallback={<div className="w-full h-full bg-premium-bg-secondary animate-pulse rounded-[2rem]" />}>
                            <Environment3D />
                        </Suspense>
                    </div>
                    <motion.div 
                        className="absolute inset-4 lg:inset-8 z-10"
                        style={{ rotateX, rotateY }}
                    >
                        <FounderAsset />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
