import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, ChevronRight, Star, Zap, Crown, Award, TrendingUp, Users, Upload, X } from 'lucide-react';
import { SwapChallenge, SocialSwap, UserProfile, AthleteVerification, RARITY_CONFIG, computeRarity } from '../types';

interface SwapChallengeViewProps {
  challenge: SwapChallenge;
  swaps: SocialSwap[];
  user: UserProfile;
  onBack: () => void;
  onSubmitSwap: (challengeId: string, swapId: string) => void;
  onLike: (id: string) => void;
  userSwaps: SocialSwap[];
}

function timeRemaining(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'ENDED';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}D ${hours}H REMAINING`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}H ${mins}M REMAINING`;
}

const PLACE_COLORS = ['#ccff00', '#94a3b8', '#b45309'];
const PLACE_LABELS = ['1ST', '2ND', '3RD'];

export const SwapChallengeView: React.FC<SwapChallengeViewProps> = ({
  challenge, swaps, user, onBack, onSubmitSwap, onLike, userSwaps
}) => {
  const [tab, setTab] = useState<'leaderboard' | 'submit'>('leaderboard');
  const [selectedSwapId, setSelectedSwapId] = useState<string | null>(null);

  const entries = useMemo(() => {
    return swaps
      .filter(s => challenge.submissionIds.includes(s.id))
      .sort((a, b) => (b.likes * (b.rating || 1)) - (a.likes * (a.rating || 1)));
  }, [swaps, challenge.submissionIds]);

  const eligible = userSwaps.filter(s => !challenge.submissionIds.includes(s.id));

  const handleSubmit = () => {
    if (!selectedSwapId) return;
    onSubmitSwap(challenge.id, selectedSwapId);
    setSelectedSwapId(null);
    setTab('leaderboard');
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-32">
      {/* Header */}
      <div
        className="relative rounded-[2rem] overflow-hidden mb-8 border border-white/10"
        style={{ background: `linear-gradient(135deg, ${challenge.accentColor}15 0%, #000 60%)` }}
      >
        <div className="absolute inset-0 scanlines pointer-events-none" />
        <div className="relative p-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-white font-oswald italic font-black text-[10px] uppercase tracking-widest mb-6 transition-colors"
          >
            <ChevronRight className="w-3 h-3 rotate-180" /> BACK_TO_FEED
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4"
                style={{ borderColor: `${challenge.accentColor}50`, backgroundColor: `${challenge.accentColor}15` }}
              >
                <Zap className="w-3 h-3" style={{ color: challenge.accentColor }} />
                <span className="font-oswald italic font-black text-[9px] uppercase tracking-widest" style={{ color: challenge.accentColor }}>
                  WEEKLY CHALLENGE
                </span>
              </div>
              <h1 className="font-oswald italic font-black text-3xl md:text-4xl text-white uppercase leading-none text-balance mb-2">
                {challenge.title}
              </h1>
              <p className="font-oswald italic text-sm text-zinc-400 uppercase tracking-wider">{challenge.theme}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-oswald italic font-black text-[10px] text-zinc-500 uppercase tracking-widest">PRIZE</div>
              <div className="font-oswald italic font-black text-xl uppercase" style={{ color: challenge.accentColor }}>{challenge.prize}</div>
            </div>
          </div>

          <p className="mt-4 text-zinc-400 text-sm leading-relaxed">{challenge.description}</p>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span className="font-oswald italic font-black text-[10px] text-zinc-400 uppercase tracking-widest">{timeRemaining(challenge.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-500" />
              <span className="font-oswald italic font-black text-[10px] text-zinc-400 uppercase tracking-widest">{challenge.submissionIds.length} ENTRIES</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-500" />
              <span className="font-oswald italic font-black text-[10px] text-zinc-400 uppercase tracking-widest">{challenge.isActive ? 'OPEN' : 'CLOSED'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
          { id: 'submit', label: 'SUBMIT_ENTRY', icon: Upload },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 px-5 h-9 rounded-full font-oswald italic font-black text-[10px] uppercase tracking-widest border transition-all ${
              tab === t.id
                ? 'bg-[#ccff00] text-black border-[#ccff00]'
                : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'leaderboard' && (
          <motion.div
            key="lb"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {entries.length === 0 && (
              <div className="text-center py-20">
                <Trophy className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="font-oswald italic font-black text-zinc-600 uppercase tracking-widest">NO_ENTRIES_YET</p>
                <p className="text-zinc-700 text-xs mt-2">Be the first to submit.</p>
              </div>
            )}
            {entries.map((swap, i) => {
              const isWinner = challenge.featuredWinnerId === swap.id;
              const placeColor = PLACE_COLORS[i] || '#71717a';
              const tier = computeRarity(swap.rating, swap.ratingCount);
              const rarityConf = RARITY_CONFIG[tier];

              return (
                <motion.div
                  key={swap.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-2xl border overflow-hidden ${i < 3 ? rarityConf.border : 'border-white/5'}`}
                  style={i < 3 ? { boxShadow: `0 0 20px ${placeColor}20` } : {}}
                >
                  <div className="flex items-stretch">
                    {/* Rank */}
                    <div
                      className="w-14 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: i < 3 ? `${placeColor}18` : 'transparent' }}
                    >
                      {i < 3 ? (
                        <div className="flex flex-col items-center gap-1">
                          {i === 0 ? <Crown className="w-4 h-4" style={{ color: placeColor }} /> : <Award className="w-4 h-4" style={{ color: placeColor }} />}
                          <span className="font-oswald italic font-black text-[9px]" style={{ color: placeColor }}>{PLACE_LABELS[i]}</span>
                        </div>
                      ) : (
                        <span className="font-oswald italic font-black text-zinc-700 text-sm">#{i + 1}</span>
                      )}
                    </div>

                    {/* Image */}
                    <div className="w-20 h-20 shrink-0 overflow-hidden">
                      <img src={swap.image} alt={swap.userName} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 flex flex-col justify-center gap-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-oswald italic font-black text-white text-sm uppercase truncate">{swap.userName}</span>
                        {isWinner && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/40 font-oswald italic font-black text-[8px] text-[#ccff00] uppercase tracking-widest">
                            FEATURED
                          </span>
                        )}
                        {swap.athleteVerification && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 font-oswald italic font-black text-[8px] text-sky-400 uppercase tracking-widest">
                            ATHLETE VERIFIED
                          </span>
                        )}
                      </div>
                      <span className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-wider">{swap.team}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-oswald italic font-black text-[10px] text-zinc-400">{swap.likes} LIKES</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-2.5 h-2.5 fill-current ${s <= swap.rating ? 'text-[#ccff00]' : 'text-zinc-800'}`} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Vote / Like */}
                    <div className="flex items-center pr-4">
                      <button
                        onClick={() => onLike(swap.id)}
                        className={`w-10 h-10 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                          swap.hasLiked
                            ? 'border-[#ccff00]/50 bg-[#ccff00]/10 text-[#ccff00]'
                            : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="font-oswald italic font-black text-[8px]">{swap.likes}</span>
                      </button>
                    </div>
                  </div>

                  {/* Athlete verification quote */}
                  {swap.athleteVerification?.quote && (
                    <div className="px-4 py-3 border-t border-sky-500/10 bg-sky-500/5 flex items-start gap-3">
                      <img
                        src={swap.athleteVerification.athleteAvatar || ''}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                        alt={swap.athleteVerification.athleteName}
                      />
                      <div>
                        <span className="font-oswald italic font-black text-[9px] text-sky-400 uppercase tracking-widest">
                          {swap.athleteVerification.athleteHandle}
                        </span>
                        <p className="text-zinc-400 text-[11px] italic mt-0.5">"{swap.athleteVerification.quote}"</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {tab === 'submit' && (
          <motion.div
            key="submit"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-widest">
              SELECT_ONE_OF_YOUR_SWAPS_TO_ENTER
            </p>

            {eligible.length === 0 && (
              <div className="text-center py-16 glass rounded-2xl border border-white/5">
                <Upload className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="font-oswald italic font-black text-zinc-600 uppercase tracking-widest text-sm">NO_ELIGIBLE_SWAPS</p>
                <p className="text-zinc-700 text-xs mt-2">Create a swap first, then submit it here.</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {eligible.map(swap => (
                <button
                  key={swap.id}
                  onClick={() => setSelectedSwapId(selectedSwapId === swap.id ? null : swap.id)}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedSwapId === swap.id
                      ? 'border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="aspect-[3/4]">
                    <img src={swap.image} alt={swap.team} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 p-3">
                    <p className="font-oswald italic font-black text-[10px] text-white uppercase truncate">{swap.team}</p>
                  </div>
                  {selectedSwapId === swap.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#ccff00] rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-black fill-current" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {selectedSwapId && (
              <button
                onClick={handleSubmit}
                className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-2xl uppercase mt-4"
              >
                SUBMIT_TO_CHALLENGE
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwapChallengeView;
