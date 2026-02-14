export default function Settings() {
  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">Ayarlar</h1>
        <p className="page-subtitle">
          Bildirimler ve uygulama tercihleriniz.
        </p>
      </header>

      <section className="card mb-2 animate-on-scroll" data-animate>
        <div className="card-header">
          <h2 className="card-title">Bildirimler</h2>
        </div>
        <div className="card-body">
          <p className="summary-text settings-desc">
            Ders ve toplantılarla ilgili hatırlatmaları buradan yönetin.
          </p>
          <div className="settings-list">
            <label className="settings-toggle">
              <input type="checkbox" defaultChecked />
              <span className="settings-toggle-text">Ders hatırlatmaları</span>
              <span className="settings-toggle-hint">Yaklaşan dersler için bildirim alın</span>
            </label>
            <label className="settings-toggle">
              <input type="checkbox" defaultChecked />
              <span className="settings-toggle-text">Toplantı bildirimleri</span>
              <span className="settings-toggle-hint">Canlı ders başlamadan önce hatırlatma</span>
            </label>
            <label className="settings-toggle">
              <input type="checkbox" defaultChecked />
              <span className="settings-toggle-text">AI Avatar bildirimleri</span>
              <span className="settings-toggle-hint">Özet ve öneriler için bildirim</span>
            </label>
          </div>
        </div>
      </section>

      <section className="card mb-2 animate-on-scroll" data-animate>
        <div className="card-header">
          <h2 className="card-title">Uygulama</h2>
        </div>
        <div className="card-body">
          <div className="settings-list">
            <div className="settings-row">
              <span className="settings-toggle-text">Dil</span>
              <select className="sidebar-select settings-select" aria-label="Dil seçin">
                <option>Türkçe</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
