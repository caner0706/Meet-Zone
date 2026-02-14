import { useState } from 'react'
import { STAJ_ROADMAP_ITEMS, ROADMAP_STATUS } from '../../features/staj/stajRoadmapData'

const COLUMNS = [
  { id: ROADMAP_STATUS.TODO, title: 'Yapılacak', count: 0 },
  { id: ROADMAP_STATUS.IN_PROGRESS, title: 'Devam Eden', count: 0 },
  { id: ROADMAP_STATUS.DONE, title: 'Tamamlandı', count: 0 },
]

function RoadmapCard({ item, onClick, onDragStart, onDragEnd, isDragging }) {
  return (
    <div
      className={`tasks-card tasks-card--staj-roadmap ${isDragging ? 'tasks-card--dragging' : ''}`}
      data-type="roadmap"
      data-meeting-id={item.meetingId}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', item.id)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart?.(item.id)
      }}
      onDragEnd={() => onDragEnd?.()}
      onClick={() => onClick(item)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
      role="button"
      tabIndex={0}
    >
      <div className="tasks-card-header">
        <span className="tasks-card-type staj-roadmap-meeting-badge" data-type="roadmap">
          Toplantı
        </span>
        <span className="tasks-card-course staj-roadmap-meeting-title">{item.meetingTitle}</span>
      </div>
      <h3 className="tasks-card-title">{item.decision}</h3>
      <p className="tasks-card-desc">
        Gen: {item.genItems?.length ?? 0} yapılacak · Agent: hareket planı
      </p>
      <div className="tasks-card-footer">
        <span className="tasks-card-due">Son: {item.due}</span>
      </div>
      <span className="tasks-card-hint">Detay için tıkla →</span>
    </div>
  )
}

/** Görsel: sade ve anlaşılır — jüri sunumu */
function RoadmapVisual({ type }) {
  if (type === 'database') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="25" width="60" height="45" rx="6" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" />
        <line x1="45" y1="38" x2="65" y2="38" stroke="#6366F1" strokeWidth="1.5" />
        <line x1="45" y1="48" x2="55" y2="48" stroke="#6366F1" strokeWidth="1" opacity="0.7" />
        <path d="M95 47 L115 47" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" />
        <polygon points="115,42 125,47 115,52" fill="#14B8A6" />
        <rect x="130" y="25" width="60" height="45" rx="6" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="2" />
        <line x1="150" y1="38" x2="170" y2="38" stroke="#14B8A6" strokeWidth="1.5" />
        <line x1="150" y1="48" x2="165" y2="48" stroke="#14B8A6" strokeWidth="1" opacity="0.7" />
        <text x="55" y="82" textAnchor="middle" fill="#4F46E5" fontSize="10" fontWeight="600">Şema</text>
        <text x="160" y="82" textAnchor="middle" fill="#0D9488" fontSize="10" fontWeight="600">Yeni</text>
      </svg>
    )
  }
  if (type === 'api') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="110" y="28" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="700">/api/v1</text>
        <rect x="25" y="38" width="50" height="32" rx="6" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
        <text x="50" y="55" textAnchor="middle" fill="#4F46E5" fontSize="9" fontWeight="700">GET</text>
        <text x="50" y="66" textAnchor="middle" fill="#374151" fontSize="8">/profiles/me</text>
        <rect x="85" y="38" width="50" height="32" rx="6" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1.5" />
        <text x="110" y="55" textAnchor="middle" fill="#6D28D9" fontSize="9" fontWeight="700">PATCH</text>
        <text x="110" y="66" textAnchor="middle" fill="#374151" fontSize="8">/profiles/me</text>
        <rect x="145" y="38" width="50" height="32" rx="6" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.5" />
        <text x="170" y="55" textAnchor="middle" fill="#0D9488" fontSize="9" fontWeight="700">GET</text>
        <text x="170" y="66" textAnchor="middle" fill="#374151" fontSize="8">/profiles/:id</text>
      </svg>
    )
  }
  if (type === 'files') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="20" width="45" height="50" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="38" y="28" width="28" height="4" rx="1" fill="#94A3B8" opacity="0.6" />
        <rect x="38" y="36" width="20" height="4" rx="1" fill="#94A3B8" opacity="0.4" />
        <text x="52" y="68" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="600">Docs</text>
        <rect x="105" y="20" width="45" height="50" rx="4" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.5" />
        <rect x="113" y="28" width="28" height="4" rx="1" fill="#14B8A6" opacity="0.5" />
        <text x="127" y="68" textAnchor="middle" fill="#0D9488" fontSize="10" fontWeight="600">Staging</text>
      </svg>
    )
  }
  if (type === 'sprint') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="15" width="55" height="42" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="47" y="42" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="700">Daily</text>
        <rect x="82" y="15" width="55" height="42" rx="8" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
        <text x="109" y="42" textAnchor="middle" fill="#4F46E5" fontSize="11" fontWeight="700">Retro</text>
        <rect x="144" y="15" width="55" height="42" rx="8" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.5" />
        <text x="171" y="42" textAnchor="middle" fill="#0D9488" fontSize="11" fontWeight="700">Story</text>
      </svg>
    )
  }
  return null
}

