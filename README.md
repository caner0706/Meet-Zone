# Meet Zone — React

Meet Zone uygulamasının React (Vite + React Router) sürümü.

## Tek tıkla başlatma

- **macOS:** `start.command` dosyasına çift tıklayın. Terminal açılır, uygulama başlar ve tarayıcı otomatik açılır.
- **Windows:** `start.bat` dosyasına çift tıklayın. Uygulama başlar ve tarayıcı açılır.

İlk kullanımda önce bir kez `npm install` çalıştırmanız gerekir.

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm start
```

veya `npm run dev`. Tarayıcıda http://localhost:5173 açılır (npm start ile otomatik açılır). Giriş sayfasından e-posta/şifre ile (herhangi bir değer) giriş yapıp dashboard'a yönlendirilirsiniz.

## Build

```bash
npm run build
```

Çıktı: `dist/`

## Yapı

- **`/`** — Giriş sayfası
- **`/dashboard`** — Genel bakış (özet)
- **`/dashboard/decisions`** — Kararlar
- **`/dashboard/emails`** — Mail şablonları
- **`/dashboard/tasks`** — Görev kartları
- **`/dashboard/report`** — Toplantı raporu
- **`/dashboard/live`** — Canlı toplantı
- **`/dashboard/participants`** — Katılımcılar
- **`/dashboard/participants/:id`** — Katılımcı detay
- **`/dashboard/engagement-timeline`** — Engagement zaman çizelgesi
- **`/dashboard/topics`** — Konu & gündem
- **`/dashboard/insights`** — İçgörüler
- **`/dashboard/avatar`** — AI Avatar
- **`/dashboard/compare`** — Karşılaştır
- **`/dashboard/settings`** — Ayarlar

Giriş durumu `localStorage` (`sense_demo`) ile tutulur. Çıkış yapınca ana sayfaya yönlendirilirsiniz.
