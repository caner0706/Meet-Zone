import { getStoredRole } from '../features/auth/authService'
import {
  PERSONAL_METRICS,
  COURSE_METRICS,
  WEEKLY_ENGAGEMENT,
} from '../features/insights/studentPersonalAnalysis'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
} from 'recharts'

const CHART_COLORS = {
  primary: '#6366F1',
  teal: '#14B8A6',
  tealLight: '#2DD4BF',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  pink: '#EC4899',
  grid: 'rgba(148, 163, 184, 0.2)',
  tooltipBg: 'rgba(30, 41, 59, 0.96)',
}
/** Ders çubukları için farklı renkler (sırayla) */
const COURSE_BAR_COLORS = ['#14B8A6', '#818CF8', '#F59E0B', '#EC4899']

/** Genel profil için 6 metrik: yeşil / turuncu / kırmızı renkleri görebilmek için değerler karışık (yüksek, orta, düşük). */
function getProfileMetrics() {
  const labels = [
    'Katılım',
    'Stress Direnci',
    'Tertip',
    'İlgi',
    'Konuşma',
    'Konuya Bağlılık',
  ]
  return labels.map((label, i) => ({
    label,
    value: [88, 72, 55, 35, 90, 48][i],
  }))
}

/** Yüzdeye göre 4 renk: 80+ yeşil, 60–79 mavi, 40–59 sarı, 40 altı kırmızı. */
function getGaugeColor(value) {
  if (value >= 80) return '#22c55e'
  if (value >= 60) return '#3b82f6'
  if (value >= 40) return '#eab308'
  return '#ef4444'
}

