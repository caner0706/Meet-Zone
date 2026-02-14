import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import { getStoredUser, getStoredRole } from '../features/auth/authService'

/** Türkçe ay isimleri */
const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

/** Haftanın günleri (Pazartesi başlar) */
const WEEKDAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

/** Ayın takvim gridini üretir (7 sütun, Pazartesi başlar). Boş hücreler null. */
function getCalendarGrid(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const daysInMonth = last.getDate()
  const firstWeekday = (first.getDay() + 6) % 7
  const grid = []
  let row = Array(7).fill(null)
  let col = firstWeekday
  for (let d = 1; d <= daysInMonth; d++) {
    row[col] = d
    col++
    if (col === 7) {
      grid.push(row)
      row = Array(7).fill(null)
      col = 0
    }
  }
  if (col > 0) grid.push(row)
  return grid
}

/** Öğrenci ana sayfa: 4 yuvarlak — Derslerim, Stajım, Projelerim, + (renkli) */
const STUDENT_HUB_ITEMS = [
  { to: ROUTES.LIVE, label: 'Derslerim', icon: '📚', color: 'teal' },   // Derslerim → kitap
  { to: ROUTES.STAJ, label: 'Stajım', icon: '🏢', color: 'amber' },    // Stajım → ofis / iş
  { to: ROUTES.PROJELERIM, label: 'Projelerim', icon: '🚀', color: 'violet' }, // Projelerim → roket
  { to: '#', label: '', icon: '＋', isAdd: true, color: 'muted' },     // Yeni / ekle
]

const GUNCEL_ITEMS_TEACHER = [
  { to: ROUTES.LIVE, title: 'Ders Oluştur', meta: 'Toplantı / canlı ders başlat', description: 'Yeni toplantı veya canlı ders oluşturun; öğrenciler oda kodu ile katılır.', linkText: 'Derse git', color: 'teal' },
  { to: ROUTES.REPORT, title: 'Ders Raporları', meta: 'Son ders · raporlar', description: 'Toplantı notları, katılımcılar ve alınan kararlar. PDF veya sayfa olarak inceleyebilirsiniz.', linkText: 'Raporları aç', color: 'blue' },
  { to: ROUTES.MEETING_ANALYSIS, title: 'Canlı Ders Analizi', meta: 'Canlı ders verileri', description: 'Sınıfa göre canlı dersler ve Daisee analizleri. Soldan Canlı Ders Analizi sayfasına gidebilirsiniz.', linkText: 'Analizi gör', color: 'violet' },
  { to: ROUTES.TASK_ANALYTICS, title: 'Görev Takip Analizi', meta: 'Öğrenci ilerlemesi', description: 'Öğrencilerin görev tamamlama ve ilerleme analizleri.', linkText: 'Analize git', color: 'amber' },
]

