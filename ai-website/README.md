# KenoAi Pro v3 — Advanced AI Assistant Chat

**Fast. Private. Beautiful. Streaming.**

KenoAi adalah aplikasi AI assistant modern yang menggabungkan streaming real-time, privasi pengguna, dan antarmuka yang indah. Perjalanan pengguna dimulai dari **Landing Page** yang menjelaskan produk + iklan, dilanjutkan dengan **Google Sign-In**, dan kemudian masuk ke **Chat Interface** yang powerful.

---

## 🚀 Fitur Utama

- **Streaming Real-Time**: Jawaban AI muncul karakter per karakter secara langsung (SSE streaming)
- **Landing Page + Google OAuth**: Pengguna baru disambut dengan penjelasan produk sebelum login
- **Chat Interface**: Percakapan terorganisir dengan riwayat lokal (localStorage)
- **Dashboard SaaS**: 7 tab untuk statistics, usage analytics, model management, dll (lazy-loaded)
- **Multi-Persona**: Pilih antara Professional, Developer, atau Casual mode
- **Multi-Model**: 22 model AI (18 gratis + 4 premium) via OpenRouter
- **Responsive Design**: Optimal untuk desktop, tablet, dan mobile
- **Code Syntax Highlighting**: Dukungan 30+ bahasa pemrograman
- **Image Support**: Upload dan analisis gambar dengan kompres otomatis
- **Voice Input** (WIP): Input suara untuk hands-free interaction
- **Privacy-First**: Semua percakapan disimpan lokal di device, tidak pernah dikirim ke server
- **Analytics**: Tracking penggunaan token, waktu respons, dan error rates

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18.3 + Vite 5 + Lazy Loading |
| **Backend** | Express 5 (Node.js 18+) |
| **AI Provider** | OpenRouter (22 models) |
| **Auth** | Google OAuth via @react-oauth/google |
| **Storage** | localStorage (no database required) |
| **UI Framework** | CSS3 (zero-dependency, responsive design) |
| **Code Highlighting** | react-syntax-highlighter + Prism.js |
| **Markdown** | react-markdown + remark-gfm |

---

## 🏗️ Struktur Folder

```
/workspace/
├── src/
│   ├── main.jsx           ← React entry with GoogleOAuthProvider
│   ├── App.jsx            ← Main app shell (routing: Landing → Chat)
│   ├── Landing.jsx        ← Landing page (penjelasan + ads)
│   ├── Login.jsx          ← Google login form
│   ├── Dashboard.jsx      ← 7-tab SaaS dashboard (lazy-loaded ~16KB)
│   ├── Sidebar.jsx        ← Chat history + search
│   ├── Composer.jsx       ← Uncontrolled textarea (0 re-render)
│   ├── Message.jsx        ← Chat bubble component (memoized)
│   ├── Markdown.jsx       ← Lazy syntax highlighting
│   ├── icons.jsx          ← 36 inline SVG icons
│   ├── lib.js             ← Utility functions + analytics
│   └── App.css            ← Design system + responsive styles
├── public/
│   ├── favicon-32.png
│   ├── icon-64.png
│   ├── icon-192.png
│   ├── apple-touch-icon.png
│   ├── kenoai-avatar.png  ← AI avatar image
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
├── dist/                  ← Build output (npm run build)
├── index.html             ← SPA entry HTML
├── server.js              ← Express backend
├── package.json
├── vite.config.js
├── .env.example           ← Template for environment variables
├── .env                   ← Local sandbox only (DO NOT COMMIT)
└── README.md              ← This file
```

---

## 🔐 Environment Variables

Buat `.env` file di root folder dengan konten berikut:

```bash
# OpenRouter API Key (gratis atau premium)
# Dapatkan dari: https://openrouter.ai/keys
VITE_OPENROUTER_KEY=sk-or-v1-YOUR_KEY_HERE

# Google OAuth Client ID
# Buat di: https://console.cloud.google.com
# Authorized redirect URIs: http://localhost:5000, http://localhost:5100
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

# Server Port
PORT=5100
NODE_ENV=development
```

**⚠️ PENTING**: Jangan commit `.env` ke Git. File ini sudah di `.gitignore`.

---

## 💻 Installation & Setup

### Prerequisites
- Node.js 18+
- npm atau yarn
- Git

### Local Development (Sandbox)

```bash
# Clone atau extract repository
cd /workspace

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env dengan API key Anda

# Run development server
npm run dev
# Server akan jalan di http://localhost:5173
# Backend proxy: http://localhost:5000

# Di terminal baru, jalankan backend
PORT=5100 npm start
# Server akan jalan di http://localhost:5100 (production mode)
```

### Production Build

```bash
# Build for production
npm run build
# Output: dist/ folder (~500KB total)

# Test production build
npm start
# Server akan jalan di http://localhost:5100
```

---

## 🔄 User Journey

### 1. **Landing Page** (`/`)
   - Pengguna melihat penjelasan KenoAi
   - Melihat features dan ads
   - Click "Sign in" atau "Get Started with Google"

### 2. **Login** (`/login`)
   - Google OAuth popup
   - Token disimpan ke localStorage (30 hari)
   - Redirect ke Chat interface

### 3. **Chat Interface** (`/chat`)
   - Welcome screen dengan suggested prompts
   - Input pesan + upload gambar
   - Real-time streaming response
   - Sidebar dengan chat history
   - Topbar dengan model selector + persona chooser

### 4. **Dashboard** (optional)
   - Tab: Conversations, Models, Usage, Settings, dll
   - Analytics: token usage, response time, error tracking

