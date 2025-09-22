import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Navigation, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    path: string;
    description?: string;
  }>;
}

interface Document {
  id: string;
  title: string;
  project_id: string;
  projects?: { name: string };
}

interface LibraryFile {
  id: string;
  title: string;
  content_type: string;
  description?: string;
  file_url?: string;
  project_id?: string;
  subcategory_id?: string;
}

const CMS_NAVIGATION_MAP = {
  // Main sections that actually exist in your router
  dashboard: { path: '/dashboard', name: 'Dashboard', description: 'Main overview and analytics' },
  
  // Document related
  documents: { path: '/docs', name: 'My Documents', description: 'Your personal documents' },
  'my documents': { path: '/docs', name: 'My Documents', description: 'Your personal documents' },
  
  // Projects and templates - these are the main project areas
  projects: { path: '/projects', name: 'Projects', description: 'Project management and templates' },
  templates: { path: '/projects', name: 'Templates', description: 'Browse project templates' },
  
  // Specific projects (these would navigate to project-specific template galleries)
  commercial: { path: '/projects/98b4ea9c-4eba-4f56-97a2-4437f251cf86/templates', name: 'Commercial Project', description: 'Commercial project templates and content' },
  'medical education': { path: '/projects/96da1337-2289-4681-9a7f-f880c9ade51a/templates', name: 'Medical Education', description: 'Medical education project templates' },
  'medical affairs': { path: '/projects/f9c376ed-18e0-44fa-ba03-11ade9b4be7b/templates', name: 'Medical Affairs', description: 'Medical affairs project templates' },
  
  // Subcategories within Commercial project
  emails: { path: '/projects/98b4ea9c-4eba-4f56-97a2-4437f251cf86/subcategories/fbd4e9df-47c9-42b5-8602-a1bc9990c9f9/templates', name: 'Email Templates', description: 'Email templates in Commercial project' },
  'leave piece': { path: '/projects/98b4ea9c-4eba-4f56-97a2-4437f251cf86/subcategories/fd84e891-d424-4aa5-9cbf-c99c9d12f476/templates', name: 'Leave Piece', description: 'Leave piece templates in Commercial project' },
  podcasts: { path: '/projects/98b4ea9c-4eba-4f56-97a2-4437f251cf86/subcategories/5234850e-38b6-46dd-ac0c-f08af02ccb17/templates', name: 'Podcasts', description: 'Podcast templates in Commercial project' },
  videos: { path: '/projects/98b4ea9c-4eba-4f56-97a2-4437f251cf86/subcategories/4ac3369d-37e6-44a5-8d77-be84d4306477/templates', name: 'Videos', description: 'Video templates in Commercial project' },
  
  // Reviews and Library - Enhanced library support
  reviews: { path: '/reviews', name: 'Reviews', description: 'Document reviews and approval workflows' },
  library: { path: '/reviews', name: 'Library', description: 'Document library, assets, images, logos and files' },
  'library files': { path: '/reviews', name: 'Library Files', description: 'Browse all library files, images, and assets' },
  'library assets': { path: '/reviews', name: 'Library Assets', description: 'Access library assets and resources' },
  assets: { path: '/reviews', name: 'Assets', description: 'Images, logos, and media assets' },
  images: { path: '/reviews', name: 'Library Images', description: 'Find images and visual assets in library' },
  logos: { path: '/reviews', name: 'Logos', description: 'Company logos and brand assets' },
  'brand assets': { path: '/reviews', name: 'Brand Assets', description: 'Brand guidelines and visual identity' },
  
  // Admin
  admin: { path: '/admin', name: 'Admin Dashboard', description: 'Administrative functions' },
  'admin users': { path: '/admin/users', name: 'Admin Users', description: 'User administration' },
  'admin documents': { path: '/admin/documents', name: 'Admin Documents', description: 'Document administration' },
  
  // Aliases and variations - using existing routes
  'email template': { path: '/projects/98b4ea9c-4eba-4f56-97a2-4437f251cf86/subcategories/fbd4e9df-47c9-42b5-8602-a1bc9990c9f9/templates', name: 'Email Templates', description: 'Find email templates in Commercial project' },
  'email templates': { path: '/projects/98b4ea9c-4eba-4f56-97a2-4437f251cf86/subcategories/fbd4e9df-47c9-42b5-8602-a1bc9990c9f9/templates', name: 'Email Templates', description: 'Find email templates in Commercial project' },
  'template': { path: '/projects', name: 'Project Templates', description: 'Browse available templates' },
  'content': { path: '/docs', name: 'My Documents', description: 'Your content and documents' },
  'all content': { path: '/docs', name: 'My Documents', description: 'View and manage all content' },
  'new content': { path: '/docs', name: 'My Documents', description: 'Your documents section' },
  'categories': { path: '/projects', name: 'Projects', description: 'Project categories and templates' },
  'users': { path: '/admin/users', name: 'Admin Users', description: 'User management' },
  'settings': { path: '/admin', name: 'Admin Dashboard', description: 'System settings and administration' },
  'files': { path: '/reviews', name: 'Library Files', description: 'All files in the library system' },
  'media': { path: '/reviews', name: 'Media Files', description: 'Media assets and resources' },
};

