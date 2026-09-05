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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> Image attached
            <button
              className="btn-remove-attachment"
              onClick={onImageRemove}
              aria-label="Remove attachment"
            >
              <span aria-hidden="true">&times;</span>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
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
                <span className="send-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
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
