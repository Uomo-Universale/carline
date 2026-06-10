import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { useStore } from '../../store';
import type { PickupType } from '../../models';

const TYPE_FILTERS: { key: string; label: string; icon: string; type?: PickupType }[] = [
  { key: 'All',   label: 'All',     icon: '📋' },
  { key: 'Car',   label: 'Carline', icon: '🚗', type: 'carline' },
  { key: 'Walk',  label: 'Walk-in', icon: '🚶', type: 'walkin'  },
  { key: 'Bus',   label: 'Bus',     icon: '🚌', type: 'bus'     },
  { key: 'Early', label: 'Early',   icon: '🕐', type: 'early'   },
];

const TYPE_COLORS: Record<string, string> = {
  carline: '#E8A33D',
  walkin:  '#2A6FA3',
  bus:     '#5A3A8A',
  early:   '#2F6B5A',
};

export function StaffReportingScreen() {
  const { queue } = useStore();
  const [typeFilter, setTypeFilter] = useState('All');

  const selectedType = TYPE_FILTERS.find(t => t.key === typeFilter)?.type;

  const allReleased = queue.filter(e => e.status === 'released');
  const inProgress  = queue.filter(e => e.status !== 'released');

  const filtered = selectedType
    ? allReleased.filter(e => e.pickupType === selectedType)
    : allReleased;

  const countFor = (type: PickupType) =>
    allReleased.filter(e => e.pickupType === type).length;

  const inProgressFor = (type: PickupType) =>
    inProgress.filter(e => e.pickupType === type).length;

  const SUMMARY = [
    { type: 'carline' as PickupType, icon: '🚗', label: 'Carline' },
    { type: 'walkin'  as PickupType, icon: '🚶', label: 'Walk-in' },
    { type: 'bus'     as PickupType, icon: '🚌', label: 'Bus'     },
    { type: 'early'   as PickupType, icon: '🕐', label: 'Early'   },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />

      <ScrollView stickyHeaderIndices={[1]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Today's report</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalNum}>{allReleased.length}</Text>
            <Text style={styles.totalLabel}>released</Text>
          </View>
        </View>

        {/* Summary cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            {SUMMARY.map(s => (
              <View key={s.type} style={styles.summaryCard}>
                <Text style={styles.summaryIcon}>{s.icon}</Text>
                <Text style={[styles.summaryCount, { color: TYPE_COLORS[s.type] }]}>
                  {countFor(s.type)}
                </Text>
                <Text style={styles.summaryLabel}>{s.label}</Text>
                {inProgressFor(s.type) > 0 && (
                  <Text style={styles.summaryPending}>+{inProgressFor(s.type)} pending</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Reconciliation notice */}
        <View style={styles.reconcileBox}>
          <Text style={styles.reconcileTitle}>Reconciliation</Text>
          <Text style={styles.reconcileText}>
            {allReleased.length} of {queue.length} students dismissed.
            {inProgress.length > 0
              ? ` ${inProgress.length} still in progress.`
              : ' All students accounted for.'}
          </Text>
        </View>

        {/* Filter row */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterWrap}>
            {TYPE_FILTERS.map(t => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setTypeFilter(t.key)}
                style={[styles.filterChip, typeFilter === t.key && styles.filterChipActive]}
              >
                <Text style={styles.filterIcon}>{t.icon}</Text>
                <Text style={[styles.filterText, typeFilter === t.key && styles.filterTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Released list */}
        <View style={styles.listSection}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No dismissed students yet</Text>
            </View>
          ) : (
            filtered.map((entry, idx) => (
              <View key={entry.requestId + entry.studentId} style={styles.listRow}>
                <View style={styles.listNum}>
                  <Text style={styles.listNumText}>{idx + 1}</Text>
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{entry.studentId}</Text>
                  <Text style={styles.listTime}>{entry.arrivedAt}</Text>
                </View>
                <View style={[styles.listTypeBadge, { backgroundColor: (TYPE_COLORS[entry.pickupType ?? 'carline'] ?? '#7A8699') + '22' }]}>
                  <Text style={styles.listTypeIcon}>
                    {entry.pickupType === 'bus' ? '🚌' : entry.pickupType === 'walkin' ? '🚶' : entry.pickupType === 'early' ? '🕐' : '🚗'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF5EA' },

  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 16 },
  headerTitle: { flex: 1, fontSize: 24, fontWeight: '700', color: '#15233A', letterSpacing: -0.4 },
  totalBadge: { alignItems: 'center', backgroundColor: '#15233A', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6 },
  totalNum: { fontSize: 22, fontWeight: '800', color: '#E8A33D' },
  totalLabel: { fontSize: 10, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },

  summarySection: { backgroundColor: '#FBF5EA', paddingHorizontal: 16, paddingBottom: 16 },
  summaryGrid: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1, alignItems: 'center', gap: 2,
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#ECE0C8',
    paddingVertical: 14,
  },
  summaryIcon: { fontSize: 20 },
  summaryCount: { fontSize: 26, fontWeight: '800' },
  summaryLabel: { fontSize: 11, fontWeight: '600', color: '#7A8699' },
  summaryPending: { fontSize: 10, color: '#E8A33D', fontWeight: '600' },

  reconcileBox: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: '#E5EAF1', borderRadius: 14,
    borderWidth: 1, borderColor: '#C8D5E6',
    padding: 14,
  },
  reconcileTitle: { fontSize: 13, fontWeight: '700', color: '#15233A', marginBottom: 4 },
  reconcileText: { fontSize: 13, color: '#3B4A66', lineHeight: 18 },

  filterSection: { backgroundColor: '#FBF5EA', paddingBottom: 10 },
  filterWrap: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 20,
  },
  filterChipActive: { backgroundColor: '#15233A', borderColor: '#15233A' },
  filterIcon: { fontSize: 13 },
  filterText: { fontSize: 13, fontWeight: '600', color: '#3B4A66' },
  filterTextActive: { color: '#FFFFFF' },

  listSection: { paddingHorizontal: 16, paddingBottom: 32, gap: 0 },
  listRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#ECE0C8',
  },
  listNum: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#ECE0C8', alignItems: 'center', justifyContent: 'center',
  },
  listNumText: { fontSize: 13, fontWeight: '700', color: '#7A8699' },
  listInfo: { flex: 1 },
  listName: { fontSize: 15, fontWeight: '600', color: '#15233A' },
  listTime: { fontSize: 12, color: '#7A8699', marginTop: 2 },
  listTypeBadge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  listTypeIcon: { fontSize: 16 },

  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#7A8699' },
});
