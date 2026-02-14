/**
 * Öğrenci için katıldığı dersler ve detaylı ders özeti (hocanın anlattıkları).
 * Yazılım Mühendisliği öğrencisi — gerçek uygulamada API'den gelir.
 */
export const STUDENT_COURSES = [
  { id: 'prog1', name: 'Programlama I', code: 'BIL101' },
  { id: 'veriyapilari', name: 'Veri Yapıları', code: 'BIL201' },
  { id: 'algoritmalar', name: 'Algoritmalar', code: 'BIL202' },
  { id: 'veritabani', name: 'Veritabanı Yönetim Sistemleri', code: 'BIL301' },
]

export const COURSE_SUMMARIES = {
  prog1: {
    courseName: 'Programlama I',
    lastDate: '28 Ocak 2025',
    summary: [
      'Hoca derse programlamanın temel yapı taşlarıyla başladı: değişkenler, veri tipleri ve operatörler. Java/C benzeri sözdiziminde int, double, boolean ve String kullanımını tahtada örnekledi.',
      'Koşul yapıları (if, else if, else) ve döngüler (for, while) işlendi. Girintileme ve okunabilir kod yazmanın önemi vurgulandı. Switch-case ile çoklu dallanma anlatıldı.',
      'Fonksiyonların (metotların) neden kullanıldığı: tekrarı azaltma, modülerlik ve test edilebilirlik. Parametre geçişi (değer ile / referans ile) kısa örneklerle gösterildi.',
      'Diziler (array): tanımlama, indeksleme, döngü ile gezme. Çok boyutlu dizilere kısa giriş yapıldı. Sonraki hafta nesne yönelimli programlamaya geçileceği söylendi.',
    ],
    teacherHighlights: [
      'Sınavda mutlaka döngü ile dizi işleme ve basit bir fonksiyon yazma istenir; sözdizimine dikkat.',
      'Parametre geçişinde: primitive tipler kopya ile, nesneler referans ile gider; karıştırmayın.',
      'Kod okunabilirliği için anlamlı değişken isimleri ve girintileme sınavda puan getirir.',
    ],
    topics: [
      {
        title: 'Değişkenler ve veri tipleri',
        content: 'int, double, boolean, String. Atama, operatörler ve tip dönüşümü.',
        details: [
          'Primitive tipler: sayısal (int, double), mantıksal (boolean). Bellekte doğrudan değer tutulur.',
          'String: karakter dizisi; metotlar (length, substring, equals) kullanımı.',
          'Tip dönüşümü: genişletme otomatik, daraltma (cast) dikkatli yapılmalı.',
        ],
      },
      {
        title: 'Koşul ve döngüler',
        content: 'if-else, for, while. Mantıksal operatörler (&&, ||, !).',
        details: [
          'if-else: tek ve çoklu dallanma. Switch-case ile sabit değerlere göre seçim.',
          'for: sayaclı döngü; başlangıç, koşul, güncelleme. while: koşul başta kontrol.',
          'break ve continue: döngüden çıkış veya tur atlama.',
        ],
      },
      {
        title: 'Fonksiyonlar ve diziler',
        content: 'Metot tanımlama, parametreler, return. Dizi tanımlama ve kullanım.',
        details: [
          'Fonksiyon imzası: isim, parametre listesi, dönüş tipi. void = dönüş yok.',
          'Dizi: aynı tipte elemanların sıralı koleksiyonu; indeks 0’dan başlar.',
          'Dizi + döngü: toplam, ortalama, max/min bulma klasik örnekler.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Değişken', definition: 'Bellekte bir değeri tutan, isimlendirilmiş alan.' },
      { term: 'Parametre', definition: 'Fonksiyona dışarıdan verilen girdi; fonksiyon imzasında tanımlanır.' },
      { term: 'Dizi (array)', definition: 'Aynı tipte elemanların indeksle erişilen sıralı yapısı.' },
      { term: 'Döngü', definition: 'Belirli koşul sağlanana kadar tekrarlanan kod bloğu (for, while).' },
    ],
    examples: [
      { title: 'Ortalama hesaplama', desc: 'Dizi elemanlarını döngüyle toplayıp eleman sayısına böl; double kullan.' },
      { title: 'Maksimum bulma', desc: 'Dizide gezerken şu ana kadarki en büyük değeri tutan değişken güncellenir.' },
    ],
    references: [
      { topic: 'Programlama temelleri', items: ['Java: How to Program (Deitel)', 'Python için: Automate the Boring Stuff'] },
      { topic: 'Diziler ve döngüler', items: ['Khan Academy – Programming', 'GeeksforGeeks – Arrays'] },
    ],
  },
  veriyapilari: {
    courseName: 'Veri Yapıları',
    lastDate: '25 Ocak 2025',
    summary: [
      'Hoca veri yapılarının neden önemli olduğunu anlattı: doğru yapı seçimi zaman ve bellek maliyetini doğrudan etkiler. Soyut veri tipi (ADT) ile uygulama ayrımı vurgulandı.',
      'Bağlı liste (linked list) işlendi: düğüm (node), next pointer, head. Eleman ekleme/silme O(1) (başa) vs dizide kaydırma ihtiyacı karşılaştırıldı. Tek yönlü ve çift yönlü liste kısaca anlatıldı.',
      'Yığıt (stack) ve kuyruk (queue): LIFO ve FIFO davranışı. Dizi veya bağlı liste ile uygulama. Parantez eşleştirme ve BFS/DFS’te kullanım örnekleri verildi.',
      'Ağaç yapısına giriş: kök, yaprak, parent/child. İkili ağaç (binary tree) ve ikili arama ağacı (BST) tanımı. Inorder, preorder, postorder gezinme sıraları tahtada çizildi.',
    ],
    teacherHighlights: [
      'BST’de sol alt ağaç < kök < sağ alt ağaç; sınavda ağaç çizimi veya gezinme sırası istenir.',
      'Yığıtta sadece üstten ekleme/çıkarma (push/pop); kuyrukta kuyruğa ekleme, baştan çıkarma.',
      'Bağlı listede eleman silerken önceki düğümün next’ini güncellemeyi unutmayın.',
    ],
    topics: [
      {
        title: 'Bağlı liste',
        content: 'Düğüm yapısı, head, ekleme/silme. Tek ve çift yönlü liste.',
        details: [
          'Her düğüm: data + next (ve istenirse prev). Head boşsa liste boş.',
          'Başa ekleme: yeni düğümün next = head, head = yeni. O(1).',
          'Sonda ekleme: son düğüme kadar git, son->next = yeni. O(n).',
        ],
      },
      {
        title: 'Yığıt ve kuyruk',
        content: 'Stack (LIFO): push, pop. Queue (FIFO): enqueue, dequeue.',
        details: [
          'Yığıt: son giren ilk çıkar; parantez eşleştirme, geri al (undo) örnekleri.',
          'Kuyruk: ilk giren ilk çıkar; yazıcı kuyruğu, BFS.',
          'Uygulama: dizi (sabit kapasite) veya bağlı liste.',
        ],
      },
      {
        title: 'İkili arama ağacı (BST)',
        content: 'Kök, sol/sağ alt ağaç. Ekleme, arama. Inorder/preorder/postorder.',
        details: [
          'Sol alt ağaçtaki tüm değerler < kök < sağ alt ağaçtaki tüm değerler.',
          'Inorder (sol-kök-sağ): sıralı çıktı verir. Preorder: kök-sol-sağ. Postorder: sol-sağ-kök.',
          'Arama: kökle karşılaştır, küçükse sola, büyükse sağa in. O(h), h = yükseklik.',
        ],
      },
    ],
    keyTerms: [
      { term: 'ADT (Soyut veri tipi)', definition: 'Davranışı tanımlı, uygulama detayı gizli veri yapısı.' },
      { term: 'LIFO', definition: 'Last In First Out — yığıtta son eklenen ilk çıkar.' },
      { term: 'FIFO', definition: 'First In First Out — kuyrukta ilk eklenen ilk çıkar.' },
      { term: 'BST', definition: 'İkili arama ağacı; her düğümde sol < kök < sağ.' },
    ],
    examples: [
      { title: 'Parantez eşleştirme', desc: 'Yığıta açan parantezleri at; kapandığında üstteki eşleşmeli, değilse hata.' },
      { title: 'Inorder gezinme', desc: 'BST’de inorder gezinme sıralı (küçükten büyüğe) listeyi verir.' },
    ],
    references: [
      { topic: 'Veri yapıları', items: ['Introduction to Algorithms (CLRS)', 'GeeksforGeeks – Data Structures'] },
      { topic: 'Ağaçlar', items: ['MIT 6.006 – Binary Search Trees', 'Visualgo – BST'] },
    ],
  },
  algoritmalar: {
    courseName: 'Algoritmalar',
    lastDate: '24 Ocak 2025',
    summary: [
      'Hoca algoritma analizine giriş yaptı: zaman ve bellek karmaşıklığı. Büyük O (Big-O) notasyonu — en kötü durumda üst sınır. O(1), O(log n), O(n), O(n²) örnekleri verildi.',
      'Arama ve sıralama: doğrusal arama O(n), ikili arama O(log n). Kabarcık sıralama (bubble sort) ve seçmeli sıralama (selection sort) adım adım tahtada çizildi; her ikisi de O(n²).',
      'Böl ve yönet (divide and conquer): merge sort ve quick sort. Merge sort’ta bölme, birleştirme ve O(n log n) garantisi. Quick sort’ta pivot seçimi ve parçalama anlatıldı.',
      'Özyineleme (recursion): temel durum (base case) ve özyinelemeli adım. Faktöriyel ve Fibonacci örnekleri. Call stack kavramı kısaca değinildi.',
    ],
    teacherHighlights: [
      'Big-O’da sabit çarpan ve düşük dereceli terimler atılır; sadece baskın terim kalır.',
      'Merge sort her zaman O(n log n); quick sort ortalama O(n log n), kötü pivotla O(n²).',
      'Özyinelemede base case mutlaka olmalı; yoksa sonsuz çağrı ve stack overflow.',
    ],
    topics: [
      {
        title: 'Karmaşıklık analizi',
        content: 'Big-O, Omega, Theta. En iyi/ortalama/en kötü durum.',
        details: [
          'Big-O: üst sınır; “en fazla bu kadar yavaş” anlamında.',
          'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n).',
          'Döngü sayısı ve iç işlemler: iç içe iki döngü genelde O(n²).',
        ],
      },
      {
        title: 'Sıralama algoritmaları',
        content: 'Bubble, selection, insertion. Merge sort ve quick sort.',
        details: [
          'Bubble/selection/insertion: O(n²). Küçük n veya neredeyse sıralı veride kullanılabilir.',
          'Merge sort: böl, sırala, birleştir. Birleştirme O(n), toplam O(n log n).',
          'Quick sort: pivot seç, küçükleri sola büyükleri sağa at, özyineleme. Pivot ortadaysa O(n log n).',
        ],
      },
      {
        title: 'Özyineleme',
        content: 'Base case, recursive case. Call stack ve bellek.',
        details: [
          'Base case: daha küçük çağrı yapılmadan dönen durum.',
          'Recursive case: kendini daha küçük girdiyle çağırma.',
          'Fibonacci, faktöriyel, ağaç gezinme örnekleri.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Big-O notasyonu', definition: 'Algoritmanın büyüklük (n) arttıkça üst sınır davranışı.' },
      { term: 'Böl ve yönet', definition: 'Problemi küçük alt problemlere bölüp sonuçları birleştirme stratejisi.' },
      { term: 'Özyineleme', definition: 'Fonksiyonun kendini (daha küçük girdiyle) çağırması.' },
      { term: 'Pivot', definition: 'Quick sort’ta diziyi iki parçaya ayırmak için seçilen eleman.' },
    ],
    examples: [
      { title: 'İkili arama', desc: 'Sıralı dizide ortadaki elemana bak; küçükse sol yarıya, büyükse sağ yarıya git. O(log n).' },
      { title: 'Merge sort birleştirme', desc: 'İki sıralı diziyi baştan karşılaştırarak tek sıralı dizi oluştur; O(n).' },
    ],
    references: [
      { topic: 'Karmaşıklık', items: ['CLRS – Chapter 3 (Growth of Functions)', 'Khan Academy – Big-O'] },
      { topic: 'Sıralama', items: ['Visualgo – Sorting', 'GeeksforGeeks – Sorting Algorithms'] },
    ],
  },
  veritabani: {
    courseName: 'Veritabanı Yönetim Sistemleri',
    lastDate: '22 Ocak 2025',
    summary: [
      'Hoca veritabanı kavramını anlattı: kalıcı, tutarlı ve yapılandırılmış veri saklama. İlişkisel model: tablolar, satırlar (kayıtlar), sütunlar (alanlar). Primary key ve foreign key tanımı yapıldı.',
      'SQL giriş: SELECT, FROM, WHERE. Temel sorgulama örnekleri tahtada yazıldı. ORDER BY, LIMIT ve basit aggregate fonksiyonları (COUNT, SUM, AVG) işlendi.',
      'Çoklu tablo: JOIN türleri (INNER, LEFT, RIGHT). İlişki üzerinden sorgulama örnekleri. Normalizasyon kavramına kısa giriş: tekrarları azaltma, 1NF ve 2NF özetlendi.',
      'INSERT, UPDATE, DELETE ile veri ekleme/güncelleme/silme. Transaction kavramı: atomiklik ve tutarlılık. Bir sonraki hafta tasarım projesi verileceği duyuruldu.',
    ],
    teacherHighlights: [
      'Primary key: benzersiz ve NULL olmaz. Foreign key: başka tablonun primary key’ine referans.',
      'JOIN’de hangi tabloların birleşeceği ve koşul (ON) doğru yazılmalı; sınavda sorgu yazımı çıkar.',
      'Normalizasyonda tekrarlayan veriyi ayrı tabloya taşıyın; 1NF: atomik değerler, 2NF: tam fonksiyonel bağımlılık.',
    ],
    topics: [
      {
        title: 'İlişkisel model',
        content: 'Tablo, satır, sütun. Primary key, foreign key, bire-bir ve bire-çok ilişki.',
        details: [
          'Her tabloda bir primary key olmalı; benzersiz tanımlayıcı.',
          'Foreign key: referans bütünlüğü; silme/güncelleme kuralları (CASCADE, SET NULL).',
          'ER diyagramı: varlık, ilişki, kardinalite (1-1, 1-N, N-N).',
        ],
      },
      {
        title: 'SQL sorgulama',
        content: 'SELECT, WHERE, ORDER BY, JOIN. Aggregate fonksiyonlar ve GROUP BY.',
        details: [
          'SELECT sütunlar FROM tablo WHERE koşul. AND, OR, LIKE, IN, BETWEEN.',
          'JOIN: INNER (kesişim), LEFT (sol tablodaki tüm satırlar). ON ile birleşim koşulu.',
          'COUNT, SUM, AVG, MAX, MIN. GROUP BY ile gruplara göre toplam/ortalama.',
        ],
      },
      {
        title: 'Veri güncelleme ve transaction',
        content: 'INSERT, UPDATE, DELETE. Transaction: BEGIN, COMMIT, ROLLBACK.',
        details: [
          'INSERT INTO tablo (sütunlar) VALUES (değerler). UPDATE tablo SET sütun = değer WHERE koşul.',
          'DELETE FROM tablo WHERE koşul. WHERE unutulursa tüm satırlar etkilenir.',
          'Transaction: ya hepsi uygulanır ya hiçbiri; tutarlılık için kritik.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Primary key', definition: 'Tabloda her satırı benzersiz tanımlayan alan; NULL olamaz.' },
      { term: 'Foreign key', definition: 'Başka tablonun primary key’ine referans veren alan.' },
      { term: 'JOIN', definition: 'İki veya daha fazla tabloyu ortak alana göre birleştirme.' },
      { term: 'Normalizasyon', definition: 'Tekrarları ve tutarsızlıkları azaltmak için tabloları yeniden yapılandırma.' },
    ],
    examples: [
      { title: 'Öğrenci–Ders ilişkisi', desc: 'Öğrenci tablosu, Ders tablosu, Kayit tablosu (öğrenci_id, ders_id); N-N ilişki ara tabloyla.' },
      { title: 'LEFT JOIN', desc: 'Sol tablodaki tüm satırlar kalır; sağda eşleşme yoksa NULL gelir.' },
    ],
    references: [
      { topic: 'SQL', items: ['W3Schools – SQL', 'PostgreSQL Tutorial'] },
      { topic: 'Veritabanı tasarımı', items: ['Database System Concepts (Silberschatz)', 'Coursera – Databases'] },
    ],
  },
}
