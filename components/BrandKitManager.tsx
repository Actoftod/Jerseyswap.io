import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, Palette, X, Check, Pencil, Lock, ChevronRight } from 'lucide-react';
import { BrandKit, ProTier } from '../types';

const KIT_LIMIT: Record<ProTier, number> = {
  free: 0,
  pro: 5,
  elite: Infinity,
};

const DEFAULT_PALETTE = ['#ccff00', '#000000', '#ffffff', '#1a1a1a', '#f97316', '#0ea5e9'];

const FONT_OPTIONS = [
  { id: 'OSWALD_ITALIC', label: 'OSWALD ITALIC' },
  { id: 'INTER', label: 'Inter' },
  { id: 'MONO', label: 'Monospace' },
];

interface BrandKitManagerProps {
  kits: BrandKit[];
  tier: ProTier;
  onSave: (kit: BrandKit) => void;
  onDelete: (kitId: string) => void;
  onUpgradeClick: () => void;
}

const ColorSwatch: React.FC<{ color: string; onRemove: () => void }> = ({ color, onRemove }) => (
  <div className="relative group">
    <div className="w-9 h-9 rounded-xl border border-white/10 cursor-pointer" style={{ backgroundColor: color }} />
    <button
      onClick={onRemove}
      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full items-center justify-center hidden group-hover:flex"
    >
      <X className="w-2.5 h-2.5 text-white" />
    </button>
  </div>
);

const KitCard: React.FC<{
  kit: BrandKit;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ kit, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="glass rounded-[1.75rem] border border-white/8 p-5 space-y-4"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-oswald italic font-black text-white text-base uppercase truncate">{kit.name}</p>
        <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5 truncate">{kit.teamContext}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={onEdit} className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:border-white/20 transition-colors">
          <Pencil className="w-3.5 h-3.5 text-zinc-400" />
        </button>
        <button onClick={onDelete} className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:border-red-500/40 transition-colors">
          <Trash2 className="w-3.5 h-3.5 text-zinc-600 hover:text-red-400" />
        </button>
      </div>
    </div>

    {/* Palette strip */}
    <div className="flex gap-2 flex-wrap">
      {kit.palette.map((hex, i) => (
        <div key={i} className="w-8 h-8 rounded-lg border border-white/10 shadow-md" style={{ backgroundColor: hex }} title={hex} />
      ))}
    </div>

    {/* Logo preview */}
    {kit.logoBase64 && (
      <div className="w-full h-16 rounded-xl bg-white/5 border border-white/8 overflow-hidden flex items-center justify-center">
        <img src={kit.logoBase64} className="h-full w-auto object-contain" alt="Brand logo" />
      </div>
    )}

    <div className="flex items-center justify-between text-[9px] font-oswald italic font-black uppercase tracking-widest text-zinc-700">
      <span>{kit.fontStyle}</span>
      <span>{new Date(kit.createdAt).toLocaleDateString()}</span>
    </div>
  </motion.div>
);

interface EditState {
  id: string;
  name: string;
  teamContext: string;
  palette: string[];
  logoBase64: string | null;
  fontStyle: string;
  newColor: string;
}

const BLANK_EDIT = (): EditState => ({
  id: `bk_${Date.now()}`,
  name: '',
  teamContext: '',
  palette: ['#ccff00', '#000000', '#ffffff'],
  logoBase64: null,
  fontStyle: 'OSWALD_ITALIC',
  newColor: '#ccff00',
});

