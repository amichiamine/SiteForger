import React from 'react';
import { 
  Home, 
  Edit3, 
  FolderOpen, 
  Book, 
  Upload, 
  Layout,
  Zap
} from 'lucide-react';
import type { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, icon: Home, label: 'Tableau de Bord' },
    { id: 'editor' as ViewType, icon: Edit3, label: 'Éditeur de Page' },
    { id: 'projects' as ViewType, icon: FolderOpen, label: 'Gestionnaire de Projets' },
    { id: 'templates' as ViewType, icon: Layout, label: 'Bibliothèque Templates' },
    { id: 'deploy' as ViewType, icon: Upload, label: 'Déploiement' },
    { id: 'docs' as ViewType, icon: Book, label: 'Documentation' },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SiteForger</h1>
            <p className="text-sm text-gray-400">Web Builder Pro</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-1">Version Pro</h3>
          <p className="text-sm text-blue-100">Toutes fonctionnalités débloquées</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;