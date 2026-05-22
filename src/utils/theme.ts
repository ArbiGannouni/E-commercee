/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeStyles {
  backdrop: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  borderColor: string;
  accentText: string;
  accentBg: string;
  accentHoverBg: string;
  accentBorder: string;
  accentFadedBg: string;
  accentFadedText: string;
  accentRing: string;
  accentBorderFocus: string;
}

export const THEME_MAP: Record<string, ThemeStyles> = {
  'neutral-slate': {
    backdrop: 'bg-slate-50',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    cardBg: 'bg-white',
    borderColor: 'border-slate-200',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-600',
    accentHoverBg: 'hover:bg-indigo-700',
    accentBorder: 'border-indigo-600',
    accentFadedBg: 'bg-indigo-50/70',
    accentFadedText: 'text-indigo-700',
    accentRing: 'focus:ring-indigo-500',
    accentBorderFocus: 'focus:border-indigo-500'
  },
  'dark-obsidian': {
    backdrop: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    cardBg: 'bg-slate-900',
    borderColor: 'border-slate-800',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-650',
    accentHoverBg: 'hover:bg-purple-700',
    accentBorder: 'border-purple-600',
    accentFadedBg: 'bg-purple-950/45',
    accentFadedText: 'text-purple-300',
    accentRing: 'focus:ring-purple-500',
    accentBorderFocus: 'focus:border-purple-500'
  },
  'nordic-forest': {
    backdrop: 'bg-[#FAF9F5]',
    textPrimary: 'text-emerald-950',
    textSecondary: 'text-emerald-800/60',
    cardBg: 'bg-white',
    borderColor: 'border-emerald-100',
    accentText: 'text-emerald-700',
    accentBg: 'bg-emerald-700',
    accentHoverBg: 'hover:bg-emerald-850',
    accentBorder: 'border-emerald-700',
    accentFadedBg: 'bg-emerald-50/70',
    accentFadedText: 'text-emerald-800',
    accentRing: 'focus:ring-emerald-500',
    accentBorderFocus: 'focus:border-emerald-700'
  },
  'royal-bronze': {
    backdrop: 'bg-[#FAF6EE]',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-500',
    cardBg: 'bg-white',
    borderColor: 'border-amber-100/60',
    accentText: 'text-amber-805',
    accentBg: 'bg-amber-700',
    accentHoverBg: 'hover:bg-amber-800',
    accentBorder: 'border-amber-700',
    accentFadedBg: 'bg-amber-50/70',
    accentFadedText: 'text-amber-900',
    accentRing: 'focus:ring-amber-600',
    accentBorderFocus: 'focus:border-amber-600'
  },
  'crimson-velvet': {
    backdrop: 'bg-[#FAF6F6]',
    textPrimary: 'text-zinc-850',
    textSecondary: 'text-zinc-500',
    cardBg: 'bg-white',
    borderColor: 'border-rose-100',
    accentText: 'text-rose-700',
    accentBg: 'bg-rose-700',
    accentHoverBg: 'hover:bg-rose-800',
    accentBorder: 'border-rose-700',
    accentFadedBg: 'bg-rose-50/70',
    accentFadedText: 'text-rose-800',
    accentRing: 'focus:ring-rose-500',
    accentBorderFocus: 'focus:border-rose-500'
  },
  'sand-carthage': {
    backdrop: 'bg-[#FDFBF7]',
    textPrimary: 'text-amber-950',
    textSecondary: 'text-amber-900/60',
    cardBg: 'bg-white',
    borderColor: 'border-[#F5ECE1]',
    accentText: 'text-[#C05C36]',
    accentBg: 'bg-[#C05C36]',
    accentHoverBg: 'hover:bg-[#A04522]',
    accentBorder: 'border-[#C05C36]',
    accentFadedBg: 'bg-[#FBF2E6]',
    accentFadedText: 'text-[#C05C36]',
    accentRing: 'focus:ring-[#C05C36]',
    accentBorderFocus: 'focus:border-[#C05C36]'
  },
  'dreamy-lavender': {
    backdrop: 'bg-[#FAF9FF]',
    textPrimary: 'text-indigo-950',
    textSecondary: 'text-indigo-800/60',
    cardBg: 'bg-white',
    borderColor: 'border-indigo-100/70',
    accentText: 'text-[#8B5CF6]',
    accentBg: 'bg-[#8B5CF6]',
    accentHoverBg: 'hover:bg-[#7C3AED]',
    accentBorder: 'border-[#8B5CF6]',
    accentFadedBg: 'bg-[#F5F3FF]',
    accentFadedText: 'text-[#6D28D9]',
    accentRing: 'focus:ring-[#8B5CF6]',
    accentBorderFocus: 'focus:border-[#8B5CF6]'
  }
};

export function getTheme(themeName?: string): ThemeStyles {
  return THEME_MAP[themeName || 'neutral-slate'] || THEME_MAP['neutral-slate'];
}
