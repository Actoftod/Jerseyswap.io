import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Clock, Zap, ChevronLeft, TrendingUp, Star } from 'lucide-react';
import { SwapBattle, SocialSwap, computeRarity, RARITY_CONFIG } from '../types';

// ─── helpers ─────────────────────────────────────────────────────────────────
function formatTimeLeft(expiresAt: string): string {
  const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0) return `${h}H ${m}M`;
  if (m > 0) return `${m}M ${s}S`;
  return `${s}S`;
}

function pct(votes: number, total: number): number {
  if (total === 0) return 50;
  return Math.round((votes / total) * 100);
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface BattleCardProps {
  swap: SocialSwap;
  side: 'A' | 'B';
  votes: number;
  totalVotes: number;
  userVote: 'A' | 'B' | null;
  isWinning: boolean;
  onVote: (side: 'A' | 'B') => void;
  revealed: boolean;
}

const BattleCard: React.FC<BattleCardProps> = ({
  swap, side, votes, totalVotes, userVote, isWinning, onVote, revealed
}) => {
  const hasVoted = !!userVote;
  const votedThis = userVote === side;
  const percentage = pct(votes, totalVotes);
  const rarity = swap.rarity ?? computeRarity(swap.rating, swap.ratingCount);
  const rareCfg = RARITY_CONFIG[rarity];

  return (
    <motion.div
      whileHover={!hasVoted ? { scale: 1.015 } : {}}
      className={`relative flex flex-col rounded-[2rem] overflow-hidden border-2 transition-all duration-300 ${
        votedThis
          ? 'border-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.3)]'
          : revealed && isWinning
          ? 'border-[#ccff00]/60'
          : 'border-white/10'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-zinc-950">
        <img
          src={swap.image}
          className="w-full h-full object-cover"
          alt={`${swap.userName} swap`}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Rarity badge */}
        {rarity !== 'COMMON' && (
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded-full border backdrop-blur-md"
            style={{ backgroundColor: `${rareCfg.color}20`, borderColor: `${rareCfg.color}60`, boxShadow: `0 0 8px ${rareCfg.glow}` }}
          >
            <span className="font-oswald italic font-black text-[8px] uppercase" style={{ color: rareCfg.color }}>
              {rareCfg.label}
            </span>
          </div>
        )}

        {/* Side label */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center font-oswald italic font-black text-sm bg-black/60 backdrop-blur-md border border-white/20 text-white">
          {side}
        </div>

        {/* User info */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-oswald italic font-black text-sm text-white uppercase leading-none">{swap.userName}</p>
          <p className="font-oswald italic text-[9px] text-[#ccff00] tracking-widest uppercase mt-0.5">{swap.team}</p>
        </div>
      </div>

      {/* Vote area */}
      <div className="bg-zinc-950 p-4 space-y-3">
        {/* Vote bar */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-oswald italic font-black text-[10px] uppercase text-zinc-500 tracking-widest">
                  {votes.toLocaleString()} VOTES
                </span>
                <span
                  className="font-oswald italic font-black text-sm"
                  style={{ color: isWinning ? '#ccff00' : '#71717a' }}
                >
                  {percentage}%
                </span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: isWinning ? '#ccff00' : '#27272a' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vote button */}
        <button
          onClick={() => !hasVoted && onVote(side)}
          disabled={hasVoted}
          className={`w-full py-4 rounded-2xl font-oswald italic font-black text-sm uppercase tracking-widest transition-all ${
            votedThis
              ? 'bg-[#ccff00] text-black'
              : hasVoted
              ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-white/5'
              : 'bg-white/5 border border-white/10 text-white hover:bg-[#ccff00]/10 hover:border-[#ccff00]/40 hover:text-[#ccff00]'
          }`}
        >
          {votedThis ? (
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-current" /> VOTED
            </span>
          ) : (
            `VOTE_${side}`
          )}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
interface SwapBattleProps {
  battles: SwapBattle[];
  onVote: (battleId: string, side: 'A' | 'B') => void;
  onBack: () => void;
}

const SwapBattleView: React.FC<SwapBattleProps> = ({ battles, onVote, onBack }) => {
  const [activeBattleIndex, setActiveBattleIndex] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState<Record<string, string>>({});

  // live countdown
  useEffect(() => {
    const tick = () => {
      const next: Record<string, string> = {};
      battles.forEach(b => { next[b.id] = formatTimeLeft(b.expiresAt); });
      setTimeDisplay(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [battles]);

  const activeBattles = battles.filter(b => b.isActive);
  const pastBattles   = battles.filter(b => !b.isActive);
  const battle = activeBattles[activeBattleIndex];

  const totalVotes = battle ? battle.votesA + battle.votesB : 0;
  const winnerSide: 'A' | 'B' | null = !battle ? null :
    battle.votesA > battle.votesB ? 'A' :
    battle.votesB > battle.votesA ? 'B' : null;

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-oswald italic font-black text-[10px] uppercase tracking-widest">BACK</span>
        </button>
        <div className="flex items-center gap-3">
          <Swords className="w-5 h-5 text-orange-400" />
          <h2 className="font-oswald italic font-black text-2xl uppercase tracking-ultra text-white">SWAP BATTLE</h2>
        </div>
        <div className="w-16" />
      </div>

      {activeBattles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Swords className="w-12 h-12 text-zinc-700" />
          <p className="font-oswald italic font-black text-xl uppercase text-zinc-600">NO ACTIVE BATTLES</p>
          <p className="font-oswald italic text-[10px] text-zinc-700 uppercase tracking-widest">
            NOMINATE SWAPS FROM THE FEED TO START A BATTLE
          </p>
        </div>
      ) : (
        <>
          {/* Battle navigation */}
          {activeBattles.length > 1 && (
            <div className="flex gap-2 justify-center">
              {activeBattles.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBattleIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeBattleIndex ? 'bg-[#ccff00] w-6' : 'bg-zinc-700'}`}
                />
              ))}
            </div>
          )}

          {/* Timer + VS header */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/10">
              <Clock className="w-3 h-3 text-orange-400" />
              <span className="font-oswald italic font-black text-xs text-orange-400 uppercase">
                {timeDisplay[battle.id] || '...'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/10">
              <TrendingUp className="w-3 h-3 text-zinc-500" />
              <span className="font-oswald italic font-black text-xs text-zinc-500 uppercase">
                {totalVotes.toLocaleString()} TOTAL VOTES
              </span>
            </div>
          </div>

          {/* Battle cards */}
          <div className="grid grid-cols-2 gap-3">
            <BattleCard
              swap={battle.swapA}
              side="A"
              votes={battle.votesA}
              totalVotes={totalVotes}
              userVote={battle.userVote}
              isWinning={winnerSide === 'A'}
              onVote={(side) => onVote(battle.id, side)}
              revealed={!!battle.userVote}
            />

            {/* VS divider */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none hidden">
              <div className="w-10 h-10 rounded-full bg-black border-2 border-orange-400 flex items-center justify-center">
                <span className="font-oswald italic font-black text-xs text-orange-400">VS</span>
              </div>
            </div>

            <BattleCard
              swap={battle.swapB}
              side="B"
              votes={battle.votesB}
              totalVotes={totalVotes}
              userVote={battle.userVote}
              isWinning={winnerSide === 'B'}
              onVote={(side) => onVote(battle.id, side)}
              revealed={!!battle.userVote}
            />
          </div>

          {/* VS label between columns */}
          <div className="flex items-center justify-center -mt-2">
            <div className="px-6 py-2 glass rounded-full border border-orange-400/30">
              <span className="font-oswald italic font-black text-lg text-orange-400 tracking-widest">VS</span>
            </div>
          </div>

          {/* Winner reveal */}
          <AnimatePresence>
            {battle.userVote && winnerSide && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-6 py-4 glass rounded-2xl border border-[#ccff00]/30"
              >
                <Trophy className="w-5 h-5 text-[#ccff00]" />
                <div>
                  <p className="font-oswald italic font-black text-sm text-[#ccff00] uppercase">
                    SIDE {winnerSide} IS WINNING
                  </p>
                  <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-widest">
                    {pct(winnerSide === 'A' ? battle.votesA : battle.votesB, totalVotes)}% COMMUNITY SUPPORT
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Past Battles */}
      {pastBattles.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <p className="font-oswald italic font-black text-[10px] uppercase text-zinc-600 tracking-widest">
            PAST BATTLES
          </p>
          <div className="space-y-3">
            {pastBattles.map(b => {
              const total = b.votesA + b.votesB;
              const winner = b.votesA > b.votesB ? 'A' : 'B';
              const winSwap = winner === 'A' ? b.swapA : b.swapB;
              const winVotes = winner === 'A' ? b.votesA : b.votesB;
              return (
                <div key={b.id} className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={winSwap.image} className="w-full h-full object-cover" alt="winner" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-oswald italic font-black text-xs uppercase text-white truncate">
                      {winSwap.userName} WINS
                    </p>
                    <p className="font-oswald italic text-[9px] text-zinc-600 uppercase tracking-widest">
                      {pct(winVotes, total)}% — {total.toLocaleString()} VOTES
                    </p>
                  </div>
                  <Trophy className="w-5 h-5 text-[#ccff00] shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapBattleView;
