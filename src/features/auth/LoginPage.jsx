import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { findUser, login } from './authService'
import { ROUTES } from '../../config/routes'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.className = 'login-page'
    document.title = 'Meet Zone — Giriş Yap'
    return () => { document.body.className = '' }
  }, [])

  const doLogin = (displayName, role, email, branch) => {
    setError('')
    setLoading(true)
    setTimeout(() => {
      try {
        login(displayName, role || 'student', email, branch || '')
      } catch (_) {}
      setLoading(false)
      navigate(ROUTES.WELCOME_INTRO)
    }, 600)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const trimEmail = email.trim()
    if (!trimEmail || !password) {
      setError('E-posta ve şifre gerekli.')
      return
    }
    const user = findUser(trimEmail, password)
    if (!user) {
      setError('Geçersiz e-posta veya şifre.')
      return
    }
    doLogin(user.displayName || trimEmail.split('@')[0], user.role, trimEmail, user.branch)
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-shape shape-1" />
        <div className="login-bg-shape shape-2" />
        <div className="login-bg-shape shape-3" />
      </div>

      <div className="login-wrap">
        <header className="login-header animate-enter">
          <Link to={ROUTES.LOGIN} className="login-logo">
            <span className="login-logo-badge">
              <span className="login-logo-badge-inner">
                <img src="/Logo.png" alt="Meet Zone" className="logo" />
              </span>
            </span>
            <span className="login-logo-text">Meet Zone</span>
          </Link>
          <p className="login-tagline">Toplantı analizi ve karar destek platformu</p>
        </header>

        <main className="login-main animate-enter animate-enter-delay-1">
          <div className="login-card">
            <h1 className="login-title">Giriş Yap</h1>
            <p className="login-subtitle">E-posta ve şifrenizle giriş yapın.</p>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email">E-posta</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="ornek@sirket.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Şifre</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                />
              </div>
              <div className="form-group form-group-row">
                <label className="checkbox-label">
                  <input type="checkbox" name="remember" defaultChecked />
                  <span>Beni hatırla</span>
                </label>
              </div>
              <button type="submit" className={`btn btn-primary btn-block btn-login${loading ? ' loading' : ''}`}>
                <span className="btn-text">{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</span>
                <span className="btn-loader" aria-hidden="true" />
              </button>
            </form>
          </div>
        </main>

        <footer className="login-page-footer animate-enter animate-enter-delay-2">
          <p>© 2026 Meet Zone. Toplantı verimliliği ve karar takibi.</p>
        </footer>
      </div>
    </div>
  )
}
