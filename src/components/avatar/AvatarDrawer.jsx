import { useState, useRef, useEffect } from 'react'
import { useAvatarPanel } from '../../context/AvatarContext'

const SUGGESTIONS = [
  'Bu toplantının en büyük sorunu neydi?',
  'Bir sonraki toplantı için ne önerirsin?',
  'Hangi kararlar risk taşıyor?',
]

const DEMO_ANSWERS = {
  [SUGGESTIONS[0]]: 'En büyük sorun konuşma dengesizliğiydi. Bir katılımcı toplantının büyük kısmını domine etti; alternatif görüşler sınırlı kaldı.',
  [SUGGESTIONS[1]]: 'Zaman blokları belirleyin; her aksiyon için tek sorumlu ve son tarih atayın. Konuşma süresini dengelemek için round-robin uygulayın.',
  [SUGGESTIONS[2]]: 'Tech debt sprint sorumlusu henüz atanmadı; sprint özeti maili için de sorumlu belirsiz. Bu iki karar takip riski taşıyor.',
}

export default function AvatarDrawer() {
  const { isOpen, closeAvatarPanel } = useAvatarPanel()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, role: 'avatar', text: 'Merhaba! Toplantı özeti ve öneriler hakkında sorularınızı yazabilir veya sesli sorabilirsiniz.', time: 'Şimdi' },
  ])
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { if (isOpen) scrollToBottom() }, [isOpen, messages])

  const sendMessage = (text) => {
    const t = (text || message).trim()
    if (!t) return
    const userMsg = { id: Date.now(), role: 'user', text: t, time: 'Şimdi' }
    setMessages((prev) => [...prev, userMsg])
    setMessage('')
    const reply = DEMO_ANSWERS[t] || 'Verilerinize göre yanıt üretiliyor. Demo modunda örnek yanıtlar gösteriliyor.'
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'avatar', text: reply, time: 'Şimdi' }])
    }, 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <div
        className={`avatar-drawer-overlay ${isOpen ? 'avatar-drawer-overlay--open' : ''}`}
        onClick={closeAvatarPanel}
        aria-hidden
      />
      <aside className={`avatar-drawer ${isOpen ? 'avatar-drawer--open' : ''}`} role="dialog" aria-label="AI Avatar sohbet">
        <header className="avatar-drawer-header">
          <div className="avatar-drawer-header-left">
            <div className="avatar-drawer-avatar-thumb">
              <img src="/Avatar.png" alt="" />
            </div>
            <div>
              <h2 className="avatar-drawer-title">AI Avatar</h2>
              <span className="avatar-drawer-status">
                <span className="avatar-drawer-status-dot" />
                Sizi dinliyor
              </span>
            </div>
          </div>
          <button
            type="button"
            className="avatar-drawer-close"
            onClick={closeAvatarPanel}
            aria-label="Paneli kapat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="avatar-drawer-voice">
          <div className="avatar-drawer-voice-visual">
            <img src="/Avatar.png" alt="Avatar" className="avatar-drawer-voice-img" />
            <div className="avatar-drawer-voice-ring" />
          </div>
          <button
            type="button"
            className={`avatar-drawer-mic-btn ${isListening ? 'avatar-drawer-mic-btn--active' : ''}`}
            onClick={() => setIsListening(!isListening)}
            aria-label={isListening ? 'Mikrofonu kapat' : 'Sesli sor'}
          >
            {isListening ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
          <p className="avatar-drawer-voice-hint">
            {isListening ? 'Konuşun…' : 'Sesli soru sormak için mikrofona tıklayın'}
          </p>
        </div>

        <div className="avatar-drawer-divider">
          <span>Mesajlar</span>
        </div>

        <div className="avatar-drawer-messages">
          {messages.map((m) => (
            <div key={m.id} className={`avatar-drawer-msg avatar-drawer-msg--${m.role}`}>
              {m.role === 'avatar' && (
                <div className="avatar-drawer-msg-avatar">
                  <img src="/Avatar.png" alt="" />
                </div>
              )}
              <div className="avatar-drawer-msg-bubble">
                <p className="avatar-drawer-msg-text">{m.text}</p>
                <span className="avatar-drawer-msg-time">{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="avatar-drawer-suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="avatar-drawer-suggestion-pill" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        <footer className="avatar-drawer-footer">
          <input
            type="text"
            className="avatar-drawer-input"
            placeholder="Mesaj yazın..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className="avatar-drawer-send" onClick={() => sendMessage()} aria-label="Gönder">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </footer>
      </aside>
    </>
  )
}
