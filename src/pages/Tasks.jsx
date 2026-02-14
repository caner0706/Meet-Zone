import { useState } from 'react'
import {
  GEN_AI_TASKS,
  TASK_STATUS,
  getTypeLabel,
  getCompletionUploadLabel,
} from '../features/tasks/genAiTasks'
const COLUMNS = [
  { id: TASK_STATUS.TODO, title: 'Yapılacak', count: 0 },
  { id: TASK_STATUS.IN_PROGRESS, title: 'Devam Eden', count: 0 },
  { id: TASK_STATUS.DONE, title: 'Tamamlandı', count: 0 },
]

function TaskCard({ task, onClick, onDragStart, onDragEnd, isDragging }) {
  const typeLabel = getTypeLabel(task.type)
  return (
    <div
      className={`tasks-card ${isDragging ? 'tasks-card--dragging' : ''}`}
      data-type={task.type}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart?.(task.id)
      }}
      onDragEnd={() => onDragEnd?.()}
      onClick={() => onClick(task)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(task)}
      role="button"
      tabIndex={0}
    >
      <div className="tasks-card-header">
        <span className="tasks-card-type" data-type={task.type}>
          {typeLabel}
        </span>
        {task.course && task.course !== 'Genel' && (
          <span className="tasks-card-course">{task.course}</span>
        )}
      </div>
      <h3 className="tasks-card-title">{task.title}</h3>
      <p className="tasks-card-desc">{task.description}</p>
      <div className="tasks-card-footer">
        <span className="tasks-card-due">Son: {task.due}</span>
        {task.priority === 'high' && (
          <span className="tasks-card-priority tasks-card-priority--high">Yüksek</span>
        )}
      </div>
      <span className="tasks-card-hint">Detay için tıkla →</span>
    </div>
  )
}

const DEFAULT_TASK_COMPLETION = () => ({
  stepsDone: false,
  uploadedFile: null,
  notes: '',
})

