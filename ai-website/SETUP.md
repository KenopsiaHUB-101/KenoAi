# Setup KenoAi di Termux

Panduan ini untuk menjalankan server production pada device pemilik repo. Build frontend dilakukan di `/workspace/build-temp/`, bukan di folder repo.

## Prasyarat

- Android + Termux.
- Node.js 18 atau lebih baru.
- Git.
- API key OpenRouter.
- Google OAuth Client ID untuk build frontend.

## Ambil source

```bash
git clone https://github.com/KenopsiaHUB-101/KenoAi.git
cd KenoAi/ai-website
git pull origin main
```

Jangan menjalankan `npm install` di repo ini. `node_modules` yang sudah ada disiapkan untuk environment Termux/Android pemilik repo.

## Environment server

Buat `ai-website/.env` secara lokal dan jangan commit file ini:

```bash
OPENROUTER_API_KEY=your_openrouter_key
KENOAI_GITHUB_TOKEN=your_github_token
PORT=5000

# Multi-user Supabase (server only)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

`KENOAI_GITHUB_TOKEN` opsional. API key OpenRouter wajib untuk chat.

## Supabase multi-user

1. Buat project di Supabase.
2. Buka SQL Editor dan jalankan `supabase/schema.sql`.
3. Ambil Project URL dan service role key dari Supabase Settings > API.
4. Simpan keduanya di `.env` server. Service role key tidak boleh masuk source code, browser, atau variable `VITE_*`.
5. Isi `GOOGLE_CLIENT_ID` dengan client ID Google OAuth yang sama dengan client ID frontend.
6. Restart server dan cek `http://localhost:5000/api/health`; `cloudAuth` harus bernilai `true`.

Saat Supabase aktif, server memverifikasi Google credential, membuat mapping user di `app_users`, dan menyimpan snapshot workspace pada `workspace_snapshots`. Saat Supabase tidak tersedia, aplikasi tetap memakai local mode.

## Menjalankan server

```bash
cd ai-website
npm run start
```

Buka `http://localhost:5000`. Untuk testing gunakan port `5001`, `5098`, atau `5099`, bukan port production.

## Build frontend

Build harus dilakukan dari sandbox eksternal yang memiliki dependency x86:

```bash
cd /workspace/build-temp
rm -rf src dist public
cp -r /workspaces/KenoAi/ai-website/src .
cp -r /workspaces/KenoAi/ai-website/public .
cp /workspaces/KenoAi/ai-website/index.html /workspaces/KenoAi/ai-website/package.json .
# Pastikan /workspace/build-temp/.env memiliki VITE_GOOGLE_CLIENT_ID
npm run build
rm -rf /workspaces/KenoAi/ai-website/dist
cp -r dist /workspaces/KenoAi/ai-website/dist
```

Jangan mengedit `dist/` secara manual. Setelah build, commit source dan hasil build sesuai workflow repository.

## Google OAuth

Di Google Cloud Console, buat OAuth Client ID tipe Web application. Tambahkan origin yang digunakan, misalnya:

```text
http://localhost:5000
```

Nilai client ID hanya dipakai sebagai `VITE_GOOGLE_CLIENT_ID` saat build. Jangan menaruh API key server di variable `VITE_*` karena variable tersebut akan masuk ke browser.

## Pemeriksaan

```bash
cd /workspaces/KenoAi/ai-website
node --check server.js
git diff --check
npm test
```

Endpoint diagnosis:

```text
GET /api/health
GET /api/models
```

Backup workspace dapat dibuat atau dipulihkan dari menu aplikasi melalui `Export workspace backup` dan `Import workspace backup`.

Jika chat gagal, periksa `OPENROUTER_API_KEY` di `.env`, status endpoint `/api/health`, dan pesan fallback model di UI. Jangan mencetak nilai secret ketika debugging.
