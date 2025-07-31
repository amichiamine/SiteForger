import React from 'react';
import { Plus, FolderPlus, Download, Upload, Zap, Users, Globe, Code } from 'lucide-react';
import type { ViewType } from '../App';

interface DashboardProps {
  onViewChange: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const stats = [
    { icon: Globe, label: 'Sites Créés', value: '12', color: 'blue' },
    { icon: Code, label: 'Pages Actives', value: '47', color: 'green' },
    { icon: Users, label: 'Visiteurs', value: '2.4k', color: 'purple' },
    { icon: Zap, label: 'Performance', value: '98%', color: 'yellow' }
  ];

  const quickActions = [
    { 
      icon: Plus, 
      label: 'Nouvelle Page', 
      description: 'Créer une nouvelle page à partir de zéro',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => onViewChange('editor')
    },
    { 
      icon: FolderPlus, 
      label: 'Nouveau Projet', 
      description: 'Initialiser un nouveau projet web',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => onViewChange('projects')
    },
    { 
      icon: Download, 
      label: 'Importer Projet', 
      description: 'Importer un projet VS Code existant',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => onViewChange('projects')
    },
    { 
      icon: Upload, 
      label: 'Déployer Site', 
      description: 'Déployer vers hébergement web',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => onViewChange('deploy')
    }
  ];

  const recentProjects = [
    { name: 'Portfolio Personnel', pages: 5, lastModified: '2 heures', status: 'En cours' },
    { name: 'Site E-commerce', pages: 12, lastModified: '1 jour', status: 'Terminé' },
    { name: 'Blog Tech', pages: 8, lastModified: '3 jours', status: 'En cours' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Bienvenue dans SiteForger</h1>
        <p className="text-blue-100 text-lg mb-6">
          Créez, modifiez et déployez vos sites web avec la puissance d'un éditeur professionnel
        </p>
        <button 
          onClick={() => onViewChange('editor')}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Commencer un nouveau projet
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-600`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} p-6 rounded-xl text-left transition-all duration-200 transform hover:scale-105 shadow-lg`}
              >
                <Icon className="w-8 h-8 text-white mb-3" />
                <h3 className="font-semibold text-white mb-2">{action.label}</h3>
                <p className="text-sm text-white/80">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Projets Récents</h2>
          <button 
            onClick={() => onViewChange('projects')}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Voir tous
          </button>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Nom du Projet</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Pages</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Dernière Modification</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentProjects.map((project, index) => (
                  <tr key={index} className="hover:bg-gray-700/50 cursor-pointer">
                    <td className="px-6 py-4 text-white font-medium">{project.name}</td>
                    <td className="px-6 py-4 text-gray-300">{project.pages} pages</td>
                    <td className="px-6 py-4 text-gray-300">Il y a {project.lastModified}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Terminé' 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-blue-600/20 text-blue-400'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;