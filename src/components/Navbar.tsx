/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../state/StoreContext';
import { ShoppingBag, LayoutDashboard, Store, Search, X, Compass, Clock, User, LogOut, Lock, Globe } from 'lucide-react';
import { getTheme } from '../utils/theme';
import { getTranslation } from '../utils/translations';

export const Navbar: React.FC = () => {
  const {
    cart,
    currentView,
    setView,
    searchKeyword,
    setSearch,
    setCartOpen,
    setTrackingOrderId,
    loggedInAdmin,
    settings,
    currentUser,
    currentAdminUser,
    logoutUser,
    updateSettings
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchKeyword);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const theme = getTheme(settings.websiteTheme);
  const t = getTranslation(settings.language);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearch('');
    setShowSearchInput(false);
  };

  const isDark = settings.websiteTheme === 'dark-obsidian';

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md shadow-sm transition-all duration-300 ${
      isDark 
        ? 'border-slate-800 bg-slate-950/85 text-slate-100' 
        : `${theme.borderColor} bg-white/85 text-slate-900`
    }`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Brand Logo */}
        <div 
          onClick={() => { setView('shop'); setTrackingOrderId(null); }}
          className="flex cursor-pointer items-center space-x-2"
          id="navbar-logo"
        >
          {settings.logoType === 'image' && settings.logoImage ? (
            <div className={`flex h-10 w-10 overflow-hidden rounded-lg bg-slate-50 border p-0.5 items-center justify-center shadow-md ${theme.borderColor}`}>
              <img 
                src={settings.logoImage} 
                alt="Logo" 
                className="h-full w-full object-cover rounded" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593642702821-c8da63116c2c?w=100&q=80';
                }}
              />
            </div>
          ) : (
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${theme.accentBg} text-white font-display text-lg font-semibold tracking-tighter shadow-md`}>
              {settings.logoText || 'Æ'}
            </div>
          )}
          <span className="font-display text-sm min-[390px]:text-base md:text-lg font-bold tracking-[0.1em] min-[390px]:tracking-[0.2em] transition-opacity hover:opacity-85 text-current max-w-[80px] min-[390px]:max-w-[125px] sm:max-w-none truncate">
            {settings.storeName}
          </span>
        </div>

        {/* Center: Search input for Shop / Breadcrumbs for Admin */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          {currentView === 'shop' ? (
            <form onSubmit={handleSearchSubmit} className="relative w-full" id="search-form">
              <input
                type="text"
                placeholder={t.search_placeholder}
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearch(e.target.value); // Instant search experience
                }}
                className={`w-full rounded-full border px-5 py-2.5 pl-11 text-xs outline-none transition-all ${
                  isDark 
                    ? 'border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:border-purple-500' 
                    : `${theme.borderColor} bg-slate-50 focus:border-indigo-400 focus:bg-white`
                }`}
              />
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 top-3 text-slate-450 hover:text-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          ) : currentView === 'checkout' ? (
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className={`text-slate-500 font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>ROOT</span>
              <span>/</span>
              <span className={`font-semibold tracking-tight text-[11px] ${theme.accentText}`}>{settings.language === 'fr' ? 'PORTAIL_PAIEMENT_SECURISE' : 'SECURE_CHECKOUT_GATEWAY'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className={`text-slate-500 font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>ROOT</span>
              <span>/</span>
              <span className={`font-semibold tracking-tight text-[11px] ${theme.accentText}`}>{settings.language === 'fr' ? 'CONSOLE_ADMIN_V3.0_LIVE' : 'ADMIN_CONSOLE_V3.0_LIVE'}</span>
            </div>
          )}
        </div>

        {/* Right Side: Interactive actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Find Button for Mobile/Tablet */}
          {currentView === 'shop' && (
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="md:hidden rounded-full p-2.5 text-slate-450 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Toggle search bar"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {/* View Toggle: Only show Storefront option if not in shop mode */}
          {currentView !== 'shop' && (
            <button
              onClick={() => setView('shop')}
              className={`flex items-center space-x-1.5 rounded-full px-4 py-2 text-xs font-semibold tracking-tight border transition-all duration-300 shadow-sm ${
                isDark 
                  ? 'bg-slate-905 border-slate-800 text-slate-205 hover:bg-slate-800' 
                   : 'bg-slate-100 border-slate-202 text-slate-800 hover:bg-slate-200'
              }`}
              id="view-toggle-btn"
            >
              <Store className="h-3.5 w-3.5" />
              <span>{t.view_storefront}</span>
            </button>
          )}

          {/* Unified Identification Status Account Portal */}
          <div className="flex items-center" id="account-portal-navbar-section">
            {currentUser ? (
              <div className="flex items-center space-x-1.5 min-[400px]:space-x-2 bg-slate-100/80 dark:bg-slate-900 px-2.5 py-1 min-[400px]:px-3 min-[400px]:py-1.5 rounded-full border border-slate-150 dark:border-slate-800 shadow-xs">
                <div className="flex flex-col text-left max-w-[55px] min-[400px]:max-w-[110px]">
                  <span className="text-[10px] min-[400px]:text-[10.5px] font-bold leading-tight truncate">{currentUser.name}</span>
                  <span className="text-[7.5px] min-[400px]:text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest leading-none">CLIENT</span>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                  }}
                  className="p-1 rounded-full text-slate-405 hover:text-rose-605 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  title="Logout Session"
                >
                  <LogOut className="h-3 w-3 min-[400px]:h-3.5 min-[400px]:w-3.5" />
                </button>
              </div>
            ) : loggedInAdmin ? (
              <div className="flex items-center space-x-1.5 min-[400px]:space-x-2 bg-indigo-50/70 dark:bg-purple-950/40 px-2.5 py-1 min-[400px]:px-3 min-[400px]:py-1.5 rounded-full border border-indigo-100 dark:border-purple-900 shadow-xs">
                <div className="flex flex-col text-left max-w-[55px] min-[400px]:max-w-[110px]">
                  <span className="text-[10px] min-[400px]:text-[10.5px] font-bold leading-tight text-indigo-700 dark:text-purple-300 truncate" title={currentAdminUser?.name || 'Admin Active'}>
                    {currentAdminUser?.name || 'Admin Active'}
                  </span>
                  <span className="text-[7.5px] min-[400px]:text-[8px] font-mono text-indigo-500/80 dark:text-purple-400/80 font-bold uppercase tracking-widest leading-none">
                    {currentAdminUser?.role === 'super_admin' ? '⚡ ROOT' : 'STAFF'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                  }}
                  className="p-1 rounded-full text-indigo-500 dark:text-purple-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  title="Logout Administrator"
                >
                  <LogOut className="h-3 w-3 min-[400px]:h-3.5 min-[400px]:w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView('login')}
                className={`flex items-center space-x-1 rounded-full px-2.5 py-1.5 min-[400px]:px-4 min-[400px]:py-2 text-[10.5px] min-[400px]:text-xs font-bold uppercase tracking-wider border transition-all shadow-sm ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-purple-400 hover:bg-slate-850 hover:text-purple-300' 
                    : 'bg-white border-slate-205 text-indigo-600 hover:bg-slate-50 hover:text-indigo-700'
                }`}
                title="Authenticate Identity"
                id="navbar-portal-signin-btn"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden min-[400px]:inline">{t.sign_in}</span>
              </button>
            )}
          </div>

          {/* Quick Language Toggle */}
          <button
            onClick={() => {
              const nextLang = settings.language === 'fr' ? 'en' : 'fr';
              updateSettings({ language: nextLang });
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-full border text-[10.5px] font-mono font-bold tracking-tight uppercase hover:bg-slate-105 active:scale-95 transition-all select-none cursor-pointer ${
              isDark 
                ? 'border-slate-800 text-slate-300 hover:bg-slate-900' 
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            title={settings.language === 'fr' ? "Switch to English" : "Passer au Français"}
            id="language-switch-btn"
          >
            <Globe className="h-3.5 w-3.5 text-slate-450" />
            <span>{settings.language === 'fr' ? 'FR' : 'EN'}</span>
          </button>

          {/* Order Tracking Quick shortcut */}
          <button
            onClick={() => {
              setView('shop');
              const trackingCode = prompt(settings.language === 'fr' ? 'Entrez votre identifiant de commande à 4 chiffres (ex: 9824):' : 'Enter your 4-digit Order ID (e.g. 9824):');
              if (trackingCode) {
                const query = trackingCode.trim().toUpperCase();
                const matchedCode = query.startsWith('ORD-') ? query : `ORD-${query}`;
                setTrackingOrderId(matchedCode);
              }
            }}
            className="rounded-full border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors hidden sm:flex"
            title={t.track_order}
            id="order-tracking-btn"
          >
            <Clock className="h-4 w-4" />
          </button>

          {/* Cart Icon trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all cursor-pointer ${
              isDark 
                ? 'border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-purple-400' 
                : 'border-slate-200 text-slate-705 hover:bg-slate-100 hover:text-indigo-600'
            }`}
            id="open-cart-btn"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartItemsCount > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full ${theme.accentBg} text-[10px] font-bold text-white ring-2 ${isDark ? 'ring-slate-950' : 'ring-white'} animate-pulse`}>
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Search bar for Mobile/Tablet overlay block */}
      {showSearchInput && currentView === 'shop' && (
        <div className={`md:hidden border-t px-4 py-3 shadow-inner ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              autoFocus
              placeholder="Search design objects..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setSearch(e.target.value);
              }}
              className={`w-full rounded-lg border py-2 pl-4 pr-10 text-xs outline-none focus:bg-white ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white focus:border-purple-500' 
                  : 'border-slate-200 bg-slate-50 focus:border-indigo-400'
              }`}
            />
            {localSearch ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-2.5 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            )}
          </form>
        </div>
      )}
    </header>
  );
};;
