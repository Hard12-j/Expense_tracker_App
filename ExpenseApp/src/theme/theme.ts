import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Android Material & Dark Theme colors
    primary: '#2563EB', // Android Vibrant Blue
    primaryVariant: '#1D4ED8',
    secondary: '#7C3AED', // Android Violet
    accent: '#38BDF8', // Cyan accent

    // Backgrounds (AMOLED & Material Dark)
    background: {
      primary: '#0F1117', // Material 3 Dark Base
      secondary: '#161922', // Surface Container
      tertiary: '#1E2230', // Elevated Surface
    },

    // Surface colors
    surface: {
      primary: '#1A1D27',
      secondary: '#222634',
      elevated: '#2A2F40',
      card: '#161922',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
    },

    // Text colors
    text: {
      primary: '#F3F4F6', // High emphasis (87%+)
      secondary: '#9CA3AF', // Medium emphasis (60%)
      tertiary: '#6B7280', // Low emphasis (38%)
      accent: '#38BDF8',
      muted: '#4B5563',
    },

    // Status colors (Material Status)
    status: {
      success: '#10B981', // Material Emerald
      warning: '#F59E0B', // Material Amber
      error: '#EF4444', // Material Red
      info: '#3B82F6', // Material Blue
    },

    // Category vibrant colors
    categories: {
      Shopping: '#F43F5E',
      Dining: '#F59E0B',
      Transport: '#8B5CF6',
      Entertainment: '#EC4899',
      Utilities: '#06B6D4',
      Groceries: '#10B981',
      Health: '#EF4444',
      General: '#3B82F6',
    },

    // Gradients
    gradients: {
      primary: ['#2563EB', '#7C3AED'] as const,
      success: ['#10B981', '#059669'] as const,
      warning: ['#F59E0B', '#EF4444'] as const,
      dark: ['#161922', '#222634'] as const,
    },

    // Android ripple configuration
    ripple: {
      light: { color: 'rgba(255, 255, 255, 0.12)', borderless: false },
      primary: { color: 'rgba(37, 99, 235, 0.25)', borderless: false },
    },

    // Android elevation & effects
    effects: {
      elevation: {
        none: 0,
        low: 2,
        medium: 4,
        high: 8,
      },
    },
  },

  typography: {
    fontFamily: {
      sans: Platform.select({ android: 'sans-serif', default: 'System' }),
      medium: Platform.select({ android: 'sans-serif-medium', default: 'System' }),
      mono: Platform.select({ android: 'monospace', default: 'Menlo' }),
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 15,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 34,
    },
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
} as const;

export type Theme = typeof theme;
