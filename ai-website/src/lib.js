// ============================================================
// KenoAi — shared utilities
// ============================================================

let counter = 0;
export const uid = () =>
  `${Date.now().toString(36)}-${(counter++).toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const API = '/api';

/** Compact localStorage wrapper that never throws (Safari private mode, quota). */
export const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  },
};

/** Trim history to the last N pairs to keep payloads + storage small. */
export function trimForApi(messages, maxPairs = 12) {
  if (messages.length <= maxPairs * 2 + 1) return messages;
  return messages.slice(-(maxPairs * 2));
}

/** Downscale + compress an image file to a data URL (max 1152px, ~85% quality). */
export function compressImage(file, maxDim = 1152, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!/^image\//.test(file.type)) return reject(new Error('Not an image'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0,  0, w, h);
        URL.revokeObjectURL(url);
        const type = /png|webp/.test(file.type) && canvas.toDataURL('image/webp').startsWith('data:image/webp')
          ? 'image/webp'
          : 'image/jpeg';
        resolve({ dataUrl: canvas.toDataURL(type, quality), w, h });
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Invalid image')); };
    img.src = url;
  });
}

/** Group sessions by recency buckets. */
export function groupSessions(sessions) {
  const now = Date.now();
  const DAY = 86400000;
  const buckets = [
    ['Pinned', []],
    ['Today', []],
    ['Yesterday', []],
    ['Previous 7 Days', []],
    ['Previous 30 Days', []],
    ['Older', []],
  ];
  for (const s of sessions) {
    if (s.pinned) { buckets[0][1].push(s); continue; }
    const age = now - (s.updatedAt || s.createdAt || s.id * 1 || now);
    if (age < DAY) buckets[1][1].push(s);
    else if (age < 2 * DAY) buckets[2][1].push(s);
    else if (age < 7 * DAY) buckets[3][1].push(s);
    else if (age < 30 * DAY) buckets[4][1].push(s);
    else buckets[5][1].push(s);
  }
  return buckets.filter(([, list]) => list.length > 0);
}

/** Split a raw SSE byte stream into JSON payloads. Handles chunks split across reads. */
export async function* sseLines(reader) {
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (line.startsWith('data:')) yield line.slice(5).trim();
    }
  }
  const rest = buf.trim();
  if (rest.startsWith('data:')) yield rest.slice(5).trim();
}

/** Extract the delta text from an OpenRouter-compatible chunk. */
export function deltaText(json) {
  return json?.choices?.[0]?.delta?.content || '';
}

