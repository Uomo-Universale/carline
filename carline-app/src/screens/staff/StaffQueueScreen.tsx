import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Modal, Pressable,
} from 'react-native';
import { LicensePlate } from '../../components/ui/LicensePlate';
import { StatusChip } from '../../components/ui/StatusChip';
import { dataSource } from '../../data/provider';
import { useStore } from '../../store';
import type { QueueEntry, Student, Guardian, Vehicle, PickupStatus } from '../../models';

type QueueRow = QueueEntry & {
  student?: Student | null;
  guardian?: Guardian | null;
  vehicle?: Vehicle | null;
};

const STATUS_ORDER = { called: 0, arrived: 1, requested: 2, released: 3 };

const GRADE_FILTERS = ['All', 'K', '1st', '2nd', '3rd', '4th', '5th'];

const STATUS_COLORS: Record<string, string> = {
  called:    '#F8E0BF',
  arrived:   '#E5EAF1',
  requested: '#FBF5EA',
  released:  '#DCEBE3',
};

const STATUS_DOT: Record<string, string> = {
  called:    '#C97A1F',
  arrived:   '#2A6FA3',
  requested: '#7A8699',
  released:  '#2F6B5A',
};

const STATUS_LABELS: Record<PickupStatus, string> = {
  requested: 'Requested',
  arrived:   'Arrived',
  called:    'Called out',
  released:  'Released',
};

const ALL_STATUSES: PickupStatus[] = ['requested', 'arrived', 'called', 'released'];

