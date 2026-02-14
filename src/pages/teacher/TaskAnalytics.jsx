import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { getStoredBranch } from '../../features/auth/authService'
import { getTasksByBranch } from '../../features/tasks/genAiTasks'
import { TASK_STATUS } from '../../features/tasks/genAiTasks'

const BRANCH_LABELS = { biyoloji: 'Biyoloji', matematik: 'Matematik', fizik: 'Fizik', kimya: 'Kimya' }

/** Demo: öğrenciler ve görev ilerlemeleri (gerçekte API'den gelir) */
const DEMO_STUDENT_PROGRESS = {
  's1': { name: 'Elif K.', progress: { t1: TASK_STATUS.DONE, t2: TASK_STATUS.IN_PROGRESS, t4: TASK_STATUS.DONE, t5: TASK_STATUS.TODO, t8: TASK_STATUS.TODO } },
  's2': { name: 'Mehmet Y.', progress: { t1: TASK_STATUS.IN_PROGRESS, t2: TASK_STATUS.TODO, t4: TASK_STATUS.IN_PROGRESS, t5: TASK_STATUS.DONE, t8: TASK_STATUS.TODO } },
  's3': { name: 'Ayşe K.', progress: { t1: TASK_STATUS.DONE, t2: TASK_STATUS.DONE, t4: TASK_STATUS.DONE, t5: TASK_STATUS.DONE, t8: TASK_STATUS.IN_PROGRESS } },
  's4': { name: 'Can D.', progress: { t1: TASK_STATUS.TODO, t2: TASK_STATUS.TODO, t4: TASK_STATUS.TODO, t5: TASK_STATUS.TODO, t8: TASK_STATUS.TODO } },
  's5': { name: 'Zeynep A.', progress: { t1: TASK_STATUS.DONE, t2: TASK_STATUS.DONE, t4: TASK_STATUS.IN_PROGRESS, t5: TASK_STATUS.IN_PROGRESS, t8: TASK_STATUS.TODO } },
  's6': { name: 'Burak T.', progress: { t1: TASK_STATUS.DONE, t2: TASK_STATUS.TODO, t4: TASK_STATUS.TODO, t5: TASK_STATUS.IN_PROGRESS, t8: TASK_STATUS.TODO } },
  's7': { name: 'Deniz K.', progress: { t1: TASK_STATUS.IN_PROGRESS, t2: TASK_STATUS.DONE, t4: TASK_STATUS.IN_PROGRESS, t5: TASK_STATUS.TODO, t8: TASK_STATUS.TODO } },
}

/** Demo: öğretmenin sınıfları — her sınıfın öğrenci id listesi */
const DEMO_CLASSES = [
  { id: '10a', name: 'Biyoloji 10-A', studentIds: ['s1', 's2', 's3'] },
  { id: '10b', name: 'Biyoloji 10-B', studentIds: ['s4', 's5'] },
  { id: '11', name: 'Biyoloji 11. Sınıf', studentIds: ['s6', 's7'] },
]

function getCounts(progress, taskIds) {
  let done = 0
  let inProgress = 0
  let todo = 0
  taskIds.forEach((id) => {
    const status = progress[id] || TASK_STATUS.TODO
    if (status === TASK_STATUS.DONE) done++
    else if (status === TASK_STATUS.IN_PROGRESS) inProgress++
    else todo++
  })
  return { done, inProgress, todo }
}

