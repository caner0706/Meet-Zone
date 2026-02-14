# GitHub Workflow Tetikleyici Kurulumu

HF'e yükleme bittikten hemen sonra GitHub repo'nuzdaki workflow tetiklenir.

## 1. .env Ayarları

`.env` dosyasında:

```
GITHUB_TOKEN=<GITHUB_PERSONAL_ACCESS_TOKEN_BURAYA>
GITHUB_REPO=KULLANICI_ADINIZ/REPO_ADINIZ
```

`GITHUB_REPO` değerini HF verisini kullanan GitHub repo'nuzla değiştirin (örn: `Caner7/sense-data-processor`).

## 2. GitHub Repo'da Workflow

HF verisini kullanan repo'nuzda `.github/workflows/` klasörüne bu dosyayı ekleyin:

**`.github/workflows/sense-trigger.yml`**

```yaml
name: Sense Upload Trigger

on:
  repository_dispatch:
    types: [hf_dataset_update]

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Payload bilgisi
        run: |
          echo "Meeting folder: ${{ github.event.client_payload.meeting_folder }}"
          echo "File path: ${{ github.event.client_payload.file_path }}"
          echo "File type: ${{ github.event.client_payload.file_type }}"
          echo "Dataset: ${{ github.event.client_payload.dataset_repo }}"

      # Buraya HF'ten veri çekme ve işleme adımlarınızı ekleyin
      # - name: HF'ten veri indir
      #   run: ...
```

## 3. Payload Alanları

Workflow tetiklendiğinde `github.event.client_payload` içinde:

| Alan | Açıklama |
|------|----------|
| `meeting_folder` | Toplantı klasörü (örn: `hf1_2026-02-08`) |
| `file_path` | HF'teki tam dosya yolu (örn: `Toplantı Kayıtları/hf1_2026-02-08/demo1.webm`) |
| `file_type` | `recording` veya `summary` |
| `dataset_repo` | HF dataset adı (örn: `Caner7/Sense-AI`) |

## 4. Tetiklenme Zamanı

- Her **kayıt** (demo1.webm, demo2.webm, toplanti_sesi.webm) HF'e yüklendiğinde
- **Özet** (toplanti_ozeti.txt) yüklendiğinde

Her yükleme sonrası ayrı bir workflow çalışır. Toplantı başına tek tetikleme istiyorsanız, workflow içinde `file_type == 'summary'` kontrolü yapabilirsiniz.

**Not:** Tetikleme başarılı olursa sunucu logunda `GitHub workflow tetiklendi:` görünür. Başarısız olursa (401/404/422 vb.) `GitHub tetikleyici başarısız: [status] [response]` yazılır. Sadece **HTTP 204** dönünce workflow tetiklenir.
