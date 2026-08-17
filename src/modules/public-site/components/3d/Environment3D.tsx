"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/src/hooks/useTheme';

const count = 600;
const positions = new Float32Array(count * 3);
// Distributed in 3 depth layers
for (let i = 0; i < count; i++) {
  const layer = Math.floor(Math.random() * 3);
  positions[i * 3] = (Math.random() - 0.5) * 16;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 2] = layer * 3 - 5; // z-layers: -5, -2, 1
}

const ParticleSystem = ({ theme }: { theme: string | undefined }) => {
  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (points.current) {
        points.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={theme === 'dark' ? '#38bdf8' : '#4338ca'}
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.2}
      />
    </Points>
  );
};

const DataPath = ({ start, end, theme }: { start: [number, number, number], end: [number, number, number], theme: string | undefined }) => {
    const color = theme === 'dark' ? '#7dd3fc' : '#4f46e5';
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (ref.current) {
            const time = state.clock.getElapsedTime();
            ref.current.position.x = THREE.MathUtils.lerp(start[0], end[0], (Math.sin(time * 0.5) + 1) / 2);
            ref.current.position.y = THREE.MathUtils.lerp(start[1], end[1], (Math.sin(time * 0.5) + 1) / 2);
            ref.current.position.z = THREE.MathUtils.lerp(start[2], end[2], (Math.sin(time * 0.5) + 1) / 2);
        }
    });

    return (
        <>
            <Line points={[start, end]} color={color} lineWidth={0.5} transparent opacity={0.15} />
            <mesh ref={ref}>
                <sphereGeometry args={[0.04]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </>
    );
};

const DataNetwork = ({ theme }: { theme: string | undefined }) => {
  return (
    <group>
        <DataPath start={[-3, 1, 0]} end={[0, 0, 0]} theme={theme} />
        <DataPath start={[3, -1, 0]} end={[0, 0, 0]} theme={theme} />
        <DataPath start={[0, -2, 1]} end={[0, 0, 0]} theme={theme} />
    </group>
  );
};

const Scene = ({ theme }: { theme: string | undefined }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.02} />
      <ambientLight intensity={0.6} />
      <ParticleSystem theme={theme} />
      <DataNetwork theme={theme} />
    </>
  );
};

const Environment3D: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    requestAnimationFrame(() => {
        setHasWebGL(!!gl);
    });
  }, []);

  const content = useMemo(() => {
    if (hasWebGL === null) return null;
    
    if (!hasWebGL) return (
      <div className="w-full h-full flex items-center justify-center text-premium-fg-muted border border-premium-glass-border rounded-[2rem] bg-premium-glass">
          <div className="text-center p-6">
              <div className="text-4xl mb-4 text-premium-accent">✦</div>
              <h3 className="font-bold">Arjun Automation OS</h3>
          </div>
      </div>
    );

    return (
        <Canvas dpr={[1, 2]} camera={{ fov: 40 }}>
          <color attach="background" args={[theme === 'dark' ? '#050508' : '#f8fafc']} />
          <Scene theme={theme} />
        </Canvas>
    );
  }, [hasWebGL, theme]);

  return <div className="w-full h-full relative overflow-hidden rounded-[2rem]">{content}</div>;
};

export default Environment3D;
