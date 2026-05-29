"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ParticleBackground() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Dynamic gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-vesak-gold)] opacity-[0.15] blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--color-vesak-purple)] opacity-[0.1] blur-[150px] mix-blend-screen" />
      <div className="absolute top-[40%] right-[10%] w-[30%] h-[40%] rounded-full bg-[var(--color-vesak-blue)] opacity-[0.08] blur-[100px] mix-blend-screen" />

      {/* Floating particles (Lanterns/Light spots) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,165,0,0) 70%)",
            boxShadow: "0 0 20px 2px rgba(255,215,0,0.4)",
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
