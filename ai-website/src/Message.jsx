import React, { memo } from 'react';
import Markdown from './Markdown.jsx';
import { IcoCopy, IcoVolume, IcoAlert } from './icons.jsx';

// ============================================================
// Message — memoized. Props are stable: a message only re-renders
// when its own content changes (id-keyed), never while you type
// and never while other messages stream.
// ============================================================

const Message = memo(function Message({ msg, onCopy, onSpeak, streaming }) {
  const isUser = msg.role === 'user';
  const text = typeof msg.content === 'string' ? msg.content : msg.rawText || '';

  return (
    <article className={`msg ${isUser ? 'user' : 'ai'} ${msg.error ? 'error' : ''}`}>
      <div className={`msg-head ${isUser ? 'user' : 'ai'}`}>
        {isUser ? (
          <span className="who">You</span>
        ) : (
          <>
            <img src="/kenoai-avatar.png" alt="" loading="lazy" width="22" height="22" />
            <span className="who">KenoAi</span>
            {streaming && <span className="pill"><span className="dot" /> streaming</span>}
          </>
        )}
      </div>

      {msg.imagePreview && (
        <img className="msg-image" src={msg.imagePreview} alt="Attached" loading="lazy" />
      )}

      <div className="msg-body">
        {isUser ? <p>{text}</p> : msg.error ? (
          <p>{text} <span style={{ opacity: 0.7 }}>(tap "Retry" in the composer)</span></p>
        ) : (
          <>
            <Markdown text={text} />
            {streaming && <span className="caret" />}
          </>
        )}
      </div>

      {!isUser && !streaming && text && (
        <div className="msg-foot">
          <button className="foot-act" type="button" onClick={() => onCopy(text)}>
            <IcoCopy /> Copy
          </button>
          <button className="foot-act" type="button" onClick={() => onSpeak(text)}>
            <IcoVolume /> Read
          </button>
        </div>
      )}
    </article>
  );
});

export default Message;
