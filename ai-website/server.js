// KenoAi Pro — backend + SPA server
// Features: .env auto-load (no dependency), free-model catalogue, model picker,
// SSE streaming relay with abort handling, rate limit, static SPA serving.
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------- .env auto-loader (zero dependencies) ----------
// Node does NOT read .env by itself — this fixes "key: MISSING".
// Real environment variables always win over .env values.
(function loadEnv(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[m[1]] === undefined) process.env[m[1]] = val;
    }
  } catch { /* .env is optional */ }
})(path.join(__dirname, '.env'));

// ---------- Model catalogue (verified live on OpenRouter) ----------
// free: true  -> $0 (OpenRouter free tier: ~20 req/min, ~50 req/day)
// image: true -> accepts image uploads (works with the app's attach feature)
const MODELS = [
  // ---- FREE (recommended) ----
  { id: 'google/gemma-4-31b-it:free',              label: 'Gemma 4 31B',            free: true,  image: true,  ctx: '262K', note: 'DEFAULT • image + text • Google' },
  { id: 'google/gemma-4-26b-a4b-it:free',          label: 'Gemma 4 26B A4B',        free: true,  image: true,  ctx: '262K', note: 'Faster Gemma • image + text' },
  { id: 'minimax/minimax-m3:free',                 label: 'MiniMax M3',             free: true,  image: true,  ctx: '1M',   note: 'Huge context • image + text' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free',  label: 'Nemotron 3 Ultra 550B',  free: true,  image: false, ctx: '1M',   note: 'Largest free model • text only' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free',  label: 'Nemotron 3 Super 120B',  free: true,  image: false, ctx: '262K', note: 'Strong all-round • text only' },
  { id: 'z-ai/glm-5.2:free',                       label: 'GLM 5.2',                free: true,  image: false, ctx: '256K', note: 'Balanced • text only' },
  { id: 'nvidia/nemotron-3.5-lightning:free',      label: 'Nemotron 3.5 Lightning', free: true,  image: false, ctx: '1M',   note: 'Fast • text only' },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', label: 'Nemotron 3 Nano Omni', free: true, image: true, ctx: '256K', note: 'Image + audio + reasoning' },
  { id: 'minimax/minimax-m2.7:free',               label: 'MiniMax M2.7',           free: true,  image: false, ctx: '196K', note: 'Light • text only' },
  { id: 'thinkingmachines/inkling:free',           label: 'Inkling',                free: true,  image: true,  ctx: '1M',   note: 'Image + audio input' },
  { id: 'thinkingmachines/inkling-small:free',     label: 'Inkling Small',          free: true,  image: true,  ctx: '1M',   note: 'Faster Inkling' },
  { id: 'dots-studio/dots-3-note-preview:free',    label: 'Dots3-Note Preview',     free: true,  image: true,  ctx: '512K', note: 'Notes specialist (preview)' },
  { id: 'inclusionai/ling-3.0-flash-fin:free',     label: 'Ling 3.0 Flash Fin',     free: true,  image: false, ctx: '262K', note: 'Very fast • text only' },
  { id: 'liquid/lfm-2.5-2.6b:free',                label: 'LFM 2.5 2.6B',           free: true,  image: false, ctx: '64K',  note: 'Tiny & instant • text only' },
  { id: 'poolside/laguna-s-2.1:free',              label: 'Laguna S 2.1 (code)',    free: true,  image: false, ctx: '262K', note: 'Code specialist' },
  { id: 'poolside/laguna-xs-2.1:free',             label: 'Laguna XS 2.1 (code)',   free: true,  image: false, ctx: '262K', note: 'Fast code model' },
  { id: 'cohere/north-mini-code:free',             label: 'North Mini Code',        free: true,  image: false, ctx: '256K', note: 'Code specialist • text only' },
  { id: 'openrouter/free',                         label: 'Auto: Best Free',        free: true,  image: true,  ctx: '200K', note: 'Router auto-picks a live free model' },
  // ---- PAID (cheap, no daily free-tier cap) ----
  { id: 'google/gemma-4-31b-it',                   label: 'Gemma 4 31B (paid)',     free: false, image: true,  ctx: '262K', note: 'Same Gemma 31B without free-tier limits' },
  { id: 'google/gemini-2.5-flash',                 label: 'Gemini 2.5 Flash',       free: false, image: true,  ctx: '1M',   note: 'Cheap & fast • image + text' },
  { id: '~google/gemini-flash-latest',             label: 'Gemini Flash Latest',    free: false, image: true,  ctx: '1M',   note: 'Always the newest Gemini Flash' },
  { id: 'google/gemini-2.5-pro',                   label: 'Gemini 2.5 Pro',         free: false, image: true,  ctx: '1M',   note: 'For hard tasks • pricier' },
];

// ---------- Config ----------
const app = express();
const PORT = Number(process.env.PORT) || 5000;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const MAX_TOKENS = Number(process.env.KENOAI_MAX_TOKENS) || 8192;
const MAX_BODY_MB = Number(process.env.KENOAI_MAX_BODY_MB) || 12;

