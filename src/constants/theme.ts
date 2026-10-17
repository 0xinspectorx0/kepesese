export const Theme = {
  colors: {
    background: '#F8F9FE',
    card: '#FFFFFF',
    textMain: '#2D3436',
    textSecondary: '#636E72',
    textMuted: '#95A5A6',
    border: '#EBF0F5',
    
    // Primary Soft Colors
    primary: '#6C5CE7', // Soft Lavender Violet
    primaryLight: '#F0EEFF',
    secondary: '#00B894', // Soft Mint / Sage
    secondaryLight: '#E6F9F5',
    
    // Status Soft Colors
    success: '#10B981',
    successLight: '#D1FAE5',
    error: '#FF6B6B',
    errorLight: '#FFEEEE',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // Subject Soft Accent Colors
    tarih: { main: '#E056FD', light: '#FBE8FF', border: '#F0B3FF' }, // Soft Violet
    cografya: { main: '#0984E3', light: '#E3F2FD', border: '#90CAF9' }, // Soft Blue
    vatandashk: { main: '#D63031', light: '#FFEEEF', border: '#FFB3B6' }, // Soft Crimson
    turkce: { main: '#00B894', light: '#E6F9F5', border: '#A3EAD8' }, // Soft Mint
    matematik: { main: '#F0932B', light: '#FFF4E5', border: '#FFC88B' }, // Soft Warm Orange
    guncel: { main: '#6C5CE7', light: '#F0EEFF', border: '#C4BCF6' }, // Soft Purple
  },

  subjectColors: {
    Tarih: { main: '#8E44AD', light: '#F4ECF7', badgeText: '#6C3483' },
    Coğrafya: { main: '#2980B9', light: '#EBF5FB', badgeText: '#1B4F72' },
    Vatandaşlık: { main: '#C0392B', light: '#FDEDEC', badgeText: '#78281F' },
    Türkçe: { main: '#27AE60', light: '#E8F8F5', badgeText: '#145A32' },
    Matematik: { main: '#D35400', light: '#FBEEE6', badgeText: '#6E2C00' },
    'Güncel Bilgiler': { main: '#6C5CE7', light: '#F0EEFF', badgeText: '#4A3B9F' },
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 18,
    xl: 24,
    round: 999,
  },

  shadows: {
    soft: {
      shadowColor: '#6C5CE7',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 3,
    },
    card: {
      shadowColor: '#1E293B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    elevated: {
      shadowColor: '#475569',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};
