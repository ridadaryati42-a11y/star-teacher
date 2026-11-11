// ============================================================
// STAR TEACHER - Data Master Mata Pelajaran, Jenjang & Harga
// Harga tidak tergantung jarak, tetapi pada MATA PELAJARAN + JENJANG
// ============================================================

export const SUBJECTS = [
  { id: 'mtk', name: 'Matematika', icon: 'calculator-outline', color: '#2563EB' },
  { id: 'ipa', name: 'IPA', icon: 'planet-outline', color: '#059669' },
  { id: 'bing', name: 'Bahasa Inggris', icon: 'language', color: '#D97706' },
  { id: 'mengaji', name: 'Mengaji', icon: 'book-outline', color: '#7C3AED' },
];

export const LEVELS = [
  {
    id: 'sd',
    name: 'SD',
    fullName: 'Sekolah Dasar',
    grades: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
    price: 70000,
  },
  {
    id: 'smp',
    name: 'SMP',
    fullName: 'Sekolah Menengah Pertama',
    grades: ['Kelas 7 (Kelas 1)', 'Kelas 8 (Kelas 2)', 'Kelas 9 (Kelas 3)'],
    price: 80000,
  },
  {
    id: 'sma12',
    name: 'SMA Kelas 1-2',
    fullName: 'Sekolah Menengah Atas (Kelas 1 & 2)',
    grades: ['Kelas 10 (Kelas 1)', 'Kelas 11 (Kelas 2)'],
    price: 90000,
  },
  {
    id: 'sma3umum',
    name: 'SMA Kelas 3 / Umum',
    fullName: 'SMA Kelas 3 & Peserta Umum',
    grades: ['Kelas 12 (Kelas 3)', 'Umum'],
    price: 100000,
  },
];

export const DURATIONS = [
  { id: 60, label: '60 menit (1 sesi)' },
  { id: 90, label: '90 menit (1.5 sesi)' },
  { id: 120, label: '120 menit (2 sesi)' },
];

export function formatRupiah(n) {
  return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function getPrice(levelId) {
  const l = LEVELS.find((x) => x.id === levelId);
  return l ? l.price : 0;
}

// Daftar Guru (mock data - seperti daftar driver di inDriver)
export const TEACHERS = [
  { id: 'T01', name: 'Ibu Siti Aminah, S.Pd.', subjectIds: ['mtk', 'ipa'], levelIds: ['sd', 'smp'], rating: 4.9, sessions: 320, distanceKm: 1.2, photoColor: '#F59E0B' },
  { id: 'T02', name: 'Pak Budi Santoso, M.Pd.', subjectIds: ['mtk', 'bing'], levelIds: ['smp', 'sma12', 'sma3umum'], rating: 4.8, sessions: 215, distanceKm: 2.5, photoColor: '#10B981' },
  { id: 'T03', name: 'Ustadzah Fatimah, Lc.', subjectIds: ['mengaji'], levelIds: ['sd', 'smp', 'sma12', 'sma3umum'], rating: 5.0, sessions: 410, distanceKm: 0.8, photoColor: '#8B5CF6' },
  { id: 'T04', name: 'Ibu Rina Wulandari, S.S.', subjectIds: ['bing'], levelIds: ['sd', 'smp', 'sma12'], rating: 4.7, sessions: 180, distanceKm: 3.1, photoColor: '#EF4444' },
  { id: 'T05', name: 'Pak Ahmad Fauzi, S.Pd.I.', subjectIds: ['mengaji', 'ipa'], levelIds: ['sd', 'smp', 'sma3umum'], rating: 4.9, sessions: 260, distanceKm: 1.9, photoColor: '#3B82F6' },
  { id: 'T06', name: 'Ibu Dewi Lestari, S.Pd.', subjectIds: ['mtk', 'ipa', 'bing'], levelIds: ['sd'], rating: 4.8, sessions: 150, distanceKm: 2.2, photoColor: '#EC4899' },
  { id: 'T07', name: 'Pak Hendra Gunawan, M.Si.', subjectIds: ['mtk', 'ipa'], levelIds: ['sma12', 'sma3umum'], rating: 4.9, sessions: 390, distanceKm: 4.0, photoColor: '#14B8A6' },
  { id: 'T08', name: 'Ustadz Abdul Hakim', subjectIds: ['mengaji'], levelIds: ['sd', 'smp', 'sma12', 'sma3umum'], rating: 4.8, sessions: 300, distanceKm: 1.5, photoColor: '#F97316' },
];

// Cari guru yang cocok dengan subject + level
export function findMatchedTeachers(subjectId, levelId) {
  return TEACHERS.filter(
    (t) => t.subjectIds.includes(subjectId) && t.levelIds.includes(levelId)
  );
}
