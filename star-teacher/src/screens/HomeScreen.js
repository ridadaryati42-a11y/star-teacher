// Beranda MURID: pesan guru -> pilih Mapel & Jenjang (harga tetap, bukan jarak)
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { useApp } from '../context/AppContext';
import { SUBJECTS, LEVELS, formatRupiah } from '../data/catalog';

export default function HomeScreen({ navigation }) {
  const { user, orders, updateOrder, logout } = useApp();
  const active = orders.find((o) => ['mencari_guru', 'diterima', 'berlangsung'].includes(o.status));

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.hello}>Assalamu’alaikum 👋</Text>
          <Text style={s.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Keluar', 'Ingin keluar dari akun?', [
          { text: 'Batal', style: 'cancel' },
          { text: 'Keluar', style: 'destructive', onPress: logout },
        ])}>
          <Ionicons name="log-out-outline" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Banner harga */}
      <View style={s.banner}>
        <Ionicons name="star" size={22} color={COLORS.accent} />
        <Text style={s.bannerText}>
          Harga sesuai Mata Pelajaran & Jenjang — bukan jarak! 🎯
        </Text>
      </View>

      {/* Pemesanan aktif */}
      {active && (
        <TouchableOpacity
          style={[s.card, s.activeCard]}
          onPress={() => navigation.navigate('StatusPesanan', { orderId: active.id })}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.activeTitle}>⏳ Pesanan sedang berjalan</Text>
            <Text style={s.activeSub}>
              {subjectName(active.subjectId)} • {active.levelName} • {active.grade}
            </Text>
            <Text style={s.activeStatus}>
              Status: {statusLabel(active.status)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* Pilih Mata Pelajaran */}
      <Text style={s.sectionTitle}>Pilih Mata Pelajaran</Text>
      <View style={s.grid}>
        {SUBJECTS.map((sub) => (
          <TouchableOpacity
            key={sub.id}
            style={[s.tile, { borderColor: sub.color }]}
            onPress={() => navigation.navigate('PilihJenjang', { subjectId: sub.id })}
          >
            <View style={[s.tileIcon, { backgroundColor: sub.color + '22' }]}>
              <Ionicons name={sub.icon} size={30} color={sub.color} />
            </View>
            <Text style={s.tileText}>{sub.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tabel harga */}
      <Text style={s.sectionTitle}>Daftar Harga per Jenjang</Text>
      <View style={s.card}>
        {LEVELS.map((l, i) => (
          <View key={l.id} style={[s.priceRow, i < LEVELS.length - 1 && s.priceRowBorder]}>
            <View style={{ flex: 1 }}>
              <Text style={s.priceLevel}>{l.name}</Text>
              <Text style={s.priceGrades}>{l.grades.join(', ')}</Text>
            </View>
            <Text style={s.priceValue}>{formatRupiah(l.price)}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.bigBtn} onPress={() => navigation.navigate('PilihJenjang', { subjectId: SUBJECTS[0].id })}>
        <Ionicons name="school" size={22} color="#fff" />
        <Text style={s.bigBtnText}>Pesan Guru Sekarang</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function subjectName(id) {
  return SUBJECTS.find((x) => x.id === id)?.name || id;
}
export function statusLabel(st) {
  switch (st) {
    case 'mencari_guru': return 'Mencari guru…';
    case 'diterima': return 'Guru menerima pesanan ✅';
    case 'berlangsung': return 'Les sedang berlangsung 📖';
    case 'selesai': return 'Selesai ✔️';
    case 'dibatalkan': return 'Dibatalkan ❌';
    default: return st;
  }
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  hello: { color: COLORS.textMuted, fontSize: 14 },
  userName: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EFF6FF',
    borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 12, marginBottom: 14,
  },
  bannerText: { color: COLORS.primary, fontWeight: '700', fontSize: 13, flex: 1 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  activeCard: { flexDirection: 'row', alignItems: 'center', borderColor: COLORS.primaryLight, backgroundColor: '#F0F9FF' },
  activeTitle: { fontWeight: '900', color: COLORS.primary, fontSize: 15 },
  activeSub: { color: COLORS.text, marginTop: 2 },
  activeStatus: { color: COLORS.textMuted, marginTop: 2, fontSize: 13 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: COLORS.text, marginBottom: 12, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  tile: {
    width: '47%', backgroundColor: '#fff', borderRadius: 16, padding: 16,
    alignItems: 'center', borderWidth: 2, flexGrow: 1,
  },
  tileIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  tileText: { fontWeight: '800', color: COLORS.text, fontSize: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  priceRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  priceLevel: { fontWeight: '800', color: COLORS.text },
  priceGrades: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  priceValue: { fontWeight: '900', color: COLORS.success, fontSize: 16 },
  bigBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  bigBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});