export function StaffQueueScreen() {
  const { queue, advanceQueueEntry, setQueueEntryStatus, subscribeToQueue } = useStore();
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [editingRow, setEditingRow] = useState<QueueRow | null>(null);

  useEffect(() => {
    const unsub = subscribeToQueue();
    return unsub;
  }, []);

  useEffect(() => {
    let mounted = true;
    const enrich = async () => {
      const enriched: QueueRow[] = await Promise.all(
        queue.map(async entry => {
          const [student, guardian, vehicle] = await Promise.all([
            dataSource.getStudentById(entry.studentId),
            dataSource.getGuardianById(entry.guardianId),
            entry.vehicleId ? dataSource.getVehicleById(entry.vehicleId) : Promise.resolve(null),
          ]);
          return { ...entry, student, guardian, vehicle };
        })
      );
      if (mounted) setRows(enriched);
    };
    enrich();
    return () => { mounted = false; };
  }, [queue]);

  const filtered = rows
    .filter(r => r.status !== 'released')
    .filter(r => {
      if (gradeFilter === 'All') return true;
      const grade = r.student?.grade ?? '';
      if (gradeFilter === 'K') return grade.toLowerCase().includes('kindergarten');
      return grade.toLowerCase().startsWith(gradeFilter.toLowerCase());
    })
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        r.student?.firstName.toLowerCase().includes(q) ||
        r.student?.lastName.toLowerCase().includes(q) ||
        r.vehicle?.plate.toLowerCase().includes(q) ||
        r.guardian?.lastName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));

  const released = rows.filter(r => r.status === 'released');

  const handleAdvance = useCallback(async (requestId: string) => {
    await advanceQueueEntry(requestId);
  }, [advanceQueueEntry]);

  const handleSetStatus = useCallback(async (status: PickupStatus) => {
    if (!editingRow) return;
    await setQueueEntryStatus(editingRow.requestId, status);
    setEditingRow(null);
  }, [editingRow, setQueueEntryStatus]);

  const renderRow = ({ item: r }: { item: QueueRow }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onLongPress={() => setEditingRow(r)}
      delayLongPress={400}
    >
    <View style={[styles.row, { backgroundColor: STATUS_COLORS[r.status] ?? '#FBF5EA' }]}>
      <View style={[styles.statusDot, { backgroundColor: STATUS_DOT[r.status] ?? '#7A8699' }]} />
      <View style={styles.rowMain}>
        <View style={styles.rowTop}>
          <View style={styles.rowLeft}>
            <Text style={styles.studentName}>
              {r.student ? `${r.student.firstName} ${r.student.lastName}` : r.studentId}
            </Text>
            <Text style={styles.rowSub}>
              {r.student?.grade} · {r.student?.homeroom} · {r.student?.teacherName}
            </Text>
            <Text style={styles.guardianName}>
              {r.guardian ? `${r.guardian.firstName} ${r.guardian.lastName}` : ''}
            </Text>
          </View>
          <View style={styles.rowRight}>
            {r.vehicle ? (
              <LicensePlate plate={r.vehicle.plate} state={r.vehicle.state} size="sm" />
            ) : null}
            <Text style={styles.arrivedAt}>{r.arrivedAt}</Text>
          </View>
        </View>

        {r.vehicle && (
          <View style={styles.vehicleRow}>
            <View style={[styles.colorSwatch, { backgroundColor: r.vehicle.colorHex }]} />
            <Text style={styles.vehicleText}>{r.vehicle.color} {r.vehicle.make} {r.vehicle.model} {r.vehicle.year}</Text>
          </View>
        )}

        {r.alert && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertText}>⚠ {r.alert}</Text>
          </View>
        )}
      </View>

      <View style={styles.rowActions}>
        {r.status === 'arrived' && (
          <TouchableOpacity style={[styles.actionBtn, styles.callBtn]} onPress={() => handleAdvance(r.requestId)}>
            <Text style={styles.callBtnText}>Call out</Text>
          </TouchableOpacity>
        )}
        {r.status === 'called' && (
          <TouchableOpacity style={[styles.actionBtn, styles.releaseBtn]} onPress={() => handleAdvance(r.requestId)}>
            <Text style={styles.releaseBtnText}>Released ✓</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dismissal queue</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filtered.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search student, plate, family…"
          placeholderTextColor="#B0BAC9"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Grade filter */}
      <View style={styles.filterWrap}>
        {GRADE_FILTERS.map(g => (
          <TouchableOpacity
            key={g}
            onPress={() => setGradeFilter(g)}
            style={[styles.filterChip, gradeFilter === g && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, gradeFilter === g && styles.filterTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={r => r.requestId + r.studentId}
        renderItem={renderRow}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyText}>All clear</Text>
            <Text style={styles.emptySub}>No students waiting</Text>
          </View>
        }
        ListFooterComponent={
          released.length > 0 ? (
            <View style={styles.releasedSection}>
              <Text style={styles.releasedLabel}>Released today ({released.length})</Text>
              {released.map(r => (
                <View key={r.requestId + r.studentId} style={styles.releasedRow}>
                  <Text style={styles.releasedName}>
                    {r.student ? `${r.student.firstName} ${r.student.lastName}` : r.studentId}
                  </Text>
                  <Text style={styles.releasedTime}>{r.arrivedAt}</Text>
                </View>
              ))}
            </View>
          ) : null
        }
      />

      <Modal
        visible={editingRow !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingRow(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setEditingRow(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Change status</Text>
            {editingRow && (
              <Text style={styles.modalStudent}>
                {editingRow.student
                  ? `${editingRow.student.firstName} ${editingRow.student.lastName}`
                  : editingRow.studentId}
              </Text>
            )}
            <View style={styles.modalDivider} />
            {ALL_STATUSES.map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.modalOption,
                  editingRow?.status === s && styles.modalOptionActive,
                ]}
                onPress={() => handleSetStatus(s)}
              >
                <View style={[styles.modalDot, { backgroundColor: STATUS_DOT[s] }]} />
                <Text style={[
                  styles.modalOptionText,
                  editingRow?.status === s && styles.modalOptionTextActive,
                ]}>
                  {STATUS_LABELS[s]}
                </Text>
                {editingRow?.status === s && <Text style={styles.modalCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setEditingRow(null)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF5EA' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#15233A', letterSpacing: -0.4, flex: 1 },
  countBadge: {
    backgroundColor: '#E8A33D', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  countText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 10,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: '#15233A' },

  filterWrap: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginBottom: 12 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 5,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 20,
  },
  filterChipActive: { backgroundColor: '#1F3A5F', borderColor: '#1F3A5F' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#3B4A66' },
  filterTextActive: { color: '#FFFFFF' },

  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 8 },

  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  rowMain: { flex: 1, gap: 6 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rowLeft: { flex: 1, gap: 2 },
  rowRight: { alignItems: 'flex-end', gap: 4 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#15233A' },
  rowSub: { fontSize: 12, color: '#7A8699' },
  guardianName: { fontSize: 13, color: '#3B4A66', fontWeight: '500' },
  arrivedAt: { fontSize: 12, color: '#7A8699' },

  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colorSwatch: { width: 14, height: 14, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' },
  vehicleText: { fontSize: 12, color: '#3B4A66' },

  alertBadge: {
    backgroundColor: '#FBE9C7', borderWidth: 1, borderColor: '#E8A33D',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
  },
  alertText: { fontSize: 12, fontWeight: '600', color: '#7A4A0E' },

  rowActions: { justifyContent: 'center' },
  actionBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10, minWidth: 84, alignItems: 'center',
  },
  callBtn: { backgroundColor: '#E8A33D' },
  callBtnText: { fontSize: 13, fontWeight: '700', color: '#3A2206' },
  releaseBtn: { backgroundColor: '#2F6B5A' },
  releaseBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 20, fontWeight: '700', color: '#15233A' },
  emptySub: { fontSize: 14, color: '#7A8699' },

  releasedSection: { marginTop: 24, gap: 6 },
  releasedLabel: { fontSize: 11, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5 },
  releasedRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#ECE0C8' },
  releasedName: { fontSize: 14, color: '#7A8699' },
  releasedTime: { fontSize: 14, color: '#7A8699' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 20, width: 300, gap: 4,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  modalTitle: { fontSize: 13, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5 },
  modalStudent: { fontSize: 18, fontWeight: '700', color: '#15233A', marginTop: 2 },
  modalDivider: { height: 1, backgroundColor: '#ECE0C8', marginVertical: 12 },
  modalOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10,
  },
  modalOptionActive: { backgroundColor: '#F0F4FA' },
  modalDot: { width: 10, height: 10, borderRadius: 5 },
  modalOptionText: { flex: 1, fontSize: 16, color: '#3B4A66', fontWeight: '500' },
  modalOptionTextActive: { fontWeight: '700', color: '#15233A' },
  modalCheck: { fontSize: 16, color: '#2F6B5A', fontWeight: '700' },
  modalCancel: {
    marginTop: 10, paddingVertical: 12, alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#ECE0C8',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#7A8699' },
});
