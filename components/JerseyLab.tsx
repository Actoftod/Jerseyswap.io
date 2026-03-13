import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import {
  Upload, Zap, ChevronRight, RotateCcw, CheckCircle2,
  Layers, Cpu, Sparkles, X, ImagePlus, FlaskConical
} from 'lucide-react';
import { Team } from '../types';

// ─── Texture configs ─────────────────────────────────────────────────────────
export type TextureMode = 'vintage' | 'modern' | 'concept' | null;

const TEXTURES: { id: TextureMode; label: string; sub: string; color: string }[] = [
  {
    id: 'vintage',
    label: 'VINTAGE',
    sub: '90s mesh weave',
    color: '#D97706',
  },
  {
    id: 'modern',
    label: 'MODERN',
    sub: 'Vapor-knit DRI-FIT',
    color: '#0EA5E9',
  },
  {
    id: 'concept',
    label: 'CONCEPT',
    sub: 'Chrome / metallic',
    color: '#ccff00',
  },
];

// ─── Prompt builder ───────────────────────────────────────────────────────────
function buildEnrichedPrompt(
  teamName: string,
  number: string,
  texture: TextureMode,
  logoPlacement: string | null,
  customPrompt: string
): string {
  const textureDesc: Record<NonNullable<TextureMode>, string> = {
    vintage:
      'Apply a 1990s mesh-weave fabric texture — visible mesh holes, slightly faded stitching, retro cut.',
    modern:
      'Apply a ultra-modern vapor-knit DRI-FIT texture — tight micro-knit pattern, moisture-wicking sheen, athletic compression fit.',
    concept:
      'Apply a chrome/metallic concept jersey texture — reflective holographic panels, futuristic iridescent sheen, high-gloss finish.',
  };

  const parts: string[] = [
    `IDENTITY LOCK PROTOCOL: Replace clothing with official ${teamName} uniform (Number ${number}). Photorealistic 8K render.`,
  ];

  if (texture) parts.push(textureDesc[texture]);
  if (logoPlacement) parts.push(`LOGO PATCH DIRECTIVE: ${logoPlacement}`);
  if (customPrompt) parts.push(`Additional directive: ${customPrompt}`);

  return parts.join(' ');
}

// ─── Gemini logo placement analysis ─────────────────────────────────────────
async function analyzeLogoPatch(
  logoBase64: string,
  teamName: string,
  apiKey: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: {
      parts: [
        {
          inlineData: {
            data: logoBase64.replace(/^data:image\/\w+;base64,/, ''),
            mimeType: 'image/png',
          },
        },
        {
          text: `Analyze this custom logo image and describe precisely how it should be applied as a patch on a ${teamName} sports jersey. Describe placement (chest left, sleeve, back collar, etc.), approximate size relative to jersey, and blending style (embroidered patch, sublimated print, heat-press). Return a single concise directive sentence for an image generation model.`,
        },
      ],
    },
    config: { temperature: 0.4 },
  });
  return response.text || `Add the provided custom logo as a small embroidered patch on the left chest of the ${teamName} jersey.`;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface JerseyLabProps {
  image: string;
  teams: Team[];
  selectedTeam: Team | null;
  onTeamSelect: (t: Team) => void;
  number: string;
  onNumberChange: (n: string) => void;
  removeBackground: boolean;
  onToggleBackground: () => void;
  customPrompt: string;
  onCustomPromptChange: (v: string) => void;
  onSwap: (enrichedPrompt: string) => void;
  isProcessing: boolean;
}

