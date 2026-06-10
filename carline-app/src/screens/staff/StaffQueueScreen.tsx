import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Modal, Pressable,
} from 'react-native';
import { LicensePlate } from '../../components/ui/LicensePlate';
import { dataSource } from '../../data/provider';
import { useStore } from '../../store';
import type { QueueEntry, Student, Guardian, Vehicle, PickupStatus, PickupType } from '../../models';

type QueueRow = QueueEntry & {
  student?: Student | null;
  guardian?: Guardian | null;
  vehicle?: Vehicle | null;
};

const STATUS_ORDER = { called: 0, arrived: 1, requested: 2, released: 3 };
const GRADE_FILTERS = ['All', 'K', '1st', '2nd', '3rd', '4th', '5th'];

const TYPE_FILTERS: { key: string; label: string; icon: string; type?: PickupType }[] = [
  { key: 'All',    label: 'All',     icon: '📋' },
  { key: 'Car',    label: 'Car',     icon: '🚗', type: 'carline' },
  { key: 'Walk',   label: 'Walk-in', icon: '🚶', type: 'walkin'  },
  { key: 'Bus',    label: 'Bus',     icon: '🚌', type: 'bus'     },
  { key: 'Early',  label: 'Early',   icon: '🕐', type: 'early'   },
];

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

const ALL_STATUSES: PickupStatus[] = ['requested', 'arrived', 'called', 'released'];
const STATUS_LABELS: Record<PickupStatus, string> = {
  requested: 'Requested',
  arrived:   'Arrived',
  called:    'Called out',
  released:  'Released',
};

const GROUPS = [1, 2, 3, 4, 5];
const POSITIONS = Array.from({ length: 20 }, (_, i) => i + 1);

