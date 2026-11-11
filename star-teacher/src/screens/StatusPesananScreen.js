// Status Pesanan (mirip status perjalanan inDriver): mencari guru -> diterima -> berlangsung -> selesai
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../data/catalog';
import { statusLabel } from './HomeScreen';

const STEPS = ['mencari_guru', 'diterima', 'berlangsung', 'selesai'];

export default function StatusPesananScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { orders, updateOrder } = useApp();
  const order = orders.find((o) => o.id === orderId);
  const [ratingGiven, setRatingGiven] = useState(false);

  if (!order) {
    return (
      <View style={s.center}>
        <Text>Pesanan tidak ditemukan.</Text>
      </View>
    );
  }

  const stepIndex = STEPS.indexOf(order.status);

  const startLesson = () => updateOrder(order.id, { status: 'berlangsung' });
  const finishLesson = () => {
    Alert.alert(
      'Selesaikan Les',
      `Konfirmasi pembayaran ${formatRupiah(order.price)} untuk ${order.subjectName} ${order.levelName}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya, Selesai', onPress: () => updateOrder(order.id, { status: 'selesai' }) },
      ]
    );
  };
  const cancelOrder = () => {
    Alert.alert('Batalkan Pesanan', 'Yakin membatalkan pesanan les ini?', [
      { text: 'Tidak', style: 'cancel' },
      { text: 'Ya, Batalkan', style: 'destructive', onPress: () => updateOrder(order.id, { status: 'dibatalkan' }) },
    ]);
  };
  const callTeacher = () => Linking.openURL(`tel:${order.teacher?.phone || '081234567890'}`).catch(() => {});
  const chatTeacher = () =>
    Alert.alert('Chat dengan Guru', `Fitur chat segera hadir.\nSementara hubungi ${order.teacher?.name} via telepon.`);

  const rateNow = () => {
    setRatingGiven(true);
    Alert.alert('Terima kasih! ⭐', 'Rating 5 bintang kamu tercatat untuk ' + order.teacher?.name);
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      {/* Timeline status */}
      <View style={s.card}>
        <Text style={s.cardTitle}>🧭 Status Pesanan — {order.id}</Text>
        {order.status === 'dibatalkan' ? (
          <Text style={s.cancelled}>Pesanan dibatalkan ❌</Text>
        ) : (
          STEPS.map((st, i) => {
            const done = i <= stepIndex;
            return (
              <View key={st} style={s.stepRow}>
                <View style={[s.stepDot, done && s.stepDotDone]}>
                  {done && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.stepText, done && { fontWeight: '900', color: COLORS.primary }]}>
                    {statusLabel(st)}
                  </Text>
                  {i < STEPS.length - 1 && <View style={s.stepLine} />}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Detail pesanan */}
      <View style={s.card}>
        <Text style={s.cardTitle}>📋 Detail</Text>
        <Detail label="Mata Pelajaran" value={order.subjectName} />
        <Detail label="Jenjang / Kelas" value={`${order.levelName} — ${order.grade}`} />
        <Detail label="Durasi" value={`${order.duration} menit`} />
        <Detail label="Titik Tempat Belajar" value={order.locationLabel} />
        {order.note ? <Detail label="Catatan" value={order.note} /> : null}
        <View style={s.priceBox}>
          <Text style={s.priceLabel}>TOTAL (harga mapel + jenjang)</Text>
          <Text style={s.priceValue}>{formatRupiah(order.price)}</Text>
        </View>
      </View>

      {/* Kartu guru seperti kartu driver di inDriver */}
      {order.teacher && (
        <View style={s.card}>
          <Text style={s.cardTitle}>🧑‍🏫 Guru Kamu</Text>
          <View style={s.teacherRow}>
            <View style={[s.avatar, { backgroundColor: order.teacher.photoColor }]}>
              <Text style={s.avatarText}>★</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.teacherName}>{order.teacher.name}</Text>
              <Text style={s.teacherMeta}>⭐ {order.teacher.rating} • {order.teacher.sessions} sesi</Text>
            </View>
            <TouchableOpacity style={s.iconBtn} onPress={callTeacher}>
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[s.iconBtn, s.iconBtnOutline]} onPress={chatTeacher}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Aksi sesuai status */}
      {order.status === 'mencari_guru' && (
        <TouchableOpacity style={[s.btn, s.btnDanger]} onPress={cancelOrder}>
          <Text style={s.btnText}>Batalkan Pesanan</Text>
        </TouchableOpacity>
      )}
      {order.status === 'diterima' && (
        <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={startLesson}>
          <Text style={s.btnText}>Mulai Sesi Belajar</Text>
        </TouchableOpacity>
      )}
      {order.status === 'berlangsung' && (
        <TouchableOpacity style={[s.btn, s.btnSuccess]} onPress={finishLesson}>
          <Text style={s.btnText}>Selesaikan & Bayar {formatRupiah(order.price)}</Text>
        </TouchableOpacity>
      )}
      {order.status === 'selesai' && !ratingGiven && (
        <TouchableOpacity style={[s.btn, s.btnAccent]} onPress={rateNow}>
          <Text style={[s.btnText, { color: '#78350F' }]}>⭐ Beri Rating Guru</Text>
        </TouchableOpacity>
      )}
      {order.status === 'selesai' && ratingGiven && (
        <View style={s.thanks}><Text style={s.thanksText}>✅ Terima kasih atas rating kamu!</Text></View>
      )}

      <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => navigation.popToTop()}>
        <Text style={[s.btnText, { color: COLORS.textMuted }]}>Kembali ke Beranda</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function Detail({ label, value }) {
  return (
    <View style={s.detailRow}>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontWeight: '900', fontSize: 15, color: COLORS.text, marginBottom: 12 },
  stepRow: { flexDirection: 'row', gap: 12, minHeight: 44 },
  stepDot: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: COLORS.success },
  stepText: { color: COLORS.textMuted, fontSize: 14 },
  stepLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 4, marginLeft: 11 },
  cancelled: { color: COLORS.danger, fontWeight: '800', fontSize: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, gap: 12 },
  detailLabel: { color: COLORS.textMuted, flex: 1 },
  detailValue: { fontWeight: '700', color: COLORS.text, flex: 1.4, textAlign: 'right' },
  priceBox: {
    marginTop: 10, backgroundColor: '#FEF9C3', borderWidth: 1, borderColor: '#FACC15',
    borderRadius: 12, padding: 12, alignItems: 'center',
  },
  priceLabel: { fontSize: 11, fontWeight: '700', color: '#854D0E' },
  priceValue: { fontSize: 22, fontWeight: '900', color: '#713F12' },
  teacherRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  teacherName: { fontWeight: '800', color: COLORS.text },
  teacherMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  iconBtn: {
    backgroundColor: COLORS.success, width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnOutline: { backgroundColor: '#EFF6FF' },
  btn: { borderRadius: 14, padding: 16, alignItems: 'center', marginVertical: 6 },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnSuccess: { backgroundColor: COLORS.success },
  btnDanger: { backgroundColor: '#fff', borderWidth: 2, borderColor: COLORS.danger },
  btnAccent: { backgroundColor: COLORS.accent },
  btnGhost: { backgroundColor: 'transparent' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  thanks: { backgroundColor: '#DCFCE7', borderRadius: 12, padding: 14, alignItems: 'center' },
  thanksText: { color: '#166534', fontWeight: '800' },
});
