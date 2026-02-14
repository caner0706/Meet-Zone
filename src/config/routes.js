/**
 * Uygulama rota yapılandırması — üniversite / yazılım mühendisliği
 */
export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  WELCOME_INTRO: '/dashboard/karsilama', // Login sonrası karşılama / video ekranı
  OZET: '/dashboard/ozet',             // Öğrenci: Ders listesi ve özetler
  STAJ: '/dashboard/staj',            // Öğrenci: Staj
  STAJ_LIVE: '/dashboard/staj/canli-toplanti',       // Staj: Canlı toplantı
  STAJ_REPORT: '/dashboard/staj/raporlar',            // Staj: Toplantı raporları
  STAJ_ANALYSIS: '/dashboard/staj/analizler',         // Staj: Toplantı analizleri
  STAJ_ROADMAP: '/dashboard/staj/yol-haritasi',      // Staj: Yol haritası
  STAJ_MESSAGES: '/dashboard/staj/mesajlar',        // Staj: Mesajlaşma (staj grupları)
  PROJELERIM: '/dashboard/projelerim',             // Öğrenci: Projelerim
  PROJELERIM_TAKIMLAR: '/dashboard/projelerim/takimlarim',
  PROJELERIM_LIVE: '/dashboard/projelerim/canli-toplanti',
  PROJELERIM_REPORT: '/dashboard/projelerim/raporlar',
  PROJELERIM_ANALYSIS: '/dashboard/projelerim/analizler',
  PROJELERIM_ROADMAP: '/dashboard/projelerim/yol-haritasi',
  PROJELERIM_MESSAGES: '/dashboard/projelerim/mesajlar',
  TAKIMLAR: '/dashboard/takimlar',   // Öğrenci: Takımlar
  TASKS: '/dashboard/tasks',
  REPORT: '/dashboard/report',       // Öğretmen: Ders Raporları
  LIVE: '/dashboard/live',
  QUICK_MEETING: '/dashboard/toplanti',  // Hızlı toplantı seçim sayfası (oluştur / oda kodu ile katıl)
  INSIGHTS: '/dashboard/insights',
  MEETING_ANALYSIS: '/dashboard/meeting-analysis', // Öğretmen: Canlı Ders Analizi
  TASK_ANALYTICS: '/dashboard/task-analytics',     // Öğretmen: Görev Takip Analizi
  AVATAR: '/dashboard/avatar',
  MESSAGES: '/dashboard/messages',
  ACCOUNT: '/dashboard/account',
  SETTINGS: '/dashboard/settings',
  AGENDA: '/dashboard/ajanda',       // Ajanda / takvim görünümü
}
