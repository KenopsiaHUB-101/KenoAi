import React, { useCallback, useRef } from 'react';

// Memoized Composer Component
const ComposerMemo = React.memo(({
  message,
  onMessageChange,
  onSend,
  isLoading,
  hasImage,
  onImageAttach,
  onImageRemove,
  onKeyDown,
  personas,
  currentPersona,
  onPersonaChange
}) => {
  const fileInputRef = useRef(null);

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageAttach?.(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageAttach]);

  return (
    <div className="composer">
      {/* Persona Selector */}
      <div className="composer-header">
        <div className="persona-selector">
          <label className="persona-label">Mode:</label>
          <select
            value={currentPersona}
            onChange={(e) => onPersonaChange?.(e.target.value)}
            className="persona-select"
            disabled={isLoading}
          >
            {personas.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Composer Input Area */}
      <div className="composer-input-group">
        <textarea
          className="composer-textarea"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message... (Shift+Enter for new line, Ctrl+Enter to send)"
          disabled={isLoading}
          rows={3}
        />

        {/* Attachment Indicator */}
        {hasImage && (
          <div className="attachment-indicator">
            📎 Image attached
            <button
              className="btn-remove-attachment"
              onClick={onImageRemove}
              aria-label="Remove attachment"
            >
              ✕
            </button>
          </div>
        )}

        {/* Composer Footer */}
        <div className="composer-footer">
          <div className="composer-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleAttachClick}
              disabled={isLoading}
              title="Attach image"
              aria-label="Attach image"
            >
              📎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={onSend}
            disabled={isLoading || !message.trim()}
            title={isLoading ? 'Waiting for response...' : 'Send message (Ctrl+Enter)'}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <span className="send-icon">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ComposerMemo.displayName = 'ComposerMemo';

export default ComposerMemo;
