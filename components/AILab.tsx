
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import AdvancedEditor from './AdvancedEditor';
import { CollabStudio } from './CollabStudio';
import { PatchLibrary } from './PatchLibrary';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Search, Zap, Upload, MessageCircle, Sparkles, Send, PenTool,
  RotateCcw, Check, X, ShieldCheck, Users, TrendingUp, ArrowRight,
  Star, Award, ImageIcon, Layers,
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CollabSession, UserProfile } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroundingLink { uri: string; title: string; }

interface TradeRumor {
  player: string;
  fromTeam: string;
  toTeam: string;
  likelihood: string;
  summary: string;
}

interface TradeResult {
  rumors: TradeRumor[];
  suggestedSwapTeam: string | null;
  analysis: string;
}

interface BrandScore {
  overall: number;
  lighting: number;
  logoPlacement: number;
  colorAccuracy: number;
  fabricRealism: number;
  verdict: string;
  tips: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOGO_STYLES = [
  { id: 'minimalist', label: 'INFINITE_LOOP',  desc: 'Apple-grade clean vectors',      prompt: 'ultra-minimalist, geometric, perfect symmetry, San Francisco typography, monochromatic' },
  { id: 'kinetic',    label: 'AEROSWIFT',       desc: 'Nike-grade performance lines',   prompt: 'dynamic, motion-blur-inspired, aggressive angles, high-performance aesthetic, bold sans-serif' },
  { id: 'heritage',   label: 'LEGACY_MARK',     desc: 'Classic championship crest',     prompt: 'shield-inspired, heritage textures, metallic gold accents, collegiate typography, prestigious' },
];

const LIKELIHOOD_COLOR: Record<string, string> = {
  high:   'text-red-400 border-red-400/30 bg-red-400/10',
  medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  low:    'text-zinc-400 border-zinc-400/20 bg-zinc-400/5',
};

const getLikelihoodStyle = (likelihood: string) =>
  LIKELIHOOD_COLOR[likelihood.toLowerCase()] ?? LIKELIHOOD_COLOR.low;

// ─── Score bar helper ─────────────────────────────────────────────────────────

const ScoreBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="font-oswald italic font-black text-[9px] text-zinc-400 uppercase tracking-widest">{label}</span>
      <span className="font-oswald italic font-black text-sm" style={{ color }}>{value}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const scoreColor = (v: number) => v >= 80 ? '#ccff00' : v >= 55 ? '#f59e0b' : '#ef4444';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AILabProps {
  activeTab?: 'scout' | 'coach' | 'studio';
  onTabChange?: (tab: 'scout' | 'coach' | 'studio') => void;
  user?: UserProfile;
  collabSessions?: CollabSession[];
  onCreateCollabSession?: (session: CollabSession) => void;
  onJoinCollabSession?: (sessionId: string) => void;
  onUpdateCollabSession?: (sessionId: string, updates: Partial<CollabSession>) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AILab: React.FC<AILabProps> = ({
  activeTab: externalTab,
  onTabChange,
  user,
  collabSessions = [],
  onCreateCollabSession,
  onJoinCollabSession,
  onUpdateCollabSession,
}) => {
  const [internalTab, setInternalTab] = useState<'scout' | 'coach' | 'studio'>('scout');
  const activeTab = externalTab ?? internalTab;
  const setActiveTab = (tab: 'scout' | 'coach' | 'studio') => { setInternalTab(tab); onTabChange?.(tab); };

  // ── Shared ──
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Scout ──
  const [scoutMode, setScoutMode] = useState<'intel' | 'trade'>('intel');
  const [scoutResult, setScoutResult] = useState<{ text: string; sources: GroundingLink[] } | null>(null);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);

  // ── Coach ──
  const [coachLog, setCoachLog] = useState<{ type: 'user' | 'coach'; text: string; suggestions?: string[] }[]>([]);
  const [brandScoreMode, setBrandScoreMode] = useState(false);
  const [brandScore, setBrandScore] = useState<BrandScore | null>(null);
  const [isScoringBrand, setIsScoringBrand] = useState(false);
  const brandImageRef = useRef<HTMLInputElement>(null);

  // ── Studio ──
  const [studioImage, setStudioImage] = useState<string | null>(null);
  const [studioMode, setStudioMode] = useState<'default' | 'collab' | 'patch'>('default');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [logoPrompt, setLogoPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(LOGO_STYLES[0]);
  const [showLogoMaker, setShowLogoMaker] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const gemini = useRef(new GeminiService());

  const checkApiKey = (): boolean => {
    const key = process.env.API_KEY;
    if (!key) { alert("API_KEY not configured."); return false; }
    return true;
  };

  // ── Scout handlers ──────────────────────────────────────────────────────────

  const handleScout = async (template?: string) => {
    const finalQuery = template || query;
    if (!finalQuery) return;
    setIsProcessing(true);
    setScoutResult(null);
    try {
      const response = await gemini.current.queryScoutMode(finalQuery);
      setScoutResult(response);
    } catch (err) { console.error(err); }
    finally { setIsProcessing(false); setQuery(''); }
  };

  const handleTradeScout = async (template?: string) => {
    const finalQuery = template || query;
    if (!finalQuery) return;
    setIsProcessing(true);
    setTradeResult(null);
    try {
      const result = await gemini.current.queryTradeRumors(finalQuery);
      setTradeResult(result);
    } catch (err) { console.error(err); }
    finally { setIsProcessing(false); setQuery(''); }
  };

  // ── Coach handlers ──────────────────────────────────────────────────────────

  const handleLiveCoach = async (overrideQuery?: string) => {
    const targetQuery = overrideQuery || query;
    if (!targetQuery) return;
    setIsProcessing(true);
    setCoachLog(prev => [...prev, { type: 'user', text: targetQuery }]);
    setQuery('');
    try {
      const response = await gemini.current.queryCoachMode(targetQuery);
      setCoachLog(prev => [...prev, { type: 'coach', text: response.text, suggestions: response.suggestions }]);
    } catch (err) {
      console.error(err);
      setCoachLog(prev => [...prev, { type: 'coach', text: "Neural downlink interrupted." }]);
    } finally { setIsProcessing(false); }
  };

  const handleBrandScoreUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsScoringBrand(true);
      setBrandScore(null);
      try {
        const score = await gemini.current.queryBrandScore(base64);
        setBrandScore(score);
      } catch (err) { console.error(err); }
      finally { setIsScoringBrand(false); }
    };
    reader.readAsDataURL(file);
  };

