import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Star, Grid, List } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  rating: number;
  downloads: number;
  tags: string[];
  type: 'free' | 'premium';
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', 'portfolio', 'business', 'e-commerce', 'blog', 'landing'];

  const templates: Template[] = [
    {
      id: '1',
      name: 'Portfolio Modern',
      description: 'Portfolio élégant pour créatifs et développeurs',
      category: 'portfolio',
      preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      rating: 4.8,
      downloads: 1250,
      tags: ['responsive', 'modern', 'animations'],
      type: 'free'
    },
    {
      id: '2',
      name: 'Business Pro',
      description: 'Site corporate professionnel avec CMS intégré',
      category: 'business',
      preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      rating: 4.9,
      downloads: 890,
      tags: ['corporate', 'cms', 'seo'],
      type: 'premium'
    },
    {
      id: '3',
      name: 'E-Shop Minimal',
      description: 'Boutique en ligne minimaliste et performante',
      category: 'e-commerce',
      preview: 'https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg',
      rating: 4.7,
      downloads: 2100,
      tags: ['ecommerce', 'minimal', 'cart'],
      type: 'free'
    },
    {
      id: '4',
      name: 'Tech Blog',
      description: 'Blog technique avec syntax highlighting',
      category: 'blog',
      preview: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg',
      rating: 4.6,
      downloads: 675,
      tags: ['blog', 'tech', 'markdown'],
      type: 'free'
    },
    {
      id: '5',
      name: 'Landing Pro',
      description: 'Landing page haute conversion avec A/B testing',
      category: 'landing',
      preview: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
      rating: 5.0,
      downloads: 1890,
      tags: ['landing', 'conversion', 'analytics'],
      type: 'premium'
    },
    {
      id: '6',
      name: 'Creative Agency',
      description: 'Site d\'agence créative avec galerie interactive',
      category: 'portfolio',
      preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      rating: 4.8,
      downloads: 1456,
      tags: ['creative', 'gallery', 'interactive'],
      type: 'premium'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const TemplateCard = ({ template }: { template: Template }) => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors group">
      <div className="relative">
        <img 
          src={template.preview} 
          alt={template.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="p-2 bg-white/20 backdrop-blur rounded-lg text-white hover:bg-white/30 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onSelectTemplate(template)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Utiliser
          </button>
        </div>
        {template.type === 'premium' && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-600 rounded-full text-xs font-medium text-white">
            Premium
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{template.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">{template.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-3">{template.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Download className="w-4 h-4" />
            {template.downloads.toLocaleString()}
          </div>
          <button 
            onClick={() => onSelectTemplate(template)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
          >
            {template.type === 'premium' ? 'Acheter' : 'Gratuit'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Bibliothèque de Templates</h1>
        <p className="text-gray-400">Découvrez des templates professionnels pour vos projets web</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">Toutes catégories</option>
            <option value="portfolio">Portfolio</option>
            <option value="business">Business</option>
            <option value="e-commerce">E-commerce</option>
            <option value="blog">Blog</option>
            <option value="landing">Landing Page</option>
          </select>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Aucun template trouvé</h3>
          <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;