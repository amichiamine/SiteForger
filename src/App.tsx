import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PageEditor from './components/PageEditor';
import ProjectManager from './components/ProjectManager';
import Documentation from './components/Documentation';
import Deployment from './components/Deployment';
import TemplateLibrary from './components/TemplateLibrary';
import { dbService } from './services/database';

export type ViewType = 'dashboard' | 'editor' | 'projects' | 'docs' | 'deploy' | 'templates';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // Initialize database on app start
  React.useEffect(() => {
    dbService.init().catch(console.error);
  }, []);
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'editor':
        return <PageEditor projectId={selectedProject} pageId={selectedPage} />;
      case 'projects':
        return <ProjectManager onSelectProject={setSelectedProject} onViewChange={setCurrentView} />;
      case 'docs':
        return <Documentation />;
      case 'deploy':
        return <Deployment projectId={selectedProject} />;
      case 'templates':
        return <TemplateLibrary onSelectTemplate={(template) => {
          // Handle template selection
          console.log('Selected template:', template);
          setCurrentView('editor');
        }} />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;