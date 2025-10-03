import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Rocket, Sparkles } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <Rocket className="w-24 h-24 text-blue-400 relative animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Knowledge Engine
            </span>
          </h1>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-slate-300">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span>Exploring the Frontiers of Space Science</span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dive into a comprehensive collection of cutting-edge research on space biology, 
            microgravity effects, radiation studies, and the future of human spaceflight. 
            Discover insights from missions aboard the International Space Station and beyond.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              onClick={() => navigate('/categories')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg font-semibold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
            >
              Explore the Knowledge Engine Now
              <Rocket className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-400">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">13</div>
              <div>Research Categories</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">100+</div>
              <div>Scientific Articles</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-pink-400">ISS</div>
              <div>Space Station Data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;