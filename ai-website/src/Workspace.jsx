import React, { memo, useMemo, useState, useCallback } from 'react';
import {
  IcoSpark, IcoChat, IcoCheck, IcoInbox, IcoCalendar, IcoReports, IcoPlus, IcoClock,
  IcoSendPaper, IcoFolder, IcoStar, IcoChevronRight, IcoChevronDown, IcoTrash, IcoPencil, IcoFile,
} from './icons.jsx';

// ============================================================
// Workspace views — Home / Tasks / Inbox / Calendar / Reports.
// All state lives in App.jsx; this file is pure presentational.
// ============================================================

const STATUSES = ['progress', 'todo', 'upcoming'];
const STATUS_LABEL = { progress: 'In Progress', todo: 'To Do', upcoming: 'Upcoming' };
const PRIO_LABEL = { high: 'HIGH', normal: 'NORMAL', low: 'LOW' };

function dueLabel(t, now) {
  if (!t.due) return null;
  const d = new Date(t.due);
  const days = Math.ceil((d - now) / 86400000);
  if (days < 0) return { txt: 'Overdue', over: true };
  if (days === 0) return { txt: 'Due today', over: t.prio === 'high' };
  if (days === 1) return { txt: 'Tomorrow' };
  if (days <= 7) return { txt: `${days} days left` };
  if (days <= 14) return { txt: 'Next week' };
  return { txt: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
}

/* ---------- Home ---------- */
export const WorkspaceHome = memo(function WorkspaceHome({ user, tasks, projects, onAsk, onAddTask, onMoveTask, onOpenProject, inboxCount, stats }) {
  const [ask, setAsk] = useState('');
  const now = useMemo(() => Date.now(), []);
  const name = (user?.name || user?.email || 'there').split(' ')[0].split('@')[0];
  const pct = useMemo(() => {
    const tot = tasks.length || 1;
    return Math.round((tasks.filter((t) => t.status === 'progress').length / tot) * 100);
  }, [tasks]);

  const askGo = () => {
    const v = ask.trim();
    if (!v) return;
    onAsk(v);
    setAsk('');
  };

  return (
    <div className="ws-page scroll-y">
      <div className="ws-top-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>KenoAi — Workspace</div>
        <span className="ws-live"><span className="dot" /> LIVE</span>
      </div>

      <div className="ws-status">
        <span className="ws-status-item teal"><span className="dot" /> Proposal delivered on time</span>
        <span className="ws-status-item purple"><span className="dot" /> Client confirmation scheduled</span>
      </div>

      <div className="ws-greet">
        <h1>Hello, <span className="grad">{name}</span></h1>
        <p>How can I help you today?</p>
        <div className="ws-ask">
          <input
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') askGo(); }}
            placeholder="Ask KenoAi to plan, draft, or summarize anything…"
            aria-label="Ask KenoAi"
          />
          <button type="button" className="ws-ask-btn" onClick={askGo}><IcoSendPaper /> Ask</button>
        </div>
      </div>

      <div className="ws-board">
        {STATUSES.map((st) => {
          const list = tasks.filter((t) => t.status === st);
          return (
            <section key={st} className="ws-col" data-col={st}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); onMoveTask(JSON.parse(e.dataTransfer.getData('text/plain')), st); }}>
              <div className="ws-col-head">
                <span className="ws-col-title">{STATUS_LABEL[st]}</span>
                <span className="ws-col-count">{list.length} task{list.length === 1 ? '' : 's'}</span>
              </div>
              <div className="ws-col-progress"><i style={{ width: `${st === 'progress' ? pct : Math.min(100, list.length * 25)}%` }} /></div>
              {list.map((t) => {
                const due = dueLabel(t, now);
                return (
                  <div key={t.id} className="ws-task" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ id: t.id }))}>
                    <div className="ws-task-top">
                      <span className={`chip-prio ${t.prio}`}>{PRIO_LABEL[t.prio]}</span>
                      <span className="ws-task-title">{t.title}</span>
                      <span className="ws-task-acts">
                        <button type="button" title="Mark done" onClick={() => onMoveTask({ id: t.id }, 'done')}><IcoCheck /></button>
                        <button type="button" title="Delete" onClick={() => onMoveTask({ id: t.id }, 'delete')}><IcoTrash /></button>
                      </span>
                    </div>
                    {due && <span className={`ws-task-due ${due.over ? 'over' : ''}`}><IcoClock /> {due.txt}</span>}
                  </div>
                );
              })}
              <button type="button" className="ws-add-task" onClick={() => onAddTask(st)}><IcoPlus /> Add task</button>
            </section>
          );
        })}
      </div>

      <div className="ws-widgets">
        <div className="ws-card ws-widget">
          <h3>Projects</h3>
          {projects.map((p) => (
            <div key={p.id} className={`ws-proj-item ${p.active ? 'on' : ''}`} onClick={() => onOpenProject(p.id)} role="button" tabIndex={0}>
              <span className="ws-proj-dot" style={{ background: p.color }} />
              <span>{p.name}</span>
              <span className="ws-proj-meta">{p.progress}%</span>
            </div>
          ))}
        </div>
        <div className="ws-card ws-widget">
          <h3>Reminders</h3>
          <div className="ws-remind">
            {tasks.filter((t) => t.due).slice(0, 4).map((t) => {
              const due = dueLabel(t, now);
              return (
                <div key={t.id} className="ws-remind-item">
                  <span className="ws-remind-ico"><IcoFile /></span>
                  <span>{t.title}</span>
                  <span className="ws-remind-time">{due?.txt || ''}</span>
                </div>
              );
            })}
            {tasks.filter((t) => t.due).length === 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No reminders yet.</div>}
          </div>
        </div>
      </div>

      <div className="ws-stat">
        <div>
          <div className="ws-stat-fig">+{stats?.throughput ?? 32}%</div>
          <div className="ws-stat-txt">team throughput<br />since switching to KenoAi</div>
        </div>
        <button type="button" className="ws-stat-btn" onClick={() => onAsk('Summarize my workspace: projects, tasks and upcoming deadlines')} aria-label="Ask KenoAi about the workspace"><IcoSpark /></button>
      </div>
    </div>
  );
});

