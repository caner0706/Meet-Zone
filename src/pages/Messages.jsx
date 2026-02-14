import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getStoredUser, getStoredRole, getStoredBranch } from '../features/auth/authService'

/** Staj mesajları — staj grupları (Stajım > Mesajlaşma) */
const STAJ_ROOMS = [
  { id: 'staj-danisman', name: 'Staj danışmanı', course: 'Staj', branch: 'staj' },
  { id: 'staj-ekip', name: 'Staj ekibi', course: 'Staj', branch: 'staj' },
  { id: 'staj-insan-kaynaklari', name: 'İnsan Kaynakları', course: 'Staj', branch: 'staj' },
  { id: 'staj-mentor', name: 'Mentor grubu', course: 'Staj', branch: 'staj' },
]

const STAJ_INITIAL_MESSAGES = {
  'staj-danisman': [
    { id: 'sd1', author: 'Danışman', role: 'teacher', text: 'Merhaba, haftalık değerlendirme toplantısı Çarşamba 14:00\'te. Hazırlık formunu doldurmayı unutma.', time: 'Bugün 10:15' },
    { id: 'sd2', author: 'Caner Giden', role: 'student', text: 'Tamam hocam, formu gönderdim. Sunumu da hazırlıyorum.', time: '10:32' },
  ],
  'staj-ekip': [
    { id: 'se1', author: 'Takım Lideri', role: 'teacher', text: 'Sprint planlaması yarın 09:30. Backlog\'u inceleyin lütfen.', time: 'Dün 16:00' },
    { id: 'se2', author: 'Caner Giden', role: 'student', text: 'Backlog\'u inceledim. Veritabanı görevlerini ben alabilirim.', time: 'Dün 17:22' },
  ],
  'staj-insan-kaynaklari': [
    { id: 'sik1', author: 'İK', role: 'teacher', text: 'Staj değerlendirme formları bu hafta içinde doldurulacak. Link e-posta ile iletildi.', time: 'Bugün 09:00' },
  ],
  'staj-mentor': [
    { id: 'sm1', author: 'Mentor', role: 'teacher', text: 'Kod incelemesi için PR\'ını bekliyorum. Best practice notlarını da ekle.', time: 'Dün 14:45' },
    { id: 'sm2', author: 'Caner Giden', role: 'student', text: 'PR\'ı açtım. Notları da ekledim, bakar mısınız?', time: 'Dün 15:10' },
  ],
}

/** Derslerim mesajları — üniversite yazılım mühendisliği ders odaları */
const ALL_ROOMS = [
  { id: 'programlama1', name: 'Programlama I', course: 'Yazılım Mühendisliği', branch: 'yazilim' },
  { id: 'veri-yapilari', name: 'Veri Yapıları', course: 'Yazılım Mühendisliği', branch: 'yazilim' },
  { id: 'algoritmalar', name: 'Algoritmalar', course: 'Yazılım Mühendisliği', branch: 'yazilim' },
  { id: 'veritabani', name: 'Veritabanı Yönetim Sistemleri', course: 'Yazılım Mühendisliği', branch: 'yazilim' },
  { id: 'nesne-yonelimli', name: 'Nesne Yönelimli Programlama', course: 'Yazılım Mühendisliği', branch: 'yazilim' },
]

const INITIAL_MESSAGES = {
  programlama1: [
    { id: 'p1', author: 'Öğr. Gör. Dr. Ayşe K.', role: 'teacher', text: 'Merhaba, bugünkü canlı ders kodu: PRG1-4521. C dilinde pointer ve dinamik bellek konusu işlenecek.', time: 'Bugün 09:15' },
    { id: 'p2', author: 'Caner Giden', role: 'student', text: 'Hocam linked list ödevinde malloc sonrası free nereye yazılmalı, fonksiyon içinde mi yoksa main\'de mi?', time: '09:42' },
    { id: 'p3', author: 'Öğr. Gör. Dr. Ayşe K.', role: 'teacher', text: 'Her malloc için ilgili yapı kullanılmaz hale geldiğinde free çağrılmalı. Liste sonlandırılırken tüm düğümler dolaşılıp free edilmeli.', time: '09:55' },
  ],
  'veri-yapilari': [
    { id: 'vy1', author: 'Doç. Dr. Mehmet Y.', role: 'teacher', text: 'Bu hafta ağaç yapıları ve BST. Canlı ders kodu: VY-7812. Ders notları LMS\'te yüklü.', time: 'Dün 14:00' },
    { id: 'vy2', author: 'Elif K.', role: 'student', text: 'Hocam AVL ile red-black ağaç farkını kısaca özetleyebilir misiniz?', time: 'Dün 16:22' },
  ],
  algoritmalar: [
    { id: 'alg1', author: 'Prof. Dr. Zeynep D.', role: 'teacher', text: 'Dinamik programlama konusu. Canlı ders: ALG-3301. Örnekler: knapsack ve LCS.', time: 'Bugün 08:30' },
    { id: 'alg2', author: 'Caner Giden', role: 'student', text: 'Dijkstra algoritması negatif ağırlıklı kenarda neden çalışmıyor, kısaca açıklar mısınız?', time: 'Bugün 10:15' },
  ],
  veritabani: [
    { id: 'vt1', author: 'Öğr. Gör. Can T.', role: 'teacher', text: 'Merhaba. Bu hafta SQL JOIN ve alt sorgular. Lab için PostgreSQL kurulumu yapın. Canlı ders: VT-10A-42.', time: 'Bugün 11:00' },
    { id: 'vt2', author: 'Burak T.', role: 'student', text: 'Hocam normalizasyon ödevinde 3NF\'e kadar mı yoksa BCNF de isteniyor?', time: '11:25' },
    { id: 'vt3', author: 'Öğr. Gör. Can T.', role: 'teacher', text: '3NF\'e kadar yeterli. BCNF ek not olarak paylaşacağım.', time: '11:28' },
  ],
  'nesne-yonelimli': [
    { id: 'ny1', author: 'Dr. Deniz K.', role: 'teacher', text: 'Java ile kalıtım ve polimorfizm. Canlı ders kodu: NYP-11-15. Eclipse veya IntelliJ kullanabilirsiniz.', time: 'Dün 10:00' },
    { id: 'ny2', author: 'Ayşe K.', role: 'student', text: 'Interface ile abstract class arasındaki farkı tekrar özetleyebilir misiniz?', time: 'Dün 14:20' },
  ],
}

