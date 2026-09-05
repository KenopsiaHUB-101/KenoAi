import React from 'react';

// Inline SVG icons (no emoji)
const IcoBot = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="12" cy="12" r="1.2"/>
  </svg>
);
const IcoCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);
const IcoUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

// Memoized Message Card Component
const MessageCard = React.memo(({
  role,
  content,
  imagePreview,
  timestamp,
  isStreaming,
  onCopy,
  onDelete
}) => {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      {/* Avatar for Assistant */}
      {isAssistant && (
        <div className="message-avatar">
          <div className="avatar-icon"><IcoBot /></div>
        </div>
      )}

      {/* Message Content */}
      <div className="message-wrapper">
        <div className={`message-bubble ${isStreaming ? 'streaming' : ''}`}>
          {/* Image Preview if exists */}
          {imagePreview && (
            <div className="message-image-preview">
              <img src={imagePreview} alt="Attached" loading="lazy" />
            </div>
          )}

          {/* Text Content */}
          <div className="message-text">
            {content}
            {isStreaming && <span className="streaming-caret">▌</span>}
          </div>
        </div>

        {/* Message Footer */}
        <div className="message-footer">
          <span className="message-time">
            {new Date(timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <div className="message-actions">
            {!isStreaming && (
              <>
                <button
                  className="btn-icon"
                  onClick={() => onCopy?.(content)}
                  title="Copy message"
                  aria-label="Copy message"
                >
                  <IcoCopy />
                </button>
                {isUser && (
                  <button
                    className="btn-icon"
                    onClick={() => onDelete?.()}
                    title="Delete message"
                    aria-label="Delete message"
                  >
                    {IcoTrash}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Avatar for User */}
      {isUser && (
        <div className="message-avatar user">
          <div className="avatar-icon">{IcoUser}</div>
        </div>
      )}
    </div>
  );
});

MessageCard.displayName = 'MessageCard';

export default MessageCard;
