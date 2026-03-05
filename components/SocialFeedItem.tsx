import React, { memo } from 'react';
import { SocialSwap } from '../types';

interface SocialFeedItemProps {
  swap: SocialSwap;
  onLike: (swapId: string) => void;
  onSave: (swapId: string) => void;
  onViewProfile: (userId: string) => void;
}

const SocialFeedItem: React.FC<SocialFeedItemProps> = ({
  swap,
  onLike,
  onSave,
  onViewProfile
}) => {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        {swap.userAvatar && (
          <img
            src={swap.userAvatar}
            alt={swap.userName}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        )}
        <div className="flex-1">
          <button
            onClick={() => onViewProfile(swap.userId)}
            className="font-bold text-white hover:text-[#ccff00] transition-colors"
          >
            {swap.userName}
          </button>
          <p className="text-sm text-zinc-400">{swap.userHandle}</p>
        </div>
      </div>

      <img
        src={swap.image}
        alt={swap.team}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(swap.id)}
              className={`flex items-center gap-2 ${swap.hasLiked ? 'text-[#ccff00]' : 'text-white'}`}
            >
              <span>❤</span>
              <span>{swap.likes}</span>
            </button>
            <button
              onClick={() => onSave(swap.id)}
              className={swap.isSaved ? 'text-[#ccff00]' : 'text-white'}
            >
              🔖
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
  );
};

export default memo(SocialFeedItem);
