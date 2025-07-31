import React, { useState } from 'react';
import { 
  Plus, 
  FolderOpen, 
  Download, 
  Upload, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Code,
  Globe
} from 'lucide-react';
import type { ViewType } from '../App';
import { useProjects } from '../hooks/useProjects';
import { usePages } from '../hooks/usePages';

interface ProjectManagerProps {
  onSelectProject: (projectId: string) => void;
  onViewChange: (view: ViewType) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ onSelectProject, onViewChange }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    type: 'html' as 'html' | 'react' | 'php' | 'nodejs'
  });
  
  const { projects, createProject, deleteProject, loading } = useProjects();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const project = await createProject(newProjectData);
      setShowCreateModal(false);
      setNewProjectData({ name: '', description: '', type: 'html' });
      onSelectProject(project.id);
      onViewChange('editor');
    } catch (error) {
      alert('Erreur lors de la création du projet');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        alert('Erreur lors de la suppression du projet');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const getProjectTypeLabel = (type: string) => {
    const labels = {
      html: 'HTML/CSS/JS',
      react: 'React/TypeScript',
      php: 'PHP/PostgreSQL',
      nodejs: 'Node.js/Express'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const CreateProjectModal = () => (
    showCreateModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Nouveau Projet</h3>
          <form className="space-y-4" onSubmit={handleCreateProject}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom du projet</label>
              <input
                type="text"
                value={newProjectData.name}
                onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Mon Nouveau Site"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={newProjectData.description}
                onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                rows={3}
                placeholder="Description du projet..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type de projet</label>
              <select 
                value={newProjectData.type}
                onChange={(e) => setNewProjectData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="html">HTML/CSS/JS</option>
                <option value="react">React/TypeScript</option>
                <option value="php">PHP/PostgreSQL</option>
                <option value="nodejs">Node.js/Express</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const ImportProjectModal = () => (
    showImportModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Importer Projet VS Code</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Chemin du projet</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="/path/to/your/project"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ou sélectionner un dossier</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Glissez votre dossier ici</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Importer
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  return (
    <div className="p-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Gestionnaire de Projets</h1>
          <p className="text-gray-400">Gérez tous vos projets web depuis un seul endroit</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau Projet
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Importer
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                <p className="text-gray-400 text-sm">{project.description}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-1 text-gray-400 hover:text-white">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-1 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Pages:</span>
                <span className="text-white">{project.pages.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Type:</span>
                <span className="text-blue-400">{getProjectTypeLabel(project.type)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Statut:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'completed' 
                    ? 'bg-green-600/20 text-green-400' 
                    : 'bg-blue-600/20 text-blue-400'
                }`}>
                  {project.status === 'completed' ? 'Terminé' : 'En cours'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Modifié:</span>
                <span className="text-white">{formatDate(project.updatedAt)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSelectProject(project.id);
                  onViewChange('editor');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Éditer
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-sm font-medium transition-colors">
                <Globe className="w-4 h-4" />
                Préview
              </button>
              <button 
                onClick={() => {
                  onSelectProject(project.id);
                  onViewChange('deploy');
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                Déployer
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Aucun projet</h3>
          <p className="text-gray-400 mb-4">Créez votre premier projet pour commencer</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Créer un projet
          </button>
        </div>
      )}

      {/* Integration Options */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-white mb-6">Options d'Intégration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Export vers VS Code</h3>
                <p className="text-gray-400 text-sm">Exportez vos projets vers VS Code</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Générez automatiquement la structure de fichiers compatible avec VS Code, 
              incluant la configuration TypeScript, les dépendances npm et les scripts de build.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
              Configurer l'Export
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-600 rounded-lg">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Intégration Automatisée</h3>
                <p className="text-gray-400 text-sm">Synchronisation avec projets existants</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Connectez SiteForger à vos projets VS Code existants pour une édition 
              bidirectionnelle et une synchronisation automatique des modifications.
            </p>
            <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
              Configurer la Sync
            </button>
          </div>
        </div>
      </div>

      <CreateProjectModal />
      <ImportProjectModal />
    </div>
  );
};

export default ProjectManager;