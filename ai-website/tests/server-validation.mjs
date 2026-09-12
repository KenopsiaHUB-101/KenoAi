import assert from 'node:assert/strict';
import http from 'node:http';

process.env.NODE_ENV = 'test';
process.env.OPENROUTER_API_KEY = 'test-only';
// Keep this smoke test focused on request validation. Production Supabase
// configuration may exist in the shell where the test is executed.
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
delete process.env.GOOGLE_CLIENT_ID;

const { app } = await import('../server.js');
const server = http.createServer(app);
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

try {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  const healthBody = await health.json();
  assert.equal(healthBody.ok, true);
  assert.equal(typeof healthBody.metrics.requests, 'number');
  assert.equal(typeof healthBody.uptimeSec, 'number');
  assert.match(health.headers.get('x-request-id') || '', /.+/);
  assert.match(health.headers.get('content-security-policy') || '', /frame-ancestors 'none'/);

  const metrics = await fetch(`${base}/api/metrics`);
  assert.equal(metrics.status, 200);
  assert.equal((await metrics.json()).ok, true);

  const tools = await fetch(`${base}/api/agent/tools`);
  assert.equal(tools.status, 200);
  assert.ok((await tools.json()).tools.some((tool) => tool.name === 'github_file'));

  const unknownTool = await fetch(`${base}/api/agent/tool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'shell_exec', args: { command: 'pwd' } }),
  });
  assert.equal(unknownTool.status, 400);

  const runner = await fetch(`${base}/api/agent/runner`);
  assert.equal(runner.status, 200);
  assert.equal((await runner.json()).enabled, false);

  const patchPreview = await fetch(`${base}/api/agent/patch/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patch: '--- a/.env\n+++ b/.env\n@@ -1 +1 @@\n-secret\n+changed\n' }),
  });
  assert.equal(patchPreview.status, 400);

  const patchApply = await fetch(`${base}/api/agent/patch/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approvalId: 'not-valid' }),
  });
  assert.equal(patchApply.status, 403);

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