export default function Home() {
  const displayName = getStoredUser()
  const role = getStoredRole()
  const isTeacher = role === 'teacher'
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = `${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`
  const dayNum = now.getDate()
  const monthName = MONTH_NAMES[now.getMonth()]
  const yearNum = now.getFullYear()
  const calendarGrid = getCalendarGrid(now)
  const secondsDeg = now.getSeconds() * 6
  const minutesDeg = now.getMinutes() * 6 + now.getSeconds() * 0.1
  const hoursDeg = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5

  return (
    <div className={`dashboard-home ${!isTeacher ? 'dashboard-home--hub-page' : ''}`}>
      {isTeacher && (
        <section className="dashboard-home-hero">
          <h1 className="dashboard-home-title">
            Hoş geldin, <span className="dashboard-home-name">{displayName}</span>
          </h1>
          <p className="dashboard-home-subtitle">
            Canlı ders başlatabilir, özet ve analizlere soldan erişebilirsin.
          </p>
        </section>
      )}

      {isTeacher ? (
        <section className="dashboard-home-recent">
          <h2 className="dashboard-home-section-title">Güncel</h2>
          <p className="dashboard-home-section-desc">
            Son özet, rapor ve görevlere hızlıca ulaş; detay için ilgili sayfaya geç.
          </p>
          <div className="dashboard-home-recent-grid">
            {GUNCEL_ITEMS_TEACHER.map((item, i) => (
              <Link key={`${item.to}-${i}`} to={item.to} className={`dashboard-home-teaser dashboard-home-teaser--${item.color}`} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                <span className="dashboard-home-teaser-title">{item.title}</span>
                <span className="dashboard-home-teaser-meta">{item.meta}</span>
                <p className="dashboard-home-teaser-desc">{item.description}</p>
                <span className="dashboard-home-teaser-link">{item.linkText} →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <div className="dashboard-home-top">
            <div className="dashboard-home-datetime">
              <div className="datetime-widget">
                <div className="clock-visual" title={timeStr}>
                  <div className="clock-visual-inner">
                    <svg className="clock-face" viewBox="0 0 100 100" aria-hidden>
                      <circle className="clock-face-bg" cx="50" cy="50" r="45" />
                      <circle className="clock-face-circle" cx="50" cy="50" r="45" />
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                        <line
                          key={i}
                          className="clock-tick"
                          x1="50"
                          y1="10"
                          x2="50"
                          y2={i % 3 === 0 ? 18 : 14}
                          transform={`rotate(${i * 30} 50 50)`}
                        />
                      ))}
                      <line
                        className="clock-hand clock-hand-hour"
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="30"
                        transform={`rotate(${hoursDeg} 50 50)`}
                      />
                      <line
                        className="clock-hand clock-hand-minute"
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="20"
                        transform={`rotate(${minutesDeg} 50 50)`}
                      />
                      <line
                        className="clock-hand clock-hand-second"
                        x1="50"
                        y1="52"
                        x2="50"
                        y2="16"
                        transform={`rotate(${secondsDeg} 50 50)`}
                      />
                      <circle className="clock-cap" cx="50" cy="50" r="3.5" />
                    </svg>
                  </div>
                  <span className="clock-digital">{timeStr}</span>
                </div>
                <div className="datetime-widget-divider" aria-hidden />
                <div className="calendar-visual" title={dateStr}>
                  <Link to={ROUTES.AGENDA} className="calendar-card calendar-card--link">
                    <div className="calendar-header">
                      <span className="calendar-month">{monthName}</span>
                      <span className="calendar-year-label">{yearNum}</span>
                    </div>
                    <div className="calendar-weekdays">
                      {WEEKDAY_LABELS.map((label) => (
                        <span key={label} className="calendar-weekday">{label}</span>
                      ))}
                    </div>
                    <div className="calendar-grid">
                      {calendarGrid.map((row, ri) =>
                        row.map((day, ci) => (
                          <span
                            key={`${ri}-${ci}`}
                            className={`calendar-cell ${day === dayNum ? 'calendar-cell--today' : ''} ${day === null ? 'calendar-cell--empty' : ''}`}
                          >
                            {day !== null ? day : ''}
                          </span>
                        ))
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <section className="dashboard-home-header-center">
            <span className="dashboard-home-logo-badge">
              <span className="dashboard-home-logo-badge-inner">
                <img src="/Logo.png" alt="Meet Zone" className="dashboard-home-header-logo" />
              </span>
            </span>
            <h1 className="dashboard-home-brand-name">Meet Zone</h1>
            <h2 className="dashboard-home-header-title">
              Hoş geldin, <span className="dashboard-home-header-name">{displayName}</span>
            </h2>
            <p className="dashboard-home-header-desc">
              Meet Zone ile derslerini ve projelerini takip edebilirsin.
            </p>
          </section>
          <section className="dashboard-home-hub">
            <div className="dashboard-home-hub-circles">
              {STUDENT_HUB_ITEMS.map((item, i) => (
                <Link
                  key={item.label || 'add'}
                  to={item.to}
                  className={`dashboard-home-circle dashboard-home-circle--${item.color || 'teal'} ${item.isAdd ? 'dashboard-home-circle--add' : ''}`}
                  style={{ animationDelay: `${0.15 + i * 0.12}s` }}
                >
                  <span className="dashboard-home-circle-glow" />
                  <span className="dashboard-home-circle-inner">
                    <span className="dashboard-home-circle-icon">{item.icon}</span>
                    <span className="dashboard-home-circle-label">{item.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <section className="dashboard-home-quick-start">
            <Link to={ROUTES.QUICK_MEETING} className="quick-start-card">
              <div className="quick-start-glow" />
              <div className="quick-start-inner">
                <div className="quick-start-icon">▶</div>
                <div className="quick-start-info">
                  <h3 className="quick-start-title">Hızlı Toplantı Başlat</h3>
                </div>
              </div>
              <div className="quick-start-badge">Başla</div>
            </Link>
          </section>
        </>
      )}
    </div>
  )
}
