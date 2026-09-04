import React, { memo, useMemo, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { groupSessions } from './lib.js';
import { IcoSearch, IcoPlus, IcoChat, IcoDots, IcoPin, IcoClose } from './icons.jsx';

// ============================================================
// Sidebar — owns its search state so typing in the search box
// never re-renders the chat area (performance by isolation).
// ============================================================

const Sidebar = memo(forwardRef(function Sidebar(
  { sessions, activeId, onSelect, onNew, onItemMenu, collapsed, open },
  ref
) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({ focusSearch: () => { inputRef.current?.focus(); } }), []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? sessions.filter(
          (s) =>
            (s.title || '').toLowerCase().includes(q) ||
            (s.messages || []).some((m) =>
              typeof m.content === 'string' && m.content.toLowerCase().includes(q)
            )
        )
      : sessions;
    return groupSessions(filtered);
  }, [sessions, query]);

  const pick = useCallback((id) => onSelect(id, true), [onSelect]);

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Chat history">
      <div className="sb-top">
        <a className="brand" href="/" onClick={(e) => e.preventDefault()}>
          <img src="/icon-192.png" alt="" width="30" height="30" />
          Keno<span className="grad">Ai</span>
        </a>
        <button type="button" className="icon-btn sb-close" onClick={() => onSelect(null, true)} aria-label="Close sidebar">
          <IcoClose />
        </button>
      </div>

      <div className="sb-search">
        <div className="search-box">
          <IcoSearch />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search chats…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search chats"
          />
          <span className="kbd-hint">Ctrl K</span>
        </div>
      </div>

      <div className="sb-actions">
        <button type="button" className="btn-new" onClick={onNew}>
          <IcoPlus /> New Conversation
        </button>
      </div>

      <nav className="history scroll-y" role="list">
        {groups.length === 0 && (
          <div className="empty-history">No conversations found.</div>
        )}
        {groups.map(([label, list]) => (
          <section key={label}>
            <div className="hist-group-label">{label}</div>
            {list.map((s) => (
              <div
                key={s.id}
                role="listitem"
                tabIndex={0}
                className={`chat-item ${s.id === activeId ? 'active' : ''}`}
                onClick={() => pick(s.id)}
                onKeyDown={(e) => { if (e.key === 'Enter') pick(s.id); }}
                aria-current={s.id === activeId ? 'true' : undefined}
              >
                <span className="chat-ico"><IcoChat /></span>
                <span className="title">{s.title || 'Conversation'}</span>
                {s.pinned && <span className="pin-mark" title="Pinned"><IcoPin /></span>}
                <button
                  type="button"
                  className="more-btn"
                  aria-label={`Options for ${s.title || 'conversation'}`}
                  onClick={(e) => { e.stopPropagation(); onItemMenu(e, s); }}
                >
                  <IcoDots />
                </button>
              </div>
            ))}
          </section>
        ))}
      </nav>

      <div className="sb-foot">
        <span className="foot-meta">History is stored locally in your browser</span>
      </div>
    </aside>
  );
}));

export default Sidebar;

