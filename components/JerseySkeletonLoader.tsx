import React from 'react';
import { motion } from 'framer-motion';

/**
 * Jersey-shaped skeleton loader shown while the AI generates the swap.
 * Mimics the proportions of a typical jersey card (3/4 aspect ratio).
 */
const JerseySkeletonLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Jersey skeleton card */}
      <div className="relative w-full max-w-xs">
        {/* Main jersey shape */}
        <div className="w-full aspect-[3/4] rounded-[3rem] overflow-hidden relative shimmer bg-white/5 border border-white/5">

          {/* Collar notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 shimmer rounded-b-2xl" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Shoulder seam left */}
          <div className="absolute top-4 left-0 w-1/3 h-[3px] shimmer" style={{ background: 'rgba(204,255,0,0.12)' }} />
          {/* Shoulder seam right */}
          <div className="absolute top-4 right-0 w-1/3 h-[3px] shimmer" style={{ background: 'rgba(204,255,0,0.12)' }} />

          {/* Number block */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-28 rounded-2xl shimmer" style={{ background: 'rgba(255,255,255,0.07)' }} />

          {/* Name bar */}
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-36 h-5 rounded-full shimmer" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Side stripe left */}
          <div className="absolute top-0 bottom-0 left-2 w-3 shimmer opacity-50" style={{ background: 'rgba(204,255,0,0.06)', borderRadius: '0 0 4px 4px' }} />
          {/* Side stripe right */}
          <div className="absolute top-0 bottom-0 right-2 w-3 shimmer opacity-50" style={{ background: 'rgba(204,255,0,0.06)', borderRadius: '0 0 4px 4px' }} />

          {/* Bottom logo block */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Scan line animation */}
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent shadow-[0_0_12px_#ccff00]"
          animate={{ top: ['5%', '95%', '5%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Status text */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-[#ccff00]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="font-oswald italic font-black text-[10px] uppercase tracking-widest text-[#ccff00]">
            NEURAL_FORGE IN PROGRESS
          </p>
        </div>

        {/* Animated step labels */}
        <StepCycle />
      </div>
    </div>
  );
};

const STEPS = [
  'IDENTITY_LOCK_ACTIVE',
  'SYNTHESIZING_FABRIC_TEXTURE',
  'RENDERING_KIT_GEOMETRY',
  'APPLYING_COLOR_CALIBRATION',
  'FINALIZING_NEURAL_OUTPUT',
];

const StepCycle: React.FC = () => {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % STEPS.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.p
      key={idx}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="font-oswald italic font-black text-[9px] uppercase tracking-[0.2em] text-zinc-600"
    >
      {STEPS[idx]}
    </motion.p>
  );
};

export default JerseySkeletonLoader;
