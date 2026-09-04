import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, Suspense, lazy } from 'react';
import Sidebar from './Sidebar.jsx';
import Composer from './Composer.jsx';
import Markdown from './Markdown.jsx';
const Message = lazy(() => import('./Message.jsx'));
const Landing = lazy(() => import('./Landing.jsx'));
import { uid, store, trimForApi, compressImage, sseLines, deltaText } from './lib.js';
import {
  IcoMenu, IcoSidebar, IcoSearch, IcoPlus, IcoDots, IcoSun, IcoMoon, IcoArrowDown,
  IcoTrash, IcoPencil, IcoPin, IcoDownload, IcoBroom, IcoKeyboard, IcoSpark, IcoAlert, IcoFile,
} from './icons.jsx';

const PERSONAS = [
  { id: 'professional', label: 'Professional' },
  { id: 'programmer', label: 'Developer' },
  { id: 'casual', label: 'Casual' },
];

const SUGGESTIONS = [
  'Explain how transformers work, simply',
  'Write a Python script to rename files',
  'Ideas for a weekend project',
  'Help me draft a polite follow-up email',
];

const PERSONA_PROMPTS = {
  professional: 'You are KenoAi, an advanced, accurate and friendly AI assistant. Be clear, structured and concise. Use Markdown formatting well.',
  programmer: 'You are KenoAi, an expert software engineer. Give correct, production-quality code with best practices, brief explanations, and note edge cases.',
  casual: 'You are KenoAi, a relaxed, friendly companion. Chat naturally with everyday language, keep it fun and supportive.',
};

function makeSession() {
  return { id: uid(), title: 'New Conversation', messages: [], createdAt: Date.now(), updatedAt: Date.now() };
}

