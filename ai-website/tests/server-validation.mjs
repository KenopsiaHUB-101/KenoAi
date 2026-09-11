import assert from 'node:assert/strict';
import http from 'node:http';

process.env.NODE_ENV = 'test';
process.env.OPENROUTER_API_KEY = 'test-only';

const { app } = await import('../server.js');
const server = http.createServer(app);
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

try {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).ok, true);
  assert.match(health.headers.get('content-security-policy') || '', /frame-ancestors 'none'/);

  const invalidRole = await fetch(`${base}/api/ai-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'hacker', content: 'invalid' }] }),
  });
  assert.equal(invalidRole.status, 400);

  const invalidPersona = await fetch(`${base}/api/ai-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }], persona: 'unknown' }),
  });
  assert.equal(invalidPersona.status, 400);

  console.log('server-validation: ok');
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
