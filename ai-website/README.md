# KenoAi

KenoAi adalah AI workspace untuk percakapan streaming, project, task, Inbox, file workspace, dan koneksi GitHub. Frontend menggunakan React + Vite, sedangkan backend Express meneruskan request AI ke OpenRouter tanpa mengekspos API key ke browser.

## Fitur saat ini

- Landing page responsif dengan Google OAuth.
- Chat SSE streaming dengan persona Professional, Developer, dan Casual.
- Fallback otomatis ke model gratis saat provider mengembalikan 429 atau 503.
- Riwayat percakapan, pin, rename, export Markdown, retry, dan voice input.
- Workspace Home dengan statistik berbasis data, quick actions, dan Recent Activity.
- Task board dengan tambah, edit, search, filter, due date, priority, drag-and-drop, selesai, dan hapus.
- Inbox dengan notifikasi AI otomatis setelah respons selesai, filter, mark all as read, dan link ke chat terkait.
- Calendar, Reports, workspace files, serta GitHub repository connector.
- Error Boundary untuk recovery ketika komponen React gagal.
- Supabase cloud snapshot untuk multi-user workflow dan local-first fallback.
- Export/import backup workspace JSON berversi.

## Struktur penting

```text
ai-website/
├── server.js          # Express API, OpenRouter relay, GitHub connector
├── index.html         # SPA entry, SEO, social metadata, theme bootstrap
├── public/            # Logo, favicon, manifest
├── supabase/schema.sql # Schema Supabase + RLS policies
├── src/
│   ├── App.jsx        # Auth gate, chat, workspace state, SSE streaming
│   ├── Workspace.jsx  # Home, Tasks, Inbox, Calendar, Reports
│   ├── Workspace.css  # Workspace UI
│   ├── Landing.jsx    # Public landing page
│   ├── Landing.css    # Landing-only styles
│   └── main.jsx       # React bootstrap dan Error Boundary
└── dist/              # Build production yang di-commit
```

## Environment variable

Backend membaca `.env` di folder `ai-website/`. File ini tidak boleh di-commit.

```bash
OPENROUTER_API_KEY=your_openrouter_key
KENOAI_GITHUB_TOKEN=your_github_token
KENOAI_API_BASE=https://openrouter.ai/api/v1
KENOAI_MODEL=google/gemma-4-31b-it:free
PORT=5000

# Optional multi-user sync, server only
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Frontend membutuhkan `VITE_GOOGLE_CLIENT_ID` saat build. Nilai ini harus berada di `.env` folder `/workspace/build-temp/`, bukan ditulis di source repo.

## Aturan build

Jangan menjalankan `npm install` atau build menggunakan `node_modules` di repo ini. `node_modules` yang ada adalah build Termux/ARM64 untuk device pemilik repo.

Build frontend dilakukan dari sandbox eksternal:

```bash
cd /workspace/build-temp
rm -rf src dist public
cp -r /workspaces/KenoAi/ai-website/src .
cp -r /workspaces/KenoAi/ai-website/public .
cp /workspaces/KenoAi/ai-website/index.html /workspaces/KenoAi/ai-website/package.json .
# Pastikan .env berisi VITE_GOOGLE_CLIENT_ID
npm run build
```

Setelah build berhasil, salin `dist/` hasil build ke `ai-website/dist/`. Jangan mengedit `dist/` secara manual.

## Menjalankan server

Di device pemilik repo:

```bash
cd ai-website
npm run start
```

Server production menggunakan port `5000`. Gunakan port `5001`, `5098`, atau `5099` hanya untuk testing.

Endpoint penting:

- `GET /api/health` untuk status server.
- `GET /api/models` untuk katalog model.
- `POST /api/ai-stream` untuk SSE chat streaming.
- `/api/github/*` untuk connector GitHub.

## Keamanan dan batasan

- API key OpenRouter dan GitHub token hanya berada di server.
- Payload chat dibatasi jumlah pesan, ukuran message, persona, role, dan context total.
- Rate limit endpoint API berbasis IP diterapkan di server.
- Jika Supabase dikonfigurasi, Google credential diverifikasi server-side dan workspace snapshot disimpan per user.
- Jika Supabase belum dikonfigurasi, aplikasi tetap berjalan dalam local mode menggunakan `localStorage`.
- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh berada di server dan tidak boleh diawali `VITE_`.
- Jangan menyimpan secret di log, source code, `memory.md`, atau output terminal.

## Supabase multi-user

1. Buat project Supabase.
2. Jalankan isi `supabase/schema.sql` di SQL Editor.
3. Isi `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dan `GOOGLE_CLIENT_ID` di `.env` server.
4. Pastikan Google OAuth client ID yang dipakai build sama dengan `GOOGLE_CLIENT_ID` server.
5. Restart server. Endpoint `/api/health` harus menampilkan `cloudAuth: true`.

Server memverifikasi credential Google melalui Google tokeninfo, memetakan `google_sub` ke `app_users`, lalu menyimpan satu snapshot workspace per user. Browser tidak pernah menerima service-role key.

## Validasi perubahan

Sebelum mengirim perubahan:

```bash
git diff --check
cd ai-website && node --check server.js
npm test
```

Untuk perubahan frontend, gunakan build sandbox eksternal seperti pada bagian build. Test sebaiknya mencakup login, streaming sukses/gagal, retry, Inbox otomatis, edit task, filter, dan responsive mobile.
