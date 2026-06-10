import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput,
  StyleSheet, SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KidPortrait } from '../../components/ui/KidPortrait';
import { Button } from '../../components/ui/Button';
import { dataSource } from '../../data/provider';
import { useStore } from '../../store';
import type { Student } from '../../models';

const GRADE_FILTERS = ['All', 'K', '1st', '2nd', '3rd', '4th', '5th'];

export function StaffBusScreen() {
  const navigation = useNavigation<any>();
  const { createBusRequest, queue } = useStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busPlate, setBusPlate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadStudents = async () => {
      const allStudents = await Promise.all(
        Array.from({ length: 13 }, (_, i) =>
          dataSource.getStudentById(`s${i + 1}`)
        )
      );
      if (mounted) {
        setStudents(allStudents.filter((s): s is Student => s !== null));
      }
    };
    loadStudents();
    return () => { mounted = false; };
  }, []);

  // Filter out students already loaded on a bus
  const busStudentIds = new Set(
    queue
      .filter(e => e.pickupType === 'bus' && e.status !== 'released')
      .map(e => e.studentId)
  );
  const availableStudents = students.filter(s => !busStudentIds.has(s.id));

  const toggleStudent = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filtered = availableStudents
    .filter(s => {
      if (gradeFilter === 'All') return true;
      const grade = s.grade ?? '';
      if (gradeFilter === 'K') return grade.toLowerCase().includes('kindergarten');
      return grade.toLowerCase().startsWith(gradeFilter.toLowerCase());
    })
    .filter(s => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q)
      );
    });

  const handleLoadBus = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await createBusRequest(selectedIds, busPlate.trim() || undefined);
      setSelectedIds([]);
      setBusPlate('');
      setSearch('');
      navigation.navigate('Queue');
    } catch (err) {
      console.error('Failed to load bus:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Load bus</Text>
        {selectedIds.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{selectedIds.length}</Text>
          </View>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name…"
          placeholderTextColor="#B0BAC9"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Grade filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterWrap}>
        {GRADE_FILTERS.map(g => (
          <TouchableOpacity
            key={g}
            onPress={() => setGradeFilter(g)}
            style={[styles.filterChip, gradeFilter === g && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, gradeFilter === g && styles.filterTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Student list */}
      <FlatList
        data={filtered}
        keyExtractor={s => s.id}
        renderItem={({ item: s }) => {
          const selected = selectedIds.includes(s.id);
          return (
            <TouchableOpacity
              style={[styles.studentRow, selected && styles.studentRowSelected]}
              onPress={() => toggleStudent(s.id)}
              activeOpacity={0.75}
            >
              <KidPortrait initial={s.firstName[0]} tintIndex={s.tintIndex} size={44} />
              <View style={styles.studentInfo}>
                <Text style={[styles.studentName, selected && styles.studentNameSelected]}>
                  {s.firstName} {s.lastName}
                </Text>
                <Text style={styles.studentGrade}>{s.grade} · {s.homeroom}</Text>
              </View>
              <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                {selected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }
      />

      {/* Bus plate input and Load button */}
      {selectedIds.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.plateLabel}>Bus license plate (optional)</Text>
          <TextInput
            style={styles.plateInput}
            value={busPlate}
            onChangeText={setBusPlate}
            placeholder="e.g. BUS-001 or ABC 1234"
            placeholderTextColor="#B0BAC9"
          />
          <Button
            variant="primary"
            size="lg"
            block
            loading={loading}
            onPress={handleLoadBus}
          >
            🚌 Load bus — {selectedIds.length} {selectedIds.length === 1 ? 'student' : 'students'}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF5EA' },

  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#15233A', letterSpacing: -0.4, flex: 1 },
  countBadge: { backgroundColor: '#5A3A8A', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  countText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 10,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: '#15233A' },

  filterScroll: { maxHeight: 80, marginBottom: 20, marginHorizontal: -16, paddingHorizontal: 16 },
  filterWrap: { flexDirection: 'row', gap: 4, paddingRight: 24 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 18,
  },
  filterChipActive: { backgroundColor: '#1F3A5F', borderColor: '#1F3A5F' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#3B4A66' },
  filterTextActive: { color: '#FFFFFF' },

  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100, gap: 0 },
  studentRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 12, marginBottom: 6,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECE0C8',
  },
  studentRowSelected: { backgroundColor: '#EBF0F8', borderColor: '#5A3A8A' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#15233A' },
  studentNameSelected: { color: '#5A3A8A' },
  studentGrade: { fontSize: 12, color: '#7A8699', marginTop: 2 },
  checkbox: {
    width: 26, height: 26, borderRadius: 8,
    borderWidth: 2, borderColor: '#D8C9A8',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: '#5A3A8A', borderColor: '#5A3A8A' },
  checkmark: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#7A8699' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FBF5EA', borderTopWidth: 1, borderTopColor: '#ECE0C8', gap: 10 },
  plateLabel: { fontSize: 12, fontWeight: '600', color: '#7A8699' },
  plateInput: {
    backgroundColor: '#FFFFFF', color: '#15233A',
    borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 10,
    padding: 12, fontSize: 15, marginBottom: 6,
  },
});
