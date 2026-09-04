import React from 'react';

// Memoized Sidebar Item Component
const SidebarItem = React.memo(({ 
  id, 
  title, 
  isActive, 
  onClick, 
  onDelete,
  isDirty 
}) => (
  <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
    <button
      className="sidebar-item-content"
      onClick={() => onClick(id)}
      title={title}
    >
      <span className="sidebar-item-icon">💬</span>
      <span className="sidebar-item-title">{title}</span>
      {isDirty && <span className="sidebar-item-badge">●</span>}
    </button>
    {isActive && (
      <button
        className="sidebar-item-delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        aria-label="Delete conversation"
        title="Delete conversation"
      >
        ✕
      </button>
    )}
  </div>
));

SidebarItem.displayName = 'SidebarItem';

// Memoized Sidebar Component
const SidebarMemo = React.memo(({
  sessions,
  activeId,
  onSelect,
  onDelete,
  onNew,
  isOpen
}) => {
  return (
    <aside className={`sidebar-container ${!isOpen ? 'mobile-hidden' : 'mobile-visible'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img 
            src="/kenoai-avatar.png" 
            alt="KenoAi" 
            className="logo-image"
            loading="lazy"
          />
          <span className="logo-text">KenoAi</span>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        className="btn btn-primary sidebar-new-btn"
        onClick={onNew}
        title="Start a new conversation"
      >
        <span className="icon">+</span>
        <span className="text">New Chat</span>
      </button>

      {/* Sessions List */}
      <div className="sidebar-sessions">
        <div className="sessions-label">Conversations</div>
        <div className="sessions-list">
          {sessions.length === 0 ? (
            <div className="no-sessions">No conversations yet</div>
          ) : (
            sessions.map((session) => (
              <SidebarItem
                key={session.id}
                id={session.id}
                title={session.title}
                isActive={activeId === session.id}
                onClick={onSelect}
                onDelete={onDelete}
                isDirty={session.messages?.length > 0}
              />
            ))
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-help">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Need help?</span>
        </div>
      </div>
    </aside>
  );
});

SidebarMemo.displayName = 'SidebarMemo';

export default SidebarMemo;
