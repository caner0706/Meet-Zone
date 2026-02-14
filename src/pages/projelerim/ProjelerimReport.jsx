import { useState, useMemo } from 'react'
import { PROJE_MEETING_REPORTS } from '../../features/projelerim/projelerimReports'

function formatReportDateShort(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Rapor metnini tek bir string olarak toplar (sesli özet için) */
function getReportTextForSpeech(selected) {
  const parts = []
  parts.push(selected.title)
  parts.push(`Tarih: ${formatReportDateShort(selected.date)}. Süre: ${selected.durationMin} dakika.`)
  if (selected.topic) parts.push('İşlenen konu.', selected.topic)
  parts.push('Toplantı özeti.', selected.summary)
  if (selected.agenda?.length) {
    parts.push('Bakılan konular.')
    selected.agenda.forEach((a) => parts.push(a))
  }
  if (selected.keyPoints?.length) {
    parts.push('Üzerinde durulan noktalar.')
    selected.keyPoints.forEach((k) => parts.push(k))
  }
  if (selected.decisions?.length) {
    parts.push('Alınan kararlar.')
    selected.decisions.forEach((d) => parts.push(d))
  }
  if (selected.actionItems?.length) {
    selected.actionItems.forEach((a) => parts.push(`${a.who}: ${a.what}. Son tarih: ${a.dueDate}`))
  }
  if (selected.keyTerms?.length) parts.push('Anahtar kavramlar:', selected.keyTerms.join(', '))
  if (selected.transcriptExcerpts?.length) {
    parts.push('Transkript.')
    selected.transcriptExcerpts.forEach((t) => parts.push(`${t.speaker}: ${t.text}`))
  }
  if (selected.references?.length) {
    parts.push('Kaynakça.')
    selected.references.forEach((r) => parts.push(r.title + (r.author ? `, ${r.author}` : '')))
  }
  parts.push('Katılımcılar:', selected.participants.map((p) => p.name).join(', '))
  return parts.join(' ')
}

export default function ProjelerimReport() {
  const [selectedId, setSelectedId] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const selected = useMemo(
    () => PROJE_MEETING_REPORTS.find((r) => r.id === selectedId),
    [selectedId]
  )

  if (!selected) {
    return (
      <>
        <header className="page-header report-page-header animate-enter">
          <h1 className="page-title">Toplantı Raporları</h1>
          <p className="page-subtitle">
            TÜBİTAK, Turkcell ve Teknofest projelerinizdeki toplantıların raporları. Raporu görmek için toplantıya tıklayın.
          </p>
        </header>
        <div className="report-lesson-list animate-on-scroll visible" data-animate>
          {PROJE_MEETING_REPORTS.map((report) => (
            <button
              key={report.id}
              type="button"
              className="report-lesson-card"
              onClick={() => setSelectedId(report.id)}
            >
              <span className="report-lesson-icon" aria-hidden>📄</span>
              <div className="report-lesson-content">
                <h2 className="report-lesson-title">{report.title}</h2>
                <span className="report-lesson-meta">
                  {formatReportDateShort(report.date)} · {report.durationMin} dk · {report.participants.length} katılımcı
                </span>
              </div>
              <span className="report-lesson-arrow" aria-hidden>→</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  const participantsList = selected.participants.map((p) => p.name).join(', ')
  const transcript = (selected.transcriptExcerpts || []).map((t) => ({ time: t.time, speaker: t.speaker, text: t.text }))

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const text = getReportTextForSpeech(selected)
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'tr-TR'
    u.rate = 0.95
    u.onend = () => setIsSpeaking(false)
    u.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(u)
    setIsSpeaking(true)
  }

  return (
    <>
      <div className="report-back-bar no-print">
        <button
          type="button"
          className="btn btn-secondary report-back-btn"
          onClick={() => setSelectedId(null)}
        >
          ← Raporlara dön
        </button>
      </div>

      <div className="main-report">
        <div className="report-actions no-print">
          <div className="report-buttons">
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              PDF / Yazdır
            </button>
            <button
              type="button"
              className={`btn ${isSpeaking ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleSpeak}
              aria-pressed={isSpeaking}
              title={isSpeaking ? 'Sesli özeti durdur' : 'Raporu sesli özet olarak dinle'}
            >
              {isSpeaking ? '⏹ Durdur' : '🔊 Sesli özet'}
            </button>
          </div>
        </div>

        <div className="report-document animate-on-scroll visible" data-animate>
          <div className="report-cover">
            <div className="report-cover-logo" style={{ background: 'var(--color-surface-elevated)' }}>
              <img src="/Logo.png" alt="Sense AI" />
            </div>
            <h2 className="report-cover-title">Toplantı Raporları</h2>
            <p className="report-cover-meeting">{selected.title}</p>
            <p className="report-cover-date">
              {formatReportDateShort(selected.date)} · {selected.durationMin} dk · Proje
            </p>
          </div>

          {selected.topic && (
            <section className="report-section">
              <h3 className="report-section-title">İşlenen konu</h3>
              <p className="report-text">{selected.topic}</p>
            </section>
          )}

          <section className="report-section">
            <h3 className="report-section-title">Toplantı özeti (detaylı)</h3>
            <p className="report-text report-summary-detailed">{selected.summary}</p>
          </section>

          <section className="report-section">
            <h3 className="report-section-title">Bakılan konular</h3>
            <ul className="report-list report-list-bullet">
              {(selected.agenda || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="report-section">
            <h3 className="report-section-title">Üzerinde durulan noktalar</h3>
            <ul className="report-list report-list-bullet">
              {(selected.keyPoints || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          {selected.decisions && selected.decisions.length > 0 && (
            <section className="report-section">
              <h3 className="report-section-title">Alınan kararlar</h3>
              <ul className="report-list report-list-bullet">
                {selected.decisions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {selected.actionItems && selected.actionItems.length > 0 && (
            <section className="report-section">
              <h3 className="report-section-title">Aksiyon maddeleri</h3>
              <ul className="report-list report-list-bullet">
                {selected.actionItems.map((a, i) => (
                  <li key={i}>
                    <strong>{a.who}</strong>: {a.what} — Son tarih: {a.dueDate}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {selected.keyTerms && selected.keyTerms.length > 0 && (
            <section className="report-section">
              <h3 className="report-section-title">Anahtar kavramlar</h3>
              <div className="report-key-terms">
                {selected.keyTerms.map((term, i) => (
                  <span key={i} className="report-key-term">{term}</span>
                ))}
              </div>
            </section>
          )}

          {transcript.length > 0 && (
            <section className="report-section">
              <h3 className="report-section-title">Toplantı transkripti (kim ne konuştu)</h3>
              <div className="report-transcript">
                {transcript.map((entry, i) => (
                  <div key={i} className="report-transcript-entry">
                    <span className="report-transcript-time">{entry.time}</span>
                    <span className="report-transcript-speaker">{entry.speaker}</span>
                    <p className="report-transcript-text">{entry.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selected.references && selected.references.length > 0 && (
            <section className="report-section">
              <h3 className="report-section-title">Kaynakça</h3>
              <ol className="report-list report-list-numbered report-references">
                {selected.references.map((ref, i) => (
                  <li key={i} className="report-reference-item">
                    {ref.title}
                    {ref.author && `, ${ref.author}`}
                    {ref.year && ` (${ref.year})`}
                    {ref.note && `. ${ref.note}`}
                    {ref.url && (
                      <span className="report-reference-url"> — <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.url}</a></span>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="report-section">
            <h3 className="report-section-title">Katılımcılar</h3>
            <p className="report-text">{participantsList}</p>
          </section>

          <div className="report-footer">
            Bu rapor otomatik oluşturulmuştur. İçerik toplantı kaydı ve transkripte dayanmaktadır.
          </div>
        </div>
      </div>
    </>
  )
}
