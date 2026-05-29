import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  plate: string;
  state?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { fs: 12, stateFs: 7,  px: 8,  py: 3,  radius: 4 },
  md: { fs: 16, stateFs: 9,  px: 10, py: 5,  radius: 6 },
  lg: { fs: 24, stateFs: 14, px: 16, py: 10, radius: 8 },
};

export function LicensePlate({ plate, state = 'NY', size = 'md' }: Props) {
  const s = SIZES[size];
  return (
    <View style={[styles.plate, { paddingHorizontal: s.px, paddingVertical: s.py, borderRadius: s.radius }]}>
      <Text style={[styles.state, { fontSize: s.stateFs }]}>{state}</Text>
      <View style={styles.divider} />
      <Text style={[styles.plateText, { fontSize: s.fs }]}>{plate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFCF5',
    borderWidth: 1.5,
    borderColor: '#15233A',
  },
  state: {
    color: '#15233A',
    fontWeight: '600',
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: '100%',
    minHeight: 16,
    backgroundColor: 'rgba(21,35,58,0.2)',
  },
  plateText: {
    color: '#15233A',
    fontWeight: '600',
    letterSpacing: 1,
  },
});
