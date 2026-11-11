// Beranda GURU (mirip aplikasi driver inDriver): online/offline + pesanan masuk
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { useApp } from '../context/AppContext';
import { SUBJECTS, LEVELS, formatRupiah } from '../data/catalog';

export default function TeacherHomeScreen({ navigation }) {
  const { user, logout, teacherJobs, setTeacherJobs } = useApp();
  const [online, setOnline] = useState(true);

  // Simulasi: generate satu job baru saat guru online & belum ada permintaan
  const incoming = teacherJobs.filter((j) => j.status === 'masuk');
  const active = teacherJobs.find((j) => ['diterima', 'berlangsung'].includes(j.status));

  function simulateIncoming() {
    if (incoming.length > 0 || active) {
      Alert.alert('Sudah ada', 'Selesaikan/tolak permintaan yang ada dulu.');
      return;
    }
    // Ambil contoh murid acak dari data mock
    const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const job = {
      id: 'JOB' + Date.now(),
      studentName: 'Ahmad Rizki',
      studentPhone: '0812-3456-7890',
      subjectId: subject.id, subjectName: subject.name,
      levelId: level.id, levelName: level.name, grade: level.grades[0],
      price: level.price, duration: 60,
      locationLabel: 'Jl. Melati No. 12, Jakarta Selatan (titik belajar)',
      createdAt: new Date().toISOString(),
      status: 'masuk',
    };
    setTeacherJobs((prev) => {
      const next = [job, ...prev];
      return next;
    });
  }

  function acceptJob(id) {
    setTeacherJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'diterima' } : j)));
  }
  function rejectJob(id) {
    setTeacherJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'ditolak' } : j)));
  }
  function startJob(id) {
    setTeacherJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'berlangsung' } : j)));
  }
  function finishJob(id) {
    Alert.alert('Sesi Selesai 💰', `Pendapatan ${formatRupiah(active.price)} dicatat.`, [
      { text: 'OK', onPress: () =>
        setTeacherJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'selesai' } : j))) },
    ]);
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      {/* Header guru */}
      <View style={s.header}>
        <View>
          <Text style={s.hello}>Selamat datang 🌟</Text>
          <Text style={s.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Keluar', 'Ingin keluar?', [
          { text: 'Batal', style: 'cancel' },
          { text: 'Keluar', style: 'destructive', onPress: logout },
        ])}>
          <Ionicons name="log-out-outline" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Status Online */}
      <View style={[s.card, s.onlineCard]}>
        <View style={{ flex: 1 }}>
          <Text style={s.onlineTitle}>Status: {online ? 'ONLINE ✅' : 'OFFLINE 😴'}</Text>
          <Text style={s.onlineSub}>
            {online ? 'Kamu akan menerima permintaan les di sekitar titik belajarmu.' : 'Aktifkan untuk mulai mendapat pesanan.'}
          </Text>
        </View>
        <TouchableOpacity
          style={[s.toggle, online ? s.toggleOn : s.toggleOff]}
          onPress={() => setOnline(!online)}
        >
          <View style={[s.toggleKnob, online && s.toggleKnobOn]} />
        </TouchableOpacity>
      </View>

      {/* Statistik ringkas */}
      <View style={s.statRow}>
        <Stat icon="cash-outline" value={formatRupiah(teacherJobs.filter((j) => j.status === 'selesai').reduce((a, b) => a + b.price, 0))} label="Hari ini" />
        <Stat icon="school-outline" value={`${teacherJobs.filter((j) => j.status === 'selesai').length}`} label="Sesi selesai" />
        <Stat icon="star-outline" value="4.9" label="Rating" />
      </View>

      {/* Sesi aktif */}
      {active && (
        <View style={[s.card, { borderColor: COLORS.primaryLight }]}>
          <Text style={s.cardTitle}>📖 Sesi Aktif — {active.subjectName} ({active.levelName} {active.grade})</Text>
          <Text style={s.jobMeta}>👤 {active.studentName} • ⏱️ {active.duration} menit</Text>
          <Text style={s.jobMeta}>📍 {active.locationLabel}</Text>
          <View style={s.priceBox}><Text style={s.priceText}>{formatRupiah(active.price)}</Text></View>
          {active.status === 'diterima' && (
            <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={() => startJob(active.id)}>
              <Text style={s.btnText}>Mulai Mengajar</Text>
            </TouchableOpacity>
          )}
          {active.status === 'berlangsung' && (
            <TouchableOpacity style={[s.btn, s.btnSuccess]} onPress={() => finishJob(active.id)}>
              <Text style={s.btnText}>Akhiri & Terima Bayaran</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Permintaan masuk */}
      <Text style={s.sectionTitle}>🔔 Permintaan Les Masuk</Text>
      {!online && <Text style={s.offlineNote}>Kamu sedang offline.</Text>}
      {online && incoming.length === 0 && (
        <>
          <Text style={s.empty}>Belum ada permintaan.</Text>
          <TouchableOpacity style={[s.btn, s.btnOutline]} onPress={simulateIncoming}>
            <Text style={[s.btnText, { color: COLORS.primary }]}>🔄 Cek Pesanan Baru (simulasi)</Text>
          </TouchableOpacity>
        </>
      )}
      {incoming.map((j) => (
        <View key={j.id} style={s.card}>
          <Text style={s.cardTitle}>{j.subjectName} — {j.levelName} • {j.grade}</Text>
          <Text style={s.jobMeta}>👤 {j.studentName} • ⏱️ {j.duration} menit</Text>
          <Text style={s.jobMeta}>📍 Titik belajar: {j.locationLabel}</Text>
          <View style={s.priceBox}><Text style={s.priceText}>{formatRupiah(j.price)}</Text></View>
          <View style={s.actionRow}>
            <TouchableOpacity style={[s.btn, s.btnDanger]} onPress={() => rejectJob(j.id)}>
              <Text style={s.btnText}>Tolak</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, s.btnSuccess]} onPress={() => acceptJob(j.id)}>
              <Text style={s.btnText}>Terima</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function Stat({ icon, value, label }) {
  return (
    <View style={s.statCard}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={s.statValue} numberOfLines={1}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  hello: { color: COLORS.textMuted, fontSize: 14 },
  userName: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  onlineCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  onlineTitle: { fontWeight: '900', color: COLORS.text, fontSize: 15 },
  onlineSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  toggle: { width: 56, height: 32, borderRadius: 16, padding: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: COLORS.success },
  toggleOff: { backgroundColor: '#CBD5E1' },
  toggleKnob: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff' },
  toggleKnobOn: { alignSelf: 'flex-end' },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border, gap: 4,
  },
  statValue: { fontWeight: '900', color: COLORS.text, fontSize: 13 },
  statLabel: { color: COLORS.textMuted, fontSize: 11 },
  cardTitle: { fontWeight: '900', fontSize: 15, color: COLORS.text, marginBottom: 6 },
  jobMeta: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  priceBox: {
    marginTop: 10, backgroundColor: '#FEF9C3', borderWidth: 1, borderColor: '#FACC15',
    borderRadius: 10, padding: 8, alignItems: 'center',
  },
  priceText: { fontWeight: '900', color: '#713F12', fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.text, marginBottom: 10 },
  empty: { color: COLORS.textMuted, fontStyle: 'italic', marginBottom: 8 },
  offlineNote: { color: COLORS.danger, fontWeight: '700', marginBottom: 8 },
  btn: { borderRadius: 12, padding: 12, alignItems: 'center', marginVertical: 4, flex: 1 },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnSuccess: { backgroundColor: COLORS.success },
  btnDanger: { backgroundColor: COLORS.danger },
  btnOutline: { backgroundColor: '#fff', borderWidth: 2, borderColor: COLORS.primary },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  actionRow: { flexDirection: 'row', gap: 10 },
});
