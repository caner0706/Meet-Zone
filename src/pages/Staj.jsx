import { Link } from 'react-router-dom'
import { ROUTES } from '../config/routes'

/** Stajım — giriş sayfası; yan menüde Canlı toplantı, Raporlar, Analizler, Yol haritası görünür */
export default function Staj() {
  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">Stajım</h1>
        <p className="page-subtitle">
          Staj sürecinizde canlı toplantılar, raporlar, analizler ve yol haritasına soldan erişebilirsiniz.
        </p>
      </header>
      <div className="card">
        <div className="card-body">
          <p className="summary-text" style={{ marginBottom: '1rem' }}>
            Soldaki menüden <strong>Canlı toplantı</strong>, <strong>Toplantı raporları</strong>, <strong>Toplantı analizleri</strong> veya <strong>Yol haritası</strong> sayfalarına geçebilirsiniz.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link to={ROUTES.STAJ_LIVE} className="btn btn-primary">Canlı toplantı</Link>
            <Link to={ROUTES.STAJ_REPORT} className="btn btn-secondary">Toplantı raporları</Link>
            <Link to={ROUTES.STAJ_ANALYSIS} className="btn btn-secondary">Toplantı analizleri</Link>
            <Link to={ROUTES.STAJ_ROADMAP} className="btn btn-secondary">Yol haritası</Link>
          </div>
        </div>
      </div>
    </>
  )
}