/* ---------- Tasks (full board) ---------- */
export const WorkspaceTasks = memo(function WorkspaceTasks({ tasks, onAddTask, onMoveTask }) {
  const [title, setTitle] = useState('');
  const [prio, setPrio] = useState('normal');
  const [status, setStatus] = useState('todo');
  const [due, setDue] = useState('');
  const now = useMemo(() => Date.now(), []);

  const add = () => {
    if (!title.trim()) return;
    onAddTask(status, { title: title.trim(), prio, due: due || null });
    setTitle(''); setDue('');
  };

  const done = tasks.filter((t) => t.status === 'done');

  return (
    <div className="ws-page">
      <h1 className="ws-title">My tasks</h1>
      <p className="ws-sub">Everything your team is working on, in one board.</p>

      <div className="ws-card" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 18 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          placeholder="New task title…"
          aria-label="Task title"
          style={{ flex: '1 1 220px', minWidth: 0, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '9px 12px', color: 'var(--text-primary)', font: 'inherit', fontSize: '0.85rem', outline: 'none' }}
        />
        <select value={prio} onChange={(e) => setPrio(e.target.value)} aria-label="Priority"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '9px 10px', color: 'var(--text-primary)', font: 'inherit', fontSize: '0.8rem' }}>
          <option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '9px 10px', color: 'var(--text-primary)', font: 'inherit', fontSize: '0.8rem' }}>
          <option value="progress">In progress</option><option value="todo">To do</option><option value="upcoming">Upcoming</option>
        </select>
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '9px 10px', color: 'var(--text-primary)', font: 'inherit', fontSize: '0.8rem' }} />
        <button type="button" className="ws-ask-btn" style={{ border: 'none', cursor: 'pointer' }} onClick={add}><IcoPlus /> Add</button>
      </div>

      <div className="ws-board">
        {STATUSES.map((st) => {
          const list = tasks.filter((t) => t.status === st);
          return (
            <section key={st} className="ws-col" data-col={st}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); onMoveTask(JSON.parse(e.dataTransfer.getData('text/plain')), st); }}>
              <div className="ws-col-head">
                <span className="ws-col-title">{STATUS_LABEL[st]}</span>
                <span className="ws-col-count">{list.length}</span>
              </div>
              {list.map((t) => {
                const dl = dueLabel(t, now);
                return (
                  <div key={t.id} className="ws-task" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ id: t.id }))}>
                    <div className="ws-task-top">
                      <span className={`chip-prio ${t.prio}`}>{PRIO_LABEL[t.prio]}</span>
                      <span className="ws-task-title">{t.title}</span>
                      <span className="ws-task-acts">
                        <button type="button" title="Mark done" onClick={() => onMoveTask({ id: t.id }, 'done')}><IcoCheck /></button>
                        <button type="button" title="Delete" onClick={() => onMoveTask({ id: t.id }, 'delete')}><IcoTrash /></button>
                      </span>
                    </div>
                    {dl && <span className={`ws-task-due ${dl.over ? 'over' : ''}`}><IcoClock /> {dl.txt}</span>}
                  </div>
                );
              })}
              <button type="button" className="ws-add-task" onClick={() => onAddTask(st)}><IcoPlus /> Add task</button>
            </section>
          );
        })}
      </div>

      {done.length > 0 && (
        <div className="ws-card" style={{ marginTop: 18 }}>
          <h3 style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', margin: '0 0 10px' }}>Completed ({done.length})</h3>
          {done.map((t) => (
            <div key={t.id} className="ws-remind-item" style={{ opacity: 0.7 }}>
              <span className="ws-remind-ico" style={{ color: '#12b5a2' }}><IcoCheck /></span>
              <span style={{ textDecoration: 'line-through' }}>{t.title}</span>
              <button type="button" className="ws-file-x" title="Delete" onClick={() => onMoveTask({ id: t.id }, 'delete')}><IcoTrash /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

/* ---------- Inbox ---------- */
export const WorkspaceInbox = memo(function WorkspaceInbox({ inbox, onRead, onOpenChat, sessions }) {
  return (
    <div className="ws-page">
      <h1 className="ws-title">Inbox</h1>
      <p className="ws-sub">AI activity and task updates land here.</p>
      {inbox.length === 0 && <div className="ws-empty">Inbox is empty — ask KenoAi something and replies will show up here.</div>}
      {inbox.map((n) => (
        <div key={n.id} className={`ws-inbox-item ${n.unread ? 'unread' : ''}`} onClick={() => onRead(n.id)} role="button" tabIndex={0}>
          <span className="ws-inbox-ico"><IcoSpark /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ws-inbox-ttl">{n.title}</div>
            <p>{n.preview}</p>
          </div>
          <span className="ws-inbox-time">{new Date(n.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ))}
    </div>
  );
});

/* ---------- Calendar ---------- */
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const WorkspaceCalendar = memo(function WorkspaceCalendar({ tasks }) {
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const view = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const y = view.getFullYear(), m = view.getMonth();
  const first = (new Date(y, m, 1).getDay() + 6) % 7; // Monday-first
  const days = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  const byDay = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!t.due) return;
      const k = new Date(t.due).toDateString();
      (map[k] = map[k] || []).push(t);
    });
    return map;
  }, [tasks]);

  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));

  return (
    <div className="ws-page">
      <h1 className="ws-title">Calendar</h1>
      <p className="ws-sub">Task deadlines at a glance.</p>
      <div className="ws-card" style={{ maxWidth: 460 }}>
        <div className="ws-cal-month">
          <button type="button" className="ws-cal-nav" onClick={() => setOffset(offset - 1)} aria-label="Previous month">‹</button>
          <b>{view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</b>
          <button type="button" className="ws-cal-nav" onClick={() => setOffset(offset + 1)} aria-label="Next month">›</button>
        </div>
        <table className="ws-cal">
          <thead><tr>{DOW.map((d) => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {Array.from({ length: Math.ceil(cells.length / 7) }, (_, r) => (
              <tr key={r}>
                {cells.slice(r * 7, r * 7 + 7).map((c, i) => (
                  <td key={i} className={c ? (c.toDateString() === today.toDateString() ? 'today' : '') : ''}>
                    {c && <span className="num">{c.getDate()}</span>}
                    {c && byDay[c.toDateString()]?.length > 0 && <span className="cal-dot" style={{ display: 'block', margin: '2px auto 0', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tasks.filter((t) => t.due).slice(0, 5).map((t) => (
            <div key={t.id} className="ws-remind-item">
              <span className="ws-remind-ico"><IcoCalendar /></span>
              <span>{t.title}</span>
              <span className="ws-remind-time">{new Date(t.due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ---------- Reports ---------- */
export const WorkspaceReports = memo(function WorkspaceReports({ tasks, sessions, projects }) {
  const done = tasks.filter((t) => t.status === 'done').length;
  const active = tasks.filter((t) => t.status === 'progress').length;
  const msgs = sessions.reduce((a, s) => a + (s.messages?.length || 0), 0);
  const week = useMemo(() => {
    const arr = Array(7).fill(0);
    sessions.forEach((s) => (s.messages || []).forEach((m) => {
      const d = new Date(m.ts || s.updatedAt || Date.now());
      const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
      if (diff >= 0 && diff < 7) arr[6 - diff] += 1;
    }));
    const max = Math.max(...arr, 1);
    return arr.map((v) => ({ v, h: Math.max(8, Math.round((v / max) * 100)) }));
  }, [sessions]);
  const D = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="ws-page">
      <h1 className="ws-title">Reports & Analytics</h1>
      <p className="ws-sub">How your workspace is being used.</p>
      <div className="ws-rep-grid">
        <div className="ws-rep-card"><div className="ws-rep-k">Tasks completed</div><div className="ws-rep-v">{done}</div><div className="ws-rep-s">all time</div></div>
        <div className="ws-rep-card"><div className="ws-rep-k">Active tasks</div><div className="ws-rep-v">{active}</div><div className="ws-rep-s">in progress now</div></div>
        <div className="ws-rep-card"><div className="ws-rep-k">AI messages</div><div className="ws-rep-v">{msgs}</div><div className="ws-rep-s">across {sessions.length} chats</div></div>
      </div>
      <div className="ws-card" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', margin: '0 0 4px' }}>Messages — last 7 days</h3>
        <div className="ws-bars">
          {week.map((w, i) => (
            <div key={i} className="ws-bar"><i style={{ height: `${w.h}%` }} /><span>{D[i]}</span></div>
          ))}
        </div>
      </div>
      <div className="ws-card">
        <h3 style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', margin: '0 0 8px' }}>Projects</h3>
        <table className="ws-rep-table">
          <thead><tr><th>Project</th><th>Chats</th><th>Files</th><th>Progress</th></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td><span className="ws-proj-dot" style={{ display: 'inline-block', marginRight: 8, background: p.color }} />{p.name}</td>
                <td>{sessions.filter((s) => s.projectId === p.id).length}</td>
                <td>{p.files ?? 0}</td>
                <td>{p.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
