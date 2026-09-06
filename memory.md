# KenoAi — Project Memory & Documentation

Dokumen ini adalah "memori" proyek agar semua proses tidak hilang atau teracak-acak.
Berisi: fungsi setiap file/folder, aturan tetap, sejarah perubahan (PR), dan cara kerja build/deploy.

> Terakhir diperbarui: setelah redesign Landing Page (PR #6).

---

## 1. Aturan Tetap Proyek (WAJIB dipatuhi)

- **PORT tetap 5000** untuk server produksi. Port lain (5001, 5098, 5099) hanya untuk testing.
- **Jangan pernah mengedit `node_modules/`** — node_modules di repo ini adalah build Termux/ARM64 untuk device Android pemilik repo.
- **Node/npm install TIDAK dilakukan di repo ini.** Build frontend hanya lewat folder `build-temp/` di luar repo (lihat bagian Build).
- Prefer **edit file yang sudah ada** daripada menambah file baru, kecuali memang benar-benar perlu (contoh yang wajar: `Landing.css`, `memory.md`).
- Jangan commit hal tidak penting (catatan sementara, screenshot test) ke repo.
- GitHub token **tidak pernah** ditulis di file repo atau di-print di output. Push pakai: `git push https://x-access-token:$GITHUB_TOKEN@github.com/KenopsiaHUB-101/KenoAi.git <branch>`.
- Selalu baca/baca ulang file yang mau diubah sebelum mengedit.
- Respons ke pemilik repo memakai **Bahasa Indonesia**.

---

## 2. Struktur Repo & Fungsi Setiap File/Folder

```
KenoAi/
├── memory.md                  ← dokumen ini (dokumentasi + sejarah)
├── Refrensi/                  ← referensi desain dari pemilik repo (JANGAN dihapus/diubah)
│   ├── refrensi0-3.png        ← 4 screenshot dashboard "Jotify-style" (lavender/purple)
│   └── video Refrensi.mp4     ← video 19 detik animasi dashboard yang sama
└── ai-website/                ← SELURUH aplikasi (frontend + backend)
    ├── server.js              ← Backend Express (PORT 5000). Fungsi:
    │                             • serve frontend statis dari dist/
    │                             • POST /api/ai-stream  → relay SSE ke OpenRouter (streaming jawaban AI)
    │                             • fallback model gratis otomatis saat 429/503 (PR #5)
    │                             • GET  /api/models     → daftar model (18 free + 4 paid)
    │                             • GET  /api/health     → status server
    │                             • GitHub connector: /api/github/status|repos|repo/:o/:r|tree|file
    │                             • env: OPENROUTER_API_KEY, KENOAI_GITHUB_TOKEN, KENOAI_API_BASE
    ├── .env                   ← (git-ignored) API keys — JANGAN pernah di-commit
    ├── index.html             ← entry HTML (meta SEO, tema, preload script)
    ├── package.json           ← scripts: start (server), build (vite)
    ├── public/                ← file statis yang di-copy ke dist saat build
    │   ├── icon-192.png       ← LOGO KenoAi (bintang 4 sudut, gradient ungu-cyan) — dipakai di landing
    │   ├── favicon-32.png, apple-touch-icon.png, kenoai-avatar.png
    │   └── manifest.webmanifest
    ├── src/                   ← source React (Vite)
    │   ├── main.jsx           ← bootstrap React + Google OAuth provider
    │   ├── App.jsx            ← komponen utama CHAT APP (dark theme): auth gate, sessions,
    │   │                         sidebar chat history, SSE streaming, personas, model picker,
    │   │                         GitHub connector UI, toast (termasuk info fallback model)
    │   ├── Landing.jsx        ← LANDING PAGE (redesign PR #6, gaya referensi lavender/purple):
    │   │                         navbar, hero + mockup dashboard, quick starts, features,
    │   │                         how it works, for business, stats, CTA, footer
    │   ├── Landing.css        ← CSS khusus landing (scope .k-* dan .mk-*) — TIDAK menyentuh app dark theme
    │   ├── Login.jsx          ← halaman login Google (OAuth via @react-oauth/google)
    │   ├── Header.jsx         ← header chat app (model picker, persona, pengaturan)
    │   ├── Sidebar.jsx/.jsxMemo ← riwayat chat (SidebarMemo = versi memoized)
    │   ├── Composer.jsx/.jsxMemo ← input chat (attachment gambar, voice, kirim)
    │   ├── Message.jsx        ← render 1 pesan chat
    │   ├── MessageCard.jsx    ← kartu pesan (avatar, waktu)
    │   ├── Markdown.jsx       ← render markdown + syntax highlight (prism)
    │   ├── icons.jsx          ← kumpulan ikon SVG stroke
    │   ├── lib.js             ← util: store (localStorage), auth decode, dsb.
    │   ├── App.css            ← CSS app CHAT (dark theme) + CSS landing LAMA (sudah tidak dipakai Landing.jsx)
    │   └── App.jsx.backup     ← backup App.jsx sebelum fix #4 (bisa dihapus jika perlu)
    └── dist/                  ← hasil build production (di-commit; client ID Google ter-embed)
```

Folder **di luar repo** (sandbox kerja, TIDAK di-commit):
- `/workspace/build-temp/` — satu-satunya tempat `npm run build` dijalankan. Punya `.env` sendiri dengan `VITE_GOOGLE_CLIENT_ID` (WAJIB ada setiap build, karena Vite membake env saat build).
- `/workspace/memory.md` — file aturan sandbox (berisi token, JANGAN di-commit).
- `/workspace/shots/` — screenshot hasil test.
- `/workspace/repro*.py`, `test_*.py` — script test Playwright/mock.

---

## 3. Cara Build & Deploy (PENTING)

**Build frontend (HANYA lewat build-temp):**
```
cd /workspace/build-temp
rm -rf src dist public && cp -r /workspace/kenoai/ai-website/{src,public} .
cp /workspace/kenoai/ai-website/{index.html,package.json} .
# pastikan .env ada VITE_GOOGLE_CLIENT_ID
npm run build
rm -rf /workspace/kenoai/ai-website/dist && cp -r dist /workspace/kenoai/ai-website/dist
```
Kenapa: node_modules repo milik Termux/ARM64 — tidak bisa dipakai sandbox (x86). Repo tidak pernah di-npm-install.

**Jalankan di device pemilik repo (Termux/Android):**
```
git pull origin main
npm run server   # PORT 5000
```

**Env yang dipakai server.js (di ai-website/.env, git-ignored):**
- `OPENROUTER_API_KEY` — key OpenRouter (wajib; yang valid ada di device pemilik)
- `KENOAI_GITHUB_TOKEN` — token GitHub untuk fitur GitHub connector
- `KENOAI_API_BASE` — (opsional) override base URL OpenRouter untuk proxy/test

**Env build frontend (di build-temp/.env):**
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID; jika hilang, tombol login Google di dist akan rusak (dummy ID ter-bake).

---

## 4. Sejarah Perubahan (PR log)

| PR | Judul | Isi singkat |
|----|-------|-------------|
| #1 | Initial + fixes | Setup dasar, perbaikan awal |
| #2 | GitHub connector | Fitur tanya jawab soal repo GitHub (bot token 403 → fix via KENOAI_GITHUB_TOKEN) |
| #3 | Embed Google client ID | Vite membake client ID saat build; dist dibangun ulang dengan env benar |
| #4 | Fix white screen + AI tidak menjawab | (a) hooks-order React di App.jsx → layar putih setelah login Google; (b) bug eager-state `let history` di handleSend → fetch tidak pernah jalan; (c) key OpenRouter invalid 401. Tambah friendlyUpstreamError + cek key saat startup |
| #5 | Auto-fallback model gratis saat 429 | Rate limit free tier (43 req/jam) → chain fallback: openrouter/free → gemma-4-26b → nemotron-3-super → glm-5.2; header `x-kenoai-model` + event info → toast; KENOAI_API_BASE untuk test |
| #6 | Redesign Landing Page | Landing baru bergaya referensi `Refrensi/` (dashboard lavender/purple "workspace"): navbar sticky, hero + mockup dashboard 3-kolom (sidebar/menu/CTA ungu, tasks IN PROGRESS/TO DO dengan chips prioritas, panel Projects+Calendar+Reminders), quick starts, 6 features, 4 steps, 3 kartu For Business (chat/progress/docs), stats, CTA, footer. Logo semua = icon-192.png milik pemilik. File baru: `src/Landing.css`. index.html: background awal terang. Responsif PC+mobile, 0 error halaman |
| #7 | Selaraskan Tema Chat App | Chat app (sidebar, welcome, composer, menu, persona, login card, code block, toast) kini ikut tema light lavender yang sama dengan landing: blok variabel `[data-theme="light"]` di App.css dipindah ke palet lavender/ungu (`#fdfcff` sidebar, `#ffffff` main, aksen `#7c5cfc`, teks `#241d3f`). Default tema = light (index.html bootstrap + App.jsx); dark tetap tersedia via toggle. Fix penting: bootstrap sekarang membaca nilai `kenoai_theme` dua format (raw & JSON-wrapped dari `store.set`) — dulu nilai JSON selalu salah terbaca jadi dark. Code block light: surface ungu-tua `#241f3d` + bar `#2d2850` agar kode tetap terbaca. Responsif PC+mobile, 0 error |

---

## 5. Bug yang Pernah Terjadi & Pelajarannya

- **React hooks-order**: semua hooks harus jalan unconditional; gate hanya di JSX. Kalau ada `if (x) return ...` sebelum hooks → "Rendered fewer hooks than expected" → layar putih.
- **Eager-state anti-pattern**: `let v; setState(prev => { v = ... })` lalu baca `v` sinkron → tidak dijamin (updater bisa di-defer). Hitung dari `sessionsRef.current` saja.
- **Vite env baking**: `VITE_*` ter-bake saat build. Setiap rebuild dist WAJIB ada `VITE_GOOGLE_CLIENT_ID` di build-temp/.env.
- **ERR_HTTP_HEADERS_SENT**: `res.setHeader()` setelah `res.flushHeaders()` akan throw. Set semua header dulu, baru flush.
- **OpenRouter status codes**: 401 = key ditolak; 402 = tidak ada kredit; 429 = rate limit (free tier ~43 req/jam, retry ±60 dtk); 503 = provider sibuk → fallback model lain.
- **Menu dropdown menutup sendiri**: event klik luar memicu close → fix `e.stopPropagation()` di tombol pembuka menu.
- **Landing CSS scope**: CSS landing dibuat prefix `.k-*`/`.mk-*` + file terpisah agar tidak bentrok dengan tema dark app chat.
- **Smooth scroll**: `html{scroll-behavior}` hanya di-aktifkan saat landing mounted (class `k-landing-on`), supaya autoscroll chat app tidak lambat.
- **Tema tersimpan dua format**: `store.set('kenoai_theme', v)` menyimpan JSON (`"light"` dengan kutip), tapi bootstrap index.html dulu membaca string mentah → selalu salah baca → tema berbalik dark setelah reload. Fix: bootstrap mem-parse kedua format.

---

## 6. Checklist Saat Menambah Fitur Baru

1. Edit source di `src/` (bukan dist langsung).
2. Build ulang lewat `/workspace/build-temp/` (ingat `VITE_GOOGLE_CLIENT_ID`).
3. Test di port selain 5000 (mis. 5098) — PC + mobile, cek console error.
4. Branch baru → commit (sertakan dist) → push pakai x-access-token → PR.
5. Update tabel PR log di dokumen ini.
