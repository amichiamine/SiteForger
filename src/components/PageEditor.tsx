import React, { useState } from 'react';
import { 
  Type, 
  Image, 
  Square, 
  Columns, 
  Smartphone, 
  Tablet, 
  Monitor,
  Undo,
  Redo,
  Settings,
  Layers,
  Save,
  Eye,
  Code
} from 'lucide-react';
import ComponentLibrary from './ComponentLibrary';
import PreviewFrame from './PreviewFrame';
import CodeEditor from './CodeEditor';
import { Component } from '../types';
import { usePages } from '../hooks/usePages';
import { codeGenerator } from '../services/codeGenerator';

interface PageEditorProps {
  projectId: string | null;
  pageId: string | null;
}

const PageEditor: React.FC<PageEditorProps> = ({ projectId, pageId }) => {
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  
  const { pages, updatePage, getPage } = usePages(projectId);
  const currentPage = pageId ? getPage(pageId) : null;

  React.useEffect(() => {
    if (currentPage) {
      setComponents(currentPage.components || []);
    }
  }, [currentPage]);

  const deviceSizes = {
    mobile: 'w-80',
    tablet: 'w-96',
    desktop: 'w-full'
  };

  const handleAddComponent = (component: Component) => {
    const newComponents = [...components, component];
    setComponents(newComponents);
    savePageChanges(newComponents);
  };

  const handleSelectComponent = (componentId: string) => {
    setSelectedComponentId(componentId);
  };

  const handleUpdateComponent = (componentId: string, updates: Partial<Component>) => {
    const newComponents = components.map(comp => 
      comp.id === componentId ? { ...comp, ...updates } : comp
    );
    setComponents(newComponents);
    savePageChanges(newComponents);
  };

  const handleDeleteComponent = (componentId: string) => {
    const newComponents = components.filter(comp => comp.id !== componentId);
    setComponents(newComponents);
    savePageChanges(newComponents);
  };

  const savePageChanges = async (newComponents: Component[]) => {
    if (projectId && pageId) {
      try {
        await updatePage(projectId, pageId, { components: newComponents });
      } catch (error) {
        console.error('Failed to save page changes:', error);
      }
    }
  };

  const handleSave = async () => {
    if (projectId && pageId) {
      try {
        await updatePage(projectId, pageId, { 
          components,
          updatedAt: new Date().toISOString()
        });
        alert('Page sauvegardée avec succès !');
      } catch (error) {
        alert('Erreur lors de la sauvegarde');
      }
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const getGeneratedCode = () => {
    if (!currentPage) return { html: '', css: '', js: '' };
    
    const pageWithComponents = { ...currentPage, components };
    return {
      html: codeGenerator.generateComponentsHTML(components),
      css: codeGenerator.generateCSS(components),
      js: codeGenerator.generateJS(components)
    };
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newComponent: Component = {
        id: generateId(),
        type: componentData.type,
        name: componentData.name,
        props: componentData.defaultProps || {},
        children: [],
        styles: {},
        position: { x, y },
        size: { width: 300, height: 100 }
      };
      
      handleAddComponent(newComponent);
    } catch (error) {
      console.error('Failed to add component:', error);
    }
  };

  if (showPreview) {
    const { html, css, js } = getGeneratedCode();
    return (
      <div className="flex h-full">
        <div className="flex-1">
          <PreviewFrame
            html={html}
            css={css}
            javascript={js}
            title={currentPage?.title || 'Preview'}
            onDeviceChange={setSelectedDevice}
          />
        </div>
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Prévisualisation</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Retour
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Titre de la page</label>
              <input
                type="text"
                value={currentPage?.title || ''}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Composants</label>
              <div className="text-sm text-gray-400">
                {components.length} composant{components.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const renderComponent = (component: Component) => {
    const isSelected = selectedComponentId === component.id;
    
    return (
      <div
        key={component.id}
        className={`absolute cursor-pointer border-2 transition-colors ${
          isSelected ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
        }`}
        style={{
          left: component.position.x,
          top: component.position.y,
          width: component.size.width,
          height: component.size.height,
          ...component.styles
        }}
        onClick={() => handleSelectComponent(component.id)}
      >
        {renderComponentContent(component)}
        {isSelected && (
          <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded">
            {component.name}
          </div>
        )}
      </div>
    );
  };

  const renderComponentContent = (component: Component) => {
    switch (component.type) {
      case 'text':
        return <p className="p-2">{component.props.content || 'Texte'}</p>;
      
      case 'heading':
        const HeadingTag = `h${component.props.level || 1}` as keyof JSX.IntrinsicElements;
        return <HeadingTag className="p-2 font-bold">{component.props.content || 'Titre'}</HeadingTag>;
      
      case 'image':
        return (
          <img 
            src={component.props.src || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg'} 
            alt={component.props.alt || 'Image'} 
            className="w-full h-full object-cover"
          />
        );
      
      case 'button':
        return (
          <button className="w-full h-full bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {component.props.text || 'Bouton'}
          </button>
        );
      
      case 'container':
        return (
          <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Conteneur</span>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-500">{component.type}</span>
          </div>
        );
    }
  };
  return (
    <div className="flex h-full">
      {/* Components Panel */}
      <ComponentLibrary
        onAddComponent={handleAddComponent}
        onSelectComponent={handleSelectComponent}
        selectedComponentId={selectedComponentId}
      />

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                  <Undo className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              <div className="h-6 w-px bg-gray-600"></div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDevice('mobile')}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedDevice === 'mobile' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDevice('tablet')}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedDevice === 'tablet' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDevice('desktop')}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedDevice === 'desktop' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                Prévisualiser
              </button>
              <button
                onClick={() => setShowCode(!showCode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showCode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {showCode ? 'Designer' : 'Code'}
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-900 p-8 overflow-auto">
          <div className="flex justify-center">
            <div 
              className={`${deviceSizes[selectedDevice]} mx-auto bg-white rounded-lg shadow-2xl min-h-96 relative overflow-hidden ${
                isDragging ? 'border-4 border-dashed border-blue-400' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {showCode ? (
                <div className="h-full p-4 bg-gray-100">
                  <pre className="text-sm text-gray-800 font-mono">
                    {currentPage ? codeGenerator.generateHTML({
                      ...currentPage,
                      components
                    }) : 'Aucune page sélectionnée'}
                  </pre>
                </div>
              ) : (
                <div className="h-full p-8">
                  {components.length === 0 ? (
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        {currentPage?.title || 'Nouvelle Page'}
                      </h1>
                      <p className="text-gray-600 mb-8">
                        Glissez et déposez des composants depuis le panneau de gauche
                      </p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      {components.map(renderComponent)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export default PageEditor;