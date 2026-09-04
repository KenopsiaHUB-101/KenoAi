import React, { memo, useCallback, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { IcoUpload, IcoMic, IcoSendPaper, IcoStop, IcoClose } from './icons.jsx';

// ============================================================
// Composer — the core of the typing-lag fix.
//
// The textarea is UNCONTROLLED: React never re-renders while you
// type. The value lives in a ref and is read only when sending.
// Enter sends, Shift+Enter newlines, and the bar auto-grows via a
// ResizeObserver-free technique (direct style writes).
// ============================================================

const Composer = memo(forwardRef(function Composer(
  { onSend, onStop, loading, recActive, onFile, hasImage, onRemoveImage, imageName, onMicToggle },
  ref
) {
  const taRef = useRef(null);
  const sendRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => taRef.current?.focus(),
    set: (v) => {
      if (taRef.current) {
        taRef.current.value = v || '';
        autosize();
      }
    },
    get value() { return taRef.current ? taRef.current.value : ''; },
    clear: () => { if (taRef.current) { taRef.current.value = ''; autosize(); } },
  }), []);

  const autosize = useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, window.innerHeight * 0.44) + 'px';
  }, []);

  const updateSendBtn = useCallback(() => {
    const btn = sendRef.current;
    if (!btn) return;
    const has = taRef.current && taRef.current.value.trim().length > 0;
    btn.disabled = loading || (!has && !hasImage);
  }, [loading, hasImage]);

  const onChange = useCallback((e) => {
    autosize();
    updateSendBtn();
  }, [autosize, updateSendBtn]);

  const doSend = useCallback(() => {
    if (loading) return;
    const v = taRef.current ? taRef.current.value : '';
    if (!v.trim() && !hasImage) return;
    onSend(v);
    if (taRef.current) { taRef.current.value = ''; }
    autosize();
    updateSendBtn();
  }, [loading, hasImage, onSend, autosize, updateSendBtn]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      doSend();
    }
  }, [doSend]);

  // Keep the send button in sync with loading / image state changes
  useEffect(() => { updateSendBtn(); }, [loading, hasImage, updateSendBtn]);

  return (
    <div className="composer-wrap">
      {hasImage && (
        <div className="att-preview">
          <img src={hasImage} alt="" />
          <span className="name">{imageName || 'image'}</span>
          <button type="button" className="x" onClick={onRemoveImage} aria-label="Remove image">×</button>
        </div>
      )}

      <div className="composer">
        <label className="round-btn" title="Attach image" role="button" tabIndex={0}
               onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.querySelector('input').click(); } }}>
          <IcoUpload />
          <input type="file" accept="image/*" style={{ display: 'none' }}
                 onChange={(e) => { onFile(e); e.target.value = ''; }} />
        </label>

        <button type="button" className={`round-btn ${recActive ? 'rec' : ''}`} onClick={onMicToggle}
                title="Voice input" aria-pressed={recActive}>
          <IcoMic />
        </button>

        <textarea
          ref={taRef}
          rows="1"
          placeholder={recActive ? 'Listening…' : 'Message KenoAi…'}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={(e) => {
            const item = Array.from(e.clipboardData?.items || []).find((i) => i.type.startsWith('image/'));
            if (item) {
              e.preventDefault();
              onFile({ target: { files: [item.getAsFile()] } });
            }
        }}
          aria-label="Message input"
        />

        {loading ? (
          <button type="button" className="btn-send btn-stop" onClick={onStop} title="Stop generating">
            <IcoStop />
          </button>
          ) : (
          <button type="button" className="btn-send" ref={sendRef} onClick={doSend} title="Send (Enter)">
            <IcoSendPaper />
          </button>
        )}
        </div>

      <p className="hint"><span className="kbd">Enter</span> to send · <span className="kbd">Shift+Enter</span> for a new line · KenoAi can make mistakes.</p>
    </div>
  );
}));

export default Composer;