const DEFAULT_MODEL =
  MODELS.some((m) => m.id === process.env.KENOAI_MODEL)
    ? process.env.KENOAI_MODEL
    : 'google/gemma-4-31b-it:free'; // ← ganti default di sini atau via .env (KENOAI_MODEL)

// ---------- Middleware ----------
app.disable('x-powered-by');
app.use(express.json({ limit: `${MAX_BODY_MB}mb` }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), geolocation=()');
  next();
});

// ---------- Rate limiter (per IP) ----------
const hits = new Map();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60_000;

function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, reset: now + RATE_WINDOW };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + RATE_WINDOW; }
  entry.count++;
  hits.set(ip, entry);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
  }
  if (entry.count > RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }
  next();
}

// ---------- Static SPA ----------
const DIST = path.join(__dirname, 'dist');
app.use(express.static(DIST, { maxAge: '1y', index: false, immutable: true }));

// ---------- API: health ----------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, model: DEFAULT_MODEL, hasKey: Boolean(OPENROUTER_API_KEY), ts: Date.now() });
});

// ---------- API: model list (for a future UI picker) ----------
app.get('/api/models', (req, res) => {
  res.json({ ok: true, default: DEFAULT_MODEL, models: MODELS });
});

// ---------- API: streaming chat ----------
app.post('/api/ai-stream', rateLimit, async (req, res) => {
  const { messages, persona, model } = req.body || {};

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'Server is missing OPENROUTER_API_KEY. Create a .env file next to server.js (see .env.example) and restart.' });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'A non-empty "messages" array is required.' });
  }
  if (messages.length > 64) {
    return res.status(400).json({ error: 'Too many messages in one request.' });
  }
  if (model !== undefined && !MODELS.some((m) => m.id === model)) {
    return res.status(400).json({ error: `Unknown model "${model}". GET /api/models for the list.` });
  }
  const useModel = model || DEFAULT_MODEL;

  // Persona system prompts
  let systemContent =
    'You are KenoAi, an advanced, accurate and friendly AI assistant. Be clear, structured and concise. Use Markdown formatting well.';
  if (persona === 'programmer') {
    systemContent =
      'You are KenoAi, an expert software engineer. Give correct, production-quality code with best practices, brief explanations, and note edge cases.';
  } else if (persona === 'casual') {
    systemContent =
      'You are KenoAi, a relaxed, friendly companion. Chat naturally with everyday language, keep it fun and supportive.';
  }

  const upstream = new AbortController();
  // NOTE: abort on RESPONSE close (client disconnect). 'req close' fires as soon
  // as the request body is consumed in Node 20 and would kill the upstream call.
  res.on('close', () => upstream.abort());

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const keepAlive = setInterval(() => res.write(': ping\n\n'), 15000);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: upstream.signal,
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.PUBLIC_URL || `http://localhost:${PORT}`,
        'X-Title': 'KenoAi Pro',
      },
      body: JSON.stringify({
        model: useModel,
        messages: [{ role: 'system', content: systemContent }, ...messages],
        stream: true,
        max_tokens: MAX_TOKENS,
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text().catch(() => '');
      res.write(`data: ${JSON.stringify({ error: `Upstream error ${response.status}: ${errText.slice(0, 300)}` })}\n\n`);
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    res.end();
  } catch (err) {
    if (upstream.signal.aborted || req.destroyed) {
      try { res.end(); } catch {}
    } else {
      console.error('[ai-stream]', err.message);
      if (!res.headersSent) {
        res.status(502).json({ error: 'AI provider unreachable.' });
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message || 'Stream failed.' })}\n\n`);
        res.end();
      }
    }
  } finally {
    clearInterval(keepAlive);
  }
});

// ---------- SPA fallback ----------
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path.startsWith('/assets/')) {
    return next();
  }
  res.sendFile(path.join(DIST, 'index.html'));
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Unknown API route' });
  res.status(404).send('Not found');
});

// ---------- Start ----------
app.listen(PORT, () => {
  const freeCount = MODELS.filter((m) => m.free).length;
  console.log(`KenoAi backend + SPA on http://localhost:${PORT}`);
  console.log(`  model  : ${DEFAULT_MODEL} (default)`);
  console.log(`  key    : ${OPENROUTER_API_KEY ? 'loaded OK' : 'MISSING — create .env with OPENROUTER_API_KEY and restart'}`);
  console.log(`  models : ${freeCount} free + ${MODELS.length - freeCount} paid — list at GET /api/models`);
  if (process.env.KENOAI_MODEL && !MODELS.some((m) => m.id === process.env.KENOAI_MODEL)) {
    console.warn(`  warning: KENOAI_MODEL="${process.env.KENOAI_MODEL}" is not in the catalogue — using ${DEFAULT_MODEL}.`);
  }
});
