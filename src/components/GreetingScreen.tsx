import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export const GreetingScreen: React.FC = () => {
  const setScreen = useStore((state) => state.setScreen);

  const handleBegin = () => {
    setScreen('intro');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { ease: 'easeInOut' as const, duration: 1.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 40, damping: 15 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-bg-dark flex flex-col items-center justify-center cursor-pointer select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={handleBegin}
    >
      {/* Decorative Golden Particle Backdrop Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex flex-col items-center space-y-12 max-w-4xl px-8 text-center relative z-10">
        <motion.div variants={itemVariants} className="space-y-3">
          <h2 className="text-xl md:text-2xl font-body tracking-[0.4em] text-gold uppercase opacity-80">
            GSFC University
          </h2>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-2" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-heading font-medium tracking-wide text-text-white"
        >
          Welcomes You
        </motion.h1>

        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-heading italic tracking-wider text-shine font-bold">
            Vibrant Gujarat
          </h2>
          <p className="text-sm md:text-lg font-body tracking-[0.25em] text-gold/80 uppercase">
            Regional Aspirations <span className="text-text-white/60 mx-2">→</span> Global Ambitions
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="pt-12"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' as const }}
        >
          <span className="text-xs md:text-sm font-body tracking-[0.3em] uppercase text-text-white/40 border border-gold/15 px-6 py-3 rounded-full bg-gold/5 backdrop-blur-sm hover:border-gold/45 transition-colors duration-500">
            Tap Anywhere To Begin
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default GreetingScreen;
