import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check, Crown, ShieldCheck, Download, Palette, ImageOff, Sparkles } from 'lucide-react';
import { ProTier } from '../types';

interface Plan {
  id: ProTier;
  label: string;
  price: string;
  period: string;
  accent: string;
  features: { text: string; included: boolean }[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    label: 'FREE',
    price: '$0',
    period: '/mo',
    accent: '#71717a',
    cta: 'CURRENT PLAN',
    features: [
      { text: 'Standard resolution exports (1080p)', included: true },
      { text: '3 swaps per day', included: true },
      { text: 'Social feed access', included: true },
      { text: '4K / vector exports', included: false },
      { text: 'Brand Kit storage', included: false },
      { text: 'Ad-free experience', included: false },
      { text: 'Priority AI queue', included: false },
    ],
  },
  {
    id: 'pro',
    label: 'PRO',
    price: '$9',
    period: '/mo',
    accent: '#ccff00',
    cta: 'UPGRADE TO PRO',
    features: [
      { text: 'Standard resolution exports', included: true },
      { text: 'Unlimited swaps', included: true },
      { text: '4K exports (3840px)', included: true },
      { text: 'Up to 5 Brand Kits', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Priority AI queue', included: false },
      { text: 'Vector-ready SVG exports', included: false },
    ],
  },
  {
    id: 'elite',
    label: 'ELITE',
    price: '$29',
    period: '/mo',
    accent: '#f97316',
    cta: 'GO ELITE',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Vector-ready SVG exports', included: true },
      { text: 'Unlimited Brand Kits', included: true },
      { text: 'Priority AI queue', included: true },
      { text: 'Athlete Verification badge', included: true },
      { text: 'White-label exports', included: true },
      { text: 'Team workspace (5 seats)', included: true },
    ],
  },
];

const PLAN_ICONS: Record<ProTier, React.ElementType> = {
  free: Zap,
  pro: Crown,
  elite: ShieldCheck,
};

interface ProUpgradeModalProps {
  currentTier: ProTier;
  triggerReason?: 'export-4k' | 'brand-kit' | 'ad-free' | 'general';
  onUpgrade: (tier: ProTier) => void;
  onClose: () => void;
}

const TRIGGER_HEADLINES: Record<string, { title: string; subtitle: string; icon: React.ElementType }> = {
  'export-4k':  { title: '4K EXPORTS ARE PRO+', subtitle: 'Unlock print-ready 3840px exports for professional social media content.', icon: Download },
  'brand-kit':  { title: 'BRAND KITS ARE PRO+', subtitle: 'Save custom palettes and logos for your school or semi-pro team.', icon: Palette },
  'ad-free':    { title: 'GO AD-FREE', subtitle: 'Remove promoted swaps and banners with a Pro membership.', icon: ImageOff },
  'general':    { title: 'UNLOCK PRO', subtitle: 'Take your jersey creation to the next level.', icon: Sparkles },
};

const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ currentTier, triggerReason = 'general', onUpgrade, onClose }) => {
  const [selected, setSelected] = useState<ProTier>('pro');
  const headline = TRIGGER_HEADLINES[triggerReason];
  const HeadlineIcon = headline.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="w-full sm:max-w-3xl bg-zinc-950 border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center shrink-0">
                <HeadlineIcon className="w-5 h-5 text-[#ccff00]" />
              </div>
              <div>
                <p className="font-oswald italic font-black text-[#ccff00] text-xs uppercase tracking-[0.3em] mb-1">JERSEYSWAP PRO</p>
                <h2 className="font-oswald italic font-black text-2xl sm:text-3xl text-white uppercase leading-none">{headline.title}</h2>
                <p className="text-zinc-500 text-sm mt-2 leading-relaxed font-sans">{headline.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Plan selector */}
          <div className="px-8 pt-6 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {PLANS.map((plan) => {
                const Icon = PLAN_ICONS[plan.id];
                const isActive = selected === plan.id;
                const isCurrent = currentTier === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => { if (!isCurrent) setSelected(plan.id); }}
                    disabled={isCurrent}
                    className={`relative flex flex-col items-center py-5 px-3 rounded-2xl border transition-all ${
                      isActive && !isCurrent
                        ? 'border-[#ccff00] bg-[#ccff00]/8'
                        : isCurrent
                        ? 'border-white/5 bg-white/3 opacity-50 cursor-default'
                        : 'border-white/8 bg-white/3 hover:border-white/20'
                    }`}
                    style={isActive && !isCurrent ? { boxShadow: `0 0 18px ${plan.accent}30` } : undefined}
                  >
                    {isCurrent && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-zinc-700 border border-white/10 rounded-full font-oswald italic font-black text-[8px] uppercase tracking-widest text-zinc-400 whitespace-nowrap">CURRENT</span>
                    )}
                    <Icon className="w-5 h-5 mb-2" style={{ color: plan.accent }} />
                    <span className="font-oswald italic font-black text-sm uppercase tracking-widest" style={{ color: isActive ? plan.accent : '#71717a' }}>{plan.label}</span>
                    <span className="font-oswald italic font-black text-xl text-white mt-1">{plan.price}<span className="text-xs text-zinc-500 font-normal">{plan.period}</span></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature list for selected plan */}
          <div className="px-8 pb-6">
            <p className="font-oswald italic font-black text-[9px] uppercase tracking-[0.3em] text-zinc-600 mb-3">WHAT'S INCLUDED</p>
            <div className="space-y-2.5">
              {PLANS.find(p => p.id === selected)?.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${f.included ? 'bg-[#ccff00]/15' : 'bg-white/5'}`}>
                    <Check className={`w-3 h-3 ${f.included ? 'text-[#ccff00]' : 'text-zinc-700'}`} />
                  </div>
                  <span className={`text-sm font-sans ${f.included ? 'text-zinc-200' : 'text-zinc-600 line-through'}`}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="px-8 pb-8">
            {selected === currentTier ? (
              <button onClick={onClose} className="w-full py-5 border border-white/10 text-zinc-500 font-oswald italic font-black text-lg rounded-2xl uppercase">CLOSE</button>
            ) : (
              <>
                <button
                  onClick={() => { onUpgrade(selected); onClose(); }}
                  className="w-full py-5 font-oswald italic font-black text-lg rounded-2xl uppercase transition-all"
                  style={{
                    backgroundColor: PLANS.find(p => p.id === selected)?.accent,
                    color: selected === 'pro' ? '#000' : '#000',
                    boxShadow: `0 0 24px ${PLANS.find(p => p.id === selected)?.accent}40`,
                  }}
                >
                  {PLANS.find(p => p.id === selected)?.cta}
                </button>
                <p className="text-center text-zinc-700 text-[10px] font-sans mt-3">No real charges — this is a demo environment.</p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProUpgradeModal;
