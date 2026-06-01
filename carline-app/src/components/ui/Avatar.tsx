import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { avatarTints } from '../../constants/tokens';

interface Props {
  name: string;
  size?: number;
  tint?: number;
}

export function Avatar({ name, size = 40, tint }: Props) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  const i = ((tint != null ? tint : (name.charCodeAt(0) + name.length)) % avatarTints.length + avatarTints.length) % avatarTints.length || 0;
  const t = avatarTints[i] ?? avatarTints[0];

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.fg, fontSize: size * 0.4 }]}>{initials || '•'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
