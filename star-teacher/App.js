// Navigator utama Star Teacher:
// - Belum login  -> LoginScreen
// - Role murid   -> Stack pemesanan (Beranda, Jenjang, Pesan Guru, Status, Peta, Riwayat)
// - Role guru    -> Bottom tabs (Pesanan Masuk, Profil)
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider, useApp } from './src/context/AppContext';
import { COLORS } from './src/theme';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PilihJenjangScreen from './src/screens/PilihJenjangScreen';
import PesanGuruScreen from './src/screens/PesanGuruScreen';
import StatusPesananScreen from './src/screens/StatusPesananScreen';
import PetaLokasiScreen from './src/screens/PetaLokasiScreen';
import RiwayatScreen from './src/screens/RiwayatScreen';
import TeacherHomeScreen from './src/screens/TeacherHomeScreen';
import TeacherProfileScreen from './src/screens/TeacherProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: COLORS.primary, background: COLORS.bg },
};

const headerOpts = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '900' },
};

// ===== Stack Murid =====
function StudentStack() {
  return (
    <Stack.Navigator screenOptions={headerOpts}>
      <Stack.Screen name="BerandaMurid" component={HomeScreen} options={{ title: '⭐ Star Teacher' }} />
      <Stack.Screen name="PilihJenjang" component={PilihJenjangScreen} options={{ title: 'Pilih Jenjang & Kelas' }} />
      <Stack.Screen name="PesanGuru" component={PesanGuruScreen} options={{ title: 'Pesan Guru' }} />
      <Stack.Screen name="StatusPesanan" component={StatusPesananScreen} options={{ title: 'Status Pesanan' }} />
      <Stack.Screen name="PetaLokasi" component={PetaLokasiScreen} options={{ title: 'Titik Tempat Belajar' }} />
      <Stack.Screen name="Riwayat" component={RiwayatScreen} options={{ title: 'Riwayat Saya' }} />
    </Stack.Navigator>
  );
}

// ===== Tab Guru =====
function TeacherTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      ...headerOpts,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: '#94A3B8',
      tabBarIcon: ({ color, size }) => {
        const icons = { 'Pesanan Masuk': 'notifications', Profil: 'person' };
        return <Ionicons name={icons[route.name] || 'home'} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Pesanan Masuk" component={TeacherHomeScreen} options={{ title: '⭐ Star Teacher — Guru' }} />
      <Tab.Screen name="Profil" component={TeacherProfileScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { user, ready } = useApp();

  if (!ready) {
    return (
      <View style={styles.splash}>
        <Ionicons name="star" size={64} color={COLORS.accent} />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {user == null ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : user.role === 'guru' ? (
        <TeacherTabs />
      ) : (
        <StudentStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: COLORS.bg },
});
