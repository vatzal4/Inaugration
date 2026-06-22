import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export const CompletionScreen: React.FC = () => {
  const resetAll = useStore((state) => state.resetAll);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Return to greeting screen after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      resetAll();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [resetAll]);

  // Golden particle light spreading effect
  useEffect(() => {
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

    interface StarParticle {
      x: number;
      y: number;
      vy: number;
      vx: number;
      size: number;
      alpha: number;
      decay: number;
    }

    const stars: StarParticle[] = [];

    const spawnStar = () => {
      stars.push({
        x: Math.random() * width,
        y: height + 20,
        vy: -(Math.random() * 3 + 1),
        vx: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1.2,
        alpha: 1,
        decay: Math.random() * 0.005 + 0.003,
      });
    };

    // Pre-populate stars
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(Math.random() * 2 + 0.5),
        vx: (Math.random() - 0.5) * 1,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.005 + 0.003,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // trail
      ctx.fillRect(0, 0, width, height);

      // Radial gold background glow
      const radialGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.7,
        50,
        width / 2,
        height * 0.6,
        width * 0.6
      );
      radialGrad.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
      radialGrad.addColorStop(0.5, 'rgba(166, 124, 82, 0.03)');
      radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Spawn new stars
      if (Math.random() < 0.4) spawnStar();

      // Render & Update stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.y += s.vy;
        s.x += s.vx;
        s.alpha -= s.decay;

        if (s.alpha <= 0 || s.y < -10) {
          stars.splice(i, 1);
          continue;
        }

        ctx.fillStyle = '#D9C47A'; // Golden leaf glow
        ctx.globalAlpha = s.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#D4AF37';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reset canvas context states
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 1.2, delayChildren: 0.5 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 0.6,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-bg-dark flex items-center justify-center select-none overflow-hidden">
      {/* Background canvas for golden stars spread */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* Ceremony presentation container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl px-8 space-y-10"
      >
        {/* Step 1: Root Identity */}
        <motion.div variants={textVariants} className="flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-body tracking-[0.3em] text-gold/80 uppercase">
            Root Identity
          </h2>
        </motion.div>

        {/* Arrow 1 */}
        <motion.div variants={arrowVariants} className="text-gold text-2xl font-light">
          ↓
        </motion.div>

        {/* Step 2: Viksit Bharat */}
        <motion.div variants={textVariants} className="flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-text-white tracking-wide">
            Viksit Bharat
          </h1>
        </motion.div>

        {/* Arrow 2 */}
        <motion.div variants={arrowVariants} className="text-gold text-2xl font-light">
          ↓
        </motion.div>

        {/* Step 3: Viksit Gujarat */}
        <motion.div variants={textVariants} className="flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-heading font-black text-shine tracking-wider">
            Viksit Gujarat
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={textVariants}
          className="h-[1px] w-64 bg-gradient-to-r from-transparent via-gold/30 to-transparent pt-4"
        />

        {/* Final subtext: Inaugurated at GSFC University */}
        <motion.div variants={textVariants} className="pt-2">
          <p className="text-sm md:text-lg font-body tracking-[0.3em] uppercase text-text-white/60 font-light">
            Inaugurated at <span className="text-gold font-medium">GSFC University</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default CompletionScreen;
