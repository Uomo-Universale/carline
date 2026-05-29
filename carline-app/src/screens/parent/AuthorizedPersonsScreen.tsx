import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { dataSource } from '../../data/provider';
import type { AuthorizedPickup, Student } from '../../models';

export function AuthorizedPersonsScreen() {
  const [persons, setPersons] = useState<AuthorizedPickup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    dataSource.getCurrentGuardian().then(g => {
      Promise.all([
        dataSource.getAuthorizedPickups(g.id),
        dataSource.getStudentsForGuardian(g.id),
      ]).then(([pickups, studs]) => {
        setPersons(pickups);
        setStudents(studs);
      });
    });
  }, []);

  const getStudentName = (id: string) => {
    const s = students.find(st => st.id === id);
    return s ? s.firstName : id;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Authorized for pickup</Text>
        <Text style={styles.pageSub}>People who may pick up your children from school</Text>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            To add or remove authorized persons, contact the school office. Changes require updated authorization forms.
          </Text>
        </View>

        <View style={styles.list}>
          {persons.map(person => (
            <View key={person.id} style={styles.row}>
              <Avatar name={person.name} size={48} />
              <View style={styles.rowInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.personName}>{person.name}</Text>
                  {person.isPrimary && (
                    <View style={styles.primaryChip}>
                      <Text style={styles.primaryText}>Primary</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.relation}>{person.relation}</Text>
                <Text style={styles.studentList}>
                  Can pick up: {person.studentIds.map(getStudentName).join(', ')}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {persons.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No authorized persons on file</Text>
            <Text style={styles.emptySub}>Contact the school office to add them</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF5EA' },
  content: { padding: 20, paddingBottom: 40, gap: 16 },

  pageTitle: { fontSize: 22, fontWeight: '700', color: '#15233A', letterSpacing: -0.3 },
  pageSub: { fontSize: 13, color: '#7A8699', marginTop: 2 },

  notice: {
    backgroundColor: '#E5EAF1',
    borderWidth: 1, borderColor: '#C8D5E6', borderRadius: 12,
    padding: 12,
  },
  noticeText: { fontSize: 13, color: '#3B4A66', lineHeight: 18 },

  list: { gap: 12 },
  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    padding: 16, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#ECE0C8', borderRadius: 16,
    shadowColor: '#15233A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
    elevation: 1,
  },
  rowInfo: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  personName: { fontSize: 16, fontWeight: '700', color: '#15233A' },
  primaryChip: {
    backgroundColor: '#1F3A5F', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  primaryText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  relation: { fontSize: 13, color: '#7A8699', fontWeight: '500' },
  studentList: { fontSize: 12, color: '#7A8699', marginTop: 2 },

  empty: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 17, fontWeight: '600', color: '#15233A' },
  emptySub: { fontSize: 13, color: '#7A8699' },
});
