/** Projelerim takımları — TÜBİTAK, Turkcell, Teknofest (logolar: Logolar/ klasöründen) */
const TEAMS = [
  {
    id: 'tubitak',
    name: 'TÜBİTAK',
    description: '2209-A Üniversite Öğrencileri Araştırma Projeleri Destek Programı. Proje özeti, literatür taraması ve danışman onayı süreçleri.',
    logo: '/logos/tubitak.png',
    accent: 'tubitak',
  },
  {
    id: 'turkcell',
    name: 'Turkcell',
    description: 'Geleceği Yazanlar ve inovasyon projeleri. API entegrasyonu, sunum hazırlığı ve jüri değerlendirmeleri.',
    logo: '/logos/turkcell.png',
    accent: 'turkcell',
  },
  {
    id: 'teknofest',
    name: 'Teknofest',
    description: 'Havacılık, uzay ve teknoloji yarışmaları. Tasarım raporu, simülasyon ve atölye çalışmaları.',
    logo: '/logos/teknofest.png',
    accent: 'teknofest',
  },
]

export default function Takimlar() {
  return (
    <>
      <header className="page-header animate-enter">
        <h1 className="page-title">Takımlarım</h1>
        <p className="page-subtitle">
          Proje takımlarınız: TÜBİTAK, Turkcell ve Teknofest. Her takımla mesajlaşma, toplantı ve yol haritasına ilgili sayfadan ulaşabilirsiniz.
        </p>
      </header>

      <div className="takimlar-grid animate-on-scroll" data-animate>
        {TEAMS.map((team, i) => (
          <article key={team.id} className={`takimlar-card takimlar-card--${team.accent}`}>
            <div className="takimlar-card-logo-wrap">
              <img
                src={team.logo}
                alt=""
                className="takimlar-card-logo"
                width={80}
                height={80}
              />
            </div>
            <div className="takimlar-card-body">
              <h2 className="takimlar-card-title">{team.name}</h2>
              <p className="takimlar-card-desc">{team.description}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