export function StaffQueueScreen() {
  const { queue, advanceQueueEntry, setQueueEntryStatus, setGroupAndPosition, subscribeToQueue } = useStore();
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [editingRow, setEditingRow] = useState<QueueRow | null>(null);
  const [positioningRow, setPositioningRow] = useState<QueueRow | null>(null);
  const [selGroup, setSelGroup] = useState(1);
  const [selPosition, setSelPosition] = useState(1);

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
            entry.guardianId ? dataSource.getGuardianById(entry.guardianId) : Promise.resolve(null),
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

  const activeRows = rows.filter(r => r.status !== 'released');
  const released = rows.filter(r => r.status === 'released');

  const filterRows = (source: QueueRow[]) => {
    const selectedType = TYPE_FILTERS.find(t => t.key === typeFilter)?.type;
    return source
      .filter(r => !selectedType || r.pickupType === selectedType)
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
      });
  };

  const sortedActive = filterRows(activeRows).sort((a, b) => {
    // Sort by group+position if set, then by status order, then arrival
    if (a.group != null && a.position != null && b.group != null && b.position != null) {
      return (a.group * 100 + a.position) - (b.group * 100 + b.position);
    }
    if (a.group != null && b.group == null) return -1;
    if (a.group == null && b.group != null) return 1;
    return (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
  });

  const handleAdvance = useCallback(async (requestId: string) => {
    await advanceQueueEntry(requestId);
  }, [advanceQueueEntry]);

  const handleSetStatus = useCallback(async (status: PickupStatus) => {
    if (!editingRow) return;
    await setQueueEntryStatus(editingRow.requestId, status);
    setEditingRow(null);
  }, [editingRow, setQueueEntryStatus]);

  const handleSavePosition = useCallback(async () => {
    if (!positioningRow) return;
    await setGroupAndPosition(positioningRow.requestId, positioningRow.studentId, selGroup, selPosition);
    setPositioningRow(null);
  }, [positioningRow, selGroup, selPosition, setGroupAndPosition]);

  const openPositionPicker = (r: QueueRow) => {
    setSelGroup(r.group ?? 1);
    setSelPosition(r.position ?? 1);
    setPositioningRow(r);
  };

  const renderRow = ({ item: r }: { item: QueueRow }) => {
    const isBus = r.pickupType === 'bus';
    const isWalk = r.pickupType === 'walkin';
    const isEarly = r.pickupType === 'early';
    const hasPosition = r.group != null && r.position != null;

    return (
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
                <View style={styles.nameRow}>
                  <Text style={styles.studentName}>
                    {r.student ? `${r.student.firstName} ${r.student.lastName}` : r.studentId}
                  </Text>
                  {(isWalk || isEarly || isBus) && (
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>
                        {isBus ? '🚌 Bus' : isWalk ? '🚶 Walk-in' : '🕐 Early'}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.rowSub}>
                  {r.student?.grade} · {r.student?.homeroom} · {r.student?.teacherName}
                </Text>
                {r.guardian && (
                  <Text style={styles.guardianName}>
                    {r.guardian.firstName} {r.guardian.lastName}
                  </Text>
                )}
              </View>

              <View style={styles.rowRight}>
                {r.vehicle ? (
                  <LicensePlate plate={r.vehicle.plate} state={r.vehicle.state} size="sm" />
                ) : null}
                <Text style={styles.arrivedAt}>{r.arrivedAt}</Text>
                {/* Group/Position badge */}
                <TouchableOpacity
                  style={[styles.posBadge, hasPosition && styles.posBadgeSet]}
                  onPress={() => openPositionPicker(r)}
                >
                  <Text style={[styles.posBadgeText, hasPosition && styles.posBadgeTextSet]}>
                    {hasPosition ? `G${r.group} · P${r.position}` : '+ pos'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {r.pickupType === 'bus' && r.busPlate && (
              <View style={styles.busPlateRow}>
                <Text style={styles.busPlateLabel}>🚌 Bus:</Text>
                <Text style={styles.busPlateText}>{r.busPlate}</Text>
              </View>
            )}
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
            {r.status === 'arrived' && !isBus && (
              <TouchableOpacity style={[styles.actionBtn, styles.callBtn]} onPress={() => handleAdvance(r.requestId)}>
                <Text style={styles.callBtnText}>Call out</Text>
              </TouchableOpacity>
            )}
            {r.status === 'called' && !isBus && (
              <TouchableOpacity style={[styles.actionBtn, styles.releaseBtn]} onPress={() => handleAdvance(r.requestId)}>
                <Text style={styles.releaseBtnText}>Released ✓</Text>
              </TouchableOpacity>
            )}
            {isBus && r.status === 'arrived' && (
              <TouchableOpacity style={[styles.actionBtn, styles.busBtn]} onPress={() => handleAdvance(r.requestId)}>
                <Text style={styles.busBtnText}>🚌 Depart</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dismissal queue</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{sortedActive.length}</Text>
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

      {/* Type filter */}
      <View style={styles.typeFilterRow}>
        {TYPE_FILTERS.map(t => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTypeFilter(t.key)}
            style={[styles.filterChip, typeFilter === t.key && styles.filterChipActive]}
          >
            <Text style={styles.filterChipIcon}>{t.icon}</Text>
            <Text style={[styles.filterText, typeFilter === t.key && styles.filterTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grade filter */}
      <View style={styles.gradeFilterRow}>
        {GRADE_FILTERS.map(g => (
          <TouchableOpacity
            key={g}
            onPress={() => setGradeFilter(g)}
            style={[styles.gradeChip, gradeFilter === g && styles.gradeChipActive]}
          >
            <Text style={[styles.filterText, gradeFilter === g && styles.filterTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sortedActive}
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
                  <Text style={styles.releasedType}>
                    {r.pickupType === 'bus' ? '🚌' : r.pickupType === 'walkin' ? '🚶' : r.pickupType === 'early' ? '🕐' : '🚗'}
                  </Text>
                  <Text style={styles.releasedTime}>{r.arrivedAt}</Text>
                </View>
              ))}
            </View>
          ) : null
        }
      />

      {/* Status edit modal */}
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
                style={[styles.modalOption, editingRow?.status === s && styles.modalOptionActive]}
                onPress={() => handleSetStatus(s)}
              >
                <View style={[styles.modalDot, { backgroundColor: STATUS_DOT[s] }]} />
                <Text style={[styles.modalOptionText, editingRow?.status === s && styles.modalOptionTextActive]}>
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

      {/* Group + Position picker modal */}
      <Modal
        visible={positioningRow !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPositioningRow(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPositioningRow(null)}>
          <Pressable style={styles.posSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            {positioningRow && (
              <Text style={styles.posTitle}>
                {positioningRow.student
                  ? `${positioningRow.student.firstName} ${positioningRow.student.lastName}`
                  : positioningRow.studentId}
              </Text>
            )}

            <Text style={styles.posLabel}>Group</Text>
            <View style={styles.groupRow}>
              {GROUPS.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.groupChip, selGroup === g && styles.groupChipActive]}
                  onPress={() => setSelGroup(g)}
                >
                  <Text style={[styles.groupChipText, selGroup === g && styles.groupChipTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.posLabel}>Position</Text>
            <View style={styles.posGrid}>
              {POSITIONS.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.posChip, selPosition === p && styles.posChipActive]}
                  onPress={() => setSelPosition(p)}
                >
                  <Text style={[styles.posChipText, selPosition === p && styles.posChipTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.posSaveBtn} onPress={handleSavePosition}>
              <Text style={styles.posSaveBtnText}>Save — G{selGroup} · P{selPosition}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setPositioningRow(null)}>
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
  countBadge: { backgroundColor: '#E8A33D', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  countText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 10,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: '#15233A' },

  typeFilterRow: {
    flexDirection: 'row', flexShrink: 0, flexWrap: 'wrap', gap: 6,
    paddingHorizontal: 20, marginBottom: 10,
  },
  filterChip: {
    height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 18,
  },
  filterChipActive: { backgroundColor: '#1F3A5F', borderColor: '#1F3A5F' },
  filterChipIcon: { fontSize: 13 },

  gradeFilterRow: {
    flexDirection: 'row', flexShrink: 0, flexWrap: 'wrap', gap: 6,
    paddingHorizontal: 20, marginBottom: 12,
  },
  gradeChip: {
    height: 36, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 18,
  },
  gradeChipActive: { backgroundColor: '#1F3A5F', borderColor: '#1F3A5F' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#3B4A66' },
  filterTextActive: { color: '#FFFFFF' },

  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, gap: 8 },

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
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  studentName: { fontSize: 16, fontWeight: '700', color: '#15233A' },
  typeBadge: {
    backgroundColor: '#E5EAF1', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '700', color: '#2A6FA3' },
  rowSub: { fontSize: 12, color: '#7A8699' },
  guardianName: { fontSize: 13, color: '#3B4A66', fontWeight: '500' },
  arrivedAt: { fontSize: 12, color: '#7A8699' },

  posBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, borderWidth: 1, borderColor: '#D8C9A8',
    backgroundColor: '#FFFFFF',
  },
  posBadgeSet: { backgroundColor: '#1F3A5F', borderColor: '#1F3A5F' },
  posBadgeText: { fontSize: 11, fontWeight: '700', color: '#7A8699' },
  posBadgeTextSet: { color: '#FFFFFF' },

  busPlateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  busPlateLabel: { fontSize: 12, fontWeight: '600', color: '#5A3A8A' },
  busPlateText: { fontSize: 12, fontWeight: '700', color: '#5A3A8A', backgroundColor: '#F0E8FB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

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
  busBtn: { backgroundColor: '#2A6FA3' },
  busBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 20, fontWeight: '700', color: '#15233A' },
  emptySub: { fontSize: 14, color: '#7A8699' },

  releasedSection: { marginTop: 24, gap: 6 },
  releasedLabel: { fontSize: 11, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5 },
  releasedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#ECE0C8', gap: 8 },
  releasedName: { flex: 1, fontSize: 14, color: '#7A8699' },
  releasedType: { fontSize: 14 },
  releasedTime: { fontSize: 14, color: '#7A8699' },

  // Status edit modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 20, width: 300, gap: 4,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  modalTitle: { fontSize: 13, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5 },
  modalStudent: { fontSize: 18, fontWeight: '700', color: '#15233A', marginTop: 2 },
  modalDivider: { height: 1, backgroundColor: '#ECE0C8', marginVertical: 12 },
  modalOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10 },
  modalOptionActive: { backgroundColor: '#F0F4FA' },
  modalDot: { width: 10, height: 10, borderRadius: 5 },
  modalOptionText: { flex: 1, fontSize: 16, color: '#3B4A66', fontWeight: '500' },
  modalOptionTextActive: { fontWeight: '700', color: '#15233A' },
  modalCheck: { fontSize: 16, color: '#2F6B5A', fontWeight: '700' },
  modalCancel: { marginTop: 10, paddingVertical: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ECE0C8' },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#7A8699' },

  // Position picker modal
  posSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40,
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D8C9A8', alignSelf: 'center', marginBottom: 16 },
  posTitle: { fontSize: 20, fontWeight: '700', color: '#15233A', marginBottom: 20 },
  posLabel: { fontSize: 13, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 8 },
  groupRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  groupChip: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F0F4FA', borderWidth: 1.5, borderColor: '#D8C9A8',
  },
  groupChipActive: { backgroundColor: '#1F3A5F', borderColor: '#1F3A5F' },
  groupChipText: { fontSize: 22, fontWeight: '700', color: '#3B4A66' },
  groupChipTextActive: { color: '#FFFFFF' },
  posGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  posChip: {
    width: 44, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F0F4FA', borderWidth: 1, borderColor: '#D8C9A8',
  },
  posChipActive: { backgroundColor: '#E8A33D', borderColor: '#E8A33D' },
  posChipText: { fontSize: 15, fontWeight: '600', color: '#3B4A66' },
  posChipTextActive: { color: '#FFFFFF' },
  posSaveBtn: {
    backgroundColor: '#15233A', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 8,
  },
  posSaveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  modalCancelBtn: { alignItems: 'center', paddingVertical: 10 },
});
