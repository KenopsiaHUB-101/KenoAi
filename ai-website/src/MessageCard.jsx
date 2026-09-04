import React from 'react';

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
          <div className="avatar-icon">🤖</div>
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
                  📋
                </button>
                {isUser && (
                  <button
                    className="btn-icon"
                    onClick={() => onDelete?.()}
                    title="Delete message"
                    aria-label="Delete message"
                  >
                    🗑️
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
          <div className="avatar-icon">👤</div>
        </div>
      )}
    </div>
  );
});

MessageCard.displayName = 'MessageCard';

export default MessageCard;
