import React, {useMemo} from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // CRITICAL: Math will not render without this CSS
import {splitMathTextSegments} from './mathTextSegments';

interface MathRendererProps {
    text: string;
    className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({text, className = ''}) => {
    const parts = useMemo(() => splitMathTextSegments(text), [text]);

    return (
        <span className={className}>
      {parts.map((part, index) => {
          try {
              if (part.startsWith('$$') && part.endsWith('$$')) {
                  // Block Math
                  const content = part.slice(2, -2);
                  const html = katex.renderToString(content, {
                      displayMode: true,
                      throwOnError: false
                  });
                  return <span key={index} dangerouslySetInnerHTML={{__html: html}}/>;

              } else if (part.startsWith('$') && part.endsWith('$')) {
                  // Inline Math
                  const content = part.slice(1, -1);
                  const html = katex.renderToString(content, {
                      displayMode: false,
                      throwOnError: false
                  });
                  return <span key={index} dangerouslySetInnerHTML={{__html: html}}/>;
              }
          } catch (e) {
              console.error('KaTeX error:', e);
              return <span key={index} className="text-red-500 font-mono">{part}</span>;
          }

          // Regular Text
          return <span key={index}>{part}</span>;
      })}
    </span>
    );
};

export default MathRenderer;