export default function TaskAnalytics() {
  const [selectedClassId, setSelectedClassId] = useState(null)
  const branch = getStoredBranch()
  const branchLabel = BRANCH_LABELS[branch] || branch

  const selectedClass = useMemo(() => DEMO_CLASSES.find((c) => c.id === selectedClassId), [selectedClassId])
  const classStudentIds = useMemo(() => selectedClass?.studentIds ?? [], [selectedClass])

  const tasks = useMemo(() => getTasksByBranch(branch), [branch])
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks])

  const studentsWithCounts = useMemo(() => {
    return classStudentIds.map((sid) => {
      const data = DEMO_STUDENT_PROGRESS[sid]
      if (!data) return null
      const { name, progress } = data
      const { done, inProgress, todo } = getCounts(progress, taskIds)
      const total = tasks.length
      const percent = total ? Math.round((done / total) * 100) : 0
      return { id: sid, name, done, inProgress, todo, percent, progress }
    }).filter(Boolean)
  }, [classStudentIds, taskIds, tasks.length])

  const barChartData = useMemo(
    () => studentsWithCounts.map((s) => ({ name: s.name, tamamlanan: s.done, devam: s.inProgress, yapilacak: s.todo, yuzde: s.percent })),
    [studentsWithCounts]
  )

  const pieData = useMemo(() => {
    const done = studentsWithCounts.reduce((a, s) => a + s.done, 0)
    const progress = studentsWithCounts.reduce((a, s) => a + s.inProgress, 0)
    const todo = studentsWithCounts.reduce((a, s) => a + s.todo, 0)
    const data = [
      { name: 'Tamamlandı', value: done, color: '#14B8A6' },
      { name: 'Devam eden', value: progress, color: '#6366F1' },
      { name: 'Yapılacak', value: todo, color: '#94A3B8' },
    ].filter((d) => d.value > 0)
    return data.length ? data : [{ name: 'Veri yok', value: 1, color: '#e2e8f0' }]
  }, [studentsWithCounts])

  if (!tasks.length) {
    return (
      <>
        <header className="page-header animate-enter">
          <h1 className="page-title">Görev Takip Analizi</h1>
          <p className="page-subtitle">Bu branş için henüz görev bulunmuyor.</p>
        </header>
        <div className="card animate-on-scroll" data-animate>
          <div className="card-body">
            <p className="summary-text" style={{ color: 'var(--color-text-muted)' }}>
              Ders işlendikten sonra Gen AI agent öğrencilere görev atayacak; ilerlemeleri burada görüntülenecek.
            </p>
          </div>
        </div>
      </>
    )
  }

  // Sınıf listesi — henüz sınıf seçilmediyse
  if (!selectedClassId) {
    return (
      <>
        <header className="page-header task-analytics-header animate-enter">
          <h1 className="page-title">Görev Takip Analizi</h1>
          <p className="page-subtitle">
            <span className="task-analytics-branch">{branchLabel}</span> dersinize ait sınıflarınızı seçin; sınıfa girerek öğrenci görev ilerlemelerini detaylı görüntüleyin.
          </p>
        </header>
        <div className="task-analytics-class-list animate-on-scroll visible" data-animate>
          {DEMO_CLASSES.map((cls) => (
            <button
              key={cls.id}
              type="button"
              className="task-analytics-class-card"
              onClick={() => setSelectedClassId(cls.id)}
            >
              <span className="task-analytics-class-icon" aria-hidden>📁</span>
              <div className="task-analytics-class-content">
                <h2 className="task-analytics-class-name">{cls.name}</h2>
                <span className="task-analytics-class-meta">{cls.studentIds.length} öğrenci</span>
              </div>
              <span className="task-analytics-class-arrow" aria-hidden>→</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  // Sınıf içi — görev takibi detayı
  return (
    <>
      <div className="task-analytics-back-bar animate-enter">
        <button
          type="button"
          className="btn btn-secondary task-analytics-back-btn"
          onClick={() => setSelectedClassId(null)}
        >
          ← Sınıflara dön
        </button>
      </div>
      <header className="page-header task-analytics-header animate-enter">
        <h1 className="page-title">{selectedClass?.name}</h1>
        <p className="page-subtitle">
          Bu sınıftaki öğrencilerin <span className="task-analytics-branch">{branchLabel}</span> görev ilerleme durumu.
        </p>
      </header>

      <div className="task-analytics-stats animate-on-scroll visible" data-animate>
        <div className="task-analytics-stat-card task-analytics-stat-card--branch">
          <span className="task-analytics-stat-icon" aria-hidden>📚</span>
          <div className="task-analytics-stat-content">
            <span className="task-analytics-stat-value">{selectedClass?.name ?? branchLabel}</span>
            <span className="task-analytics-stat-label">Sınıf</span>
          </div>
        </div>
        <div className="task-analytics-stat-card task-analytics-stat-card--tasks">
          <span className="task-analytics-stat-icon" aria-hidden>📋</span>
          <div className="task-analytics-stat-content">
            <span className="task-analytics-stat-value">{tasks.length}</span>
            <span className="task-analytics-stat-label">Takip edilen görev</span>
          </div>
        </div>
        <div className="task-analytics-stat-card task-analytics-stat-card--students">
          <span className="task-analytics-stat-icon" aria-hidden>👥</span>
          <div className="task-analytics-stat-content">
            <span className="task-analytics-stat-value">{studentsWithCounts.length}</span>
            <span className="task-analytics-stat-label">Öğrenci</span>
          </div>
        </div>
      </div>

      {studentsWithCounts.length > 0 && (
      <>
      <div className="task-analytics-charts animate-on-scroll visible" data-animate>
        <div className="task-analytics-chart-card">
          <h3 className="task-analytics-chart-title">Öğrenci başına ilerleme</h3>
          <div className="task-analytics-chart-inner">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barChartData} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
                <YAxis type="category" dataKey="name" width={56} tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                <Tooltip formatter={(value) => [`${value}%`, 'Tamamlanma']} contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-soft)' }} />
                <Bar dataKey="yuzde" fill="url(#taskAnalyticsBarGradient)" radius={[0, 6, 6, 0]} name="Tamamlanma %" />
                <defs>
                  <linearGradient id="taskAnalyticsBarGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="task-analytics-chart-card">
          <h3 className="task-analytics-chart-title">Genel görev dağılımı</h3>
          <div className="task-analytics-chart-inner task-analytics-chart-pie">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="var(--color-surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Adet']} contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-soft)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card task-analytics-table-card animate-on-scroll visible" data-animate>
        <div className="card-header">
          <h2 className="card-title">Öğrenci ilerleme durumu</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="task-analytics-table-wrap">
            <table className="task-analytics-table">
              <thead>
                <tr>
                  <th>Öğrenci</th>
                  <th className="task-analytics-cell-center">Tamamlanan</th>
                  <th className="task-analytics-cell-center">Devam eden</th>
                  <th className="task-analytics-cell-center">Yapılacak</th>
                  <th>İlerleme</th>
                </tr>
              </thead>
              <tbody>
                {studentsWithCounts.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="task-analytics-student-name">{s.name}</span>
                    </td>
                    <td className="task-analytics-cell-center">
                      <span className="task-analytics-badge task-analytics-badge--done">{s.done}</span>
                    </td>
                    <td className="task-analytics-cell-center">
                      <span className="task-analytics-badge task-analytics-badge--progress">{s.inProgress}</span>
                    </td>
                    <td className="task-analytics-cell-center">
                      <span className="task-analytics-badge task-analytics-badge--todo">{s.todo}</span>
                    </td>
                    <td>
                      <div className="task-analytics-bar-wrap">
                        <div
                          className="task-analytics-bar"
                          style={{ width: `${s.percent}%` }}
                          role="progressbar"
                          aria-valuenow={s.percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                        <span className="task-analytics-bar-label">{s.percent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card task-analytics-detail-card animate-on-scroll visible mt-2" data-animate>
        <div className="card-header">
          <h2 className="card-title">Görev bazlı detay</h2>
        </div>
        <div className="card-body">
          <p className="summary-text" style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Hangi öğrencinin hangi görevde ne durumda olduğu aşağıda özetleniyor.
          </p>
          <div className="task-analytics-detail-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-analytics-detail-item">
                <h3 className="task-analytics-detail-title">{task.title}</h3>
                <ul className="task-analytics-detail-students">
                  {studentsWithCounts.map((s) => {
                    const status = s.progress[task.id] || TASK_STATUS.TODO
                    const statusLabel = status === TASK_STATUS.DONE ? 'Tamamladı' : status === TASK_STATUS.IN_PROGRESS ? 'Devam ediyor' : 'Yapılacak'
                    return (
                      <li key={s.id} className={`task-analytics-detail-student task-analytics-detail-student--${status}`}>
                        <span className="task-analytics-detail-student-name">{s.name}</span>
                        <span className="task-analytics-detail-student-status">{statusLabel}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
      )}

      {studentsWithCounts.length === 0 && (
        <div className="card animate-on-scroll" data-animate>
          <div className="card-body">
            <p className="summary-text" style={{ color: 'var(--color-text-muted)' }}>
              Bu sınıfta henüz öğrenci veya görev verisi yok.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
