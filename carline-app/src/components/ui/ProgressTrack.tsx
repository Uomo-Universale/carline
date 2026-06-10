import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PickupStatus } from '../../models';

const STATUS_ORDER: PickupStatus[] = ['arrived', 'called', 'released'];
const STATUS_DOTS: Record<string, string> = {
  arrived:   '#E8A33D',
  called:    '#C97A1F',
  released:  '#2F6B5A',
};
const STATUS_LABELS: Record<string, { title: string; sub: string }> = {
  arrived:   { title: 'Arrived',    sub: 'Your car is in line' },
  called:    { title: 'Called out', sub: 'Your child is on their way to the curb' },
  released:  { title: 'Released',   sub: 'Your child is in your car. Drive safe!' },
};

interface Props {
  status: PickupStatus;
  layout?: 'horizontal' | 'vertical';
}

export function ProgressTrack({ status, layout = 'horizontal' }: Props) {
  const idx = STATUS_ORDER.indexOf(status);

  if (layout === 'vertical') {
    return (
      <View style={styles.verticalTrack}>
        {STATUS_ORDER.map((s, i) => {
          const reached = i <= idx;
          const active = i === idx;
          return (
            <View key={s} style={styles.verticalItem}>
              <View style={styles.verticalLeft}>
                <View style={[
                  styles.verticalDot,
                  { backgroundColor: reached ? STATUS_DOTS[s] : '#FFFFFF', borderWidth: reached ? 0 : 2, borderColor: '#D8C9A8' },
                  active && styles.activeDot,
                ]}>
                  {reached && (
                    <View style={styles.checkMark}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </View>
                {i < STATUS_ORDER.length - 1 && (
                  <View style={[styles.verticalLine, { backgroundColor: reached ? STATUS_DOTS[s] : '#D8C9A8' }]} />
                )}
              </View>
              <View style={styles.verticalContent}>
                <Text style={[styles.verticalTitle, { color: reached ? '#15233A' : '#7A8699', fontWeight: active ? '700' : '600' }]}>
                  {STATUS_LABELS[s].title}
                </Text>
                <Text style={styles.verticalSub}>{STATUS_LABELS[s].sub}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.horizontalTrack}>
      {STATUS_ORDER.map((s, i) => (
        <View
          key={s}
          style={[
            styles.horizontalSegment,
            { backgroundColor: i <= idx ? STATUS_DOTS[s] : '#F5EBD7' },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalTrack: {
    flexDirection: 'row',
    gap: 6,
  },
  horizontalSegment: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },
  verticalTrack: {
    gap: 0,
  },
  verticalItem: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  verticalLeft: {
    alignItems: 'center',
    width: 32,
  },
  verticalDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    shadowColor: '#E8A33D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  verticalLine: {
    width: 2,
    height: 36,
  },
  checkMark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  verticalContent: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 18,
  },
  verticalTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  verticalSub: {
    fontSize: 13,
    color: '#7A8699',
    marginTop: 2,
    lineHeight: 18,
  },
});
