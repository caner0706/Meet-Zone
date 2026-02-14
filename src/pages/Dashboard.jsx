import { useState, useMemo } from 'react'
import { STUDENT_COURSES } from '../features/ozet/studentCourseSummaries'
import { COURSE_LIVE_LESSONS, formatOzetDate } from '../features/ozet/courseLiveLessons'

export default function Dashboard() {
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [selectedLessonId, setSelectedLessonId] = useState(null)

  const selectedCourse = useMemo(
    () => STUDENT_COURSES.find((c) => c.id === selectedCourseId),
    [selectedCourseId]
  )
  const lessons = useMemo(
    () => (selectedCourseId ? (COURSE_LIVE_LESSONS[selectedCourseId] || []) : []),
    [selectedCourseId]
  )
  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId),
    [lessons, selectedLessonId]
  )

  // ——— 1) Ders listesi (Biyoloji 1, Biyoloji 2, Kimya, Fizik) ———
  if (!selectedCourseId) {
    return (
      <>
        <header className="page-header animate-enter">
          <h1 className="page-title">Dersler</h1>
          <p className="page-subtitle">
            Katıldığınız dersi seçin; o derse ait canlı dersler ve raporları görüntüleyin.
          </p>
        </header>
          <div className="ozet-student-courses">
            <div className="ozet-student-grid">
              {STUDENT_COURSES.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  className={`ozet-student-course-card ozet-student-course-card--${course.id}`}
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <span className="ozet-student-course-code">{course.code}</span>
                  <h2 className="ozet-student-course-name">{course.name}</h2>
                <span className="ozet-student-course-hint">Canlı derslere git →</span>
                </button>
              ))}
          </div>
        </div>
      </>
    )
  }

  // ——— 2) Seçili dersin canlı dersleri listesi ———
  if (!selectedLessonId) {
    return (
      <>
        <div className="ozet-back-bar">
          <button
            type="button"
            className="btn btn-secondary ozet-back-btn"
            onClick={() => setSelectedCourseId(null)}
          >
            ← Tüm derslere dön
          </button>
        </div>
        <header className="page-header animate-enter">
          <h1 className="page-title">Dersler</h1>
          <p className="page-subtitle">
            {selectedCourse?.name} — canlı dersler. Raporu görmek için derse tıklayın.
          </p>
        </header>
        {lessons.length === 0 ? (
          <div className="card animate-on-scroll visible" data-animate>
            <div className="card-body">
              <p className="summary-text" style={{ color: 'var(--color-text-muted)' }}>
                Bu ders için henüz canlı ders kaydı yok.
              </p>
            </div>
          </div>
        ) : (
          <div className="ozet-lesson-list animate-on-scroll visible" data-animate>
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                type="button"
                className={`ozet-lesson-card ozet-lesson-card--${(idx % 4) + 1}`}
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <span className="ozet-lesson-icon" aria-hidden>📄</span>
                <div className="ozet-lesson-content">
                  <h2 className="ozet-lesson-title">{lesson.title}</h2>
                  <span className="ozet-lesson-meta">
                    {formatOzetDate(lesson.date)} · {lesson.durationMin} dk
                  </span>
                </div>
                <span className="ozet-lesson-arrow" aria-hidden>→</span>
              </button>
            ))}
          </div>
        )}
      </>
    )
  }

  // ——— 3) Seçili canlı dersin raporu (öğrenci şablonu: hocanın anlattıkları, sınavda dikkat, konular, kavramlar, örnekler, kaynakça) ———
  if (!selectedLesson) return null

  return (
    <>
      <div className="ozet-back-bar">
        <button
          type="button"
          className="btn btn-secondary ozet-back-btn"
          onClick={() => setSelectedLessonId(null)}
        >
          ← Canlı derslere dön
        </button>
      </div>

      <header className="page-header animate-enter">
        <h1 className="page-title">Dersler</h1>
        <p className="page-subtitle">
          {selectedLesson.title} — {selectedCourse?.name} · {selectedLesson.lastDate || formatOzetDate(selectedLesson.date)}
        </p>
      </header>

          <div className="ozet-student-summary">
            <section className="card mb-2 ozet-card-main">
              <div className="card-header">
                <h2 className="card-title">Hocanın derste anlattıkları</h2>
                <span className="badge ozet-badge-date">
              Ders tarihi: {selectedLesson.lastDate || formatOzetDate(selectedLesson.date)}
                </span>
              </div>
              <div className="card-body">
                <div className="ozet-summary-paragraphs">
              {(Array.isArray(selectedLesson.summary) ? selectedLesson.summary : [selectedLesson.summary]).filter(Boolean).map((p, i) => (
                    <p key={i} className="summary-text ozet-p">{p}</p>
                  ))}
                </div>
              </div>
            </section>

        {selectedLesson.teacherHighlights && selectedLesson.teacherHighlights.length > 0 && (
              <section className="card mb-2 ozet-card-highlights">
                <div className="card-header">
                  <h2 className="card-title">Hocanın özellikle vurguladıkları</h2>
                  <span className="badge ozet-badge-warn">Sınavda dikkat</span>
                </div>
                <div className="card-body">
                  <ul className="ozet-highlight-list">
                {selectedLesson.teacherHighlights.map((item, i) => (
                      <li key={i} className="ozet-highlight-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

        {selectedLesson.topics && selectedLesson.topics.length > 0 && (
            <section className="card mb-2">
              <div className="card-header">
                <h2 className="card-title">İşlenen konular (detaylı)</h2>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <ul className="ozet-topic-list">
                {selectedLesson.topics.map((t, i) => (
                    <li key={i} className="ozet-topic-item">
                      <h3 className="ozet-topic-title">{t.title}</h3>
                      <p className="ozet-topic-content">{t.content}</p>
                      {t.details && t.details.length > 0 && (
                        <ul className="ozet-topic-details">
                          {t.details.map((d, j) => (
                            <li key={j}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
        )}

        {selectedLesson.keyTerms && selectedLesson.keyTerms.length > 0 && (
              <section className="card mb-2">
                <div className="card-header">
                  <h2 className="card-title">Anahtar kavramlar</h2>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <dl className="ozet-keyterms">
                {selectedLesson.keyTerms.map((kt, i) => (
                      <div key={i} className="ozet-keyterm-item">
                        <dt className="ozet-keyterm-term">{kt.term}</dt>
                        <dd className="ozet-keyterm-def">{kt.definition}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>
            )}

        {selectedLesson.examples && selectedLesson.examples.length > 0 && (
              <section className="card mb-2">
                <div className="card-header">
                  <h2 className="card-title">Derste verilen örnekler</h2>
                </div>
                <div className="card-body">
                  <ul className="ozet-examples-list">
                {selectedLesson.examples.map((ex, i) => (
                      <li key={i} className="ozet-example-item">
                        <strong className="ozet-example-title">{ex.title}</strong>
                        <span className="ozet-example-desc"> — {ex.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

        {selectedLesson.references && selectedLesson.references.length > 0 && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Konuya göre kaynakça önerisi</h2>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <ul className="ozet-ref-list">
                {selectedLesson.references.map((ref, i) => (
                    <li key={i} className="ozet-ref-item">
                      <h4 className="ozet-ref-topic">{ref.topic}</h4>
                      <ul className="ozet-ref-items">
                      {(ref.items || []).map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
        )}
      </div>
    </>
  )
}
