import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, ScrollView, FlatList,
} from 'react-native';
import { useStore } from '../../store';
import { dataSource } from '../../data/provider';
import type { QueueEntry, PickupType, Student, Guardian, Vehicle } from '../../models';

type AuditRow = QueueEntry & {
  student?: Student | null;
  guardian?: Guardian | null;
  vehicle?: Vehicle | null;
};

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

const TYPE_ICON: Record<string, string> = {
  carline: '🚗',
  walkin:  '🚶',
  bus:     '🚌',
  early:   '🕐',
};

export function StaffReportingScreen() {
  const { queue } = useStore();
  const [typeFilter, setTypeFilter] = useState('All');
  const [rows, setRows] = useState<AuditRow[]>([]);

  useEffect(() => {
    let mounted = true;
    const enrich = async () => {
      const released = queue.filter(e => e.status === 'released');
      const enriched: AuditRow[] = await Promise.all(
        released.map(async entry => {
          const [student, guardian, vehicle] = await Promise.all([
            dataSource.getStudentById(entry.studentId),
            entry.guardianId ? dataSource.getGuardianById(entry.guardianId) : Promise.resolve(null),
            entry.vehicleId  ? dataSource.getVehicleById(entry.vehicleId)  : Promise.resolve(null),
          ]);
          return { ...entry, student, guardian, vehicle };
        })
      );
      // Sort by release time descending (most recent first)
      enriched.sort((a, b) => (b.releasedAt ?? b.arrivedAt).localeCompare(a.releasedAt ?? a.arrivedAt));
      if (mounted) setRows(enriched);
    };
    enrich();
    return () => { mounted = false; };
  }, [queue]);

  const allReleased  = queue.filter(e => e.status === 'released');
  const inProgress   = queue.filter(e => e.status !== 'released');
  const selectedType = TYPE_FILTERS.find(t => t.key === typeFilter)?.type;
  const filtered     = selectedType ? rows.filter(r => r.pickupType === selectedType) : rows;

  const countFor       = (type: PickupType) => allReleased.filter(e => e.pickupType === type).length;
  const inProgressFor  = (type: PickupType) => inProgress.filter(e => e.pickupType === type).length;

  const SUMMARY = [
    { type: 'carline' as PickupType, icon: '🚗', label: 'Carline' },
    { type: 'walkin'  as PickupType, icon: '🚶', label: 'Walk-in' },
    { type: 'bus'     as PickupType, icon: '🚌', label: 'Bus'     },
    { type: 'early'   as PickupType, icon: '🕐', label: 'Early'   },
  ];

  const renderRow = ({ item: r, index }: { item: AuditRow; index: number }) => {
    const typeColor = TYPE_COLORS[r.pickupType ?? 'carline'] ?? '#7A8699';
    const typeIcon  = TYPE_ICON[r.pickupType ?? 'carline'] ?? '🚗';
    const pickupBy  = r.pickupPerson ?? (r.guardian ? `${r.guardian.firstName} ${r.guardian.lastName}` : null);
    const isManual  = !!r.pickupPerson;

    return (
      <View style={styles.auditRow}>
        {/* Index + type column */}
        <View style={styles.auditLeft}>
          <Text style={styles.auditIndex}>{index + 1}</Text>
          <View style={[styles.auditTypePill, { backgroundColor: typeColor + '22' }]}>
            <Text style={styles.auditTypeIcon}>{typeIcon}</Text>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.auditMain}>
          {/* Student name + grade */}
          <View style={styles.auditNameRow}>
            <Text style={styles.auditName}>
              {r.student ? `${r.student.firstName} ${r.student.lastName}` : r.studentId}
            </Text>
            {r.student && (
              <Text style={styles.auditGrade}>{r.student.grade} · {r.student.homeroom}</Text>
            )}
          </View>

          {/* Pickup person */}
          {pickupBy && (
            <View style={styles.auditPickupRow}>
              <Text style={styles.auditPickupIcon}>{isManual ? '👤' : '👨‍👩‍👧'}</Text>
              <Text style={styles.auditPickupName}>{pickupBy}</Text>
              {isManual && (
                <View style={styles.staffBadge}>
                  <Text style={styles.staffBadgeText}>Staff</Text>
                </View>
              )}
            </View>
          )}

          {/* Vehicle info */}
          {r.vehicle ? (
            <View style={styles.auditVehicleRow}>
              <View style={[styles.colorDot, { backgroundColor: r.vehicle.colorHex }]} />
              <Text style={styles.auditVehicleText}>
                {r.vehicle.color} {r.vehicle.make} {r.vehicle.model}
              </Text>
              <View style={styles.platePill}>
                <Text style={styles.plateText}>{r.vehicle.plate}</Text>
              </View>
            </View>
          ) : r.manualPlate ? (
            <View style={styles.auditVehicleRow}>
              <Text style={styles.auditVehicleText}>Plate:</Text>
              <View style={styles.platePill}>
                <Text style={styles.plateText}>{r.manualPlate}</Text>
              </View>
            </View>
          ) : r.busPlate ? (
            <View style={styles.auditVehicleRow}>
              <Text style={styles.auditVehicleText}>🚌 Bus {r.busPlate}</Text>
            </View>
          ) : null}
        </View>

        {/* Time column */}
        <View style={styles.auditRight}>
          <Text style={styles.auditReleasedTime}>{r.releasedAt ?? r.arrivedAt}</Text>
          <Text style={styles.auditTimeLabel}>released</Text>
          {r.releasedAt && (
            <Text style={styles.auditArrivedTime}>arr. {r.arrivedAt}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Today's report</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalNum}>{allReleased.length}</Text>
          <Text style={styles.totalLabel}>released</Text>
        </View>
      </View>

      {/* Summary cards */}
      <View style={styles.summaryGrid}>
        {SUMMARY.map(s => (
          <View key={s.type} style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>{s.icon}</Text>
            <Text style={[styles.summaryCount, { color: TYPE_COLORS[s.type] }]}>
              {countFor(s.type)}
            </Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
            {inProgressFor(s.type) > 0 && (
              <Text style={styles.summaryPending}>+{inProgressFor(s.type)}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Reconciliation notice */}
      <View style={[
        styles.reconcileBox,
        inProgress.length === 0 && styles.reconcileBoxGreen,
      ]}>
        <Text style={styles.reconcileText}>
          {inProgress.length === 0
            ? `✓  All ${allReleased.length} students accounted for`
            : `${allReleased.length} released · ${inProgress.length} still in progress — check Queue tab`}
        </Text>
      </View>

      {/* Filter row */}
      <View style={styles.filterRow}>
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
      </View>

      {/* Audit log */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No dismissed students yet</Text>
          <Text style={styles.emptySub}>Released entries will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={r => r.requestId + r.studentId}
          renderItem={renderRow}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF5EA' },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: 20, paddingBottom: 14,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#15233A', letterSpacing: -0.4 },
  headerDate: { fontSize: 13, color: '#7A8699', marginTop: 2 },
  totalBadge: {
    alignItems: 'center', backgroundColor: '#15233A',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
  },
  totalNum: { fontSize: 26, fontWeight: '800', color: '#E8A33D', lineHeight: 30 },
  totalLabel: { fontSize: 10, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },

  summaryGrid: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  summaryCard: {
    flex: 1, alignItems: 'center', gap: 1,
    backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1, borderColor: '#ECE0C8', paddingVertical: 12,
  },
  summaryIcon: { fontSize: 18 },
  summaryCount: { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  summaryLabel: { fontSize: 10, fontWeight: '600', color: '#7A8699' },
  summaryPending: { fontSize: 9, color: '#E8A33D', fontWeight: '700', marginTop: 1 },

  reconcileBox: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#E5EAF1', borderRadius: 12,
    borderWidth: 1, borderColor: '#C8D5E6',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  reconcileBoxGreen: { backgroundColor: '#E0EDE7', borderColor: '#A8D4BA' },
  reconcileText: { fontSize: 13, fontWeight: '600', color: '#15233A' },

  filterRow: {
    flexDirection: 'row', flexShrink: 0, flexWrap: 'wrap', gap: 6,
    paddingHorizontal: 16, marginBottom: 12,
  },
  filterChip: {
    height: 34, flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 17,
  },
  filterChipActive: { backgroundColor: '#15233A', borderColor: '#15233A' },
  filterIcon: { fontSize: 12 },
  filterText: { fontSize: 12, fontWeight: '600', color: '#3B4A66' },
  filterTextActive: { color: '#FFFFFF' },

  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 0 },

  auditRow: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#ECE0C8',
  },
  auditLeft: { alignItems: 'center', gap: 6, width: 32 },
  auditIndex: { fontSize: 12, fontWeight: '700', color: '#B0BAC9' },
  auditTypePill: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  auditTypeIcon: { fontSize: 15 },

  auditMain: { flex: 1, gap: 4 },
  auditNameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  auditName: { fontSize: 15, fontWeight: '700', color: '#15233A' },
  auditGrade: { fontSize: 11, color: '#7A8699', fontWeight: '500' },

  auditPickupRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  auditPickupIcon: { fontSize: 12 },
  auditPickupName: { fontSize: 13, color: '#3B4A66', fontWeight: '500' },
  staffBadge: {
    backgroundColor: '#FBE9C7', borderRadius: 5,
    paddingHorizontal: 5, paddingVertical: 1,
  },
  staffBadgeText: { fontSize: 10, fontWeight: '700', color: '#C97A1F' },

  auditVehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colorDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)' },
  auditVehicleText: { fontSize: 12, color: '#7A8699' },
  platePill: {
    backgroundColor: '#ECE0C8', borderRadius: 5,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  plateText: { fontSize: 11, fontWeight: '700', color: '#3B4A66', letterSpacing: 0.5 },

  auditRight: { alignItems: 'flex-end', gap: 1, minWidth: 62 },
  auditReleasedTime: { fontSize: 14, fontWeight: '700', color: '#2F6B5A' },
  auditTimeLabel: { fontSize: 9, color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '600' },
  auditArrivedTime: { fontSize: 10, color: '#B0BAC9', marginTop: 2 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 8 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 17, fontWeight: '700', color: '#15233A' },
  emptySub: { fontSize: 13, color: '#7A8699' },
});
