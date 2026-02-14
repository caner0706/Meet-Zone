/**
 * Öğrenci Dersler sayfası: derse göre canlı dersler.
 * Yazılım Mühendisliği — her canlı dersin raporu: hocanın anlattıkları, sınavda dikkat, konular, kavramlar, örnekler, kaynakça.
 */
function formatOzetDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Ders id'sine göre canlı ders listesi. Her öğe: { id, title, date, durationMin } + öğrenci rapor alanları */
export const COURSE_LIVE_LESSONS = {
  prog1: [
    {
      id: 'prog1-l1',
      title: 'Değişkenler, veri tipleri ve döngüler',
      date: '2025-02-08',
      durationMin: 45,
      lastDate: '8 Şubat 2025',
      summary: [
        'Hoca programlamanın temel yapı taşlarıyla başladı: değişkenler (int, double, boolean, String) ve operatörler. Atama ve tip dönüşümü kısa örneklerle anlatıldı.',
        'Koşul yapıları (if, else if, else) ve mantıksal operatörler (&&, ||, !) işlendi. Girintileme ve okunabilir kod yazmanın önemi vurgulandı.',
        'for ve while döngüleri: sayaclı ve koşullu tekrar. break ve continue kullanımı. Dizi tanımlama ve döngü ile gezme örnekleri tahtada yazıldı.',
      ],
      teacherHighlights: [
        'Sınavda mutlaka döngü ile dizi işleme (toplam, ortalama, max) istenir; sözdizimine dikkat.',
        'Değişken isimleri anlamlı olsun; tek harfli isimler (i, j döngü hariç) puan kaybettirir.',
        'Döngü koşulunu yanlış yazarsanız sonsuz döngüye girebilirsiniz; önce kaç kez döneceğini düşünün.',
      ],
      topics: [
        { title: 'Değişkenler ve tipler', content: 'int, double, boolean, String. Atama ve operatörler.', details: ['Primitive tipler bellekte doğrudan değer tutar.', 'String metotları: length, substring, equals.'] },
        { title: 'Koşul ve döngüler', content: 'if-else, for, while. Mantıksal operatörler.', details: ['for: başlangıç, koşul, güncelleme. while: koşul başta.', 'Dizi + for: indeks 0\'dan başlar, length kullanın.'] },
      ],
      keyTerms: [
        { term: 'Değişken', definition: 'Bellekte bir değeri tutan, isimlendirilmiş alan.' },
        { term: 'Döngü', definition: 'Koşul sağlanana kadar tekrarlanan kod bloğu.' },
      ],
      examples: [
        { title: 'Ortalama', desc: 'Dizi elemanlarını topla, eleman sayısına böl; double kullan.' },
        { title: 'Maksimum', desc: 'Dizide gezerken şu ana kadarki en büyük değeri tutan değişken güncellenir.' },
      ],
      references: [
        { topic: 'Programlama temelleri', items: ['Java: How to Program (Deitel)', 'GeeksforGeeks – Arrays'] },
      ],
    },
    {
      id: 'prog1-l2',
      title: 'Fonksiyonlar ve parametreler',
      date: '2025-02-05',
      durationMin: 40,
      lastDate: '5 Şubat 2025',
      summary: [
        'Fonksiyonların (metotların) neden kullanıldığı: tekrarı azaltma, modülerlik. İmza: isim, parametre listesi, dönüş tipi.',
        'Parametre geçişi: primitive tipler değer ile (kopya), nesneler referans ile. void = dönüş yok.',
        'Dizi parametre olarak geçirme ve return ile döndürme. Scope (kapsam) kavramı kısaca anlatıldı.',
      ],
      teacherHighlights: [
        'Parametre geçişinde primitive = kopya, nesne = referans; sınavda karıştırılıyor.',
        'Fonksiyon adı ve parametre tipleri eşleşmeli; overload farklı imzalar demek.',
      ],
      topics: [
        { title: 'Fonksiyon tanımlama', content: 'İmza, parametreler, return.', details: ['Base case ve recursive case (sonraki hafta).'] },
        { title: 'Parametre ve scope', content: 'Değer ile / referans ile. Yerel değişken.', details: [] },
      ],
      keyTerms: [
        { term: 'Parametre', definition: 'Fonksiyona dışarıdan verilen girdi.' },
        { term: 'void', definition: 'Dönüş değeri olmayan fonksiyon tipi.' },
      ],
      examples: [
        { title: 'Toplam fonksiyonu', desc: 'Dizi ve uzunluk alır, elemanların toplamını döndürür.' },
      ],
      references: [
        { topic: 'Fonksiyonlar', items: ['Khan Academy – Methods', 'W3Schools – Functions'] },
      ],
    },
    {
      id: 'prog1-l3',
      title: 'Diziler ve çok boyutlu diziler',
      date: '2025-02-01',
      durationMin: 38,
      lastDate: '1 Şubat 2025',
      summary: [
        'Dizi tanımlama, indeksleme, length. Döngü ile toplam, ortalama, max/min bulma tekrar edildi.',
        'Çok boyutlu dizi (matris): satır ve sütun. İç içe döngü ile gezme. Matris toplama örneği çözüldü.',
        'Sonraki hafta nesne yönelimli programlamaya (sınıf, nesne, constructor) geçileceği söylendi.',
      ],
      teacherHighlights: [
        'Çok boyutlu dizide önce satır sonra sütun indeksi; [i][j] sırası karıştırılmasın.',
        'Dizi sınırları: indeks 0..length-1; sınır dışı erişim hata verir.',
      ],
      topics: [
        { title: 'Tek boyutlu dizi', content: 'Tanımlama, erişim, döngü ile işleme.', details: [] },
        { title: 'Çok boyutlu dizi', content: 'Matris, iç içe döngü.', details: [] },
      ],
      keyTerms: [
        { term: 'Dizi', definition: 'Aynı tipte elemanların indeksle erişilen sıralı yapısı.' },
        { term: 'İndeks', definition: 'Dizi elemanına erişmek için kullanılan 0’dan başlayan sayı.' },
      ],
      examples: [
        { title: 'Matris toplama', desc: 'İki matrisin aynı indeksteki elemanlarını topla, sonucu üçüncü matrise yaz.' },
      ],
      references: [
        { topic: 'Diziler', items: ['GeeksforGeeks – Arrays', 'MEB Programlama I notları'] },
      ],
    },
  ],
  veriyapilari: [
    {
      id: 'vy-l1',
      title: 'Bağlı liste (linked list)',
      date: '2025-01-28',
      durationMin: 45,
      lastDate: '28 Ocak 2025',
      summary: [
        'Bağlı listenin tanımı: düğüm (data + next), head. Dizi ile karşılaştırma: ekleme/silme başta O(1), ortada/sonda erişim için gezinme gerekir.',
        'Başa ve sona ekleme adımları tahtada çizildi. Silme: önceki düğümün next’ini güncelleme vurgulandı.',
        'Çift yönlü bağlı liste (prev, next) kısaca anlatıldı. Ödev: tek yönlü listede arama ve silme fonksiyonu yazılacak.',
      ],
      teacherHighlights: [
        'Silmek için önceki düğüme ihtiyaç var; tek yönlü listede iki pointer (prev, curr) kullanın.',
        'Head null ise liste boş; başa eklerken yeni düğümün next = head, head = yeni.',
      ],
      topics: [
        { title: 'Düğüm yapısı', content: 'data, next. head pointer.', details: [] },
        { title: 'Ekleme ve silme', content: 'Başa/sona ekleme. Düğüm silme ve next güncelleme.', details: [] },
      ],
      keyTerms: [
        { term: 'Bağlı liste', definition: 'Düğümlerin next (ve istenirse prev) ile birbirine bağlı olduğu yapı.' },
        { term: 'Head', definition: 'Listenin ilk düğümünü gösteren pointer.' },
      ],
      examples: [
        { title: 'Başa ekleme', desc: 'yeni->next = head; head = yeni; O(1).' },
        { title: 'Silme', desc: 'prev->next = curr->next; curr artık listeden çıkar.' },
      ],
      references: [
        { topic: 'Bağlı liste', items: ['CLRS – Linked lists', 'Visualgo – Linked List'] },
      ],
    },
    {
      id: 'vy-l2',
      title: 'Yığıt (stack) ve kuyruk (queue)',
      date: '2025-01-25',
      durationMin: 42,
      lastDate: '25 Ocak 2025',
      summary: [
        'Yığıt: LIFO. push (ekleme), pop (çıkarma). Dizi veya bağlı liste ile uygulama. Parantez eşleştirme örneği.',
        'Kuyruk: FIFO. enqueue (kuyruğa ekleme), dequeue (baştan çıkarma). Yazıcı kuyruğu, BFS’te kullanım.',
        'İki yığıt ile kuyruk implementasyonu (optional) kısaca gösterildi.',
      ],
      teacherHighlights: [
        'Yığıtta sadece üstten erişim; kuyrukta kuyruğa ekleme, baştan çıkarma.',
        'Parantez eşleştirmede açan parantezi yığıta at, kapandığında üstteki eşleşmeli.',
      ],
      topics: [
        { title: 'Yığıt', content: 'push, pop. LIFO. Uygulama.', details: [] },
        { title: 'Kuyruk', content: 'enqueue, dequeue. FIFO.', details: [] },
      ],
      keyTerms: [
        { term: 'LIFO', definition: 'Last In First Out — son giren ilk çıkar.' },
        { term: 'FIFO', definition: 'First In First Out — ilk giren ilk çıkar.' },
      ],
      examples: [
        { title: 'Parantez eşleştirme', desc: 'Açan parantezleri yığıta at; kapandığında pop ile eşleştir.' },
      ],
      references: [
        { topic: 'Stack ve Queue', items: ['GeeksforGeeks – Stack', 'GeeksforGeeks – Queue'] },
      ],
    },
  ],
  algoritmalar: [
    {
      id: 'alg-l1',
      title: 'Big-O ve karmaşıklık analizi',
      date: '2025-01-24',
      durationMin: 45,
      lastDate: '24 Ocak 2025',
      summary: [
        'Algoritma analizi: zaman ve bellek. Büyük O (Big-O) — en kötü durumda üst sınır. O(1), O(log n), O(n), O(n²) örnekleri.',
        'Sabit çarpan ve düşük dereceli terimlerin atılması. Döngü sayısına göre tahmin: tek döngü O(n), iç içe iki döngü O(n²).',
        'Omega ve Theta kısaca. Ödev: verilen kod parçasının Big-O’sunu yazma.',
      ],
      teacherHighlights: [
        'Big-O’da sadece baskın terim kalır; 5n² + 3n + 2 → O(n²).',
        'İç içe döngülerde iç döngü n kez, dış döngü n kez → O(n²).',
      ],
      topics: [
        { title: 'Big-O notasyonu', content: 'Üst sınır, baskın terim.', details: [] },
        { title: 'Yaygın karmaşıklıklar', content: 'O(1), O(log n), O(n), O(n log n), O(n²).', details: [] },
      ],
      keyTerms: [
        { term: 'Big-O', definition: 'Algoritmanın büyüklük arttıkça üst sınır davranışı.' },
        { term: 'En kötü durum', definition: 'Algoritmanın en çok iş yaptığı girdi senaryosu.' },
      ],
      examples: [
        { title: 'Doğrusal arama', desc: 'Dizide sırayla bak; en kötü durumda n karşılaştırma → O(n).' },
        { title: 'İkili arama', desc: 'Her adımda yarıya in; O(log n).' },
      ],
      references: [
        { topic: 'Karmaşıklık', items: ['CLRS – Growth of Functions', 'Khan Academy – Big-O'] },
      ],
    },
    {
      id: 'alg-l2',
      title: 'Merge sort ve Quick sort',
      date: '2025-01-22',
      durationMin: 48,
      lastDate: '22 Ocak 2025',
      summary: [
        'Böl ve yönet: merge sort. Bölme (ortadan ikiye), sıralı parçaları birleştirme. Birleştirme O(n), toplam O(n log n).',
        'Quick sort: pivot seçimi (ilk, son veya orta), parçalama (küçükler sola, büyükler sağa), özyineleme. Ortalama O(n log n), kötü pivotla O(n²).',
        'Karşılaştırma: merge sort ek bellek kullanır, quick sort yerinde (in-place) yapılabilir.',
      ],
      teacherHighlights: [
        'Merge sort her zaman O(n log n); quick sort pivot seçimine bağlı.',
        'Merge’de iki sıralı diziyi baştan karşılaştırarak birleştirin; O(n).',
      ],
      topics: [
        { title: 'Merge sort', content: 'Böl, sırala, birleştir. O(n log n).', details: [] },
        { title: 'Quick sort', content: 'Pivot, parçalama, özyineleme.', details: [] },
      ],
      keyTerms: [
        { term: 'Böl ve yönet', definition: 'Problemi küçük alt problemlere bölüp sonuçları birleştirme.' },
        { term: 'Pivot', definition: 'Quick sort’ta diziyi iki parçaya ayırmak için seçilen eleman.' },
      ],
      examples: [
        { title: 'Merge birleştirme', desc: 'İki sıralı diziyi tek sıralı yap; her adımda iki baştan küçük olanı al.' },
      ],
      references: [
        { topic: 'Sıralama', items: ['Visualgo – Merge Sort', 'Visualgo – Quick Sort'] },
      ],
    },
  ],
  veritabani: [
    {
      id: 'vt-l1',
      title: 'İlişkisel model ve SQL giriş',
      date: '2025-01-22',
      durationMin: 45,
      lastDate: '22 Ocak 2025',
      summary: [
        'İlişkisel model: tablolar, satırlar, sütunlar. Primary key (benzersiz, NULL olmaz), foreign key (referans).',
        'SQL: SELECT sütunlar FROM tablo WHERE koşul. AND, OR, LIKE, IN. ORDER BY ve LIMIT. COUNT, SUM, AVG örnekleri.',
        'Çoklu tablo: INNER JOIN ve LEFT JOIN. ON ile birleşim koşulu. Örnek: öğrenci ve kayıt tabloları.',
      ],
      teacherHighlights: [
        'Primary key her satırı benzersiz tanımlar. Foreign key başka tablonun PK’ine referans.',
        'JOIN’de hangi tabloların birleşeceği ve ON koşulu doğru yazılmalı; sınavda sorgu çıkar.',
      ],
      topics: [
        { title: 'İlişkisel model', content: 'Tablo, PK, FK. Bire-bir, bire-çok.', details: [] },
        { title: 'SELECT ve JOIN', content: 'WHERE, ORDER BY. INNER JOIN, LEFT JOIN.', details: [] },
      ],
      keyTerms: [
        { term: 'Primary key', definition: 'Tabloda her satırı benzersiz tanımlayan alan.' },
        { term: 'JOIN', definition: 'İki tabloyu ortak alana göre birleştirme.' },
      ],
      examples: [
        { title: 'Öğrenci–Ders', desc: 'Kayit tablosu: öğrenci_id, ders_id; N-N ilişki ara tabloyla.' },
        { title: 'LEFT JOIN', desc: 'Sol tablodaki tüm satırlar kalır; sağda eşleşme yoksa NULL.' },
      ],
      references: [
        { topic: 'SQL', items: ['W3Schools – SQL', 'PostgreSQL Tutorial'] },
      ],
    },
  ],
}

export { formatOzetDate }
