import React from 'react';
import { Save, Eye, Code, Settings, Bell } from 'lucide-react';
import type { ViewType } from '../App';

interface HeaderProps {
  currentView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const getViewTitle = (view: ViewType) => {
    const titles = {
      dashboard: 'Tableau de Bord',
      editor: 'Éditeur de Page',
      projects: 'Gestionnaire de Projets',
      docs: 'Documentation',
      deploy: 'Déploiement',
      templates: 'Bibliothèque Templates'
    };
    return titles[view] || 'SiteForger';
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{getViewTitle(currentView)}</h2>
          <p className="text-sm text-gray-400">Créez des sites web professionnels en quelques clics</p>
        </div>

        <div className="flex items-center gap-4">
          {currentView === 'editor' && (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                <Eye className="w-4 h-4" />
                Prévisualiser
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                <Code className="w-4 h-4" />
                Code
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;