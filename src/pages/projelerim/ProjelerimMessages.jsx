import { useState, useMemo, useEffect } from 'react'
import { getStoredUser, getStoredRole } from '../../features/auth/authService'

/** Projelerim mesajları — sabit takımlar: TÜBİTAK, Turkcell, Teknofest + kullanıcı odaları */
const PROJE_ROOMS = [
  { id: 'tubitak', name: 'TÜBİTAK', course: 'Proje', branch: 'proje' },
  { id: 'turkcell', name: 'Turkcell', course: 'Proje', branch: 'proje' },
  { id: 'teknofest', name: 'Teknofest', course: 'Proje', branch: 'proje' },
]

const PROJE_INITIAL_MESSAGES = {
  tubitak: [
    { id: 't1', author: 'Proje Koordinatörü', role: 'teacher', text: 'TÜBİTAK 2209-A başvuru tarihleri açıklandı. Son başvuru 15 Mart. Proje özeti ve literatür taramasını bu hafta tamamlayalım.', time: 'Bugün 10:00' },
    { id: 't2', author: 'Caner Giden', role: 'student', text: 'Literatür taraması bitti. Özet taslağını yarın paylaşacağım.', time: '10:35' },
    { id: 't3', author: 'Proje Koordinatörü', role: 'teacher', text: 'Danışman onayı için 20 Şubat\'a kadar taslak raporu gönderin. Değerlendirme kriterleri e-posta ile iletildi.', time: 'Dün 14:20' },
  ],
  turkcell: [
    { id: 'tk1', author: 'Mentor', role: 'teacher', text: 'Turkcell Geleceği Yazanlar – bu hafta API entegrasyonu ve test aşaması. Canlı toplantı Çarşamba 11:00.', time: 'Bugün 09:15' },
    { id: 'tk2', author: 'Takım Lideri', role: 'teacher', text: 'Sunum slaytları Cuma\'ya hazır olsun. Jüri değerlendirmesi haftaya.', time: 'Dün 16:00' },
    { id: 'tk3', author: 'Caner Giden', role: 'student', text: 'API dokümantasyonunu güncelledim. Swagger linkini kanala bıraktım.', time: 'Dün 17:45' },
  ],
  teknofest: [
    { id: 'tf1', author: 'Takım Kaptanı', role: 'teacher', text: 'Teknofest roket kategorisi için tasarım raporu 1 Mart\'ta teslim. Mühendislik hesapları ve test planı dahil.', time: 'Bugün 08:30' },
    { id: 'tf2', author: 'Caner Giden', role: 'student', text: 'Simülasyon sonuçları hazır. Paylaşayım mı?', time: '09:00' },
    { id: 'tf3', author: 'Takım Kaptanı', role: 'teacher', text: 'Evet, bugün toplantıda görelim. 14:00\'te atölyede buluşalım.', time: '09:15' },
  ],
}

