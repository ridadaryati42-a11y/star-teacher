// Pilih Jenjang & Kelas (menentukan harga tetap per pesanan)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { SUBJECTS, LEVELS, formatRupiah } from '../data/catalog';

export default function PilihJenjangScreen({ navigation, route }) {
  const { subjectId } = route.params;
  const subject = SUBJECTS.find((x) => x.id === subjectId);
  const [levelId, setLevelId] = useState(null);
  const [grade, setGrade] = useState(null);

  const level = LEVELS.find((l) => l.id === levelId);

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      {/* Kartu mapel terpilih */}
      <View style={[s.subjectCard, { borderColor: subject.color }]}>
        <View style={[s.subjectIcon, { backgroundColor: subject.color + '22' }]}>
          <Ionicons name={subject.icon} size={28} color={subject.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.subjectLabel}>Mata Pelajaran</Text>
          <Text style={[s.subjectName, { color: subject.color }]}>{subject.name}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('PesanGuru', buildParams())}>
          <Text style={s.changeLink}>Ubah Mapel</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.sectionTitle}>1. Pilih Jenjang Pendidikan</Text>
      {LEVELS.map((l) => {
        const selected = levelId === l.id;
        return (
          <TouchableOpacity
            key={l.id}
            style={[s.levelCard, selected && s.levelCardSelected]}
            onPress={() => { setLevelId(l.id); setGrade(null); }}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.levelName}>{l.name}</Text>
              <Text style={s.levelFull}>{l.fullName}</Text>
            </View>
            <View style={s.priceBadge}>
              <Text style={s.priceBadgeText}>{formatRupiah(l.price)}</Text>
            </View>
            {selected && <Ionicons name="check-circle" size={24} color={COLORS.success} style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
        );
      })}

      {level && (
        <>
          <Text style={s.sectionTitle}>2. Pilih Kelas</Text>
          <View style={s.gradeWrap}>
            {level.grades.map((g) => {
              const selected = grade === g;
              return (
                <TouchableOpacity
                  key={g}
                  style={[s.gradeChip, selected && s.gradeChipSelected]}
                  onPress={() => setGrade(g)}
                >
                  <Text style={[s.gradeText, selected && { color: '#fff', fontWeight: '800' }]}>{g}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[s.nextBtn, !grade && s.nextBtnDisabled]}
        disabled={!grade}
        onPress={() => navigation.navigate('PesanGuru', buildParams())}
      >
        <Text style={s.nextBtnText}>Lanjut — {level ? formatRupiah(level.price) : 'Pilih jenjang'}</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );

  function buildParams() {
    return {
      subjectId,
      subjectName: subject.name,
      levelId,
      levelName: level?.name,
      grade,
      price: level?.price,
    };
  }
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  subjectCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff',
    borderRadius: 16, padding: 14, borderWidth: 2, marginBottom: 16,
  },
  subjectIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  subjectLabel: { color: COLORS.textMuted, fontSize: 12 },
  subjectName: { fontSize: 18, fontWeight: '900' },
  changeLink: { color: COLORS.primaryLight, fontWeight: '700', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.text, marginBottom: 10, marginTop: 6 },
  levelCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: COLORS.border,
  },
  levelCardSelected: { borderColor: COLORS.primary, backgroundColor: '#EFF6FF' },
  levelName: { fontWeight: '900', color: COLORS.text, fontSize: 15 },
  levelFull: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  priceBadge: { backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  priceBadgeText: { color: '#166534', fontWeight: '900' },
  gradeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  gradeChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border,
  },
  gradeChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  gradeText: { color: COLORS.text, fontWeight: '600' },
  nextBtn: {
    backgroundColor: COLORS.accent, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 10,
  },
  nextBtnDisabled: { backgroundColor: '#CBD5E1' },
  nextBtnText: { color: '#78350F', fontWeight: '900', fontSize: 16 },
});
