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

// ---------- GitHub connector ----------
// Server-side GitHub access (token stays on the server, never sent to the browser).
// Uses the global fetch (Node 18+) -> zero new dependencies.
// KENOAI_GITHUB_TOKEN overrides GITHUB_TOKEN (for hosts that inject their own GITHUB_TOKEN).
const GITHUB_TOKEN = process.env.KENOAI_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';
const GH_API = 'https://api.github.com';

// Tiny in-memory cache (5 min) so repeated tree/file reads don't burn the token rate limit.
const ghCache = new Map();
function ghCached(key, ttlMs, loader) {
  const now = Date.now();
  const hit = ghCache.get(key);
  if (hit && now - hit.ts < ttlMs) return Promise.resolve(hit.value);
  return loader().then((value) => {
    ghCache.set(key, { ts: now, value });
    if (ghCache.size > 300) {
      for (const [k, v] of ghCache) if (now - v.ts > 600_000) ghCache.delete(k);
    }
    return value;
  });
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'KenoAi-connector',
  };
}

async function ghFetch(path) {
  if (!GITHUB_TOKEN) {
    const err = new Error('Server is missing GITHUB_TOKEN. Add GITHUB_TOKEN=ghp_... to .env next to server.js and restart.');
    err.status = 503;
    throw err;
  }
  const r = await fetch(GH_API + path, { headers: ghHeaders() });
  const remaining = r.headers.get('x-ratelimit-remaining');
  if (remaining !== null && Number(remaining) < 20) console.warn(`[github] rate limit low: ${remaining} left`);
  if (!r.ok) {
    let detail = `GitHub API ${r.status}`;
    try {
      const body = await r.json();
      if (body.message) detail = `${detail} - ${body.message}`;
    } catch { /* not JSON */ }
    const err = new Error(detail);
    err.status = r.status === 401 ? 502 : r.status === 404 ? 404 : 502;
    if (r.status === 401) err.message = 'GitHub rejected the token (401). Check GITHUB_TOKEN in .env.';
    if (r.status === 404) err.message = 'Repository, branch or file not found on GitHub.';
    throw err;
  }
  return r.json();
}

function ghHandle(err, res) {
  console.error('[github]', err.message);
  if (!res.headersSent) res.status(err.status || 500).json({ error: err.message });
}

// GET /api/github/status -> token valid? + connected account info
app.get('/api/github/status', rateLimit, async (req, res) => {
  try {
    if (!GITHUB_TOKEN) return res.json({ ok: true, connected: false, reason: 'no-token' });
    const user = await ghCached('user', 300_000, () => ghFetch('/user'));
    res.json({ ok: true, connected: true, user: { login: user.login, name: user.name || user.login, avatar: user.avatar_url, publicRepos: user.public_repos } });
  } catch (err) {
    res.json({ ok: true, connected: false, reason: 'bad-token', detail: err.message });
  }
});

// GET /api/github/repos -> the account's repositories (most recently pushed first)
app.get('/api/github/repos', rateLimit, async (req, res) => {
  try {
    const repos = await ghCached('repos', 300_000, () =>
      ghFetch('/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator,organization_member')
    );
    res.json({
      ok: true,
      repos: repos.map((r) => ({
        owner: r.owner.login,
        name: r.name,
        fullName: r.full_name,
        private: r.private,
        description: r.description || '',
        language: r.language || '',
        pushedAt: r.pushed_at,
        defaultBranch: r.default_branch,
        stars: r.stargazers_count,
      })),
    });
  } catch (err) {
    ghHandle(err, res);
  }
});

// GET /api/github/repo/:owner/:repo -> repo meta + README (rendered as markdown text)
app.get('/api/github/repo/:owner/:repo', rateLimit, async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const data = await ghCached(`repo:${owner}/${repo}`, 120_000, async () => {
      const meta = await ghFetch(`/repos/${owner}/${repo}`);
      let readme = '';
      try {
        const r = await ghFetch(`/repos/${owner}/${repo}/readme`);
        readme = Buffer.from(r.content || '', r.encoding || 'base64').toString('utf8');
      } catch { /* repo without README */ }
      return { meta, readme };
    });
    const m = data.meta;
    res.json({
      ok: true,
      repo: {
        fullName: m.full_name,
        description: m.description || '',
        private: m.private,
        defaultBranch: m.default_branch,
        language: m.language || '',
        stars: m.stargazers_count,
        forks: m.forks_count,
        openIssues: m.open_issues_count,
        pushedAt: m.pushed_at,
        sizeKb: m.size,
      },
      readme: data.readme.slice(0, 8000),
    });
  } catch (err) {
    ghHandle(err, res);
  }
});

