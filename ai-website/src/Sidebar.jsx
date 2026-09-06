import React, { memo, useMemo, useState, forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import { groupSessions } from './lib.js';
import {
  IcoSearch, IcoPlus, IcoChat, IcoDots, IcoPin, IcoClose, IcoSpark, IcoCheck, IcoInbox,
  IcoCalendar, IcoReports, IcoFile, IcoBolt, IcoFolder, IcoStar, IcoUpload,
} from './icons.jsx';

// ============================================================
// Sidebar (Workspace edition) — navigation + projects + chat list
// + workspace files (per chat) + Pro card at the bottom.
// ============================================================

const NavItem = memo(function NavItem({ id, label, icon, active, badge, onClick }) {
  return (
    <button type="button" role="tab" aria-selected={active} className={`ws-nav-item ${active ? 'on' : ''}`} onClick={() => onClick(id)} title={label}>
      <span className="ws-nav-ico">{icon}</span>
      <span className="ws-nav-label">{label}</span>
      {badge > 0 && <span className="ws-nav-badge">{badge}</span>}
    </button>
  );
});

const Sidebar = memo(forwardRef(function Sidebar(
  { sessions, activeId, onSelect, onNew, onItemMenu, collapsed, open,
    view, onNavigate, projects, activeProjectId, onOpenProject,
    inboxCount, taskCount, sessionFiles, onFileUpload, onFileRemove, onFilePreview },
  ref
) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  useImperativeHandle(ref, () => ({ focusSearch: () => inputRef.current?.focus() }), []);

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

  const pick = useCallback((id) => { onSelect(id, true); onNavigate('chat'); }, [onSelect, onNavigate]);

  const files = (sessionFiles || []).filter((f) => f.sessionId === activeId);
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Workspace">
      <div className="sb-top">
        <a className="brand" href="/" onClick={(e) => e.preventDefault()}>
          <img src="/icon-192.png" alt="" width="30" height="30" />
          Keno<span className="grad">Ai</span>
        </a>
        <button type="button" className="icon-btn sb-close" onClick={() => onSelect(null, true)} aria-label="Close sidebar">
          <IcoClose />
        </button>
      </div>

      <div className="ws-nav">
        <NavItem id="home" label="Home" icon={<IcoSpark />} active={view === 'home'} onClick={onNavigate} />
        <NavItem id="chat" label="KenOAI Assistant" icon={<IcoChat />} active={view === 'chat'} onClick={onNavigate} />
        <NavItem id="tasks" label="My tasks" icon={<IcoCheck />} active={view === 'tasks'} onClick={onNavigate} badge={taskCount} />
        <NavItem id="inbox" label="Inbox" icon={<IcoInbox />} active={view === 'inbox'} onClick={onNavigate} badge={inboxCount} />
        <NavItem id="calendar" label="Calendar" icon={<IcoCalendar />} active={view === 'calendar'} onClick={onNavigate} />
        <NavItem id="reports" label="Reports & Analytics" icon={<IcoReports />} active={view === 'reports'} onClick={onNavigate} />
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
            {list.map((s) => {
              const pr = projects.find((p) => p.id === s.projectId);
              return (
                <div
                  key={s.id}
                  role="listitem"
                  tabIndex={0}
                  className={`chat-item ${s.id === activeId && view === 'chat' ? 'active' : ''}`}
                  onClick={() => pick(s.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') pick(s.id); }}
                  aria-current={s.id === activeId && view === 'chat' ? 'true' : undefined}
                >
                  {pr && <span className="chat-proj-dot" style={{ background: pr.color }} title={pr.name} />}
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
              );
            })}
          </section>
        ))}
      </nav>

      <div className="ws-sec-label">My projects</div>
      <div className="ws-proj-list">
        {projects.map((p) => {
          const n = sessions.filter((s) => s.projectId === p.id).length;
          return (
            <div
              key={p.id}
              role="button" tabIndex={0}
              className={`ws-proj-item ${p.id === activeProjectId ? 'on' : ''}`}
              onClick={() => onOpenProject(p.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') onOpenProject(p.id); }}
              title={`${p.name} — ${n} chat${n === 1 ? '' : 's'}`}
            >
              <span className="ws-proj-dot" style={{ background: p.color }} />
              <span className="ws-proj-name">{p.name}</span>
              <span className="ws-proj-count">{n}</span>
            </div>
          );
        })}
      </div>

      <div className="ws-files" data-visible={view === 'chat'}>
        <div className="ws-files-head">
          <span className="ws-files-title">Workspace files</span>
          <button type="button" onClick={() => fileRef.current?.click()} aria-label="Add workspace file" title="Add file">
            <IcoPlus />
          </button>
        </div>
        {files.length === 0 && <div className="ws-files-empty">No files in this chat yet.</div>}
        {files.map((f) => (
          <div key={f.id} className="ws-file-row" onClick={() => onFilePreview(f)} role="button" tabIndex={0}>
            <span className="ws-file-ico"><IcoFile /></span>
            <span className="ws-file-name" title={f.name}>{f.name}</span>
            <span className="ws-file-size">{fmtSize(f.size)}</span>
            <button
              type="button"
              className="ws-file-x"
              aria-label={`Remove ${f.name}`}
              onClick={(e) => { e.stopPropagation(); onFileRemove(f.id); }}
            >
              <IcoClose />
            </button>
          </div>
        ))}
        <div
          className="ws-files-drop"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('drag')}
          onDrop={(e) => {
            e.preventDefault(); e.currentTarget.classList.remove('drag');
            const fl = e.dataTransfer.files?.[0];
            if (fl) onFileUpload(fl);
          }}
        >
          Drop a file or click to attach it to this chat
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,.json,.csv,.js,.jsx,.py,.html,.css,.pdf,.png,.jpg,.jpeg,.webp"
          style={{ display: 'none' }}
          onChange={(e) => { const fl = e.target.files?.[0]; if (fl) onFileUpload(fl); e.target.value = ''; }}
          aria-hidden="true"
        />
      </div>

      <div className="ws-pro">
        <div className="ws-pro-ttl"><IcoStar /> KenoAi Pro</div>
        <p>Unlimited AI + priority support</p>
        <button type="button" className="ws-pro-btn" onClick={() => window.open('https://www.buymeacoffee.com/kenopsia', '_blank', 'noopener')}>Upgrade</button>
      </div>

      <div className="sb-foot">
        <span className="foot-meta">History is stored locally in your browser</span>
        <button type="button" className="foot-up" onClick={onNew} title="New conversation">
          <IcoBolt /> New chat
        </button>
      </div>
    </aside>
  );
}));

function fmtSize(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

export default Sidebar;
