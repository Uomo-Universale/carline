import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
}

const VARIANTS: Record<Variant, { bg: string; color: string; borderWidth?: number; borderColor?: string }> = {
  primary:   { bg: '#1F3A5F', color: '#FFFCF5' },
  accent:    { bg: '#E8A33D', color: '#3A2206' },
  secondary: { bg: '#FFFFFF', color: '#15233A', borderWidth: 1, borderColor: '#D8C9A8' },
  ghost:     { bg: 'transparent', color: '#15233A' },
  danger:    { bg: '#B83A2E', color: '#FFFCF5' },
  success:   { bg: '#2F6B5A', color: '#FFFCF5' },
};

const SIZES: Record<Size, { px: number; py: number; fs: number; minH: number; radius: number }> = {
  sm: { px: 14, py: 8,  fs: 14, minH: 36, radius: 10 },
  md: { px: 18, py: 12, fs: 15, minH: 44, radius: 14 },
  lg: { px: 22, py: 16, fs: 17, minH: 56, radius: 14 },
  xl: { px: 28, py: 22, fs: 20, minH: 72, radius: 20 },
};

export function Button({
  variant = 'primary', size = 'md', block = false,
  leading, trailing, disabled, loading, onPress, style, children,
}: Props) {
  const v = VARIANTS[variant];
  const s = SIZES[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.btn,
        {
          backgroundColor: v.bg,
          paddingHorizontal: s.px,
          paddingVertical: s.py,
          minHeight: s.minH,
          borderRadius: s.radius,
          borderWidth: v.borderWidth ?? 0,
          borderColor: v.borderColor ?? 'transparent',
          alignSelf: block ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.color} />
      ) : (
        <>
          {leading && <View style={styles.leading}>{leading}</View>}
          <Text style={[styles.label, { color: v.color, fontSize: s.fs }]}>{children}</Text>
          {trailing && <View style={styles.trailing}>{trailing}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  leading: { marginRight: 2 },
  trailing: { marginLeft: 2 },
});