  // ── Studio handlers ─────────────────────────────────────────────────────────

  const handleStudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setStudioImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateLogo = async () => {
    if (!logoPrompt) return;
    if (!checkApiKey()) return;
    setIsGeneratingLogo(true);
    setPreviewLogo(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-001',
        prompt: `Ultra-premium sports brand logo for "${logoPrompt.toUpperCase()}". Archetype: ${selectedStyle.prompt}. Design language: Pure black and white, vector aesthetic, high contrast. Must look like a professional identity for Nike or Apple. No shadows, no gradients, pure 8K precision. Centered on white background.`,
        config: { numberOfImages: 1, aspectRatio: '1:1', outputMimeType: 'image/jpeg' },
      });
      if (response.generatedImages?.[0]) {
        const base64 = response.generatedImages[0].image.imageBytes;
        setPreviewLogo(`data:image/png;base64,${base64}`);
      }
    } catch (err) {
      console.error("Logo generation failed:", err);
      alert("Logo generation failed. Please check your API key and try again.");
    } finally { setIsGeneratingLogo(false); }
  };

  const commitLogoToStudio = () => {
    if (previewLogo) { setStudioImage(previewLogo); setShowLogoMaker(false); setPreviewLogo(null); setLogoPrompt(''); }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-700 px-4">

      {/* ═══ SCOUT TAB ═══════════════════════════════════════════════════════ */}
      {activeTab === 'scout' && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-oswald text-5xl md:text-[8rem] italic font-black uppercase leading-none tracking-tighter text-white">INTEL ENGINE</h2>
            <p className="text-[#ccff00] font-oswald text-[10px] tracking-[0.6em] italic opacity-60 font-black">GLOBAL NEURAL GROUNDING</p>
          </div>

          {/* Mode switcher */}
          <div className="flex justify-center gap-3">
            {([
              { id: 'intel', label: 'ROSTER INTEL', icon: Search },
              { id: 'trade', label: 'TRADE TRACKER', icon: TrendingUp },
            ] as const).map(m => (
              <button
                key={m.id}
                onClick={() => { setScoutMode(m.id); setScoutResult(null); setTradeResult(null); setQuery(''); }}
                className={`flex items-center gap-2 px-6 h-10 rounded-full font-oswald italic font-black text-[10px] uppercase tracking-widest border transition-all ${scoutMode === m.id ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'}`}
              >
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            ))}
          </div>

          {/* ── Intel mode ── */}
          {scoutMode === 'intel' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <div className="md:col-span-2 space-y-6">
                <div className="relative group">
                  <input
                    type="text" value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="SCAN LOCATION OR TEAM..."
                    className="w-full bg-black/40 border-2 border-white/10 rounded-[2rem] p-6 md:p-8 font-oswald text-xl md:text-3xl italic tracking-tighter focus:border-[#ccff00] outline-none text-white transition-all pr-24 md:pr-40"
                    onKeyDown={e => e.key === 'Enter' && handleScout()}
                  />
                  <button onClick={() => handleScout()} disabled={isProcessing}
                    className="absolute right-3 top-3 bottom-3 px-6 md:px-12 bg-[#ccff00] text-black font-oswald italic rounded-2xl shadow-lg active:scale-95 transition-all font-black text-sm md:text-xl">
                    {isProcessing ? 'SCANNING...' : 'SCAN'}
                  </button>
                </div>
                {scoutResult && (
                  <div className="glass rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 animate-in slide-in-from-bottom-4 duration-500">
                    <p className="font-inter italic text-zinc-300 text-sm md:text-lg leading-relaxed mb-8 text-left">{scoutResult.text}</p>
                    {scoutResult.sources.length > 0 && (
                      <div className="space-y-4">
                        <p className="font-oswald text-[8px] md:text-[10px] text-zinc-500 tracking-[0.3em] uppercase italic font-bold text-left">VERIFIED SOURCES</p>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {scoutResult.sources.map((src, i) => (
                            <a key={i} href={src.uri} target="_blank" rel="noreferrer"
                               className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-oswald italic text-[#ccff00] hover:bg-[#ccff00]/10 transition-colors uppercase">
                              {src.title.toUpperCase() || 'SOURCE INTEL'}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-3 md:space-y-4">
                <p className="font-oswald text-[8px] md:text-[10px] text-zinc-500 tracking-[0.4em] uppercase italic px-4 font-black text-left">QUICK SCANS</p>
                {[
                  { label: 'NBA HQ',        q: 'Tell me about NBA League offices in NY' },
                  { label: 'KC Chiefs Colors', q: 'Official color palette for the KC Chiefs' },
                  { label: 'Stadium Intel', q: 'Recent news on SoFi Stadium' },
                ].map(item => (
                  <button key={item.label} onClick={() => handleScout(item.q)}
                    className="w-full p-5 md:p-6 glass rounded-[1.5rem] md:rounded-[2rem] border border-white/5 text-left font-oswald italic tracking-tighter hover:border-[#ccff00]/40 transition-all text-white/50 hover:text-white group flex items-center justify-between">
                    <span className="text-sm md:text-xl font-bold">{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Trade Tracker mode ── */}
          {scoutMode === 'trade' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <div className="md:col-span-2 space-y-6">
                <div className="relative group">
                  <input
                    type="text" value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="ENTER PLAYER OR TEAM NAME..."
                    className="w-full bg-black/40 border-2 border-white/10 rounded-[2rem] p-6 md:p-8 font-oswald text-xl md:text-3xl italic tracking-tighter focus:border-[#ccff00] outline-none text-white transition-all pr-32 md:pr-44"
                    onKeyDown={e => e.key === 'Enter' && handleTradeScout()}
                  />
                  <button onClick={() => handleTradeScout()} disabled={isProcessing}
                    className="absolute right-3 top-3 bottom-3 px-6 md:px-10 bg-[#ccff00] text-black font-oswald italic rounded-2xl shadow-lg active:scale-95 transition-all font-black text-sm md:text-lg whitespace-nowrap">
                    {isProcessing ? 'SCANNING...' : 'TRACK'}
                  </button>
                </div>

                <AnimatePresence>
                  {tradeResult && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      {/* Analysis summary */}
                      <div className="glass rounded-[2rem] p-6 md:p-8 border border-white/10">
                        <p className="font-oswald italic font-black text-[9px] text-[#ccff00] uppercase tracking-widest mb-3">MARKET ANALYSIS</p>
                        <p className="font-inter italic text-zinc-300 text-sm leading-relaxed">{tradeResult.analysis}</p>
                      </div>

                      {/* Rumor cards */}
                      {tradeResult.rumors.length > 0 && (
                        <div className="space-y-3">
                          <p className="font-oswald italic font-black text-[9px] text-zinc-500 uppercase tracking-widest">ACTIVE RUMORS</p>
                          {tradeResult.rumors.map((r, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="glass rounded-[1.5rem] p-5 border border-white/5 flex items-start gap-5"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                  <span className="font-oswald italic font-black text-base text-white uppercase">{r.player}</span>
                                  <span className={`px-2.5 py-0.5 rounded-full border font-oswald italic font-black text-[8px] uppercase tracking-widest ${getLikelihoodStyle(r.likelihood)}`}>
                                    {r.likelihood} ODDS
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-oswald italic text-[10px] text-zinc-500 uppercase">{r.fromTeam}</span>
                                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                                  <span className="font-oswald italic font-black text-[10px] text-[#ccff00] uppercase">{r.toTeam}</span>
                                </div>
                                <p className="font-inter italic text-[11px] text-zinc-500 leading-relaxed">{r.summary}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Swap suggestion CTA */}
                      {tradeResult.suggestedSwapTeam && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-[2rem] p-6 border border-[#ccff00]/30 bg-[#ccff00]/5 flex items-center gap-5"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6 text-[#ccff00]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-oswald italic font-black text-[9px] text-[#ccff00] uppercase tracking-widest mb-1">SWAP SUGGESTION</p>
                            <p className="font-oswald italic font-black text-lg text-white uppercase">
                              Try a <span className="text-[#ccff00]">{tradeResult.suggestedSwapTeam}</span> jersey swap
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-[#ccff00] shrink-0" />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick trade scans */}
              <div className="space-y-3 md:space-y-4">
                <p className="font-oswald text-[8px] md:text-[10px] text-zinc-500 tracking-[0.4em] uppercase italic px-4 font-black text-left">HOT RUMORS</p>
                {[
                  { label: 'NBA Trades',    q: 'Top NBA trade rumors this week' },
                  { label: 'NFL Free Agency', q: 'Top NFL free agency moves this season' },
                  { label: 'MLB Deadline',  q: 'MLB trade deadline rumors' },
                ].map(item => (
                  <button key={item.label} onClick={() => handleTradeScout(item.q)}
                    className="w-full p-5 glass rounded-[1.5rem] border border-white/5 text-left font-oswald italic tracking-tighter hover:border-[#ccff00]/40 transition-all text-white/50 hover:text-white group flex items-center justify-between">
                    <span className="text-sm font-bold">{item.label}</span>
                    <TrendingUp className="w-4 h-4 text-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ COACH TAB ═══════════════════════════════════════════════════════ */}
      {activeTab === 'coach' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
          <div className="text-center space-y-4">
            <h2 className="font-oswald text-5xl md:text-[6rem] italic font-black uppercase leading-none tracking-ultra text-[#ccff00] drop-shadow-[0_0_30px_rgba(204,255,0,0.2)]">DESIGN COACH</h2>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-4 h-4 text-[#ccff00] animate-pulse" />
              <p className="text-zinc-500 font-oswald text-[10px] tracking-[0.6em] italic font-black uppercase">Expert Synthesis & Advice</p>
            </div>
          </div>

          {/* Mode switcher */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setBrandScoreMode(false)}
              className={`flex items-center gap-2 px-6 h-10 rounded-full font-oswald italic font-black text-[10px] uppercase tracking-widest border transition-all ${!brandScoreMode ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              ADVICE
            </button>
            <button
              onClick={() => setBrandScoreMode(true)}
              className={`flex items-center gap-2 px-6 h-10 rounded-full font-oswald italic font-black text-[10px] uppercase tracking-widest border transition-all ${brandScoreMode ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'}`}
            >
              <Award className="w-3.5 h-3.5" />
              BRAND SCORE
            </button>
          </div>

          {/* ── Advice mode ── */}
          {!brandScoreMode && (
            <div className="glass rounded-[3rem] h-[600px] border border-white/10 flex flex-col overflow-hidden relative shadow-2xl">
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar scroll-smooth">
                {coachLog.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center px-10">
                    <div className="w-20 h-20 bg-[#ccff00]/10 rounded-full flex items-center justify-center mb-6 border border-[#ccff00]/20">
                      <Cpu className="w-10 h-10 text-[#ccff00]" />
                    </div>
                    <h3 className="font-oswald italic font-black text-xl text-white uppercase mb-2">NEURAL CORE STANDBY</h3>
                    <p className="font-inter text-xs text-zinc-500 leading-relaxed max-w-xs italic">"Ask me for layout suggestions, kit color theory, or stadium environment aesthetics."</p>
                  </div>
                )}
                {coachLog.map((log, i) => (
                  <div key={i} className={`flex ${log.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-[2rem] p-6 shadow-xl ${log.type === 'user' ? 'bg-zinc-900 border border-white/5' : 'bg-white/5 border border-[#ccff00]/20'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        {log.type === 'coach' ? <Cpu className="w-3 h-3 text-[#ccff00]" /> : <Star className="w-3 h-3 text-zinc-500" />}
                        <span className={`font-oswald italic font-black text-[9px] tracking-widest uppercase ${log.type === 'coach' ? 'text-[#ccff00]' : 'text-zinc-500'}`}>
                          {log.type === 'coach' ? 'DESIGN_COACH_v5' : 'CREATIVE_DIRECTOR'}
                        </span>
                      </div>
                      <p className="font-inter text-sm md:text-[15px] leading-relaxed text-zinc-300 italic">{log.text}</p>
                      {log.suggestions && (
                        <div className="mt-8 flex flex-wrap gap-2">
                          {log.suggestions.map((s, si) => (
                            <button key={si} onClick={() => handleLiveCoach(s)}
                              className="bg-black/60 border border-[#ccff00]/30 px-4 py-2 rounded-xl text-[10px] font-oswald italic text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all font-black uppercase tracking-tighter">
                              + {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 md:p-8 bg-black/40 border-t border-white/10 flex gap-4 backdrop-blur-xl">
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Query the coach..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 md:px-8 font-oswald italic tracking-tighter outline-none focus:border-[#ccff00] text-white text-lg transition-all"
                  onKeyDown={e => e.key === 'Enter' && handleLiveCoach()} />
                <button onClick={() => handleLiveCoach()} disabled={isProcessing || !query}
                  className="w-16 h-16 bg-[#ccff00] text-black rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all shrink-0 hover:bg-white disabled:opacity-20 disabled:grayscale">
                  {isProcessing ? <div className="w-6 h-6 border-[3px] border-black border-t-transparent rounded-full animate-spin" /> : <Send className="w-6 h-6" />}
                </button>
              </div>
            </div>
          )}

          {/* ── Brand Score mode ── */}
          {brandScoreMode && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden">
                {/* Upload trigger */}
                <button
                  onClick={() => brandImageRef.current?.click()}
                  disabled={isScoringBrand}
                  className="w-full p-8 flex flex-col items-center gap-4 border-b border-white/5 hover:bg-white/2 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#ccff00]/40 group-hover:bg-[#ccff00]/5 transition-all">
                    {isScoringBrand
                      ? <RotateCcw className="w-7 h-7 text-[#ccff00] animate-spin" />
                      : <ImageIcon className="w-7 h-7 text-zinc-500 group-hover:text-[#ccff00] transition-colors" />
                    }
                  </div>
                  <div className="text-center">
                    <p className="font-oswald italic font-black text-lg uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors">
                      {isScoringBrand ? 'ANALYZING SWAP...' : 'UPLOAD SWAP IMAGE'}
                    </p>
                    <p className="font-oswald italic text-[9px] text-zinc-500 uppercase tracking-[0.4em] mt-1">
                      AI BRAND DIRECTOR WILL SCORE YOUR WORK
                    </p>
                  </div>
                </button>
                <input ref={brandImageRef} type="file" accept="image/*" className="hidden" onChange={handleBrandScoreUpload} />

                {/* Score results */}
                <AnimatePresence>
                  {brandScore && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-8">
                      {/* Overall ring */}
                      <div className="flex items-center gap-8">
                        <div className="relative w-24 h-24 shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <motion.circle
                              cx="40" cy="40" r="34" fill="none"
                              stroke={scoreColor(brandScore.overall)} strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 34}`}
                              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - brandScore.overall / 100) }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-oswald italic font-black text-2xl leading-none" style={{ color: scoreColor(brandScore.overall) }}>
                              {brandScore.overall}
                            </span>
                            <span className="font-oswald italic font-black text-[8px] text-zinc-500 uppercase">OVR</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-oswald italic font-black text-[9px] text-[#ccff00] uppercase tracking-widest mb-2">BRAND VERDICT</p>
                          <p className="font-inter italic text-sm text-zinc-300 leading-relaxed">{brandScore.verdict}</p>
                        </div>
                      </div>

                      {/* Dimension bars */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ScoreBar label="Lighting"       value={brandScore.lighting}      color={scoreColor(brandScore.lighting)} />
                        <ScoreBar label="Logo Placement" value={brandScore.logoPlacement}  color={scoreColor(brandScore.logoPlacement)} />
                        <ScoreBar label="Color Accuracy" value={brandScore.colorAccuracy}  color={scoreColor(brandScore.colorAccuracy)} />
                        <ScoreBar label="Fabric Realism" value={brandScore.fabricRealism}  color={scoreColor(brandScore.fabricRealism)} />
                      </div>

                      {/* Tips */}
                      {brandScore.tips.length > 0 && (
                        <div className="space-y-3">
                          <p className="font-oswald italic font-black text-[9px] text-zinc-500 uppercase tracking-widest">IMPROVEMENT TIPS</p>
                          {brandScore.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/3 border border-white/5">
                              <div className="w-5 h-5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="font-oswald italic font-black text-[8px] text-[#ccff00]">{i + 1}</span>
                              </div>
                              <p className="font-inter italic text-[12px] text-zinc-400 leading-relaxed">{tip}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Re-score */}
                      <button onClick={() => brandImageRef.current?.click()}
                        className="w-full py-4 border border-white/10 text-zinc-500 font-oswald italic font-black text-sm uppercase tracking-widest rounded-2xl hover:border-[#ccff00]/30 hover:text-[#ccff00] transition-all">
                        SCORE ANOTHER SWAP
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ STUDIO TAB ══════════════════════════════════════════════════════ */}
      {activeTab === 'studio' && (
        <div className="w-full space-y-8 min-h-[60vh]">
          {/* Patch library view */}
          {studioMode === 'patch' && studioImage ? (
            <div className="h-[75vh] animate-in zoom-in-95 duration-500">
              <PatchLibrary
                baseImage={studioImage}
                onExport={(composited) => { setStudioImage(composited); setStudioMode('default'); }}
                onClose={() => setStudioMode('default')}
              />
            </div>
          ) : studioImage ? (
            <div className="animate-in zoom-in-95 duration-700 space-y-4">
              <AdvancedEditor
                initialImage={studioImage}
                onSave={(img) => setStudioImage(img)}
                onBack={() => setStudioImage(null)}
              />
              {/* Patch library entry */}
              <div className="flex justify-center">
                <button
                  onClick={() => setStudioMode('patch')}
                  className="flex items-center gap-2 px-6 h-10 rounded-full font-oswald italic font-black text-[10px] uppercase tracking-widest border border-[#ccff00]/30 text-[#ccff00] bg-[#ccff00]/5 hover:bg-[#ccff00]/10 transition-all"
                >
                  <Layers className="w-3.5 h-3.5" />
                  OPEN PATCH LIBRARY
                </button>
              </div>
            </div>
          ) : studioMode === 'collab' && user ? (
            <CollabStudio
              user={user}
              sessions={collabSessions}
              onCreateSession={onCreateCollabSession || (() => {})}
              onJoinSession={onJoinCollabSession || (() => {})}
              onUpdateSession={onUpdateCollabSession || (() => {})}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-10 animate-in slide-in-from-bottom-10">
              <div className="text-center space-y-4">
                <h2 className="font-oswald italic font-black text-6xl md:text-9xl uppercase tracking-ultra leading-none text-white">DESIGN_STUDIO</h2>
                <p className="text-[#ccff00] font-oswald italic text-xs tracking-[0.5em] uppercase font-black opacity-80">LOAD_GEN_CORE_ASSET</p>
              </div>
              <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch px-4">
                {/* Upload */}
                <div onClick={() => fileInputRef.current?.click()}
                  className="flex-1 aspect-video md:aspect-square glass rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 hover:border-[#ccff00]/40 transition-all group cursor-pointer shadow-2xl relative overflow-hidden">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ccff00]/10 transition-all duration-700">
                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-[#ccff00] transition-all" />
                  </div>
                  <div className="text-center px-6">
                    <span className="font-oswald italic font-black text-2xl uppercase tracking-ultra text-white group-hover:text-[#ccff00] transition-colors">UPLOAD_PLATE</span>
                    <p className="font-oswald italic text-[9px] text-zinc-600 uppercase tracking-widest mt-2 font-black">SUPPORTS_8K_PLATES</p>
                  </div>
                </div>
                {/* Logo Engine */}
                <div onClick={() => setShowLogoMaker(true)}
                  className="flex-1 aspect-video md:aspect-square glass rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 hover:border-[#ccff00]/40 transition-all group cursor-pointer shadow-2xl relative overflow-hidden">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ccff00]/10 transition-all duration-700">
                    <PenTool className="w-8 h-8 text-zinc-500 group-hover:text-[#ccff00] transition-all" />
                  </div>
                  <div className="text-center px-6">
                    <span className="font-oswald italic font-black text-2xl uppercase tracking-ultra text-white group-hover:text-[#ccff00] transition-colors">LOGO_ENGINE</span>
                    <p className="font-oswald italic text-[9px] text-zinc-600 uppercase tracking-widest mt-2 font-black">IMAGEN_3_PRO_SERIES</p>
                  </div>
                </div>
                {/* Collab Studio */}
                <div onClick={() => setStudioMode('collab')}
                  className="flex-1 aspect-video md:aspect-square glass rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 hover:border-[#ccff00]/40 transition-all group cursor-pointer shadow-2xl relative overflow-hidden">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ccff00]/10 transition-all duration-700">
                    <Users className="w-8 h-8 text-zinc-500 group-hover:text-[#ccff00] transition-all" />
                  </div>
                  <div className="text-center px-6">
                    <span className="font-oswald italic font-black text-2xl uppercase tracking-ultra text-white group-hover:text-[#ccff00] transition-colors">COLLAB_STUDIO</span>
                    <p className="font-oswald italic text-[9px] text-zinc-600 uppercase tracking-widest mt-2 font-black">TWO_MINDS_ONE_KIT</p>
                  </div>
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleStudioUpload} />

              {/* Logo Maker Modal */}
              {showLogoMaker && (
                <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
                  <div className="w-full max-w-4xl glass border border-white/10 rounded-[4rem] p-8 md:p-16 relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 blur-[100px] pointer-events-none" />
                    <div className="flex-1 space-y-10">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-oswald italic font-black text-5xl uppercase tracking-ultra text-white">LOGO_ENGINE</h3>
                          <button onClick={() => setShowLogoMaker(false)} className="text-zinc-600 hover:text-white transition-colors"><X className="w-8 h-8" /></button>
                        </div>
                        <p className="font-oswald italic text-[11px] text-zinc-500 tracking-[0.4em] uppercase font-black">NEURAL_IDENTITY_SYNTHESIS</p>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="font-oswald italic text-[10px] text-[#ccff00] tracking-widest uppercase font-black px-1 flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" /> BRAND_IDENTIFIER
                          </label>
                          <input
                            value={logoPrompt} onChange={e => setLogoPrompt(e.target.value)}
                            placeholder="E.G. NEON_VAPOR"
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 px-8 font-oswald italic font-black text-3xl text-white outline-none focus:border-[#ccff00] transition-all uppercase tracking-tighter"
                            autoFocus onKeyDown={e => e.key === 'Enter' && handleGenerateLogo()}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="font-oswald italic text-[10px] text-zinc-500 tracking-widest uppercase font-black px-1">SELECT_ARCHETYPE</label>
                          <div className="grid grid-cols-1 gap-3">
                            {LOGO_STYLES.map(style => (
                              <button key={style.id} onClick={() => setSelectedStyle(style)}
                                className={`p-5 rounded-2xl border text-left flex items-center justify-between group transition-all ${selectedStyle.id === style.id ? 'bg-[#ccff00] border-[#ccff00] text-black shadow-xl shadow-[#ccff00]/10' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-[#ccff00]/40'}`}>
                                <div className="leading-tight">
                                  <p className="font-oswald italic font-black text-lg uppercase tracking-tighter">{style.label}</p>
                                  <p className={`font-oswald italic text-[9px] uppercase font-bold ${selectedStyle.id === style.id ? 'text-black/60' : 'text-zinc-600'}`}>{style.desc}</p>
                                </div>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${selectedStyle.id === style.id ? 'border-black/20 bg-black/5' : 'border-white/10 bg-white/5'}`}>
                                  {selectedStyle.id === style.id ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4 opacity-20" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <button onClick={handleGenerateLogo} disabled={!logoPrompt || isGeneratingLogo}
                          className="w-full py-6 bg-white text-black font-oswald italic font-black text-2xl rounded-[2rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase hover:bg-[#ccff00]">
                          {isGeneratingLogo ? <><RotateCcw className="w-8 h-8 animate-spin" /> FORGING_MARK...</> : <><PenTool className="w-8 h-8" /> COMMENCE_GEN</>}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="flex-1 aspect-square glass rounded-[3rem] border-2 border-white/5 overflow-hidden relative shadow-inner bg-zinc-950 flex flex-col items-center justify-center p-12">
                        {previewLogo ? (
                          <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} src={previewLogo} className="w-full h-full object-contain rounded-3xl" />
                        ) : isGeneratingLogo ? (
                          <div className="text-center space-y-4">
                            <div className="w-20 h-20 border-4 border-white/5 border-t-[#ccff00] rounded-full animate-spin mx-auto" />
                            <span className="font-oswald italic font-black text-[10px] text-zinc-500 uppercase tracking-mega">NEURAL_ARRAY_ACTIVE</span>
                          </div>
                        ) : (
                          <div className="text-center opacity-20 space-y-4">
                            <PenTool className="w-20 h-20 text-zinc-500 mx-auto" />
                            <p className="font-oswald italic font-black text-xs uppercase tracking-widest text-zinc-500">AWAITING_INPUT_PLATE</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[#ccff00]/2 mix-blend-overlay pointer-events-none" />
                      </div>
                      <div className="flex gap-4">
                        <button disabled={!previewLogo} onClick={() => setPreviewLogo(null)}
                          className="flex-1 py-5 glass border border-white/10 text-zinc-500 font-oswald italic font-black rounded-2xl uppercase hover:text-white transition-all disabled:opacity-20">
                          DISCARD
                        </button>
                        <button disabled={!previewLogo} onClick={commitLogoToStudio}
                          className="flex-[2] py-5 bg-[#ccff00] text-black font-oswald italic font-black text-lg rounded-2xl uppercase shadow-xl hover:scale-105 transition-all disabled:opacity-20">
                          COMMIT_TO_STUDIO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AILab;
