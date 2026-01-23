import React from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  currentUser: UserProfile;
  onBack: () => void;
  onUpdate: (profile: UserProfile) => void;
  onFollow: (profileId: string) => void;
  followingProfiles: UserProfile[];
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  isOwnProfile,
  currentUser,
  onBack,
  onUpdate,
  onFollow,
  followingProfiles
}) => {
  const isFollowing = currentUser.followingIds?.includes(profile.id);

  return (
    <div className="flex flex-col items-center pb-24 px-4">
      <button onClick={onBack} className="self-start mb-6 text-[#ccff00] font-bold">← BACK</button>
      
      <div className="w-full max-w-md glass rounded-3xl p-8 space-y-6">
        {profile.avatar && (
          <img src={profile.avatar} alt={profile.name} className="w-32 h-32 rounded-full mx-auto object-cover" />
        )}
        
        <div className="text-center">
          <h2 className="font-oswald italic font-black text-3xl uppercase text-white mb-2">
            {profile.name}
          </h2>
          <p className="text-[#ccff00] text-lg">{profile.handle}</p>
          <p className="text-zinc-400 mt-2">{profile.role}</p>
          {profile.bio && <p className="text-white mt-4">{profile.bio}</p>}
        </div>

        {profile.stats && (
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#ccff00]">{profile.stats.precision}</div>
              <div className="text-xs text-zinc-400 uppercase">Precision</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#ccff00]">{profile.stats.sync}</div>
              <div className="text-xs text-zinc-400 uppercase">Sync</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#ccff00]">{profile.stats.speed}</div>
              <div className="text-xs text-zinc-400 uppercase">Speed</div>
            </div>
          </div>
        )}

        {!isOwnProfile && (
          <button
            onClick={() => onFollow(profile.id)}
            className={`w-full py-4 font-oswald italic font-black text-xl rounded-xl uppercase ${
              isFollowing 
                ? 'glass text-white' 
                : 'bg-[#ccff00] text-black'
            }`}
          >
            {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
          </button>
        )}

        {profile.vault && profile.vault.length > 0 && (
          <div className="pt-6 border-t border-white/10">
            <h3 className="font-oswald italic font-black text-xl uppercase mb-4">Vault</h3>
            <div className="grid grid-cols-2 gap-4">
              {profile.vault.map((item, idx) => (
                <div key={idx} className="aspect-square glass rounded-xl overflow-hidden">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProfileView);
