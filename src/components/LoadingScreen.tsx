import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, AlertTriangle, ArrowRight, Layers } from 'lucide-react';
import { getTheme, THEME_MAP } from '../utils/theme';

interface LoadingScreenProps {
  onBypass: () => void;
  error?: string | null;
  syncStatus?: 'loading' | 'synced' | 'error' | 'idle';
  storeName?: string;
  logoType?: 'text' | 'image';
  logoImage?: string;
  logoText?: string;
  themeName?: string;
}

const KINETIC_TIPS = [
  'Forging premium workspace coordinates...',
  'Sourcing artisan catalog...',
  'Harmonizing fine geometric lighting details...',
  'Assembling sculptural components & layouts...',
  'Polishing precision coordinates...',
  'Establishing secure handshakes with MongoDB Atlas...',
  'Deploying timeless creative interfaces...'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onBypass, 
  error, 
  syncStatus,
  storeName,
  logoType,
  logoImage,
  logoText,
  themeName
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [showBypass, setShowBypass] = useState(false);

  useEffect(() => {
    // Staggered premium message cycling
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % KINETIC_TIPS.length);
    }, 1800);

    // Prompt safe bypass suggestion if database takes a few seconds (e.g. initial compilation cold boot or SSL limits)
    const timeout = setTimeout(() => {
      setShowBypass(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const theme = getTheme(themeName);
  const activeThemeName = themeName || 'neutral-slate';

  const getFlareColors = (name: string) => {
    switch (name) {
      case 'dark-obsidian':
        return {
          ring: 'border-purple-500/20',
          circle: 'border-purple-500/40',
          ping: 'bg-purple-500/10',
          text: 'text-purple-400',
          flare1: 'bg-purple-500/5',
          flare2: 'bg-purple-400/5',
          progress: 'from-purple-500 to-indigo-500',
          pulse: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
        };
      case 'nordic-forest':
        return {
          ring: 'border-emerald-700/20',
          circle: 'border-emerald-700/30',
          ping: 'bg-emerald-500/10',
          text: 'text-emerald-700',
          flare1: 'bg-emerald-500/5',
          flare2: 'bg-teal-400/5',
          progress: 'from-emerald-600 to-teal-500',
          pulse: 'text-emerald-700 bg-emerald-50/70 border-emerald-200'
        };
      case 'royal-bronze':
        return {
          ring: 'border-amber-700/20',
          circle: 'border-amber-700/30',
          ping: 'bg-amber-500/10',
          text: 'text-amber-800',
          flare1: 'bg-amber-500/5',
          flare2: 'bg-stone-400/5',
          progress: 'from-amber-600 to-stone-500',
          pulse: 'text-amber-805 bg-amber-50/70 border-amber-200'
        };
      case 'crimson-velvet':
        return {
          ring: 'border-rose-700/20',
          circle: 'border-rose-700/30',
          ping: 'bg-rose-500/10',
          text: 'text-rose-700',
          flare1: 'bg-rose-550/5',
          flare2: 'bg-orange-450/5',
          progress: 'from-rose-600 to-orange-500',
          pulse: 'text-rose-700 bg-rose-50/70 border-rose-200'
        };
      case 'sand-carthage':
        return {
          ring: 'border-[#C05C36]/20',
          circle: 'border-[#C05C36]/30',
          ping: 'bg-[#C05C36]/10',
          text: 'text-[#C05C36]',
          flare1: 'bg-[#C05C36]/5',
          flare2: 'bg-amber-500/5',
          progress: 'from-[#C05C36] to-amber-500',
          pulse: 'text-[#C05C36] bg-[#FBF2E6] border-[#F5ECE1]'
        };
      case 'dreamy-lavender':
        return {
          ring: 'border-[#8B5CF6]/20',
          circle: 'border-[#8B5CF6]/30',
          ping: 'bg-[#8B5CF6]/10',
          text: 'text-[#8B5CF6]',
          flare1: 'bg-[#8B5CF6]/5',
          flare2: 'bg-indigo-400/5',
          progress: 'from-[#8B5CF6] to-indigo-500',
          pulse: 'text-[#8B5CF6] bg-[#F5F3FF] border-indigo-100'
        };
      default: // neutral-slate
        return {
          ring: 'border-indigo-600/20',
          circle: 'border-indigo-600/30',
          ping: 'bg-indigo-500/10',
          text: 'text-indigo-600',
          flare1: 'bg-indigo-550/5',
          flare2: 'bg-amber-550/5',
          progress: 'from-indigo-600 to-amber-500',
          pulse: 'text-indigo-600 bg-indigo-50/70 border-indigo-200'
        };
    }
  };

  const flares = getFlareColors(activeThemeName);
  const displayTitle = storeName || 'AETHER OBJECTS';

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-colors duration-500 ${theme.backdrop} ${theme.textPrimary} font-sans`}>
      {/* Dynamic atmospheric radial backdrop flares aligning with theme colors */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${flares.flare1} rounded-full blur-[140px] pointer-events-none`} />
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[300px] h-[300px] ${flares.flare2} rounded-full blur-[100px] pointer-events-none`} />

      <div className="relative max-w-md w-full px-6 flex flex-col items-center text-center space-y-10">
        
        {/* Animated Brand Emblem Sphere */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className={`w-24 h-24 rounded-full border border-dashed flex items-center justify-center p-3 ${flares.ring}`}
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className={`w-full h-full rounded-full border p-1 flex items-center justify-center relative overflow-hidden ${flares.circle} ${theme.cardBg}`}
            >
              <div className={`absolute inset-0 ${flares.ping} rounded-full animate-ping opacity-25`} />
              {logoType === 'image' && logoImage ? (
                <img 
                  src={logoImage} 
                  alt="Brand Logo" 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className={`w-full h-full rounded-full ${theme.accentBg} text-white font-display text-2xl font-bold tracking-tighter flex items-center justify-center shadow-inner select-none uppercase`}>
                  {logoText || 'Æ'}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Floating tiny compass widget */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className={`absolute -top-1 -right-1 p-1 rounded-lg border flex items-center justify-center ${flares.pulse}`}
          >
            <Compass className="h-3.5 w-3.5 animate-pulse" />
          </motion.div>
        </div>

        {/* Text Title Container */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-2xl font-display font-medium uppercase tracking-[0.25em] px-4 line-clamp-2 ${theme.textPrimary}`}
          >
            {displayTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-[10px] font-mono tracking-[0.2em] uppercase font-semibold ${flares.text}`}
          >
            Artisan Coordinates & fine Storefront
          </motion.p>
        </div>

        {/* Sync Stage Dashboard Panel */}
        <div className={`w-full max-w-[280px] backdrop-blur rounded-2xl border p-4 space-y-3 ${theme.cardBg} ${theme.borderColor} shadow-sm`}>
          
          {/* Animated Loader Bar */}
          <div className="h-1 w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ left: '-50%', width: '30%' }}
              animate={{ left: '110%' }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className={`absolute top-0 bottom-0 bg-gradient-to-r ${flares.progress} rounded-full`}
            />
          </div>

          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`text-xs font-medium leading-relaxed px-2 ${theme.textSecondary}`}
              >
                {KINETIC_TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Network & Mongo DB indicators */}
          <div className={`pt-2 border-t flex items-center justify-between text-[9px] font-mono ${theme.borderColor} ${theme.textSecondary}`}>
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              SYSTEM ACTIVE
            </span>
            <span className="tracking-widest uppercase">
              {syncStatus === 'error' ? 'SSL RESTRICTED' : 'Syncing Mongo...'}
            </span>
          </div>
        </div>

        {/* Error / Offline Warning Box */}
        {(error || syncStatus === 'error') && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border rounded-xl p-4 text-left max-w-sm space-y-2.5 ${
              activeThemeName === 'dark-obsidian'
                ? 'bg-rose-950/40 border-rose-550 text-rose-350'
                : 'bg-rose-50 border-rose-205 text-rose-800'
            }`}
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">Atlas IP Connection Filtered</p>
                <p className={`text-[10px] font-mono mt-1 opacity-90 leading-relaxed font-semibold break-words ${
                  activeThemeName === 'dark-obsidian' ? 'text-rose-400' : 'text-rose-700'
                }`}>
                  {error || 'MongoDB ServerSelectionError: ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR'}
                </p>
              </div>
            </div>
            
            <p className={`text-[10px] leading-relaxed ${
              activeThemeName === 'dark-obsidian' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              MongoDB Atlas blocks connection attempts from unknown dynamic cloud hosting IPs unless whitelisted as <code className="bg-slate-900/10 dark:bg-slate-900/80 px-1 py-0.5 rounded font-mono text-[9px]">0.0.0.0/0</code>.
            </p>
          </motion.div>
        )}

        {/* Beautiful Elegant Bypass Button */}
        <AnimatePresence>
          {(showBypass || syncStatus === 'error' || error) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-2.5 pt-2"
            >
              <button
                type="button"
                onClick={onBypass}
                className="group relative h-10 px-6 rounded-xl overflow-hidden font-display text-xs font-bold tracking-wider text-white cursor-pointer active:scale-95 transition-all outline-none"
              >
                {/* Background sliding hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${flares.progress} opacity-90 transition-all duration-300 group-hover:opacity-100`} />
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                
                <span className="relative flex items-center space-x-2">
                  <span>Explore Online Demo / Offline State</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <span className={`text-[9.5px] font-mono max-w-[280px] ${theme.textSecondary}`}>
                Loads instant mock items from local state memory immediately so you can test the entire workflow.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-widest text-center ${theme.textSecondary}`}>
        TUNISIA DESIGN LABS &copy; 2026
      </div>
    </div>
  );
};

