import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Download, Plus, Minus, Move, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Patch definitions ────────────────────────────────────────────────────────

interface PatchDef {
  id: string;
  label: string;
  category: 'captain' | 'commemorative' | 'sponsor' | 'number' | 'flag';
  svgContent: string;
  defaultSize: number;
}

const makeSvgUrl = (svg: string) =>
  `data:image/svg+xml;base64,${btoa(svg)}`;

const PATCHES: PatchDef[] = [
  // Captain patches
  {
    id: 'captain_c_gold',
    label: 'Captain C (Gold)',
    category: 'captain',
    defaultSize: 48,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="36" fill="none" stroke="#c9a84c" stroke-width="6"/>
      <text x="40" y="52" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="38" fill="#c9a84c">C</text>
    </svg>`,
  },
  {
    id: 'captain_c_silver',
    label: 'Captain C (Silver)',
    category: 'captain',
    defaultSize: 48,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="36" fill="none" stroke="#9ca3af" stroke-width="6"/>
      <text x="40" y="52" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="38" fill="#9ca3af">C</text>
    </svg>`,
  },
  {
    id: 'alternate_c',
    label: 'Alt Captain C',
    category: 'captain',
    defaultSize: 48,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <rect x="4" y="4" width="72" height="72" rx="8" fill="none" stroke="#c9a84c" stroke-width="5"/>
      <text x="40" y="52" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="38" fill="#c9a84c">A</text>
    </svg>`,
  },

  // Commemorative patches
  {
    id: 'playoff_patch',
    label: 'Playoffs',
    category: 'commemorative',
    defaultSize: 52,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
      <polygon points="45,5 55,35 85,35 62,55 70,85 45,68 20,85 28,55 5,35 35,35" fill="none" stroke="#ccff00" stroke-width="4"/>
      <text x="45" y="52" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="900" font-size="11" fill="#ccff00">PLAYOFFS</text>
    </svg>`,
  },
  {
    id: 'championship_badge',
    label: 'Championship',
    category: 'commemorative',
    defaultSize: 56,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 8 L60 38 L92 38 L67 58 L76 88 L50 70 L24 88 L33 58 L8 38 L40 38 Z" fill="none" stroke="#f59e0b" stroke-width="4"/>
      <text x="50" y="48" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="900" font-size="9" fill="#f59e0b">CHAMPS</text>
      <text x="50" y="62" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="900" font-size="14" fill="#f59e0b">25</text>
    </svg>`,
  },
  {
    id: 'memorial_black',
    label: 'Memorial',
    category: 'commemorative',
    defaultSize: 44,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="36" fill="#111" stroke="#444" stroke-width="3"/>
      <text x="40" y="52" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="28" fill="#888">IN</text>
    </svg>`,
  },
  {
    id: 'anniversary_50',
    label: '50th Anniversary',
    category: 'commemorative',
    defaultSize: 52,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="50" cy="50" rx="46" ry="46" fill="none" stroke="#c9a84c" stroke-width="4"/>
      <text x="50" y="44" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="900" font-size="24" fill="#c9a84c">50</text>
      <text x="50" y="62" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="700" font-size="10" fill="#c9a84c">YEARS</text>
    </svg>`,
  },

  // Sponsor logos (stylized)
  {
    id: 'sponsor_nike',
    label: 'Nike Swoosh',
    category: 'sponsor',
    defaultSize: 60,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60">
      <path d="M8 44 Q50 4 110 16 Q90 24 20 52 Z" fill="white"/>
    </svg>`,
  },
  {
    id: 'sponsor_adidas',
    label: 'Adidas 3-Bar',
    category: 'sponsor',
    defaultSize: 52,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80">
      <rect x="4"  y="20" width="16" height="60" rx="2" fill="white"/>
      <rect x="22" y="10" width="16" height="70" rx="2" fill="white"/>
      <rect x="40" y="0"  width="16" height="80" rx="2" fill="white"/>
    </svg>`,
  },

  // Flags
  {
    id: 'flag_usa',
    label: 'USA Flag',
    category: 'flag',
    defaultSize: 56,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40">
      <rect width="60" height="40" fill="#B22234"/>
      <rect y="3" width="60" height="4" fill="white"/>
      <rect y="10" width="60" height="4" fill="white"/>
      <rect y="17" width="60" height="4" fill="white"/>
      <rect y="24" width="60" height="4" fill="white"/>
      <rect y="31" width="60" height="4" fill="white"/>
      <rect width="24" height="22" fill="#3C3B6E"/>
      <text x="12" y="14" text-anchor="middle" font-size="10" fill="white">★★★</text>
    </svg>`,
  },
  {
    id: 'flag_canada',
    label: 'Canada Flag',
    category: 'flag',
    defaultSize: 56,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40">
      <rect width="60" height="40" fill="white"/>
      <rect width="15" height="40" fill="#FF0000"/>
      <rect x="45" width="15" height="40" fill="#FF0000"/>
      <text x="30" y="26" text-anchor="middle" font-size="22" fill="#FF0000">✦</text>
    </svg>`,
  },
];

const CATEGORIES = [
  { id: 'captain',       label: 'CAPTAIN' },
  { id: 'commemorative', label: 'MEMORIAL' },
  { id: 'sponsor',       label: 'SPONSOR' },
  { id: 'flag',          label: 'FLAG' },
] as const;

// ─── Placed patch state ───────────────────────────────────────────────────────

interface PlacedPatch {
  id: string;
  defId: string;
  x: number;  // 0-1 relative to canvas
  y: number;
  size: number;
  rotation: number;
}

interface Props {
  baseImage: string;
  onExport: (composited: string) => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PatchLibrary: React.FC<Props> = ({ baseImage, onExport, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string>('captain');
  const [placed, setPlaced] = useState<PlacedPatch[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);

  const canvasRef = useRef<HTMLDivElement>(null);

  const filteredPatches = PATCHES.filter(p => p.category === activeCategory);

  // Add a patch to the canvas at center
  const addPatch = (def: PatchDef) => {
    const newPatch: PlacedPatch = {
      id: `${def.id}_${Date.now()}`,
      defId: def.id,
      x: 0.5,
      y: 0.5,
      size: def.defaultSize,
      rotation: 0,
    };
    setPlaced(prev => [...prev, newPatch]);
    setSelected(newPatch.id);
  };

  // Drag move handler
  const handlePointerDown = (e: React.PointerEvent, patchId: string) => {
    e.stopPropagation();
    setSelected(patchId);
    setDragging(patchId);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const patch = placed.find(p => p.id === patchId)!;
    setDragOffset({
      x: e.clientX - rect.left - patch.x * rect.width,
      y: e.clientY - rect.top  - patch.y * rect.height,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left - dragOffset.x) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top  - dragOffset.y) / rect.height));
    setPlaced(prev => prev.map(p => p.id === dragging ? { ...p, x: nx, y: ny } : p));
  }, [dragging, dragOffset]);

  const handlePointerUp = useCallback(() => setDragging(null), []);

  // Selected patch helpers
  const selectedPatch = placed.find(p => p.id === selected);
  const updateSelected = (upd: Partial<PlacedPatch>) => {
    setPlaced(prev => prev.map(p => p.id === selected ? { ...p, ...upd } : p));
  };

  // Canvas export via offscreen canvas
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const container = canvasRef.current;
      if (!container) return;
      const W = container.offsetWidth;
      const H = container.offsetHeight;

      const offscreen = document.createElement('canvas');
      offscreen.width = W;
      offscreen.height = H;
      const ctx = offscreen.getContext('2d')!;

      // Draw base image
      await new Promise<void>(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => { ctx.drawImage(img, 0, 0, W, H); resolve(); };
        img.onerror = resolve;
        img.src = baseImage;
      });

      // Draw each patch
      for (const p of placed) {
        const def = PATCHES.find(d => d.id === p.defId);
        if (!def) continue;
        await new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => {
            const px = p.x * W;
            const py = p.y * H;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
            resolve();
          };
          img.onerror = resolve;
          img.src = makeSvgUrl(def.svgContent);
        });
      }

      onExport(offscreen.toDataURL('image/png'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black rounded-[3rem] overflow-hidden border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
        <div>
          <h3 className="font-oswald italic font-black text-xl uppercase tracking-widest text-white">PATCH LIBRARY</h3>
          <p className="font-oswald italic text-[9px] text-zinc-500 uppercase tracking-[0.4em]">DRAG PATCHES ONTO YOUR SWAP</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={placed.length === 0 || isExporting}
            className="flex items-center gap-2 px-5 h-9 bg-[#ccff00] text-black font-oswald italic font-black text-xs uppercase tracking-widest rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
          >
            {isExporting ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            COMMIT
          </button>
          <button onClick={onClose} className="p-2 text-zinc-600 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas area */}
        <div
          ref={canvasRef}
          className="flex-1 relative select-none overflow-hidden bg-zinc-950 cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={() => setSelected(null)}
        >
          {/* Base image */}
          <img
            src={baseImage}
            alt="Base swap"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />

          {/* Placed patches */}
          {placed.map(p => {
            const def = PATCHES.find(d => d.id === p.defId);
            if (!def) return null;
            const isSelected = selected === p.id;
            return (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: `${p.x * 100}%`,
                  top:  `${p.y * 100}%`,
                  width:  p.size,
                  height: p.size,
                  transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                  cursor: 'grab',
                  zIndex: isSelected ? 10 : 5,
                }}
                onPointerDown={e => handlePointerDown(e, p.id)}
              >
                <img
                  src={makeSvgUrl(def.svgContent)}
                  alt={def.label}
                  style={{ width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }}
                  draggable={false}
                />
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-[#ccff00] rounded-sm pointer-events-none"
                       style={{ boxShadow: '0 0 12px rgba(204,255,0,0.5)' }} />
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {placed.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center opacity-30">
                <Move className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
                <p className="font-oswald italic font-black text-xs text-zinc-500 uppercase tracking-widest">TAP A PATCH TO PLACE</p>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-64 shrink-0 border-l border-white/5 flex flex-col overflow-hidden">
          {/* Selected patch controls */}
          <AnimatePresence>
            {selectedPatch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-white/5 p-4 space-y-4 bg-white/2"
              >
                <p className="font-oswald italic font-black text-[9px] text-[#ccff00] uppercase tracking-widest">
                  {PATCHES.find(d => d.id === selectedPatch.defId)?.label ?? 'Patch'}
                </p>

                {/* Size slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-oswald italic text-[9px] text-zinc-500 uppercase tracking-wider">SIZE</span>
                    <span className="font-oswald italic font-black text-[10px] text-white">{selectedPatch.size}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateSelected({ size: Math.max(16, selectedPatch.size - 8) })}
                            className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <input type="range" min={16} max={200} value={selectedPatch.size}
                           onChange={e => updateSelected({ size: Number(e.target.value) })}
                           className="flex-1 accent-[#ccff00]" />
                    <button onClick={() => updateSelected({ size: Math.min(200, selectedPatch.size + 8) })}
                            className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Rotation slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-oswald italic text-[9px] text-zinc-500 uppercase tracking-wider">ROTATE</span>
                    <span className="font-oswald italic font-black text-[10px] text-white">{selectedPatch.rotation}°</span>
                  </div>
                  <input type="range" min={-180} max={180} value={selectedPatch.rotation}
                         onChange={e => updateSelected({ rotation: Number(e.target.value) })}
                         className="w-full accent-[#ccff00]" />
                </div>

                {/* Remove */}
                <button
                  onClick={() => { setPlaced(prev => prev.filter(p => p.id !== selected)); setSelected(null); }}
                  className="w-full py-2 border border-red-500/30 text-red-400 font-oswald italic font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  REMOVE
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Library toggle */}
          <button
            onClick={() => setLibraryOpen(v => !v)}
            className="flex items-center justify-between px-4 py-3 border-b border-white/5 text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            <span className="font-oswald italic font-black text-[9px] uppercase tracking-widest">LIBRARY</span>
            {libraryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {libraryOpen && (
            <>
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1 p-3 border-b border-white/5 shrink-0">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-full font-oswald italic font-black text-[8px] uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Patch grid */}
              <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start">
                {filteredPatches.map(def => (
                  <button
                    key={def.id}
                    onClick={() => addPatch(def)}
                    title={def.label}
                    className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-[#ccff00]/40 hover:bg-[#ccff00]/5 transition-all group p-2"
                  >
                    <img
                      src={makeSvgUrl(def.svgContent)}
                      alt={def.label}
                      className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                      draggable={false}
                    />
                    <span className="font-oswald italic font-black text-[7px] text-zinc-500 uppercase tracking-wider text-center leading-none group-hover:text-[#ccff00] transition-colors">
                      {def.label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Placed count */}
          {placed.length > 0 && (
            <div className="px-4 py-3 border-t border-white/5 shrink-0">
              <p className="font-oswald italic text-[9px] text-zinc-500 uppercase tracking-widest">
                {placed.length} PATCH{placed.length !== 1 ? 'ES' : ''} PLACED
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatchLibrary;