export function CMSChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [libraryFiles, setLibraryFiles] = useState<LibraryFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Trailblazer. I can help you find documents, projects, templates, or library files. Try asking: 'Find Library Files', 'Show Brand Assets', 'Find Email Templates', or 'Go to Commercial Project'.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch documents and library files when chatbot opens
  useEffect(() => {
    if (isOpen && documents.length === 0) {
      fetchDocuments();
      fetchLibraryFiles();
    }
  }, [isOpen]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('id, title, project_id, projects!inner(name)')
        .eq('is_template', false)
        .neq('status', 'archived')
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchLibraryFiles = async () => {
    try {
      // Fetch from documents table where is_template is true for library files
      const { data: templateData, error: templateError } = await supabase
        .from('documents')
        .select('id, title, project_id')
        .eq('is_template', true)
        .order('created_at', { ascending: false })
        .limit(30);

      if (templateError) {
        console.error('Error fetching library files:', templateError);
      }

      // Transform template data to library files format
      const libraryFilesFromTemplates = (templateData || []).map(item => ({
        id: item.id,
        title: item.title,
        content_type: 'template',
        description: 'Library template file',
        project_id: item.project_id,
      }));

      setLibraryFiles(libraryFilesFromTemplates);
    } catch (error) {
      console.error('Error fetching library files:', error);
    }
  };

  const searchDocuments = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.projects?.name?.toLowerCase().includes(lowerQuery)
    );
  };

  const searchLibraryFiles = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return libraryFiles.filter(file => 
      file.title.toLowerCase().includes(lowerQuery) ||
      file.content_type.toLowerCase().includes(lowerQuery) ||
      file.description?.toLowerCase().includes(lowerQuery)
    );
  };

  const findBestMatch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for library file searches first
    if (lowerQuery.includes('library') || lowerQuery.includes('asset') || lowerQuery.includes('image') || 
        lowerQuery.includes('logo') || lowerQuery.includes('brand') || lowerQuery.includes('file') || 
        lowerQuery.includes('media')) {
      const libraryResults = searchLibraryFiles(query);
      if (libraryResults.length > 0) {
        return {
          type: 'library',
          results: libraryResults.slice(0, 5)
        };
      }
      // If no library files found, show library navigation
      const libraryNavOptions = [] as any[];
      if (lowerQuery.includes('asset') || lowerQuery.includes('image')) {
        libraryNavOptions.push(CMS_NAVIGATION_MAP.assets);
      }
      if (lowerQuery.includes('logo')) {
        libraryNavOptions.push(CMS_NAVIGATION_MAP.logos);
      }
      if (lowerQuery.includes('brand')) {
        libraryNavOptions.push(CMS_NAVIGATION_MAP['brand assets']);
      }
      libraryNavOptions.push(CMS_NAVIGATION_MAP.library);
      
      return {
        type: 'navigation',
        results: libraryNavOptions.length > 0 ? libraryNavOptions : [CMS_NAVIGATION_MAP.library]
      };
    }
    
    // Then check for document searches
    if (lowerQuery.includes('find') || lowerQuery.includes('open') || lowerQuery.includes('search')) {
      const documentResults = searchDocuments(query);
      if (documentResults.length > 0) {
        return {
          type: 'documents',
          results: documentResults.slice(0, 5)
        };
      }
    }
    
    // Direct navigation matches
    for (const [key, value] of Object.entries(CMS_NAVIGATION_MAP)) {
      if (lowerQuery.includes(key.toLowerCase())) {
        return {
          type: 'navigation',
          results: [value]
        };
      }
    }
    
    // Fuzzy matching for common terms
    const fuzzyMatches = [] as any[];
    if (lowerQuery.includes('email')) {
      const emailDocs = searchDocuments('email');
      if (emailDocs.length > 0) {
        return {
          type: 'documents',
          results: emailDocs.slice(0, 3)
        };
      }
      fuzzyMatches.push(CMS_NAVIGATION_MAP['email template']);
    }
    if (lowerQuery.includes('user')) {
      fuzzyMatches.push(CMS_NAVIGATION_MAP.users);
    }
    if (lowerQuery.includes('document')) {
      const docResults = searchDocuments('');
      if (docResults.length > 0) {
        return {
          type: 'documents',
          results: docResults.slice(0, 5)
        };
      }
      fuzzyMatches.push(CMS_NAVIGATION_MAP.documents);
    }
    if (lowerQuery.includes('template')) {
      const templateResults = searchDocuments('template');
      if (templateResults.length > 0) {
        return {
          type: 'documents',
          results: templateResults.slice(0, 3)
        };
      }
      fuzzyMatches.push(CMS_NAVIGATION_MAP.templates, CMS_NAVIGATION_MAP['email template']);
    }
    if (lowerQuery.includes('content')) {
      fuzzyMatches.push(CMS_NAVIGATION_MAP['content']);
    }
    if (lowerQuery.includes('commercial')) {
      fuzzyMatches.push(CMS_NAVIGATION_MAP.commercial);
    }
    if (lowerQuery.includes('medical')) {
      fuzzyMatches.push(CMS_NAVIGATION_MAP['medical education'], CMS_NAVIGATION_MAP['medical affairs']);
    }
    if (lowerQuery.includes('video')) {
      fuzzyMatches.push(CMS_NAVIGATION_MAP.videos);
    }
    if (lowerQuery.includes('podcast')) {
      fuzzyMatches.push(CMS_NAVIGATION_MAP.podcasts);
    }
    
    return {
      type: 'navigation',
      results: fuzzyMatches.length > 0 ? fuzzyMatches : []
    };
  };

  const generateResponse = (query: string) => {
    const matches = findBestMatch(query);
    
    if (matches.type === 'library' && matches.results.length > 0) {
      const files = matches.results as LibraryFile[];
      return {
        content: `I found ${files.length} library file${files.length > 1 ? 's' : ''} matching your search:`,
        actions: files.map(file => ({
          label: file.title,
          path: '/reviews',
          description: `${file.content_type} • ${file.description || 'Library file'}`
        }))
      };
    }
    
    if (matches.type === 'documents' && matches.results.length > 0) {
      const docs = matches.results as Document[];
      return {
        content: `I found ${docs.length} document${docs.length > 1 ? 's' : ''} matching your search:`,
        actions: docs.map(doc => ({
          label: doc.title,
          path: `/docs/${doc.id}`,
          description: `In project: ${doc.projects?.name || 'Unknown'}`
        }))
      };
    }
    
    if (matches.type === 'navigation' && matches.results.length === 0) {
      return {
        content: "I couldn't find exactly what you're looking for. Here are the main sections you can explore:",
        actions: [
          { label: 'Dashboard', path: '/dashboard', description: 'Main overview' },
          { label: 'My Documents', path: '/docs', description: 'Your documents' },
          { label: 'Projects', path: '/projects', description: 'Project templates' },
          { label: 'Commercial Project', path: '/projects/98b4ea9c-4eba-4f56-97a2-4437f251cf86/templates', description: 'Commercial templates' },
          { label: 'Library & Assets', path: '/reviews', description: 'Document library, images, logos, and assets' },
          { label: 'Admin', path: '/admin', description: 'Administration' },
        ]
      };
    }
    
    if (matches.type === 'navigation' && matches.results.length === 1) {
      const match = matches.results[0] as any;
      return {
        content: `Found it! ${match.name} is located at "${match.description}". Would you like me to take you there?`,
        actions: [
          { label: `Go to ${match.name}`, path: match.path, description: match.description }
        ]
      };
    }
    
    return {
      content: 'I found multiple sections that might help you:',
      actions: matches.results.map((match: any) => {
        if ('title' in match && 'content_type' in match) {
          // This is a LibraryFile
          return {
            label: match.title,
            path: '/reviews',
            description: `${match.content_type} • ${match.description || 'Library file'}`
          };
        } else if ('title' in match) {
          // This is a Document
          return {
            label: match.title,
            path: `/docs/${match.id}`,
            description: `In project: ${match.projects?.name || 'Unknown'}`
          };
        } else {
          // This is a navigation item
          return {
            label: match.name,
            path: match.path,
            description: match.description
          };
        }
      })
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        actions: response.actions,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
    
    // Add a confirmation message
    const confirmMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Perfect! It's done. Is there anything else you'd like to find?`,
      timestamp: new Date(),
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, confirmMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 group animate-fade-in"
        style={{
          background: 'rgba(236, 12, 12, 0.9)',
          backdropFilter: 'blur(20px)',
        }}
        aria-label="Open CMS Assistant"
      >
        <MessageCircle className="w-7 h-7 mx-auto group-hover:scale-110 transition-transform duration-200" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] animate-scale-in z-50 flex flex-col overflow-hidden rounded-3xl shadow-2xl border border-white/20" 
         style={{
           background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
           backdropFilter: 'blur(20px)',
         }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-6 flex items-center justify-between rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Trailblazer</h3>
            <p className="text-xs opacity-90">Navigation Helper</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        <style dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `
        }} />
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
                  : 'bg-white/60 text-gray-800 border border-gray-200/50 shadow-sm'
              }`}
              style={{
                backdropFilter: 'blur(10px)',
                color: message.type === 'user' ? 'white' : '#1f2937'
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: message.type === 'user' ? 'white' : '#374151' }}>{message.content}</p>
              
              {message.actions && (
                <div className="mt-4 space-y-2">
                  {message.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(action.path)}
                      className="w-full text-left p-3 rounded-xl bg-white/40 border border-gray-200/30 hover:bg-white/60 hover:border-gray-300/50 transition-all duration-200 group flex items-center justify-between backdrop-blur-sm hover-scale"
                      style={{ backdropFilter: 'blur(8px)' }}
                    >
                      <div>
                        <div className="font-medium text-sm text-gray-800" style={{ color: '#1f2937' }}>{action.label}</div>
                        {action.description && (
                          <div className="text-xs text-gray-600 mt-1" style={{ color: '#4b5563' }}>{action.description}</div>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/60 backdrop-blur-sm text-gray-800 p-4 rounded-2xl border border-gray-200/50 shadow-sm" style={{ color: '#374151' }}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200/30 bg-white/40 backdrop-blur-sm rounded-b-3xl">
        <div className="flex gap-3">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me where to find something..."
            className="flex-1 text-sm px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-200 placeholder-gray-500"
            style={{ color: '#374151' }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-3 rounded-2xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover-scale"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setInputValue('Find Email Templates')}
            className="text-xs text-gray-600 hover:text-gray-800 transition-colors bg-white/50 hover:bg-white/70 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200/50 hover:border-gray-300/50 hover-scale"
            style={{ color: '#4b5563' }}
          >
            Find templates
          </button>
          <button
            onClick={() => setInputValue('Go to Commercial project')}
            className="text-xs text-gray-600 hover:text-gray-800 transition-colors bg-white/50 hover:bg-white/70 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200/50 hover:border-gray-300/50 hover-scale"
            style={{ color: '#4b5563' }}
          >
            Commercial
          </button>
          <button
            onClick={() => setInputValue('Take me to Library')}
            className="text-xs text-gray-600 hover:text-gray-800 transition-colors bg-white/50 hover:bg-white/70 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200/50 hover:border-gray-300/50 hover-scale"
            style={{ color: '#4b5563' }}
          >
            Library
          </button>
        </div>
      </div>
    </div>
  );
}