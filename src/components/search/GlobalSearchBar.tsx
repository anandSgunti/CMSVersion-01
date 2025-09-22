import React, { useState, useRef, useEffect } from 'react';
import { Search, FileText, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalTemplateSearch } from '../../hooks/useGlobalTemplateSearch';
import { formatRelative } from '../../lib/date';

interface GlobalSearchBarProps {
  placeholder?: string;
}

const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  placeholder = "Search templates across all projects..."
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: templates = [], isLoading } = useGlobalTemplateSearch(query);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || templates.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < templates.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && templates[selectedIndex]) {
          handleTemplateSelect(templates[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleTemplateSelect = (template: GlobalTemplate) => {
    navigate(`/projects/${template.project_id}/templates`);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg bg-white/80 backdrop-blur-sm border border-2 border-[#e2222cff] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all duration-200 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl z-50 overflow-hidden">
          {isLoading ? (
            <div className="px-6 py-8 text-center">
              <div className="inline-flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                <span>Searching templates...</span>
              </div>
            </div>
          ) : templates.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <Search size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No templates found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or check spelling</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {templates.map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`w-full px-6 py-4 text-left hover:bg-blue-50/50 transition-colors border-b border-gray-100/50 last:border-b-0 ${
                    index === selectedIndex ? 'bg-blue-50/70' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {template.title}
                        </h4>
                        <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {template.project_name}
                      </p>
                      {template.body && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {truncateText(stripHtml(template.body), 100)}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>by {template.author_name}</span>
                        <span>•</span>
                        <span>{formatRelative(template.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};