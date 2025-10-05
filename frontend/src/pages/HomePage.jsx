import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Rocket, Sparkles, MessageCircle } from 'lucide-react';
import FloatingChatbot from '../components/FloatingChatbot';
import Header from '../components/Header';

const HomePage = () => {
  const navigate = useNavigate();
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);

  // Counter animation effect
  useEffect(() => {
    // Animate categories count from 0 to 13
    const categoriesInterval = setInterval(() => {
      setCategoriesCount(prev => {
        if (prev >= 13) {
          clearInterval(categoriesInterval);
          return 13;
        }
        return prev + 1;
      });
    }, 200);

    // Animate articles count from 0 to 600
    const articlesInterval = setInterval(() => {
      setArticlesCount(prev => {
        if (prev >= 600) {
          clearInterval(articlesInterval);
          return 600;
        }
        return prev + 10;
      });
    }, 60);

    return () => {
      clearInterval(categoriesInterval);
      clearInterval(articlesInterval);
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <Header />
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-80px)] px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <Rocket className="w-20 h-20 text-blue-400 relative animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AstroGen AI Knowledge Engine
            </span>
          </h1>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-slate-300">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>Exploring the Frontiers of Space Science</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dive into a comprehensive collection of cutting-edge research on space biology, 
            microgravity effects, radiation studies, and the future of human spaceflight.
          </p>

          {/* CTA Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('/categories')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg font-semibold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
            >
              Explore the Knowledge Engine Now
              <Rocket className="ml-2 w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => navigate('/chatbot')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-lg font-semibold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50"
            >
              Chat with AstroGen AI
              <MessageCircle className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 grid grid-cols-3 gap-4 text-sm text-slate-400">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-400 transition-all duration-300">
                {categoriesCount}
              </div>
              <div className="text-xs">Research Categories</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-400 transition-all duration-300">
                {articlesCount}+
              </div>
              <div className="text-xs">Scientific Articles</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-pink-400">BPS</div>
              <div className="text-xs">NASA Biology and Physical Sciences</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
};

export default HomePage;