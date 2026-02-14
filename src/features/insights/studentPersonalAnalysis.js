/**
 * Öğrenci kişisel analiz — model çıktıları (demo).
 * Yazılım Mühendisliği: katılım, stress, tertip, ilgi, konuşma dengesi, konuya bağlılık, ders katılımı.
 */
export const PERSONAL_METRICS = [
  {
    id: 'katilim',
    label: 'Katılım',
    value: 82,
    description: 'Canlı derslere ve laboratuvar oturumlarına aktif katılım oranın. Soru sorma ve tartışmaya katkı iyi seviyede.',
    color: 'teal',
    icon: '↑',
  },
  {
    id: 'stress',
    label: 'Stress seviyesi',
    value: 18,
    description: 'Düşük stress — derste ve proje çalışmalarında rahat ve odaklı görünüyorsun. Model stres sinyallerini düşük puanladı.',
    color: 'teal',
    icon: '✓',
  },
  {
    id: 'tertip',
    label: 'Tertip / düzen',
    value: 88,
    description: 'Ders ve laboratuvar içi düzen (odak süresi, kopma sayısı) yüksek. Düzenli katılım ve zamanında teslim tespit edildi.',
    color: 'teal',
    icon: '✓',
  },
  {
    id: 'ilgi-kaybi',
    label: 'İlgi kaybı',
    value: 12,
    description: 'İlgi kaybı düşük — ders ve kodlama oturumları boyunca ilgili kaldığın dilim oranı yüksek.',
    color: 'teal',
    icon: '✓',
  },
  {
    id: 'konusma-dengesi',
    label: 'Konuşma dengesi',
    value: 75,
    description: 'Konuşma süresi sınıf ortalamasına yakın; ne çok dominant ne çok sessizsin. Soru ve fikir paylaşımı dengeli.',
    color: 'blue',
    icon: '~',
  },
  {
    id: 'konu-disi',
    label: 'Konu dışı katılım',
    value: 10,
    description: 'Konu dışına çıkma oranın düşük. Derste ve laboratuvarda konuya bağlı kaldığın tespit edildi.',
    color: 'teal',
    icon: '✓',
  },
  {
    id: 'ders-katilim',
    label: 'Ders katılım oranı',
    value: 90,
    description: 'Katıldığın canlı derslerin yüzdesi. Son 4 haftada Programlama I ve Veri Yapıları derslerine katılımın yüksek.',
    color: 'teal',
    icon: '↑',
  },
]

/** Ders bazlı katılım (son dönem) — grafik için — Yazılım Mühendisliği */
export const COURSE_PARTICIPATION = [
  { courseId: 'prog1', name: 'Programlama I', value: 92, sessions: 8 },
  { courseId: 'veriyapilari', name: 'Veri Yapıları', value: 85, sessions: 7 },
  { courseId: 'algoritmalar', name: 'Algoritmalar', value: 78, sessions: 6 },
  { courseId: 'veritabani', name: 'Veritabanı Yönetim Sistemleri', value: 88, sessions: 7 },
]

/** Zaman içi katılım (haftalık örnek — çubuk grafik) */
export const WEEKLY_ENGAGEMENT = [75, 82, 70, 88, 90, 78, 85]

/** Ders bazlı detaylı metrikler — grafikler için (Yazılım Mühendisliği) */
export const COURSE_METRICS = [
  {
    courseId: 'prog1',
    name: 'Programlama I',
    participation: 92,
    sessions: 8,
    engagement: 88,
    focus: 90,
    stress: 15,
    contribution: 82,
  },
  {
    courseId: 'veriyapilari',
    name: 'Veri Yapıları',
    participation: 85,
    sessions: 7,
    engagement: 82,
    focus: 85,
    stress: 20,
    contribution: 78,
  },
  {
    courseId: 'algoritmalar',
    name: 'Algoritmalar',
    participation: 78,
    sessions: 6,
    engagement: 75,
    focus: 72,
    stress: 28,
    contribution: 70,
  },
  {
    courseId: 'veritabani',
    name: 'Veritabanı Yönetim Sistemleri',
    participation: 88,
    sessions: 7,
    engagement: 85,
    focus: 86,
    stress: 18,
    contribution: 80,
  },
]

/** Radar grafiği için metrik listesi (label + key) */
export const RADAR_METRIC_KEYS = [
  { key: 'katilim', label: 'Katılım' },
  { key: 'stress', label: 'Stress' },
  { key: 'tertip', label: 'Tertip' },
  { key: 'ilgi-kaybi', label: 'İlgi' },
  { key: 'konusma-dengesi', label: 'Konuşma' },
  { key: 'konu-disi', label: 'Konuya bağlılık' },
]
