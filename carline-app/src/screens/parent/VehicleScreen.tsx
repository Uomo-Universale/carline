import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { LicensePlate } from '../../components/ui/LicensePlate';
import { Button } from '../../components/ui/Button';
import { dataSource } from '../../data/provider';
import type { Vehicle } from '../../models';

const COLOR_OPTIONS: { label: string; hex: string }[] = [
  { label: 'Forest Green', hex: '#2F5A3A' },
  { label: 'Charcoal',     hex: '#2B2B30' },
  { label: 'White',        hex: '#F2EEE5' },
  { label: 'Silver',       hex: '#B8BCC2' },
  { label: 'Navy',         hex: '#1F3A5F' },
  { label: 'Red',          hex: '#A8392E' },
  { label: 'Beige',        hex: '#D8C39A' },
];

export function VehicleScreen() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('Forest Green');
  const [plate, setPlate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dataSource.getCurrentGuardian().then(g =>
      dataSource.getVehiclesForGuardian(g.id).then(vehicles => {
        const v = vehicles.find(v => v.isActive) ?? vehicles[0];
        if (v) {
          setVehicle(v);
          setYear(v.year);
          setMake(v.make);
          setModel(v.model);
          setColor(v.color);
          setPlate(v.plate);
        }
      })
    );
  }, []);

  const selectedHex = COLOR_OPTIONS.find(c => c.label === color)?.hex ?? '#999';

  const handleSave = async () => {
    setSaving(true);
    try {
      const guardian = await dataSource.getCurrentGuardian();
      await dataSource.saveVehicle({
        guardianId: guardian.id,
        year, make, model, color,
        colorHex: selectedHex,
        plate: plate.toUpperCase(),
        state: vehicle?.state ?? 'NY',
        isActive: true,
      });
      Alert.alert('Saved', 'Your vehicle has been updated.');
    } catch {
      Alert.alert('Error', 'Could not save vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF5EA" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>What we look for</Text>
        <Text style={styles.pageSub}>Staff sees this card at the curb</Text>

        {/* Preview card */}
        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Staff sees this card</Text>
          <View style={styles.previewRow}>
            <View style={[styles.colorSwatch, { backgroundColor: selectedHex }]} />
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>{color} {make} {model}</Text>
              <Text style={styles.previewYear}>{year}</Text>
            </View>
            <LicensePlate plate={plate || 'RDS 0000'} state="NY" size="md" />
          </View>
        </View>

        {/* Form */}
        <View style={styles.formRow}>
          <View style={styles.field} >
            <Text style={styles.fieldLabel}>Year</Text>
            <TextInput style={styles.input} value={year} onChangeText={setYear} keyboardType="numeric" maxLength={4} />
          </View>
          <View style={[styles.field, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>Make</Text>
            <TextInput style={styles.input} value={make} onChangeText={setMake} />
          </View>
          <View style={[styles.field, { flex: 3 }]}>
            <Text style={styles.fieldLabel}>Model</Text>
            <TextInput style={styles.input} value={model} onChangeText={setModel} />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Color · Staff matches by color first</Text>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map(c => (
              <TouchableOpacity
                key={c.label}
                onPress={() => setColor(c.label)}
                style={[styles.colorChip, color === c.label && styles.colorChipSelected]}
              >
                <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
                <Text style={[styles.colorLabel, color === c.label && styles.colorLabelSelected]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>License plate</Text>
          <TextInput
            style={[styles.input, styles.plateInput]}
            value={plate}
            onChangeText={t => setPlate(t.toUpperCase())}
            autoCapitalize="characters"
            maxLength={8}
          />
        </View>

        <Button variant="primary" size="lg" block loading={saving} onPress={handleSave}>
          Save vehicle
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF5EA' },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#15233A', letterSpacing: -0.3 },
  pageSub: { fontSize: 13, color: '#7A8699', marginTop: 4 },

  previewCard: {
    padding: 18, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#ECE0C8', borderRadius: 18,
    gap: 10,
  },
  previewLabel: { fontSize: 11, fontWeight: '700', color: '#7A8699', textTransform: 'uppercase', letterSpacing: 0.6 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  colorSwatch: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)' },
  previewInfo: { flex: 1 },
  previewName: { fontSize: 16, fontWeight: '650' as any, color: '#15233A' },
  previewYear: { fontSize: 11, color: '#7A8699' },

  formRow: { flexDirection: 'row', gap: 10 },
  field: { flex: 1, gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#3B4A66' },
  input: {
    backgroundColor: '#FFFFFF', color: '#15233A',
    borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 10,
    padding: 12, fontSize: 16,
  },
  plateInput: { fontFamily: 'Courier', letterSpacing: 1 },

  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 5, paddingRight: 10, paddingLeft: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#D8C9A8', borderRadius: 999,
  },
  colorChipSelected: { backgroundColor: '#E5EAF1', borderWidth: 1.5, borderColor: '#1F3A5F' },
  colorDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)' },
  colorLabel: { fontSize: 13, fontWeight: '600', color: '#15233A' },
  colorLabelSelected: { color: '#1F3A5F' },
});
