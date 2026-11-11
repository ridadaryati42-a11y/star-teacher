// Tema warna & gaya global Star Teacher
export const COLORS = {
  primary: '#1E3A8A',       // biru tua (brand)
  primaryLight: '#2563EB',
  accent: '#F59E0B',        // kuning bintang
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#059669',
  danger: '#DC2626',
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.md },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 15, color: COLORS.textMuted, marginTop: 4 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 8, marginTop: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDisabled: { backgroundColor: '#94A3B8' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  priceTag: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  priceText: { color: '#92400E', fontWeight: '800', fontSize: 18 },
});
