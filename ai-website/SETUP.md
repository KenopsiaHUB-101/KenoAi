# 📱 KenoAi Pro v3 — Setup Guide untuk Termux

Panduan lengkap untuk menjalankan KenoAi di Termux (Android).

---

## 📋 Prasyarat

- **Device**: Android 8+ (tested di Samsung, Xiaomi, Pixel)
- **Termux App**: https://f-droid.org/en/packages/com.termux/
- **Storage**: ~200MB free space
- **Internet**: Koneksi stabil (WiFi recommended)

---

## 🚀 Quick Start (5 Menit)

### 1. Install Termux
- Download dari F-Droid (lebih stable dari Play Store)
- Open app → Grant storage permission

### 2. Update Package Manager
```bash
pkg update
pkg upgrade
```

### 3. Install Dependencies
```bash
pkg install nodejs git
node --version  # Verifikasi (harus v18+)
```

### 4. Download KenoAi
```bash
# Opsi A: Clone dari GitHub
git clone https://github.com/KenopsiaHUB-101/Generator.git kenoai
cd kenoai

# Opsi B: Download ZIP dari release
wget https://github.com/KenopsiaHUB-101/Generator/releases/download/v3.0/kenoai-v3-dist.zip
unzip kenoai-v3-dist.zip -d kenoai
cd kenoai
```

### 5. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan nano atau vi
nano .env

# Tambahkan:
# VITE_OPENROUTER_KEY=sk-or-v1-YOUR_KEY_HERE
# VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
# PORT=5000
# NODE_ENV=production
```

### 6. Install Dependencies & Run
```bash
npm install
npm start

# Server jalan di http://localhost:5000
# Buka browser: http://localhost:5000
```

---

## 🔑 Mendapatkan API Keys

### A. OpenRouter API Key (untuk AI models)

1. **Buka browser** di Android
2. **Kunjungi**: https://openrouter.ai
3. **Sign up** atau login
4. **Navigate ke**: Settings → API Keys
5. **Copy** API key (dimulai dengan `sk-or-v1-`)
6. **Paste ke `.env`**: `VITE_OPENROUTER_KEY=sk-or-v1-YOUR_KEY`

**Free tier availability**:
- ~20 requests per minute
- ~50 requests per day
- Unlimited text models

### B. Google OAuth Client ID (untuk login)

1. **Buka**: https://console.cloud.google.com
2. **Login** dengan Google account
3. **Create project** (jika belum ada):
   - Top bar → Select project → New Project
   - Name: "KenoAi"
4. **Enable OAuth 2.0**:
   - Left sidebar → APIs & Services → OAuth consent screen
   - Choose "External"
   - Fill app name: "KenoAi"
   - Add scopes: `openid`, `email`, `profile`
   - Save & Continue
5. **Create OAuth 2.0 Credentials**:
   - Left sidebar → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Name: "KenoAi Termux"
   - Authorized redirect URIs:
     ```
     http://localhost:5000
     http://192.168.1.XXX:5000  (your local IP)
     ```
   - Create
6. **Copy** Client ID (starts with `*.apps.googleusercontent.com`)
7. **Paste ke `.env`**: `VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID`

---

## 🛠️ Troubleshooting

### Problem: "command not found: node"
```bash
# Solution: Install Node.js
pkg install nodejs
# Verify
node --version
npm --version
```

### Problem: "npm ERR! code EACCES (permission denied)"
```bash
# Solution: Clear npm cache
npm cache clean --force
# Retry
npm install
```

### Problem: "Error: ENOSPC: no space left on device"
```bash
# Solution: Check storage
df -h
# Clear Termux cache
npm cache clean --force
# Or: Uninstall unused packages
```

### Problem: "localhost:5000 refused to connect"
```bash
# Solution 1: Check if server is running
# (in new Termux session)
ps aux | grep node

# Solution 2: Check port is not in use
netstat -tlnp | grep 5000

