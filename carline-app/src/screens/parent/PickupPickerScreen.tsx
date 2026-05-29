import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PICKUP_TYPES = [
  {
    id: 'carline',
    icon: '🚗',
    title: 'Carline',
    sub: 'Tap when you\'re in line — staff walks them out',
    accentBg: '#FBE9C7',
    accentText: '#C9871F',
  },
  {
    id: 'walkin',
    icon: '🚶',
    title: 'Walk-in',
    sub: "I'm parking and walking up to the door",
    accentBg: '#DCEAF4',
    accentText: '#2A6FA3',
  },
  {
    id: 'early',
    icon: '🕐',
    title: 'Early pickup',
    sub: 'Before dismissal — needs a reason and time',
    accentBg: '#F8E0BF',
    accentText: '#C97A1F',
  },
  {
    id: 'message',
    icon: '💬',
    title: 'Message office',
    sub: 'Send a note — no pickup right now',
    accentBg: '#E7E2D4',
    accentText: '#3B4A66',
  },
];

export function PickupPickerScreen() {
  const navigation = useNavigation<any>();

  const handleChoose = (id: string) => {
    if (id === 'early') navigation.navigate('EarlyPickup');
    else navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerLabel}>New request</Text>
          <Text style={styles.headerTitle}>How are you picking up?</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.list}>
        {PICKUP_TYPES.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleChoose(item.id)}
            activeOpacity={0.75}
            style={styles.row}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.accentBg }]}>
              <Text style={styles.iconText}>{item.icon}</Text>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowSub}>{item.sub}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
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

  list: { padding: 20, gap: 12 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: 18, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#ECE0C8', borderRadius: 18,
    shadowColor: '#15233A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2,
    elevation: 2,
  },
  iconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 26 },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 18, fontWeight: '700', color: '#15233A' },
  rowSub: { fontSize: 13, color: '#7A8699', marginTop: 2 },
  chevron: { fontSize: 24, color: '#7A8699' },
});