export default function Messages() {
  const { pathname } = useLocation()
  const isStajContext = pathname.includes('/staj/mesajlar')

  const displayName = getStoredUser() || 'Konuk'
  const role = getStoredRole()
  const isTeacher = role === 'teacher'
  const branch = getStoredBranch()

  const [userCreatedRooms, setUserCreatedRooms] = useState([])
  const [showNewRoomForm, setShowNewRoomForm] = useState(false)
  const [showJoinRoomForm, setShowJoinRoomForm] = useState(false)
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomCourse, setNewRoomCourse] = useState(isTeacher ? (branch || 'Yazılım Mühendisliği') : 'Yazılım Mühendisliği')

  const rooms = useMemo(() => {
    if (isStajContext) return [...STAJ_ROOMS, ...userCreatedRooms]
    const base = isTeacher ? ALL_ROOMS.filter((r) => r.branch === branch) : ALL_ROOMS
    const user = isTeacher
      ? userCreatedRooms.filter((r) => r.branch === branch)
      : userCreatedRooms
    return [...base, ...user]
  }, [isStajContext, isTeacher, branch, userCreatedRooms])

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || null)
  const [inputText, setInputText] = useState('')
  const [customMessages, setCustomMessages] = useState({})

  useEffect(() => {
    if (rooms.length && (!selectedRoomId || !rooms.some((r) => r.id === selectedRoomId))) {
      setSelectedRoomId(rooms[0].id)
    }
  }, [rooms, selectedRoomId])

  const handleCreateRoom = (e) => {
    e.preventDefault()
    const name = newRoomName.trim()
    const course = (newRoomCourse || (isStajContext ? 'Staj' : isTeacher ? (branch || 'Yazılım Mühendisliği') : 'Yazılım Mühendisliği')).trim()
    if (!name) return
    const id = `user-${Date.now()}`
    const room = { id, name, course, branch: isStajContext ? 'staj' : (isTeacher ? branch : 'yazilim') }
    setUserCreatedRooms((prev) => [...prev, room])
    setNewRoomName('')
    setNewRoomCourse(isStajContext ? 'Staj' : (isTeacher ? (branch || 'Yazılım Mühendisliği') : 'Yazılım Mühendisliği'))
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

  const getMessagesForRoom = (roomId) => {
    const initial = isStajContext ? (STAJ_INITIAL_MESSAGES[roomId] || []) : (INITIAL_MESSAGES[roomId] || [])
    const custom = customMessages[roomId] || []
    return [...initial, ...custom]
  }

  const messages = selectedRoomId ? getMessagesForRoom(selectedRoomId) : []
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

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
        <h1 className="page-title">Mesajlaşma</h1>
        <p className="page-subtitle">
          {isStajContext
            ? 'Staj danışmanı, ekip ve mentor grupları. Toplantı ve günlük iletişim burada.'
            : isTeacher
              ? 'Branşınıza ait sınıf grupları. Canlı ders kodu paylaşabilir, öğrenciler soru sorabilir.'
              : 'Yazılım mühendisliği ders odaları. Hocalar canlı ders kodu paylaşır, soru ve ödev iletişimi burada.'}
        </p>
      </header>

      <div className="messages-layout animate-on-scroll" data-animate>
        <aside className="messages-rooms">
          <div className="messages-rooms-header">
            <h2 className="messages-rooms-title">
              {isStajContext ? 'Staj grupları' : isTeacher ? 'Sınıflarınız' : 'Ders odaları'}
            </h2>
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
            {/* Hem oda oluştur hem odaya katıl */}
            {!showNewRoomForm && !showJoinRoomForm && (
              <div className="messages-new-room-buttons">
                <button
                  type="button"
                  className="messages-new-room-btn"
                  onClick={() => setShowNewRoomForm(true)}
                >
                  <span className="messages-new-room-icon">+</span>
                  Oda oluştur
                </button>
                <button
                  type="button"
                  className="messages-new-room-btn messages-join-room-btn"
                  onClick={() => setShowJoinRoomForm(true)}
                >
                  <span className="messages-new-room-icon">→</span>
                  Odaya katıl
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
                  placeholder={isStajContext ? 'Grup / proje adı' : 'Ders adı'}
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
                      setNewRoomCourse(isStajContext ? 'Staj' : (isTeacher ? (branch || 'Yazılım Mühendisliği') : 'Yazılım Mühendisliği'))
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
                          <span className="messages-item-badge">Hoca</span>
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
                  placeholder={isStajContext ? 'Mesajınızı yazın...' : isTeacher ? 'Duyuru veya canlı ders kodu yazın...' : 'Sorunuzu yazın...'}
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
              <p>Soldan bir oda seçin.</p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