# Solution 3: Use different port
PORT=5001 npm start
```

### Problem: "Google login button shows error"
```bash
# Issue: Client ID mismatch
# Solution: 
# 1. Check .env file has correct CLIENT ID
# 2. Check Client ID doesn't have trailing spaces
# 3. Verify redirect URI matches (http://localhost:5000)
# 4. Check if OAuth app is in EXTERNAL mode (not INTERNAL)
```

### Problem: "OpenRouter API key rejected"
```bash
# Issue: Invalid or expired key
# Solution:
# 1. Verify key starts with: sk-or-v1-
# 2. Check no trailing spaces in .env
# 3. Regenerate key from https://openrouter.ai/keys
# 4. Test with curl:
curl -X POST https://api.openrouter.ai/api/v1/models \
  -H "Authorization: Bearer sk-or-v1-YOUR_KEY"
```

---

## 📊 Server Management

### Start Server (Default Port 5000)
```bash
npm start
```

### Start on Custom Port
```bash
PORT=5001 npm start
```

### Run in Background
```bash
# Start in new Termux session:
# 1. Long press home
# 2. New session
# 3. cd /path/to/kenoai && npm start

# Or use nohup:
nohup npm start > server.log 2>&1 &
tail -f server.log  # Watch logs
```

### Stop Server
```bash
# If running in foreground: Ctrl+C
# If running in background:
pkill -f "npm start"
# or
pkill -f "node server.js"
```

### View Logs
```bash
# If running with nohup:
tail -f server.log
tail -100 server.log  # Last 100 lines

# If in foreground: Output appears on console
```

---

## 🌐 Accessing from Other Devices

### Find Your Local IP
```bash
# In Termux:
hostname -I
# Output example: 192.168.1.45
```

### Access from Computer/Tablet
```
http://192.168.1.45:5000
```

### Add to Authorized Redirect URIs
If you want to access from other devices:
1. Update Google OAuth settings
2. Add redirect URI: `http://192.168.1.45:5000`

---

## 💾 Data Backup

### Backup Chat History
```bash
# SQLite database (if using DB):
# Usually not needed since data stored locally in browser

# localStorage data persists in browser storage
# Export chats: Use "Export" button in chat interface
```

### Backup App Data
```bash
# Copy entire folder:
cp -r ~/kenoai ~/kenoai-backup-$(date +%Y%m%d)
```

---

## 🔄 Updating KenoAi

### Update to Latest Version
```bash
cd ~/kenoai
git pull origin main
npm install
npm start
```

Or download latest ZIP from GitHub releases.

---

## 📱 Optimizing for Mobile

### Disable Browser Zoom
Settings → Chrome/Firefox → Turn off "Always show menu buttons"

### Add to Home Screen
- Chrome: Menu (⋮) → Install app
- Firefox: Menu → Add to home screen

### Keyboard Shortcuts
- `Ctrl+Enter`: Send message (if keyboard visible)
- `Shift+Enter`: New line
- `/`: Search chat history

---

## ⚡ Performance Tips

1. **Close unused apps** sebelum menjalankan KenoAi
2. **Use WiFi** instead of mobile data (lebih stabil)
3. **Disable background syncing** untuk app lain
4. **Use smaller models** untuk respon cepat:
   - Recommended: Gemma 4 / Nemotron 3.5 Lightning (free tier)
5. **Clear browser cache** regularly

---

## 🔐 Security Best Practices

✅ **DO**:
- Keep `.env` file private (don't share)
- Use strong Google account password
- Rotate API keys regularly
- Use HTTPS when accessing from remote (setup reverse proxy)

❌ **DON'T**:
- Commit `.env` to Git
- Share API keys publicly
- Use default passwords
- Leave server running on public network without authentication

---

## 📞 Support

### Check Logs
```bash
# View server errors:
tail -f server.log

# View browser console:
# Open DevTools: F12 → Console
```

### Common Error Codes
| Code | Meaning | Fix |
|------|---------|-----|
| 400 | Bad request | Check request format |
| 401 | Unauthorized | Check API key |
| 429 | Rate limited | Wait or upgrade OpenRouter tier |
| 500 | Server error | Check logs, restart server |
| ECONNREFUSED | Server not running | Run `npm start` |

### Get Help
- **Issues**: https://github.com/KenopsiaHUB-101/Generator/issues
- **Docs**: README.md in this folder
- **Email**: hi@kenoai.app

---

## 🎯 Next Steps

After setup:
1. **Test landing page**: http://localhost:5000
2. **Sign in with Google**
3. **Try first AI prompt**: "Hello, what's your name?"
4. **Explore dashboard**: Tab icons at top
5. **Share feedback**: Open GitHub issue

---

**Happy chatting! 🚀**

Last updated: September 2026
