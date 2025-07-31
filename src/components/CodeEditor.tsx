import React, { useState, useRef, useEffect } from 'react';
import { 
  Code, 
  Save, 
  Download, 
  Copy, 
  Eye, 
  Settings,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language?: 'html' | 'css' | 'javascript' | 'php' | 'json';
  onChange?: (code: string) => void;
  onSave?: (code: string) => void;
  readOnly?: boolean;
  theme?: 'dark' | 'light';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'html',
  onChange,
  onSave,
  readOnly = false,
  theme = 'dark'
}) => {
  const [code, setCode] = useState(initialCode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    if (onChange) {
      onChange(code);
    }
  }, [code, onChange]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    updateLineNumbers();
  };

  const updateLineNumbers = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      const lines = code.split('\n').length;
      const lineNumbersHtml = Array.from({ length: lines }, (_, i) => i + 1)
        .map(num => `<div class="line-number">${num}</div>`)
        .join('');
      lineNumbersRef.current.innerHTML = lineNumbersHtml;
    }
  };

  useEffect(() => {
    updateLineNumbers();
  }, [code, showLineNumbers]);

  const handleSave = () => {
    if (onSave) {
      onSave(code);
    }
  };

  const handleDownload = () => {
    const extensions = {
      html: 'html',
      css: 'css',
      javascript: 'js',
      php: 'php',
      json: 'json'
    };

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Show success feedback
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleFormat = () => {
    // Basic formatting for different languages
    let formattedCode = code;
    
    if (language === 'html') {
      formattedCode = formatHTML(code);
    } else if (language === 'css') {
      formattedCode = formatCSS(code);
    } else if (language === 'javascript') {
      formattedCode = formatJS(code);
    } else if (language === 'json') {
      try {
        formattedCode = JSON.stringify(JSON.parse(code), null, 2);
      } catch (error) {
        console.error('Invalid JSON');
      }
    }
    
    setCode(formattedCode);
  };

  const formatHTML = (html: string): string => {
    // Basic HTML formatting
    return html
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '')
      .split('\n')
      .map((line, index, array) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        let indent = 0;
        for (let i = 0; i < index; i++) {
          const prevLine = array[i].trim();
          if (prevLine.match(/<[^\/][^>]*[^\/]>$/)) indent++;
          if (prevLine.match(/<\/[^>]+>$/)) indent--;
        }
        
        return '  '.repeat(Math.max(0, indent)) + trimmed;
      })
      .join('\n');
  };

  const formatCSS = (css: string): string => {
    // Basic CSS formatting
    return css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .replace(/,\s*/g, ',\n')
      .trim();
  };

  const formatJS = (js: string): string => {
    // Basic JavaScript formatting
    return js
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .trim();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    } else if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'd') {
        e.preventDefault();
        handleDownload();
      }
    }
  };

  const getLanguageColor = () => {
    const colors = {
      html: 'text-orange-400',
      css: 'text-blue-400',
      javascript: 'text-yellow-400',
      php: 'text-purple-400',
      json: 'text-green-400'
    };
    return colors[language] || 'text-gray-400';
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-gray-900 rounded-lg border border-gray-700 overflow-hidden`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-medium ${getLanguageColor()}`}>
              {language.toUpperCase()}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-600"></div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={readOnly}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
              title="Save (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleFormat}
              disabled={readOnly}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
              title="Format code"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="w-3 h-3"
              />
              Lines
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="w-3 h-3"
              />
              Wrap
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative flex h-96">
        {/* Line Numbers */}
        {showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className="flex-shrink-0 w-12 bg-gray-800 text-gray-500 text-right pr-2 py-3 text-sm font-mono leading-6 select-none border-r border-gray-700"
            style={{ fontSize: `${fontSize}px` }}
          />
        )}

        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className={`w-full h-full p-3 bg-transparent text-white font-mono resize-none outline-none leading-6 ${
              wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
            }`}
            style={{ fontSize: `${fontSize}px` }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={`Enter your ${language} code here...`}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
          <span>Size: {new Blob([code]).size} bytes</span>
        </div>
        <div className="flex items-center gap-2">
          {readOnly && <span className="text-yellow-400">Read Only</span>}
          <span className="capitalize">{language}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;