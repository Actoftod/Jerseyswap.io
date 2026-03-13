import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Send, RotateCcw, Copy, CheckCircle2, Crown, User, Sparkles, ArrowRight, Download, ChevronRight } from 'lucide-react';
import { CollabSession, UserProfile } from '../types';
import { GeminiService } from '../services/geminiService';

interface CollabStudioProps {
  user: UserProfile;
  sessions: CollabSession[];
  onCreateSession: (session: CollabSession) => void;
  onJoinSession: (sessionId: string) => void;
  onUpdateSession: (sessionId: string, updates: Partial<CollabSession>) => void;
}

const COLLAB_TEAMS = [
  'SF 49ERS', 'LA LAKERS', 'REAL MADRID', 'NY YANKEES',
  'MIAMI HEAT', 'CHICAGO BULLS', 'BARCELONA FC', 'GOLDEN STATE WARRIORS',
];

export const CollabStudio: React.FC<CollabStudioProps> = ({
  user, sessions, onCreateSession, onJoinSession, onUpdateSession,
}) => {
  const [view, setView] = useState<'lobby' | 'host' | 'join' | 'active'>('lobby');
  const [activeSession, setActiveSession] = useState<CollabSession | null>(null);
  const [hostPrompt, setHostPrompt] = useState('');
  const [guestRefinement, setGuestRefinement] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(COLLAB_TEAMS[0]);
  const [joinCode, setJoinCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const gemini = useRef(new GeminiService());

  const openSessions = sessions.filter(s => s.status === 'waiting' && s.hostId !== user.id);
  const mySessions = sessions.filter(s => s.hostId === user.id || s.guestId === user.id);

  const handleCreateSession = () => {
    const session: CollabSession = {
      id: `collab_${Date.now()}`,
      hostId: user.id,
      hostName: user.name,
      guestId: null,
      guestName: null,
      hostPrompt: '',
      guestRefinement: '',
      resultImage: null,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      teamName: selectedTeam,
    };
    onCreateSession(session);
    setActiveSession(session);
    setView('active');
  };

  const handleJoin = (session: CollabSession) => {
    const updated: CollabSession = { ...session, guestId: user.id, guestName: user.name, status: 'active' };
    onUpdateSession(session.id, { guestId: user.id, guestName: user.name, status: 'active' });
    setActiveSession(updated);
    setView('active');
  };

  const handleJoinByCode = () => {
    const found = sessions.find(s => s.id === joinCode.trim());
    if (found && found.status === 'waiting' && found.hostId !== user.id) {
      handleJoin(found);
    }
  };

  const handleCopyCode = () => {
    if (!activeSession) return;
    navigator.clipboard.writeText(activeSession.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isHost = activeSession?.hostId === user.id;

  const handleSavePrompt = () => {
    if (!activeSession) return;
    if (isHost) {
      const updated = { ...activeSession, hostPrompt };
      onUpdateSession(activeSession.id, { hostPrompt });
      setActiveSession(updated);
    } else {
      const updated = { ...activeSession, guestRefinement };
      onUpdateSession(activeSession.id, { guestRefinement });
      setActiveSession(updated);
    }
  };

  const handleGenerate = async () => {
    if (!activeSession) return;
    setIsGenerating(true);
    try {
      const combinedPrompt = [
        `Jersey design for ${activeSession.teamName}.`,
        activeSession.hostPrompt && `Style direction: ${activeSession.hostPrompt}.`,
        activeSession.guestRefinement && `Refinements: ${activeSession.guestRefinement}.`,
        'Ultra-realistic sports photography, dramatic lighting, 8K detail.',
      ].filter(Boolean).join(' ');

      const result = await gemini.current.generateImageFromPrompt(combinedPrompt);
      setGeneratedImage(result);
      const finalSession = { ...activeSession, resultImage: result, status: 'complete' as const };
      onUpdateSession(activeSession.id, { resultImage: result, status: 'complete' });
      setActiveSession(finalSession);
    } catch (err) {
      console.error('[CollabStudio] Generate error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-32">
      <AnimatePresence mode="wait">
        {/* ── LOBBY ── */}
        {view === 'lobby' && (
          <motion.div key="lobby" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass rounded-[2rem] border border-white/10 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#ccff00]" />
              </div>
              <h2 className="font-oswald italic font-black text-2xl text-white uppercase mb-2">COLLAB STUDIO</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Host designs the style. Guest refines the details. Two minds, one jersey.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setView('host')}
                  className="flex items-center gap-2 px-6 py-3 bg-[#ccff00] text-black font-oswald italic font-black text-sm uppercase rounded-xl"
                >
                  <Crown className="w-4 h-4" /> HOST SESSION
                </button>
                <button
                  onClick={() => setView('join')}
                  className="flex items-center gap-2 px-6 py-3 glass border border-white/15 text-white font-oswald italic font-black text-sm uppercase rounded-xl"
                >
                  <ArrowRight className="w-4 h-4" /> JOIN SESSION
                </button>
              </div>
            </div>

            {openSessions.length > 0 && (
              <div className="space-y-3">
                <p className="font-oswald italic font-black text-[10px] text-zinc-500 uppercase tracking-widest px-1">OPEN_SESSIONS</p>
                {openSessions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleJoin(s)}
                    className="w-full glass rounded-2xl border border-white/10 p-5 flex items-center justify-between hover:border-[#ccff00]/30 transition-all group"
                  >
                    <div className="text-left">
                      <p className="font-oswald italic font-black text-white text-sm uppercase">{s.hostName}</p>
                      <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{s.teamName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full bg-green-500/15 border border-green-500/30 font-oswald italic font-black text-[8px] text-green-400 uppercase">OPEN</span>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#ccff00] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {mySessions.length > 0 && (
              <div className="space-y-3">
                <p className="font-oswald italic font-black text-[10px] text-zinc-500 uppercase tracking-widest px-1">MY_SESSIONS</p>
                {mySessions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveSession(s); setView('active'); }}
                    className="w-full glass rounded-2xl border border-white/10 p-5 flex items-center justify-between hover:border-white/20 transition-all group"
                  >
                    <div className="text-left">
                      <p className="font-oswald italic font-black text-white text-sm uppercase">{s.teamName}</p>
                      <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                        {s.hostId === user.id ? 'HOST' : 'GUEST'} · {s.status.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-green-400' : s.status === 'complete' ? 'bg-[#ccff00]' : 'bg-zinc-600'}`} />
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── HOST SETUP ── */}
        {view === 'host' && (
          <motion.div key="host" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <button onClick={() => setView('lobby')} className="flex items-center gap-2 text-zinc-500 hover:text-white font-oswald italic font-black text-[10px] uppercase tracking-widest transition-colors">
              <ChevronRight className="w-3 h-3 rotate-180" /> BACK
            </button>
            <div className="glass rounded-[2rem] border border-white/10 p-8 space-y-6">
              <h3 className="font-oswald italic font-black text-xl text-white uppercase">CREATE SESSION</h3>
              <div className="space-y-2">
                <label className="font-oswald italic font-black text-[9px] text-zinc-500 uppercase tracking-widest">SELECT TEAM</label>
                <div className="grid grid-cols-2 gap-2">
                  {COLLAB_TEAMS.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTeam(t)}
                      className={`py-3 px-4 rounded-xl font-oswald italic font-black text-[10px] uppercase tracking-widest border transition-all text-left ${
                        selectedTeam === t ? 'bg-[#ccff00]/15 border-[#ccff00]/50 text-[#ccff00]' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/15 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleCreateSession} className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-2xl uppercase">
                LAUNCH SESSION
              </button>
            </div>
          </motion.div>
        )}

        {/* ── JOIN BY CODE ── */}
        {view === 'join' && (
          <motion.div key="join" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <button onClick={() => setView('lobby')} className="flex items-center gap-2 text-zinc-500 hover:text-white font-oswald italic font-black text-[10px] uppercase tracking-widest transition-colors">
              <ChevronRight className="w-3 h-3 rotate-180" /> BACK
            </button>
            <div className="glass rounded-[2rem] border border-white/10 p-8 space-y-6">
              <h3 className="font-oswald italic font-black text-xl text-white uppercase">JOIN BY CODE</h3>
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                placeholder="PASTE_SESSION_ID..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-oswald italic text-sm text-white outline-none focus:border-[#ccff00] transition-all"
              />
              <button onClick={handleJoinByCode} disabled={!joinCode.trim()} className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-2xl uppercase disabled:opacity-40">
                JOIN SESSION
              </button>
            </div>
          </motion.div>
        )}

        {/* ── ACTIVE SESSION ── */}
        {view === 'active' && activeSession && (
          <motion.div key="active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <button onClick={() => setView('lobby')} className="flex items-center gap-2 text-zinc-500 hover:text-white font-oswald italic font-black text-[10px] uppercase tracking-widest transition-colors">
              <ChevronRight className="w-3 h-3 rotate-180" /> BACK_TO_LOBBY
            </button>

            {/* Session status bar */}
            <div className="glass rounded-2xl border border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#ccff00] flex items-center justify-center shrink-0">
                    <Crown className="w-3.5 h-3.5 text-[#ccff00]" />
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${activeSession.guestId ? 'bg-zinc-800 border-sky-400' : 'bg-zinc-900 border-white/10'}`}>
                    {activeSession.guestId ? <User className="w-3.5 h-3.5 text-sky-400" /> : <span className="text-zinc-700 text-[10px] font-black">?</span>}
                  </div>
                </div>
                <div>
                  <p className="font-oswald italic font-black text-[10px] text-white uppercase">{activeSession.teamName}</p>
                  <p className="font-oswald italic text-[9px] text-zinc-500 uppercase tracking-widest">
                    {activeSession.guestId ? 'COLLAB_ACTIVE' : 'WAITING_FOR_GUEST'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-white/10 font-oswald italic font-black text-[9px] text-zinc-400 uppercase hover:border-white/25 hover:text-white transition-all"
              >
                {copiedCode ? <CheckCircle2 className="w-3 h-3 text-[#ccff00]" /> : <Copy className="w-3 h-3" />}
                {copiedCode ? 'COPIED' : 'SHARE_CODE'}
              </button>
            </div>

            {/* Roles */}
            <div className="grid grid-cols-2 gap-4">
              {/* Host panel */}
              <div className={`glass rounded-2xl border p-5 space-y-3 ${isHost ? 'border-[#ccff00]/30' : 'border-white/5'}`}>
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span className="font-oswald italic font-black text-[9px] text-[#ccff00] uppercase tracking-widest">HOST · STYLE</span>
                </div>
                <p className="font-oswald italic font-black text-xs text-white uppercase">{activeSession.hostName}</p>
                {isHost ? (
                  <>
                    <textarea
                      value={hostPrompt}
                      onChange={e => setHostPrompt(e.target.value)}
                      placeholder="Describe the style direction... e.g. 'Retro 90s, bold gradients, old-school block font'"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-oswald italic text-xs text-white outline-none focus:border-[#ccff00] transition-all resize-none"
                    />
                    <button onClick={handleSavePrompt} className="w-full py-2 bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] font-oswald italic font-black text-[9px] uppercase rounded-lg hover:bg-[#ccff00]/25 transition-all">
                      SAVE DIRECTION
                    </button>
                  </>
                ) : (
                  <p className="text-zinc-400 text-xs italic leading-relaxed">{activeSession.hostPrompt || 'Waiting for host...'}</p>
                )}
              </div>

              {/* Guest panel */}
              <div className={`glass rounded-2xl border p-5 space-y-3 ${!isHost && activeSession.guestId === user.id ? 'border-sky-400/30' : 'border-white/5'}`}>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-oswald italic font-black text-[9px] text-sky-400 uppercase tracking-widest">GUEST · REFINE</span>
                </div>
                <p className="font-oswald italic font-black text-xs text-white uppercase">{activeSession.guestName || 'WAITING...'}</p>
                {!isHost && activeSession.guestId === user.id ? (
                  <>
                    <textarea
                      value={guestRefinement}
                      onChange={e => setGuestRefinement(e.target.value)}
                      placeholder="Refine the jersey details... e.g. 'Tighten the chest logo, add metallic trim, sharper numbers'"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-oswald italic text-xs text-white outline-none focus:border-sky-400 transition-all resize-none"
                    />
                    <button onClick={handleSavePrompt} className="w-full py-2 bg-sky-400/10 border border-sky-400/30 text-sky-400 font-oswald italic font-black text-[9px] uppercase rounded-lg hover:bg-sky-400/20 transition-all">
                      SAVE REFINEMENT
                    </button>
                  </>
                ) : (
                  <p className="text-zinc-400 text-xs italic leading-relaxed">{activeSession.guestRefinement || (activeSession.guestId ? 'Guest is refining...' : 'Waiting for guest to join...')}</p>
                )}
              </div>
            </div>

            {/* Generate — only host can trigger */}
            {isHost && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !activeSession.hostPrompt}
                className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-2xl uppercase flex items-center justify-center gap-3 disabled:opacity-40"
              >
                {isGenerating ? (
                  <><RotateCcw className="w-5 h-5 animate-spin" /> FORGING...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> FORGE COLLAB JERSEY</>
                )}
              </button>
            )}

            {/* Result */}
            <AnimatePresence>
              {(generatedImage || activeSession.resultImage) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <p className="font-oswald italic font-black text-[10px] text-[#ccff00] uppercase tracking-widest">COLLAB_RESULT</p>
                  <div className="relative rounded-3xl overflow-hidden border border-[#ccff00]/30 shadow-[0_0_40px_rgba(204,255,0,0.15)]">
                    <img
                      src={generatedImage || activeSession.resultImage || ''}
                      alt="Collab result"
                      className="w-full object-cover"
                    />
                    <button
                      onClick={() => window.open(generatedImage || activeSession.resultImage || '', '_blank')}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-[#ccff00] text-black rounded-full flex items-center justify-center shadow-xl"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-white/5">
                    <div className="flex -space-x-1">
                      <Crown className="w-4 h-4 text-[#ccff00]" />
                      <User className="w-4 h-4 text-sky-400 ml-1" />
                    </div>
                    <p className="font-oswald italic font-black text-[10px] text-zinc-400 uppercase tracking-widest">
                      {activeSession.hostName} + {activeSession.guestName || 'GUEST'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollabStudio;
