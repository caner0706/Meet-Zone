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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { STAJ_MEETING_ANALYSES } from '../../features/staj/meetingAnalysisData'

const COLORS = { odak: '#14B8A6', stress: '#EF4444', tereddut: '#F59E0B', sikilmis: '#8B5CF6' }

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function StajAnalysis() {
  const [selectedId, setSelectedId] = useState(null)
  const selected = useMemo(
    () => STAJ_MEETING_ANALYSES.find((a) => a.id === selectedId),
    [selectedId]
  )

  const averages = useMemo(() => {
    if (!selected?.timeline?.length) return { odak: 0, stress: 0, tereddut: 0, sikilmis: 0 }
    const n = selected.timeline.length
    const sum = (key) => selected.timeline.reduce((a, row) => a + (row[key] ?? 0), 0)
    return {
      odak: Math.round(sum('odak') / n),
      stress: Math.round(sum('stress') / n),
      tereddut: Math.round(sum('tereddut') / n),
      sikilmis: Math.round(sum('sikilmis') / n),
    }
  }, [selected])

  const pieData = useMemo(() => {
    if (!selected?.timeline?.length) return [{ name: 'Veri yok', value: 100, color: 'var(--color-border-soft)' }]
    const avg = { odak: 0, stress: 0, tereddut: 0, sikilmis: 0 }
    selected.timeline.forEach((row) => {
      avg.odak += row.odak ?? 0
      avg.stress += row.stress ?? 0
      avg.tereddut += row.tereddut ?? 0
      avg.sikilmis += row.sikilmis ?? 0
    })
    const n = selected.timeline.length
    const data = [
      { name: 'Odak', value: Math.round(avg.odak / n), color: COLORS.odak },
      { name: 'Stress', value: Math.round(avg.stress / n), color: COLORS.stress },
      { name: 'Tereddüt', value: Math.round(avg.tereddut / n), color: COLORS.tereddut },
      { name: 'Sıkılmış', value: Math.round(avg.sikilmis / n), color: COLORS.sikilmis },
    ].filter((d) => d.value > 0)
    return data.length ? data : [{ name: 'Veri yok', value: 100, color: 'var(--color-border-soft)' }]
  }, [selected])

  const participantBarData = useMemo(() => {
    if (!selected?.participantScores?.length) return []
    return selected.participantScores.map((p) => ({
      name: p.name.split(' ')[0],
      Odak: p.odak,
      Stress: p.stress,
      Tereddüt: p.tereddut,
      Sıkılmış: p.sikilmis,
    }))
  }, [selected])

  const speakingData = useMemo(() => {
    if (!selected?.speakingMinutes?.length) return []
    return [...selected.speakingMinutes].sort((a, b) => b.minutes - a.minutes)
  }, [selected])

  /** Dakika dakika grafik için örneklenmiş veri (her 3 dakikada bir) — daha sade çizgiler */
  const lineChartData = useMemo(() => {
    const raw = selected?.timeline || []
    if (raw.length <= 15) return raw
    const step = Math.max(1, Math.floor(raw.length / 15))
    return raw.filter((_, i) => i % step === 0 || i === raw.length - 1)
  }, [selected])

  // ——— Liste: toplantı kartları ———
  if (!selected) {
    return (
      <>
        <header className="page-header meeting-analysis-header animate-enter">
          <h1 className="page-title">Toplantı Verimlilik Analizi</h1>
          <p className="page-subtitle">
            DAISEE modeli ile dakika bazında odak, stress, tereddüt ve sıkılmışlık dağılımı. Bir toplantı seçin.
          </p>
        </header>
        <div className="meeting-analysis-list animate-on-scroll visible" data-animate>
          {STAJ_MEETING_ANALYSES.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              className={`meeting-analysis-card meeting-analysis-card--${idx % 3}`}
              onClick={() => setSelectedId(m.id)}
            >
              <span className="meeting-analysis-card-icon" aria-hidden>📊</span>
              <div className="meeting-analysis-card-content">
                <h2 className="meeting-analysis-card-title">{m.title}</h2>
                <span className="meeting-analysis-card-meta">
                  {formatDate(m.date)} · {m.durationMin} dk · {m.participantScores.length} katılımcı
                </span>
                <div className="meeting-analysis-card-score">
                  <span className="meeting-analysis-card-score-label">Verimlilik</span>
                  <span className="meeting-analysis-card-score-value">{m.effectivenessScore}%</span>
                </div>
              </div>
              <span className="meeting-analysis-card-arrow" aria-hidden>→</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  // ——— Detay: grafik ağırlıklı dashboard ———
  return (
    <>
      <div className="meeting-analysis-back-bar">
        <button
          type="button"
          className="btn btn-secondary meeting-analysis-back-btn"
          onClick={() => setSelectedId(null)}
        >
          ← Toplantılara dön
        </button>
      </div>

      <header className="page-header meeting-analysis-header animate-enter">
        <h1 className="page-title">{selected.title}</h1>
        <p className="page-subtitle">
          {formatDate(selected.date)} · {selected.durationMin} dk · DAISEE analizi
        </p>
      </header>

      {/* Üst: 5 özet kartı (görseldeki gibi) */}
      <div className="live-analysis-detail-stats animate-on-scroll visible" data-animate>
        <div className="live-analysis-stat-card live-analysis-stat-card--effectiveness">
          <span className="live-analysis-stat-icon" aria-hidden>📊</span>
          <div className="live-analysis-stat-content">
            <span className="live-analysis-stat-value">{selected.effectivenessScore}%</span>
            <span className="live-analysis-stat-label">Toplantı verimliliği</span>
          </div>
        </div>
        <div className="live-analysis-stat-card live-analysis-stat-card--odak">
          <span className="live-analysis-stat-icon" aria-hidden>🎯</span>
          <div className="live-analysis-stat-content">
            <span className="live-analysis-stat-value">{averages.odak}%</span>
            <span className="live-analysis-stat-label">Ort. odak</span>
          </div>
        </div>
        <div className="live-analysis-stat-card live-analysis-stat-card--stress">
          <span className="live-analysis-stat-icon" aria-hidden>⚠</span>
          <div className="live-analysis-stat-content">
            <span className="live-analysis-stat-value">{averages.stress}%</span>
            <span className="live-analysis-stat-label">Ort. stress</span>
          </div>
        </div>
        <div className="live-analysis-stat-card live-analysis-stat-card--duration">
          <span className="live-analysis-stat-icon" aria-hidden>⏱</span>
          <div className="live-analysis-stat-content">
            <span className="live-analysis-stat-value">{selected.durationMin}</span>
            <span className="live-analysis-stat-label">Dakika</span>
          </div>
        </div>
        <div className="live-analysis-stat-card live-analysis-stat-card--students">
          <span className="live-analysis-stat-icon" aria-hidden>👥</span>
          <div className="live-analysis-stat-content">
            <span className="live-analysis-stat-value">{selected.participantScores?.length ?? 0}</span>
            <span className="live-analysis-stat-label">Katılımcı</span>
          </div>
        </div>
      </div>

      {/* Sade çizgi grafiği: Dakika dakika toplantı analizi */}
      <div className="card live-analysis-chart-card animate-on-scroll visible" data-animate>
        <div className="card-header">
          <h2 className="card-title">Dakika dakika toplantı analizi</h2>
          <p className="card-desc">
            Yüzdelik dilim (toplam %100). Daisee: <strong>Odak</strong>, <strong>Stress</strong>, <strong>Tereddüt</strong>, <strong>İlgi kaybı</strong>.
          </p>
        </div>
        <div className="card-body live-analysis-chart-card-body">
          <div className="live-analysis-chart-inner live-analysis-chart-inner--line">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={lineChartData}
                margin={{ top: 20, right: 24, bottom: 24, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" vertical={false} opacity={0.6} />
                <XAxis
                  dataKey="dakika"
                  type="number"
                  domain={[0, selected.durationMin ?? 45]}
                  tickCount={10}
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border-soft)' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tickCount={5}
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                  width={36}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="live-analysis-chart-tooltip">
                        <div className="live-analysis-chart-tooltip-title">{label}. dk</div>
                        <div className="live-analysis-chart-tooltip-list">
                          {payload.map((e) => (
                            <div key={e.dataKey} className="live-analysis-chart-tooltip-row">
                              <span className="live-analysis-chart-tooltip-dot" style={{ background: e.color }} />
                              <span>{e.name}</span>
                              <strong>{e.value}%</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }}
                  cursor={{ stroke: 'var(--color-border-soft)', strokeDasharray: '4 4' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '12px' }}
                  formatter={(value) => <span className="live-analysis-chart-legend-label">{value}</span>}
                  iconType="circle"
                  iconSize={6}
                  className="live-analysis-chart-legend"
                />
                <Line type="monotone" dataKey="odak" name="Odak" stroke="#14B8A6" strokeWidth={1.8} strokeOpacity={0.95} dot={false} isAnimationActive animationDuration={600} />
                <Line type="monotone" dataKey="stress" name="Stress" stroke="#EF4444" strokeWidth={1.8} strokeOpacity={0.95} dot={false} isAnimationActive animationDuration={600} />
                <Line type="monotone" dataKey="tereddut" name="Tereddüt" stroke="#F59E0B" strokeWidth={1.8} strokeOpacity={0.95} dot={false} isAnimationActive animationDuration={600} />
                <Line type="monotone" dataKey="sikilmis" name="İlgi kaybı" stroke="#8B5CF6" strokeWidth={1.8} strokeOpacity={0.95} dot={false} isAnimationActive animationDuration={600} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ortalama DAISEE donut + Konuşma süresi */}
      <div className="meeting-analysis-grid-2">
        <div className="card meeting-analysis-chart-card animate-on-scroll visible" data-animate>
          <div className="card-header">
            <h2 className="card-title">Ortalama DAISEE dağılımı</h2>
            <p className="card-desc">Toplantı boyunca yüzdelik oranlar (toplam %100).</p>
          </div>
          <div className="card-body meeting-analysis-chart-body meeting-analysis-pie-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={96}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={{ stroke: 'var(--color-border-soft)' }}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="var(--color-surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card meeting-analysis-chart-card animate-on-scroll visible" data-animate>
          <div className="card-header">
            <h2 className="card-title">Konuşma süresi</h2>
            <p className="card-desc">Katılımcı başına konuşulan dakika.</p>
          </div>
          <div className="card-body meeting-analysis-chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={speakingData} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" horizontal={false} />
                <XAxis type="number" unit=" dk" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} width={56} />
                <Tooltip formatter={(value) => [`${value} dakika`, 'Konuşma']} contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-soft)' }} />
                <Bar dataKey="minutes" name="Dakika" fill="var(--color-cognition)" radius={[0, 4, 4, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Katılımcı bazlı DAISEE */}
      <div className="card meeting-analysis-chart-card meeting-analysis-chart-card--wide animate-on-scroll visible mt-2" data-animate>
        <div className="card-header">
          <h2 className="card-title">Katılımcı bazlı DAISEE</h2>
          <p className="card-desc">Her katılımcı için Odak, Stress, Tereddüt, Sıkılmış (yüzde).</p>
        </div>
        <div className="card-body meeting-analysis-chart-body">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={participantBarData} margin={{ top: 12, right: 16, bottom: 16, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} axisLine={{ stroke: 'var(--color-border-soft)' }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-soft)' }} formatter={(value) => [`${value}%`, '']} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} className="meeting-analysis-legend" />
              <Bar dataKey="Odak" fill={COLORS.odak} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Stress" fill={COLORS.stress} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Tereddüt" fill={COLORS.tereddut} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Sıkılmış" fill={COLORS.sikilmis} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zaman dilimi özeti */}
      <div className="meeting-analysis-segments animate-on-scroll visible mt-2" data-animate>
        <h3 className="meeting-analysis-segments-title">Zaman dilimine göre ortalama odak</h3>
        <div className="meeting-analysis-segments-grid">
          {(() => {
            const len = selected.timeline?.length ?? 0
            const third = Math.floor(len / 3) || 1
            const start = selected.timeline?.slice(0, third) ?? []
            const mid = selected.timeline?.slice(third, third * 2) ?? []
            const end = selected.timeline?.slice(third * 2) ?? []
            const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, r) => a + (r.odak ?? 0), 0) / arr.length) : 0)
            return (
              <>
                <div className="meeting-analysis-segment meeting-analysis-segment--start">
                  <span className="meeting-analysis-segment-value">{avg(start)}%</span>
                  <span className="meeting-analysis-segment-label">Başlangıç</span>
                  <span className="meeting-analysis-segment-range">0–{third} dk</span>
                </div>
                <div className="meeting-analysis-segment meeting-analysis-segment--mid">
                  <span className="meeting-analysis-segment-value">{avg(mid)}%</span>
                  <span className="meeting-analysis-segment-label">Orta</span>
                  <span className="meeting-analysis-segment-range">{third}–{third * 2} dk</span>
                </div>
                <div className="meeting-analysis-segment meeting-analysis-segment--end">
                  <span className="meeting-analysis-segment-value">{avg(end)}%</span>
                  <span className="meeting-analysis-segment-label">Son</span>
                  <span className="meeting-analysis-segment-range">{third * 2}–{len} dk</span>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </>
  )
}
