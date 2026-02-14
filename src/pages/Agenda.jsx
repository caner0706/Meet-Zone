import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

function getMonthMatrix(activeDate) {
  const start = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1)
  const end = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0)
  const firstWeekday = (start.getDay() + 6) % 7
  const daysInMonth = end.getDate()
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

const SAMPLE_EVENTS = [
  {
    id: 'e1',
    title: 'Yapay Zeka projeleri toplantısı',
    date: new Date().toISOString().slice(0, 10),
    time: '14:00',
    type: 'meeting',
    context: 'Projelerim · P3',
  },
  {
    id: 'e2',
    title: 'Staj haftalık değerlendirme',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: '10:30',
    type: 'meeting',
    context: 'Staj',
  },
  {
    id: 'e3',
    title: 'API dokümantasyonu tamamlama',
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    time: '17:00',
    type: 'task',
    context: 'Projelerim · P5',
  },
  {
    id: 'e4',
    title: 'Sunum provası',
    date: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
    time: '19:00',
    type: 'meeting',
    context: 'Ders · Canlı',
  },
]

export default function Agenda() {
  const [activeDate, setActiveDate] = useState(() => new Date())
  const monthMatrix = useMemo(() => getMonthMatrix(activeDate), [activeDate])
  const todayIso = new Date().toISOString().slice(0, 10)
  const activeMonthIso = `${activeDate.getFullYear()}-${String(activeDate.getMonth() + 1).padStart(2, '0')}`

  const monthEvents = useMemo(
    () => SAMPLE_EVENTS.filter((e) => e.date.startsWith(activeMonthIso)),
    [activeMonthIso],
  )

  const upcomingEvents = useMemo(
    () =>
      SAMPLE_EVENTS
        .filter((e) => e.date >= todayIso)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [todayIso],
  )

  const monthLabel = activeDate.toLocaleDateString('tr-TR', {
    month: 'long',
    year: 'numeric',
  })

  const goMonth = (delta) => {
    setActiveDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  const goToday = () => setActiveDate(new Date())
  const navigate = useNavigate()

  return (
    <div className="agenda-page">
      <div className="agenda-page__back">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-soft)',
            background: 'var(--color-surface-elevated)',
            color: 'var(--color-text)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
          aria-label="Ana menüye dön"
        >
          <span aria-hidden style={{ fontSize: '1.1rem', lineHeight: 1 }}>←</span>
          Geri
        </button>
      </div>
      <div className="agenda-page__center">
      <header className="agenda-header">
        <div className="agenda-header-left">
          <h1 className="page-title">Ajanda</h1>
          <p className="page-subtitle">
            Yaklaşan toplantılarını ve görevlerini tek ekranda gör. Google Calendar benzeri modern bir görünüm.
          </p>
        </div>
        <div className="agenda-header-right">
          <button type="button" className="agenda-nav-btn" onClick={() => goMonth(-1)} aria-label="Önceki ay">
            ‹
          </button>
          <span className="agenda-month-label">{monthLabel}</span>
          <button type="button" className="agenda-nav-btn" onClick={() => goMonth(1)} aria-label="Sonraki ay">
            ›
          </button>
          <button type="button" className="agenda-today-btn" onClick={goToday}>
            Bugün
          </button>
        </div>
      </header>

      <div className="agenda-layout">
        <section className="agenda-calendar">
          <div className="agenda-weekdays">
            {WEEKDAYS.map((d) => (
              <span key={d} className="agenda-weekday">
                {d}
              </span>
            ))}
          </div>
          <div className="agenda-grid">
            {monthMatrix.map((week, i) =>
              week.map((day, j) => {
                const iso = day
                  ? `${activeDate.getFullYear()}-${String(activeDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : null
                const dayEvents = iso ? monthEvents.filter((e) => e.date === iso) : []
                const isToday = iso === todayIso
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`agenda-cell ${day ? '' : 'agenda-cell--empty'} ${isToday ? 'agenda-cell--today' : ''}`}
                  >
                    {day && (
                      <>
                        <div className="agenda-cell-header">
                          <span className="agenda-cell-day">{day}</span>
                          {dayEvents.length > 0 && (
                            <span className="agenda-cell-count">{dayEvents.length}</span>
                          )}
                        </div>
                        <div className="agenda-cell-events">
                          {dayEvents.slice(0, 2).map((e) => (
                            <span
                              key={e.id}
                              className={`agenda-pill agenda-pill--${e.type === 'meeting' ? 'meeting' : 'task'}`}
                            >
                              <span className="agenda-pill-time">{e.time}</span>
                              <span className="agenda-pill-title">{e.title}</span>
                            </span>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="agenda-more">+{dayEvents.length - 2} daha</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              }),
            )}
          </div>
        </section>

        <aside className="agenda-sidebar">
          <h2 className="agenda-sidebar-title">Yaklaşan planlar</h2>
          <p className="agenda-sidebar-subtitle">
            Bugünden itibaren tüm toplantı ve görevlerini kronolojik sırayla gör.
          </p>
          <ul className="agenda-list">
            {upcomingEvents.map((e) => {
              const [y, m, d] = e.date.split('-').map((n) => parseInt(n, 10))
              const dateObj = new Date(y, m - 1, d)
              const dayLabel = dateObj.toLocaleDateString('tr-TR', { day: 'numeric' })
              const monthLabelShort = dateObj.toLocaleDateString('tr-TR', { month: 'short' })

              return (
                <li key={e.id} className="agenda-item">
                  <div className="agenda-item-date">
                    <span className="agenda-item-day">{dayLabel}</span>
                    <span className="agenda-item-month">{monthLabelShort}</span>
                  </div>
                  <div className="agenda-item-body">
                    <div className="agenda-item-top">
                      <span
                        className={`agenda-chip agenda-chip--${e.type === 'meeting' ? 'meeting' : 'task'}`}
                      >
                        {e.type === 'meeting' ? 'Toplantı' : 'Görev'}
                      </span>
                      <span className="agenda-item-time">{e.time}</span>
                    </div>
                    <h3 className="agenda-item-title">{e.title}</h3>
                    <p className="agenda-item-context">{e.context}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </aside>
      </div>
      </div>
    </div>
  )
}

