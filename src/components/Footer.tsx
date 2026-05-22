/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../state/StoreContext';
import { 
  ArrowUpRight, HelpCircle, Shield, RotateCcw, Truck, 
  Heart, Award, Clock, Sparkles, CheckCircle, Tag, Undo, Star, Gift, MessageSquare 
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  'truck': Truck,
  'rotate-ccw': RotateCcw,
  'shield': Shield,
  'help-circle': HelpCircle,
  'heart': Heart,
  'award': Award,
  'clock': Clock,
  'sparkles': Sparkles,
  'check-circle': CheckCircle,
  'tag': Tag,
  'undo': Undo,
  'star': Star,
  'gift': Gift,
  'message-square': MessageSquare
};

export const Footer: React.FC = () => {
  const { setView, settings, setTrackingOrderId } = useStore();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const featuresList = settings.footerFeatures || [
    { id: '1', title: settings.footerFeature1Title || 'Express Shipping', desc: settings.footerFeature1Desc || 'Free delivery on orders above $150.00', icon: 'truck' },
    { id: '2', title: settings.footerFeature2Title || '30-Day Escrow Returns', desc: settings.footerFeature2Desc || 'Hassle-free shipping envelope included', icon: 'rotate-ccw' },
    { id: '3', title: settings.footerFeature3Title || 'Encrypted Security', desc: settings.footerFeature3Desc || '256-bit bank standard SSL certificate protection', icon: 'shield' },
    { id: '4', title: settings.footerFeature4Title || 'Full Customer Care', desc: settings.footerFeature4Desc || 'Available via live correspondence portals', icon: 'help-circle' }
  ];

  const gridColsClass = featuresList.length === 1 
    ? 'grid-cols-1' 
    : featuresList.length === 2 
    ? 'grid-cols-1 sm:grid-cols-2 md:max-w-2xl mx-auto' 
    : featuresList.length === 3 
    ? 'grid-cols-1 sm:grid-cols-3' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <footer className="mt-24 border-t border-slate-100 bg-slate-50 text-slate-600">
      
      {/* Upper Features Ribbons */}
      {featuresList.length > 0 && (
        <div className="border-b border-slate-200/60 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className={`grid gap-6 ${gridColsClass}`}>
              {featuresList.map((feature, idx) => {
                const IconComp = iconMap[feature.icon] || HelpCircle;
                return (
                  <div key={feature.id || idx} className="flex items-start space-x-3.5">
                    <div className="rounded-full bg-indigo-50 p-2 text-indigo-650 border border-indigo-100 shrink-0">
                      <IconComp className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 tracking-tight leading-none mb-1">{feature.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links & Directory */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand Intro Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              {settings.logoType === 'image' && settings.logoImage ? (
                <div className="flex h-8 w-8 overflow-hidden rounded bg-slate-50 border border-slate-200 p-0.5 items-center justify-center shadow-sm">
                  <img 
                    src={settings.logoImage} 
                    alt="Logo" 
                    className="h-full w-full object-cover rounded-sm" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=100&q=80';
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white font-display text-sm font-semibold shadow-sm shadow-indigo-100">
                  {settings.logoText || 'Æ'}
                </div>
              )}
              <span className="font-display text-md font-bold tracking-[0.2em] text-slate-900">
                {settings.storeName}
              </span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-slate-405 whitespace-pre-line">
              {settings.customFooterIntro || 'Curating high-grade functional instruments, workspace structures, and premium modern accessories constructed with genuine materials designed to endure.'}
            </p>
            <div className="font-mono text-[10px] text-slate-400 uppercase">
              {settings.footerStatusText || 'PLATFORM STATUS: ● SECURE PORTAL'}
            </div>
          </div>

          {/* Directory Guides */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-slate-900">{settings.footerCol1Title || 'Catalogue'}</h3>
                <ul className="mt-4 space-y-2.5 text-xs">
                  <li>
                    <button onClick={() => { setView('shop'); setTrackingOrderId(null); }} className="hover:text-indigo-650 tracking-wide transition-colors">
                      Latest Acquisitions
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setView('shop'); setTrackingOrderId(null); }} className="hover:text-indigo-650 tracking-wide transition-colors">
                      Desk & Study
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setView('shop'); setTrackingOrderId(null); }} className="hover:text-indigo-650 tracking-wide transition-colors">
                      Cast & Spun Metals
                    </button>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-slate-900">{settings.footerCol2Title || 'Administrative'}</h3>
                <ul className="mt-4 space-y-2.5 text-xs">
                  <li>
                    <button onClick={() => setView('admin')} className="flex items-center hover:text-indigo-650 tracking-wide transition-colors">
                      <span>Inventory Portal</span>
                      <ArrowUpRight className="ml-1 h-3 w-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setView('admin')} className="flex items-center hover:text-indigo-650 tracking-wide transition-colors">
                      <span>Sales & Orders</span>
                      <ArrowUpRight className="ml-1 h-3 w-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setView('admin')} className="flex items-center hover:text-indigo-650 tracking-wide transition-colors">
                      <span>Promo Manager</span>
                      <ArrowUpRight className="ml-1 h-3 w-3 text-slate-400" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-slate-900">{settings.footerSupportTitle || 'Global Customer Support'}</h3>
              <p className="text-xs leading-relaxed text-slate-405">
                {settings.footerSupportDesc || 'Have inquiries about custom corporate pricing or genuine material specifications?'}
              </p>
              <div className="inline-flex rounded-lg border border-slate-205 bg-slate-100 p-3.5">
                <div className="text-left">
                  <span className="block font-mono text-[10px] text-slate-450 mb-0.5">DIRECT ASSISTANT:</span>
                   <a href={`mailto:${settings.customFooterEmail || 'support@aether.design'}`} className="block text-xs font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                     {settings.customFooterEmail || 'support@aether.design'}
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower copyright bar */}
        <div className="mt-16 flex flex-col justify-between border-t border-slate-200/65 pt-8 sm:flex-row items-center space-y-4 sm:space-y-0">
          <p className="text-[11px] text-slate-400 whitespace-pre-line">
            &copy; {currentYear} {settings.storeName}. {settings.customFooterText || 'Handcrafted in the digital workspaces. All rights reserved.'}
          </p>
          <button
            onClick={handleScrollToTop}
            className="rounded-full bg-white border border-slate-200 shadow-sm hover:border-indigo-600 hover:text-indigo-650 px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer"
            id="back-to-top-btn"
          >
            Refocus Spectrum ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
