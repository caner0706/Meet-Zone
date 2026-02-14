import { useState, useMemo } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts'

/** Demo: öğretmenin sınıfları (Görev Takip ile aynı yapı) */
const DEMO_CLASSES = [
  { id: '10a', name: 'Biyoloji 10-A' },
  { id: '10b', name: 'Biyoloji 10-B' },
  { id: '11', name: 'Biyoloji 11. Sınıf' },
]

/** Dakika bazlı Daisee çıktıları — yüzdelik dilim, her dakika toplam %100 */
function buildTimeline(minutes) {
  return Array.from({ length: minutes + 1 }, (_, i) => {
    let odak = Math.round(58 + Math.sin(i / 4) * 14 - (i > minutes - 8 ? 12 : 0))
    let stress = Math.round(12 + Math.sin(i / 5) * 8 + (i > 18 && i < 28 ? 12 : 0))
    let tereddut = Math.round(12 + Math.cos(i / 4) * 6 + (i < 8 ? 6 : 0))
    odak = Math.max(15, Math.min(82, odak))
    stress = Math.max(3, Math.min(35, stress))
    tereddut = Math.max(3, Math.min(22, tereddut))
    const ilgiKaybi = Math.max(0, 100 - odak - stress - tereddut)
    const sum = odak + stress + tereddut + ilgiKaybi
    return {
      dakika: i,
      odak: odak + (100 - sum),
      stress,
      tereddut,
      ilgiKaybi,
    }
  })
}

