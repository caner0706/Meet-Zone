/**
 * Toplantı verimlilik analizi — DAISEE modeli çıktıları.
 * Her dakika: Odak, Stress, Tereddüt, Sıkılmış — yüzdelik dilim (toplam %100, orantılı).
 * Katılımcı bazlı skorlar ve konuşma süresi dağılımı.
 */

/**
 * Dakika bazlı DAISEE — her dakika toplam %100.
 * Sıra (üstten alta) genelde: Odak > Stress > Tereddüt > İlgi kaybı,
 * ama çizgiler dalgalı ve bazı anlarda farklar büyüyüp küçülebilir.
 */
function buildTimeline(minutes) {
  return Array.from({ length: minutes + 1 }, (_, i) => {
    // Ham ağırlıklar (her zaman w1 > w2 > w3 > w4 olacak şekilde seçildi)
    const w1 = 140 + Math.sin(i / 4) * 35   // Odak: en yüksek, güçlü dalga
    const w2 = 90 + Math.cos(i / 5) * 20    // Stress: orta seviye
    const w3 = 45 + Math.sin(i / 6) * 15    // Tereddüt: daha düşük
    const w4 = 20 + Math.cos(i / 7) * 8     // İlgi kaybı: en düşük

    const sumW = w1 + w2 + w3 + w4

    let odak = Math.round((w1 / sumW) * 100)
    let stress = Math.round((w2 / sumW) * 100)
    let tereddut = Math.round((w3 / sumW) * 100)
    let sikilmis = 100 - odak - stress - tereddut // sonuncuyu kalanı alarak düzelt

    return { dakika: i, odak, stress, tereddut, sikilmis }
  })
}

/** Toplantı analizi demo verisi — rapor id'leri ile eşleşir (r1, r2, r3) */
export const STAJ_MEETING_ANALYSES = [
  {
    id: 'r1',
    title: 'Haftalık staj değerlendirme',
    date: '2025-02-10T14:00:00',
    durationMin: 45,
    effectivenessScore: 76,
    timeline: buildTimeline(45),
    participantScores: [
      { name: 'Caner Giden', odak: 58, stress: 18, tereddut: 14, sikilmis: 10 },
      { name: 'Ayşe Yılmaz', odak: 68, stress: 12, tereddut: 11, sikilmis: 9 },
      { name: 'Mehmet Kaya', odak: 62, stress: 15, tereddut: 13, sikilmis: 10 },
    ],
    speakingMinutes: [
      { name: 'Ayşe Yılmaz', minutes: 18 },
      { name: 'Mehmet Kaya', minutes: 14 },
      { name: 'Caner Giden', minutes: 13 },
    ],
  },
  {
    id: 'r2',
    title: 'Mentorluk – API tasarımı',
    date: '2025-02-05T10:00:00',
    durationMin: 35,
    effectivenessScore: 82,
    timeline: buildTimeline(35),
    participantScores: [
      { name: 'Caner Giden', odak: 64, stress: 14, tereddut: 12, sikilmis: 10 },
      { name: 'Emre Demir', odak: 70, stress: 10, tereddut: 10, sikilmis: 10 },
    ],
    speakingMinutes: [
      { name: 'Emre Demir', minutes: 20 },
      { name: 'Caner Giden', minutes: 15 },
    ],
  },
  {
    id: 'r3',
    title: 'Sprint 22 retrospektif',
    date: '2025-02-03T15:00:00',
    durationMin: 40,
    effectivenessScore: 71,
    timeline: buildTimeline(40),
    participantScores: [
      { name: 'Caner Giden', odak: 48, stress: 22, tereddut: 18, sikilmis: 12 },
      { name: 'Mehmet Kaya', odak: 55, stress: 18, tereddut: 15, sikilmis: 12 },
      { name: 'Ayşe Yılmaz', odak: 60, stress: 14, tereddut: 14, sikilmis: 12 },
      { name: 'Zeynep Arslan', odak: 52, stress: 20, tereddut: 16, sikilmis: 12 },
    ],
    speakingMinutes: [
      { name: 'Mehmet Kaya', minutes: 12 },
      { name: 'Ayşe Yılmaz', minutes: 10 },
      { name: 'Zeynep Arslan', minutes: 8 },
      { name: 'Caner Giden', minutes: 10 },
    ],
  },
]

export function getMeetingAnalysis(reportId) {
  return STAJ_MEETING_ANALYSES.find((a) => a.id === reportId)
}
