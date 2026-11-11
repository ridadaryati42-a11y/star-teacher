// Profil Guru: mata pelajaran & jenjang yang diajar + tarif tetap per jenjang
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { useApp } from '../context/AppContext';
import { SUBJECTS, LEVELS, formatRupiah } from '../data/catalog';

export default function TeacherProfileScreen() {
  const { user } = useApp();
  // Contoh: guru SD/SMP mengajarkan semua mapel yang tersedia di katalog
  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      <View style={s.card}>
        <View style={s.avatar}><Text style={s.avatarText}>{(user?.name || 'G')[0]}</Text></View>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.phone}>{user?.phone} • GURU STAR TEACHER</Text>
        <View style={s.ratingRow}>
          <Ionicons name="star" size={18} color={COLORS.accent} />
          <Text style={s.ratingText}>4.9 • 320 sesi mengajar</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>Mapel yang Kamu Ajarkan</Text>
      <View style={s.chipWrap}>
        {SUBJECTS.map((sub) => (
          <View key={sub.id} style={[s.chip, { borderColor: sub.color }]}>
            <Ionicons name={sub.icon} size={18} color={sub.color} />
            <Text style={[s.chipText, { color: sub.color }]}>{sub.name}</Text>
          </View>
        ))}
      </View>

      <Text style={s.sectionTitle}>Tarif per Jenjang (tetap, bukan per jarak)</Text>
      {LEVELS.map((l) => (
        <View key={l.id} style={s.tarifRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.tarifLevel}>{l.name}</Text>
            <Text style={s.tarifGrades}>{l.grades.join(', ')}</Text>
          </View>
          <Text style={s.tarifPrice}>{formatRupiah(l.price)}</Text>
        </View>
      ))}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '900' },
  name: { fontWeight: '900', fontSize: 17, color: COLORS.text },
  phone: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  ratingRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 10 },
  ratingText: { fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: COLORS.text, marginBottom: 10, marginTop: 6 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 18, borderWidth: 1.5, backgroundColor: '#fff',
  },
  chipText: { fontWeight: '700', fontSize: 13 },
  tarifRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  tarifLevel: { fontWeight: '800', color: COLORS.text },
  tarifGrades: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  tarifPrice: { fontWeight: '900', color: COLORS.success, fontSize: 15 },
});
