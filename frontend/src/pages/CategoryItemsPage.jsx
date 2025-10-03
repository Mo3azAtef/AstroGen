import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';

const CategoryItemsPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load JSON data from the public folder
    fetch('/data/research.json')
      .then(res => res.json())
      .then(data => {
        // Filter articles by category
        const filtered = data.filter(article => 
          article.categories && article.categories.includes(decodeURIComponent(categoryName))
        );
        setArticles(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setLoading(false);
      });
  }, [categoryName]);

  const getPreviewText = (article) => {
    // Create preview from insights or objective
    const text = article.insights || article.objective || '';
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Loading research articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/categories')}
            className="text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {decodeURIComponent(categoryName)}
            </span>
          </h1>
          <p className="text-lg text-slate-400">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'} found
          </p>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-20 h-20 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400">No articles found in this category</p>
          </div>
        ) : (
          <div className="grid gap-6 max-w-5xl">
            {articles.map((article, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer group"
                onClick={() => navigate(`/article/${index}`)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors flex-1">
                      {article.title}
                    </CardTitle>
                    <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </div>
                  
                  <CardDescription className="text-slate-400 leading-relaxed">
                    {getPreviewText(article)}
                  </CardDescription>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {article.categories && article.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    Read Full Article
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItemsPage;