// Layar Pemesanan: titik lokasi belajar (menggantikan "tujuan perjalanan" di inDriver)
// + daftar guru yang cocok + konfirmasi harga tetap
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../theme';
import { useApp } from '../context/AppContext';
import { findMatchedTeachers, formatRupiah, DURATIONS } from '../data/catalog';

export default function PesanGuruScreen({ navigation, route }) {
  const { subjectId, subjectName, levelId, levelName, grade, price } = route.params;
  const { user, createOrder } = useApp();

  const [locationLabel, setLocationLabel] = useState(null); // teks alamat / koordinat
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [duration, setDuration] = useState(60);
  const [note, setNote] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const teachers = findMatchedTeachers(subjectId, levelId);

  useEffect(() => {
    requestCurrentLocation();
    return () => {};
  }, []);

  async function requestCurrentLocation() {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationLabel('Lokasi tidak diizinkan — tentukan manual');
        setLocating(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      setLocationLabel(
        `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (lokasi kamu saat ini)`
      );
    } catch (e) {
      // Fallback jika GPS/perpustakaan tidak tersedia (mis. iOS simulator/web)
      setLocationLabel('Titik Belajar: lokasi perangkat (default)');
      setCoords({ latitude: -6.2, longitude: 106.816666 });
    } finally {
      setLocating(false);
    }
  }

  // Terima titik lokasi yang dipilih dari layar PetaLokasi
  useEffect(() => {
    if (route.params?.pickedLocation) {
      setLocationLabel(route.params.pickedLocation);
      if (route.params.pickedCoords) setCoords(route.params.pickedCoords);
    }
  }, [route.params?.pickedLocation]);

  function handleBook() {
    if (!locationLabel) {
      Alert.alert('Perhatian', 'Tentukan titik lokasi belajar terlebih dahulu.');
      return;
    }
    if (!selectedTeacher) {
      Alert.alert('Perhatian', 'Pilih guru yang akan mengajar.');
      return;
    }
    const order = createOrder({
      studentName: user?.name,
      studentPhone: user?.phone,
      subjectId, subjectName, levelId, levelName, grade,
      price, duration, note,
      locationLabel, coords,
      teacher: selectedTeacher,
    });
    navigation.navigate('StatusPesanan', { orderId: order.id });
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16 }}>
      {/* Ringkasan pesanan */}
      <View style={s.card}>
        <Text style={s.cardTitle}>📋 Ringkasan Pesanan Les</Text>
        <Row icon="book-outline" label="Mata Pelajaran" value={subjectName} />
        <Row icon="school-outline" label="Jenjang / Kelas" value={`${levelName} — ${grade}`} />
        <Row icon="time-outline" label="Durasi" value={`${duration} menit`} />
        <View style={s.priceBox}>
          <Text style={s.priceLabel}>HARGA TETAP (tidak tergantung jarak)</Text>
          <Text style={s.priceValue}>{formatRupiah(price || 0)}</Text>
        </View>
      </View>

      {/* Titik lokasi belajar = pengganti tujuan perjalanan */}
      <View style={s.card}>
        <Text style={s.cardTitle}>📍 Titik Tempat Pembelajaran</Text>
        {locating ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <View style={s.locBox}>
            <Ionicons name="location" size={22} color={COLORS.danger} />
            <Text style={s.locText} numberOfLines={2}>
              {locationLabel || 'Mencari lokasi…'}
            </Text>
          </View>
        )}
        <View style={s.locActions}>
          <TouchableOpacity style={s.locBtn} onPress={requestCurrentLocation}>
            <Ionicons name="navigate-outline" size={16} color="#fff" />
            <Text style={s.locBtnText}>Pakai Lokasi Saya</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.locBtn, s.locBtnOutline]}
            onPress={() =>
              navigation.navigate('PetaLokasi', {
                onPick: (label, pt) => { setLocationLabel(label); setCoords(pt); },
              })
            }
          >
            <Ionicons name="map-outline" size={16} color={COLORS.primary} />
            <Text style={[s.locBtnText, { color: COLORS.primary }]}>Pilih di Peta</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Durasi */}
      <View style={s.card}>
        <Text style={s.cardTitle}>⏱️ Durasi Belajar</Text>
        <View style={s.chipWrap}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[s.chip, duration === d.id && s.chipActive]}
              onPress={() => setDuration(d.id)}
            >
              <Text style={[s.chipText, duration === d.id && { color: '#fff', fontWeight: '800' }]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={s.noteInput}
          placeholder="Catatan untuk guru (opsional), cth: fokus bab aljabar"
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>

      {/* Daftar guru yang cocok */}
      <View style={s.card}>
        <Text style={s.cardTitle}>🧑‍🏫 Guru Tersedia ({teachers.length})</Text>
        {teachers.length === 0 && (
          <Text style={s.empty}>Belum ada guru untuk kombinasi ini. Coba jenjang/mapel lain.</Text>
        )}
        {teachers.map((t) => {
          const active = selectedTeacher?.id === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[s.teacherRow, active && s.teacherRowActive]}
              onPress={() => setSelectedTeacher(t)}
            >
              <View style={[s.avatar, { backgroundColor: t.photoColor }]}>
                <Text style={s.avatarText}>{t.name.split(' ')[0].replace(/^(Ibu|Pak|Ustadzah|Ustadz)\.?$/, '★').slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.teacherName}>{t.name}</Text>
                <Text style={s.teacherMeta}>
                  ⭐ {t.rating} • {t.sessions} sesi • ±{t.distanceKm} km darimu
                </Text>
              </View>
              <Ionicons
                name={active ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={active ? COLORS.primary : '#CBD5E1'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={s.bookBtn} onPress={handleBook}>
        <Ionicons name="checkmark-circle" size={22} color="#fff" />
        <Text style={s.bookBtnText}>Pesan — {formatRupiah(price || 0)}</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function Row({ icon, label, value }) {
  return (
    <View style={s.row}>
      <Ionicons name={icon} size={18} color={COLORS.textMuted} />
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontWeight: '900', fontSize: 15, color: COLORS.text, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 },
  rowLabel: { color: COLORS.textMuted, flex: 1 },
  rowValue: { fontWeight: '800', color: COLORS.text },
  priceBox: {
    marginTop: 10, backgroundColor: '#FEF9C3', borderWidth: 1, borderColor: '#FACC15',
    borderRadius: 12, padding: 12, alignItems: 'center',
  },
  priceLabel: { fontSize: 11, fontWeight: '700', color: '#854D0E', letterSpacing: 0.5 },
  priceValue: { fontSize: 24, fontWeight: '900', color: '#713F12', marginTop: 2 },
  locBox: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  locText: { flex: 1, color: COLORS.text, fontWeight: '600' },
  locActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  locBtn: {
    flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, padding: 10, borderRadius: 10,
  },
  locBtnOutline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  locBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
  noteInput: {
    marginTop: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 10, minHeight: 44, fontSize: 13, backgroundColor: '#F8FAFC',
  },
  empty: { color: COLORS.textMuted, fontStyle: 'italic' },
  teacherRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  teacherRowActive: { backgroundColor: '#EFF6FF', borderRadius: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  teacherName: { fontWeight: '800', color: COLORS.text, fontSize: 14 },
  teacherMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  bookBtn: {
    backgroundColor: COLORS.success, borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  bookBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});
