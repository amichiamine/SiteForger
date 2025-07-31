import React, { useState } from 'react';
import { 
  Server, 
  Upload, 
  Settings, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Database,
  Shield
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { deploymentService } from '../services/deploymentService';
import { DeploymentHistory } from '../types';

interface DeploymentProps {
  projectId: string | null;
}

const Deployment: React.FC<DeploymentProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<'cpanel' | 'config' | 'status'>('cpanel');
  const [deploymentSettings, setDeploymentSettings] = useState({
    host: '',
    username: '',
    password: '',
    domain: '',
    path: '/public_html',
    dbHost: 'localhost',
    dbPort: '5432',
    dbName: '',
    dbUser: ''
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);
  const [testingConnection, setTestingConnection] = useState(false);
  
  const { getProject } = useProjects();
  const currentProject = projectId ? getProject(projectId) : null;

  React.useEffect(() => {
    if (currentProject?.settings.deployment) {
      setDeploymentSettings(prev => ({
        ...prev,
        ...currentProject.settings.deployment
      }));
    }
  }, [currentProject]);

  const handleDeploy = async () => {
    if (!currentProject) return;
    
    setIsDeploying(true);
    try {
      const deployment = await deploymentService.deployToCPanel(currentProject, {
        provider: 'cpanel',
        host: deploymentSettings.host,
        username: deploymentSettings.username,
        password: deploymentSettings.password,
        path: deploymentSettings.path
      });
      
      setDeploymentHistory(prev => [deployment, ...prev]);
      alert('Déploiement réussi !');
    } catch (error) {
      alert('Erreur lors du déploiement');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const isConnected = await deploymentService.testConnection({
        provider: 'cpanel',
        host: deploymentSettings.host,
        username: deploymentSettings.username,
        password: deploymentSettings.password,
        path: deploymentSettings.path
      });
      
      if (isConnected) {
        alert('Connexion réussie !');
      } else {
        alert('Échec de la connexion');
      }
    } catch (error) {
      alert('Erreur lors du test de connexion');
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Déploiement</h1>
        <p className="text-gray-400">
          Déployez vos sites vers un hébergement web mutualisé
          {currentProject && (
            <span className="ml-2 text-blue-400">- Projet: {currentProject.name}</span>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8">
        {[
          { id: 'cpanel', label: 'Hébergement cPanel', icon: Server },
          { id: 'config', label: 'Configuration', icon: Settings },
          { id: 'status', label: 'Statut & Historique', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* cPanel Tab */}
      {activeTab === 'cpanel' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration Hébergement cPanel</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL du cPanel</label>
                <input
                  type="url"
                  value={deploymentSettings.host}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, host: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://cpanel.votre-hebergeur.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={deploymentSettings.username}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="votre-username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={deploymentSettings.password}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Domaine</label>
                <input
                  type="text"
                  value={deploymentSettings.domain}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="monsite.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Répertoire de destination</label>
                <input
                  type="text"
                  value={deploymentSettings.path}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, path: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="/public_html"
                />
              </div>
            </form>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Actions de Déploiement</h3>
            <div className="flex gap-4">
              <button 
                onClick={handleDeploy}
                disabled={isDeploying || !currentProject}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
              >
                <Upload className="w-5 h-5" />
                {isDeploying ? 'Déploiement...' : 'Déployer Maintenant'}
              </button>
              <button 
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
              >
                <Settings className="w-5 h-5" />
                {testingConnection ? 'Test...' : 'Tester la Connexion'}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration Base de Données</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Host PostgreSQL</label>
                <input
                  type="text"
                  value={deploymentSettings.dbHost}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, dbHost: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="localhost"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Port</label>
                <input
                  type="text"
                  value={deploymentSettings.dbPort}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, dbPort: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="5432"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom de la BDD</label>
                <input
                  type="text"
                  value={deploymentSettings.dbName}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, dbName: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="siteforger_db"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Utilisateur BDD</label>
                <input
                  type="text"
                  value={deploymentSettings.dbUser}
                  onChange={(e) => setDeploymentSettings(prev => ({ ...prev, dbUser: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="db_user"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Paramètres de Build</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Commande de Build</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  defaultValue="npm run build"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Répertoire de sortie</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  defaultValue="/dist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Variables d'environnement</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={4}
                  placeholder="NODE_ENV=production&#10;API_URL=https://api.monsite.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Options de Sécurité</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">SSL/HTTPS</p>
                  <p className="text-gray-400 text-sm">Forcer l'utilisation d'HTTPS</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Compression Gzip</p>
                  <p className="text-gray-400 text-sm">Compresser les fichiers statiques</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Cache Browser</p>
                  <p className="text-gray-400 text-sm">Activer la mise en cache côté client</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Tab */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-white">Dernier Déploiement</h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">15 Jan 2024, 14:30</p>
              <p className="text-green-400 font-medium">Succès</p>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Site Actuel</h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">Version v1.2.1</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                Voir le site <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-white">Base de Données</h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">PostgreSQL 14.2</p>
              <p className="text-green-400 font-medium">Connectée</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Historique des Déploiements</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-sm font-medium text-gray-300 pb-3">Date</th>
                    <th className="text-left text-sm font-medium text-gray-300 pb-3">Statut</th>
                    <th className="text-left text-sm font-medium text-gray-300 pb-3">Version</th>
                    <th className="text-left text-sm font-medium text-gray-300 pb-3">URL</th>
                    <th className="text-left text-sm font-medium text-gray-300 pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {deploymentHistory.map((deployment, index) => (
                    <tr key={index}>
                      <td className="py-3 text-white">{new Date(deployment.deployedAt).toLocaleString('fr-FR')}</td>
                      <td className="py-3">
                        <span className={`flex items-center gap-2 ${
                          deployment.status === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {deployment.status === 'success' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          {deployment.status === 'success' ? 'Succès' : 'Échec'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-300">{deployment.version}</td>
                      <td className="py-3">
                        {deployment.url ? (
                          <a href={deployment.url} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Voir <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3">
                        <button 
                          onClick={() => deploymentService.rollback(currentProject?.id || '', deployment.id)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Rollback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {deploymentHistory.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucun déploiement effectué</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Deployment;