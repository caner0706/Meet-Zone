import { useState, useMemo } from 'react'

/** Demo: öğretmenin canlı dersleri (rapor listesi) */
const DEMO_REPORT_LESSONS = [
  { id: 'r1', title: 'Hücre zarı ve madde geçişi', date: '2025-02-08', durationMin: 45, className: 'Biyoloji 10-A' },
  { id: 'r2', title: 'Osmoz ve turgor', date: '2025-02-05', durationMin: 40, className: 'Biyoloji 10-A' },
  { id: 'r3', title: 'Hücre zarı – tekrar', date: '2025-02-07', durationMin: 38, className: 'Biyoloji 10-B' },
  { id: 'r4', title: 'İleri hücre biyolojisi', date: '2025-02-06', durationMin: 50, className: 'Biyoloji 11. Sınıf' },
]

/** Demo: ders raporu içeriği — konu, detaylı özet, bakılan konular, vurgular, transkript, kaynakça */
const DEMO_REPORT_CONTENT = {
  r1: {
    topic: 'Hücre zarı yapısı, akıcı mozaik modeli ve madde geçişi (pasif/aktif taşıma, osmoz).',
    summaryDetailed: 'Derste hücre zarının yapısı ve işlevi, akıcı mozaik modeli çerçevesinde anlatıldı. Fosfolipit çift katman, zar proteinleri ve kolesterolün rolleri vurgulandı. Madde geçişlerinde pasif taşıma (difüzyon, osmoz, kolaylaştırılmış difüzyon) ile aktif taşıma ayrımı yapıldı; osmozda suyun hipotonik ortama doğru hareketi ve bitki hücresinde turgor/plazmoliz olayları örneklerle açıklandı. Öğrenci soruları üzerinden protein hareketi, turgor–hayvan hücresi farkı ve ATP kullanımı pekiştirildi. Ders, pasif/aktif taşıma özeti ve bir sonraki dersin kapsamıyla kapatıldı.',
    sectionsLookedAt: [
      'Akıcı mozaik modeli – fosfolipit çift katman, proteinler, kolesterol',
      'Pasif taşıma: difüzyon, osmoz, kolaylaştırılmış difüzyon',
      'Aktif taşıma ve pompalar',
      'Hipotonik, izotonik, hipertonik ortamlar',
    ],
    emphasized: [
      'Sınavda akıcı mozaik modelinin üç özelliği sık çıkar.',
      'Osmozda suyun hipotonik tarafa geçişi vurgulandı.',
      'Turgor ve plazmoliz örnekleri (bitki hücresi) üzerinde duruldu.',
    ],
    keyTerms: ['Akıcı mozaik modeli', 'Osmoz', 'Difüzyon', 'Turgor', 'Plazmoliz', 'Hipotonik', 'Hipertonik'],
    transcript: [
      { time: '00:00', speaker: 'Öğretmen', text: 'Günaydın. Bugün hücre zarı ve madde geçişlerine geçiyoruz. Defterlerinizi açın.' },
      { time: '00:45', speaker: 'Öğretmen', text: 'Hücre zarı için akıcı mozaik modelini biliyorsunuz. Fosfolipit çift katman, gömülü proteinler ve kolesterol. Bu üçlüyü mutlaka yazın.' },
      { time: '02:10', speaker: 'Elif K.', text: 'Hocam proteinler hareket edebiliyor mu zar içinde?' },
      { time: '02:25', speaker: 'Öğretmen', text: 'Evet, zar akıcı olduğu için proteinler yer değiştirebilir. Bu yüzden “akıcı mozaik” deniyor.' },
      { time: '05:30', speaker: 'Öğretmen', text: 'Osmozda su her zaman hipotonik ortama, yani çözünenin az olduğu tarafa geçer. Bunu formül gibi ezberleyin.' },
      { time: '08:00', speaker: 'Mehmet Y.', text: 'Bitkide turgor ile hayvan hücresindeki farkı sorabilir miyim?' },
      { time: '08:20', speaker: 'Öğretmen', text: 'Bitki hücresinde hücre duvarı var; su alınca patlamaz, turgor oluşur. Hayvan hücresinde duvar yok, fazla su alırsa patlayabilir.' },
      { time: '12:00', speaker: 'Öğretmen', text: 'Plazmoliz dediğimizde bitki hücresinin su kaybedip büzülmesini anlıyoruz. Hipertonik ortama konunca olur.' },
      { time: '18:30', speaker: 'Ayşe K.', text: 'Aktif taşımada ATP neden gerekli?' },
      { time: '18:45', speaker: 'Öğretmen', text: 'Çünkü madde yoğunluk farkının aksine, yani yüksek yoğunluğa doğru taşınıyor. Enerji harcanması şart.' },
      { time: '35:00', speaker: 'Öğretmen', text: 'Özetleyelim: pasif taşıma enerji harcamaz, aktif taşıma harcar. Osmoz suyun difüzyonudur.' },
      { time: '42:00', speaker: 'Öğretmen', text: 'Bir sonraki dersimizde örnek sorular çözeceğiz. Bugünkü notları tekrar edin.' },
    ],
    participants: ['Öğretmen', 'Elif K.', 'Mehmet Y.', 'Ayşe K.'],
    references: [
      { title: 'Campbell Biyoloji', author: 'Reece vd.', year: '11. baskı', note: 'Bölüm 7 – Hücre Zarı' },
      { title: 'Khan Academy – Structure of the cell membrane', url: 'https://www.khanacademy.org/science/biology/membranes-and-transport' },
      { title: 'Türkiye MEB Biyoloji Dersi Öğretim Programı', author: 'MEB', year: '2018', note: '10. sınıf kazanımlar' },
    ],
  },
  r2: {
    topic: 'Osmoz, turgor ve plazmoliz; günlük hayattan örnekler.',
    summaryDetailed: 'Osmoz ve turgor–plazmoliz konusu tekrar edildi; günlük hayattan örneklerle somutlaştırıldı. Salatalığa tuz döküldüğünde su kaybı (hipertonik dış ortam) ve havucun suda sertleşmesi (hipotonik ortam, turgor) anlatıldı. Öğrenci katılımıyla bu örnekler pekiştirildi. Ödev olarak günlük hayattan iki osmoz örneği yazılması istendi.',
    sectionsLookedAt: [
      'Osmoz tekrarı',
      'Turgor ve plazmoliz (bitki)',
      'Günlük örnekler: salatalık tuzlama, havuç su kaybı',
    ],
    emphasized: [
      'Günlük hayattan en az iki örnek verilmesi istendi.',
      'Hipotonik/hipertonik terimlerinin doğru kullanımı vurgulandı.',
    ],
    keyTerms: ['Osmoz', 'Turgor', 'Plazmoliz', 'Hipotonik', 'Hipertonik'],
    transcript: [
      { time: '00:00', speaker: 'Öğretmen', text: 'Geçen hafta osmozu işlemiştik. Bugün turgor, plazmoliz ve günlük örnekler.' },
      { time: '03:00', speaker: 'Öğretmen', text: 'Salatalığa tuz döktüğünüzde dışarı su verir; çünkü dış ortam hipertonik olur.' },
      { time: '07:00', speaker: 'Elif K.', text: 'Havucu suda bekletince sertleşmesi de aynı mantık mı?' },
      { time: '07:15', speaker: 'Öğretmen', text: 'Evet. Suyun içi hipotonik, hücre su alır, turgor artar.' },
      { time: '25:00', speaker: 'Öğretmen', text: 'Ödev: Günlük hayattan iki osmoz örneği yazıp getirin.' },
    ],
    participants: ['Öğretmen', 'Elif K.', 'Mehmet Y.', 'Ayşe K.'],
    references: [
      { title: 'Campbell Biyoloji', author: 'Reece vd.', year: '11. baskı', note: 'Osmoz ve turgor' },
      { title: 'Bozeman Science – Transport across cell membranes', url: 'https://www.youtube.com/bozeman' },
    ],
  },
  r3: {
    topic: 'Hücre zarı ve madde geçişi tekrarı; soru çözümü.',
    summaryDetailed: '10-B sınıfıyla hücre zarı ve madde geçişi konusu tekrar edildi. Akıcı mozaik modeli, osmoz ve turgor kısa soru–cevap formatında işlendi. Öğrenci sorusu üzerine pasif ve aktif taşımada gradient yönü (aşağı/yukarı) netleştirildi. Ders, gradient–taşıma ilişkisi özetiyle tamamlandı.',
    sectionsLookedAt: ['Akıcı mozaik modeli tekrar', 'Osmoz ve turgor tekrar', 'Kısa soru çözümü'],
    emphasized: ['Sınav formatına uygun kısa cevaplar üzerinde duruldu.'],
    keyTerms: ['Akıcı mozaik', 'Osmoz', 'Turgor'],
    transcript: [
      { time: '00:00', speaker: 'Öğretmen', text: 'Bu ders 10-B ile hücre zarı tekrarı yapıyoruz. Sorularınızı not edin.' },
      { time: '10:00', speaker: 'Can D.', text: 'Pasif ve aktif taşımada gradient yönü farklı mı?' },
      { time: '10:20', speaker: 'Öğretmen', text: 'Pasifte madde gradient aşağı, yani yoğunluk fazla olandan aza. Aktifte gradient yukarı, enerjiyle.' },
      { time: '30:00', speaker: 'Öğretmen', text: 'Özet: gradient aşağı = pasif, gradient yukarı = aktif.' },
    ],
    participants: ['Öğretmen', 'Can D.', 'Zeynep A.'],
    references: [
      { title: 'MEB Biyoloji 10. Sınıf Ders Kitabı', author: 'MEB', year: '2024', note: 'Ünite 2' },
    ],
  },
  r4: {
    topic: 'İleri hücre biyolojisi: endositoz, ekzositoz, reseptörler.',
    summaryDetailed: '11. sınıf düzeyinde endositoz ve ekzositoz işlendi. Fagositoz (katı parça alımı, örn. akyuvar–bakteri) ile pinositoz (sıvı damlacığı alımı) ayrımı yapıldı. Ekzositozda vezikül–plazma zarı kaynaşması ve içeriğin dışarı bırakılması anlatıldı. Reseptör aracılı endositozda hedef molekül–reseptör ilişkisi kısaca değinildi; bir sonraki derste örnek verileceği belirtildi.',
    sectionsLookedAt: [
      'Endositoz (fagositoz, pinositoz)',
      'Ekzositoz',
      'Reseptör aracılı endositoz',
    ],
    emphasized: [
      'Fagositoz katı, pinositoz sıvı alımı olarak netleştirildi.',
      'Hormon–reseptör ilişkisi kısaca değinildi.',
    ],
    keyTerms: ['Endositoz', 'Ekzositoz', 'Fagositoz', 'Pinositoz', 'Reseptör'],
    transcript: [
      { time: '00:00', speaker: 'Öğretmen', text: '11. sınıfta endositoz ve ekzositozu işliyoruz. Büyük moleküllerin alınması ve atılması.' },
      { time: '05:00', speaker: 'Öğretmen', text: 'Fagositoz katı parçanın alınması – örneğin akyuvarın bakteri yutması. Pinositoz sıvı damlacığının alınması.' },
      { time: '15:00', speaker: 'Burak T.', text: 'Ekzositozda vezikül zarıyla birleşiyor, içerik dışarı atılıyor, değil mi?' },
      { time: '15:20', speaker: 'Öğretmen', text: 'Aynen. Vezikül plazma zarına kaynaşır, içerik hücre dışına bırakılır.' },
      { time: '40:00', speaker: 'Öğretmen', text: 'Reseptör aracılı endositozda belirli moleküller reseptöre bağlanıp içeri alınır. Bir sonraki derste örnek vereceğim.' },
    ],
    participants: ['Öğretmen', 'Burak T.', 'Deniz K.'],
    references: [
      { title: 'Campbell Biyoloji', author: 'Reece vd.', year: '11. baskı', note: 'Endositoz ve ekzositoz' },
      { title: 'Lodish et al., Molecular Cell Biology', author: 'Lodish vd.', year: '9. baskı', note: 'Membrane transport' },
    ],
  },
}

function formatReportDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Report() {
  const [selectedId, setSelectedId] = useState(null)

  const selectedLesson = useMemo(
    () => DEMO_REPORT_LESSONS.find((l) => l.id === selectedId),
    [selectedId]
  )
  const reportContent = useMemo(
    () => (selectedId ? DEMO_REPORT_CONTENT[selectedId] : null),
    [selectedId]
  )

  // ——— Ders listesi ———
  if (!selectedId) {
    return (
      <>
        <header className="page-header report-page-header animate-enter">
          <h1 className="page-title">Canlı Ders Raporları</h1>
          <p className="page-subtitle">
            Yaptığınız canlı derslerin raporları. Raporu görmek için derse tıklayın.
          </p>
        </header>
        <div className="report-lesson-list animate-on-scroll visible" data-animate>
          {DEMO_REPORT_LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              className="report-lesson-card"
              onClick={() => setSelectedId(lesson.id)}
            >
              <span className="report-lesson-icon" aria-hidden>📄</span>
              <div className="report-lesson-content">
                <h2 className="report-lesson-title">{lesson.title}</h2>
                <span className="report-lesson-meta">
                  {formatReportDate(lesson.date)} · {lesson.durationMin} dk
                  {lesson.className && ` · ${lesson.className}`}
                </span>
              </div>
              <span className="report-lesson-arrow" aria-hidden>→</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  // ——— Ders raporu detay ———
  return (
    <>
      <div className="report-back-bar no-print">
        <button
          type="button"
          className="btn btn-secondary report-back-btn"
          onClick={() => setSelectedId(null)}
        >
          ← Raporlara dön
        </button>
      </div>

      <div className="main-report">
        <div className="report-actions no-print">
          <div className="report-buttons">
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              PDF / Yazdır
              </button>
          </div>
        </div>

        <div className="report-document animate-on-scroll visible" data-animate>
          <div className="report-cover">
            <div className="report-cover-logo" style={{ background: 'var(--color-surface-elevated)' }}>
              <img src="/Logo.png" alt="Sense AI" />
            </div>
            <h2 className="report-cover-title">Canlı Ders Raporları</h2>
            <p className="report-cover-meeting">{selectedLesson?.title}</p>
            <p className="report-cover-date">
              {selectedLesson?.date && formatReportDate(selectedLesson.date)} · {selectedLesson?.durationMin} dk
              {selectedLesson?.className && ` · ${selectedLesson.className}`}
            </p>
          </div>

          {reportContent && (
            <>
              <section className="report-section">
                <h3 className="report-section-title">İşlenen konu</h3>
                <p className="report-text">{reportContent.topic}</p>
              </section>

              <section className="report-section">
                <h3 className="report-section-title">Ders özeti (detaylı)</h3>
                <p className="report-text report-summary-detailed">{reportContent.summaryDetailed}</p>
              </section>

              <section className="report-section">
                <h3 className="report-section-title">Bakılan konular</h3>
                <ul className="report-list report-list-bullet">
                  {reportContent.sectionsLookedAt.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="report-section">
                <h3 className="report-section-title">Üzerinde durulan noktalar</h3>
                <ul className="report-list report-list-bullet">
                  {reportContent.emphasized.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="report-section">
                <h3 className="report-section-title">Anahtar kavramlar</h3>
                <div className="report-key-terms">
                  {reportContent.keyTerms.map((term, i) => (
                    <span key={i} className="report-key-term">{term}</span>
                  ))}
                </div>
              </section>

                  <section className="report-section">
                <h3 className="report-section-title">Ders transkripti (kim ne konuştu)</h3>
                <div className="report-transcript">
                  {reportContent.transcript.map((entry, i) => (
                    <div key={i} className="report-transcript-entry">
                      <span className="report-transcript-time">{entry.time}</span>
                      <span className="report-transcript-speaker">{entry.speaker}</span>
                      <p className="report-transcript-text">{entry.text}</p>
                    </div>
                  ))}
                </div>
                  </section>

              {reportContent.references && reportContent.references.length > 0 && (
                  <section className="report-section">
                  <h3 className="report-section-title">Kaynakça</h3>
                  <ol className="report-list report-list-numbered report-references">
                    {reportContent.references.map((ref, i) => (
                      <li key={i} className="report-reference-item">
                        {ref.title}
                        {ref.author && `, ${ref.author}`}
                        {ref.year && ` (${ref.year})`}
                        {ref.note && `. ${ref.note}`}
                        {ref.url && (
                          <span className="report-reference-url"> — <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.url}</a></span>
                        )}
                      </li>
                    ))}
                  </ol>
                  </section>
              )}

              <section className="report-section">
                <h3 className="report-section-title">Katılımcılar</h3>
                <p className="report-text">{reportContent.participants.join(', ')}</p>
              </section>
            </>
          )}

          <div className="report-footer">
            Bu rapor otomatik oluşturulmuştur. İçerik canlı ders kaydı ve transkripte dayanmaktadır.
          </div>
        </div>
      </div>
    </>
  )
}
