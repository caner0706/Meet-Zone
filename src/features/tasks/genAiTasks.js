/**
 * Gen AI Agent — Ders bittikten sonra öğrenci için üretilen görevler.
 * Senaryo: Öğrenci derse katıldı → ders bitti → sistem derse göre öneriler, testler,
 * araştırmalar, yol haritası oluşturuyor. Jira tarzı board'da gösterilir.
 */

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
}

export const TASK_TYPE = {
  TEST: 'test',
  RESEARCH: 'research',
  ROADMAP: 'roadmap',
  SUGGESTION: 'suggestion',
  REVIEW: 'review',
  READING: 'reading',
}

const TYPE_LABELS = {
  [TASK_TYPE.TEST]: 'Test',
  [TASK_TYPE.RESEARCH]: 'Araştırma',
  [TASK_TYPE.ROADMAP]: 'Yol haritası',
  [TASK_TYPE.SUGGESTION]: 'Öneri',
  [TASK_TYPE.REVIEW]: 'Tekrar',
  [TASK_TYPE.READING]: 'Okuma',
}

export function getTypeLabel(type) {
  return TYPE_LABELS[type] || type
}

/** Görev türüne göre "Yaptıklarım" bölümündeki dosya yükleme etiketi */
export function getCompletionUploadLabel(type) {
  const labels = {
    [TASK_TYPE.TEST]: 'Çözdüğüm testi yükle',
    [TASK_TYPE.RESEARCH]: 'Araştırma raporumu / özet yükle',
    [TASK_TYPE.REVIEW]: 'Tekrar notlarımı / özet yükle',
    [TASK_TYPE.READING]: 'Okuma özetimi yükle',
    [TASK_TYPE.SUGGESTION]: 'Özet / çalışma notum yükle',
    [TASK_TYPE.ROADMAP]: 'Yol haritası çıktımı / özet yükle',
  }
  return labels[type] || 'Özet / dosya yükle'
}

