import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { X, RotateCcw } from 'lucide-react';

export const ProjectVideoScreen: React.FC = () => {
  const { leaves, activeLeafId, completeLeaf, isMuted } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [inaugurationProgress, setInaugurationProgress] = useState(0);

  const activeLeaf = leaves.find((l) => l.id === activeLeafId);

  useEffect(() => {
    if (!activeLeaf) return;
    // Reset states on active leaf change
    setUseFallback(false);
    setInaugurationProgress(0);
  }, [activeLeafId, activeLeaf]);

  // Procedural fallback animation loop
  useEffect(() => {
    if (!useFallback || !activeLeaf) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class for golden spiral orbit
    interface GoldenParticle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      alpha: number;
      rotationSpeed: number;
    }

    const particles: GoldenParticle[] = Array.from({ length: 150 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 180 + 80,
      speed: Math.random() * 0.02 + 0.005,
      size: Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.7 + 0.3,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
    }));

    let progress = 0;
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // trails
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Orbiting Gold Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        p.radius -= 0.15; // spiral inwards
        if (p.radius < 5) {
          p.radius = Math.random() * 180 + 120; // reset outwards
        }

        const px = centerX + Math.cos(p.angle) * p.radius;
        const py = centerY + Math.sin(p.angle) * p.radius;

        ctx.fillStyle = '#D9C47A'; // Leaf glow gold
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw circular loader
      const ringRadius = 150;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Active gold progress arc
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        ringRadius,
        -Math.PI / 2,
        -Math.PI / 2 + (progress / 100) * Math.PI * 2
      );
      ctx.stroke();

      // Increment progress
      if (progress < 100) {
        progress += 0.22; // ~7.5 seconds
        setInaugurationProgress(Math.min(100, Math.floor(progress)));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Complete the inauguration automatically upon 100% progress
        completeLeaf(activeLeaf.id);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [useFallback, activeLeaf, completeLeaf]);

  const handleClose = () => {
    if (activeLeaf) {
      completeLeaf(activeLeaf.id);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else if (useFallback) {
      // Reset progress
      setInaugurationProgress(0);
      setUseFallback(false);
      setTimeout(() => setUseFallback(true), 50); // Re-trigger canvas
    }
  };

  const handleVideoEnded = () => {
    if (activeLeaf) {
      completeLeaf(activeLeaf.id);
    }
  };

  const handleVideoError = () => {
    console.warn(
      `Project video '${activeLeaf?.videoSrc}' not found. Falling back to gold particle inauguration overlay.`
    );
    setUseFallback(true);
  };

  if (!activeLeaf) return null;

  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-bg-dark z-50 flex flex-col justify-between select-none overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-8 bg-gradient-to-b from-bg-dark via-bg-dark/85 to-transparent pointer-events-none">
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] md:text-xs font-body tracking-[0.4em] uppercase text-gold">
            GSFC Smart Digital Inauguration
          </span>
          <h2 className="text-xl md:text-3xl font-heading text-text-white font-bold tracking-wide">
            {activeLeaf.name}
          </h2>
        </div>

        {/* Buttons (allow pointer-events) */}
        <div className="flex items-center space-x-4 pointer-events-auto">
          <button
            onClick={handleReplay}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full border border-gold/20 hover:border-gold bg-gold/5 hover:bg-gold/15 text-gold text-xs font-body tracking-widest uppercase transition-all duration-300"
          >
            <RotateCcw size={13} />
            <span>Replay</span>
          </button>

          <button
            onClick={handleClose}
            className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-text-white transition-all duration-300"
            title="Return to Tree"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Video/Canvas Area */}
      <div className="w-full h-full flex items-center justify-center relative bg-[#010101] z-10">
        {!useFallback ? (
          <video
            ref={videoRef}
            src={`./assets/${activeLeaf.videoSrc}`}
            autoPlay
            muted={isMuted}
            className="w-full h-full object-contain"
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            
            {/* Overlay loading/inauguration text inside the circle */}
            <div className="absolute z-20 flex flex-col items-center text-center space-y-3">
              <span className="text-[11px] font-body tracking-[0.3em] uppercase text-gold/60 animate-pulse">
                Inaugurating Project
              </span>
              <span className="text-4xl font-heading text-text-white font-bold max-w-lg">
                {inaugurationProgress}%
              </span>
              <span className="text-xs font-body tracking-wider text-text-white/40 uppercase">
                Viksit Gujarat Digital Platform
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-8 flex justify-center bg-gradient-to-t from-bg-dark/95 to-transparent pointer-events-none">
        <p className="text-[10px] md:text-xs font-body tracking-[0.25em] text-text-white/40 uppercase">
          Theme: Regional Aspirations <span className="text-gold">→</span> Global Ambitions
        </p>
      </div>
    </motion.div>
  );
};
export default ProjectVideoScreen;