function RoadmapDetailModal({ item, onClose }) {
  if (!item) return null
  const plan = item.agentPlan || {}
  const visualType = item.visual || (item.decision?.includes('OpenAPI') || item.decision?.includes('API') ? 'api' : item.decision?.includes('Veritabanı') || item.decision?.includes('migrasyon') ? 'database' : item.decision?.includes('Sprint') || item.decision?.includes('Daily') ? 'sprint' : item.decision?.includes('kılavuz') || item.decision?.includes('DoD') ? 'files' : null)

  return (
    <div
      className="task-detail-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="roadmap-detail-title"
    >
      <div className="task-detail-modal staj-roadmap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-detail-hero">
          <div className="task-detail-hero-badges">
            <span className="task-detail-hero-type staj-roadmap-hero-meeting" data-type="roadmap">
              Toplantı: {item.meetingTitle}
            </span>
            <span className="task-detail-hero-meta">{item.meetingDate}</span>
          </div>
          <h2 id="roadmap-detail-title" className="task-detail-hero-title">
            {item.decision}
          </h2>
          <div className="task-detail-meta">
            <span className="task-detail-meta-item">
              <span className="task-detail-meta-icon" aria-hidden>⏱</span>
              Son: {item.due}
            </span>
          </div>
          <button
            type="button"
            className="task-detail-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="task-detail-body">
          {visualType && (
            <div className="staj-roadmap-visual-panel">
              <div className="staj-roadmap-visual-panel-title">
                {visualType === 'database' && 'Veritabanı / Migration akışı'}
                {visualType === 'api' && 'API endpoint yapısı'}
                {visualType === 'files' && 'Doküman / dosya yapısı'}
                {visualType === 'sprint' && 'Sprint katılımı'}
              </div>
              <RoadmapVisual type={visualType} />
            </div>
          )}

          <section className="task-detail-section task-detail-section--gen">
            <h3 className="task-detail-section-title">
              <span className="task-detail-section-icon" aria-hidden>🤖</span>
              Gen — Yapılacaklar
            </h3>
            <p className="task-detail-section-desc">
              Toplantı kararı doğrultusunda yapılması gerekenler (Gen AI çıktısı).
            </p>
            <ul className="task-detail-list task-detail-list--gen">
              {(item.genItems || []).map((text, i) => (
                <li key={i}>
                  <span className="task-detail-step-num">{i + 1}</span>
                  {text}
                </li>
              ))}
            </ul>
          </section>

          <section className="task-detail-section task-detail-section--agent">
            <h3 className="task-detail-section-title">
              <span className="task-detail-section-icon" aria-hidden>🎯</span>
              Agent — Hareket planı
            </h3>
            <p className="task-detail-section-desc">
              Nasıl yapılacağına dair adımlar, öneriler ve kaynaklar (Agent çıktısı).
            </p>

            {/* Hareket planı uygulaması — adımlar, öneriler, kaynaklar (tek görsel blok) */}
            {(plan.steps?.length > 0 || plan.suggestions?.length > 0 || plan.links?.length > 0) && (
              <div className="staj-roadmap-action-visual">
                <h4 className="staj-roadmap-action-visual-title">Hareket planı uygulaması</h4>
                <p className="staj-roadmap-action-visual-desc">Adımlar, öneriler ve kaynaklar — görsel özet</p>
                {(plan.steps?.length > 0) && (
                  <div className="staj-roadmap-action-timeline">
                    {(plan.steps || []).map((step, i) => (
                      <div key={i} className="staj-roadmap-action-step">
                        <div className="staj-roadmap-action-step-num">
                          <span>{i + 1}</span>
                        </div>
                        {i < (plan.steps?.length ?? 0) - 1 && (
                          <div className="staj-roadmap-action-step-line" aria-hidden />
                        )}
                        <div className="staj-roadmap-action-step-content">
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(plan.suggestions?.length > 0) && (
                  <div className="staj-roadmap-action-suggestions">
                    <span className="staj-roadmap-action-suggestions-label">Öneriler</span>
                    <div className="staj-roadmap-action-suggestions-list">
                      {plan.suggestions.map((s, i) => (
                        <div key={i} className="staj-roadmap-action-suggestion-pill">
                          <span className="staj-roadmap-action-suggestion-icon" aria-hidden>💡</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(plan.links?.length > 0) && (
                  <div className="staj-roadmap-action-links">
                    <span className="staj-roadmap-action-links-label">Kaynaklar</span>
                    <div className="staj-roadmap-action-links-list">
                      {plan.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="staj-roadmap-action-link-pill"
                        >
                          <span className="staj-roadmap-action-link-icon" aria-hidden>↗</span>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default function StajRoadmap() {
  const [items, setItems] = useState(STAJ_ROADMAP_ITEMS)
  const [selectedItem, setSelectedItem] = useState(null)
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverColumnId, setDragOverColumnId] = useState(null)

  const handleMove = (itemId, newStatus) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: newStatus } : i))
    )
  }

  const itemsByStatus = {
    [ROADMAP_STATUS.TODO]: items.filter((i) => i.status === ROADMAP_STATUS.TODO),
    [ROADMAP_STATUS.IN_PROGRESS]: items.filter((i) => i.status === ROADMAP_STATUS.IN_PROGRESS),
    [ROADMAP_STATUS.DONE]: items.filter((i) => i.status === ROADMAP_STATUS.DONE),
  }

  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">Yol haritası</h1>
        <p className="page-subtitle">
          Toplantılarda alınan kararlar doğrultusunda Gen AI yapılacakları üretir, Agent ise nasıl yapılacağına dair hareket planı ve önerileri sunar. Kartları sütunlar arasında taşıyabilirsin.
        </p>
      </header>

      <div className="staj-roadmap-board">
      <div className="tasks-board-wrap animate-on-scroll" data-animate>
        <div className="tasks-board-bar">
          <span className="tasks-board-badge">Toplantı + Gen AI · Agent</span>
          <span className="tasks-board-summary">
            {items.length} öğe · Toplantı kararlarından türetildi · Detay için karta tıkla
          </span>
        </div>
        <div className="tasks-board">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className={`tasks-column ${dragOverColumnId === col.id ? 'tasks-column--drag-over' : ''}`}
              data-status={col.id}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                setDragOverColumnId(col.id)
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOverColumnId(null)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setDragOverColumnId(null)
                setDraggedId(null)
                const id = e.dataTransfer.getData('text/plain')
                if (id) handleMove(id, col.id)
              }}
            >
              <div className="tasks-column-header">
                <h2 className="tasks-column-title">{col.title}</h2>
                <span className="tasks-column-count">{itemsByStatus[col.id].length}</span>
              </div>
              <div className="tasks-column-cards">
                {itemsByStatus[col.id].map((item) => (
                  <RoadmapCard
                    key={item.id}
                    item={item}
                    onClick={setSelectedItem}
                    onDragStart={setDraggedId}
                    onDragEnd={() => setDraggedId(null)}
                    isDragging={draggedId === item.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {selectedItem && (
        <RoadmapDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  )
}
