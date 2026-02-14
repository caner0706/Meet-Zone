import { useState } from 'react'
import { PROJE_ROADMAP_ITEMS, ROADMAP_STATUS } from '../../features/projelerim/projelerimRoadmapData'

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

/** Projelerim görselleri: TÜBİTAK başvuru, etik kurul, API, jüri sunumu, Teknofest tasarım, atölye. viewBox tutarlı, hizalı. */
function RoadmapVisual({ type }) {
  const vb = '0 0 240 100'

  if (type === 'document') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 8)">
          <rect x="0" y="0" width="68" height="58" rx="6" fill="#FEE2E2" stroke="#C41E3A" strokeWidth="1.5" />
          <rect x="10" y="12" width="48" height="5" rx="1" fill="#C41E3A" opacity="0.5" />
          <rect x="10" y="22" width="38" height="5" rx="1" fill="#C41E3A" opacity="0.35" />
          <text x="34" y="52" textAnchor="middle" fill="#9F1239" fontSize="11" fontWeight="600">Özet</text>
        </g>
        <g transform="translate(86, 8)">
          <rect x="0" y="0" width="68" height="58" rx="6" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
          <rect x="10" y="12" width="48" height="5" rx="1" fill="#6366F1" opacity="0.5" />
          <rect x="10" y="22" width="42" height="5" rx="1" fill="#6366F1" opacity="0.35" />
          <text x="34" y="52" textAnchor="middle" fill="#4F46E5" fontSize="11" fontWeight="600">Literatür</text>
        </g>
        <g transform="translate(162, 8)">
          <rect x="0" y="0" width="68" height="58" rx="6" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.5" />
          <rect x="10" y="12" width="48" height="5" rx="1" fill="#14B8A6" opacity="0.5" />
          <rect x="10" y="22" width="40" height="5" rx="1" fill="#14B8A6" opacity="0.35" />
          <text x="34" y="52" textAnchor="middle" fill="#0D9488" fontSize="11" fontWeight="600">Başvuru</text>
        </g>
        <text x="120" y="88" textAnchor="middle" fill="#6B7280" fontSize="10">Proje evrakları</text>
      </svg>
    )
  }

  if (type === 'ethics') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(40, 18)">
          <circle cx="35" cy="32" r="26" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          <path d="M26 32 L32 38 L44 24" stroke="#B45309" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="35" y="72" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="600">Onay</text>
        </g>
        <g transform="translate(130, 18)">
          <rect x="0" y="0" width="80" height="52" rx="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          <rect x="12" y="14" width="56" height="5" rx="1" fill="#64748B" opacity="0.5" />
          <rect x="12" y="24" width="44" height="5" rx="1" fill="#64748B" opacity="0.4" />
          <rect x="12" y="34" width="50" height="5" rx="1" fill="#64748B" opacity="0.3" />
          <text x="40" y="72" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="600">Etik Kurul</text>
        </g>
      </svg>
    )
  }

  if (type === 'api') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="120" y="22" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="700">/api/v1</text>
        <g transform="translate(8, 32)">
          <rect x="0" y="0" width="68" height="38" rx="6" fill="#E0F2FE" stroke="#0092BC" strokeWidth="1.5" />
          <text x="34" y="18" textAnchor="middle" fill="#0369A1" fontSize="10" fontWeight="700">GET</text>
          <text x="34" y="30" textAnchor="middle" fill="#374151" fontSize="9">/profiles</text>
        </g>
        <g transform="translate(86, 32)">
          <rect x="0" y="0" width="68" height="38" rx="6" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="34" y="18" textAnchor="middle" fill="#6D28D9" fontSize="10" fontWeight="700">PATCH</text>
          <text x="34" y="30" textAnchor="middle" fill="#374151" fontSize="9">/profiles/me</text>
        </g>
        <g transform="translate(164, 32)">
          <rect x="0" y="0" width="68" height="38" rx="6" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.5" />
          <text x="34" y="18" textAnchor="middle" fill="#0D9488" fontSize="10" fontWeight="700">Swagger</text>
          <text x="34" y="30" textAnchor="middle" fill="#374151" fontSize="9">Doküman</text>
        </g>
      </svg>
    )
  }

  if (type === 'presentation') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(20, 18)">
          <rect x="0" y="0" width="75" height="52" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="12" y="12" width="51" height="5" rx="1" fill="#94A3B8" opacity="0.6" />
          <rect x="12" y="22" width="42" height="5" rx="1" fill="#94A3B8" opacity="0.45" />
          <rect x="12" y="32" width="48" height="5" rx="1" fill="#94A3B8" opacity="0.35" />
          <text x="37" y="72" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600">Slayt</text>
        </g>
        <g transform="translate(120, 18)">
          <rect x="0" y="0" width="100" height="52" rx="6" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
          <polygon points="50,14 38,26 62,26" fill="#B45309" />
          <rect x="42" y="32" width="16" height="12" rx="2" fill="#B45309" opacity="0.5" />
          <text x="50" y="72" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="600">Demo</text>
        </g>
      </svg>
    )
  }

  if (type === 'design') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(15, 12)">
          <path d="M30 8 L42 28 L30 48 L18 28 Z" fill="#FEE2E2" stroke="#E31937" strokeWidth="2" />
          <circle cx="30" cy="28" r="5" fill="#E31937" />
          <text x="30" y="68" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="600">Roket</text>
        </g>
        <g transform="translate(85, 12)">
          <rect x="0" y="0" width="70" height="42" rx="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          <line x1="12" y1="14" x2="58" y2="14" stroke="#64748B" strokeWidth="1.2" />
          <line x1="12" y1="22" x2="48" y2="22" stroke="#64748B" strokeWidth="1" opacity="0.7" />
          <line x1="12" y1="30" x2="52" y2="30" stroke="#64748B" strokeWidth="1" opacity="0.5" />
          <text x="35" y="68" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600">Hesaplar</text>
        </g>
        <g transform="translate(165, 12)">
          <rect x="0" y="0" width="70" height="42" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          <path d="M22 12 L35 21 L22 30 L28 21 Z" fill="#2563EB" opacity="0.8" />
          <text x="35" y="68" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="600">Simülasyon</text>
        </g>
        <text x="120" y="92" textAnchor="middle" fill="#6B7280" fontSize="10">Tasarım raporu</text>
      </svg>
    )
  }

  if (type === 'workshop') {
    return (
      <svg className="staj-roadmap-visual-svg" viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(12, 12)">
          <rect x="0" y="0" width="62" height="52" rx="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          <rect x="14" y="12" width="10" height="28" rx="2" fill="#94A3B8" />
          <rect x="38" y="18" width="10" height="22" rx="2" fill="#94A3B8" opacity="0.85" />
          <text x="31" y="72" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="600">Atölye</text>
        </g>
        <g transform="translate(92, 12)">
          <rect x="0" y="0" width="56" height="52" rx="6" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="10" y="12" width="36" height="6" rx="1" fill="#B45309" opacity="0.5" />
          <rect x="10" y="22" width="30" height="6" rx="1" fill="#B45309" opacity="0.4" />
          <rect x="10" y="32" width="34" height="6" rx="1" fill="#B45309" opacity="0.35" />
          <text x="28" y="72" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="600">Malzeme</text>
        </g>
        <g transform="translate(172, 18)">
          <rect x="0" y="0" width="56" height="46" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <path d="M18 16 L24 22 L38 10" stroke="#059669" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="28" y="72" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="600">Sipariş</text>
        </g>
      </svg>
    )
  }

  return null
}

