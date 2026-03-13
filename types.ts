
export interface Team {
  id: string;
  name: string;
  color: string;
  logo: string;
  primaryHex: string;
  leagueId: string;
}

export interface League {
  id: string;
  name: string;
  logo: string;
  logoVariants?: Record<string, string>;
  description: string;
  accentColor?: string;
}

export type RarityTier = 'COMMON' | 'RARE' | 'LEGENDARY';

export function computeRarity(rating: number, ratingCount: number): RarityTier {
  const score = rating * ratingCount;
  if (score >= 50) return 'LEGENDARY';
  if (score >= 10) return 'RARE';
  return 'COMMON';
}

export const RARITY_CONFIG: Record<RarityTier, { label: string; color: string; glow: string; border: string }> = {
  COMMON:    { label: 'COMMON',    color: '#71717a', glow: 'rgba(113,113,122,0.3)',  border: 'border-zinc-700' },
  RARE:      { label: 'RARE',      color: '#0EA5E9', glow: 'rgba(14,165,233,0.4)',   border: 'border-sky-500/50' },
  LEGENDARY: { label: 'LEGENDARY', color: '#ccff00', glow: 'rgba(204,255,0,0.45)',   border: 'border-[#ccff00]/50' },
};

export interface SwapBattle {
  id: string;
  swapA: SocialSwap;
  swapB: SocialSwap;
  votesA: number;
  votesB: number;
  userVote: 'A' | 'B' | null;
  expiresAt: string;
  isActive: boolean;
}

export type AppStep = 'landing' | 'onboarding' | 'auth' | 'sport-select' | 'league-select' | 'upload' | 'customize' | 'jersey-lab' | 'processing' | 'result' | 'profile' | 'editor' | 'social-feed' | 'swap-battle' | 'ai-lab' | 'challenge' | 'collab-studio';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  text: string;
  timestamp: string;
  likeCount?: number;
  hasLiked?: boolean;
  replies?: Comment[];
}

export interface SocialSwap {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string | null;
  image: string;
  team: string;
  sport: string;
  likes: number;
  hasLiked?: boolean;
  rating: number; // 0-5
  ratingCount: number;
  comments: Comment[];
  isSaved?: boolean;
  hasLiked?: boolean;
  rarity?: RarityTier;
  battleEligible?: boolean;
  challengeId?: string;
  athleteVerification?: AthleteVerification;
  collabSessionId?: string;
}

export interface SavedSwap {
  id: string;
  team: string;
  league: string;
  date: string;
  image: string;
  season: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  handle: string;
  role: 'Athlete' | 'Pro Designer' | 'Scout';
  leaguePreference: string;
  bio: string;
  avatar: string | null;
  stats: {
    precision: number;
    sync: number;
    speed: number;
  };
  ovr: number;
  vault: SavedSwap[];
  followingIds?: string[];
  savedSwapIds?: string[];
}

export interface SwapState {
  sportId: string | null;
  image: string | null;
  league: League | null;
  team: Team | null;
  number: string;
  removeBackground: boolean;
  showLogoOverlay?: boolean;
  customPrompt: string;
}
