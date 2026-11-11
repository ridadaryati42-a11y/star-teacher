// Riwayat pesanan murid + informasi akun
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../data/catalog';

export default function RiwayatScreen({ navigation }) {
  const { orders, user, logout } = useApp();

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      {/* Kartu akun */}
      <View style={s.accountCard}>
        <View style={s.avatar}><Text style={s.avatarText}>{(user?.name || 'S')[0]}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.accName}>{user?.name}</Text>
          <Text style={s.accPhone}>{user?.phone} • MURID</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>📚 Riwayat Pemesanan Les</Text>

      {orders.length === 0 && (
        <View style={s.emptyCard}>
          <Ionicons name="book" size={42} color="#CBD5E1" />
          <Text style={s.emptyText}>Belum ada pesanan. Yuk pesan guru pertamamu!</Text>
        </View>
      )}

      {orders.map((o) => (
        <TouchableOpacity
          key={o.id}
          style={s.card}
          onPress={() => navigation.navigate('StatusPesanan', { orderId: o.id })}
        >
          <View style={s.rowTop}>
            <Text style={s.subject}>{o.subjectName}</Text>
            <Text style={[s.status, statusColor(o.status)]}>{o.status.replace('_', ' ')}</Text>
          </View>
          <Text style={s.meta}>{o.levelName} — {o.grade} • {o.duration} menit</Text>
          <Text style={s.metaLoc} numberOfLines={1}>📍 {o.locationLabel}</Text>
          <Text style={s.teacher}>🧑‍🏫 {o.teacher?.name || '-'}</Text>
          <View style={s.rowBottom}>
            <Text style={s.date}>{new Date(o.createdAt).toLocaleString('id-ID')}</Text>
            <Text style={s.price}>{formatRupiah(o.price)}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={s.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <Text style={s.logoutText}>Keluar</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function statusColor(st) {
  switch (st) {
    case 'selesai': return { color: COLORS.success };
    case 'dibatalkan': return { color: COLORS.danger };
    default: return { color: '#B45309' };
  }
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  accountCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.primary,
    borderRadius: 16, padding: 16, marginBottom: 16,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#78350F' },
  accName: { color: '#fff', fontWeight: '900', fontSize: 16 },
  accPhone: { color: '#CBD5E1', fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.text, marginBottom: 10 },
  emptyCard: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  emptyText: { color: COLORS.textMuted },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subject: { fontWeight: '900', fontSize: 15, color: COLORS.text },
  status: { fontWeight: '800', fontSize: 12, textTransform: 'capitalize' },
  meta: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  metaLoc: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  teacher: { color: COLORS.text, fontSize: 13, marginTop: 4, fontWeight: '600' },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  date: { color: '#94A3B8', fontSize: 11 },
  price: { color: COLORS.success, fontWeight: '900' },
  logoutBtn: {
    flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center',
    padding: 14, marginTop: 8,
  },
  logoutText: { color: COLORS.danger, fontWeight: '800' },
});
