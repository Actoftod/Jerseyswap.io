import React, { memo } from 'react';
import { SocialSwap, UserProfile } from '../types';
import SocialFeedItem from './SocialFeedItem';

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

const SocialFeedComponent: React.FC<SocialFeedProps> = ({
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
            <SocialFeedItem
              key={swap.id}
              swap={swap}
              onLike={onLike}
              onSave={onSave}
              onViewProfile={onViewProfile}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const SocialFeed = memo(SocialFeedComponent);
