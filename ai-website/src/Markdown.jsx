import React, { memo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ------------------------------------------------------------
// Lazy highlighter: PrismLight + a curated set of languages.
// Everything loads in the background AFTER first paint, and only
// when a chat actually contains a code block.
// ------------------------------------------------------------
const LANG_IMPORTS = {
  javascript: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  js: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  jsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
  typescript: () => import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
  ts: () => import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
  tsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
  python: () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
  py: () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
  json: () => import('react-syntax-highlighter/dist/esm/languages/prism/json'),
  html: () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
  xml: () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
  svg: () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
  css: () => import('react-syntax-highlighter/dist/esm/languages/prism/css'),
  bash: () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
  sh: () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
  shell: () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
  lua: () => import('react-syntax-highlighter/dist/esm/languages/prism/lua'),
  java: () => import('react-syntax-highlighter/dist/esm/languages/prism/java'),
  c: () => import('react-syntax-highlighter/dist/esm/languages/prism/c'),
  cpp: () => import('react-syntax-highlighter/dist/esm/languages/prism/cpp'),
  csharp: () => import('react-syntax-highlighter/dist/esm/languages/prism/csharp'),
  cs: () => import('react-syntax-highlighter/dist/esm/languages/prism/csharp'),
  go: () => import('react-syntax-highlighter/dist/esm/languages/prism/go'),
  rust: () => import('react-syntax-highlighter/dist/esm/languages/prism/rust'),
  php: () => import('react-syntax-highlighter/dist/esm/languages/prism/php'),
  ruby: () => import('react-syntax-highlighter/dist/esm/languages/prism/ruby'),
  sql: () => import('react-syntax-highlighter/dist/esm/languages/prism/sql'),
  yaml: () => import('react-syntax-highlighter/dist/esm/languages/prism/yaml'),
  yml: () => import('react-syntax-highlighter/dist/esm/languages/prism/yaml'),
  markdown: () => import('react-syntax-highlighter/dist/esm/languages/prism/markdown'),
  md: () => import('react-syntax-highlighter/dist/esm/languages/prism/markdown'),
  diff: () => import('react-syntax-highlighter/dist/esm/languages/prism/diff'),
};

let highlighterPromise = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import('react-syntax-highlighter/dist/esm/prism-light'),
      import('react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'),
    ]).then(async ([hl, themeMod]) => {
      const Comp = hl.default;
      await Promise.all(
        Object.entries(LANG_IMPORTS).map(([name, load]) =>
          load().then((m) => Comp.registerLanguage(name, m.default)).catch(() => {})
        )
      );
      return { Comp, style: themeMod.default };
    });
  }
  return highlighterPromise;
}

function CodeBlock({ lang, code }) {
  const [hl, setHl] = useState(null);

  useEffect(() => {
    let on = true;
    getHighlighter().then((h) => on && setHl(h));
    return () => { on = false; };
  }, []);

  const copy = (e) => {
    navigator.clipboard.writeText(code);
    const b = e.currentTarget;
    b.textContent = 'Copied!';
    setTimeout(() => { b.textContent = 'Copy'; }, 1400);
  };

  return (
    <div className="code-wrap">
      <div className="code-bar">
        <span>{lang || 'code'}</span>
        <button type="button" onClick={copy}>Copy</button>
      </div>
      {hl ? (
        <hl.Comp
          language={lang}
          style={hl.style}
          PreTag="pre"
          codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: '0.8rem' } }}
        >
          {code}
        </hl.Comp>
      ) : (
        <pre className="code-fallback"><code>{code}</code></pre>
      )}
    </div>
  );
}

/** Extract code text from the <code> child of a <pre> element. */
function extractCode(children) {
  const child = Array.isArray(children) ? children[0] : children;
  if (!child || !child.props) return { lang: 'text', code: '' };
  const className = child.props.className || '';
  const match = /language-(\w+)/.exec(className);
  const raw = child.props.children;
  const code = (Array.isArray(raw) ? raw.join('') : String(raw ?? '')).replace(/\n$/, '');
  return { lang: match ? match[1] : 'text', code };
}

const Markdown = memo(function Markdown({ text }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre({ children }) {
          const { lang, code } = extractCode(children);
          return <CodeBlock lang={lang} code={code} />;
        },
        code({ node, className, children, ...props }) {
          return <code className={className} {...props}>{children}</code>;
        },
        a({ node, href, children, ...props }) {
          return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
});

export default Markdown;