export const BrandKitManager: React.FC<BrandKitManagerProps> = ({ kits, tier, onSave, onDelete, onUpgradeClick }) => {
  const [editing, setEditing] = useState<EditState | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const limit = KIT_LIMIT[tier];
  const canCreate = kits.length < limit;

  const openNew = () => setEditing(BLANK_EDIT());
  const openEdit = (kit: BrandKit) => setEditing({
    id: kit.id,
    name: kit.name,
    teamContext: kit.teamContext,
    palette: [...kit.palette],
    logoBase64: kit.logoBase64,
    fontStyle: kit.fontStyle,
    newColor: kit.palette[0] ?? '#ccff00',
  });

  const handleSave = () => {
    if (!editing || !editing.name.trim()) return;
    onSave({
      id: editing.id,
      name: editing.name.trim(),
      teamContext: editing.teamContext.trim(),
      palette: editing.palette,
      logoBase64: editing.logoBase64,
      fontStyle: editing.fontStyle,
      createdAt: new Date().toISOString(),
    });
    setEditing(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditing(prev => prev ? { ...prev, logoBase64: reader.result as string } : prev);
    reader.readAsDataURL(file);
  };

  const addColor = () => {
    if (!editing || editing.palette.length >= 6) return;
    setEditing(prev => prev ? { ...prev, palette: [...prev.palette, prev.newColor] } : prev);
  };

  const removeColor = (i: number) => {
    if (!editing) return;
    setEditing(prev => prev ? { ...prev, palette: prev.palette.filter((_, idx) => idx !== i) } : prev);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-oswald italic font-black text-3xl uppercase text-white leading-none">BRAND KITS</h2>
          <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
            {tier === 'free' ? 'PRO FEATURE' : `${kits.length} / ${limit === Infinity ? '∞' : limit} KITS`}
          </p>
        </div>
        {tier === 'free' ? (
          <button onClick={onUpgradeClick} className="flex items-center gap-2 px-5 py-2.5 bg-[#ccff00] text-black font-oswald italic font-black text-xs uppercase rounded-xl">
            <Lock className="w-3.5 h-3.5" /> UNLOCK PRO
          </button>
        ) : canCreate ? (
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-[#ccff00] text-black font-oswald italic font-black text-xs uppercase rounded-xl">
            <Plus className="w-3.5 h-3.5" /> NEW KIT
          </button>
        ) : (
          <button onClick={onUpgradeClick} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-zinc-500 font-oswald italic font-black text-xs uppercase rounded-xl">
            <ChevronRight className="w-3.5 h-3.5" /> MORE KITS (ELITE)
          </button>
        )}
      </div>

      {/* Free tier locked state */}
      {tier === 'free' && (
        <div className="flex flex-col items-center justify-center py-20 gap-5 glass rounded-[2rem] border border-white/5">
          <div className="w-14 h-14 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#ccff00]" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-oswald italic font-black text-lg text-white uppercase">Brand Kits are Pro+</p>
            <p className="text-zinc-500 text-sm font-sans max-w-xs mx-auto">Save custom color palettes and logos for your school, club, or semi-pro team. Reuse them across all your swaps.</p>
          </div>
          <button onClick={onUpgradeClick} className="px-8 py-3 bg-[#ccff00] text-black font-oswald italic font-black uppercase rounded-xl text-sm">
            UPGRADE TO PRO
          </button>
        </div>
      )}

      {/* Kits grid */}
      {tier !== 'free' && (
        <AnimatePresence>
          {kits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 gap-4 glass rounded-[2rem] border border-dashed border-white/10"
            >
              <Palette className="w-8 h-8 text-zinc-700" />
              <p className="font-oswald italic font-black text-zinc-600 uppercase text-sm">NO KITS YET</p>
              <button onClick={openNew} className="flex items-center gap-2 px-6 py-2.5 border border-white/10 text-white font-oswald italic font-black text-xs uppercase rounded-xl hover:border-[#ccff00]/30 transition-colors">
                <Plus className="w-3.5 h-3.5" /> CREATE FIRST KIT
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kits.map(kit => (
                <KitCard key={kit.id} kit={kit} onEdit={() => openEdit(kit)} onDelete={() => onDelete(kit.id)} />
              ))}
            </div>
          )}
        </AnimatePresence>
      )}

      {/* Edit drawer */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="w-full sm:max-w-lg bg-zinc-950 border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-7 py-6 border-b border-white/5">
                <h3 className="font-oswald italic font-black text-white text-xl uppercase">{editing.name || 'NEW KIT'}</h3>
                <button onClick={() => setEditing(null)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-7 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Name + context */}
                <div className="space-y-3">
                  <input
                    value={editing.name}
                    onChange={e => setEditing(p => p ? { ...p, name: e.target.value } : p)}
                    placeholder="KIT NAME (e.g. EASTSIDE EAGLES)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 font-oswald italic text-white text-sm placeholder:text-zinc-600 outline-none focus:border-[#ccff00]/30"
                  />
                  <input
                    value={editing.teamContext}
                    onChange={e => setEditing(p => p ? { ...p, teamContext: e.target.value } : p)}
                    placeholder="TEAM CONTEXT (e.g. North Ridge HS Football)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 font-oswald italic text-white text-sm placeholder:text-zinc-600 outline-none focus:border-[#ccff00]/30"
                  />
                </div>

                {/* Color palette */}
                <div>
                  <p className="font-oswald italic font-black text-[9px] text-zinc-500 uppercase tracking-[0.3em] mb-3">PALETTE ({editing.palette.length}/6)</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {editing.palette.map((hex, i) => (
                      <ColorSwatch key={i} color={hex} onRemove={() => removeColor(i)} />
                    ))}
                  </div>
                  {editing.palette.length < 6 && (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={editing.newColor}
                        onChange={e => setEditing(p => p ? { ...p, newColor: e.target.value } : p)}
                        className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer"
                      />
                      <button onClick={addColor} className="flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded-xl font-oswald italic font-black text-[10px] uppercase text-white hover:border-[#ccff00]/30 transition-colors">
                        <Plus className="w-3 h-3" /> ADD COLOR
                      </button>
                    </div>
                  )}
                </div>

                {/* Logo upload */}
                <div>
                  <p className="font-oswald italic font-black text-[9px] text-zinc-500 uppercase tracking-[0.3em] mb-3">LOGO</p>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  {editing.logoBase64 ? (
                    <div className="relative w-full h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center group">
                      <img src={editing.logoBase64} className="h-full w-auto object-contain" alt="Kit logo" />
                      <button
                        onClick={() => setEditing(p => p ? { ...p, logoBase64: null } : p)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => logoRef.current?.click()} className="w-full py-5 border border-dashed border-white/15 rounded-2xl flex items-center justify-center gap-2 text-zinc-600 hover:text-white hover:border-white/25 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="font-oswald italic font-black text-xs uppercase">UPLOAD LOGO</span>
                    </button>
                  )}
                </div>

                {/* Font */}
                <div>
                  <p className="font-oswald italic font-black text-[9px] text-zinc-500 uppercase tracking-[0.3em] mb-3">FONT STYLE</p>
                  <div className="flex gap-2 flex-wrap">
                    {FONT_OPTIONS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setEditing(p => p ? { ...p, fontStyle: f.id } : p)}
                        className={`px-4 py-2 rounded-xl border font-oswald italic font-black text-[11px] uppercase transition-all ${
                          editing.fontStyle === f.id
                            ? 'bg-[#ccff00] text-black border-[#ccff00]'
                            : 'bg-white/5 text-zinc-500 border-white/8 hover:border-white/20'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="px-7 py-5 border-t border-white/5 flex gap-3">
                <button onClick={() => setEditing(null)} className="flex-1 py-4 border border-white/10 text-zinc-500 font-oswald italic font-black text-sm uppercase rounded-xl">
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  disabled={!editing.name.trim()}
                  className="flex-1 py-4 bg-[#ccff00] text-black font-oswald italic font-black text-sm uppercase rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> SAVE KIT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandKitManager;
