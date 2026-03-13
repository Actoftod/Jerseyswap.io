import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  teamName?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after, teamName }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = () => { isDragging.current = false; };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-[3.5rem] overflow-hidden border border-white/10 select-none cursor-col-resize touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label="Before and after jersey swap comparison"
      role="slider"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* AFTER layer — full width underneath */}
      <img
        src={after}
        className="absolute inset-0 w-full h-full object-cover"
        alt="After jersey swap"
        draggable={false}
      />

      {/* BEFORE layer — clipped to left of handle */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={before}
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${containerRef.current?.offsetWidth ?? 400}px`, maxWidth: 'none' }}
          alt="Before jersey swap"
          draggable={false}
        />
        {/* Grayscale tint for "before" feel */}
        <div className="absolute inset-0 bg-black/20 mix-blend-color-burn pointer-events-none" />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[#ccff00] shadow-[0_0_16px_rgba(204,255,0,0.7)] pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      />

      {/* Handle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.5)] flex items-center justify-center pointer-events-none z-10"
        style={{ left: `${position}%` }}
        whileTap={{ scale: 1.15 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M7 5l-5 5 5 5M13 5l5 5-5 5" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      {/* Labels */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <span className="font-oswald italic font-black text-[9px] uppercase tracking-widest text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">BEFORE</span>
      </div>
      <div className="absolute bottom-6 right-6 pointer-events-none">
        <span className="font-oswald italic font-black text-[9px] uppercase tracking-widest text-black bg-[#ccff00] px-3 py-1 rounded-full">
          {teamName ? teamName.toUpperCase() : 'AFTER'}
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
