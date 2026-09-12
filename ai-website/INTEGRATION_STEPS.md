# KenoAi Deployment Checklist

Dokumen ini menggantikan panduan integrasi UI lama. Aplikasi saat ini memakai `App.jsx` sebagai shell utama, `Workspace.jsx` sebagai view workspace, Supabase untuk cloud snapshot opsional, dan `server.js` sebagai API relay.

## Sebelum merge

- [ ] Baca `memory.md` di root repository.
- [ ] Pastikan tidak ada secret di diff.
- [ ] Jalankan `npm test`.
- [ ] Jalankan `node --check server.js`.
- [ ] Jalankan `git diff --check`.
- [ ] Review perubahan mobile dan keyboard accessibility.

## Supabase

- [ ] Buat project terpisah untuk staging dan production.
- [ ] Jalankan `supabase/schema.sql` pada project yang benar.
- [ ] Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` hanya di server.
- [ ] Isi `GOOGLE_CLIENT_ID` dengan OAuth client yang sama dengan build frontend.
- [ ] Pastikan `/api/health` menunjukkan `cloudAuth: true` pada environment cloud.
- [ ] Uji dua akun Google dan pastikan snapshot tidak tertukar.
- [ ] Jangan menyimpan service-role key atau token GitHub di browser.

## GitHub

- [ ] Shared `KENOAI_GITHUB_TOKEN` hanya digunakan untuk staging atau deployment single-owner.
- [ ] Untuk multi-user production, buat GitHub OAuth App per-user.
- [ ] Simpan token OAuth terenkripsi jika fitur per-user diaktifkan.
- [ ] Batasi scope token seminimal mungkin.
- [ ] Uji connect, change repository, browse files, preview, dan send to chat.

## Build frontend

Build tidak menggunakan `node_modules` dari repo:

```bash
cd /workspaces/KenoAi/ai-website
npm run build:sandbox
```

Script akan menolak build jika `/workspace/build-temp/.env` tidak memiliki `VITE_GOOGLE_CLIENT_ID`.

## Production smoke test

```bash
curl -fsS http://localhost:5000/api/health
curl -fsS http://localhost:5000/api/models
npm test
```

Periksa juga:

- Landing page desktop dan mobile.
- Login Google.
- Cloud sync dan status `Cloud synced`.
- Chat streaming, stop, retry, dan fallback model.
- Inbox otomatis setelah AI selesai.
- Task add/edit/filter/complete.
- GitHub repository manager.
- Error Boundary recovery.

## Deployment rules

- Production menggunakan port `5000`.
- Staging gunakan port/domain terpisah, contoh port `5001`.
- Jangan menjalankan `npm install` di repo pemilik.
- Jangan mengedit `dist/` manual.
- Commit source dan hasil build sesuai workflow repository.
- Setelah update tervalidasi, buat commit.
