import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Animated, Modal, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KidPortrait } from '../../components/ui/KidPortrait';
import { StatusChip } from '../../components/ui/StatusChip';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { dataSource } from '../../data/provider';
import { useStore } from '../../store';
import type { Student, PickupRequest } from '../../models';

const SCHOOL = 'Rambam Day School';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [guardian, setGuardian] = useState<Awaited<ReturnType<typeof dataSource.getCurrentGuardian>> | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeRequests, setActiveRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingType, setPendingType] = useState<'carline' | 'walkin'>('carline');
  const { queue } = useStore();

  useEffect(() => {
    dataSource.getCurrentGuardian().then(g => {
      setGuardian(g);
      dataSource.getStudentsForGuardian(g.id).then(s => {
        setStudents(s);
        setSelectedIds(s.map(x => x.id));
      });
      dataSource.getActiveRequestsForGuardian(g.id).then(setActiveRequests);
    });
  }, []);

  const getStatusForStudent = (studentId: string) => {
    const entry = queue.find(e => e.studentId === studentId);
    if (entry) return entry.status;
    const req = activeRequests.find(r => r.studentIds.includes(studentId));
    return req?.status ?? 'none';
  };

  const anyActive = students.some(s => getStatusForStudent(s.id) !== 'none');

  const toggleStudent = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const submitRequest = async (studentIds: string[], type: 'carline' | 'walkin' = pendingType) => {
    if (!guardian || studentIds.length === 0) return;
    setLoading(true);
    setShowPickerModal(false);
    try {
      const vehicles = await dataSource.getVehiclesForGuardian(guardian.id);
      const vehicle = vehicles.find(v => v.isActive) ?? vehicles[0];
      const req = await dataSource.createPickupRequest({
        guardianId: guardian.id,
        studentIds,
        vehicleId: type === 'carline' ? vehicle?.id : undefined,
        type,
      });
      setActiveRequests(prev => [...prev, req]);
      navigation.navigate('LiveStatus', { requestId: req.id, studentId: studentIds[0] });
    } finally {
      setLoading(false);
    }
  };

  const handleImHere = () => {
    setPendingType('carline');
    if (students.length <= 1) {
      submitRequest(students.map(s => s.id), 'carline');
    } else {
      setSelectedIds(students.map(s => s.id));
      setShowPickerModal(true);
    }
  };

  const handleWalkingUp = () => {
    setPendingType('walkin');
    setSelectedIds(students.map(s => s.id));
    setShowPickerModal(true);
  };

  const firstName = guardian?.firstName ?? '';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar name={guardian ? `${guardian.firstName} ${guardian.lastName}` : ''} size={40} />
          <View style={styles.headerText}>
            <Text style={styles.subtitle}>{SCHOOL}</Text>
            <Text style={styles.title}>Hi, {firstName}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Today banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>🕐</Text>
          <Text style={styles.bannerText}>Dismissal at 3:25 — on time</Text>
        </View>

        {/* Hero action */}
        <TouchableOpacity
          onPress={anyActive ? () => navigation.navigate('LiveStatus', { requestId: activeRequests[0]?.id, studentId: students[0]?.id }) : handleImHere}
          disabled={loading}
          activeOpacity={0.85}
          style={[styles.hero, anyActive && styles.heroActive]}
        >
          <View>
            <Text style={[styles.heroTitle, anyActive && styles.heroTitleActive]}>
              {anyActive ? "We've got you" : "I'm here"}
            </Text>
            <Text style={[styles.heroSub, anyActive && styles.heroSubActive]}>
              {anyActive ? 'Hold tight — pulling your kids now' : 'Tap when you\'re in the car line'}
            </Text>
          </View>
          <View style={[styles.heroCircle, anyActive && styles.heroCircleActive]}>
            <Text style={styles.heroCircleText}>{anyActive ? '✓' : '🚗'}</Text>
          </View>
        </TouchableOpacity>

        {/* Secondary actions */}
        <View style={styles.secondaryRow}>
          <Button
            variant="secondary"
            size="md"
            block
            onPress={handleWalkingUp}
            style={{ flex: 1 } as any}
          >
            🚶 Walking up
          </Button>
          <Button
            variant="secondary"
            size="md"
            block
            onPress={() => navigation.navigate('PickupPicker')}
            style={{ flex: 1 } as any}
          >
            🕐 Early pickup
          </Button>
        </View>

        {/* Kids list */}
        <Text style={styles.sectionLabel}>Picking up today</Text>
        {students.map(k => (
          <Card key={k.id} padding={14} style={styles.kidCard}>
            <KidPortrait initial={k.firstName[0]} tintIndex={k.tintIndex} size={48} />
            <View style={styles.kidInfo}>
              <Text style={styles.kidName}>{k.firstName} {k.lastName}</Text>
              <Text style={styles.kidSub}>{k.grade} · {k.teacherName}</Text>
            </View>
            <StatusChip status={getStatusForStudent(k.id) as any} size="sm" />
          </Card>
        ))}
      </ScrollView>

      {/* Child selection modal */}
      <Modal
        visible={showPickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPickerModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {pendingType === 'carline' ? 'Who are you picking up?' : 'Who is walking up with you?'}
            </Text>
            <Text style={styles.modalSub}>Deselect any children staying or leaving another way</Text>

            <View style={styles.modalList}>
              {students.map(s => {
                const selected = selectedIds.includes(s.id);
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.modalStudentRow, selected && styles.modalStudentRowSelected]}
                    onPress={() => toggleStudent(s.id)}
                    activeOpacity={0.75}
                  >
                    <KidPortrait initial={s.firstName[0]} tintIndex={s.tintIndex} size={44} />
                    <View style={styles.modalStudentInfo}>
                      <Text style={styles.modalStudentName}>{s.firstName} {s.lastName}</Text>
                      <Text style={styles.modalStudentSub}>{s.grade} · {s.teacherName}</Text>
                    </View>
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {pendingType === 'carline' && (
              <TouchableOpacity
                style={styles.vehicleLink}
                onPress={() => { setShowPickerModal(false); navigation.navigate('Vehicle'); }}
              >
                <Text style={styles.vehicleLinkText}>Using a different car today? →</Text>
              </TouchableOpacity>
            )}

            <Button
              variant="primary"
              size="lg"
              block
              onPress={() => submitRequest(selectedIds)}
              style={styles.modalConfirm as any}
            >
              {`Confirm — ${selectedIds.length} ${selectedIds.length === 1 ? 'child' : 'children'}`}
            </Button>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowPickerModal(false)}>
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
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, paddingBottom: 16 },
  headerText: { flex: 1 },
  subtitle: { fontSize: 11, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.6 },
  title: { fontSize: 22, fontWeight: '600', color: '#15233A', letterSpacing: -0.3 },
  bellBtn: { padding: 8 },
  bellIcon: { fontSize: 20 },

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 20, marginBottom: 16,
    padding: 12, backgroundColor: '#E5EAF1',
    borderWidth: 1, borderColor: '#C8D5E6', borderRadius: 12,
  },
  bannerIcon: { fontSize: 16 },
  bannerText: { fontSize: 13, color: '#15233A', fontWeight: '500' },

  hero: {
    marginHorizontal: 20, marginBottom: 12,
    padding: 28, borderRadius: 24,
    backgroundColor: '#E8A33D',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#E8A33D', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.45, shadowRadius: 24,
    elevation: 8,
  },
  heroActive: {
    backgroundColor: '#2F6B5A',
    shadowColor: '#2F6B5A',
  },
  heroTitle: { fontSize: 36, fontWeight: '800', color: '#3A2206', letterSpacing: -1, lineHeight: 38 },
  heroTitleActive: { color: '#FFFFFF' },
  heroSub: { fontSize: 15, color: '#3A2206', opacity: 0.85, marginTop: 6 },
  heroSubActive: { color: '#FFFFFF' },
  heroCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroCircleActive: {},
  heroCircleText: { fontSize: 28 },

  secondaryRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 20 },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#7A8699',
    textTransform: 'uppercase', letterSpacing: 0.6,
    marginHorizontal: 24, marginBottom: 10,
  },
  kidCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 20, marginBottom: 10 },
  kidInfo: { flex: 1 },
  kidName: { fontSize: 16, fontWeight: '650' as any, color: '#15233A' },
  kidSub: { fontSize: 13, color: '#7A8699', marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#D8C9A8',
    alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#15233A', letterSpacing: -0.3 },
  modalSub: { fontSize: 14, color: '#7A8699', marginTop: 4, marginBottom: 20 },
  modalList: { gap: 10, marginBottom: 24 },
  modalStudentRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 14, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#ECE0C8', backgroundColor: '#FAFAFA',
  },
  modalStudentRowSelected: { borderColor: '#E8A33D', backgroundColor: '#FBF5EA' },
  modalStudentInfo: { flex: 1 },
  modalStudentName: { fontSize: 16, fontWeight: '700', color: '#15233A' },
  modalStudentSub: { fontSize: 13, color: '#7A8699', marginTop: 2 },
  checkbox: {
    width: 26, height: 26, borderRadius: 8,
    borderWidth: 2, borderColor: '#D8C9A8',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: '#E8A33D', borderColor: '#E8A33D' },
  checkmark: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  vehicleLink: { alignItems: 'center', paddingVertical: 6, marginBottom: 4 },
  vehicleLinkText: { fontSize: 13, color: '#2A6FA3', fontWeight: '600' },
  modalConfirm: { marginBottom: 10 },
  modalCancelBtn: { alignItems: 'center', paddingVertical: 12 },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#7A8699' },
});
