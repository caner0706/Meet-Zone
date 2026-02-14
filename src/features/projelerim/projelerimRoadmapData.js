/**
 * Projelerim yol haritası — TÜBİTAK, Turkcell, Teknofest toplantı kararlarından türetilen öğeler.
 * Gen AI: Yapılacaklar. Agent: Hareket planı, adımlar, öneriler, kaynaklar.
 * Raporlar (projelerimReports) ve analizlerle uyumlu meetingId: p1–p8.
 */

export const ROADMAP_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
}

export const PROJE_ROADMAP_ITEMS = [
  {
    id: 'prm1',
    meetingId: 'p1',
    meetingTitle: 'TÜBİTAK 2209-A – Proje özeti ve literatür toplantısı',
    meetingDate: '2025-02-12',
    decision: 'Proje özeti taslağı 18 Şubat’a kadar danışmana iletilecek; literatür anahtar kelime listesi paylaşılacak.',
    visual: 'document',
    status: ROADMAP_STATUS.IN_PROGRESS,
    due: '18 Şubat 2025',
    genItems: [
      'Proje özeti taslağını 500 kelimeye indir ve danışmana gönder',
      'Literatür anahtar kelime listesini hazırla ve paylaş',
      'Metodoloji bölümü için danışman şablonunu bekle ve uygula',
    ],
    agentPlan: {
      steps: [
        'Özeti 500 kelime sınırına dikkat ederek yaz; amaç, yöntem ve beklenen çıktıyı net ifade et.',
        'Anahtar kelimelerde son 5 yıl ve hakemli dergi vurgusu yap; IEEE, Scopus, ScienceDirect için ayrı listeler düşün.',
        'Danışman metodoloji şablonu gelince nicel/nitel ayrımını netleştir.',
      ],
      suggestions: [
        'Literatür taramasında en az 15 güncel kaynak hedefle.',
        'Özeti değerlendirici gözüyle okuyup “ilk izlenim” testi yap.',
      ],
      links: [
        { label: 'TÜBİTAK 2209-A Başvuru Rehberi', url: 'https://www.tubitak.gov.tr' },
        { label: 'Bilimsel Proje Yazımı', url: 'https://www.tubitak.gov.tr' },
      ],
    },
  },
  {
    id: 'prm2',
    meetingId: 'p2',
    meetingTitle: 'TÜBİTAK – Danışman onayı ve taslak rapor görüşmesi',
    meetingDate: '2025-02-18',
    decision: 'Taslak rapora danışman notları işlenecek; etik kurul evrakı bu hafta tamamlanacak.',
    visual: 'ethics',
    status: ROADMAP_STATUS.TODO,
    due: '22 Şubat 2025',
    genItems: [
      'Taslak rapora danışman notlarını işle ve yeniden gönder',
      'Etik kurul başvuru formunu doldur ve imza için danışmana ilet',
      'Metodolojiye örneklem büyüklüğü gerekçesi (G*Power vb.) ekle',
    ],
    agentPlan: {
      steps: [
        'Özet bölümünde “amaç” ve “beklenen çıktı” cümlelerini güçlendir; tek cümlede anlaşılır olsun.',
        'Etik kurul formunda proje başlığı, yöntem özeti ve risk bilgilerini eksiksiz doldur.',
        'Danışman imzası sonrası evrakı idareye teslim et; onay süresini takip et.',
      ],
      suggestions: [
        'G*Power ile hesaplanan örneklem büyüklüğünü metodolojiye ekle; değerlendiriciler için artı.',
        'Etik kurul sürecini başvuru takvimine göre planla; son tarihi kaçırma.',
      ],
      links: [
        { label: '2209-A Değerlendirme Formu', url: 'https://www.tubitak.gov.tr' },
      ],
    },
  },
  {
    id: 'prm3',
    meetingId: 'p3',
    meetingTitle: 'Turkcell Geleceği Yazanlar – Sprint ve API entegrasyonu',
    meetingDate: '2025-02-11',
    decision: 'API dokümantasyonu Swagger’da güncel tutulacak; integration testleri Cuma’ya kadar tamamlanacak.',
    visual: 'api',
    status: ROADMAP_STATUS.IN_PROGRESS,
    due: '13 Şubat 2025',
    genItems: [
      'Swagger dokümantasyonunu güncelle ve PR aç',
      'Tüm endpoint’leri OpenAPI 3.0 ile dokümante et',
      'Integration testlerini tamamla ve sonuçları paylaş',
    ],
    agentPlan: {
      steps: [
        'Her merge’den sonra Swagger’ı güncelle; GET, POST, PATCH ayrımını net yap.',
        'Integration testlerinde başarılı/başarısız senaryoları dokümante et.',
        'Demo senaryosu için hangi endpoint’lerin kullanılacağını listele.',
      ],
      suggestions: [
        'Jüri sunumu için “farkınız ne?” ve “ölçeklenebilirlik” sorularına cevap notu hazırla.',
        'Rate limiting ve auth bilgisini API dokümantasyonuna ekle.',
      ],
      links: [
        { label: 'Turkcell Geleceği Yazanlar', url: 'https://gelecegiyazanlar.turkcell.com.tr' },
        { label: 'OpenAPI 3.0', url: 'https://swagger.io/specification/' },
      ],
    },
  },
  {
    id: 'prm4',
    meetingId: 'p4',
    meetingTitle: 'Turkcell – Jüri sunumu hazırlığı ve provası',
    meetingDate: '2025-02-14',
    hideDate: true,
    decision: 'Slaytlar 16 Şubat’a kadar son haline getirilecek; demo yedeği olarak 2 dk video kaydı alınacak.',
    visual: 'presentation',
    status: ROADMAP_STATUS.TODO,
    due: '16 Şubat 2025',
    genItems: [
      'Son slayt versiyonunu paylaş (10 dk sunum, 5 dk demo, 5 dk soru-cevap)',
      'Demo yedek videosunu kaydet ve link paylaş',
      'Olası jüri soruları için cevap notlarını dokümante et',
    ],
    agentPlan: {
      steps: [
        'Sunumda giriş → problem → çözüm → canlı demo → sonuç akışına uy; süreyi aşma.',
        'Demo için yedek video çek; bağlantı koparsa 2 dk’lık kayıt göster.',
        '“Farkınız ne?” ve “ölçeklenebilirlik” sorularına net cevap hazırla.',
      ],
      suggestions: [
        'Teknik sorunlara karşı jüri önünde sakin kal; yedek videoya geçişi prova et.',
        'Konuşmacı sırası ve süreleri önceden belirle.',
      ],
      links: [],
    },
  },
  {
    id: 'prm5',
    meetingId: 'p5',
    meetingTitle: 'Teknofest – Tasarım raporu ve mühendislik hesapları',
    meetingDate: '2025-02-10',
    decision: 'Tasarım raporu 1 Mart’ta teslim; simülasyon sonuçları 15 Şubat’a kadar paylaşılacak.',
    visual: 'design',
    status: ROADMAP_STATUS.IN_PROGRESS,
    due: '1 Mart 2025',
    genItems: [
      'Simülasyon sonuçlarını rapor formatında paylaş',
      'Mühendislik hesaplarını (itki, ağırlık, stabilite) dokümante et',
      'Tasarım raporu bölümlerini birleştirip taslak hazırla',
    ],
    agentPlan: {
      steps: [
        'Simülasyon çıktılarını grafik ve tablolarla rapora ekle; Teknofest şablonuna uy.',
        'Hesaplarda birim ve formül kaynaklarını belirt; tekrarlanabilir olsun.',
        'Tüm bölümleri 20 Şubat’a kadar kaptana ilet; birleştirme ve son okuma yapılsın.',
      ],
      suggestions: [
        'Test planı bölümünde hangi testlerin nerede yapılacağını yaz.',
        'Roket kategorisi şartnamesindeki maddelere tek tek uyulduğunu kontrol et.',
      ],
      links: [
        { label: 'Teknofest Roket Yarışması Şartnamesi', url: 'https://www.teknofest.org' },
        { label: 'Tasarım Raporu Şablonu', url: 'https://www.teknofest.org' },
      ],
    },
  },
  {
    id: 'prm6',
    meetingId: 'p6',
    meetingTitle: 'Teknofest – Atölye planlaması ve malzeme listesi',
    meetingDate: '2025-02-13',
    hideDate: true,
    decision: 'Malzeme listesi nihaileştirilecek; siparişler 20 Şubat’a kadar verilecek.',
    visual: 'workshop',
    status: ROADMAP_STATUS.TODO,
    due: '20 Şubat 2025',
    genItems: [
      'Eksik malzeme kalemlerini listele ve kaptana ilet',
      'Malzeme listesini nihaileştir ve siparişleri ver',
      'Güvenlik eğitim tarihlerini takip et',
    ],
    agentPlan: {
      steps: [
        'Atölye kullanım saatleri (Salı–Perşembe 14:00–18:00) takvimine işle.',
        'Sipariş verirken teslimat süresini hesaba kat; 1 Mart rapor teslimine yetişsin.',
        'Güvenlik eğitimi belgesi olmadan atölyeye girilemeyeceğini unutma.',
      ],
      suggestions: [
        'Kritik parçalar için yedek sipariş düşün.',
        'Atölye sorumlusu ile güvenlik eğitim tarihlerini netleştir.',
      ],
      links: [
        { label: 'Atölye Kullanım Kılavuzu', url: '#' },
      ],
    },
  },
  {
    id: 'prm7',
    meetingId: 'p7',
    meetingTitle: 'TÜBİTAK – Son başvuru öncesi kontrol toplantısı',
    meetingDate: '2025-03-10',
    decision: 'Evraklar 12 Mart’a kadar sisteme yüklenecek; danışman 14 Mart’ta son onayı verecek.',
    visual: 'document',
    status: ROADMAP_STATUS.TODO,
    due: '15 Mart 2025',
    genItems: [
      'Tüm evrakları (özet, taslak, etik kurul) PDF ve isimlendirme kuralına uygun hazırla',
      'Sisteme yükle ve danışmana bildir',
      'Danışman onayı sonrası çıktı alıp arşivle',
    ],
    agentPlan: {
      steps: [
        'e-bideb sisteminde evrak yükleme adımlarını takip et; dosya boyutu ve format sınırlarına dikkat et.',
        'Danışmana 12 Mart’ta bildir; 14 Mart’ta son onayı al; 15 Mart gece yarısı son başvuru.',
        'Yükleme sonrası ekrandan çıktı al; başvuru numarasını kaydet.',
      ],
      suggestions: [
        'Son güne bırakma; sistem yoğunluğu olabilir.',
        'Tüm evrakların aynı proje başlığı ve kişi bilgisiyle tutarlı olduğunu kontrol et.',
      ],
      links: [
        { label: 'TÜBİTAK e-bideb Başvuru Sistemi', url: 'https://e-bideb.tubitak.gov.tr' },
      ],
    },
  },
  {
    id: 'prm8',
    meetingId: 'p8',
    meetingTitle: 'Turkcell – Proje kapanış ve değerlendirme',
    meetingDate: '2025-02-20',
    hideDate: true,
    decision: 'Repo arşivlenecek; README’de proje özeti, teknoloji ve ekran görüntüleri güncellenecek.',
    visual: 'api',
    status: ROADMAP_STATUS.DONE,
    due: '22 Şubat 2025',
    genItems: [
      "README'yi güncelle (özet, teknoloji stack, ekran görüntüleri)",
      "Repo'yu archived olarak işaretle",
      'Sertifika ve katılım belgesi e-postasını takip et',
    ],
    agentPlan: {
      steps: [
        'README’de proje amacı, kurulum, kullanılan teknolojiler ve 2–3 ekran görüntüsü olsun.',
        'GitHub/GitLab’da repo’yu “Archived” yap; yeni issue/PR kapatılsın.',
        'Referans mektubu ihtiyacı varsa mentor ile iletişime geç.',
      ],
      suggestions: [
        'Portfolio için proje linkini ve kısa açıklamayı sakla.',
      ],
      links: [
        { label: 'Turkcell Geleceği Yazanlar', url: 'https://gelecegiyazanlar.turkcell.com.tr' },
      ],
    },
  },
]
