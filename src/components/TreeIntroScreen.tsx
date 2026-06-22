import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

export const TreeIntroScreen: React.FC = () => {
  const setScreen = useStore((state) => state.setScreen);
  const isMuted = useStore((state) => state.isMuted);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);

  useEffect(() => {
    // Show a subtle skip message if the video is taking a long time (or general skip guide)
    const skipTimer = setTimeout(() => {
      setSkipVisible(true);
    }, 4000);

    return () => clearTimeout(skipTimer);
  }, []);

  // Canvas Growth fallback logic
  useEffect(() => {
    if (!useFallback) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system for growing energy
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }
    const particles: Particle[] = [];

    // Banyan Tree Branch interface
    interface Branch {
      startX: number;
      startY: number;
      length: number;
      angle: number;
      depth: number;
      currentLength: number;
      branchWidth: number;
      children: Branch[];
      growing: boolean;
      growthSpeed: number;
    }

    // Generate tree structure
    const createBranch = (startX: number, startY: number, length: number, angle: number, depth: number): Branch => {
      return {
        startX,
        startY,
        length,
        angle,
        depth,
        currentLength: 0,
        branchWidth: Math.max(1, 24 - depth * 3.5),
        children: [],
        growing: true,
        growthSpeed: (Math.random() * 0.5 + 0.8) / (depth + 1) * 3, // speeds up at base
      };
    };

    const rootBranch = createBranch(width / 2, height - 80, height * 0.22, -Math.PI / 2, 0);
    const maxDepth = 5;

    // Generate children recursively
    const populateTree = (branch: Branch) => {
      if (branch.depth >= maxDepth) return;

      const numBranches = branch.depth === 0 ? 3 : Math.random() > 0.45 ? 3 : 2;
      const angleVariance = Math.PI / 5;

      for (let i = 0; i < numBranches; i++) {
        let childAngle = branch.angle;
        if (numBranches === 2) {
          childAngle += i === 0 ? -angleVariance : angleVariance;
        } else {
          childAngle += (i - 1) * angleVariance;
        }
        
        // Add random variance
        childAngle += (Math.random() - 0.5) * 0.15;

        // Child branches starting coordinates
        const childStartX = branch.startX + Math.cos(branch.angle) * branch.length;
        const childStartY = branch.startY + Math.sin(branch.angle) * branch.length;
        const childLength = branch.length * (0.65 + Math.random() * 0.15);

        const child = createBranch(childStartX, childStartY, childLength, childAngle, branch.depth + 1);
        branch.children.push(child);
        populateTree(child);
      }
    };

    populateTree(rootBranch);

    let growthProgress = 0;
    const totalGrowthSteps = 300; // ~5 seconds growth

    const drawBranch = (b: Branch) => {
      if (b.currentLength <= 0) return;

      const endX = b.startX + Math.cos(b.angle) * b.currentLength;
      const endY = b.startY + Math.sin(b.angle) * b.currentLength;

      // Draw branch shadow and stroke
      ctx.shadowColor = 'rgba(212, 175, 55, 0.15)';
      ctx.shadowBlur = 10;
      
      // Tree highlight gradient (brownish wood to gold accent)
      const grad = ctx.createLinearGradient(b.startX, b.startY, endX, endY);
      grad.addColorStop(0, '#A67C52'); // Tree highlight
      grad.addColorStop(1, '#D4AF37'); // Gold Accent
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = b.branchWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(b.startX, b.startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      // Draw aerial roots dropping down for depth 1 & 2
      if ((b.depth === 1 || b.depth === 2) && b.currentLength >= b.length * 0.8 && Math.random() < 0.005) {
        // Spawn an aerial root dropping down to earth
        particles.push({
          x: endX,
          y: endY,
          vx: (Math.random() - 0.5) * 0.2,
          vy: Math.random() * 1.5 + 0.5,
          size: Math.random() * 1.5 + 0.5,
          alpha: 0.7,
          color: '#A67C52'
        });
      }

      // If branch has children and is mostly grown, animate children
      if (b.currentLength >= b.length * 0.95) {
        b.children.forEach(drawBranch);
      }
    };

    const updateBranch = (b: Branch) => {
      if (b.currentLength < b.length) {
        b.currentLength += b.growthSpeed;
        if (b.currentLength > b.length) b.currentLength = b.length;
      } else {
        b.children.forEach(updateBranch);
      }
    };

    // Draw background root system
    const drawRoots = () => {
      ctx.strokeStyle = 'rgba(166, 124, 82, 0.4)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(width / 2, height - 80);
      ctx.quadraticCurveTo(width / 2 - 40, height - 30, width / 2 - 120, height - 10);
      ctx.moveTo(width / 2, height - 80);
      ctx.quadraticCurveTo(width / 2 + 50, height - 40, width / 2 + 130, height - 10);
      ctx.moveTo(width / 2, height - 80);
      ctx.quadraticCurveTo(width / 2 - 10, height - 45, width / 2 - 20, height - 10);
      ctx.stroke();
    };

    // Main animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)'; // trails
      ctx.fillRect(0, 0, width, height);

      // Draw decorative elements
      drawRoots();

      // Update and draw tree
      updateBranch(rootBranch);
      drawBranch(rootBranch);

      // Emit energy particles from the roots going upwards
      if (Math.random() < 0.3) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 60,
          y: height - 80,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(Math.random() * 2 + 1),
          size: Math.random() * 3 + 1,
          alpha: 1,
          color: Math.random() > 0.4 ? '#D9C47A' : '#D4AF37' // Leaf glow & gold
        });
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // Attract particles to branches/center slightly
        if (p.y < height - 120 && p.color !== '#A67C52') {
          p.vx += (Math.random() - 0.5) * 0.1;
        }

        // Aerial roots fade out at ground
        if (p.color === '#A67C52') {
          if (p.y >= height - 80) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          p.alpha -= 0.004;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      growthProgress++;

      // After tree grows completely, wait a bit and transition
      if (growthProgress >= totalGrowthSteps + 120) {
        setScreen('tree');
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [useFallback, setScreen]);

  const handleVideoEnded = () => {
    setScreen('tree');
  };

  const handleVideoError = () => {
    // If the video fails to load, fall back to procedural canvas tree animation
    console.warn("Video file 'tree_intro.mp4' not found. Falling back to procedural Banyan tree generator.");
    setUseFallback(true);
  };

  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-bg-dark flex items-center justify-center select-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {!useFallback ? (
        <video
          ref={videoRef}
          src="./assets/tree_intro.mp4"
          autoPlay
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      )}

      {/* Subtle Operator Skipping Instruction */}
      <AnimatePresence>
        {skipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 right-8 z-30 text-xs text-text-white/60 font-body tracking-wider pointer-events-none"
          >
            Press [SPACE] or Tap to Skip
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click overlay to skip */}
      <div 
        className="absolute inset-0 z-20 cursor-pointer" 
        onClick={() => setScreen('tree')} 
      />
    </motion.div>
  );
};
export default TreeIntroScreen;
