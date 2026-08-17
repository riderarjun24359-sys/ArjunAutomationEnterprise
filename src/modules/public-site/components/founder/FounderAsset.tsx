"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * FounderAsset Architectural Slot
 * 
 * Designed as a permanent, integrated component within the cinematic hero.
 * It uses atmospheric lighting and composition to hold the future verified asset.
 */
export const FounderAsset: React.FC = () => {
    return (
        <motion.div 
            className="w-full h-full relative overflow-hidden rounded-[2rem] flex items-end justify-center border border-premium-glass-border shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        >
            {/* Atmospheric Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-premium-accent/10 via-premium-bg-primary/20 to-premium-bg-primary" />
            
            {/* Silhouette/Abstract Representation Slot */}
            <div className="w-[80%] h-[90%] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-premium-accent/30 to-transparent rounded-t-[2rem] opacity-50" />
            </div>
            
            {/* Ambient Lighting FX */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-premium-accent/20 blur-[80px] rounded-full" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-premium-mesh-2/20 blur-[80px] rounded-full" />
        </motion.div>
    );
};