export default function ProjelerimMessages() {
  const displayName = getStoredUser() || 'Konuk'
  const role = getStoredRole() || 'student'
  const isTeacher = role === 'teacher'

  const [userCreatedRooms, setUserCreatedRooms] = useState([])
  const [showNewRoomForm, setShowNewRoomForm] = useState(false)
  const [showJoinRoomForm, setShowJoinRoomForm] = useState(false)
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomCourse, setNewRoomCourse] = useState('Proje')
  const [selectedRoomId, setSelectedRoomId] = useState(PROJE_ROOMS[0]?.id || null)
  const [inputText, setInputText] = useState('')
  const [customMessages, setCustomMessages] = useState({})

  const rooms = useMemo(
    () => [...PROJE_ROOMS, ...userCreatedRooms],
    [userCreatedRooms]
  )

  useEffect(() => {
    if (rooms.length && (!selectedRoomId || !rooms.some((r) => r.id === selectedRoomId))) {
      setSelectedRoomId(rooms[0].id)
    }
  }, [rooms, selectedRoomId])

  const getMessagesForRoom = (roomId) => {
    const initial = PROJE_INITIAL_MESSAGES[roomId] || []
    const custom = customMessages[roomId] || []
    return [...initial, ...custom]
  }

  const messages = selectedRoomId ? getMessagesForRoom(selectedRoomId) : []
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

  const handleCreateRoom = (e) => {
    e.preventDefault()
    const name = newRoomName.trim()
    const course = (newRoomCourse || 'Proje').trim()
    if (!name) return
    const id = `user-${Date.now()}`
    const room = { id, name, course, branch: 'proje' }
    setUserCreatedRooms((prev) => [...prev, room])
    setNewRoomName('')
    setNewRoomCourse('Proje')
    setShowNewRoomForm(false)
    setSelectedRoomId(id)
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    const code = joinRoomCode.trim().toUpperCase()
    if (!code) return
    setJoinRoomCode('')
    setShowJoinRoomForm(false)
  }

  const handleSend = (e) => {
    e.preventDefault()
    const text = inputText.trim()
    if (!text || !selectedRoomId) return
    const newMsg = {
      id: `new-${Date.now()}`,
      author: displayName,
      role: isTeacher ? 'teacher' : 'student',
      text,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    }
    setCustomMessages((prev) => ({
      ...prev,
      [selectedRoomId]: [...(prev[selectedRoomId] || []), newMsg],
    }))
    setInputText('')
  }

  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">Mesajlar</h1>
        <p className="page-subtitle">
          TÜBİTAK, Turkcell ve Teknofest takımlarıyla proje iletişiminiz. Toplantı duyuruları ve günlük koordinasyon burada.
        </p>
      </header>

      <div className="messages-layout animate-on-scroll" data-animate>
        <aside className="messages-rooms">
          <div className="messages-rooms-header">
            <h2 className="messages-rooms-title">Proje takımları</h2>
            <span className="messages-rooms-count">{rooms.length}</span>
          </div>
          <ul className="messages-room-list">
            {rooms.map((room) => (
              <li key={room.id}>
                <button
                  type="button"
                  className={`messages-room-btn ${selectedRoomId === room.id ? 'active' : ''}`}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <span className="messages-room-name">{room.name}</span>
                  <span className="messages-room-course">{room.course}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="messages-new-room">
            {!showNewRoomForm && !showJoinRoomForm && (
              <div className="messages-new-room-buttons">
                <button
                  type="button"
                  className="messages-new-room-btn"
                  onClick={() => setShowNewRoomForm(true)}
                >
                  <span className="messages-new-room-icon">+</span>
                  Oluştur
                </button>
                <button
                  type="button"
                  className="messages-new-room-btn messages-join-room-btn"
                  onClick={() => setShowJoinRoomForm(true)}
                >
                  <span className="messages-new-room-icon">→</span>
                  Katıl
                </button>
              </div>
            )}
            {showNewRoomForm && (
              <form className="messages-new-room-form" onSubmit={handleCreateRoom}>
                <input
                  type="text"
                  className="messages-new-room-input"
                  placeholder="Oda adı"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  autoFocus
                />
                <input
                  type="text"
                  className="messages-new-room-input"
                  placeholder="Takım / proje adı"
                  value={newRoomCourse}
                  onChange={(e) => setNewRoomCourse(e.target.value)}
                />
                <div className="messages-new-room-actions">
                  <button type="submit" className="btn btn-primary btn-sm" disabled={!newRoomName.trim()}>
                    Oluştur
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setShowNewRoomForm(false)
                      setNewRoomName('')
                      setNewRoomCourse('Proje')
                    }}
                  >
                    İptal
                  </button>
                </div>
              </form>
            )}
            {showJoinRoomForm && (
              <form className="messages-new-room-form" onSubmit={handleJoinRoom}>
                <input
                  type="text"
                  className="messages-new-room-input"
                  placeholder="Oda kodu"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                  maxLength={6}
                  autoFocus
                />
                <div className="messages-new-room-actions">
                  <button type="submit" className="btn btn-primary btn-sm" disabled={!joinRoomCode.trim()}>
                    Katıl
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setShowJoinRoomForm(false)
                      setJoinRoomCode('')
                    }}
                  >
                    İptal
                  </button>
                </div>
              </form>
            )}
          </div>
        </aside>

        <section className="messages-chat">
          {selectedRoom ? (
            <>
              <div className="messages-chat-header">
                <h2 className="messages-chat-title">{selectedRoom.name}</h2>
                <span className="messages-chat-meta">{selectedRoom.course}</span>
              </div>
              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="messages-empty">
                    <p>Henüz mesaj yok. İlk mesajı yazın!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`messages-item messages-item--${msg.role}`}
                    >
                      <div className="messages-item-header">
                        <span className="messages-item-author">{msg.author}</span>
                        {msg.role === 'teacher' && (
                          <span className="messages-item-badge">Takım</span>
                        )}
                        <span className="messages-item-time">{msg.time}</span>
                      </div>
                      <p className="messages-item-text">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
              <form className="messages-form" onSubmit={handleSend}>
                <input
                  type="text"
                  className="messages-input"
                  placeholder="Mesajınızı yazın..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  maxLength={500}
                />
                <button type="submit" className="btn btn-primary messages-send-btn" disabled={!inputText.trim()}>
                  Gönder
                </button>
              </form>
            </>
          ) : (
            <div className="messages-empty">
              <p>Soldan bir takım seçin.</p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
