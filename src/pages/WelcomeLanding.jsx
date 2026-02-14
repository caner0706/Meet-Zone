import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import { getStoredUser, getStoredRole } from '../features/auth/authService'

export default function WelcomeLanding() {
  const navigate = useNavigate()
  const displayName = getStoredUser()
  const role = getStoredRole()
  const isTeacher = role === 'teacher'
  const [roomCode, setRoomCode] = useState('')
  const [userName, setUserName] = useState(displayName || '')

  const handleStartMeeting = () => {
    if (!userName.trim()) {
      alert('Lütfen adınızı girin.')
      return
    }
    // Yeni toplantı başlat - Live sayfasına git
    navigate(ROUTES.LIVE, { state: { userName: userName.trim(), newMeeting: true } })
  }

  const handleJoinMeeting = () => {
    if (!roomCode.trim()) {
      alert('Lütfen oda kodunu girin.')
      return
    }
    if (!userName.trim()) {
      alert('Lütfen adınızı girin.')
      return
    }
    // Toplantıya katıl - Live sayfasına git
    navigate(ROUTES.LIVE, { state: { roomCode: roomCode.trim(), userName: userName.trim() } })
  }

  const handleExplore = () => {
    // Dashboard'u keşfet
    navigate(ROUTES.OZET)
  }

  return (
    <div className="welcome-landing">
      <div className="welcome-bg">
        <div className="welcome-bg-shape shape-1" />
        <div className="welcome-bg-shape shape-2" />
        <div className="welcome-bg-shape shape-3" />
      </div>

      <div className="welcome-container">
        {/* Logo Section */}
        <section className="welcome-logo-section">
          <img src="/Logo.png" alt="Meet Zone" className="welcome-logo" />
          <h1 className="welcome-app-name">Meet Zone</h1>
          <p className="welcome-tagline">Toplantı analizi ve karar destek platformu</p>
        </section>

        {/* Greeting */}
        <section className="welcome-greeting">
          <h2 className="welcome-title">Hoş geldin, <span>{displayName}</span></h2>
          <p className="welcome-subtitle">Toplantı başlat, katıl veya geçmiş dersleri keşfet</p>
        </section>

        {/* Meeting Actions */}
        <section className="welcome-actions">
          <div className="welcome-actions-form">
            <div className="form-group">
              <label htmlFor="userName">Adın</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Adınız"
                className="welcome-input"
              />
            </div>

            <div className="meeting-actions-row">
              <button
                type="button"
                onClick={handleStartMeeting}
                className="btn btn-primary btn-lg welcome-btn"
              >
                <span className="btn-icon">▶</span>
                <span>Toplantı Başlat</span>
              </button>
            </div>

            <div className="divider"></div>

            <div className="form-group">
              <label htmlFor="roomCode">Oda Kodunu Gir</label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Oda kodu (örn: ABC123)"
                className="welcome-input"
                maxLength="20"
              />
            </div>

            <div className="meeting-actions-row">
              <button
                type="button"
                onClick={handleJoinMeeting}
                className="btn btn-secondary btn-lg welcome-btn"
              >
                <span className="btn-icon">→</span>
                <span>Toplantıya Katıl</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="welcome-quick-links">
          <button
            type="button"
            onClick={handleExplore}
            className="welcome-link-btn"
          >
            Dashboard'u keşfet
          </button>
        </section>

        {/* Footer Info */}
        <footer className="welcome-footer">
          <p>
            {isTeacher
              ? 'Öğretmen panelinde ders raporları, analizler ve görev takibine erişebilirsiniz.'
              : 'Öğrenci panelinde derslerim, stajlarım ve projelerime ulaşabilirsiniz.'}
          </p>
        </footer>
      </div>
    </div>
  )
}