/** Yarım daire gauge: yuvarlak kısım üstte, ortada yüzde; metrik adı yuvarlağın altında. */
function HalfGauge({ value, label }) {
  const v = Math.max(0, Math.min(100, value))
  const color = getGaugeColor(v)
  const cx = 50
  const cy = 58
  const r = 42
  const halfLen = Math.PI * r
  const filled = v / 100
  const dashOffset = halfLen * (1 - filled)

  return (
    <div className="insights-half-gauge">
      <div className="insights-half-gauge-arc-wrap">
        <svg className="insights-half-gauge-svg" viewBox="0 0 100 75" preserveAspectRatio="xMidYMid meet">
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={12}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${halfLen} ${halfLen}`}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="insights-half-gauge-value-wrap" aria-hidden>
          <span className="insights-half-gauge-value">{v.toFixed(0)}%</span>
        </div>
      </div>
      <div className="insights-half-gauge-label" aria-hidden>
        {label}
      </div>
    </div>
  )
}

/** Haftalık veriyi Recharts formatına çevir */
function getWeeklyChartData() {
  return WEEKLY_ENGAGEMENT.map((val, i) => ({
    hafta: `H${i + 1}`,
    katilim: val,
    fullMark: 100,
  }))
}

/** Ders bazlı katılım — aynı renk paleti (80+ yeşil, 60–79 mavi, 40–59 sarı, <40 kırmızı); her renk görünsün diye değerler ayarlı. */
function getCourseParticipationData() {
  const katilimByColor = [88, 72, 55, 35]
  return COURSE_METRICS.map((c, i) => ({
    name: c.name,
    katilim: katilimByColor[i] ?? c.participation,
    sessions: c.sessions,
  }))
}

function StudentPersonalAnalysis() {
  const profileMetrics = getProfileMetrics()
  const weeklyData = getWeeklyChartData()
  const courseParticipationData = getCourseParticipationData()
  const courseBarsData = courseParticipationData // alias (eski referanslar için)

  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">Kişisel analiz</h1>
        <p className="page-subtitle">
          Katıldığın derslere göre performansın, katılım oranları ve haftalık eğilimler grafiklerle özetleniyor.
        </p>
      </header>

      {/* Genel profil: 6 segmentli dairesel gösterge — ortada yüzde, altında metrik adı, hepsi farklı renk */}
      <section className="card insights-chart-card mb-2">
        <div className="card-header">
          <h2 className="card-title">Genel profil (tüm dersler)</h2>
          <span className="badge insights-badge">Profil</span>
        </div>
        <div className="card-body insights-chart-body">
          <p className="insights-chart-desc">
            Yarım daire gösterge: ortada skor, altında metrik adı. Yeşil 80+, mavi 60–79, sarı 40–59, kırmızı &lt;40.
          </p>
          <div className="insights-profile-rings">
            {profileMetrics.map((item) => (
              <HalfGauge key={item.label} value={item.value} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Derslere göre katılım — tek metrik, sade grafik */}
      <section className="card insights-chart-card mb-2">
        <div className="card-header">
          <h2 className="card-title">Derslere göre katılım</h2>
          <span className="badge insights-badge">Katıldığın dersler</span>
        </div>
        <div className="card-body insights-chart-body">
          <p className="insights-chart-desc">
            Her derste katılım oranın; renk yüzdeye göre: yeşil 80+, mavi 60–79, sarı 40–59, kırmızı &lt;40.
          </p>
          <div className="bar-chart-wrap course-performance-simple">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={courseParticipationData}
                margin={{ top: 12, right: 48, bottom: 12, left: 8 }}
                layout="vertical"
                barCategoryGap="20%"
                barSize={28}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="name" width={88} tick={{ fill: 'var(--color-text)', fontSize: 13, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    background: CHART_COLORS.tooltipBg,
                    border: '1px solid var(--color-border-soft)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)',
                  }}
                  formatter={(value, _name, props) => [
                    `${value}% katılım · ${props.payload.sessions} ders`,
                    props.payload.name,
                  ]}
                  labelFormatter={() => null}
                />
                <Bar
                  dataKey="katilim"
                  radius={[0, 6, 6, 0]}
                  name="Katılım"
                  isAnimationActive
                  animationDuration={600}
                >
                  {courseParticipationData.map((entry, index) => (
                    <Cell key={index} fill={getGaugeColor(entry.katilim)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Ders kartları — her ders için mini grafik */}
      <section className="card insights-chart-card mb-2">
        <div className="card-header">
          <h2 className="card-title">Ders bazlı özet</h2>
          <span className="badge insights-badge">Son dönem</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="course-metrics-grid">
            {COURSE_METRICS.map((course) => (
              <div key={course.courseId} className="course-metric-card">
                <div className="course-metric-card-header">
                  <h3 className="course-metric-name">{course.name}</h3>
                  <span className="course-metric-sessions">{course.sessions} ders</span>
                </div>
                <div className="course-metric-mini-chart">
                  <ResponsiveContainer width="100%" height={100}>
                    <BarChart
                      data={[
                        { label: 'Katılım', value: course.participation },
                        { label: 'Odak', value: course.focus },
                        { label: 'Katkı', value: course.contribution },
                      ]}
                      layout="vertical"
                      margin={{ top: 4, right: 4, bottom: 4, left: 44 }}
                    >
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="label" width={32} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                      <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                        <Cell fill={CHART_COLORS.teal} />
                        <Cell fill={CHART_COLORS.primary} />
                        <Cell fill={CHART_COLORS.purple} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="course-metric-footer">
                  <span className="course-metric-big">{course.participation}%</span>
                  <span className="course-metric-label">katılım</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Haftalık eğilim — alan grafiği */}
      <section className="card insights-chart-card mb-2">
        <div className="card-header">
          <h2 className="card-title">Haftalık katılım eğilimi</h2>
          <span className="badge insights-badge">Son 7 hafta</span>
        </div>
        <div className="card-body insights-chart-body">
          <div className="area-chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData} margin={{ top: 12, right: 12, bottom: 8, left: 8 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.teal} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={CHART_COLORS.teal} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                <XAxis dataKey="hafta" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: CHART_COLORS.tooltipBg,
                    border: '1px solid var(--color-border-soft)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)',
                  }}
                  formatter={(value) => [`${value}%`, 'Katılım']}
                />
                <Area
                  type="monotone"
                  dataKey="katilim"
                  name="Katılım"
                  stroke={CHART_COLORS.teal}
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Kısa metin özeti — tek kart */}
      <section className="card personal-analysis-hero">
        <div className="card-body">
          <h2 className="personal-analysis-hero-title">Özet yorum</h2>
          <p className="summary-text" style={{ marginBottom: 0 }}>
            Genel katılım ve tertip skorların yüksek; stress ve konu dışına çıkma düşük. Programlama I ve Veritabanı Yönetim Sistemleri'nde katılımın özellikle iyi. Algoritmalar dersinde ders sayısı nispeten az olduğu için grafikte daha düşük görünebilir — düzenli katılımı sürdür. Haftalık eğilimde H4–H5’te artış var; bu dönemde odak iyi.
          </p>
        </div>
      </section>
    </>
  )
}

function TeacherInsights() {
  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">İçgörüler & Öneriler</h1>
        <p className="page-subtitle">AI destekli analiz: sebep, etki ve önerilen aksiyonlar.</p>
      </header>
      <div className="insight-list">
        <div className="card insight-card animate-on-scroll" data-animate style={{ borderLeft: '4px solid var(--frustration)' }}>
          <div className="card-body">
            <div className="insight-header">
              <span className="insight-badge insight-badge-warn">Konu dışı</span>
              <span className="insight-title">Toplantının %32'si konu dışına çıktı</span>
            </div>
            <div className="insight-body">
              <p><strong>Sebep:</strong> Gündem maddeleri arasında geçişlerde tartışma uzadı.</p>
              <p><strong>Etki:</strong> Karar alma süresi uzadı; 2 karar ertelendi.</p>
              <p><strong>Önerilen aksiyon:</strong> Zaman blokları belirleyin; konu dışına çıkıldığında moderatör uyarısı.</p>
            </div>
          </div>
        </div>
        <div className="card insight-card animate-on-scroll" data-animate style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="card-body">
            <div className="insight-header">
              <span className="insight-badge insight-badge-info">Konuşma dengesi</span>
              <span className="insight-title">Konuşma dengesizliği karar çeşitliliğini azalttı</span>
            </div>
            <div className="insight-body">
              <p><strong>Sebep:</strong> Bir katılımcı toplam konuşma süresinin %55'ini kullandı.</p>
              <p><strong>Önerilen aksiyon:</strong> Round-robin veya süre limiti; sessiz katılımcılara doğrudan söz verin.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Insights() {
  const role = getStoredRole()
  const isStudent = role === 'student'

  return isStudent ? <StudentPersonalAnalysis /> : <TeacherInsights />
}
