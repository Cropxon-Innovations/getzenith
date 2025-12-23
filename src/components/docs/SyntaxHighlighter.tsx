import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SyntaxHighlighterProps {
  code: string;
  language?: 'typescript' | 'javascript' | 'json' | 'bash' | 'python' | 'go' | 'graphql' | string;
  showLineNumbers?: boolean;
}

interface TokenMatch {
  type: 'keyword' | 'string' | 'comment' | 'function' | 'number' | 'operator' | 'property' | 'variable' | 'type' | 'default';
  value: string;
  start: number;
  end: number;
}

const lightTheme = {
  keyword: 'text-purple-600',
  string: 'text-green-600',
  comment: 'text-gray-400',
  function: 'text-blue-600',
  number: 'text-orange-500',
  operator: 'text-pink-500',
  property: 'text-teal-600',
  variable: 'text-amber-600',
  type: 'text-cyan-600',
  default: 'text-gray-800',
};

const darkTheme = {
  keyword: 'text-purple-400',
  string: 'text-green-400',
  comment: 'text-gray-500',
  function: 'text-blue-400',
  number: 'text-orange-400',
  operator: 'text-pink-400',
  property: 'text-teal-400',
  variable: 'text-amber-400',
  type: 'text-cyan-400',
  default: 'text-gray-200',
};

const patterns: Record<string, { regex: RegExp; type: TokenMatch['type'] }[]> = {
  typescript: [
    { regex: /\/\/.*$/gm, type: 'comment' },
    { regex: /\/\*[\s\S]*?\*\//g, type: 'comment' },
    { regex: /([\"'`])(?:(?!\1)[^\\]|\\[\s\S])*\1/g, type: 'string' },
    { regex: /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|implements|interface|type|async|await|new|this|true|false|null|undefined|try|catch|finally|throw|switch|case|default|break|continue|typeof|instanceof)\b/g, type: 'keyword' },
    { regex: /\b([A-Z][a-zA-Z0-9_]*)\b/g, type: 'type' },
    { regex: /\b(\d+\.?\d*)\b/g, type: 'number' },
    { regex: /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, type: 'function' },
    { regex: /\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, type: 'property' },
    { regex: /[=+\-*/<>!&|?:]+/g, type: 'operator' },
  ],
  javascript: [
    { regex: /\/\/.*$/gm, type: 'comment' },
    { regex: /\/\*[\s\S]*?\*\//g, type: 'comment' },
    { regex: /([\"'`])(?:(?!\1)[^\\]|\\[\s\S])*\1/g, type: 'string' },
    { regex: /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|async|await|new|this|true|false|null|undefined|try|catch|finally|throw|switch|case|default|break|continue|typeof|instanceof)\b/g, type: 'keyword' },
    { regex: /\b(\d+\.?\d*)\b/g, type: 'number' },
    { regex: /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, type: 'function' },
    { regex: /\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, type: 'property' },
    { regex: /[=+\-*/<>!&|?:]+/g, type: 'operator' },
  ],
  json: [
    { regex: /\"(?:[^\"]|\\[\s\S])+\"/g, type: 'string' },
    { regex: /\b(true|false|null)\b/g, type: 'keyword' },
    { regex: /\b(-?\d+\.?\d*)\b/g, type: 'number' },
    { regex: /\"([^\"]+)\"(?=\s*:)/g, type: 'property' },
  ],
  bash: [
    { regex: /#.*$/gm, type: 'comment' },
    { regex: /([\"'])(?:(?!\1)[^\\]|\\[\s\S])*\1/g, type: 'string' },
    { regex: /\b(npm|yarn|pnpm|npx|sudo|cd|ls|mkdir|rm|cp|mv|echo|cat|grep|export|source)\b/g, type: 'keyword' },
    { regex: /\$[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'variable' },
  ],
};

function tokenize(code: string, language: string): TokenMatch[] {
  const langPatterns = patterns[language] || patterns.typescript;
  const tokens: TokenMatch[] = [];
  
  for (const { regex, type } of langPatterns) {
    const pattern = new RegExp(regex.source, regex.flags);
    let match;
    
    while ((match = pattern.exec(code)) !== null) {
      const capturedValue = match[1] !== undefined && type === 'function' ? match[1] : match[0];
      const start = type === 'function' ? match.index : match.index;
      const end = start + match[0].length;
      
      tokens.push({
        type,
        value: match[0],
        start,
        end,
      });
    }
  }
  
  // Sort tokens by position
  tokens.sort((a, b) => a.start - b.start);
  
  // Remove overlapping tokens (keep first match - comments and strings take priority)
  const filteredTokens: TokenMatch[] = [];
  let lastEnd = 0;
  
  for (const token of tokens) {
    if (token.start >= lastEnd) {
      filteredTokens.push(token);
      lastEnd = token.end;
    }
  }
  
  return filteredTokens;
}

export const SyntaxHighlighter = ({ 
  code, 
  language = 'typescript',
  showLineNumbers = true 
}: SyntaxHighlighterProps) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.category === 'dark';
  const colorTheme = isDark ? darkTheme : lightTheme;
  
  const highlightedCode = useMemo(() => {
    const tokens = tokenize(code, language);
    const result: JSX.Element[] = [];
    let lastIndex = 0;
    
    for (const token of tokens) {
      // Add default text before this token
      if (token.start > lastIndex) {
        result.push(
          <span key={`default-${lastIndex}`} className={colorTheme.default}>
            {code.slice(lastIndex, token.start)}
          </span>
        );
      }
      
      // Add the highlighted token
      result.push(
        <span key={`token-${token.start}`} className={colorTheme[token.type]}>
          {token.value}
        </span>
      );
      
      lastIndex = token.end;
    }
    
    // Add remaining text
    if (lastIndex < code.length) {
      result.push(
        <span key={`default-end`} className={colorTheme.default}>
          {code.slice(lastIndex)}
        </span>
      );
    }
    
    return result;
  }, [code, language, colorTheme]);
  
  const lines = code.split('\n');
  
  if (showLineNumbers) {
    return (
      <div className="font-mono text-sm leading-relaxed">
        {lines.map((line, i) => {
          const lineStart = lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
          const lineEnd = lineStart + line.length;
          
          // Get tokens for this line
          const tokens = tokenize(line, language);
          const lineResult: JSX.Element[] = [];
          let lastIdx = 0;
          
          for (const token of tokens) {
            if (token.start > lastIdx) {
              lineResult.push(
                <span key={`default-${i}-${lastIdx}`} className={colorTheme.default}>
                  {line.slice(lastIdx, token.start)}
                </span>
              );
            }
            lineResult.push(
              <span key={`token-${i}-${token.start}`} className={colorTheme[token.type]}>
                {token.value}
              </span>
            );
            lastIdx = token.end;
          }
          
          if (lastIdx < line.length) {
            lineResult.push(
              <span key={`default-${i}-end`} className={colorTheme.default}>
                {line.slice(lastIdx)}
              </span>
            );
          }
          
          return (
            <div key={i} className="flex">
              <span className="w-8 text-right pr-4 text-muted-foreground/40 select-none flex-shrink-0">
                {i + 1}
              </span>
              <span className="flex-1">{lineResult.length > 0 ? lineResult : ' '}</span>
            </div>
          );
        })}
      </div>
    );
  }
  
  return <code className="font-mono text-sm">{highlightedCode}</code>;
};
