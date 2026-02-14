import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser, getStoredRole, getStoredEmail, updatePassword, logout } from '../features/auth/authService'
import { ROUTES } from '../config/routes'

export default function Account() {
  const navigate = useNavigate()
  const displayName = getStoredUser()
  const role = getStoredRole()
  const email = getStoredEmail()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const roleLabel = role === 'teacher' ? 'Öğretmen' : 'Öğrenci'

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPasswordMessage({ type: '', text: '' })
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' })
      return
    }
    setLoading(true)
    setTimeout(() => {
      const result = updatePassword(currentPassword, newPassword)
      setLoading(false)
      if (result.success) {
        setPasswordMessage({ type: 'success', text: 'Şifreniz güncellendi.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMessage({ type: 'error', text: result.error || 'Bir hata oluştu.' })
      }
    }, 400)
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">Hesabım</h1>
        <p className="page-subtitle">
          Hesap bilgileriniz ve güvenlik.
        </p>
      </header>

      <div className="account-page animate-on-scroll" data-animate>
        <section className="card account-card account-card--profile">
          <div className="card-body account-profile">
            <div className="account-avatar-wrap">
              <div className="account-avatar">
                <span className="account-avatar-initial">
                  {(displayName || 'K').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="account-profile-info">
              <h2 className="account-name">{displayName || 'Konuk'}</h2>
              <span className="account-badge account-badge--role">{roleLabel}</span>
            </div>
          </div>
        </section>

        <section className="card account-card">
          <div className="card-header">
            <h2 className="card-title">Hesap bilgileri</h2>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <dl className="account-dl">
              <div className="account-dl-row">
                <dt className="account-dl-dt">Ad Soyad</dt>
                <dd className="account-dl-dd">{displayName || '—'}</dd>
              </div>
              <div className="account-dl-row">
                <dt className="account-dl-dt">E-posta</dt>
                <dd className="account-dl-dd">{email || '—'}</dd>
              </div>
              <div className="account-dl-row">
                <dt className="account-dl-dt">Hesap türü</dt>
                <dd className="account-dl-dd">{roleLabel}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="card account-card">
          <div className="card-header">
            <h2 className="card-title">Şifre değiştir</h2>
          </div>
          <div className="card-body">
            <form className="account-form" onSubmit={handlePasswordSubmit}>
              <div className="account-form-group">
                <label className="account-form-label" htmlFor="current-password">Mevcut şifre</label>
                <input
                  type="password"
                  id="current-password"
                  className="account-form-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mevcut şifreniz"
                  autoComplete="current-password"
                />
              </div>
              <div className="account-form-group">
                <label className="account-form-label" htmlFor="new-password">Yeni şifre</label>
                <input
                  type="password"
                  id="new-password"
                  className="account-form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  autoComplete="new-password"
                />
              </div>
              <div className="account-form-group">
                <label className="account-form-label" htmlFor="confirm-password">Yeni şifre (tekrar)</label>
                <input
                  type="password"
                  id="confirm-password"
                  className="account-form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Yeni şifreyi tekrar girin"
                  autoComplete="new-password"
                />
              </div>
              {passwordMessage.text && (
                <p className={`account-form-message account-form-message--${passwordMessage.type}`}>
                  {passwordMessage.text}
                </p>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Güncelleniyor…' : 'Şifreyi güncelle'}
              </button>
            </form>
          </div>
        </section>

        <section className="card account-card account-card--logout">
          <div className="card-body account-logout-wrap">
            <p className="account-logout-text">Hesabınızdan çıkış yapmak için aşağıdaki butonu kullanın.</p>
            <button type="button" className="btn btn-secondary account-logout-btn" onClick={handleLogout}>
              Çıkış yap
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
