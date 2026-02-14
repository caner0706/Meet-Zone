/**
 * Staj yol haritası — toplantı kararlarından türetilen öğeler.
 * Gen AI: Karar doğrultusunda "yapılacaklar" üretir.
 * Agent: Nasıl yapılacağına dair hareket planı, adımlar, öneriler.
 */

export const ROADMAP_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
}

/** Demo: Toplantı raporlarından (r1, r2, r3) türetilmiş yol haritası öğeleri */
export const STAJ_ROADMAP_ITEMS = [
  {
    id: 'rm1',
    meetingId: 'r1',
    meetingTitle: 'Haftalık staj değerlendirme',
    meetingDate: '2025-02-10',
    decision: 'Veritabanı migrasyonu production’a alınacak; rollback dokümante edilecek.',
    visual: 'database',
    status: ROADMAP_STATUS.IN_PROGRESS,
    due: '15 Şubat 2025',
    genItems: [
      'Rollback dokümanını tamamla ve danışmana gönder',
      'Staging’de migration + rollback senaryosunu en az bir kez prova et',
      'Production deployment penceresine (Cuma 18:00–20:00) hazır ol',
    ],
    agentPlan: {
      steps: [
        'Rollback dokümanında: hangi komutla geri alınacak, hangi sırayla, kim onaylayacak — net yaz.',
        'Staging’de önce migration’ı çalıştır, veriyi kontrol et; sonra rollback komutunu çalıştırıp tekrar kontrol et.',
        'Deployment gecesi danışman veya takım lideri ile birlikte ol; logları canlı takip et.',
      ],
      suggestions: [
        'Rollback süresini tahmini yaz (örn. 5–10 dk); acil durum iletişim listesini dokümana ekle.',
        'Migration öncesi veritabanı yedeği alındığından emin ol.',
      ],
      links: [
        { label: 'OpenAPI Specification', url: 'https://swagger.io/specification/' },
        { label: 'Staj Değerlendirme Kılavuzu', url: '#' },
      ],
    },
  },
  {
    id: 'rm2',
    meetingId: 'r1',
    meetingTitle: 'Haftalık staj değerlendirme',
    meetingDate: '2025-02-10',
    decision: 'Profil API için endpoint taslağı (OpenAPI) paylaşılacak.',
    visual: 'api',
    status: ROADMAP_STATUS.TODO,
    due: '13 Şubat 2025',
    genItems: [
      'Profil API için OpenAPI 3.0 spec taslağını hazırla',
      'GET /profiles/me, PATCH /profiles/me, GET /profiles/:id endpoint’lerini tanımla',
      'Taslağı ekip/danışman ile paylaş, geri bildirim al',
    ],
    agentPlan: {
      steps: [
        'REST konvansiyonlarına uy: kaynaklar çoğul (/profiles), tekil kaynak için :id.',
        'PATCH ile kısmi güncelleme; gönderilmeyen alanlar değişmesin.',
        'Hata yanıtı formatını (code, message, details) mevcut uygulama standardına göre yaz.',
        'Spec’i PDF veya Swagger UI linki ile paylaş; en az bir onay sonrası implementasyona geç.',
      ],
      suggestions: [
        'Versioning için /api/v1 prefix kullan; diğer endpoint’lerle tutarlı olsun.',
        'Rate limiting ve auth middleware’in bu endpoint’lere nasıl uygulandığını dokümante et.',
      ],
      links: [
        { label: 'REST API Design Guide', url: 'https://restfulapi.net/' },
        { label: 'OpenAPI 3.0', url: 'https://swagger.io/specification/' },
      ],
    },
  },
  {
    id: 'rm3',
    meetingId: 'r2',
    meetingTitle: 'Mentorluk – API tasarımı',
    meetingDate: '2025-02-05',
    decision: 'Profil API v1 için OpenAPI spec yazılacak; tüm endpoint’ler /api/v1 altında.',
    status: ROADMAP_STATUS.TODO,
    due: '7 Şubat 2025',
    genItems: [
      'OpenAPI 3.0 spec taslağını hazırla (profil endpoint’leri)',
      "Spec’i mentor ile paylaş, geri bildirim al",
    ],
    agentPlan: {
      steps: [
        'Kaynak isimlendirme: /users, /profiles; ilişkiler için alt kaynak /users/:id/profile.',
        'GET’in side-effect içermediğini, PUT vs PATCH farkını spec açıklamalarında belirt.',
        'Mentor geri bildirimini not al; gerekirse ikinci tur revizyon yap.',
      ],
      suggestions: [
        'Idempotency kurallarını (POST dışında) spec’te kısaca açıkla.',
      ],
      links: [
        { label: 'OpenAPI 3.0 Docs', url: 'https://swagger.io/specification/' },
      ],
    },
  },
  {
    id: 'rm4',
    meetingId: 'r3',
    meetingTitle: 'Sprint 22 retrospektif',
    meetingDate: '2025-02-03',
    decision: "Staging erişim kılavuzu güncellenecek; Definition of Done'a wiki maddesi eklenecek.",
    visual: 'files',
    status: ROADMAP_STATUS.DONE,
    due: '7 Şubat 2025',
    genItems: [
      "Staging kılavuzunu güncelle ve stajyere ilet",
      "DoD'a “ilgili wiki sayfası güncellendi” maddesini ekle",
    ],
    agentPlan: {
      steps: [
        'Staging kılavuzunda: erişim adımları, ortam değişkenleri, sık karşılaşılan hatalar.',
        "DoD güncellemesini takım kanalında duyur; bir sonraki sprint'ten itibaren geçerli olsun.",
      ],
      suggestions: [
        'Retro’da suçlayıcı dil kullanılmadığını, süreç odaklı kaldığını koru.',
      ],
      links: [
        { label: 'Scrum Guide – Definition of Done', url: 'https://scrum.org/resources/what-is-scrum' },
      ],
    },
  },
  {
    id: 'rm5',
    meetingId: 'r1',
    meetingTitle: 'Haftalık staj değerlendirme',
    meetingDate: '2025-02-10',
    decision: 'Sprint 23’te dailylere tam katılım ve retrospektife davet.',
    status: ROADMAP_STATUS.TODO,
    visual: 'sprint',
    due: 'Sprint 23',
    genItems: [
      'Sprint 23 boyunca günlük toplantılara tam katılım göster',
      'Retrospektif toplantısına katıl, geri bildirim ver',
      'Kullanıcı profil API ve loglama iyileştirmesi story’lerinde çalış',
    ],
    agentPlan: {
      steps: [
        'Daily’lerde kısa ve net güncelleme ver: dün ne yaptın, bugün ne yapacaksın, engel var mı.',
        'Retro’da “ne iyi gitti / ne iyileşebilir” için somut örnekler sun; kişi değil süreç odaklı ol.',
        'Story’lere tahmini puanları takım ile uyumlu tut; belirsizlik varsa sor.',
      ],
      suggestions: [
        'Loglama için yeni dependency ekleme; mevcut structured logging kütüphanesini kullan.',
      ],
    },
  },
]
