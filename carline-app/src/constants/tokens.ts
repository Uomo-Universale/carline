// CarLine design tokens — ported from tokens.css
// DO NOT edit hex values without updating the design system reference.

export const colors = {
  // Neutrals
  bg: '#FBF5EA',
  bgDeep: '#F5EBD7',
  surface: '#FFFFFF',
  surface2: '#FFFCF5',
  border: '#ECE0C8',
  borderStrong: '#D8C9A8',
  ink: '#15233A',
  inkSoft: '#3B4A66',
  inkMuted: '#7A8699',
  inkInverse: '#FFFCF5',

  // Brand & signal
  primary: '#1F3A5F',
  primaryPress: '#15263F',
  primarySoft: '#E5EAF1',
  accent: '#E8A33D',
  accentPress: '#C9871F',
  accentSoft: '#FBE9C7',

  // Semantic
  success: '#2F6B5A',
  successSoft: '#DCEBE3',
  warning: '#C97A1F',
  warningSoft: '#F8E0BF',
  danger: '#B83A2E',
  dangerSoft: '#F5D9D2',
  info: '#2A6FA3',
  infoSoft: '#DCEAF4',

  // Status chip tokens
  statusRequestedFg: '#3B4A66',
  statusRequestedBg: '#E7E2D4',
  statusArrivedFg: '#7A4A0E',
  statusArrivedBg: '#FBE9C7',
  statusCalledFg: '#FFFCF5',
  statusCalledBg: '#C97A1F',
  statusReleasedFg: '#FFFCF5',
  statusReleasedBg: '#2F6B5A',
};

export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
  s16: 64,
  s20: 80,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const hitTargets = {
  comfort: 56,  // Parent in-car primary
  default: 44,  // iOS HIG minimum
  staff: 72,    // Staff outdoors tablet
};

export const shadows = {
  sm: {
    shadowColor: '#15233A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#15233A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: '#15233A',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 8,
  },
};

export const avatarTints = [
  { bg: '#FBE9C7', fg: '#7A4A0E' },
  { bg: '#DCEBE3', fg: '#1F5547' },
  { bg: '#E5EAF1', fg: '#1F3A5F' },
  { bg: '#F5D9D2', fg: '#7C2418' },
  { bg: '#E7E2D4', fg: '#3B4A66' },
];
