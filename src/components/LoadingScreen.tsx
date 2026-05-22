import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, AlertTriangle, ArrowRight, Layers } from 'lucide-react';

interface LoadingScreenProps {
  onBypass: () => void;
  error?: string | null;
  syncStatus?: 'loading' | 'synced' | 'error' | 'idle';
  storeName?: string;
  logoUrl?: string;
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
  logoUrl
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

  const displayLogo = logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&q=80';
  const displayTitle = storeName || 'AETHER OBJECTS';

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 font-sans text-white select-none overflow-hidden">
      {/* Dynamic atmospheric radial backdrop flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-md w-full px-6 flex flex-col items-center text-center space-y-10">
        
        {/* Animated Brand Emblem Sphere */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="w-24 h-24 rounded-full border border-dashed border-indigo-400/20 flex items-center justify-center p-3"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="w-full h-full rounded-full border border-indigo-500/40 p-1 flex items-center justify-center relative overflow-hidden bg-slate-900"
            >
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping opacity-20" />
              <img 
                src={displayLogo} 
                alt="Brand Logo" 
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>
          </motion.div>

          {/* Floating tiny compass widget */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute -top-1 -right-1 bg-amber-500/10 border border-amber-500/30 p-1 rounded-lg"
          >
            <Compass className="h-3 w-3 text-amber-400 animate-pulse" />
          </motion.div>
        </div>

        {/* Text Title Container */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-display font-medium uppercase tracking-[0.25em] text-slate-100 font-sans px-4 line-clamp-2"
          >
            {displayTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.2em] text-indigo-300 uppercase font-semibold"
          >
            Artisan Coordinates & fine Storefront
          </motion.p>
        </div>

        {/* Sync Stage Dashboard Panel */}
        <div className="w-full max-w-[280px] bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-800 p-4 space-y-3">
          
          {/* Animated Loader Bar */}
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ left: '-50%', width: '30%' }}
              animate={{ left: '110%' }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="absolute top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full"
            />
          </div>

          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-xs text-slate-400 font-medium font-sans leading-relaxed px-2"
              >
                {KINETIC_TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Network & Mongo DB indicators */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-500">
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
            className="bg-rose-950/40 border border-rose-550 rounded-xl p-4 text-left max-w-sm space-y-2.5"
          >
            <div className="flex items-start space-x-2 text-rose-350">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold font-sans">Atlas IP Connection Filtered</p>
                <p className="text-[10px] text-rose-400 font-mono mt-1 opacity-90 leading-relaxed font-semibold break-words">
                  {error || 'MongoDB ServerSelectionError: ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR'}
                </p>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed">
              MongoDB Atlas blocks connection attempts from unknown dynamic cloud hosting IPs unless whitelisted as <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">0.0.0.0/0</code>.
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
                className="group relative h-10 px-6 rounded-xl overflow-hidden font-display text-xs font-bold tracking-wider text-slate-200 cursor-pointer active:scale-95 transition-all outline-none"
              >
                {/* Background sliding hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-90 transition-all duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                
                <span className="relative flex items-center space-x-2">
                  <span>Explore Online Demo / Offline State</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <span className="text-[9.5px] font-mono text-slate-505 max-w-[280px]">
                Loads instant mock items from local state memory immediately so you can test the entire workflow.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-600 uppercase tracking-widest text-center">
        TUNISIA DESIGN LABS &copy; 2026
      </div>
    </div>
  );
};
