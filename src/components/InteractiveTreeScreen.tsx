import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { LeafNode } from '../store/useStore';
import { RotateCcw } from 'lucide-react';

export const InteractiveTreeScreen: React.FC = () => {
  const { 
    leaves, 
    selectLeaf, 
    replayLeaf, 
    lastCompletedLeafId, 
    resetLastCompletedLeaf 
  } = useStore();

  const [fallingLeaf, setFallingLeaf] = useState<LeafNode | null>(null);
  const [pulseActive, setPulseActive] = useState(false);

  // Trigger Leaf Detach, Fall, and Tree Pulse animation when returning from video completion
  useEffect(() => {
    if (lastCompletedLeafId !== null) {
      const completedLeaf = leaves.find(l => l.id === lastCompletedLeafId);
      if (completedLeaf) {
        // Start pulse
        setPulseActive(true);
        // Start falling leaf animation
        setFallingLeaf(completedLeaf);

        // Turn off pulse after 1.5 seconds
        const pulseTimer = setTimeout(() => {
          setPulseActive(false);
        }, 1500);

        // Turn off falling leaf after 2.5 seconds
        const fallTimer = setTimeout(() => {
          setFallingLeaf(null);
          resetLastCompletedLeaf();
        }, 2500);

        return () => {
          clearTimeout(pulseTimer);
          clearTimeout(fallTimer);
        };
      }
    }
  }, [lastCompletedLeafId, leaves, resetLastCompletedLeaf]);

  const handleLeafClick = (id: number, state: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (state === 'completed') {
      // Replay option
      replayLeaf(id);
    } else {
      selectLeaf(id);
    }
  };

  const handleReplayClick = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    replayLeaf(id);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-bg-dark flex items-center justify-center select-none overflow-hidden">
      
      {/* Golden Pulse Background Effect */}
      <AnimatePresence>
        {pulseActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(166,124,82,0.03) 50%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Decorative luxury gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(44,29,15,0.1)_0%,transparent_60%)] pointer-events-none" />

      {/* Main 16:9 Canvas Container */}
      <div className="w-full h-full max-w-[1920px] max-h-[1080px] aspect-video relative flex items-center justify-center">
        
        {/* SVG Banyan Tree */}
        <svg
          viewBox="0 0 1000 600"
          className={`w-full h-full absolute inset-0 pointer-events-none select-none z-0 transition-all duration-1000 ${
            pulseActive ? 'tree-canvas-glow scale-[1.01]' : ''
          }`}
        >
          <defs>
            <linearGradient id="trunkGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#080808" />
              <stop offset="25%" stopColor="#1e1808" />
              <stop offset="60%" stopColor="#A67C52" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            <linearGradient id="branchGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A67C52" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Tree Trunk & Roots */}
          <path
            d="M485,600 C485,550 460,520 460,460 C460,380 490,320 490,260 C490,260 510,260 510,260 C510,320 540,380 540,460 C540,520 515,550 515,600 Z"
            fill="url(#trunkGradient)"
            opacity="0.85"
          />

          {/* Roots overlay */}
          <path
            d="M450,590 Q410,595 380,600 M550,590 Q590,595 620,600 M490,580 Q470,590 460,600 M510,580 Q530,590 540,600"
            stroke="#A67C52"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Left Branch structures */}
          <path
            d="M465,420 Q330,400 260,550"
            stroke="url(#branchGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M470,360 Q340,340 180,440"
            stroke="url(#branchGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M380,350 Q310,290 250,320"
            stroke="url(#branchGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M480,310 Q420,280 380,260"
            stroke="url(#branchGradient)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Right Branch structures */}
          <path
            d="M535,420 Q670,400 740,550"
            stroke="url(#branchGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M530,360 Q660,340 820,440"
            stroke="url(#branchGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M620,350 Q690,290 750,320"
            stroke="url(#branchGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M520,310 Q580,280 620,260"
            stroke="url(#branchGradient)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Middle/Top Branch */}
          <path
            d="M500,260 Q500,210 500,200"
            stroke="url(#branchGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* Dynamic Leaf Nodes */}
        {leaves.map((leaf) => {
          const isCompleted = leaf.state === 'completed';
          const isPending = leaf.state === 'pending';
          const isJustCompleted = leaf.id === lastCompletedLeafId;

          return (
            <motion.div
              key={leaf.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 select-none flex flex-col items-center"
              style={{ left: `${leaf.x}%`, top: `${leaf.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: isJustCompleted ? 0.3 : 1, // Stay dim temporarily if it's falling
                transition: { delay: leaf.id * 0.1, type: 'spring', stiffness: 60 } 
              }}
              whileHover={{ 
                scale: 1.15,
                transition: { duration: 0.2 } 
              }}
            >
              {/* Golden Outer Glow */}
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-1000 relative group ${
                  isCompleted 
                    ? 'bg-gold/20 border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.7)] text-gold' 
                    : 'glass-panel hover:border-gold/60 border border-white/20 hover:shadow-[0_0_18px_rgba(217,196,122,0.45)] text-text-white/90'
                }`}
                onClick={(e) => handleLeafClick(leaf.id, leaf.state, e)}
              >
                {/* Visual state icon / index */}
                <div className="text-center flex flex-col items-center justify-center">
                  <span className="font-heading text-sm font-bold tracking-tight">
                    {leaf.id}
                  </span>
                </div>

                {/* Micro Replay Button overlay for completed nodes */}
                {isCompleted && (
                  <button
                    onClick={(e) => handleReplayClick(leaf.id, e)}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold hover:bg-white text-bg-dark flex items-center justify-center shadow-lg transition-all duration-300 transform scale-90 hover:scale-105"
                    title="Replay Video"
                  >
                    <RotateCcw size={11} className="stroke-[3]" />
                  </button>
                )}

                {/* Ripple glow around pending nodes */}
                {isPending && (
                  <div className="absolute inset-0 rounded-full animate-leaf-glow-pulse -z-10 pointer-events-none" />
                )}
              </div>

              {/* Minimalist Floating Label */}
              <div className="mt-2 text-center pointer-events-none max-w-[140px]">
                <p className={`text-[10px] md:text-xs font-body font-medium tracking-wider uppercase transition-colors duration-500 ${
                  isCompleted ? 'text-gold' : 'text-text-white/60 group-hover:text-text-white/90'
                }`}>
                  {leaf.name}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Detaching & Falling Leaf Animation Overlay */}
        <AnimatePresence>
          {fallingLeaf && (
            <motion.div
              className="absolute z-20 pointer-events-none select-none flex flex-col items-center"
              style={{ left: `${fallingLeaf.x}%` }}
              initial={{ 
                top: `${fallingLeaf.y}%`, 
                scale: 1, 
                opacity: 1, 
                rotate: 0 
              }}
              animate={{
                top: '90%', // falls to earth
                scale: [1, 0.95, 0.75, 0], // shrinks and dissolves at bottom
                opacity: [1, 1, 0.8, 0],
                rotate: [0, 45, -30, 90], // detaching rotation
                x: [0, 30, -35, 20], // sway left & right
                transition: { 
                  duration: 2.2, 
                  ease: 'easeInOut' 
                }
              }}
              exit={{ opacity: 0 }}
            >
              {/* Beautiful glowing gold falling leaf */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gold border-2 border-white shadow-[0_0_25px_rgba(212,175,55,0.9)] text-bg-dark">
                <span className="font-heading text-sm font-bold">{fallingLeaf.id}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default InteractiveTreeScreen;
