import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Rocket, Home } from 'lucide-react';
import AISearchBar from './AISearchBar';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-lg" style={{
      background: 'rgba(10, 14, 23, 0.8)',
      borderColor: '#2a3a5a'
    }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all" />
              <Rocket className="w-8 h-8 text-blue-400 relative group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AstroGen
              </h1>
              <p className="text-xs" style={{ color: '#8a9ba8' }}>
                AI Knowledge Engine
              </p>
            </div>
          </div>

          {/* AI Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <AISearchBar />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/categories')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/categories' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => navigate('/chatbot')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/chatbot' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              AI Chat
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