// GET /api/github/tree/:owner/:repo/:branch -> recursive file tree (paths + types only)
app.get('/api/github/tree/:owner/:repo/:branch', rateLimit, async (req, res) => {
  const { owner, repo, branch } = req.params;
  try {
    const sha = await ghCached(`sha:${owner}/${repo}:${branch}`, 120_000, async () => {
      const ref = await ghFetch(`/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`);
      return ref.commit.sha;
    });
    const tree = await ghCached(`tree:${owner}/${repo}:${sha}`, 300_000, () =>
      ghFetch(`/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`)
    );
    const files = (tree.tree || [])
      .filter((n) => n.type === 'blob')
      .map((n) => n.path)
      .filter((p) => !/(^|\/)(node_modules|\.git)\//.test(p))
      .slice(0, 1500);
    res.json({ ok: true, branch, truncated: Boolean(tree.truncated), count: files.length, files });
  } catch (err) {
    ghHandle(err, res);
  }
});

// GET /api/github/file?repo=owner/name&path=src/App.jsx -> single file content (raw)
app.get('/api/github/file', rateLimit, async (req, res) => {
  const repo = String(req.query.repo || '').trim();
  const p = String(req.query.path || '').trim();
  if (!/^[\w.\-]+\/[\w.\-]+$/.test(repo)) return res.status(400).json({ error: 'Query param "repo" must be owner/name.' });
  if (!p || p.includes('..')) return res.status(400).json({ error: 'Query param "path" is required.' });
  try {
    const data = await ghCached(`file:${repo}:${p}`, 120_000, async () => {
      const f = await ghFetch(`/repos/${repo}/contents/${encodeURIComponent(p).replace(/%2F/g, '/')}`);
      let content = '';
      let encoding = 'utf8';
      if (f.type === 'file' && typeof f.content === 'string') {
        encoding = f.encoding === 'base64' ? 'base64' : 'utf8';
        content = Buffer.from(f.content, encoding).toString('utf8');
      }
      return { path: f.path, size: f.size, type: f.type, content, truncated: (f.size || 0) > 120_000 };
    });
    if (data.type !== 'file') return res.status(400).json({ error: `"${p}" is a directory, not a file.` });
    res.json({ ok: true, ...data, content: data.content.slice(0, 120_000) });
  } catch (err) {
    ghHandle(err, res);
  }
});

// ---------- API: streaming chat ----------
app.post('/api/ai-stream', rateLimit, async (req, res) => {
  const { messages, persona, model, github } = req.body || {};

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

  // ---------- GitHub repo context ----------
  // When the client sends { github: { owner, repo, branch } }, the server pulls a
  // repo snapshot (file tree + README + any file paths the user mentions) and
  // injects it into the system prompt, so the AI answers with real repo data.
  if (github && typeof github === 'object' && GITHUB_TOKEN) {
    const owner = String(github.owner || '').replace(/[^\w.\-]/g, '');
    const repo = String(github.repo || '').replace(/[^\w.\-]/g, '');
    const branch = String(github.branch || '').replace(/[^\w.\-]/g, '');
    if (owner && repo) {
      try {
        const [meta, tree] = await Promise.all([
          ghCached(`repo:${owner}/${repo}`, 120_000, () => ghFetch(`/repos/${owner}/${repo}`)),
          ghFetch(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch || 'HEAD')}?recursive=1`).catch(() => null),
        ]);
        const files = (tree && tree.tree ? tree.tree : [])
          .filter((n) => n.type === 'blob')
          .map((n) => n.path)
          .filter((p) => !/(^|\/)(node_modules|\.git)\//.test(p))
          .slice(0, 400);
        let context = `\n\n## Connected GitHub repository: ${owner}/${repo}${branch ? ` (branch: ${branch})` : ''}\n`;
        context += `Description: ${meta.description || 'none'} | Language: ${meta.language || 'unknown'} | Stars: ${meta.stargazers_count || 0} | Default branch: ${meta.default_branch}\n\n`;
        context += `### File tree (${files.length} files)\n`;
        context += files.map((p) => `- ${p}`).join('\n');
        context += '\n\n### README (first part)\n';
        context += await ghCached(`readme:${owner}/${repo}`, 120_000, () =>
          ghFetch(`/repos/${owner}/${repo}/readme`)
            .then((r) => Buffer.from(r.content || '', r.encoding || 'base64').toString('utf8').slice(0, 4000))
            .catch(() => '(no README)')
        );
        // If the latest user message mentions file paths that exist in the repo,
        // attach their contents so the AI can read them without extra round-trips.
        const lastUser = [...messages].reverse().find((m) => m.role === 'user');
        const text = typeof (lastUser && lastUser.content) === 'string' ? lastUser.content : '';
        const mentioned = files.filter((p) => {
          const base = p.split('/').pop();
          return text && p !== 'package-lock.json' && (text.includes(p) || text.includes(base));
        }).slice(0, 3);
        for (const p of mentioned) {
          try {
            const f = await ghCached(`file:${owner}/${repo}:${p}`, 120_000, () =>
              ghFetch(`/repos/${owner}/${repo}/contents/${encodeURIComponent(p).replace(/%2F/g, '/')}`)
            );
            if (f.type === 'file' && typeof f.content === 'string') {
              const body = Buffer.from(f.content, f.encoding === 'base64' ? 'base64' : 'utf8').toString('utf8');
              context += `\n\n### File: ${p}\n\`\`\`\n${body.slice(0, 6000)}\n\`\`\`\``;
            }
          } catch { /* skip unreadable file */ }
        }
        context += `\n\nUse this repository data when answering. If the user asks about a file not shown, tell them the path from the tree above and answer from your best understanding.`;
        systemContent += context;
      } catch (err) {
        console.warn('[ai-stream] github context skipped:', err.message);
      }
    }
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
  console.log(`  github : ${GITHUB_TOKEN ? 'connector ready — list at GET /api/github/status' : 'connector off (no GITHUB_TOKEN in .env)'}`);
  if (process.env.KENOAI_MODEL && !MODELS.some((m) => m.id === process.env.KENOAI_MODEL)) {
    console.warn(`  warning: KENOAI_MODEL="${process.env.KENOAI_MODEL}" is not in the catalogue — using ${DEFAULT_MODEL}.`);
  }
});
