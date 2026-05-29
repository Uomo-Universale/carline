import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
  padding?: number;
  elev?: 0 | 1 | 2;
  style?: object;
}

export function Card({ children, padding = 20, elev = 1, style }: Props) {
  return (
    <View style={[styles.card, elev === 0 ? styles.flat : elev === 2 ? styles.raised : styles.default, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE0C8',
    borderRadius: 20,
  },
  flat: {},
  default: {
    shadowColor: '#15233A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  raised: {
    shadowColor: '#15233A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
});
