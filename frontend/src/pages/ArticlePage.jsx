import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { 
  ArrowLeft, Target, Beaker, BarChart3, 
  Lightbulb, Network, CheckCircle2, ExternalLink 
} from 'lucide-react';

const ArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load JSON data from the public folder
    fetch('/data/research.json')
      .then(res => res.json())
      .then(data => {
        const selectedArticle = data[parseInt(articleId)];
        setArticle(selectedArticle);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading article:', err);
        setLoading(false);
      });
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-400">Article not found</p>
          <Button onClick={() => navigate('/categories')} className="mt-4">
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  const sections = [
    { key: 'objective', title: 'Objective', icon: Target, color: 'text-blue-400' },
    { key: 'methodology', title: 'Methodology', icon: Beaker, color: 'text-purple-400' },
    { key: 'results', title: 'Results', icon: BarChart3, color: 'text-green-400' },
    { key: 'conclusions', title: 'Conclusions', icon: CheckCircle2, color: 'text-yellow-400' },
    { key: 'relationships', title: 'Relationships', icon: Network, color: 'text-pink-400' },
    { key: 'insights', title: 'Insights', icon: Lightbulb, color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {article.title}
            </span>
          </h1>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.categories && article.categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-4 py-2 text-sm rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* External Link */}
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Original Source
            </a>
          )}
        </div>

        <Separator className="bg-slate-700 mb-12" />

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const content = article[section.key];
            
            if (!content) return null;

            return (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Icon className={`w-7 h-7 ${section.color}`} />
                    <span className="text-white">{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                    {content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-slate-700 flex justify-center">
          <Button
            onClick={() => navigate('/categories')}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Explore More Research
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;