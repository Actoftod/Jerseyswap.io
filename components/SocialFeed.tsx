
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Star, Bookmark, Share2, MoreHorizontal, Send, CornerDownRight, TrendingUp, Clock, Award, BookmarkCheck, ThumbsUp, X, Swords, ShieldCheck, Zap, Trophy, ChevronRight } from 'lucide-react';
import { SocialSwap, Comment, UserProfile, computeRarity, RARITY_CONFIG, SwapChallenge } from '../types';

interface SocialFeedProps {
  user: UserProfile;
  swaps: SocialSwap[];
  activeChallenge?: SwapChallenge | null;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onComment: (id: string, text: string, parentId?: string) => void;
  onRate: (id: string, rating: number) => void;
  onFollow: (userId: string) => void;
  onViewProfile: (userId: string) => void;
  onNominateBattle?: (swap: SocialSwap) => void;
  onOpenChallenge?: () => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ user, swaps, activeChallenge, onLike, onSave, onComment, onRate, onFollow, onViewProfile, onNominateBattle, onOpenChallenge }) => {
  const [filter, setFilter] = useState<'trending' | 'newest' | 'liked' | 'rated'>('trending');
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<{ swapId: string; commentId: string; userName: string } | null>(null);

  const sortedSwaps = [...swaps].sort((a, b) => {
    if (filter === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (filter === 'liked') return b.likes - a.likes;
    if (filter === 'rated') return b.rating - a.rating;
    return (b.likes * b.rating) - (a.likes * a.rating);
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = async (swap: SocialSwap) => {
    const shareData = {
      title: `${swap.userName} — ${swap.team} Jersey Swap`,
      text: `Check out this ${swap.sport} jersey swap on JerseySwap.io`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopiedId(swap.id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      // User cancelled — no-op
    }
  };

  const handleCommentSubmit = (swapId: string, text: string) => {
    onComment(swapId, text, replyTo?.commentId);
    setReplyTo(null);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://storage.googleapis.com/jerseyswap/uploads/placeholder_swap.png";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between px-4 sticky top-14 z-[90] py-4 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex gap-2">
          {[
            { id: 'trending', label: 'TRENDING', icon: TrendingUp },
            { id: 'newest', label: 'LATEST', icon: Clock },
            { id: 'rated', label: 'ELITE', icon: Award }
          ].map(f => (
            <button 
              key={f.id} 
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-full font-oswald italic text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${filter === f.id ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-zinc-500 border border-white/5'}`}
            >
              <f.icon className="w-3 h-3" /> {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Challenge Banner */}
      {activeChallenge && activeChallenge.isActive && (
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onOpenChallenge}
          className="w-full text-left rounded-[2rem] overflow-hidden border border-white/10 relative group"
          style={{ background: `linear-gradient(135deg, ${activeChallenge.accentColor}20 0%, #000 70%)` }}
        >
          <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />
          <div className="relative p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                style={{ backgroundColor: `${activeChallenge.accentColor}20`, borderColor: `${activeChallenge.accentColor}40` }}
              >
                <Trophy className="w-6 h-6" style={{ color: activeChallenge.accentColor }} />
              </div>
              <div>
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border mb-1"
                  style={{ borderColor: `${activeChallenge.accentColor}40`, backgroundColor: `${activeChallenge.accentColor}15` }}
                >
                  <Zap className="w-2.5 h-2.5" style={{ color: activeChallenge.accentColor }} />
                  <span className="font-oswald italic font-black text-[8px] uppercase tracking-widest" style={{ color: activeChallenge.accentColor }}>WEEKLY CHALLENGE LIVE</span>
                </div>
                <p className="font-oswald italic font-black text-white text-base uppercase leading-none">{activeChallenge.title}</p>
                <p className="font-oswald italic text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{activeChallenge.submissionIds.length} entries · {activeChallenge.prize}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
          </div>
        </motion.button>
      )}

      <div className="space-y-12">
        {sortedSwaps.map(swap => (
          <motion.div 
            key={swap.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl relative"
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onViewProfile(swap.userId)}
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0 hover:border-[#ccff00] transition-colors"
                >
                  <img src={swap.userAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200'} className="w-full h-full object-cover" alt={swap.userName} />
                </button>
                <div className="text-left cursor-pointer" onClick={() => onViewProfile(swap.userId)}>
                  <h4 className="font-oswald italic font-black text-white text-sm uppercase leading-none hover:text-[#ccff00] transition-colors">{swap.userName}</h4>
                  <p className="font-oswald italic text-[10px] text-[#ccff00] tracking-widest uppercase mt-0.5">{swap.userHandle}</p>
                </div>
                <button 
                  onClick={() => onFollow(swap.userId)}
                  className={`ml-2 px-3 py-1 rounded-full border font-oswald italic text-[8px] font-black uppercase transition-all ${user.followingIds?.includes(swap.userId) ? 'bg-zinc-800 text-zinc-400 border-white/5' : 'border-[#ccff00]/30 text-[#ccff00] hover:bg-[#ccff00] hover:text-black'}`}
                >
                  {user.followingIds?.includes(swap.userId) ? 'FOLLOWING' : 'FOLLOW'}
                </button>
              </div>
              <button className="text-zinc-500 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
            </div>

            <div className="relative aspect-[4/5] bg-zinc-950 flex items-center justify-center group">
              <img src={swap.image} className="w-full h-full object-cover" alt="Swap Visual" onError={handleImageError} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                  <span className="font-oswald italic text-[9px] font-black text-white tracking-widest uppercase">{swap.sport} // {swap.team}</span>
                </div>
                {(() => {
                  const tier = swap.rarity ?? computeRarity(swap.rating, swap.ratingCount);
                  const cfg = RARITY_CONFIG[tier];
                  if (tier === 'COMMON') return null;
                  return (
                    <div
                      className={`px-3 py-1 rounded-full border backdrop-blur-md ${cfg.border}`}
                      style={{ backgroundColor: `${cfg.color}18`, boxShadow: `0 0 10px ${cfg.glow}` }}
                    >
                      <span className="font-oswald italic font-black text-[9px] uppercase tracking-widest" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })()}
                {swap.athleteVerification && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-400/50 backdrop-blur-md bg-sky-400/15">
                    <ShieldCheck className="w-2.5 h-2.5 text-sky-400" />
                    <span className="font-oswald italic font-black text-[9px] text-sky-300 uppercase tracking-widest">
                      ATHLETE VERIFIED
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-5">
                  <button 
                    onClick={() => onLike(swap.id)}
                    className={`flex items-center gap-2 transition-all ${swap.hasLiked ? 'text-red-500' : 'text-white'}`}
                  >
                    <Heart className={`w-6 h-6 ${swap.hasLiked ? 'fill-current' : ''}`} />
                    <span className="font-oswald italic font-black text-xs">{swap.likes}</span>
                  </button>
                  <button 
                    onClick={() => setActiveComments(activeComments === swap.id ? null : swap.id)}
                    className="flex items-center gap-2 text-white hover:text-[#ccff00] transition-all"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span className="font-oswald italic font-black text-xs">{swap.comments.length}</span>
                  </button>
                  <button
                    onClick={() => handleShare(swap)}
                    className={`transition-all ${copiedId === swap.id ? 'text-[#ccff00]' : 'text-white hover:text-[#ccff00]'}`}
                    title={copiedId === swap.id ? 'Link copied!' : 'Share'}
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                  {onNominateBattle && (
                    <button
                      onClick={() => onNominateBattle(swap)}
                      className="flex items-center gap-1.5 text-white hover:text-orange-400 transition-all"
                      title="Nominate for Swap Battle"
                    >
                      <Swords className="w-5 h-5" />
                      <span className="font-oswald italic font-black text-[9px] uppercase tracking-widest hidden sm:block">BATTLE</span>
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={() => onSave(swap.id)}
                  className={`transition-all ${swap.isSaved ? 'text-[#ccff00]' : 'text-white'}`}
                >
                  {swap.isSaved ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                </button>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                <span className="font-oswald italic font-black text-[9px] text-zinc-500 uppercase tracking-mega">SWAP_QUALITY</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => onRate(swap.id, star)}
                      className={`transition-colors ${star <= swap.rating ? 'text-[#ccff00]' : 'text-zinc-800'}`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
                <span className="font-oswald italic text-[9px] text-[#ccff00] font-bold">({swap.ratingCount})</span>
              </div>

              {/* Athlete verification quote strip */}
              {swap.athleteVerification && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-3 pt-3 border-t border-sky-500/10 bg-sky-500/5 -mx-6 px-6 py-3 mt-2"
                >
                  <img
                    src={swap.athleteVerification.athleteAvatar || ''}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-sky-400/30"
                    alt={swap.athleteVerification.athleteName}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="font-oswald italic font-black text-[9px] text-sky-400 uppercase tracking-widest truncate">
                        {swap.athleteVerification.athleteHandle}
                      </span>
                      <span className="font-oswald italic text-[9px] text-zinc-600 uppercase">{swap.athleteVerification.reaction}</span>
                    </div>
                    {swap.athleteVerification.quote && (
                      <p className="text-zinc-400 text-[11px] italic leading-relaxed">"{swap.athleteVerification.quote}"</p>
                    )}
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {activeComments === swap.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-6 pt-4"
                  >
                    <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-6 pr-2">
                      {swap.comments.map(comment => (
                        <div key={comment.id} className="space-y-4">
                          <div className="flex gap-3 text-left group">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 shrink-0 overflow-hidden shadow-lg cursor-pointer" onClick={() => onViewProfile(comment.userId)}>
                              <img src={comment.userAvatar || ''} className="w-full h-full object-cover" alt={comment.userName} />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewProfile(comment.userId)}>
                                  <span className="font-oswald italic font-black text-[10px] text-white uppercase tracking-wider hover:text-[#ccff00] transition-colors">{comment.userName}</span>
                                  <span className="text-zinc-600 text-[8px] font-bold">{comment.timestamp}</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => setReplyTo({ swapId: swap.id, commentId: comment.id, userName: comment.userName })}
                                    className="text-[9px] font-oswald italic font-black text-zinc-500 hover:text-[#ccff00] uppercase"
                                  >
                                    REPLY
                                  </button>
                                  <button className="flex items-center gap-1 text-zinc-600 hover:text-[#ccff00]">
                                    <ThumbsUp className="w-3 h-3" />
                                    <span className="text-[9px] font-black">{comment.likeCount || 0}</span>
                                  </button>
                                </div>
                              </div>
                              <p className="text-[12px] text-zinc-400 font-inter italic leading-relaxed">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      {replyTo && replyTo.swapId === swap.id && (
                        <div className="flex items-center justify-between px-4 py-2 bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-xl">
                          <span className="font-oswald italic font-black text-[9px] text-[#ccff00] uppercase">REPLYING_TO @{replyTo.userName}</span>
                          <button onClick={() => setReplyTo(null)} className="text-zinc-500 hover:text-white"><X className="w-3 h-3" /></button>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <input 
                          placeholder={replyTo ? `REPLYING_TO @${replyTo.userName.toUpperCase()}...` : "ADD_NEURAL_COMMENT..."}
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 font-oswald italic text-xs text-white outline-none focus:border-[#ccff00] transition-all"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCommentSubmit(swap.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button 
                          className="w-12 h-12 bg-[#ccff00] text-black rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                          onClick={(e) => {
                            const input = e.currentTarget.previousSibling as HTMLInputElement;
                            if (input.value) {
                              handleCommentSubmit(swap.id, input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
