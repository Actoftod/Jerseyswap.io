
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppStep, SwapState, UserProfile, SavedSwap, SocialSwap, Comment } from './types';
import { TEAMS, LEAGUES } from './constants';
import { GeminiService } from './services/geminiService';
import PlayerCard from './components/PlayerCard';
import PhotoEditor from './components/PhotoEditor';
import AILab from './components/AILab';
import OnboardingFlow from './components/OnboardingFlow';
import ProfileView from './components/ProfileView';
import { SocialFeed } from './components/SocialFeed';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cpu, Lock, ChevronRight, Download, Scan, LogIn, UserPlus, Mail, MessageSquare, LogOut, LayoutGrid, ShieldCheck, BookmarkCheck, Sparkles, Wand2, RotateCcw, AlertCircle, CheckCircle2, Trophy, Disc, Target, Activity, Dribbble, Sword, Globe } from 'lucide-react';

const STORAGE_ACCOUNTS_KEY = 'js_pro_accounts_v1';
const SESSION_KEY = 'js_pro_session_v1';
const SESSION_TIMESTAMP_KEY = 'js_pro_session_ts_v1';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; 

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD || '';

// Mock Social Data
const INITIAL_SOCIAL_SWAPS: SocialSwap[] = [
  {
    id: 's1', userId: 'a1', userName: 'KYLE S.', userHandle: '@KYLE_DESIGN', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600',
    team: 'SF 49ERS', sport: 'NFL', likes: 1240, rating: 4.8, ratingCount: 45, timestamp: new Date().toISOString(),
    comments: [
      { id: 'c1', userId: 'u2', userName: 'MARCUS', userAvatar: null, text: 'That lighting is insane!', timestamp: '2h ago', likeCount: 12, replies: [] }
    ],
    isSaved: false, hasLiked: false
  },
  {
    id: 's2', userId: 'a2', userName: 'JORDAN V.', userHandle: '@JV_KITS', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600',
    team: 'LA LAKERS', sport: 'NBA', likes: 890, rating: 4.5, ratingCount: 32, timestamp: new Date(Date.now() - 86400000).toISOString(),
    comments: [], isSaved: true, hasLiked: true
  }
];

