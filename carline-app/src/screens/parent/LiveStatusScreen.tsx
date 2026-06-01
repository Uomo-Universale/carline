import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Animated, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProgressTrack } from '../../components/ui/ProgressTrack';
import { Button } from '../../components/ui/Button';
import { dataSource } from '../../data/provider';
import type { PickupStatus } from '../../models';

const STATUS_COPY: Record<PickupStatus, { headline: string; body: string; icon: string }> = {
  requested: { headline: 'We told the school', body: 'Office sees your request. Pull into the carline when you arrive.', icon: '🕐' },
  arrived:   { headline: "You're in the queue", body: 'Position 4 of 7. Your child\'s teacher has been notified.', icon: '🚗' },
  called:    { headline: 'Your child is coming out', body: 'Their teacher is walking them to the curb now.', icon: '📣' },
  released:  { headline: 'Your child is in your car', body: 'Drive safe! Have a great evening.', icon: '✅' },
};

const BG_COLORS: Record<PickupStatus, string> = {
  requested: '#FBF5EA',
  arrived:   '#FBF5EA',
  called:    '#F8E0BF',
  released:  '#DCEBE3',
};

export function LiveStatusScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { requestId } = route.params ?? {};
  const [status, setStatus] = useState<PickupStatus>('requested');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!requestId) return;
    const unsub = dataSource.subscribeToRequestStatus(requestId, setStatus);
    return unsub;
  }, [requestId]);

  useEffect(() => {
    if (status === 'released') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [status]);

  const copy = STATUS_COPY[status];
  const dotColor = {
    requested: '#7A8699',
    arrived:   '#E8A33D',
    called:    '#C97A1F',
    released:  '#2F6B5A',
  }[status];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: BG_COLORS[status] }]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG_COLORS[status]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerLabel}>Live</Text>
          <Text style={styles.headerTitle}>Pickup in progress</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      {/* Status hero */}
      <View style={styles.hero}>
        {status !== 'released' && (
          <Animated.View
            style={[
              styles.pulseRing,
              { borderColor: dotColor + '66', transform: [{ scale: pulseAnim }] },
            ]}
          />
        )}
        <View style={[styles.statusCircle, { backgroundColor: dotColor + '22' }]}>
          <View style={[styles.statusInner, { backgroundColor: dotColor }]}>
            <Text style={styles.statusIcon}>{copy.icon}</Text>
          </View>
        </View>
        <Text style={styles.headline}>{copy.headline}</Text>
        <Text style={styles.body}>{copy.body}</Text>
      </View>

      {/* Progress track */}
      <View style={styles.track}>
        <ProgressTrack status={status} layout="vertical" />
      </View>

      {/* Action */}
      <View style={styles.footer}>
        {status === 'released' ? (
          <Button variant="primary" size="lg" block onPress={() => navigation.goBack()}>Done</Button>
        ) : (
          <>
            <Button variant="secondary" size="lg" block>Message the office</Button>
            {(status === 'requested' || status === 'arrived') && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={async () => {
                  if (requestId) await dataSource.cancelPickupRequest(requestId);
                  navigation.goBack();
                }}
              >
                <Text style={styles.cancelText}>Cancel pickup</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingBottom: 8,
  },
  closeBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 18, color: '#15233A' },
  headerLabel: { fontSize: 11, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.6 },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#15233A', letterSpacing: -0.3 },

  hero: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20 },
  pulseRing: {
    position: 'absolute',
    width: 148, height: 148, borderRadius: 74,
    borderWidth: 3,
  },
  statusCircle: {
    width: 132, height: 132, borderRadius: 66,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  statusInner: {
    width: 92, height: 92, borderRadius: 46,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#15233A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 28,
  },
  statusIcon: { fontSize: 40 },
  headline: { fontSize: 30, fontWeight: '700', color: '#15233A', letterSpacing: -0.5, textAlign: 'center' },
  body: { fontSize: 16, color: '#3B4A66', marginTop: 8, textAlign: 'center', lineHeight: 22, paddingHorizontal: 12 },

  track: { paddingHorizontal: 24, flex: 1 },
  footer: { padding: 20, paddingBottom: 32, gap: 8 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#A04040' },
});
