import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import FloatingChatbot from '../components/FloatingChatbot';
import Header from '../components/Header';
import { 
  Dna, Microscope, Heart, Leaf, Radiation, 
  Globe, Building2, Database, Bone, Activity, 
  Atom, Cpu, FolderOpen 
} from 'lucide-react';

const categories = [
  { name: 'Space Biology', icon: Dna, description: 'Biological processes in space environments', color: 'from-emerald-500 to-teal-600' },
  { name: 'Space Microbiology', icon: Microscope, description: 'Microbial life and behavior in space', color: 'from-blue-500 to-cyan-600' },
  { name: 'Space Medicine', icon: Heart, description: 'Health and medical research for astronauts', color: 'from-red-500 to-rose-600' },
  { name: 'Plant Biology', icon: Leaf, description: 'Plant growth and adaptation in space', color: 'from-green-500 to-lime-600' },
  { name: 'Radiation Effects', icon: Radiation, description: 'Impact of cosmic radiation on living organisms', color: 'from-yellow-500 to-orange-600' },
  { name: 'Microgravity Effects', icon: Globe, description: 'Effects of reduced gravity on biological systems', color: 'from-indigo-500 to-purple-600' },
  { name: 'ISS Research', icon: Building2, description: 'Studies conducted on the International Space Station', color: 'from-violet-500 to-purple-600' },
  { name: 'Omics in Space', icon: Database, description: 'Genomics, proteomics, and metabolomics in space', color: 'from-fuchsia-500 to-pink-600' },
  { name: 'Bone & Muscle', icon: Bone, description: 'Musculoskeletal changes in microgravity', color: 'from-amber-500 to-red-600' },
  { name: 'Space Physiology', icon: Activity, description: 'Physiological adaptations to space environments', color: 'from-sky-500 to-blue-600' },
  { name: 'Astrobiology', icon: Atom, description: 'Search for life beyond Earth', color: 'from-purple-500 to-indigo-600' },
  { name: 'Space Technology', icon: Cpu, description: 'Technological innovations for space exploration', color: 'from-cyan-500 to-teal-600' },
  { name: 'Others', icon: FolderOpen, description: 'Additional space research topics', color: 'from-slate-500 to-gray-600' },
];

const CategoriesPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Research Categories
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Select a category to explore cutting-edge space research and scientific discoveries
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer group"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center transform transition-transform group-hover:rotate-6`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    {category.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    Open Category
                  </Button>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Back to Home
          </Button>
        </div>
      </div>
      
      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
};

export default CategoriesPage;