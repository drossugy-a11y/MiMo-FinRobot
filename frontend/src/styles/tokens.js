// MiMo-FinRobot Design Tokens
// Bloomberg Terminal-inspired professional financial platform

export const colors = {
  // Dark theme (primary)
  dark: {
    // Background hierarchy - warm blacks to reduce eye strain
    bg: {
      base: '#0a0e27',      // Main background - deep charcoal blue
      raised: '#12162a',    // Cards, panels
      inset: '#0d1120',     // Input fields, recessed areas
      overlay: 'rgba(10, 14, 39, 0.85)', // Modals, overlays
    },
    // Text hierarchy
    text: {
      primary: '#F5F5F7',   // Apple standard - warm white
      secondary: 'rgba(245, 245, 247, 0.6)',
      tertiary: 'rgba(245, 245, 247, 0.4)',
      inverse: '#0a0e27',
    },
    // Brand accent - single accent color per viewport
    accent: {
      primary: '#00d4aa',   // Teal green - brand color
      hover: '#00e6bb',
      muted: 'rgba(0, 212, 170, 0.15)',
    },
    // Data visualization colors
    data: {
      positive: '#00FF00',  // Profit/up - pure green
      negative: '#FF6666',  // Loss/down - soft red
      neutral: '#666666',
      warning: '#FFD700',
      info: '#4A9EFF',
    },
    // Borders and dividers
    border: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      default: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.16)',
    },
    // Shadows
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 2px 8px rgba(0, 0, 0, 0.3)',
      lg: '0 4px 16px rgba(0, 0, 0, 0.4)',
      glow: '0 0 20px rgba(0, 212, 170, 0.15)',
    },
  },
  // Light theme
  light: {
    bg: {
      base: '#F8F9FA',
      raised: '#FFFFFF',
      inset: '#F0F2F5',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#1a1a2e',
      secondary: 'rgba(26, 26, 46, 0.6)',
      tertiary: 'rgba(26, 26, 46, 0.4)',
      inverse: '#F5F5F7',
    },
    accent: {
      primary: '#00b894',
      hover: '#00d4aa',
      muted: 'rgba(0, 184, 148, 0.1)',
    },
    data: {
      positive: '#00a854',
      negative: '#ff4d4f',
      neutral: '#8c8c8c',
      warning: '#faad14',
      info: '#1677ff',
    },
    border: {
      subtle: 'rgba(0, 0, 0, 0.04)',
      default: 'rgba(0, 0, 0, 0.08)',
      strong: 'rgba(0, 0, 0, 0.12)',
    },
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
      md: '0 2px 8px rgba(0, 0, 0, 0.08)',
      lg: '0 4px 16px rgba(0, 0, 0, 0.12)',
      glow: '0 0 20px rgba(0, 184, 148, 0.1)',
    },
  },
}

// Typography scale
export const typography = {
  fontFamily: {
    heading: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    hero: '3rem',      // 48px
    h1: '2rem',        // 32px
    h2: '1.5rem',      // 24px
    h3: '1.25rem',     // 20px
    h4: '1rem',        // 16px
    body: '0.875rem',  // 14px
    caption: '0.75rem', // 12px
    tiny: '0.625rem',  // 10px
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
}

// Spacing scale (4px base)
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}

// Border radius
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
}

// Transitions
export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
  page: '150ms ease-in-out',
}

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
}

// Export everything as default
const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  transitions,
  zIndex,
}

export default tokens
