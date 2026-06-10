import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PickupStatus } from '../../models';

const STATUS_MAP: Record<string, { label: string; fg: string; bg: string; dot: string }> = {
  arrived:   { label: 'Arrived',    fg: '#7A4A0E', bg: '#FBE9C7', dot: '#E8A33D' },
  called:    { label: 'Called out', fg: '#FFFCF5', bg: '#C97A1F', dot: '#C97A1F' },
  released:  { label: 'Released',   fg: '#FFFCF5', bg: '#2F6B5A', dot: '#2F6B5A' },
  none:      { label: 'Not yet',    fg: '#7A8699', bg: '#F1EADA', dot: '#BFB39A' },
};

interface Props {
  status: PickupStatus | 'none';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusChip({ status = 'arrived', size = 'md' }: Props) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.arrived;
  const sz = {
    sm: { px: 8,  py: 3,  fs: 11, dot: 6 },
    md: { px: 10, py: 5,  fs: 13, dot: 8 },
    lg: { px: 14, py: 8,  fs: 16, dot: 10 },
  }[size];

  return (
    <View style={[styles.chip, { backgroundColor: s.bg, paddingHorizontal: sz.px, paddingVertical: sz.py }]}>
      <View style={[styles.dot, { width: sz.dot, height: sz.dot, backgroundColor: s.dot }]} />
      <Text style={[styles.label, { color: s.fg, fontSize: sz.fs }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
  },
  dot: {
    borderRadius: 999,
  },
  label: {
    fontFamily: 'System',
    fontWeight: '500',
  },
});