const JerseyLab: React.FC<JerseyLabProps> = ({
  image,
  teams,
  selectedTeam,
  onTeamSelect,
  number,
  onNumberChange,
  removeBackground,
  onToggleBackground,
  customPrompt,
  onCustomPromptChange,
  onSwap,
  isProcessing,
}) => {
  const [texture, setTexture] = useState<TextureMode>(null);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [logoPlacement, setLogoPlacement] = useState<string | null>(null);
  const [isAnalyzingLogo, setIsAnalyzingLogo] = useState(false);
  const [logoAnalyzed, setLogoAnalyzed] = useState(false);
  const [activeSection, setActiveSection] = useState<'texture' | 'logo' | 'number' | 'prompt'>('texture');

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (ev) => {
        const b64 = ev.target?.result as string;
        setCustomLogo(b64);
        setLogoAnalyzed(false);
        setLogoPlacement(null);

        const apiKey = process.env.API_KEY || '';
        if (!apiKey) return;

        setIsAnalyzingLogo(true);
        try {
          const placement = await analyzeLogoPatch(b64, selectedTeam?.name || 'the team', apiKey);
          setLogoPlacement(placement);
          setLogoAnalyzed(true);
        } catch (err) {
          console.error('Logo analysis failed:', err);
          setLogoPlacement(`Add the custom logo as an embroidered patch on the left chest area.`);
          setLogoAnalyzed(true);
        } finally {
          setIsAnalyzingLogo(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [selectedTeam]
  );

  const handleForge = () => {
    const enriched = buildEnrichedPrompt(
      selectedTeam?.name || 'the selected team',
      number,
      texture,
      logoPlacement,
      customPrompt
    );
    onSwap(enriched);
  };

  const canForge = !!selectedTeam && !isProcessing;

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 px-1">
        <div className="w-10 h-10 rounded-xl bg-[#ccff00] flex items-center justify-center shrink-0">
          <FlaskConical className="w-5 h-5 text-black" />
        </div>
        <div>
          <h2 className="font-oswald italic font-black text-2xl uppercase tracking-ultra text-white leading-none">
            JERSEY LAB
          </h2>
          <p className="font-oswald italic text-[10px] text-zinc-500 tracking-widest uppercase mt-0.5">
            ADVANCED SYNTHESIS // GEMINI 2.0 NEURAL ENGINE
          </p>
        </div>
      </div>

      {/* Preview + Team */}
      <div className="flex gap-4">
        <div className="w-28 h-36 rounded-2xl overflow-hidden border border-white/10 shrink-0">
          <img src={image} className="w-full h-full object-cover" alt="Source plate" />
        </div>
        <div className="flex-1 space-y-3">
          <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-widest">SELECTED_TEAM</p>
          {selectedTeam ? (
            <div className="flex items-center gap-3 px-4 py-3 glass rounded-2xl border border-[#ccff00]/30">
              <img src={selectedTeam.logo} className="w-8 h-8 object-contain" alt={selectedTeam.name} />
              <span className="font-oswald italic font-black text-sm uppercase text-white">{selectedTeam.name}</span>
            </div>
          ) : (
            <div className="px-4 py-3 glass rounded-2xl border border-white/5">
              <span className="font-oswald italic text-xs text-zinc-600 uppercase">NO_TEAM_SELECTED</span>
            </div>
          )}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {teams.slice(0, 6).map((t) => (
              <button
                key={t.id}
                onClick={() => onTeamSelect(t)}
                className={`shrink-0 px-3 py-1.5 rounded-xl border font-oswald italic font-black text-[9px] uppercase transition-all ${
                  selectedTeam?.id === t.id
                    ? 'bg-[#ccff00] text-black border-transparent'
                    : 'border-white/10 text-zinc-500 hover:border-white/30'
                }`}
              >
                {t.name.split(' ').slice(-1)[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'texture', label: 'TEXTURE', icon: Layers },
          { id: 'logo', label: 'LOGO PATCH', icon: ImagePlus },
          { id: 'number', label: 'NUMBER', icon: Cpu },
          { id: 'prompt', label: 'DIRECTIVES', icon: Sparkles },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as any)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-oswald italic font-black text-[10px] uppercase tracking-widest transition-all ${
              activeSection === id
                ? 'bg-[#ccff00] text-black'
                : 'glass border border-white/10 text-zinc-500 hover:text-white'
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'texture' && (
          <motion.div
            key="texture"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-3 gap-3"
          >
            {/* None option */}
            <button
              onClick={() => setTexture(null)}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                texture === null
                  ? 'border-white/30 bg-white/5'
                  : 'border-white/5 glass hover:border-white/20'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <X className="w-4 h-4 text-zinc-600" />
              </div>
              <span className="font-oswald italic font-black text-[9px] uppercase text-zinc-500">STANDARD</span>
              <span className="font-oswald italic text-[8px] text-zinc-700 uppercase">default fabric</span>
            </button>

            {TEXTURES.map((tx) => (
              <button
                key={tx.id}
                onClick={() => setTexture(tx.id)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  texture === tx.id
                    ? 'border-current bg-white/5'
                    : 'border-white/5 glass hover:border-white/20'
                }`}
                style={{ borderColor: texture === tx.id ? tx.color : undefined }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${tx.color}22` }}
                >
                  <Layers className="w-5 h-5" style={{ color: tx.color }} />
                </div>
                <span
                  className="font-oswald italic font-black text-[9px] uppercase"
                  style={{ color: texture === tx.id ? tx.color : '#71717a' }}
                >
                  {tx.label}
                </span>
                <span className="font-oswald italic text-[8px] text-zinc-600 uppercase text-center leading-tight">
                  {tx.sub}
                </span>
                {texture === tx.id && (
                  <CheckCircle2 className="w-3 h-3" style={{ color: tx.color }} />
                )}
              </button>
            ))}
          </motion.div>
        )}

        {activeSection === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div
              onClick={() => logoInputRef.current?.click()}
              className={`relative w-full py-10 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                customLogo
                  ? 'border-[#ccff00]/40 bg-[#ccff00]/5'
                  : 'border-white/10 glass hover:border-white/30'
              }`}
            >
              {customLogo ? (
                <>
                  <img
                    src={customLogo}
                    className="h-20 w-20 object-contain rounded-xl"
                    alt="Custom logo"
                  />
                  <span className="font-oswald italic font-black text-xs text-[#ccff00] uppercase">
                    LOGO_LOADED — TAP TO REPLACE
                  </span>
                </>
              ) : (
                <>
                  <ImagePlus className="w-10 h-10 text-zinc-600" />
                  <span className="font-oswald italic font-black text-sm uppercase text-zinc-500">
                    UPLOAD_CUSTOM_LOGO
                  </span>
                  <span className="font-oswald italic text-[9px] text-zinc-700 uppercase">
                    PNG WITH TRANSPARENCY RECOMMENDED
                  </span>
                </>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            <AnimatePresence>
              {isAnalyzingLogo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 px-4 py-3 glass rounded-2xl border border-[#ccff00]/20"
                >
                  <RotateCcw className="w-4 h-4 text-[#ccff00] animate-spin" />
                  <span className="font-oswald italic font-black text-[10px] text-[#ccff00] uppercase tracking-widest">
                    GEMINI ANALYZING PLACEMENT...
                  </span>
                </motion.div>
              )}
              {logoAnalyzed && logoPlacement && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 glass rounded-2xl border border-[#ccff00]/20 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span className="font-oswald italic font-black text-[10px] text-[#ccff00] uppercase tracking-widest">
                      PLACEMENT ANALYZED
                    </span>
                  </div>
                  <p className="font-oswald italic text-[11px] text-zinc-400 leading-relaxed">
                    {logoPlacement}
                  </p>
                  <button
                    onClick={() => {
                      setCustomLogo(null);
                      setLogoPlacement(null);
                      setLogoAnalyzed(false);
                    }}
                    className="text-[9px] font-oswald italic font-black text-zinc-600 uppercase hover:text-red-400 transition-colors"
                  >
                    REMOVE LOGO
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeSection === 'number' && (
          <motion.div
            key="number"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-widest">JERSEY_NUMBER</p>
            <input
              value={number}
              onChange={(e) => onNumberChange(e.target.value.slice(0, 2))}
              maxLength={2}
              placeholder="23"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-oswald italic font-black text-5xl text-center text-white outline-none focus:border-[#ccff00] transition-all tracking-ultra"
            />
            <div className="flex gap-2 flex-wrap">
              {['00', '1', '7', '10', '12', '21', '23', '24', '33', '45'].map((n) => (
                <button
                  key={n}
                  onClick={() => onNumberChange(n)}
                  className={`w-12 h-12 rounded-xl font-oswald italic font-black text-sm border transition-all ${
                    number === n
                      ? 'bg-[#ccff00] text-black border-transparent'
                      : 'border-white/10 text-zinc-500 glass hover:border-white/30'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Background toggle */}
            <div className="flex items-center justify-between px-4 py-4 glass rounded-2xl border border-white/5">
              <div>
                <p className="font-oswald italic font-black text-xs uppercase text-white">BACKGROUND_REMOVAL</p>
                <p className="font-oswald italic text-[9px] text-zinc-600 uppercase">Isolate athlete on studio backdrop</p>
              </div>
              <button
                onClick={onToggleBackground}
                className={`w-12 h-6 rounded-full border-2 relative transition-all ${
                  removeBackground ? 'bg-[#ccff00] border-[#ccff00]' : 'bg-zinc-900 border-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${
                    removeBackground ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        )}

        {activeSection === 'prompt' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-widest">
              ADDITIONAL_DIRECTIVES
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              placeholder="e.g. Stadium crowd background, dramatic lighting from above, golden hour..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 font-oswald italic text-sm text-white outline-none focus:border-[#ccff00] transition-all resize-none leading-relaxed"
            />
            <div className="p-4 glass rounded-2xl border border-white/5 space-y-2">
              <p className="font-oswald italic font-black text-[9px] text-zinc-500 uppercase tracking-widest">
                FULL_PROMPT_PREVIEW
              </p>
              <p className="font-oswald italic text-[10px] text-zinc-400 leading-relaxed">
                {buildEnrichedPrompt(
                  selectedTeam?.name || '[TEAM]',
                  number,
                  texture,
                  logoPlacement,
                  customPrompt
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forge CTA */}
      <div className="sticky bottom-20 z-40">
        <motion.button
          onClick={handleForge}
          disabled={!canForge}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-6 rounded-3xl font-oswald italic font-black text-2xl uppercase flex items-center justify-center gap-3 transition-all shadow-2xl ${
            canForge
              ? 'bg-[#ccff00] text-black glow-lime'
              : 'bg-zinc-900 text-zinc-700 border border-white/5 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <RotateCcw className="w-6 h-6 animate-spin" />
              NEURAL FORGING...
            </>
          ) : (
            <>
              <Zap className="w-6 h-6 fill-current" />
              LAB_FORGE
              {texture && (
                <span className="ml-1 text-xs font-black">
                  [{texture.toUpperCase()}]
                </span>
              )}
            </>
          )}
        </motion.button>
        {!selectedTeam && (
          <p className="text-center font-oswald italic text-[9px] text-zinc-600 uppercase mt-2 tracking-widest">
            SELECT A TEAM TO ENABLE FORGE
          </p>
        )}
      </div>
    </div>
  );
};

export default JerseyLab;
