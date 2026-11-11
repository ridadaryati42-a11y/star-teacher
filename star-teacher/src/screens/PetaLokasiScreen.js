// Peta Lokasi: memilih titik tempat pembelajaran (menggantikan pemilihan rute di inDriver)
// Menggunakan Google Maps (react-native-maps). Untuk produksi, isi API key di app.json.
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../theme';

const DEFAULT_REGION = {
  latitude: -6.2088,
  longitude: 106.8456,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function PetaLokasiScreen({ navigation, route }) {
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [point, setPoint] = useState(null);

  const onMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPoint({ latitude, longitude });
  };

  const onPick = route.params?.onPick;
  const pickAndReturn = () => {
    if (!point) {
      Alert.alert('Perhatian', 'Ketuk peta untuk menandai titik tempat belajar.');
      return;
    }
    const label = `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)} (dipilih dari peta)`;
    if (typeof onPick === 'function') {
      onPick(label, point); // callback ke layar PesanGuru
    }
    navigation.goBack();
  };

  return (
    <View style={s.screen}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        onPress={onMapPress}
      >
        {point && (
          <Marker
            coordinate={point}
            title="Titik Tempat Belajar"
            description="Di sini sesi les akan berlangsung"
          />
        )}
      </MapView>

      <View style={s.hint}>
        <Ionicons name="hand-left-outline" size={18} color={COLORS.primary} />
        <Text style={s.hintText}>Ketuk peta untuk menandai lokasi belajar 📍</Text>
      </View>

      <View style={s.bottomBar}>
        <TouchableOpacity style={s.btnGhost} onPress={() => navigation.goBack()}>
          <Text style={[s.btnText, { color: COLORS.textMuted }]}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnPrimary} onPress={pickAndReturn}>
          <Text style={[s.btnText, { color: '#fff' }]}>Gunakan Titik Ini</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  hint: {
    position: 'absolute', top: Platform.OS === 'android' ? 20 : 50, alignSelf: 'center',
    flexDirection: 'row', gap: 6, alignItems: 'center',
    backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  hintText: { color: COLORS.primary, fontWeight: '700', fontSize: 12 },
  bottomBar: {
    position: 'absolute', bottom: 24, left: 16, right: 16, flexDirection: 'row', gap: 10,
  },
  btnGhost: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  btnPrimary: {
    flex: 2, backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: 'center',
  },
  btnText: { fontWeight: '900' },
});
