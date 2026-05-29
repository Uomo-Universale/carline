import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { avatarTints } from '../../constants/tokens';

interface Props {
  initial: string;
  tintIndex?: number;
  size?: number;
}

export function KidPortrait({ initial, tintIndex = 0, size = 48 }: Props) {
  const t = avatarTints[tintIndex % avatarTints.length];
  return (
    <View style={[styles.portrait, { width: size, height: size, borderRadius: size / 2, backgroundColor: t.bg }]}>
      <Text style={[styles.initial, { color: t.fg, fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  portrait: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontWeight: '700',
  },
});