/** Demo: sınıfa göre canlı dersler */
const DEMO_LESSONS = {
  '10a': [
    {
      id: 'l1',
      title: 'Hücre zarı ve madde geçişi',
      date: '2025-02-08',
      durationMin: 45,
      effectivenessScore: 78,
      timeline: buildTimeline(45),
      studentScores: [
        { studentId: 's1', name: 'Elif K.', odak: 62, stress: 18, tereddut: 12, ilgiKaybi: 8 },
        { studentId: 's2', name: 'Mehmet Y.', odak: 43, stress: 28, tereddut: 19, ilgiKaybi: 10 },
        { studentId: 's3', name: 'Ayşe K.', odak: 71, stress: 12, tereddut: 9, ilgiKaybi: 8 },
      ],
    },
    {
      id: 'l2',
      title: 'Osmoz ve turgor',
      date: '2025-02-05',
      durationMin: 40,
      effectivenessScore: 72,
      timeline: buildTimeline(40),
      studentScores: [
        { studentId: 's1', name: 'Elif K.', odak: 48, stress: 22, tereddut: 18, ilgiKaybi: 12 },
        { studentId: 's2', name: 'Mehmet Y.', odak: 35, stress: 32, tereddut: 23, ilgiKaybi: 10 },
        { studentId: 's3', name: 'Ayşe K.', odak: 60, stress: 16, tereddut: 14, ilgiKaybi: 10 },
      ],
    },
  ],
  '10b': [
    {
      id: 'l3',
      title: 'Hücre zarı – tekrar',
      date: '2025-02-07',
      durationMin: 38,
      effectivenessScore: 75,
      timeline: buildTimeline(38),
      studentScores: [
        { studentId: 's4', name: 'Can D.', odak: 42, stress: 28, tereddut: 20, ilgiKaybi: 10 },
        { studentId: 's5', name: 'Zeynep A.', odak: 53, stress: 20, tereddut: 16, ilgiKaybi: 11 },
      ],
    },
  ],
  '11': [
    {
      id: 'l4',
      title: 'İleri hücre biyolojisi',
      date: '2025-02-06',
      durationMin: 50,
      effectivenessScore: 81,
      timeline: buildTimeline(50),
      studentScores: [
        { studentId: 's6', name: 'Burak T.', odak: 52, stress: 22, tereddut: 16, ilgiKaybi: 10 },
        { studentId: 's7', name: 'Deniz K.', odak: 61, stress: 15, tereddut: 13, ilgiKaybi: 11 },
      ],
    },
  ],
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function MeetingAnalysis() {
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [selectedLessonId, setSelectedLessonId] = useState(null)

  const selectedClass = useMemo(() => DEMO_CLASSES.find((c) => c.id === selectedClassId), [selectedClassId])
  const lessons = useMemo(() => (selectedClassId ? DEMO_LESSONS[selectedClassId] || [] : []), [selectedClassId])
  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId),
    [lessons, selectedLessonId]
  )

  // ——— 1) Sınıf listesi ———
  if (!selectedClassId) {
    return (
      <>
        <header className="page-header live-analysis-header animate-enter">
          <h1 className="page-title">Canlı Ders Analizi</h1>
          <p className="page-subtitle">
            Sınıf seçerek o sınıfla yaptığınız canlı dersleri ve Daisee analiz sonuçlarını görüntüleyin.
          </p>
        </header>
        <div className="live-analysis-class-list animate-on-scroll visible" data-animate>
          {DEMO_CLASSES.map((cls) => (
            <button
              key={cls.id}
              type="button"
              className="live-analysis-class-card"
              onClick={() => setSelectedClassId(cls.id)}
            >
              <span className="live-analysis-class-icon" aria-hidden>📁</span>
              <div className="live-analysis-class-content">
                <h2 className="live-analysis-class-name">{cls.name}</h2>
                <span className="live-analysis-class-meta">
                  {(DEMO_LESSONS[cls.id] || []).length} canlı ders
                </span>
              </div>
              <span className="live-analysis-class-arrow" aria-hidden>→</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  // ——— 2) Sınıfın canlı dersleri listesi ———
  if (!selectedLessonId) {
    return (
      <>
        <div className="live-analysis-back-bar">
          <button
            type="button"
            className="btn btn-secondary live-analysis-back-btn"
            onClick={() => setSelectedClassId(null)}
          >
            ← Sınıflara dön
          </button>
        </div>
        <header className="page-header live-analysis-header animate-enter">
          <h1 className="page-title">{selectedClass?.name}</h1>
          <p className="page-subtitle">Bu sınıfla yapılan canlı dersler. Detay için derse tıklayın.</p>
        </header>
        {lessons.length === 0 ? (
          <div className="card animate-on-scroll visible" data-animate>
            <div className="card-body">
              <p className="summary-text" style={{ color: 'var(--color-text-muted)' }}>
                Bu sınıf için henüz canlı ders kaydı yok.
              </p>
            </div>
          </div>
        ) : (
          <div className="live-analysis-lesson-list animate-on-scroll visible" data-animate>
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                type="button"
                className="live-analysis-lesson-card"
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <span className="live-analysis-lesson-icon" aria-hidden>📺</span>
                <div className="live-analysis-lesson-content">
                  <h2 className="live-analysis-lesson-title">{lesson.title}</h2>
                  <span className="live-analysis-lesson-meta">
                    {formatDate(lesson.date)} · {lesson.durationMin} dk
                  </span>
                  <span className="live-analysis-lesson-score">
                    Verimlilik: <strong>{lesson.effectivenessScore}%</strong>
                  </span>
                </div>
                <span className="live-analysis-lesson-arrow" aria-hidden>→</span>
              </button>
            ))}
          </div>
        )}
      </>
    )
  }

  // ——— 3) Ders detayı — Daisee çıktıları ———
  return (
    <>
      <div className="live-analysis-back-bar">
        <button
          type="button"
          className="btn btn-secondary live-analysis-back-btn"
          onClick={() => setSelectedLessonId(null)}
        >
          ← Derslere dön
        </button>
      </div>
      <header className="page-header live-analysis-header animate-enter">
        <h1 className="page-title">{selectedLesson?.title}</h1>
        <p className="page-subtitle">
          {selectedClass?.name} · {selectedLesson?.date && formatDate(selectedLesson.date)} ·{' '}
          {selectedLesson?.durationMin} dk · Daisee analizi
        </p>
      </header>

      {(() => {
        const students = selectedLesson?.studentScores || []
        const avgOdak = students.length
          ? Math.round(students.reduce((a, s) => a + s.odak, 0) / students.length)
          : 0
        const avgStress = students.length
          ? Math.round(students.reduce((a, s) => a + s.stress, 0) / students.length)
          : 0
        return (
          <div className="live-analysis-detail-stats animate-on-scroll visible" data-animate>
            <div className="live-analysis-stat-card live-analysis-stat-card--effectiveness">
              <span className="live-analysis-stat-icon" aria-hidden>📊</span>
              <div className="live-analysis-stat-content">
                <span className="live-analysis-stat-value">{selectedLesson?.effectivenessScore}%</span>
                <span className="live-analysis-stat-label">Ders verimliliği</span>
              </div>
            </div>
            <div className="live-analysis-stat-card live-analysis-stat-card--odak">
              <span className="live-analysis-stat-icon" aria-hidden>🎯</span>
              <div className="live-analysis-stat-content">
                <span className="live-analysis-stat-value">{avgOdak}</span>
                <span className="live-analysis-stat-label">Ort. odak</span>
              </div>
            </div>
            <div className="live-analysis-stat-card live-analysis-stat-card--stress">
              <span className="live-analysis-stat-icon" aria-hidden>⚠</span>
              <div className="live-analysis-stat-content">
                <span className="live-analysis-stat-value">{avgStress}</span>
                <span className="live-analysis-stat-label">Ort. stress</span>
              </div>
            </div>
            <div className="live-analysis-stat-card live-analysis-stat-card--duration">
              <span className="live-analysis-stat-icon" aria-hidden>⏱</span>
              <div className="live-analysis-stat-content">
                <span className="live-analysis-stat-value">{selectedLesson?.durationMin}</span>
                <span className="live-analysis-stat-label">Dakika</span>
              </div>
            </div>
            <div className="live-analysis-stat-card live-analysis-stat-card--students">
              <span className="live-analysis-stat-icon" aria-hidden>👥</span>
              <div className="live-analysis-stat-content">
                <span className="live-analysis-stat-value">{students.length}</span>
                <span className="live-analysis-stat-label">Öğrenci</span>
              </div>
            </div>
          </div>
        )
      })()}

      <div className="card live-analysis-chart-card animate-on-scroll visible" data-animate>
        <div className="card-header">
          <h2 className="card-title">Dakika dakika ders analizi</h2>
          <p className="card-desc">
            Yüzdelik dilim (toplam %100). Daisee: <strong>Odak</strong>, <strong>Stress</strong>, <strong>Tereddüt</strong>, <strong>İlgi kaybı</strong>.
          </p>
        </div>
        <div className="card-body live-analysis-chart-card-body">
          <div className="live-analysis-chart-inner live-analysis-chart-inner--line">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={selectedLesson?.timeline || []}
                margin={{ top: 16, right: 20, bottom: 20, left: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" vertical={false} />
                <XAxis
                  dataKey="dakika"
                  type="number"
                  domain={[0, selectedLesson?.durationMin ?? 45]}
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border-soft)' }}
                  tickLine={{ stroke: 'var(--color-border-soft)' }}
                  label={{ value: 'Dakika', position: 'insideBottom', offset: -8, fill: 'var(--color-text-muted)', fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={{ stroke: 'var(--color-border-soft)' }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    const total = payload.reduce((a, e) => a + Number(e.value ?? 0), 0)
                    return (
                      <div className="live-analysis-chart-tooltip">
                        <div className="live-analysis-chart-tooltip-title">Dakika {label}</div>
                        <div className="live-analysis-chart-tooltip-list">
                          {payload.map((e) => (
                            <div key={e.dataKey} className="live-analysis-chart-tooltip-row">
                              <span className="live-analysis-chart-tooltip-dot" style={{ background: e.color }} />
                              <span>{e.name}</span>
                              <strong>{e.value}%</strong>
                            </div>
                          ))}
                        </div>
                        <div className="live-analysis-chart-tooltip-total">Toplam: {total}%</div>
                      </div>
                    )
                  }}
                  cursor={{ stroke: 'var(--color-border-soft)', strokeDasharray: '4 4' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '14px' }}
                  formatter={(value) => <span className="live-analysis-chart-legend-label">{value}</span>}
                  iconType="circle"
                  iconSize={8}
                  className="live-analysis-chart-legend"
                />
                <Line type="monotone" dataKey="odak" name="Odak" stroke="#14B8A6" strokeWidth={2} dot={false} isAnimationActive animationDuration={500} />
                <Line type="monotone" dataKey="stress" name="Stress" stroke="#EF4444" strokeWidth={2} dot={false} isAnimationActive animationDuration={500} />
                <Line type="monotone" dataKey="tereddut" name="Tereddüt" stroke="#F59E0B" strokeWidth={2} dot={false} isAnimationActive animationDuration={500} />
                <Line type="monotone" dataKey="ilgiKaybi" name="İlgi kaybı" stroke="#8B5CF6" strokeWidth={2} dot={false} isAnimationActive animationDuration={500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card live-analysis-students-card animate-on-scroll visible mt-2" data-animate>
        <div className="card-header">
          <h2 className="card-title">Öğrenci bazlı Daisee analizi</h2>
          <p className="card-desc">Yüzdelik dilim (toplam %100). Odak yüksek, diğerleri düşük olmalı.</p>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="live-analysis-table-wrap">
            <table className="live-analysis-table">
              <thead>
                <tr>
                  <th>Öğrenci</th>
                  <th className="live-analysis-cell-center">Odak</th>
                  <th className="live-analysis-cell-center">Stress</th>
                  <th className="live-analysis-cell-center">Tereddüt</th>
                  <th className="live-analysis-cell-center">İlgi kaybı</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {(selectedLesson?.studentScores || []).map((s) => {
                  const iyiOdak = s.odak >= 55
                  const dusukRisk = s.stress <= 22 && s.tereddut <= 18 && s.ilgiKaybi <= 12
                  const ortaRisk = s.stress <= 35 && s.ilgiKaybi <= 20
                  const durum = iyiOdak && dusukRisk ? 'Çok iyi' : iyiOdak && ortaRisk ? 'İyi' : 'Takip önerilir'
                  return (
                    <tr key={s.studentId}>
                      <td>
                        <span className="live-analysis-student-name">{s.name}</span>
                      </td>
                      <td className="live-analysis-cell-center">
                        <span className="live-analysis-badge live-analysis-badge--odak">{s.odak}%</span>
                      </td>
                      <td className="live-analysis-cell-center">
                        <span className="live-analysis-badge live-analysis-badge--stress">{s.stress}%</span>
                      </td>
                      <td className="live-analysis-cell-center">
                        <span className="live-analysis-badge live-analysis-badge--tereddut">{s.tereddut}%</span>
                      </td>
                      <td className="live-analysis-cell-center">
                        <span className="live-analysis-badge live-analysis-badge--ilgiKaybi">{s.ilgiKaybi}%</span>
                      </td>
                      <td>
                        <span className="live-analysis-status">{durum}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
