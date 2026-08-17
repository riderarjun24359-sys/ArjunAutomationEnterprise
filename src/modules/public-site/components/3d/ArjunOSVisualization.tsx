"use client";

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Box } from '@react-three/drei';

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      
      {/* Premium Arjun Automation OS Visualization */}
      <group>
          <Box args={[1.5, 1.5, 1.5]}>
              <meshStandardMaterial color="#4338ca" wireframe={false} metalness={0.6} roughness={0.2} />
          </Box>
          <Box args={[2, 2, 2]}>
              <meshStandardMaterial color="#06b6d4" wireframe={true} transparent opacity={0.3} />
          </Box>
      </group>
    </>
  );
};

export const ArjunOSVisualization: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    requestAnimationFrame(() => {
        setHasWebGL(!!gl);
    });
  }, []);

  const content = useMemo(() => {
    if (hasWebGL === null) return <div className="w-full h-full bg-premium-bg-secondary animate-pulse rounded-2xl" />;
    
    if (!hasWebGL) return (
      <div className="w-full h-full bg-premium-bg-secondary flex items-center justify-center text-premium-fg-muted rounded-2xl border border-premium-glass-border">
          <div className="text-center p-6">
              <div className="text-4xl mb-4 text-premium-accent">✦</div>
              <h3 className="font-bold mb-2">Arjun Automation OS</h3>
              <p className="text-sm">Enterprise Intelligence Platform</p>
          </div>
      </div>
    );

    return (
      <Suspense fallback={<div className="w-full h-full bg-premium-bg-secondary animate-pulse rounded-2xl" />}>
        <Canvas className="w-full h-full" dpr={[1, 2]}>
          <Scene />
        </Canvas>
      </Suspense>
    );
  }, [hasWebGL]);

  return <div className="w-full h-full relative min-h-[400px]">{content}</div>;
};