---

## 🎨 Design System

### Colors
- **Primary Accent**: `#6366f1` (Indigo 500)
- **Light Background**: `#f4f5f9`
- **Dark Background**: `#0b0d12`
- **Text Primary**: `#14161d`
- **Text Secondary**: `#5a6273`
- **Border**: `rgba(15, 18, 30, 0.1)`

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Wide**: >= 1440px

### Typography
- **Font**: System sans-serif (Inter/SF Pro Display fallback)
- **Body**: 15px / 1.55 line-height
- **Headings**: 700 weight, various sizes (18px - 48px)

---

## 📊 API Endpoints

### Frontend → Backend

| Endpoint | Method | Fungsi | Auth |
|----------|--------|--------|------|
| `/` | GET | Serve SPA (index.html) | ✗ |
| `/api/health` | GET | Health check | ✗ |
| `/api/models` | GET | List 22 models (cached) | ✗ |
| `/api/account` | GET | User tier + usage info (via OpenRouter) | ✓ |
| `/api/ai-stream` | POST | Chat streaming via SSE | ✓ |

**POST /api/ai-stream Body:**
```json
{
  "prompt": "Explain how transformers work",
  "model": "google/gemma-4-31b-it:free",
  "persona": "professional",
  "image": null
}
```

---

## 🛠️ Development Tips

### Debugging
- Open browser DevTools: `F12`
- Check Console tab untuk errors
- Check Network tab untuk API calls
- Check Application → localStorage untuk user data

### localStorage Keys

| Key | Type | Contoh Nilai |
|-----|------|-------------|
| `kenoai_auth_token` | JWT string | `eyJ...` |
| `kenoai_sessions_v2` | Array JSON | `[{id: "m-1", title: "...", messages: [...]}]` |
| `kenoai_usage_v1` | Array JSON | `[{model, tokens, msElapsed, error}]` |
| `kenoai_model` | String | `"google/gemma-4-31b-it:free"` |
| `kenoai_persona` | String | `"professional"` \| `"programmer"` \| `"casual"` |
| `kenoai_theme` | String | `"light"` \| `"dark"` |
| `kenoai_sidebar_collapsed` | Boolean | `false` |

### Adding New Features
1. Create component di `src/ComponentName.jsx`
2. Import ke `App.jsx`
3. Update `App.css` untuk styling
4. Test di browser dengan DevTools

### Performance Tips
- Use `lazy()` untuk large components (misal: Dashboard)
- Memoize expensive components dengan `React.memo()`
- Debounce expensive functions (misal: localStorage save)
- Use uncontrolled components untuk high-frequency updates (misal: Composer)

---

## 📱 Mobile Optimization

Landing page dan chat interface sudah fully responsive:
- Sidebar collapse otomatis di mobile
- Touch-friendly buttons (min 44px)
- Flexible layouts dengan CSS grid/flexbox
- Viewport optimized (viewport-fit=cover)

Testing di mobile:
```bash
# Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
# Test pada ukuran: 375px (iPhone SE), 390px (iPhone 14), 412px (Android)
```

---

## 🚀 Deployment

### Option 1: Deploy Built Files to S3 (via agent)
```bash
# Agent runs:
npm run build
deploy name="kenoai-v3" directory_path="dist"
# Generated URL: https://kenoai-v3.pages.dev
```

### Option 2: Deploy Server to Termux (Manual)
```bash
# User downloads: kenoai-v3-dist.zip dari GitHub release
unzip kenoai-v3-dist.zip
npm install
PORT=5000 npm start
# Access: http://localhost:5000 (di Termux)
```

---

## 🐛 Known Issues & Fixes

| Issue | Status | Workaround |
|-------|--------|-----------|
| Manifest.webmanifest parse error (browser cache) | ⚠️ Minor | Clear browser cache or use private window |
| Google OAuth requires valid client ID | 🔧 Config | Get OAuth credentials dari Google Console |
| localStorage limited to ~5MB | 📌 Limitation | Auto-strip old images kalau penuh |
| SSE timeout di proxy > 60s | 🔧 Rare | Pastikan backend timeout cukup |

---

## 📈 Analytics & Monitoring

KenoAi tracks (locally, no server logging):
- Token usage per model
- Response time per request
- Error rates
- User persona preferences
- Chat history metadata

Data disimpan di localStorage key `kenoai_usage_v1` (max 800 entries, auto-rotate).

---

## 🔒 Privacy & Security

✅ **Privacy First**
- Semua percakapan disimpan lokal (device-only)
- Tidak ada tracking pixel atau analytics external
- Tidak ada data collection dari UI interactions
- Token hanya dikirim ke OpenRouter API (via backend proxy)

✅ **Security**
- HTTPS recommended untuk production
- CORS restriction: `/api` same-origin only
- No credentials in localStorage (auth token hanya untuk session)
- Input sanitization via react-markdown

---

## 🤝 Contributing

Kontribusi welcome! Format:
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -am 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

## 🙋 Support

- **Issues**: GitHub Issues
- **Docs**: https://kenoai.app/docs (WIP)
- **Contact**: hi@kenoai.app

---

## 🎯 Roadmap (Future)

- [ ] Voice input + text-to-speech
- [ ] Cloud sync (optional, user opt-in)
- [ ] Shared conversations (public links)
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Team/Organization accounts
- [ ] Custom model fine-tuning
- [ ] Plugins ecosystem

---

**Made with ❤️ by KenoAi Team**

*Last updated: September 2026*