function TaskDetailModal({
  task,
  onClose,
  feedbackMap,
  onFeedback,
  completion,
  onStepsDone,
  onUploadedFile,
  onNotes,
}) {
  if (!task) return null
  const typeLabel = getTypeLabel(task.type)
  const myFeedback = feedbackMap[task.id]
  const comp = completion || DEFAULT_TASK_COMPLETION()
  const uploadLabel = getCompletionUploadLabel(task.type)
  const uploadedFile = comp.uploadedFile ?? comp.summaryFile ?? comp.testFile

  return (
    <div className="task-detail-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="task-detail-title">
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-detail-hero">
          <div className="task-detail-hero-badges">
            <span className="task-detail-hero-type" data-type={task.type}>{typeLabel}</span>
            {task.course && <span className="task-detail-hero-course">{task.course}</span>}
          </div>
          <h2 id="task-detail-title" className="task-detail-hero-title">{task.title}</h2>
          <p className="task-detail-hero-desc">{task.description}</p>
          <div className="task-detail-meta">
            <span className="task-detail-meta-item">
              <span className="task-detail-meta-icon" aria-hidden>⏱</span>
              Son: {task.due}
            </span>
            {task.estimatedTime && (
              <span className="task-detail-meta-item">
                <span className="task-detail-meta-icon" aria-hidden>📌</span>
                Tahmini: {task.estimatedTime}
              </span>
            )}
            <span className={`task-detail-meta-priority task-detail-meta-priority--${task.priority}`}>
              {task.priority === 'high' ? 'Yüksek öncelik' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
            </span>
          </div>
          <button type="button" className="task-detail-close" onClick={onClose} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="task-detail-body">
          {task.tip && (
            <div className="task-detail-tip">
              <span className="task-detail-tip-label">💡 İpucu</span>
              <p className="task-detail-tip-text">{task.tip}</p>
            </div>
          )}

          {task.steps && task.steps.length > 0 && (
            <section className="task-detail-section">
              <h3 className="task-detail-section-title">
                <span className="task-detail-section-icon" aria-hidden>✓</span>
                Yapmanız gerekenler
              </h3>
              <ol className="task-detail-list">
                {task.steps.map((step, i) => (
                  <li key={i}><span className="task-detail-step-num">{i + 1}</span>{step}</li>
                ))}
              </ol>
            </section>
          )}

          {task.watch && task.watch.length > 0 && (
            <section className="task-detail-section">
              <h3 className="task-detail-section-title">
                <span className="task-detail-section-icon" aria-hidden>▶</span>
                İzlemeniz gerekenler
              </h3>
              <ul className="task-detail-watch">
                {task.watch.map((item, i) => (
                  <li key={i}>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="task-detail-link">
                        <span className="task-detail-link-icon">↗</span>
                        {item.label}
                      </a>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {task.roadmap && task.roadmap.length > 0 && (
            <section className="task-detail-section task-detail-section--roadmap">
              <h3 className="task-detail-section-title">
                <span className="task-detail-section-icon" aria-hidden>🗓</span>
                Yol haritası
              </h3>
              <ul className="task-detail-roadmap">
                {task.roadmap.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {(!task.steps?.length && !task.watch?.length && !task.roadmap?.length) && (
            <p className="task-detail-empty">Bu öğe için ek detay henüz eklenmedi.</p>
          )}

          <section className="task-detail-section task-detail-section--completion">
            <h3 className="task-detail-section-title">
              <span className="task-detail-section-icon" aria-hidden>📤</span>
              Yaptıklarım / Sonuçlarım
            </h3>
            <p className="task-detail-completion-desc">
              Adımları tamamladıysan işaretle; görev türüne uygun dosyayı (test, özet, rapor vb.) yükleyebilirsin. Bu sonuçlara göre sistem yeni yol haritası önerebilir (örn. testte çok hata varsa konu tekrarı görevi).
            </p>
            <div className="task-detail-completion-form">
              <label className="task-detail-completion-check">
                <input
                  type="checkbox"
                  checked={comp.stepsDone}
                  onChange={(e) => onStepsDone(task.id, e.target.checked)}
                />
                <span>Adımları ve yol haritasını tamamladım</span>
              </label>
              <div className="task-detail-completion-uploads">
                <div className="task-detail-upload-row">
                  <label className="task-detail-upload-label">
                    <span>{uploadLabel}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      className="task-detail-upload-input"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        onUploadedFile(task.id, f || null)
                      }}
                    />
                    <span className="task-detail-upload-btn">Dosya seç</span>
                  </label>
                  {uploadedFile && (
                    <span className="task-detail-upload-badge">
                      {uploadedFile.name}
                      <button type="button" className="task-detail-upload-remove" onClick={() => onUploadedFile(task.id, null)} aria-label="Kaldır">×</button>
                    </span>
                  )}
                </div>
              </div>
              <div className="task-detail-notes-wrap">
                <label htmlFor={`task-notes-${task.id}`} className="task-detail-notes-label">Notlarım (isteğe bağlı)</label>
                <textarea
                  id={`task-notes-${task.id}`}
                  className="task-detail-notes"
                  placeholder="Örn: Bu konuda zorlandım, testte şu sorularda hata yaptım..."
                  value={comp.notes}
                  onChange={(e) => onNotes(task.id, e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </section>

          <section className="task-detail-section task-detail-section--feedback">
            <h3 className="task-detail-section-title">
              <span className="task-detail-section-icon" aria-hidden>↩</span>
              Senin geri bildirimin
            </h3>
            <p className="task-detail-feedback-desc">
              Bu öneriyi nasıl buldun? Geri bildirimin yol haritasını kişiselleştirmek için kullanılır.
            </p>
            <div className="task-detail-feedback-btns">
              <button
                type="button"
                className={`task-detail-feedback-btn ${myFeedback === 'hard' ? 'active' : ''}`}
                onClick={() => onFeedback(task.id, 'hard')}
              >
                Zor geldi
              </button>
              <button
                type="button"
                className={`task-detail-feedback-btn ${myFeedback === 'done' ? 'active' : ''}`}
                onClick={() => onFeedback(task.id, 'done')}
              >
                Tamamladım
              </button>
              <button
                type="button"
                className={`task-detail-feedback-btn ${myFeedback === 'postpone' ? 'active' : ''}`}
                onClick={() => onFeedback(task.id, 'postpone')}
              >
                Erteliyorum
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function Tasks() {
  const [tasks, setTasks] = useState(GEN_AI_TASKS)
  const [selectedTask, setSelectedTask] = useState(null)
  const [feedbackMap, setFeedbackMap] = useState({}) // taskId -> 'hard' | 'done' | 'postpone'
  const [taskCompletion, setTaskCompletion] = useState({}) // taskId -> { stepsDone, uploadedFile, notes }
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dragOverColumnId, setDragOverColumnId] = useState(null)

  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )
  }

  const handleFeedback = (taskId, value) => {
    setFeedbackMap((prev) => ({ ...prev, [taskId]: value }))
  }

  const getCompletion = (taskId) => taskCompletion[taskId] || DEFAULT_TASK_COMPLETION()

  const handleStepsDone = (taskId, checked) => {
    setTaskCompletion((prev) => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || DEFAULT_TASK_COMPLETION()), stepsDone: checked },
    }))
  }

  const handleUploadedFile = (taskId, file) => {
    setTaskCompletion((prev) => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || DEFAULT_TASK_COMPLETION()), uploadedFile: file ? { name: file.name } : null },
    }))
  }

  const handleNotes = (taskId, notes) => {
    setTaskCompletion((prev) => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || DEFAULT_TASK_COMPLETION()), notes },
    }))
  }

  const tasksByStatus = {
    [TASK_STATUS.TODO]: tasks.filter((t) => t.status === TASK_STATUS.TODO),
    [TASK_STATUS.IN_PROGRESS]: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS),
    [TASK_STATUS.DONE]: tasks.filter((t) => t.status === TASK_STATUS.DONE),
  }

  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">Öğrenci Yol Haritası</h1>
        <p className="page-subtitle">
          Yol haritası sadece AI tarafından değil, senin hedeflerin ve geri bildirimlerinle birlikte şekillenir. Önerileri incele, geri bildirim ver, istersen AI asistanla konuş.
        </p>
      </header>

      <div className="tasks-board-wrap animate-on-scroll" data-animate>
        <div className="tasks-board-bar">
          <span className="tasks-board-badge">Sen + AI</span>
          <span className="tasks-board-summary">
            {tasks.length} öğe · Kartlara tıklayın, detayları görün ve geri bildirim verin
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
                setDraggedTaskId(null)
                const taskId = e.dataTransfer.getData('text/plain')
                if (taskId) handleMoveTask(taskId, col.id)
              }}
            >
              <div className="tasks-column-header">
                <h2 className="tasks-column-title">{col.title}</h2>
                <span className="tasks-column-count">{tasksByStatus[col.id].length}</span>
              </div>
              <div className="tasks-column-cards">
                {tasksByStatus[col.id].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={setSelectedTask}
                    onDragStart={setDraggedTaskId}
                    onDragEnd={() => setDraggedTaskId(null)}
                    isDragging={draggedTaskId === task.id}
                  />
                ))}
                  </div>
                </div>
            ))}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          feedbackMap={feedbackMap}
          onFeedback={handleFeedback}
          completion={getCompletion(selectedTask.id)}
          onStepsDone={handleStepsDone}
          onUploadedFile={handleUploadedFile}
          onNotes={handleNotes}
        />
      )}
    </>
  )
}
