/**
 * Projelerim toplantı verimlilik analizi — DAISEE modeli.
 * TÜBİTAK, Turkcell, Teknofest proje toplantıları; raporlarla (projelerimReports) uyumlu.
 * Yapı staj meetingAnalysisData ile aynı; sadece içerik proje odaklı.
 */

function buildTimeline(minutes) {
  return Array.from({ length: minutes + 1 }, (_, i) => {
    let odak = Math.round(52 + Math.sin(i / 3.5) * 12 - (i > minutes - 10 ? 10 : 0))
    let stress = Math.round(14 + Math.sin(i / 5) * 6 + (i > 15 && i < 28 ? 10 : 0))
    let tereddut = Math.round(14 + Math.cos(i / 4) * 6 + (i < 6 ? 5 : 0))
    odak = Math.max(18, Math.min(75, odak))
    stress = Math.max(4, Math.min(32, stress))
    tereddut = Math.max(4, Math.min(24, tereddut))
    let sikilmis = Math.max(0, 100 - odak - stress - tereddut)
    let sum = odak + stress + tereddut + sikilmis
    if (sum !== 100) odak += (100 - sum)
    return { dakika: i, odak, stress, tereddut, sikilmis }
  })
}

export const PROJE_MEETING_ANALYSES = [
  {
    id: 'p1',
    title: 'TÜBİTAK 2209-A – Proje özeti ve literatür toplantısı',
    date: '2025-02-12T10:00:00',
    durationMin: 50,
    effectivenessScore: 78,
    timeline: buildTimeline(50),
    participantScores: [
      { name: 'Caner Giden', odak: 60, stress: 16, tereddut: 12, sikilmis: 12 },
      { name: 'Doç. Dr. Elif Kaya', odak: 70, stress: 10, tereddut: 10, sikilmis: 10 },
      { name: 'Arş. Gör. Burak Yıldız', odak: 65, stress: 12, tereddut: 11, sikilmis: 12 },
    ],
    speakingMinutes: [
      { name: 'Doç. Dr. Elif Kaya', minutes: 22 },
      { name: 'Caner Giden', minutes: 16 },
      { name: 'Arş. Gör. Burak Yıldız', minutes: 12 },
    ],
  },
  {
    id: 'p2',
    title: 'TÜBİTAK – Danışman onayı ve taslak rapor görüşmesi',
    date: '2025-02-18T14:00:00',
    durationMin: 45,
    effectivenessScore: 82,
    timeline: buildTimeline(45),
    participantScores: [
      { name: 'Caner Giden', odak: 62, stress: 14, tereddut: 14, sikilmis: 10 },
      { name: 'Doç. Dr. Elif Kaya', odak: 72, stress: 8, tereddut: 10, sikilmis: 10 },
    ],
    speakingMinutes: [
      { name: 'Doç. Dr. Elif Kaya', minutes: 24 },
      { name: 'Caner Giden', minutes: 21 },
    ],
  },
  {
    id: 'p3',
    title: 'Turkcell Geleceği Yazanlar – Sprint ve API entegrasyonu',
    date: '2025-02-11T11:00:00',
    durationMin: 55,
    effectivenessScore: 74,
    timeline: buildTimeline(55),
    participantScores: [
      { name: 'Caner Giden', odak: 56, stress: 18, tereddut: 14, sikilmis: 12 },
      { name: 'Selin Özkan', odak: 64, stress: 14, tereddut: 12, sikilmis: 10 },
      { name: 'Mentor Ahmet', odak: 68, stress: 10, tereddut: 10, sikilmis: 12 },
    ],
    speakingMinutes: [
      { name: 'Mentor Ahmet', minutes: 24 },
      { name: 'Selin Özkan', minutes: 18 },
      { name: 'Caner Giden', minutes: 13 },
    ],
  },
  {
    id: 'p4',
    title: 'Turkcell – Jüri sunumu hazırlığı ve provası',
    date: '2025-02-14T15:00:00',
    durationMin: 40,
    effectivenessScore: 80,
    timeline: buildTimeline(40),
    participantScores: [
      { name: 'Caner Giden', odak: 58, stress: 16, tereddut: 14, sikilmis: 12 },
      { name: 'Selin Özkan', odak: 66, stress: 12, tereddut: 11, sikilmis: 11 },
      { name: 'Deniz Kılıç', odak: 60, stress: 14, tereddut: 13, sikilmis: 13 },
      { name: 'Mentor Ahmet', odak: 70, stress: 8, tereddut: 10, sikilmis: 12 },
    ],
    speakingMinutes: [
      { name: 'Mentor Ahmet', minutes: 14 },
      { name: 'Selin Özkan', minutes: 12 },
      { name: 'Caner Giden', minutes: 8 },
      { name: 'Deniz Kılıç', minutes: 6 },
    ],
  },
  {
    id: 'p5',
    title: 'Teknofest – Tasarım raporu ve mühendislik hesapları',
    date: '2025-02-10T14:00:00',
    durationMin: 60,
    effectivenessScore: 72,
    timeline: buildTimeline(60),
    participantScores: [
      { name: 'Caner Giden', odak: 54, stress: 18, tereddut: 16, sikilmis: 12 },
      { name: 'Takım Kaptanı Ali', odak: 62, stress: 14, tereddut: 12, sikilmis: 12 },
      { name: 'Müh. Ekibi', odak: 58, stress: 16, tereddut: 14, sikilmis: 12 },
    ],
    speakingMinutes: [
      { name: 'Takım Kaptanı Ali', minutes: 28 },
      { name: 'Müh. Ekibi', minutes: 18 },
      { name: 'Caner Giden', minutes: 14 },
    ],
  },
  {
    id: 'p6',
    title: 'Teknofest – Atölye planlaması ve malzeme listesi',
    date: '2025-02-13T14:00:00',
    durationMin: 45,
    effectivenessScore: 76,
    timeline: buildTimeline(45),
    participantScores: [
      { name: 'Caner Giden', odak: 58, stress: 14, tereddut: 14, sikilmis: 14 },
      { name: 'Takım Kaptanı Ali', odak: 64, stress: 12, tereddut: 12, sikilmis: 12 },
      { name: 'Atölye sorumlusu', odak: 68, stress: 10, tereddut: 10, sikilmis: 12 },
    ],
    speakingMinutes: [
      { name: 'Atölye sorumlusu', minutes: 20 },
      { name: 'Takım Kaptanı Ali', minutes: 16 },
      { name: 'Caner Giden', minutes: 9 },
    ],
  },
  {
    id: 'p7',
    title: 'TÜBİTAK – Son başvuru öncesi kontrol toplantısı',
    date: '2025-03-10T09:00:00',
    durationMin: 35,
    effectivenessScore: 85,
    timeline: buildTimeline(35),
    participantScores: [
      { name: 'Caner Giden', odak: 66, stress: 12, tereddut: 12, sikilmis: 10 },
      { name: 'Doç. Dr. Elif Kaya', odak: 72, stress: 8, tereddut: 10, sikilmis: 10 },
      { name: 'Arş. Gör. Burak Yıldız', odak: 68, stress: 10, tereddut: 10, sikilmis: 12 },
    ],
    speakingMinutes: [
      { name: 'Doç. Dr. Elif Kaya', minutes: 14 },
      { name: 'Caner Giden', minutes: 12 },
      { name: 'Arş. Gör. Burak Yıldız', minutes: 9 },
    ],
  },
  {
    id: 'p8',
    title: 'Turkcell – Proje kapanış ve değerlendirme',
    date: '2025-02-20T11:00:00',
    durationMin: 40,
    effectivenessScore: 79,
    timeline: buildTimeline(40),
    participantScores: [
      { name: 'Caner Giden', odak: 60, stress: 14, tereddut: 14, sikilmis: 12 },
      { name: 'Selin Özkan', odak: 66, stress: 12, tereddut: 11, sikilmis: 11 },
      { name: 'Mentor Ahmet', odak: 70, stress: 8, tereddut: 10, sikilmis: 12 },
    ],
    speakingMinutes: [
      { name: 'Mentor Ahmet', minutes: 18 },
      { name: 'Selin Özkan', minutes: 12 },
      { name: 'Caner Giden', minutes: 10 },
    ],
  },
]

export function getProjeMeetingAnalysis(reportId) {
  return PROJE_MEETING_ANALYSES.find((a) => a.id === reportId)
}
