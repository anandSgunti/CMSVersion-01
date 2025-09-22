import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Minus,
  Type,
  Palette,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { Button } from './ui';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Update editor content when value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Update active formats based on cursor position
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');
    if (document.queryCommandState('justifyLeft')) formats.add('left');
    if (document.queryCommandState('justifyCenter')) formats.add('center');
    if (document.queryCommandState('justifyRight')) formats.add('right');
    
    setActiveFormats(formats);
  }, []);

  // Handle selection change to update active formats
  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveFormats();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateActiveFormats]);

  // Execute formatting command
  const execCommand = useCallback((command: string, value?: string) => {
    if (disabled) return;
    
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
    updateActiveFormats();
  }, [disabled, handleInput, updateActiveFormats]);

  // Handle heading selection
  const applyHeading = useCallback((level: string) => {
    execCommand('formatBlock', level);
    setShowHeadingDropdown(false);
  }, [execCommand]);

  // Handle link insertion
  const insertLink = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    const url = prompt('Enter URL:', 'https://');
    
    if (url) {
      if (selectedText) {
        execCommand('createLink', url);
      } else {
        const linkText = prompt('Enter link text:') || url;
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        execCommand('insertHTML', linkHtml);
      }
    }
  }, [execCommand]);

  // Insert horizontal rule
  const insertHorizontalRule = useCallback(() => {
    execCommand('insertHTML', '<hr style="margin: 1rem 0; border: none; border-top: 2px solid #e5e7eb; border-radius: 1px;">');
  }, [execCommand]);

  // Apply text color
  const applyTextColor = useCallback((color: string) => {
    execCommand('foreColor', color);
    setShowColorPicker(false);
  }, [execCommand]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(100);
  }, []);

  // Handle key shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          insertLink();
          break;
        case '=':
        case '+':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    }
  }, [disabled, execCommand, insertLink, zoomIn, zoomOut, resetZoom]);

  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', 
    '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'
  ];

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Modern Toolbar */}
      <div className={`
        bg-white border border-gray-200 rounded-t-xl shadow-sm transition-all duration-200
        ${false ? 'sticky top-0 z-20 shadow-md' : ''}
      `}>
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            {/* Heading Dropdown */}
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
                className="h-8 px-3 text-sm font-medium hover:bg-gray-100 transition-colors"
                disabled={disabled}
              >
                <Type size={14} className="mr-1" />
                Text
                <ChevronDown size={12} className="ml-1" />
              </Button>
              
              {showHeadingDropdown && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                  <div className="py-1">
                    <button onClick={() => applyHeading('p')} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                      Normal
                    </button>
                    <button onClick={() => applyHeading('h1')} className="w-full px-3 py-2 text-left text-lg font-bold hover:bg-gray-50 transition-colors">
                      Heading 1
                    </button>
                    <button onClick={() => applyHeading('h2')} className="w-full px-3 py-2 text-left text-base font-semibold hover:bg-gray-50 transition-colors">
                      Heading 2
                    </button>
                    <button onClick={() => applyHeading('h3')} className="w-full px-3 py-2 text-left text-sm font-medium hover:bg-gray-50 transition-colors">
                      Heading 3
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-gray-300 mx-1" />

            {/* Basic Formatting */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('bold')}
              className={`h-8 w-8 p-0 transition-colors ${
                activeFormats.has('bold') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <Bold size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('italic')}
              className={`h-8 w-8 p-0 transition-colors ${
                activeFormats.has('italic') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <Italic size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('underline')}
              className={`h-8 w-8 p-0 transition-colors ${
                activeFormats.has('underline') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <Underline size={14} />
            </Button>

            {/* Color Picker */}
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                disabled={disabled}
              >
                <Palette size={14} />
              </Button>
              
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => applyTextColor(color)}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-gray-300 mx-1" />

            {/* Lists */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('insertUnorderedList')}
              className={`h-8 w-8 p-0 transition-colors ${
                activeFormats.has('ul') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <List size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('insertOrderedList')}
              className={`h-8 w-8 p-0 transition-colors ${
                activeFormats.has('ol') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <ListOrdered size={14} />
            </Button>

            <div className="w-px h-5 bg-gray-300 mx-1" />

            {/* Alignment */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('justifyLeft')}
              className={`h-8 w-8 p-0 transition-colors ${
                activeFormats.has('left') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <AlignLeft size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('justifyCenter')}
              className={`h-8 w-8 p-0 transition-colors ${
                activeFormats.has('center') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <AlignCenter size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('justifyRight')}
              className={`h-8 w-8 p-0 transition-colors ${
                activeFormats.has('right') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <AlignRight size={14} />
            </Button>
          </div>

          {/* Additional Tools */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertLink}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
              disabled={disabled}
            >
              <Link size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'blockquote')}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
              disabled={disabled}
            >
              <Quote size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'pre')}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
              disabled={disabled}
            >
              <Code size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertHorizontalRule}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
              disabled={disabled}
            >
              <Minus size={14} />
            </Button>

            <div className="w-px h-5 bg-gray-300 mx-1" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 px-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                disabled={disabled || zoomLevel <= 50}
                title="Zoom Out (Ctrl/Cmd + -)"
              >
                <ZoomOut size={14} />
              </Button>
              
              <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                disabled={disabled || zoomLevel >= 200}
                title="Zoom In (Ctrl/Cmd + +)"
              >
                <ZoomIn size={14} />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                disabled={disabled || zoomLevel === 100}
                title="Reset Zoom (Ctrl/Cmd + 0)"
              >
                <RotateCcw size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content with Zoom and Scroll */}
      <div className="flex-1 bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
        <div 
          className="h-full overflow-auto p-6 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300 transition-all duration-200"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top left',
            width: `${100 / (zoomLevel / 100)}%`,
            height: `${100 / (zoomLevel / 100)}%`,
          }}
        >
          <div 
            ref={editorRef}
            contentEditable={!disabled}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className={`
              min-h-full prose prose-gray max-w-none focus:outline-none
              ${disabled ? 'cursor-not-allowed bg-gray-50' : ''}
            `}
            style={{ 
              lineHeight: '1.7',
              fontSize: '16px',
              minHeight: '100%'
            }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showHeadingDropdown || showColorPicker) && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => {
            setShowHeadingDropdown(false);
            setShowColorPicker(false);
          }}
        />
      )}

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
        
        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem 0;
          color: #1f2937;
          line-height: 1.3;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
          color: #374151;
          line-height: 1.4;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 1rem 0 0.5rem 0;
          color: #4b5563;
          line-height: 1.5;
        }
        
        [contenteditable] p {
          margin: 0.75rem 0;
          line-height: 1.7;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
          background: #f8fafc;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        [contenteditable] pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          font-family: 'SF Mono', Monaco, Consolas, monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
          line-height: 1.6;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
          text-decoration-color: #93c5fd;
          text-underline-offset: 2px;
          transition: all 0.2s;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8;
          text-decoration-color: #3b82f6;
        }
        
        [contenteditable] hr {
          margin: 2rem 0;
          border: none;
          border-top: 2px solid #e5e7eb;
          border-radius: 1px;
        }
      `}</style>
    </div>
  );
};