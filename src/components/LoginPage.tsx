/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../state/StoreContext';
import { getTheme } from '../utils/theme';
import { motion } from 'motion/react';
import { Lock, Mail, User, ShieldAlert, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, registerUser, settings, setView } = useStore();
  const theme = getTheme(settings.websiteTheme);

  const [isRegister, setIsRegister] = useState(false);
  const [showAutofill, setShowAutofill] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isDark = settings.websiteTheme === 'dark-obsidian';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);
    setIsLoading(true);

    setTimeout(() => {
      try {
        if (isRegister) {
          if (!name.trim()) {
            setErrorText('Full name is required for registration.');
            setIsLoading(false);
            return;
          }
          if (password.length < 6) {
            setErrorText('Password must be at least 6 characters for safety guarantees.');
            setIsLoading(false);
            return;
          }
          const res = registerUser(name, email, password);
          if (res.success) {
            setSuccessText(res.message);
            setTimeout(() => {
              setIsLoading(false);
              setView('shop');
            }, 1000);
          } else {
            setErrorText(res.message);
            setIsLoading(false);
          }
        } else {
          // Login
          const res = loginUser(email, password);
          if (res.success) {
            setSuccessText(res.message);
            setTimeout(() => {
              setIsLoading(false);
              if (res.role === 'admin' || res.role === 'super_admin') {
                setView('admin');
              } else {
                setView('shop');
              }
            }, 1000);
          } else {
            setErrorText(res.message);
            setIsLoading(false);
          }
        }
      } catch (err) {
        setErrorText('Verifying credential nodes failed. Standard error.');
        setIsLoading(false);
      }
    }, 500);
  };

  const handleAutofill = (role: 'super_admin' | 'admin' | 'customer') => {
    setErrorText(null);
    setIsRegister(false);
    if (role === 'super_admin') {
      setEmail('ganoniarbi@gmail.com');
      setPassword('ARB790874A');
    } else if (role === 'admin') {
      setEmail('admin@aetherobjects.co');
      setPassword('admin123');
    } else {
      setEmail('alexander@sterling-design.co');
      setPassword('customer123');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center min-h-[75vh]">
      {/* Back to Shop Navigation Shortcut */}
      <button
        onClick={() => setView('shop')}
        className="mb-8 flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        id="login-page-back-btn"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Catalog</span>
      </button>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`w-full max-w-lg rounded-3xl border shadow-xl overflow-hidden transition-all duration-300 ${
          isDark
            ? 'border-slate-800 bg-slate-900 text-slate-100'
            : 'border-slate-200 bg-white text-slate-900'
        }`}
        id="login-page-card"
      >
        {/* Custom Header with brand accents */}
        <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <span 
            onClick={() => setShowAutofill(!showAutofill)}
            className="inline-flex items-center space-x-1 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest text-indigo-300 uppercase cursor-pointer hover:bg-white/20 select-none transition-all"
            title="Click to toggle Sandbox Autofill Controls"
          >
            ⚙️ SECURED AES-256 GENERAL PORTAL {showAutofill ? '[CLICK TO HIDE AUTOFILL]' : '[CLICK TO SHOW AUTOFILL]'}
          </span>
          <h2 className="font-display text-xl md:text-2xl font-bold mt-2 uppercase tracking-wider text-[#F8FAFC]">
            {isRegister ? 'Account Synthesizer' : 'Secure Identification'}
          </h2>
          <p className="text-[12px] text-slate-400 leading-relaxed mt-1 font-sans">
            Connect securely to authenticate clearance, build tailored acquisitions drawers, or log admin panels.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Sandbox Credentials Quick-Fill Console */}
          {showAutofill && (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 animate-fade-in">
              <span className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                ⚙️ Sandbox Testing Autofill Controls
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleAutofill('customer')}
                  className={`rounded-lg py-2 px-2.5 text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 hover:bg-slate-55 text-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="block font-bold">Client</span>
                    <span className="text-[9.5px] font-mono opacity-70">alexander@... / customer...</span>
                  </div>
                  <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAutofill('admin')}
                  className={`rounded-lg py-2 px-2.5 text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="block font-bold">Standard Admin</span>
                    <span className="text-[9.5px] font-mono opacity-70">admin@aether... / admin...</span>
                  </div>
                  <KeyRound className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAutofill('super_admin')}
                  className={`rounded-lg py-2 px-2.5 text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-7a0'
                  }`}
                >
                  <div className="truncate mb-0.5">
                    <span className="block font-bold text-indigo-650 dark:text-indigo-400">⚡ Super Admin</span>
                    <span className="text-[9.5px] font-mono opacity-70">ganoniarbi@... / ARB...</span>
                  </div>
                  <Lock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Feedback alerts */}
          {errorText && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start space-x-2.5 animate-fade-in">
              <ShieldAlert className="h-4 w-4 mt-0.5 text-rose-600 flex-shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {successText && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-start space-x-2.5 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 flex-shrink-0" />
              <span>{successText}</span>
            </div>
          )}

          {/* Core Auth form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jouhan Arbi"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs outline-none transition-all ${
                      isDark
                        ? 'border-slate-800 bg-slate-950 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                        : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                  />
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Secure Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jouhanarbi@gmail.com"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs outline-none transition-all ${
                    isDark
                      ? 'border-slate-800 bg-slate-950 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs outline-none transition-all ${
                    isDark
                      ? 'border-slate-800 bg-slate-950 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-xl py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2 ${theme.accentBg} ${theme.accentHoverBg}`}
            >
              {isLoading ? (
                <span className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
                  <span>Verifying clearance keys...</span>
                </span>
              ) : (
                <span>{isRegister ? 'Synthesize Profile' : 'Verify Credentials'}</span>
              )}
            </button>
          </form>

          {/* Switch Register/Register status toggle */}
          <div className="text-center pt-4 border-t border-slate-150/40">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorText(null);
                setSuccessText(null);
              }}
              className={`text-xs font-bold underline underline-offset-4 hover:opacity-80 transition-opacity ${theme.accentText}`}
            >
              {isRegister
                ? 'Authorized already? Verify existing credentials'
                : 'Need clearance? Synthesize a client profile'
              }
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
