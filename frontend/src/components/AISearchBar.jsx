import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles, FileText, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import knowledgeBase from '../data/knowledge-base.json';

const AISearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryResults, setCategoryResults] = useState([]);
  const [articleResults, setArticleResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const API_KEY = 'AIzaSyBMQI6cLQB3Tg4cN6bKXgbpYLnJxR5-P2s';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prepare knowledge context for AI
  const prepareSearchContext = () => {
    let context = "You are a search assistant for a space research knowledge base. ";
    context += "Based on the user's search query, provide a brief summary of relevant information and list matching categories.\n\n";
    
    context += "AVAILABLE CATEGORIES:\n";
    knowledgeBase.categories.forEach(cat => {
      context += `- ${cat.name}: ${cat.description}\n`;
    });
    
    context += "\nKEY TOPICS:\n";
    if (knowledgeBase.key_topics) {
      Object.entries(knowledgeBase.key_topics).forEach(([topic, description]) => {
        context += `- ${topic.replace('_', ' ')}: ${description}\n`;
      });
    }
    
    return context;
  };

  // AI-powered search
  const performAISearch = async (query) => {
    if (!query.trim()) {
      setCategoryResults([]);
      setArticleResults([]);
      setAiSummary('');
      return;
    }

    setIsSearching(true);

    try {
      // Local search in categories
      const matchingCategories = knowledgeBase.categories.filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        cat.description.toLowerCase().includes(query.toLowerCase()) ||
        cat.details.toLowerCase().includes(query.toLowerCase())
      );

      setCategoryResults(matchingCategories);

      // Search in articles from JSON file
      try {
        const response = await fetch('/data/research.json');
        if (response.ok) {
          const articles = await response.json();
          const matchingArticles = articles
            .map((article, index) => ({ ...article, id: index })) // Add index as id
            .filter(article => 
              article.title?.toLowerCase().includes(query.toLowerCase()) ||
              article.abstract?.toLowerCase().includes(query.toLowerCase()) ||
              article.objectives?.some(obj => obj.toLowerCase().includes(query.toLowerCase())) ||
              article.methods?.some(method => method.toLowerCase().includes(query.toLowerCase())) ||
              article.categories?.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 5); // Limit to 5 articles
          
          setArticleResults(matchingArticles);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
        setArticleResults([]);
      }

      // Get AI summary
      const context = prepareSearchContext();
      const prompt = `${context}\n\nUser Search Query: "${query}"\n\nProvide a brief 2-3 sentence summary of what the user might be looking for and which categories are most relevant. Be concise and helpful.`;

      const requestBody = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && 
            data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
          setAiSummary(data.candidates[0].content.parts[0].text);
        }
      }

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && isOpen) {
        performAISearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6a7a9a' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search articles, categories..."
          className="w-full pl-10 pr-10 py-2 rounded-lg outline-none text-sm transition-all duration-300"
          style={{
            background: 'rgba(22, 28, 45, 0.8)',
            border: '1px solid',
            borderColor: isOpen ? '#5a6aaa' : '#3a4a6a',
            color: '#e0e0ff'
          }}
        />
        <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#aab6ff' }} />
      </div>

      {/* Search Dropdown */}
      {isOpen && (searchQuery || isSearching) && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-hidden z-50"
          style={{
            background: 'rgba(16, 21, 36, 0.98)',
            border: '1px solid #2a3a5a',
            boxShadow: '0 0 30px rgba(100, 120, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isSearching && (
              <div className="p-4 text-center" style={{ color: '#8a9ba8' }}>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">AI is searching...</span>
                </div>
              </div>
            )}

            {!isSearching && searchQuery && (
              <>
                {/* AI Summary */}
                {aiSummary && (
                  <div className="p-4 border-b" style={{ 
                    borderColor: '#2a3a5a',
                    background: 'rgba(90, 106, 170, 0.1)'
                  }}>
                    <div className="flex items-start gap-2 mb-2">
                      <Sparkles className="w-4 h-4 mt-1" style={{ color: '#aab6ff' }} />
                      <span className="text-xs font-semibold" style={{ color: '#aab6ff' }}>AI Summary</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#c0c0e0' }}>
                      {aiSummary}
                    </p>
                  </div>
                )}

                {/* Article Results */}
                {articleResults.length > 0 && (
                  <div className="p-2 border-b" style={{ borderColor: '#2a3a5a' }}>
                    <div className="px-2 py-2 text-xs font-semibold flex items-center gap-2" style={{ color: '#8a9ba8' }}>
                      <FileText className="w-4 h-4" />
                      Articles ({articleResults.length})
                    </div>
                    {articleResults.map((article, index) => (
                      <button
                        key={index}
                        onClick={() => handleArticleClick(article.id)}
                        className="w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-white/5 border-l-2 border-transparent hover:border-blue-500"
                      >
                        <div className="font-semibold text-sm mb-1" style={{ color: '#aab6ff' }}>
                          {article.title}
                        </div>
                        <div className="text-xs line-clamp-2" style={{ color: '#8a9ba8' }}>
                          {article.abstract || 'No abstract available'}
                        </div>
                        {article.categories && article.categories.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {article.categories.slice(0, 2).map((cat, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 rounded" style={{
                                background: 'rgba(90, 106, 170, 0.2)',
                                color: '#aab6ff'
                              }}>
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Category Results */}
                {categoryResults.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-2 text-xs font-semibold flex items-center gap-2" style={{ color: '#8a9ba8' }}>
                      <Folder className="w-4 h-4" />
                      Categories ({categoryResults.length})
                    </div>
                    {categoryResults.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryClick(category.name)}
                        className="w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-white/5"
                      >
                        <div className="font-semibold text-sm mb-1" style={{ color: '#aab6ff' }}>
                          {category.name}
                        </div>
                        <div className="text-xs" style={{ color: '#8a9ba8' }}>
                          {category.description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {categoryResults.length === 0 && articleResults.length === 0 && (
                  <div className="p-4 text-center text-sm" style={{ color: '#8a9ba8' }}>
                    No results found matching "{searchQuery}"
                  </div>
                )}
              </>
            )}

            {!searchQuery && !isSearching && (
              <div className="p-4 text-center text-sm" style={{ color: '#8a9ba8' }}>
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Start typing to search with AI</p>
                <p className="text-xs mt-1">Try: "radiation", "plants", "ISS"</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          width: 4px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(20, 25, 45, 0.5);
        }

        div::-webkit-scrollbar-thumb {
          background: #3a4a6a;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default AISearchBar;
