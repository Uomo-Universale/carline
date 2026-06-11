import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { dataSource } from '../../data/provider';
import type { Student, PickupType } from '../../models';

const TINT_COLORS = ['#2F6B5A', '#2A6FA3', '#C97A1F', '#7A4A8A', '#A8392E'];

const TYPE_OPTIONS: { key: PickupType; label: string; icon: string }[] = [
  { key: 'carline', label: 'Car', icon: '🚗' },
  { key: 'walkin',  label: 'Walk-in', icon: '🚶' },
];

export function StaffManualPickupScreen() {
  const navigation = useNavigation<any>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pickupPerson, setPickupPerson] = useState('');
  const [plate, setPlate] = useState('');
  const [pickupType, setPickupType] = useState<PickupType>('carline');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dataSource.getAllStudents()
      .then(setStudents)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.homeroom.toLowerCase().includes(q) ||
      s.grade.toLowerCase().includes(q)
    );
  }, [students, search]);

  const toggleStudent = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selected.size || !pickupPerson.trim()) return;
    setSubmitting(true);
    try {
      await dataSource.createPickupRequest({
        guardianId: '',
        studentIds: Array.from(selected),
        type: pickupType,
        pickupPersonName: pickupPerson.trim(),
        manualPlate: plate.trim() || undefined,
      });
      navigation.goBack();
    } catch (e) {
      console.error('Manual pickup failed:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStudent = ({ item: s }: { item: Student }) => {
    const isSelected = selected.has(s.id);
    const color = TINT_COLORS[s.tintIndex % TINT_COLORS.length];
    return (
      <TouchableOpacity
        onPress={() => toggleStudent(s.id)}
        activeOpacity={0.75}
        style={[styles.studentRow, isSelected && styles.studentRowSelected]}
      >
        <View style={[styles.avatar, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.avatarText, { color }]}>
            {s.firstName[0]}{s.lastName[0]}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{s.firstName} {s.lastName}</Text>
          <Text style={styles.studentSub}>{s.grade} · {s.homeroom} · {s.teacherName}</Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const canSubmit = selected.size > 0 && pickupPerson.trim().length > 0 && !submitting;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#15233A" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manual pickup</Text>
          <Text style={styles.headerSub}>Staff-initiated · no app login required</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search student by name, grade, homeroom…"
          placeholderTextColor="#B0BAC9"
          clearButtonMode="while-editing"
          autoFocus
        />
      </View>

      {/* Selected count */}
      {selected.size > 0 && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            {selected.size} student{selected.size > 1 ? 's' : ''} selected
          </Text>
          <TouchableOpacity onPress={() => setSelected(new Set())}>
            <Text style={styles.clearSelection}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Student list */}
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color="#C97A1F" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={s => s.id}
            renderItem={renderStudent}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No students found</Text>
              </View>
            }
          />
        )}

        {/* Bottom form */}
        <View style={styles.form}>
          <Text style={styles.formLabel}>Who is picking up?</Text>
          <TextInput
            style={styles.formInput}
            value={pickupPerson}
            onChangeText={setPickupPerson}
            placeholder="Full name (e.g. Rachel Adler)"
            placeholderTextColor="#B0BAC9"
          />

          <Text style={[styles.formLabel, { marginTop: 12 }]}>License plate (optional)</Text>
          <TextInput
            style={styles.formInput}
            value={plate}
            onChangeText={t => setPlate(t.toUpperCase())}
            placeholder="e.g. ABC 1234"
            placeholderTextColor="#B0BAC9"
            autoCapitalize="characters"
          />

          <Text style={[styles.formLabel, { marginTop: 12 }]}>Pickup type</Text>
          <View style={styles.typeRow}>
            {TYPE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.typeChip, pickupType === opt.key && styles.typeChipActive]}
                onPress={() => setPickupType(opt.key)}
              >
                <Text style={styles.typeChipIcon}>{opt.icon}</Text>
                <Text style={[styles.typeChipText, pickupType === opt.key && styles.typeChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                {selected.size > 0
                  ? `Add ${selected.size} student${selected.size > 1 ? 's' : ''} to queue`
                  : 'Select students above'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#15233A' },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: 20, paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  headerSub: { fontSize: 13, color: '#7A8699', marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 16, color: '#FFFFFF', fontWeight: '600' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 15, color: '#FFFFFF' },

  selectionBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 16, marginBottom: 6,
    backgroundColor: '#C97A1F22', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#C97A1F55',
  },
  selectionText: { fontSize: 13, fontWeight: '600', color: '#E8A33D' },
  clearSelection: { fontSize: 13, fontWeight: '600', color: '#7A8699' },

  list: { paddingHorizontal: 16, paddingVertical: 8, gap: 6 },

  studentRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  studentRowSelected: {
    backgroundColor: 'rgba(201, 122, 31, 0.15)',
    borderColor: '#C97A1F',
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarText: { fontSize: 14, fontWeight: '700' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  studentSub: { fontSize: 12, color: '#7A8699', marginTop: 1 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#3B4A66',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: '#C97A1F', borderColor: '#C97A1F' },
  checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 15, color: '#7A8699' },

  // Bottom form
  form: {
    backgroundColor: '#FBF5EA',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 32,
    gap: 4,
  },
  formLabel: { fontSize: 12, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.5 },
  formInput: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: '#15233A', marginTop: 6,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  typeChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 44, borderRadius: 12,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8',
  },
  typeChipActive: { backgroundColor: '#1F3A5F', borderColor: '#1F3A5F' },
  typeChipIcon: { fontSize: 16 },
  typeChipText: { fontSize: 14, fontWeight: '600', color: '#3B4A66' },
  typeChipTextActive: { color: '#FFFFFF' },

  submitBtn: {
    marginTop: 16, backgroundColor: '#15233A',
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#B0BAC9' },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