/** Demo: Ders sonrası AI'ın ürettiği görevler — Yazılım Mühendisliği (gerçek uygulamada API'den gelir) */
export const GEN_AI_TASKS = [
  {
    id: 't1',
    title: 'Programlama I – Dizi ve döngü alıştırmaları',
    description: 'Ders kitabındaki Bölüm 4 alıştırmalarından 10 soruyu çöz. Özellikle dizi ile toplam, ortalama ve maksimum bulma.',
    course: 'Programlama I',
    courseId: 'prog1',
    type: TASK_TYPE.TEST,
    status: TASK_STATUS.TODO,
    due: '3 gün',
    priority: 'high',
    estimatedTime: '45–60 dk',
    tip: 'Sınavda mutlaka döngü ile dizi işleme istenir; indeks 0\'dan başlar, length kullanın. Değişken isimleri anlamlı olsun.',
    steps: [
      'Ders kitabı Bölüm 4 (Diziler) alıştırmalarını aç.',
      'Toplam ve ortalama hesaplayan en az 2 program yaz.',
      'Maksimum/minimum bulma ve dizi yazdırma alıştırmalarını çöz.',
      'Derleyici/IDE ile çalıştırıp çıktıyı kontrol et.',
    ],
    watch: [
      { label: 'GeeksforGeeks – Array exercises', url: 'https://www.geeksforgeeks.org' },
      { label: 'Khan Academy – Loops', url: 'https://www.khanacademy.org' },
    ],
  },
  {
    id: 't2',
    title: 'Fonksiyon parametreleri – değer vs referans',
    description: 'Kısa rapor: primitive ve nesne parametre geçişi farkı. Bir dilde (Java/C) örnek kod ile açıkla.',
    course: 'Programlama I',
    courseId: 'prog1',
    type: TASK_TYPE.RESEARCH,
    status: TASK_STATUS.TODO,
    due: '1 hafta',
    priority: 'medium',
    estimatedTime: '1 saat',
    tip: 'Primitive tipler kopya ile gider; fonksiyon içinde değiştirince orijinal etkilenmez. Nesneler referans ile; değişiklik orijinali etkiler.',
    steps: [
      'Değer ile geçiş (pass by value) ve referans ile geçiş (pass by reference) kavramlarını araştır.',
      'Seçtiğin dilde iki kısa örnek yaz: biri primitive, biri dizi/nesne.',
      'Yarım sayfalık özet + kod parçaları hazırla.',
    ],
    watch: [
      { label: 'GeeksforGeeks – Parameter passing', url: '#' },
    ],
  },
  {
    id: 't3',
    title: 'Bu hafta konu yol haritası',
    description: 'Programlama I: Dizi tekrarı (1 saat) → Veri Yapıları: Bağlı liste (1 saat) → Algoritmalar: Big-O (45 dk).',
    course: 'Genel',
    courseId: null,
    type: TASK_TYPE.ROADMAP,
    status: TASK_STATUS.IN_PROGRESS,
    due: 'Bu hafta',
    priority: 'high',
    estimatedTime: 'Haftalık',
    tip: 'Her gün için belirlenen süreleri aşmamaya çalışın. Tamamladıkça kartları "Tamamlandı" sütununa taşıyarak ilerlemenizi takip edin.',
    roadmap: [
      'Pazartesi–Salı: Programlama I – Dizi ve fonksiyon tekrarı (1 saat). Ders notları + 2 alıştırma.',
      'Çarşamba: Veri Yapıları – Bağlı liste ekleme/silme. Visualgo ile görselleştir.',
      'Perşembe: Algoritmalar – Big-O. Verilen kod parçalarının karmaşıklığını yaz.',
      'Cuma: Veritabanı – SELECT ve JOIN. En az 3 sorgu yaz ve çalıştır.',
    ],
    steps: [
      'Her gün için yukarıdaki bloklara uy; süreleri aşma.',
      'Tamamladıkça kartları "Tamamlandı" sütununa taşı.',
    ],
  },
  {
    id: 't4',
    title: 'BST – Inorder, preorder, postorder karşılaştırma',
    description: 'Aynı ikili arama ağacı için üç gezinme sırasını yaz; çıktıları karşılaştır. Inorder\'ın sıralı verdiğini vurgula.',
    course: 'Veri Yapıları',
    courseId: 'veriyapilari',
    type: TASK_TYPE.REVIEW,
    status: TASK_STATUS.IN_PROGRESS,
    due: '2 gün',
    priority: 'high',
    estimatedTime: '45 dk',
    tip: 'Inorder: sol–kök–sağ → sıralı çıktı. Preorder: kök–sol–sağ. Postorder: sol–sağ–kök. Sınavda ağaç çizimi veya sıra istenir.',
    steps: [
      'Tahtada verilen veya kitaptaki bir BST örneğini al.',
      'Inorder, preorder, postorder gezinme sıralarını ayrı ayrı yaz.',
      'Inorder çıktısının küçükten büyüğe sıralı olduğunu doğrula.',
    ],
    watch: [
      { label: 'Visualgo – BST', url: '#' },
      { label: 'GeeksforGeeks – Tree traversals', url: '#' },
    ],
  },
  {
    id: 't5',
    title: 'Merge sort – video ve uygulama',
    description: 'Merge sort videosunu izle; ardından bir dilde merge sort fonksiyonunu (birleştirme kısmı dahil) yaz.',
    course: 'Algoritmalar',
    courseId: 'algoritmalar',
    type: TASK_TYPE.READING,
    status: TASK_STATUS.TODO,
    due: '5 gün',
    priority: 'medium',
    estimatedTime: '45 dk',
    tip: 'Birleştirme (merge): iki sıralı diziyi baştan karşılaştır, küçük olanı al. O(n). Toplam O(n log n).',
    steps: [
      'Visualgo veya Khan Academy merge sort videosunu izle.',
      'Bölme ve birleştirme adımlarını not al.',
      'Seçtiğin dilde merge fonksiyonunu yaz; test dizisi ile dene.',
    ],
    watch: [
      { label: 'Visualgo – Merge Sort', url: 'https://visualgo.net' },
      { label: 'Khan Academy – Merge sort', url: 'https://www.khanacademy.org' },
    ],
  },
  {
    id: 't6',
    title: 'SQL – JOIN ile 3 sorgu',
    description: 'Öğrenci, ders ve kayıt tabloları üzerinde INNER JOIN ve LEFT JOIN kullanarak en az 3 sorgu yaz.',
    course: 'Veritabanı Yönetim Sistemleri',
    courseId: 'veritabani',
    type: TASK_TYPE.TEST,
    status: TASK_STATUS.DONE,
    due: 'Dün',
    priority: 'medium',
    estimatedTime: '30 dk',
    tip: 'JOIN\'de ON koşulunu doğru yazın: iki tablonun hangi sütunları eşleşecek. LEFT JOIN\'de sol tablodaki tüm satırlar kalır.',
    steps: [
      'Örnek şema: Ogrenci(id, ad), Ders(id, ad), Kayit(ogrenci_id, ders_id).',
      'Tüm öğrencilerin aldığı dersleri listele (INNER JOIN).',
      'Bir öğrencinin kayıtlı olduğu dersleri listele. Dersi olmayan öğrencileri de göster (LEFT JOIN).',
    ],
    watch: [
      { label: 'W3Schools – SQL JOIN', url: '#' },
    ],
  },
  {
    id: 't7',
    title: 'Bağlı liste – silme fonksiyonu',
    description: 'Tek yönlü bağlı listede verilen değeri silen fonksiyonu yaz. Önceki düğümü takip etmeyi unutma.',
    course: 'Veri Yapıları',
    courseId: 'veriyapilari',
    type: TASK_TYPE.REVIEW,
    status: TASK_STATUS.DONE,
    due: '2 gün önce',
    priority: 'high',
    estimatedTime: '40 dk',
    tip: 'prev ve curr pointer kullan; curr silinecek düğümü göstersin. prev->next = curr->next. Head siliniyorsa head\'i güncelle.',
    steps: [
      'Liste boş mu kontrol et. Silinecek değer head\'de mi kontrol et.',
      'prev ve curr ile listeyi tara; curr değeri bulunca prev->next = curr->next.',
      'Bellek sızıntısı olmaması için (C/C++) free/delete kullan.',
    ],
    watch: [
      { label: 'GeeksforGeeks – Linked list deletion', url: '#' },
      { label: 'Visualgo – Linked List', url: '#' },
    ],
  },
  {
    id: 't8',
    title: 'Quick sort pivot seçimi – kısa araştırma',
    description: 'İlk/son/orta eleman ve rastgele pivot seçiminin zaman karmaşıklığına etkisini 1 paragrafta özetle.',
    course: 'Algoritmalar',
    courseId: 'algoritmalar',
    type: TASK_TYPE.RESEARCH,
    status: TASK_STATUS.TODO,
    due: '4 gün',
    priority: 'low',
    estimatedTime: '20 dk',
    tip: 'Kötü pivot (min/max gibi) seçilirse O(n²); ortalama iyi pivotla O(n log n). Rastgele pivot pratikte iyi sonuç verir.',
    steps: [
      'Quick sort\'ta pivot seçim stratejilerini araştır.',
      'En kötü durum (zaten sıralı dizi + ilk eleman pivot) neden O(n²) olur kısaca yaz.',
    ],
    watch: [
      { label: 'GeeksforGeeks – QuickSort', url: '#' },
    ],
  },
  {
    id: 't9',
    title: 'Normalizasyon – 1NF ve 2NF örnek',
    description: 'Öneri: Sınavda çıkabilir. Tekrarlayan sütunları olan bir tabloyu 1NF ve 2NF\'e uygun hale getir.',
    course: 'Veritabanı Yönetim Sistemleri',
    courseId: 'veritabani',
    type: TASK_TYPE.SUGGESTION,
    status: TASK_STATUS.TODO,
    due: '1 hafta',
    priority: 'medium',
    estimatedTime: '25 dk',
    tip: '1NF: her hücre atomik değer. 2NF: 1NF + tam fonksiyonel bağımlılık (anahtarın parçası olmayan alan tüm anahtara bağlı olmalı).',
    steps: [
      'Örnek: Öğrenci(no, ad, ders1, ders2, ders3) → tekrarlayan ders sütunları.',
      '1NF: Kayit(ogrenci_no, ders_kodu) gibi ara tablo; her satırda tek ders.',
      '2NF: Anahtara bağımlılıkları kontrol et; gerekirse tabloyu böl.',
    ],
    watch: [
      { label: 'GeeksforGeeks – Database Normalization', url: '#' },
    ],
  },
]

/** Branşa göre görevleri filtrele (öğretmen görev takibinde kendi dersi). Yazılım Mühendisliği dersleri */
const BRANCH_COURSE_IDS = {
  yazilim: ['prog1', 'veriyapilari', 'algoritmalar', 'veritabani'],
  biyoloji: ['biyoloji1', 'biyoloji2'],
  matematik: ['matematik1', 'matematik2'],
  fizik: ['fizik'],
  kimya: ['kimya'],
}

export function getTasksByBranch(branch) {
  const courseIds = BRANCH_COURSE_IDS[branch] || []
  return GEN_AI_TASKS.filter((t) => t.courseId && courseIds.includes(t.courseId))
}