function getVisualType(item) {
  if (item.visual) return item.visual
  const d = item.decision || ''
  if (d.includes('etik') || d.includes('Etik')) return 'ethics'
  if (d.includes('API') || d.includes('Swagger') || d.includes('endpoint')) return 'api'
  if (d.includes('sunum') || d.includes('slayt') || d.includes('jüri') || d.includes('demo')) return 'presentation'
  if (d.includes('tasarım') || d.includes('simülasyon') || d.includes('Teknofest') || d.includes('rapor')) return 'design'
  if (d.includes('atölye') || d.includes('malzeme') || d.includes('sipariş')) return 'workshop'
  return 'document'
}

const VISUAL_TITLES = {
  document: 'TÜBİTAK başvuru / Proje özeti ve evraklar',
  ethics: 'Etik kurul onayı',
  api: 'API / Swagger dokümantasyonu',
  presentation: 'Jüri sunumu ve demo',
  design: 'Teknofest tasarım raporu ve simülasyon',
  workshop: 'Atölye ve malzeme planı',
}

function RoadmapDetailModal({ item, onClose }) {
  if (!item) return null
  const plan = item.agentPlan || {}
  const visualType = getVisualType(item)

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
            {!item.hideDate && item.meetingDate && (
              <span className="task-detail-hero-meta">{item.meetingDate}</span>
            )}
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
          <div className="staj-roadmap-visual-panel">
            <div className="staj-roadmap-visual-panel-title">
              {VISUAL_TITLES[visualType] || 'Proje aşaması'}
            </div>
            <RoadmapVisual type={visualType} />
          </div>

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

export default function ProjelerimRoadmap() {
  const [items, setItems] = useState(PROJE_ROADMAP_ITEMS)
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
          TÜBİTAK, Turkcell ve Teknofest toplantılarında alınan kararlar doğrultusunda Gen AI yapılacakları üretir, Agent ise hareket planı ve önerileri sunar. Kartları sütunlar arasında taşıyabilirsin.
        </p>
      </header>

      <div className="staj-roadmap-board">
        <div className="tasks-board-wrap animate-on-scroll" data-animate>
          <div className="tasks-board-bar">
            <span className="tasks-board-badge">Proje toplantıları + Gen AI · Agent</span>
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
