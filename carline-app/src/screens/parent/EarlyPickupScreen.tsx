import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { KidPortrait } from '../../components/ui/KidPortrait';
import { dataSource } from '../../data/provider';
import type { Student, EarlyPickupReason } from '../../models';

const REASONS: { id: EarlyPickupReason; label: string; icon: string }[] = [
  { id: 'doctor',   label: 'Medical',   icon: '🏥' },
  { id: 'family',   label: 'Family',    icon: '👨‍👩‍👧' },
  { id: 'religious', label: 'Religious', icon: '✡️' },
  { id: 'other',    label: 'Other',     icon: '📝' },
];

export function EarlyPickupScreen() {
  const navigation = useNavigation<any>();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [reason, setReason] = useState<EarlyPickupReason | ''>('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dataSource.getCurrentGuardian().then(g =>
      dataSource.getStudentsForGuardian(g.id).then(s => {
        setStudents(s);
        setSelectedStudents(s.map(st => st.id));
      })
    );
  }, []);

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const canSubmit = selectedStudents.length > 0 && reason !== '';

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const guardian = await dataSource.getCurrentGuardian();
      const req = await dataSource.createPickupRequest({
        guardianId: guardian.id,
        studentIds: selectedStudents,
        type: 'early',
        earlyPickupReason: reason as EarlyPickupReason,
        earlyPickupNote: note.trim() || undefined,
      });
      navigation.replace('LiveStatus', { requestId: req.id, studentId: selectedStudents[0] });
    } catch {
      Alert.alert('Error', 'Could not submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerLabel}>Pickup request</Text>
          <Text style={styles.headerTitle}>Early pickup</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Student selector */}
        <Text style={styles.sectionLabel}>Who is leaving early?</Text>
        <View style={styles.studentRow}>
          {students.map(s => {
            const selected = selectedStudents.includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => toggleStudent(s.id)}
                style={[styles.studentChip, selected && styles.studentChipSelected]}
              >
                <KidPortrait initial={s.firstName[0]} tintIndex={s.tintIndex} size={36} />
                <View>
                  <Text style={[styles.studentName, selected && styles.studentNameSelected]}>{s.firstName}</Text>
                  <Text style={styles.studentGrade}>{s.grade}</Text>
                </View>
                {selected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Reason */}
        <Text style={styles.sectionLabel}>Reason</Text>
        <View style={styles.reasonRow}>
          {REASONS.map(r => (
            <TouchableOpacity
              key={r.id}
              onPress={() => setReason(r.id)}
              style={[styles.reasonChip, reason === r.id && styles.reasonChipSelected]}
            >
              <Text style={styles.reasonIcon}>{r.icon}</Text>
              <Text style={[styles.reasonLabel, reason === r.id && styles.reasonLabelSelected]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.sectionLabel}>Note for the office <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Orthodontist on Atlantic Ave…"
          placeholderTextColor="#B0BAC9"
          multiline
          numberOfLines={3}
          maxLength={200}
        />

        {/* Notice */}
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            A staff member will bring your child to you shortly. You'll see their status update in real time.
          </Text>
        </View>

        <Button
          variant="accent"
          size="lg"
          block
          loading={submitting}
          onPress={handleSubmit}
        >
          Send request
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF5EA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingBottom: 8,
  },
  closeBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 18, color: '#15233A' },
  headerLabel: { fontSize: 11, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.6 },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#15233A', letterSpacing: -0.3 },

  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, gap: 12 },

  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#3B4A66', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  optional: { fontWeight: '400', textTransform: 'none', color: '#7A8699' },

  studentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  studentChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, backgroundColor: '#FFFFFF',
    borderWidth: 1.5, borderColor: '#ECE0C8', borderRadius: 16,
  },
  studentChipSelected: { borderColor: '#1F3A5F', backgroundColor: '#EBF0F8' },
  studentName: { fontSize: 15, fontWeight: '650' as any, color: '#15233A' },
  studentNameSelected: { color: '#1F3A5F' },
  studentGrade: { fontSize: 12, color: '#7A8699' },
  checkmark: { fontSize: 16, color: '#1F3A5F', marginLeft: 4 },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 10,
  },
  timeChipSelected: { backgroundColor: '#1F3A5F', borderColor: '#1F3A5F' },
  timeText: { fontSize: 15, fontWeight: '600', color: '#15233A' },
  timeTextSelected: { color: '#FFFFFF' },

  reasonRow: { flexDirection: 'row', gap: 8 },
  reasonChip: {
    flex: 1, alignItems: 'center', gap: 4,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 14,
  },
  reasonChipSelected: { backgroundColor: '#E8F0FB', borderColor: '#1F3A5F', borderWidth: 1.5 },
  reasonIcon: { fontSize: 22 },
  reasonLabel: { fontSize: 12, fontWeight: '600', color: '#15233A' },
  reasonLabelSelected: { color: '#1F3A5F' },

  noteInput: {
    backgroundColor: '#FFFFFF', color: '#15233A',
    borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 14,
    padding: 14, fontSize: 15, minHeight: 80, textAlignVertical: 'top',
  },

  notice: {
    backgroundColor: '#E5EAF1',
    borderWidth: 1, borderColor: '#C8D5E6', borderRadius: 12,
    padding: 12,
  },
  noticeText: { fontSize: 13, color: '#3B4A66', lineHeight: 18 },
});
