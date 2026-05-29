import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Alert, Modal, ScrollView,
} from 'react-native';
import { dataSource } from '../../data/provider';
import { Button } from '../../components/ui/Button';
import type { EarlyPickupApproval, Student, Guardian } from '../../models';

const REASON_LABELS: Record<string, string> = {
  doctor: 'Medical appointment',
  family: 'Family event',
  religious: 'Religious observance',
  other: 'Other',
};

type EnrichedApproval = EarlyPickupApproval & {
  student?: Student | null;
  guardian?: Guardian | null;
};

export function StaffApprovalsScreen() {
  const [approvals, setApprovals] = useState<EnrichedApproval[]>([]);
  const [selected, setSelected] = useState<EnrichedApproval | null>(null);
  const [denialNote, setDenialNote] = useState('');
  const [modalMode, setModalMode] = useState<'deny' | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const list = await dataSource.getEarlyPickupApprovals();
    const enriched: EnrichedApproval[] = await Promise.all(
      list.map(async a => {
        const [student, guardian] = await Promise.all([
          dataSource.getStudentById(a.studentId),
          dataSource.getGuardianById(a.guardianId),
        ]);
        return { ...a, student, guardian };
      })
    );
    setApprovals(enriched);
  };

  useEffect(() => { load(); }, []);

  const pending = approvals.filter(a => a.status === 'pending');
  const reviewed = approvals.filter(a => a.status !== 'pending');

  const handleApprove = async (approval: EnrichedApproval) => {
    setLoading(true);
    try {
      await dataSource.approveEarlyPickup(approval.id, 'staff-1');
      await load();
      setSelected(null);
      Alert.alert('Approved', `Early pickup for ${approval.student?.firstName} approved at ${approval.pickupTime}.`);
    } catch {
      Alert.alert('Error', 'Could not approve. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!selected) return;
    if (!denialNote.trim()) {
      Alert.alert('Required', 'Please add a note explaining the denial.');
      return;
    }
    setLoading(true);
    try {
      await dataSource.denyEarlyPickup(selected.id, 'staff-1', denialNote.trim());
      await load();
      setModalMode(null);
      setSelected(null);
      setDenialNote('');
    } catch {
      Alert.alert('Error', 'Could not deny. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderApproval = ({ item: a }: { item: EnrichedApproval }) => {
    const isPending = a.status === 'pending';
    return (
      <TouchableOpacity
        style={[styles.card, !isPending && styles.cardReviewed]}
        onPress={() => isPending ? setSelected(a) : undefined}
        activeOpacity={isPending ? 0.75 : 1}
      >
        <View style={styles.cardTop}>
          <View style={styles.cardLeft}>
            <Text style={styles.studentName}>
              {a.student ? `${a.student.firstName} ${a.student.lastName}` : a.studentId}
            </Text>
            <Text style={styles.cardSub}>
              {a.student?.grade} · {a.student?.homeroom}
            </Text>
          </View>
          <View style={[styles.statusBadge, a.status === 'approved' && styles.badgeApproved, a.status === 'denied' && styles.badgeDenied]}>
            <Text style={[styles.statusText, a.status !== 'pending' && styles.statusTextReviewed]}>
              {a.status === 'pending' ? 'Pending' : a.status === 'approved' ? '✓ Approved' : '✕ Denied'}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{a.pickupTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Reason</Text>
            <Text style={styles.detailValue}>{REASON_LABELS[a.reason] ?? a.reason}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Requested by</Text>
            <Text style={styles.detailValue}>
              {a.guardian ? `${a.guardian.firstName} ${a.guardian.lastName}` : a.guardianId}
            </Text>
          </View>
        </View>

        {a.note && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>"{a.note}"</Text>
          </View>
        )}

        {a.denialNote && (
          <View style={styles.denialBox}>
            <Text style={styles.denialText}>Denial note: {a.denialNote}</Text>
          </View>
        )}

        {isPending && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.denyBtn]}
              onPress={() => { setSelected(a); setModalMode('deny'); }}
            >
              <Text style={styles.denyBtnText}>Deny</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => handleApprove(a)}
            >
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Early pickups</Text>
        {pending.length > 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pending.length} pending</Text>
          </View>
        )}
      </View>

      <FlatList
        data={[...pending, ...reviewed]}
        keyExtractor={a => a.id}
        renderItem={renderApproval}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No requests today</Text>
            <Text style={styles.emptySub}>Early pickup requests will appear here</Text>
          </View>
        }
        ListHeaderComponent={
          reviewed.length > 0 && pending.length > 0 ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Needs review</Text>
            </View>
          ) : null
        }
      />

      {/* Deny modal */}
      <Modal visible={modalMode === 'deny'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Deny early pickup</Text>
            <Text style={styles.modalSub}>
              {selected?.student ? `${selected.student.firstName} ${selected.student.lastName}` : ''} at {selected?.pickupTime}
            </Text>
            <Text style={styles.noteLabel}>Reason for denial</Text>
            <TextInput
              style={styles.noteInput}
              value={denialNote}
              onChangeText={setDenialNote}
              placeholder="e.g. Not enough notice — please call the office…"
              placeholderTextColor="#B0BAC9"
              multiline
              numberOfLines={3}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Button variant="secondary" size="md" onPress={() => { setModalMode(null); setDenialNote(''); }}>
                Cancel
              </Button>
              <Button variant="danger" size="md" loading={loading} onPress={handleDeny}>
                Send denial
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF5EA' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#15233A', letterSpacing: -0.4, flex: 1 },
  pendingBadge: {
    backgroundColor: '#C97A1F', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  pendingBadgeText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  sectionHeader: { marginBottom: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5 },

  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 12, paddingTop: 4 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 18,
    borderWidth: 1, borderColor: '#ECE0C8',
    padding: 16, gap: 12,
    shadowColor: '#15233A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2,
    elevation: 2,
  },
  cardReviewed: { opacity: 0.75 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { gap: 2 },
  studentName: { fontSize: 17, fontWeight: '700', color: '#15233A' },
  cardSub: { fontSize: 12, color: '#7A8699' },

  statusBadge: {
    backgroundColor: '#F8E0BF', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeApproved: { backgroundColor: '#DCEBE3' },
  badgeDenied: { backgroundColor: '#F5DDD9' },
  statusText: { fontSize: 13, fontWeight: '700', color: '#C97A1F' },
  statusTextReviewed: { color: '#3B4A66' },

  details: { flexDirection: 'row', gap: 16 },
  detailItem: { gap: 2 },
  detailLabel: { fontSize: 10, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.4 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#15233A' },

  noteBox: {
    backgroundColor: '#F5F0E8', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  noteText: { fontSize: 13, color: '#3B4A66', fontStyle: 'italic' },

  denialBox: {
    backgroundColor: '#FDF0EE', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: '#F5DDD9',
  },
  denialText: { fontSize: 13, color: '#B83A2E' },

  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: 12,
  },
  denyBtn: { backgroundColor: '#F5F0E8', borderWidth: 1, borderColor: '#D8C9A8' },
  denyBtnText: { fontSize: 14, fontWeight: '700', color: '#3B4A66' },
  approveBtn: { backgroundColor: '#2F6B5A' },
  approveBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#15233A' },
  emptySub: { fontSize: 13, color: '#7A8699' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FBF5EA', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, gap: 14,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#15233A' },
  modalSub: { fontSize: 14, color: '#7A8699', marginTop: -8 },
  noteLabel: { fontSize: 13, fontWeight: '600', color: '#3B4A66' },
  noteInput: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8',
    borderRadius: 12, padding: 12, fontSize: 15, color: '#15233A',
    minHeight: 90, textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', gap: 10, paddingBottom: 8 },
});
