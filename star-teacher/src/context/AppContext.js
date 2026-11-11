// Context global Star Teacher: sesi login, role (murid/guru), data pemesanan
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // { name, phone, role: 'murid'|'guru' }
  const [orders, setOrders] = useState([]); // riwayat pemesanan murid
  const [teacherJobs, setTeacherJobs] = useState([]); // pesanan masuk untuk mode guru
  const [ready, setReady] = useState(false);

  // Muat state tersimpan saat aplikasi dibuka
  useEffect(() => {
    (async () => {
      try {
        const u = await AsyncStorage.getItem('st_user');
        const o = await AsyncStorage.getItem('st_orders');
        const j = await AsyncStorage.getItem('st_jobs');
        if (u) setUser(JSON.parse(u));
        if (o) setOrders(JSON.parse(o));
        if (j) setTeacherJobs(JSON.parse(j));
      } catch (e) {}
      setReady(true);
    })();
  }, []);

  const persist = (key, val) =>
    AsyncStorage.setItem(key, JSON.stringify(val)).catch(() => {});

  const login = (userData) => {
    setUser(userData);
    persist('st_user', userData);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('st_user');
  };

  // Murid membuat pemesanan baru
  const createOrder = (order) => {
    const newOrder = {
      ...order,
      id: 'ORD' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'mencari_guru', // mencari_guru -> diterima -> berlangsung -> selesai | dibatalkan
    };
    setOrders((prev) => {
      const next = [newOrder, ...prev];
      persist('st_orders', next);
      return next;
    });
    // Simulasi: ada guru yang menerima setelah beberapa detik
    setTimeout(() => {
      updateOrder(newOrder.id, { status: 'diterima' });
    }, 5000);
    return newOrder;
  };

  const updateOrder = (id, patch) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, ...patch } : o));
      persist('st_orders', next);
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user, login, logout, ready,
        orders, createOrder, updateOrder,
        teacherJobs, setTeacherJobs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
