/**
 * Staj toplantı raporları — demo veri.
 * Her rapor: özet, gündem, konuşulan konular, kararlar, aksiyon maddeleri, transkript özeti.
 */

function formatReportDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const STAJ_MEETING_REPORTS = [
  {
    id: 'r1',
    title: 'Haftalık staj değerlendirme',
    date: '2025-02-10T14:00:00',
    durationMin: 45,
    participants: [
      { name: 'Caner Giden', role: 'Stajyer' },
      { name: 'Ayşe Yılmaz', role: 'Staj danışmanı' },
      { name: 'Mehmet Kaya', role: 'Takım lideri' },
    ],
    topic: 'Haftalık ilerleme, veritabanı migrasyonu ve Sprint 23 planlaması.',
    summary: 'Stajyerin ikinci hafta performansı, veritabanı modülündeki ilerleme ve sonraki hafta hedefleri görüşüldü. Sprint planlamasına katılım ve kod incelemesi süreçleri değerlendirildi.',
    keyTerms: ['Veritabanı migrasyonu', 'Rollback', 'Sprint', 'OpenAPI', 'Kod incelemesi', 'Mentorluk'],
    references: [
      { title: 'Staj Değerlendirme Kılavuzu', author: 'İK', year: '2024', note: 'Haftalık geri bildirim formatı' },
      { title: 'OpenAPI Specification', url: 'https://swagger.io/specification/' },
    ],
    agenda: [
      'Haftalık ilerleme özeti',
      'Veritabanı görevleri ve kod kalitesi',
      'Sprint planlaması ve sorumluluklar',
      'Sonraki hafta hedefleri',
    ],
    topicsDiscussed: [
      { title: 'Veritabanı migrasyon görevi', content: 'Mevcut şemanın yeni yapıya taşınması sırasında constraint ve index’lerin korunması üzerinde duruldu. Caner’in yazdığı migration script’lerin test ortamında sorunsuz çalıştığı belirtildi.' },
      { title: 'Kod inceleme süreci', content: 'PR’larda en az bir onay zorunluluğu ve “nit” yorumlarının iki iş günü içinde giderilmesi gerektiği tekrarlandı. Stajyerin PR’larının ortalama onay süresi iyi bulundu.' },
      { title: 'Sprint 23 planlaması', content: 'Önümüzdeki sprint’te stajyerin iki story üzerinde çalışması planlandı: kullanıcı profil API’si ve loglama iyileştirmesi. Tahmini puanlar paylaşıldı.' },
    ],
    decisions: [
      'Veritabanı migrasyonu production’a 15 Şubat’ta alınacak; deployment penceresi Cuma 18:00–20:00.',
      'Stajyer, Sprint 23’te dailylere tam katılım gösterecek ve retrospektife davet edilecek.',
      'Mentorluk oturumları haftada bir, Çarşamba 10:00’da yapılmaya devam edecek.',
    ],
    keyPoints: [
      'Migration’da rollback senaryosunun dokümante edilmesi ve staging’de en az bir kez prova edilmesi.',
      'API tasarımında REST konvansiyonlarına uyulması (kaynak isimlendirme, HTTP metodları).',
      'Loglama için mevcut structured logging kütüphanesinin kullanılması; yeni dependency eklenmemesi.',
    ],
    actionItems: [
      { who: 'Caner Giden', what: 'Rollback dokümanını tamamla ve danışmana gönder', dueDate: '12 Şubat 2025' },
      { who: 'Caner Giden', what: 'Profil API için endpoint taslağını (OpenAPI) paylaş', dueDate: '13 Şubat 2025' },
      { who: 'Ayşe Yılmaz', what: 'Staging ortamında migration test slotu ayarla', dueDate: '14 Şubat 2025' },
    ],
    transcriptExcerpts: [
      { speaker: 'Ayşe Yılmaz', role: 'Danışman', text: 'Bu hafta veritabanı tarafında ciddi ilerleme var. Migration script’leri temiz yazılmış, tek eksik rollback adımlarının netleşmesi.', time: '14:05' },
      { speaker: 'Caner Giden', role: 'Stajyer', text: 'Rollback için gerekli komutları not aldım, yarın dokümana döküp paylaşacağım.', time: '14:08' },
      { speaker: 'Mehmet Kaya', role: 'Takım lideri', text: 'Sprint 23’te iki story ile devam edelim. Profil API’de önce taslağı çıkar, sonra implementasyona geçeriz.', time: '14:25' },
      { speaker: 'Ayşe Yılmaz', role: 'Danışman', text: 'Mentorluk oturumlarını Çarşamba 10:00’da sabitleyelim, böylece haftalık ritim oturur.', time: '14:38' },
    ],
    tags: ['Değerlendirme', 'Sprint', 'Veritabanı'],
  },
  {
    id: 'r2',
    title: 'Mentorluk – API tasarımı',
    date: '2025-02-05T10:00:00',
    durationMin: 35,
    participants: [
      { name: 'Caner Giden', role: 'Stajyer' },
      { name: 'Emre Demir', role: 'Mentor' },
    ],
    topic: 'REST API tasarımı, kaynak isimlendirme ve profil API endpoint’leri.',
    summary: 'REST API tasarım ilkeleri, kaynak isimlendirme ve HTTP durum kodları üzerine mentorluk oturumu. Profil API’si için örnek endpoint’ler birlikte tasarlandı.',
    keyTerms: ['REST', 'API', 'PATCH', 'GET', 'OpenAPI', 'Kaynak isimlendirme'],
    references: [
      { title: 'REST API Design Guide', url: 'https://restfulapi.net/' },
      { title: 'OpenAPI 3.0', url: 'https://swagger.io/specification/' },
    ],
    agenda: [
      'REST konvansiyonları',
      'Profil API taslağı',
      'Hata yanıtı formatı',
    ],
    topicsDiscussed: [
      { title: 'REST kaynak isimlendirme', content: 'Çoğul isim kullanımı (/users, /profiles), ilişkiler için alt kaynaklar (/users/:id/profile). Idempotency ve GET’in side-effect içermemesi vurgulandı.' },
      { title: 'Profil API endpoint’leri', content: 'GET /profiles/me, PATCH /profiles/me, GET /profiles/:id (public alanlar). Versioning için URL prefix (/api/v1) kararı.' },
      { title: 'Hata formatı', content: 'Mevcut uygulamadaki standardize hata gövdesi (code, message, details) kullanılacak; 4xx ve 5xx ayrımı.' },
    ],
    decisions: [
      'Profil API v1 için OpenAPI 3.0 spec yazılacak ve ekip ile paylaşılacak.',
      'Tüm yeni endpoint’ler /api/v1 prefix’i altında olacak.',
    ],
    keyPoints: [
      'PATCH ile kısmi güncelleme; gönderilmeyen alanlar değişmeyecek.',
      'Rate limiting ve authentication middleware’in mevcut yapıda nasıl kullanıldığı.',
    ],
    actionItems: [
      { who: 'Caner Giden', what: 'OpenAPI spec taslağını hazırla (profil endpoint’leri)', dueDate: '7 Şubat 2025' },
      { who: 'Emre Demir', what: 'Spec’i inceleyip geri bildirim ver', dueDate: '8 Şubat 2025' },
    ],
    transcriptExcerpts: [
      { speaker: 'Emre Demir', role: 'Mentor', text: 'REST’te kaynaklar çoğul isimle ifade edilir: /users, /profiles. Tekil kaynak için id path’te olur.', time: '10:05' },
      { speaker: 'Caner Giden', role: 'Stajyer', text: 'PATCH ile sadece değişen alanları göndereceğiz, PUT yerine. Doğru mu?', time: '10:18' },
      { speaker: 'Emre Demir', role: 'Mentor', text: 'Evet. PUT genelde tam kaynağı değiştirir, PATCH kısmi güncelleme için. Bizim senaryoda PATCH uygun.', time: '10:19' },
    ],
    tags: ['Mentorluk', 'API', 'REST'],
  },
  {
    id: 'r3',
    title: 'Sprint 22 retrospektif',
    date: '2025-02-03T15:00:00',
    durationMin: 40,
    participants: [
      { name: 'Caner Giden', role: 'Stajyer' },
      { name: 'Mehmet Kaya', role: 'Takım lideri' },
      { name: 'Ayşe Yılmaz', role: 'Danışman' },
      { name: 'Zeynep Arslan', role: 'Geliştirici' },
    ],
    topic: 'Sprint 22 retrospektifi: iyi gidenler, iyileştirmeler ve aksiyonlar.',
    summary: 'Sprint 22’nin ne iyi gittiği, ne iyileştirilebileceği ve bir sonraki sprint’e taşınan aksiyonlar konuşuldu. Stajyerin ilk sprint deneyimi paylaşıldı.',
    keyTerms: ['Retrospektif', 'Sprint', 'DoD', 'Staging', 'Definition of Done'],
    references: [
      { title: 'Scrum Guide', author: 'Scrum.org', year: '2020', note: 'Retrospektif ve sprint' },
    ],
    agenda: [
      'Sprint 22 özeti',
      'Ne iyi gitti?',
      'Ne iyileştirilebilir?',
      'Aksiyonlar',
    ],
    topicsDiscussed: [
      { title: 'Sprint 22 özeti', content: 'Çoğu hedef tamamlandı. Veritabanı migration görevi bir gün gecikmeli bitti; sebep olarak test ortamı kurulumu gösterildi.' },
      { title: 'İyi gidenler', content: 'Günlük toplantıların kısa ve odaklı olması, PR inceleme sürelerinin kısalması. Stajyerin soru sorması ve not alması takım tarafından olumlu bulundu.' },
      { title: 'İyileştirme alanları', content: 'Staging ortamına erişim ve dokümantasyonun güncel tutulması. Bir sonraki sprint’te “definition of done” maddesi dokümantasyonu da kapsayacak şekilde güncellenecek.' },
    ],
    decisions: [
      'Staging erişim kılavuzu bir hafta içinde güncellenecek ve stajyere iletilecek.',
      'Definition of done’a “ilgili wiki sayfası güncellendi” maddesi eklenecek.',
    ],
    keyPoints: [
      'Retro’da suçlayıcı dil kullanılmaması; süreç ve araçlar üzerinde durulması.',
      'Aksiyonların sahibi ve tarihinin net olması.',
    ],
    actionItems: [
      { who: 'Ayşe Yılmaz', what: 'Staging kılavuzunu güncelle ve paylaş', dueDate: '7 Şubat 2025' },
      { who: 'Mehmet Kaya', what: "DoD'u güncelle (wiki maddesi)", dueDate: '5 Şubat 2025' },
    ],
    transcriptExcerpts: [
      { speaker: 'Mehmet Kaya', role: 'Takım lideri', text: 'Sprint 22’yi kısaca özetleyeyim: hedeflerin %90’ı tamamlandı, migration bir gün gecikmeli bitti.', time: '15:02' },
      { speaker: 'Zeynep Arslan', role: 'Geliştirici', text: 'Stajyerin PR’ları temiz, yorumlar hızlı dönüldü. Bu ritmi koruyalım.', time: '15:12' },
      { speaker: 'Caner Giden', role: 'Stajyer', text: 'Staging’e ilk girişte biraz kayboldum, dokümantasyon güncel olsa iyi olur.', time: '15:18' },
      { speaker: 'Ayşe Yılmaz', role: 'Danışman', text: 'Kılavuzu güncelleyeceğim, Cuma’ya kadar paylaşırım.', time: '15:22' },
    ],
    tags: ['Retrospektif', 'Sprint 22'],
  },
]

export { formatReportDate }
