import React from 'react';
import { Heart, Bookmark } from 'lucide-react';
import { SocialSwap, UserProfile } from '../types';

interface SocialFeedProps {
  user: UserProfile;
  swaps: SocialSwap[];
  onLike: (swapId: string) => void;
  onSave: (swapId: string) => void;
  onComment: (swapId: string, text: string, parentId?: string) => void;
  onRate: (swapId: string, rating: number) => void;
  onFollow: (userId: string) => void;
  onViewProfile: (userId: string) => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  user,
  swaps,
  onLike,
  onSave,
  onComment,
  onRate,
  onFollow,
  onViewProfile
}) => {
  return (
    <div className="flex flex-col items-center pb-24 px-4">
      <h2 className="font-oswald italic font-black text-3xl uppercase text-[#ccff00] mb-8">
        COMMUNITY_FEED
      </h2>
      
      <div className="w-full max-w-md space-y-6">
        {swaps.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center">
            <p className="text-zinc-400">No swaps yet. Be the first to create one!</p>
          </div>
        ) : (
          swaps.map((swap) => (
            <div key={swap.id} className="glass rounded-3xl overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                {swap.userAvatar && (
                  <img src={swap.userAvatar} alt={swap.userName} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div className="flex-1">
                  <button
                    aria-label={`View profile of ${swap.userName}`}
                    onClick={() => onViewProfile(swap.userId)}
                    className="font-bold text-white hover:text-[#ccff00] transition-colors"
                  >
                    {swap.userName}
                  </button>
                  <p className="text-sm text-zinc-400">{swap.userHandle}</p>
                </div>
              </div>
              
              <img src={swap.image} alt={swap.team} className="w-full aspect-square object-cover" />
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      aria-label={swap.hasLiked ? "Unlike swap" : "Like swap"}
                      onClick={() => onLike(swap.id)}
                      className={`flex items-center gap-2 ${swap.hasLiked ? 'text-[#ccff00]' : 'text-white'}`}
                    >
                      <Heart className={`w-6 h-6 ${swap.hasLiked ? 'fill-current' : ''}`} />
                      <span>{swap.likes}</span>
                    </button>
                    <button
                      aria-label={swap.isSaved ? "Remove from vault" : "Save to vault"}
                      onClick={() => onSave(swap.id)}
                      className={swap.isSaved ? 'text-[#ccff00]' : 'text-white'}
                    >
                      <Bookmark className={`w-6 h-6 ${swap.isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <span className="text-sm text-zinc-400">★ {swap.rating}</span>
                </div>
                
                <p className="text-sm">
                  <span className="font-bold text-[#ccff00]">{swap.team}</span>
                  <span className="text-zinc-400 ml-2">{swap.sport}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