// Seed some initial profiles for the mock network
const INITIAL_PROFILES: UserProfile[] = [
  { id: 'a1', name: 'KYLE SMITH', email: 'kyle@nike.com', handle: '@KYLE_DESIGN', role: 'Pro Designer', leaguePreference: 'NFL', bio: 'Visualizing the future of sports.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', stats: { precision: 95, sync: 88, speed: 92 }, ovr: 94, vault: [], followingIds: [] },
  { id: 'a2', name: 'JORDAN VILLA', email: 'jordan@ea.com', handle: '@JV_KITS', role: 'Pro Designer', leaguePreference: 'NBA', bio: 'EA Sports kit architect.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200', stats: { precision: 90, sync: 94, speed: 85 }, ovr: 91, vault: [], followingIds: [] }
];

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);
  const [step, setStep] = useState<AppStep | 'auth'>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'select' | '2fa'>('select');
  const [showAILab, setShowAILab] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  // Social State
  const [socialSwaps, setSocialSwaps] = useState<SocialSwap[]>(INITIAL_SOCIAL_SWAPS);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authHandle, setAuthHandle] = useState('');
  const [authName, setAuthName] = useState('');
  const [twoFACode, setTwoFACode] = useState('');

  const [state, setState] = useState<SwapState>({ 
    sportId: null, image: null, league: null, team: null, number: '23', removeBackground: false, customPrompt: ''
  });
  
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<any>(null);
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isPreparingPlate, setIsPreparingPlate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNeuralForging, setIsNeuralForging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const geminiService = useRef(new GeminiService());

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const savedProfiles = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    let currentProfiles = INITIAL_PROFILES;
    if (savedProfiles) {
      currentProfiles = JSON.parse(savedProfiles);
      setProfiles(currentProfiles);
    }
    
    const sessionId = localStorage.getItem(SESSION_KEY);
    const sessionTs = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    
    if (sessionId && sessionTs) {
      const now = Date.now();
      const lastActive = parseInt(sessionTs);
      if (now - lastActive < SESSION_TIMEOUT_MS) {
        const found = currentProfiles.find((p: UserProfile) => p.id === sessionId);
        if (found) {
          setActiveProfile(found);
          setStep('social-feed');
          localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
        }
      }
    }
  }, []);

  const syncProfiles = (updated: UserProfile[]) => {
    setProfiles(updated);
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(updated));
    if (activeProfile) {
      const refreshed = updated.find(p => p.id === activeProfile.id);
      if (refreshed) setActiveProfile(refreshed);
    }
    if (viewingProfile) {
      const refreshedViewing = updated.find(p => p.id === viewingProfile.id);
      if (refreshedViewing) setViewingProfile(refreshedViewing);
    }
  };

  const loginProfile = (p: UserProfile) => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setActiveProfile(p);
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, p.id);
        localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      }
      setStep('social-feed');
      setIsAuthLoading(false);
      showToast('success', `NEURAL_ACCESS_GRANTED: Welcome ${p.name}`);
    }, 800);
  };

  const handleSignIn = () => {
    if (!authEmail.includes('@')) return showToast('error', 'INVALID_EMAIL');
    setIsAuthLoading(true);
    setTimeout(() => {
      if (authEmail === ADMIN_EMAIL && authPassword === ADMIN_PW) {
        let adminProfile = profiles.find(p => p.email === ADMIN_EMAIL);
        if (!adminProfile) {
          adminProfile = { id: 'admin_root', name: 'TODD BERTOCH', email: ADMIN_EMAIL, handle: '@ADMIN', role: 'Scout', leaguePreference: 'Elite', bio: 'System Admin.', avatar: null, stats: { precision: 99, sync: 99, speed: 99 }, ovr: 99, vault: [], followingIds: [] };
          syncProfiles([...profiles, adminProfile]);
        }
        loginProfile(adminProfile);
        return;
      }
      const found = profiles.find(p => p.email === authEmail && p.password === authPassword);
      if (found) loginProfile(found);
      else {
        setIsAuthLoading(false);
        showToast('error', 'AUTH_FAILURE');
      }
    }, 1000);
  };

  const verify2FA = () => {
    if (twoFACode === '1234') {
      setStep('onboarding');
      setAuthMode('select');
    } else {
      showToast('error', 'INVALID_2FA');
    }
  };

  const logout = () => {
    setActiveProfile(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);
    setStep('auth');
    setAuthMode('select');
  };

  const reset = useCallback(() => {
    setStep('sport-select');
    setShowAILab(false);
    setViewingProfile(null);
    setState({ sportId: null, image: null, league: null, team: null, number: '23', removeBackground: false, customPrompt: '' });
    setResultImage(null);
    setPlayerData(null);
    setShowPlayerCard(false);
  }, []);

  const selectSport = (sportId: string) => {
    setIsNeuralForging(true);
    setStep('processing');
    setState(prev => ({ ...prev, sportId }));
    
    setTimeout(() => {
      setIsNeuralForging(false);
      setStep('league-select');
    }, 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        setIsPreparingPlate(true);
        try {
          const preparedPlate = await geminiService.current.prepareAthletePlate(rawBase64);
          setState(prev => ({ ...prev, image: preparedPlate }));
          setStep('customize');
        } catch (err) {
          setState(prev => ({ ...prev, image: rawBase64 }));
          setStep('customize');
        } finally {
          setIsPreparingPlate(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwap = async () => {
    if (!state.image || !state.team) return;
    setIsLoading(true);
    setStep('processing');
    try {
      const [result, stats] = await Promise.all([
        geminiService.current.performJerseySwap(state.image, state.team.name, state.number, state.removeBackground, state.customPrompt),
        geminiService.current.generatePlayerStats(state.team.name)
      ]);
      setResultImage(result);
      setPlayerData(stats);
      setStep('result');
      showToast('success', 'NEURAL_FORGE_COMPLETE');
    } catch (error) {
      setStep('customize');
      showToast('error', 'SYNTHESIS_FAILURE');
    } finally { setIsLoading(false); }
  };

  const handleSaveToVault = () => {
    if (!activeProfile || !resultImage || !state.team) return;
    setIsSaving(true);
    const newSwap: SavedSwap = {
      id: Date.now().toString(),
      team: state.team.name,
      league: state.league?.name || 'Pro',
      date: new Date().toLocaleDateString(),
      image: resultImage,
      season: 'W25'
    };
    const updatedProfiles = profiles.map(p => {
      if (p.id === activeProfile.id) return { ...p, vault: [newSwap, ...(p.vault || [])] };
      return p;
    });
    syncProfiles(updatedProfiles);
    setTimeout(() => {
      setIsSaving(false);
      showToast('success', 'COMMITTED_TO_VAULT');
    }, 800);
  };

  const handleSocialLike = (id: string) => {
    setSocialSwaps(prev => prev.map(s => s.id === id ? { ...s, likes: s.hasLiked ? s.likes - 1 : s.likes + 1, hasLiked: !s.hasLiked } : s));
  };

  const handleSocialSave = (id: string) => {
    setSocialSwaps(prev => prev.map(s => s.id === id ? { ...s, isSaved: !s.isSaved } : s));
    showToast('success', 'VAULT_UPDATED');
  };

  const handleSocialComment = (swapId: string, text: string, parentId?: string) => {
    if (!activeProfile) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: activeProfile.id,
      userName: activeProfile.name,
      userAvatar: activeProfile.avatar,
      text,
      timestamp: 'Just now',
      likeCount: 0,
      replies: []
    };
    
    setSocialSwaps(prev => prev.map(s => {
      if (s.id !== swapId) return s;
      
      if (parentId) {
        // Find parent and add to its replies
        const updatedComments = s.comments.map(c => {
          if (c.id === parentId) {
            return { ...c, replies: [...(c.replies || []), newComment] };
          }
          return c;
        });
        return { ...s, comments: updatedComments };
      }
      
      return { ...s, comments: [newComment, ...s.comments] };
    }));
  };

  const handleSocialRate = (id: string, rating: number) => {
    setSocialSwaps(prev => prev.map(s => {
      if (s.id === id) {
        const newRating = (s.rating * s.ratingCount + rating) / (s.ratingCount + 1);
        return { ...s, rating: Number(newRating.toFixed(1)), ratingCount: s.ratingCount + 1 };
      }
      return s;
    }));
    showToast('success', 'RATING_COMMITTED');
  };

  const handleFollowAction = (userId: string) => {
    if (!activeProfile) return;
    const following = activeProfile.followingIds || [];
    const isFollowing = following.includes(userId);
    const updatedFollowing = isFollowing ? following.filter(id => id !== userId) : [...following, userId];
    
    const updatedProfiles = profiles.map(p => {
      if (p.id === activeProfile.id) return { ...p, followingIds: updatedFollowing };
      return p;
    });
    
    syncProfiles(updatedProfiles);
    showToast('success', isFollowing ? 'SYNC_DETACHED' : 'NEURAL_SYNC_ESTABLISHED');
  };

  const handleViewProfile = (userId: string) => {
    const targetProfile = profiles.find(p => p.id === userId);
    if (targetProfile) {
      setViewingProfile(targetProfile);
      setStep('profile');
    }
  };

  const handleOnboardingComplete = (onboardingData: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: authName.toUpperCase(),
      email: authEmail,
      password: authPassword,
      handle: authHandle.startsWith('@') ? authHandle : `@${authHandle}`,
      role: onboardingData.role || 'Athlete',
      leaguePreference: onboardingData.leaguePreference || 'Elite',
      bio: onboardingData.bio || '',
      avatar: null,
      stats: onboardingData.stats || { precision: 85, sync: 90, speed: 75 },
      ovr: onboardingData.ovr || 85,
      vault: [],
      followingIds: []
    };
    syncProfiles([...profiles, newProfile]);
    loginProfile(newProfile);
  };

  const sports = [
    { id: 'football', name: 'FOOTBALL', icon: Trophy, color: '#ccff00', leagues: ['nfl', 'nfl_madden', 'ncaa_fb', 'ea_cfb'] },
    { id: 'basketball', name: 'BASKETBALL', icon: Target, color: '#17408B', leagues: ['nba', 'nba_2k', 'ncaa_bb'] },
    { id: 'baseball', name: 'BASEBALL', icon: Disc, color: '#E31937', leagues: ['mlb', 'the_show'] },
    { id: 'soccer', name: 'SOCCER', icon: Activity, color: '#ffffff', leagues: ['mls', 'fifa_fc', 'world_soccer'] },
    { id: 'hockey', name: 'HOCKEY', icon: Disc, color: '#0061AC', leagues: ['nhl', 'ea_nhl'] },
    { id: 'gaming', name: 'GAMING HUB', icon: Sword, color: '#ccff00', leagues: ['nfl_madden', 'ea_cfb', 'nba_2k', 'the_show', 'fifa_fc', 'ea_nhl'] },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center safe-top safe-bottom">
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-0 z-[500] pointer-events-none w-full flex justify-center">
            <div className={`px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${notification.type === 'success' ? 'bg-[#ccff00]/20 border-[#ccff00] text-[#ccff00]' : 'bg-red-500/20 border-red-500 text-red-500'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-oswald italic font-black text-xs tracking-widest uppercase">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(step as string === 'auth' || !activeProfile) && step !== 'onboarding' ? (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative">
          <div className="max-w-md w-full glass p-10 rounded-[3.5rem] border border-white/10 z-10 shadow-2xl relative text-center">
            <motion.div className="w-20 h-20 bg-[#ccff00] rounded-[1.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(204,255,0,0.3)] mb-8 mx-auto">
                 <Zap className="w-10 h-10 text-black fill-current" />
            </motion.div>
            <h1 className="font-oswald italic font-black text-4xl uppercase tracking-ultra text-white mb-8">JERSEY<span className="text-[#ccff00]">SWAP</span></h1>
            
            <AnimatePresence mode="wait">
              {authMode === 'select' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {profiles.length > 0 ? (
                    profiles.map(p => (
                      <button key={p.id} onClick={() => loginProfile(p)} className="w-full p-5 glass rounded-2xl border border-white/5 flex items-center gap-5 text-left hover:border-[#ccff00]/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden">
                          <img src={p.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200'} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-oswald italic font-black text-white uppercase text-lg leading-none">{p.name}</p>
                          <p className="font-oswald italic text-[10px] text-[#ccff00] tracking-widest uppercase mt-1">{p.handle}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-6 text-center text-zinc-600 font-oswald italic text-xs uppercase">NO_PROFILES_FOUND</div>
                  )}
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <button onClick={() => setAuthMode('signin')} className="py-5 glass rounded-2xl font-oswald italic font-black text-[11px] uppercase text-white">SIGN_IN</button>
                    <button onClick={() => setAuthMode('signup')} className="py-5 bg-[#ccff00] rounded-2xl font-oswald italic font-black text-[11px] uppercase text-black">CREATE_ID</button>
                  </div>
                </motion.div>
              )}

              {authMode === 'signin' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                   <div className="space-y-4">
                     <input aria-label="Email Address" placeholder="EMAIL_ADDRESS" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-oswald italic text-white outline-none" />
                     <input aria-label="Password" type="password" placeholder="PASSWORD" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-oswald italic text-white outline-none" />
                   </div>
                   <button onClick={handleSignIn} disabled={isAuthLoading} className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-2xl">
                     {isAuthLoading ? <RotateCcw className="w-6 h-6 animate-spin" /> : 'AUTHORIZE'}
                   </button>
                   <button onClick={() => setAuthMode('select')} className="w-full py-2 text-zinc-600 font-oswald italic text-[10px] uppercase">BACK</button>
                 </motion.div>
              )}

              {authMode === 'signup' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                   <div className="space-y-3">
                     <input aria-label="Full Name" placeholder="FULL_NAME" value={authName} onChange={e => setAuthName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 font-oswald italic text-white" />
                     <input aria-label="Email" placeholder="EMAIL" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 font-oswald italic text-white" />
                     <input aria-label="Handle" placeholder="@HANDLE" value={authHandle} onChange={e => setAuthHandle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 font-oswald italic text-white" />
                     <input aria-label="Password" type="password" placeholder="PASSWORD" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 font-oswald italic text-white" />
                   </div>
                   <button onClick={() => setAuthMode('2fa')} className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-2xl">INIT_ONBOARDING</button>
                   <button onClick={() => setAuthMode('select')} className="w-full py-2 text-zinc-600 font-oswald italic text-[10px] uppercase">BACK</button>
                 </motion.div>
              )}

              {authMode === '2fa' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                  <ShieldCheck className="w-12 h-12 text-[#ccff00] mx-auto mb-4" />
                  <h2 className="font-oswald italic font-black text-2xl text-white uppercase">VERIFICATION</h2>
                  <input aria-label="2FA Code" value={twoFACode} onChange={e => setTwoFACode(e.target.value.slice(0,4))} type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-center text-4xl font-oswald italic font-black text-[#ccff00]" placeholder="1234" />
                  <button onClick={verify2FA} className="w-full py-5 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-2xl uppercase">VERIFY</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <header className="fixed top-0 inset-x-0 z-[100] bg-black/60 backdrop-blur-2xl border-b border-white/5 px-6 h-14 flex items-center justify-between">
            <div onClick={reset} className="flex items-center gap-2 cursor-pointer" role="button" aria-label="Reset Application" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && reset()}>
              <Zap className="w-5 h-5 text-[#ccff00] fill-current" />
              <span className="font-oswald italic font-black text-sm tracking-tighter uppercase">JERSEY<span className="text-[#ccff00]">SWAP</span></span>
            </div>
            <div className="flex gap-2">
              <button aria-label="Social Feed" onClick={() => setStep('social-feed')} className={`p-2 rounded-lg ${step === 'social-feed' ? 'text-[#ccff00]' : 'text-zinc-500'}`}><Globe className="w-5 h-5" /></button>
              <button aria-label="Toggle AI Lab" onClick={() => setShowAILab(!showAILab)} className={`p-2 rounded-lg ${showAILab ? 'text-[#ccff00]' : 'text-zinc-500'}`}><Cpu className="w-5 h-5" /></button>
              <button aria-label="View Profile" onClick={() => { setViewingProfile(null); setStep('profile'); }} className={`p-2 rounded-lg ${step === 'profile' && !viewingProfile ? 'text-[#ccff00]' : 'text-zinc-500'}`}><LayoutGrid className="w-5 h-5" /></button>
              <button aria-label="Logout" onClick={logout} className="p-2 text-zinc-700 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
            </div>
          </header>

          <main className="flex-1 w-full pt-20 relative z-10 px-4">
            <AnimatePresence mode="wait">
              {step === 'processing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden">
                  <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale contrast-150">
                    <source src="https://storage.googleapis.com/jerseyswap/uploads/dark_clouds_with_lightning.mp4" type="video/mp4" />
                  </video>
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-32 h-32 border-4 border-[#ccff00] rounded-full flex items-center justify-center animate-[spin_3s_linear_infinite]">
                      <Zap className="w-16 h-16 text-[#ccff00] fill-current animate-pulse" />
                    </div>
                    <h2 className="font-oswald italic font-black text-4xl md:text-6xl text-[#ccff00] uppercase tracking-ultra text-center">NEURAL FORGE IN PROGRESS</h2>
                  </div>
                </motion.div>
              )}

              {step === 'social-feed' && activeProfile && (
                <SocialFeed 
                  user={activeProfile}
                  swaps={socialSwaps}
                  onLike={handleSocialLike}
                  onSave={handleSocialSave}
                  onComment={handleSocialComment}
                  onRate={handleSocialRate}
                  onFollow={handleFollowAction}
                  onViewProfile={handleViewProfile}
                />
              )}

              {step === 'sport-select' && (
                <div className="flex flex-col items-center text-center max-w-6xl mx-auto py-10">
                   <h2 className="font-oswald italic font-black text-4xl md:text-7xl uppercase tracking-ultra mb-12">SELECT_SPORT</h2>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                     {sports.map((s) => (
                       <div key={s.id} className="glass rounded-[2.5rem] border border-white/5 p-8 flex flex-col items-center gap-6 group hover:border-[#ccff00]/40 transition-all">
                         <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-black/40 p-4 flex items-center justify-center border border-white/5 relative overflow-hidden">
                           <s.icon className="w-12 h-12 text-zinc-500 group-hover:text-[#ccff00] transition-all" />
                         </div>
                         <h3 className="font-oswald italic font-black text-xl md:text-2xl uppercase text-white">{s.name}</h3>
                         <button onClick={() => selectSport(s.id)} className="w-full py-4 bg-[#ccff00] text-black font-oswald italic font-black text-lg rounded-xl uppercase tracking-tighter shadow-xl">CHOOSE</button>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {step === 'league-select' && (
                <div className="flex flex-col items-center py-10">
                  <h2 className="font-oswald italic font-black text-4xl uppercase mb-12">CHOOSE_LEAGUE</h2>
                  <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                    {LEAGUES.filter(l => {
                      const sport = sports.find(s => s.id === state.sportId);
                      return sport?.leagues.includes(l.id);
                    }).map(l => (
                      <button key={l.id} onClick={() => { setState(p => ({ ...p, league: l })); setStep('upload'); }} className="h-28 glass rounded-[2rem] border border-white/5 flex items-center p-8 gap-6 text-left group hover:border-[#ccff00]/30 transition-all">
                        <img src={l.logo} className="h-16 w-16 object-contain grayscale group-hover:grayscale-0 transition-all" />
                        <span className="font-oswald italic font-black text-xl uppercase text-white group-hover:text-[#ccff00] leading-none">{l.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'upload' && (
                 <div className="flex flex-col items-center py-10">
                   <h2 className="font-oswald italic font-black text-4xl uppercase mb-12">SOURCE_PLATE</h2>
                   <div role="button" aria-label="Upload Photo" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()} onClick={() => fileInputRef.current?.click()} className="w-full max-w-sm aspect-square glass rounded-[3.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 hover:border-[#ccff00]/40 cursor-pointer shadow-2xl">
                     <Zap className="w-12 h-12 text-[#ccff00]" />
                     <span className="font-oswald italic font-black text-2xl uppercase">UPLOAD_PHOTO</span>
                   </div>
                   <input aria-hidden="true" type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </div>
              )}

              {step === 'customize' && state.image && (
                <PhotoEditor 
                  image={state.image} teams={TEAMS.filter(t => t.leagueId === state.league?.id)} selectedTeam={state.team} onTeamSelect={(t) => setState(p => ({ ...p, team: t }))}
                  number={state.number} onNumberChange={(n) => setState(p => ({ ...p, number: n }))} removeBackground={state.removeBackground} onToggleBackground={() => setState(p => ({ ...p, removeBackground: !p.removeBackground }))}
                  onSwap={handleSwap} isProcessing={isLoading}
                  customPrompt={state.customPrompt} onCustomPromptChange={(cp) => setState(p => ({ ...p, customPrompt: cp }))}
                />
              )}

              {step === 'result' && resultImage && (
                <div className="flex flex-col items-center pb-24">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm aspect-[3/4] glass rounded-[3.5rem] overflow-hidden border border-white/10 relative mb-12">
                     <img src={resultImage} className="w-full h-full object-cover" />
                     <button aria-label="Download Result" onClick={() => window.open(resultImage, '_blank')} className="absolute bottom-8 right-8 w-16 h-16 bg-[#ccff00] text-black rounded-full flex items-center justify-center shadow-2xl">
                       <Download className="w-7 h-7" />
                     </button>
                  </motion.div>
                  <div className="w-full max-w-sm space-y-4">
                     <button onClick={() => setShowPlayerCard(true)} className="w-full py-6 bg-[#ccff00] text-black font-oswald italic font-black text-2xl rounded-3xl uppercase">VIEW_PLAYER_CARD</button>
                     <button onClick={handleSaveToVault} disabled={isSaving} className="w-full py-6 glass font-oswald italic font-black text-2xl rounded-3xl uppercase flex items-center justify-center gap-3">
                       {isSaving ? <RotateCcw className="w-6 h-6 animate-spin" /> : 'COMMIT_TO_VAULT'}
                     </button>
                     <button onClick={reset} className="w-full py-6 border border-white/10 text-zinc-500 font-oswald italic font-black text-2xl rounded-3xl uppercase">NEW_DRAFT</button>
                  </div>
                </div>
              )}

              {step === 'onboarding' && <OnboardingFlow onComplete={handleOnboardingComplete} />}
              {step === 'profile' && activeProfile && (
                <ProfileView 
                  profile={viewingProfile || activeProfile} 
                  isOwnProfile={!viewingProfile || viewingProfile.id === activeProfile.id}
                  currentUser={activeProfile}
                  onBack={() => { setViewingProfile(null); setStep('social-feed'); }} 
                  onUpdate={(p) => syncProfiles(profiles.map(pr => pr.id === p.id ? p : pr))}
                  onFollow={handleFollowAction}
                  followingProfiles={profiles.filter(p => (viewingProfile || activeProfile).followingIds?.includes(p.id))}
                />
              )}
              {showAILab && <AILab />}
            </AnimatePresence>
          </main>

          {/* Fab Navigation */}
          {activeProfile && step !== 'auth' && step !== 'onboarding' && (
            <div className="fixed bottom-8 z-[100] flex gap-4">
              <button 
                aria-label="Create New Swap"
                onClick={reset}
                className="w-16 h-16 bg-[#ccff00] text-black rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(204,255,0,0.4)] hover:scale-110 active:scale-90 transition-all"
              >
                <Zap className="w-8 h-8 fill-current" />
              </button>
            </div>
          )}
        </div>
      )}

      {showPlayerCard && resultImage && playerData && activeProfile && (
        <PlayerCard image={resultImage} name={activeProfile.name} team={state.team?.name || ''} number={state.number} background={playerData.background} highlights={playerData.highlights} stats={playerData.stats} onClose={() => setShowPlayerCard(false)} />
      )}
    </div>
  );
};

export default App;
