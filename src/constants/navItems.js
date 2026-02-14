import { ROUTES } from '../config/routes'

/** Öğrenci menüsü — ana sayfadayken */
const STUDENT_NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Ana Sayfa', icon: 'dashboard' },
  { to: ROUTES.MESSAGES, label: 'Mesajlaşma', icon: 'message' },
  { to: ROUTES.ACCOUNT, label: 'Hesabım', icon: 'account' },
  { to: ROUTES.SETTINGS, label: 'Ayarlar', icon: 'settings' },
]

/** Öğrenci menüsü — Derslerim / eğitim sayfalarındayken (Derse Katıl ile başlar) */
const STUDENT_NAV_ITEMS_EDUCATION = [
  { to: ROUTES.LIVE, label: 'Derse Katıl', icon: 'play' },
  { to: ROUTES.OZET, label: 'Dersler', icon: 'check' },
  { to: ROUTES.INSIGHTS, label: 'Kişisel Analiz', icon: 'insight' },
  { to: ROUTES.TASKS, label: 'Öğrenci Yol Haritası', icon: 'task' },
  { to: ROUTES.MESSAGES, label: 'Mesajlaşma', icon: 'message' },
  { to: ROUTES.ACCOUNT, label: 'Hesabım', icon: 'account' },
  { to: ROUTES.SETTINGS, label: 'Ayarlar', icon: 'settings' },
]

/** Öğrenci menüsü — Stajım sayfalarındayken (Hesabım ve Ayarlar yok; Mesajlaşma staj gruplarına gider) */
const STUDENT_NAV_ITEMS_STAJ = [
  { to: ROUTES.STAJ_LIVE, label: 'Canlı toplantı', icon: 'play' },
  { to: ROUTES.STAJ_REPORT, label: 'Toplantı raporları', icon: 'report' },
  { to: ROUTES.STAJ_ANALYSIS, label: 'Toplantı analizleri', icon: 'meetingAnalysis' },
  { to: ROUTES.STAJ_ROADMAP, label: 'Yol haritası', icon: 'task' },
  { to: ROUTES.STAJ_MESSAGES, label: 'Mesajlaşma', icon: 'message' },
]

/** Öğrenci menüsü — Projelerim sayfalarındayken */
const STUDENT_NAV_ITEMS_PROJELERIM = [
  { to: ROUTES.PROJELERIM_TAKIMLAR, label: 'Takımlarım', icon: 'users' },
  { to: ROUTES.PROJELERIM_LIVE, label: 'Canlı toplantı', icon: 'play' },
  { to: ROUTES.PROJELERIM_REPORT, label: 'Toplantı raporları', icon: 'report' },
  { to: ROUTES.PROJELERIM_ANALYSIS, label: 'Toplantı analizi', icon: 'meetingAnalysis' },
  { to: ROUTES.PROJELERIM_ROADMAP, label: 'Yol haritası', icon: 'task' },
  { to: ROUTES.PROJELERIM_MESSAGES, label: 'Mesajlar', icon: 'message' },
]

/** Öğretmen menüsü */
const TEACHER_NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Ana Sayfa', icon: 'dashboard' },
  { to: ROUTES.LIVE, label: 'Ders Oluştur', icon: 'createCourse' },
  { to: ROUTES.REPORT, label: 'Ders Raporları', icon: 'report' },
  { to: ROUTES.MEETING_ANALYSIS, label: 'Canlı Ders Analizi', icon: 'meetingAnalysis' },
  { to: ROUTES.TASK_ANALYTICS, label: 'Görev Takip Analizi', icon: 'taskAnalytics' },
  { to: ROUTES.MESSAGES, label: 'Mesajlaşma', icon: 'message' },
  { to: ROUTES.ACCOUNT, label: 'Hesabım', icon: 'account' },
  { to: ROUTES.SETTINGS, label: 'Ayarlar', icon: 'settings' },
]

/** Derslerim / eğitim rotaları — bu sayfalardayken yan menü eğitim menüsüne geçer */
const EDUCATION_PATHS = [ROUTES.OZET, ROUTES.LIVE, ROUTES.INSIGHTS, ROUTES.TASKS, ROUTES.MESSAGES, ROUTES.ACCOUNT, ROUTES.SETTINGS]

/** Stajım rotaları — /dashboard/staj veya alt sayfalardayken yan menü staj menüsüne geçer */
const STAJ_PATHS = [ROUTES.STAJ]

/** Projelerim rotaları — /dashboard/projelerim veya alt sayfalardayken yan menü projelerim menüsüne geçer */
const PROJELERIM_PATHS = [ROUTES.PROJELERIM]

export function getNavItems(role, pathname = '') {
  if (role === 'teacher') return TEACHER_NAV_ITEMS
  if (pathname && PROJELERIM_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    return STUDENT_NAV_ITEMS_PROJELERIM
  }
  if (pathname && STAJ_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    return STUDENT_NAV_ITEMS_STAJ
  }
  if (pathname && EDUCATION_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    return STUDENT_NAV_ITEMS_EDUCATION
  }
  return STUDENT_NAV_ITEMS
}

export const NAV_ITEMS = STUDENT_NAV_ITEMS