export default function App() {
  // ---------- Authentication State ----------
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user has valid auth token
    const token = store.get('kenoai_auth_token');
    const timestamp = store.get('kenoai_auth_timestamp');
    // Token valid for 30 days
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (token && timestamp && (Date.now() - timestamp) < thirtyDaysMs) {
      return true;
    }
    return false;
  });
  const [authLoading, setAuthLoading] = useState(false);

  // If not authenticated, show Landing page
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
        <Landing 
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            // Trigger re-render to switch to chat
          }}
        />
      </Suspense>
    );
  }

  // ---------- State (kept minimal & flat) ----------
  const [sessions, setSessions] = useState(() => {
    const saved = store.get('kenoai_sessions_v2');
    if (Array.isArray(saved) && saved.length) return saved;
    const legacy = store.get('kenoai_sessions');
    if (Array.isArray(legacy) && legacy.length) {
      return legacy.map((s) => ({
        ...s,
        id: typeof s.id === 'number' ? `m-${s.id}` : s.id,
        createdAt: s.createdAt || Date.now(),
        updatedAt: s.updatedAt || Date.now(),
      }));
    }
    return [makeSession()];
  });
  const [activeId, setActiveId] = useState(() => sessions[0]?.id);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [collapsed, setCollapsed] = useState(() => store.get('kenoai_sidebar_collapsed') === true);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const [persona, setPersona] = useState(() => store.get('kenoai_persona', 'professional'));
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [dialog, setDialog] = useState(null); // {type, id?, title?}
  const [menu, setMenu] = useState(null);    // {x, y, items}
  const [image, setImage] = useState(null);  // {dataUrl, name}

  // ---------- Refs ----------
  const chatRef = useRef(null);
  const composerRef = useRef(null);
  const abortRef = useRef(null);
  const stickBottomRef = useRef(true);
  // Id of the assistant message currently streaming (drives caret + "streaming" pill)
  const streamIdRef = useRef(null);
  const sessionsRef = useRef(sessions);
  const activeIdRef = useRef(activeId);
  sessionsRef.current = sessions;
  activeIdRef.current = activeId;

  // ---------- Derived ----------
  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeId) || sessions[0],
    [sessions, activeId]
  );
  const messages = activeSession?.messages || [];
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // ---------- Persistence (debounced, quota-aware) ----------
  useEffect(() => {
    const t = setTimeout(() => {
      const ok = store.set('kenoai_sessions_v2', sessions);
      if (!ok) {
        // Quota exceeded: strip base64 images from history and retry once.
        const slim = sessions.map((s) => ({
          ...s,
          messages: s.messages.map((m) => ({ ...m, imagePreview: undefined })),
        }));
        if (store.set('kenoai_sessions_v2', slim)) setToast('Storage full — images removed from saved history.');
      }
    }, 700);
    return () => clearTimeout(t);
  }, [sessions]);

  useEffect(() => { store.set('kenoai_persona', persona); }, [persona]);
  useEffect(() => { store.set('kenoai_sidebar_collapsed', collapsed); }, [collapsed]);
  useEffect(() => { document.documentElement.dataset.theme = theme; store.set('kenoai_theme', theme); }, [theme]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); } }, [toast]);

  // ---------- Scrolling ----------
  const scrollToBottom = useCallback((smooth = true) => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  const onChatScroll = useCallback(() => {
    const el = chatRef.current;
    if (!el) return;
    stickBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
    setJump(el.scrollHeight - el.scrollTop - el.clientHeight > 400);
  }, []);

  const [jump, setJump] = useState(false);

  // Keep pinned to bottom when new messages arrive (but only if user is near bottom)
  useLayoutEffect(() => {
    if (stickBottomRef.current) scrollToBottom(messages.length <= 2);
  }, [messages.length, activeId]);

  // ---------- Sidebar behaviors ----------
  const toggleSidebar = useCallback(() => {
    if (isDesktop) setCollapsed((c) => !c);
    else setSidebarOpen((o) => !o);
  }, [isDesktop]);

  const handleSelect = useCallback((id, closeIt) => {
    if (id) setActiveId(id);
    if (closeIt && !isDesktop) setSidebarOpen(false);
  }, [isDesktop]);

  const handleNew = useCallback(() => {
    const s = makeSession();
    setSessions((prev) => [s, ...prev]);
    setActiveId(s.id);
    stickBottomRef.current = true;
    if (!isDesktop) setSidebarOpen(false);
    setTimeout(() => composerRef.current?.focus(), 60);
  }, [isDesktop]);

  // ---------- Session ops ----------
  const patchSession = useCallback((id, patch) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: Date.now() } : s)));
  }, []);

  const deleteSession = useCallback((id) => {
    setDialog({ type: 'delete', id, title: sessionsRef.current.find((s) => s.id === id)?.title });
  }, []);

  const renameSession = useCallback((id) => {
    setDialog({ type: 'rename', id, title: sessionsRef.current.find((s) => s.id === id)?.title || '' });
  }, []);

  const togglePin = useCallback((id) => {
    const s = sessionsRef.current.find((x) => x.id === id);
    if (s) patchSession(id, { pinned: !s.pinned });
  }, [patchSession]);

  const exportSession = useCallback((id) => {
    const s = sessionsRef.current.find((x) => x.id === id);
    if (!s) return;
    const text = (s.messages || [])
      .map((m) => {
        const who = m.role === 'user' ? 'You' : 'KenoAi';
        const body = typeof m.content === 'string' ? m.content : m.rawText || '';
        return `## ${who}\n\n${body}\n`;
      })
      .join('\n');
    const blob = new Blob([`# ${s.title}\n\n${text}`], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(s.title || 'chat').replace(/[^\w\- ]+/g, '').slice(0, 40) || 'chat'}.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    setToast('Conversation exported');
  }, []);

  // ---------- Context menu ----------
  const openMenu = useCallback((e, items) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - items.length * 40 - 20);
    setMenu({ x, y, items });
  }, []);

  const chatItemMenu = useCallback((e, s) => {
    openMenu(e, [
      { label: 'Rename', icon: <IcoPencil />, act: () => renameSession(s.id) },
      { label: s.pinned ? 'Unpin' : 'Pin to top', icon: <IcoPin />, act: () => togglePin(s.id) },
      { label: 'Export as Markdown', icon: <IcoDownload />, act: () => exportSession(s.id) },
      { sep: true },
      { label: 'Delete', icon: <IcoTrash />, danger: true, act: () => deleteSession(s.id) },
    ]);
  }, [openMenu, renameSession, togglePin, exportSession, deleteSession]);

  const headerMenu = useCallback((e) => {
    openMenu(e, [
      { label: 'New conversation', icon: <IcoPlus />, act: handleNew },
      { label: 'Search chats', icon: <IcoSearch />, act: () => sidebarRef.current?.focusSearch() },
      { label: 'Export current chat', icon: <IcoDownload />, act: () => exportSession(activeIdRef.current) },
      { label: 'Clear messages in this chat', icon: <IcoBroom />, act: () => setDialog({ type: 'clear' }) },
      { sep: true },
      { label: 'Keyboard shortcuts', icon: <IcoKeyboard />, act: () => setDialog({ type: 'shortcuts' }) },
      { label: 'Delete all history', icon: <IcoTrash />, danger: true, act: () => setDialog({ type: 'wipe' }) },
      { sep: true },
      { label: 'Sign out', icon: <IcoAlert />, danger: true, act: () => {
        store.remove('kenoai_auth_token');
        store.remove('kenoai_auth_timestamp');
        window.location.reload();
      }},
    ]);
  }, [openMenu, handleNew, exportSession]);

  const sidebarRef = useRef(null);

  // ---------- Dialog actions ----------
  const closeDialog = () => setDialog(null);

  const runDialog = useCallback(() => {
    if (!dialog) return;
    if (dialog.type === 'delete') {
      setSessions((prev) => {
        const rest = prev.filter((s) => s.id !== dialog.id);
        const next = rest.length ? rest : [makeSession()];
        if (activeIdRef.current === dialog.id) setActiveId(next[0].id);
        return next;
      });
      setToast('Conversation deleted');
    } else if (dialog.type === 'rename') {
      const input = document.getElementById('rename-input');
      if (input && input.value.trim()) patchSession(dialog.id, { title: input.value.trim() });
    } else if (dialog.type === 'clear') {
      patchSession(activeIdRef.current, { messages: [] });
      setToast('Messages cleared');
    } else if (dialog.type === 'wipe') {
      store.remove('kenoai_sessions_v2');
      store.remove('kenoai_sessions');
      const fresh = makeSession();
      setSessions([fresh]);
      setActiveId(fresh.id);
      setToast('All history deleted');
    }
    closeDialog();
  }, [dialog, patchSession]);

  // ---------- Image handling ----------
  const handleFile = useCallback(async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    try {
      const { dataUrl } = await compressImage(file);
      setImage({ dataUrl, name: file.name });
    } catch {
      setToast('Could not read that image');
    }
  }, []);

  // ---------- Speech ----------
  const recRef = useRef(null);
  const [recActive, setRecActive] = useState(false);

  const toggleMic = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setToast('Voice input is not supported in this browser'); return; }
    if (recActive) {
      recRef.current?.stop();
      setRecActive(false);
      return;
    }
    try {
      const rec = new SR();
      recRef.current = rec;
      rec.lang = navigator.language || 'en-US';
      rec.interimResults = true;
      rec.continuous = false;
      let base = composerRef.current?.value || '';
      rec.onresult = (ev) => {
        let finalText = '';
        let interim = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const t = ev.results[i][0].transcript;
          if (ev.results[i].isFinal) finalText += t;
          else interim += t;
        }
        if (finalText) {
          composerRef.current?.set(((base ? base + ' ' : '') + finalText).trim());
          base = (base ? base + ' ' : '') + finalText;
        }
      };
      rec.onend = () => setRecActive(false);
      rec.onerror = () => setRecActive(false);
      rec.start();
      setRecActive(true);
    } catch {
      setToast('Could not start voice input');
    }
  }, [recActive]);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = String(text).replace(/[#*`_~>|]/g, '').slice(0, 4000);
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = navigator.language || 'en-US';
    window.speechSynthesis.speak(u);
  }, []);

  // ---------- Send / stream ----------
  const handleSend = useCallback(async (rawText) => {
    const text = (rawText || '').trim();
    if ((!text && !image) || loading) return;

    const sid = activeIdRef.current;
    const img = image;
    const userMsg = {
      id: uid(),
      role: 'user',
      content: img
        ? [
            { type: 'text', text: text || 'Analyze this image' },
            { type: 'image_url', image_url: { url: img.dataUrl } },
          ]
        : text,
      rawText: text,
      imagePreview: img ? img.dataUrl : undefined,
      ts: Date.now(),
    };
    const aiMsg = { id: uid(), role: 'assistant', content: '', ts: Date.now() };

    let history;
    setSessions((prev) => {
      history = prev.map((s) => {
        if (s.id !== sid) return s;
        const msgs = [...s.messages, userMsg];
        return {
          ...s,
          title: s.messages.length === 0 ? (text ? (text.length > 32 ? text.slice(0, 32) + '…' : text) : 'Image analysis') : s.title,
          messages: msgs,
          updatedAt: Date.now(),
        };
      });
      return history;
    });
    setImage(null);
    setLoading(true);
    setError(null);
    stickBottomRef.current = true;

    // Build API payload synchronously from the captured history snapshot
    const session = history.find((s) => s.id === sid);
    const apiMessages = [{ role: 'system', content: PERSONA_PROMPTS[personaRef.current] }]
      .concat(trimForApi(session.messages).map((m) => ({ role: m.role, content: m.content })));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/ai-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, persona: personaRef.current }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Server responded ${res.status}`);

      // Append the assistant bubble once the stream opens.
      streamIdRef.current = aiMsg.id;
      setSessions((prev) => prev.map((s) => (s.id === sid ? { ...s, messages: [...s.messages, aiMsg] } : s)));

      let acc = '';
      let raf = 0;
      let pending = false;
      const commit = () => {
        raf = 0;
        if (!pending) return;
        pending = false;
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== sid) return s;
            const msgs = s.messages.slice();
            const i = msgs.findIndex((m) => m.id === aiMsg.id);
            if (i === -1) return s;
            msgs[i] = { ...msgs[i], content: acc };
            return { ...s, messages: msgs, updatedAt: Date.now() };
          })
        );
      };

      for await (const data of sseLines(res.body.getReader())) {
        if (!data || data === '[DONE]') continue;
        let json;
        try { json = JSON.parse(data); } catch { continue; }
        if (json.error) throw new Error(json.error);
        const chunk = deltaText(json);
        if (!chunk) continue;
        acc += chunk;
        pending = true;
        if (!raf) raf = requestAnimationFrame(commit);
      }
      if (pending) commit();
      if (raf) cancelAnimationFrame(raf);
    } catch (err) {
      if (err.name === 'AbortError') {
        setToast('Generation stopped');
      } else {
        setError(err.message || 'Connection failed');
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== sid) return s;
            const has = s.messages.some((m) => m.id === aiMsg.id);
            const failMsg = { ...aiMsg, content: `**Connection error.** ${err.message || 'Please try again.'}`, error: true };
            return { ...s, messages: has ? s.messages.map((m) => (m.id === aiMsg.id ? failMsg : m)) : [...s.messages, failMsg] };
          })
        );
      }
    } finally {
      abortRef.current = null;
      streamIdRef.current = null;
      setLoading(false);
      setTimeout(() => composerRef.current?.focus(), 30);
    }
  }, [image, loading, persona]); // eslint-disable-line

  const personaRef = useRef(persona);
  personaRef.current = persona;

  const stopGen = useCallback(() => { abortRef.current?.abort(); }, []);

  const retry = useCallback(() => {
    const s = sessionsRef.current.find((x) => x.id === activeIdRef.current);
    if (!s) return;
    const msgs = s.messages.filter((m) => !(m.error && m.role === 'assistant'));
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    patchSession(s.id, { messages: msgs.slice(0, msgs.lastIndexOf(lastUser)) });
    setTimeout(() => {
      handleSendRef.current(lastUser.rawText || 'Analyze this image');
    }, 30);
  }, [patchSession]);

  const handleSendRef = useRef(handleSend);
  handleSendRef.current = handleSend;

  // ---------- Global keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); sidebarRef.current?.focusSearch(); }
      else if (mod && e.shiftKey && e.key.toLowerCase() === 'o') { e.preventDefault(); handleNew(); }
      else if (mod && e.key === '/') { e.preventDefault(); composerRef.current?.focus(); }
      else if (e.key === 'Escape') {
        if (menu) setMenu(null);
        else if (dialog) closeDialog();
        else if (!isDesktop && sidebarOpen) setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu, dialog, handleNew, isDesktop, sidebarOpen]);

  // Click-away for menus
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener('click', close, { once: true });
    window.addEventListener('resize', close, { once: true });
    return () => { window.removeEventListener('click', close); window.removeEventListener('resize', close); };
  }, [menu]);

  // Reset the overlay state when crossing the desktop breakpoint.
  useEffect(() => {
    setSidebarOpen(false);
  }, [isDesktop]);

  return (
    <div className={`app ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {!isDesktop && sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)} />}

      <Sidebar
        ref={sidebarRef}
        sessions={sessions}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onItemMenu={chatItemMenu}
        collapsed={isDesktop && collapsed}
        open={isDesktop || sidebarOpen}
      />

      <main className="main">
        <header className="topbar">
          {!isDesktop && (
            <button type="button" className="icon-btn btn-menu" onClick={toggleSidebar} aria-label="Open menu">
              <IcoMenu />
            </button>
          )}
          {isDesktop && (
            <button type="button" className="icon-btn btn-menu" onClick={toggleSidebar} aria-label="Toggle sidebar">
              <IcoSidebar />
            </button>
          )}
          <div className="ttl" title={activeSession?.title}>
            {activeSession?.title || 'Conversation'} <span className="accent">· {PERSONAS.find((p) => p.id === persona)?.label}</span>
          </div>
          <div className="topbar-right">
            <div className="pill" title={error ? 'Connection error' : 'Connected'}>
              <span className="dot" style={{ background: error ? 'var(--danger)' : '#34d399' }} />
              {error ? 'Offline' : 'KenoAi v2'}
            </div>
            <div className="persona" role="tablist" aria-label="Persona">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={persona === p.id}
                  className={persona === p.id ? 'on' : ''}
                  onClick={() => setPersona(p.id)}
                  title={`Persona: ${p.label}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button type="button" className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" title="Toggle theme">
              {theme === 'dark' ? <IcoSun /> : <IcoMoon />}
            </button>
            <button type="button" className="icon-btn" onClick={headerMenu} aria-label="More options" title="More">
              <IcoDots />
            </button>
           </div>
        </header>

        <div className="chat scroll-y" ref={chatRef} onScroll={onChatScroll} role="log" aria-live="polite">
          {messages.length === 0 ? (
            <div className="welcome">
              <img className="avatar" src="/kenoai-avatar.png" alt="KenoAi" width="84" height="84" />
              <div className="badge">Fast · Private · Streaming</div>
              <h1>Welcome to <span className="grad">KenoAi</span></h1>
              <p>Ask anything — code, ideas, explanations, images. Your history stays on this device.</p>
              <div className="chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="chip" onClick={() => { composerRef.current?.set(s); composerRef.current?.focus(); }}>
                    {s}
              </button>
                ))}
              </div>
            </div>
          ) : (
            <Suspense fallback={null}>
              {messages.map((m) => (
                <Message
                  key={m.id}
                  msg={m}
                  streaming={loading && m.id === streamIdRef.current}
                  onCopy={copyText}
                  onSpeak={speak}
                />
              ))}
            </Suspense>
          )}
        </div>

        {jump && (
          <button type="button" className="jump show" onClick={() => { stickBottomRef.current = true; scrollToBottom(); }} aria-label="Scroll to latest">
            <IcoArrowDown />
          </button>
        )}

        <Composer
          ref={composerRef}
          onSend={handleSend}
          onStop={stopGen}
          loading={loading}
          recActive={recActive}
          onFile={handleFile}
          hasImage={image?.dataUrl || null}
          imageName={image?.name}
          onRemoveImage={() => setImage(null)}
          onMicToggle={toggleMic}
        />
      </main>

      {/* Context menu */}
      {menu && (
        <div className="menu" style={{ left: menu.x, top: menu.y }} role="menu">
          {menu.items.map((it, i) =>
            it.sep ? <div key={i} className="menu-sep" /> : (
              <button key={i} type="button" role="menuitem" className={it.danger ? 'danger' : ''} onClick={() => { it.act(); setMenu(null); }}>
                {it.icon} {it.label}
              </button>
            )
          )}
        </div>
      )}

      {/* Dialogs */}
      {dialog && (
        <div className="veil" onClick={(e) => e.target === e.currentTarget && closeDialog()}>
          {dialog.type === 'shortcuts' ? (
            <div className="modal" role="dialog" aria-label="Keyboard shortcuts">
              <h3>Keyboard shortcuts</h3>
              <p className="sub">Work anywhere in the app.</p>
              <div className="sc-list">
                <div><span className="kbd">Ctrl</span> + <span className="kbd">K</span> Search chats</div>
                <div><span className="kbd">Ctrl</span> + <span className="kbd">Shift</span> + <span className="kbd">O</span> New conversation</div>
                <div><span className="kbd">Ctrl</span> + <span className="kbd">/</span> Focus message box</div>
                <div><span className="kbd">Enter</span> Send message</div>
                <div><span className="kbd">Shift</span> + <span className="kbd">Enter</span> New line</div>
                <div><span className="kbd">Esc</span> Close panels / stop</div>
              </div>
              <div className="row"><button className="btn-ghost" onClick={closeDialog}>Close</button></div>
            </div>
          ) : dialog.type === 'rename' ? (
            <div className="modal" role="dialog" aria-label="Rename conversation">
              <h3>Rename conversation</h3>
              <p className="sub">Give this chat a memorable name.</p>
              <input id="rename-input" className="modal-input" defaultValue={dialog.title} autoFocus
                     onKeyDown={(e) => e.key === 'Enter' && runDialog()} />
              <div className="row">
                <button className="btn-ghost" onClick={closeDialog}>Cancel</button>
                <button className="btn-danger" onClick={runDialog}>Save</button>
              </div>
            </div>
          ) : (
            <div className="modal" role="dialog" aria-label="Confirm">
              <h3>{dialog.type === 'wipe' ? 'Delete all history?' : dialog.type === 'clear' ? 'Clear this conversation?' : 'Delete conversation?'}</h3>
              <p className="sub">
                {dialog.type === 'wipe'
                  ? 'This permanently removes every saved conversation from this device.'
                  : dialog.type === 'clear'
                  ? 'All messages in this chat will be removed. The chat stays in your list.'
                  : `"${dialog.title || 'Conversation'}" will be permanently removed.`}
              </p>
              <div className="row">
                <button className="btn-ghost" onClick={closeDialog}>Cancel</button>
                <button className="btn-danger" onClick={runDialog}>{dialog.type === 'rename' ? 'Save' : 'Delete'}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

// ---------- Helpers ----------
function useMediaQuery(q) {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const fn = () => setM(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [q]);
  return m;
}

function copyText(t) {
  navigator.clipboard.writeText(t);
}

