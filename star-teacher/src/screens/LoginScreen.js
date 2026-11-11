// Layar Selamat Datang + Login (pilih peran: Murid / Guru)
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [role, setRole] = useState('murid');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    if (!name.trim() || phone.trim().length < 8) {
      Alert.alert('Perhatian', 'Isi nama lengkap dan nomor HP yang valid.');
      return;
    }
    login({ name: name.trim(), phone: phone.trim(), role });
    // Navigasi otomatis berubah karena user sudah login (lihat App.js)
  };

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.hero}>
        <View style={s.logoCircle}>
          <Ionicons name="star" size={44} color="#fff" />
        </View>
        <Text style={s.appName}>STAR TEACHER</Text>
        <Text style={s.tagline}>Guru datang ke tempatmu belajar 💡</Text>
      </View>

      <View style={s.form}>
        <Text style={s.label}>Saya masuk sebagai</Text>
        <View style={s.roleRow}>
          <RoleButton
            active={role === 'murid'}
            icon="school-outline"
            title="MURID"
            onPress={() => setRole('murid')}
          />
          <RoleButton
            active={role === 'guru'}
            icon="person-outline"
            title="GURU"
            onPress={() => setRole('guru')}
          />
        </View>

        <Text style={s.label}>Nama Lengkap</Text>
        <TextInput
          style={s.input}
          placeholder={role === 'murid' ? 'cth: Ahmad Rizki' : 'cth: Ibu Siti Aminah, S.Pd.'}
          value={name}
          onChangeText={setName}
        />

        <Text style={s.label}>Nomor HP</Text>
        <TextInput
          style={s.input}
          placeholder="08xxxxxxxxxx"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={s.btn} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={s.btnText}>
            Masuk sebagai {role === 'murid' ? 'Murid' : 'Guru'}
          </Text>
        </TouchableOpacity>

        <Text style={s.note}>
          Harga ditentukan oleh mata pelajaran & jenjang, bukan jarak tempuh.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

function RoleButton({ active, icon, title, onPress }) {
  return (
    <TouchableOpacity
      style={[s.roleBtn, active && s.roleBtnActive]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={26} color={active ? '#fff' : COLORS.primary} />
      <Text style={[s.roleBtnText, active && { color: '#fff' }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 60 : 90,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  appName: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  tagline: { color: '#CBD5E1', marginTop: 6, fontSize: 14 },
  form: { flex: 1, padding: 20 },
  label: { fontWeight: '800', color: COLORS.text, marginTop: 14, marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderWidth: 2, borderColor: COLORS.border,
  },
  roleBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  roleBtnText: { fontWeight: '800', color: COLORS.primary },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 14, fontSize: 15,
  },
  btn: {
    backgroundColor: COLORS.accent, padding: 16, borderRadius: 14,
    alignItems: 'center', marginTop: 24,
  },
  btnText: { color: '#78350F', fontSize: 16, fontWeight: '900' },
  note: { textAlign: 'center', color: COLORS.textMuted, marginTop: 16, fontSize: 12 },
});
