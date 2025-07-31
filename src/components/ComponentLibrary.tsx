import React, { useState } from 'react';
import { 
  Type, 
  Image, 
  Square, 
  Columns, 
  Layout,
  Navigation,
  FileText,
  Mail,
  Video,
  Map,
  Star,
  Calendar,
  ShoppingCart,
  Users,
  BarChart,
  Settings
} from 'lucide-react';
import { Component } from '../types';

interface ComponentLibraryProps {
  onAddComponent: (component: Component) => void;
  onSelectComponent: (componentId: string) => void;
  selectedComponentId?: string;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onAddComponent,
  onSelectComponent,
  selectedComponentId
}) => {
  const [activeCategory, setActiveCategory] = useState('basic');

  const componentCategories = {
    basic: {
      name: 'Éléments de Base',
      components: [
        {
          type: 'text',
          name: 'Texte',
          icon: Type,
          description: 'Paragraphe de texte',
          defaultProps: { content: 'Votre texte ici...' }
        },
        {
          type: 'heading',
          name: 'Titre',
          icon: Type,
          description: 'Titre H1-H6',
          defaultProps: { content: 'Votre titre', level: 1 }
        },
        {
          type: 'image',
          name: 'Image',
          icon: Image,
          description: 'Image responsive',
          defaultProps: { src: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg', alt: 'Image' }
        },
        {
          type: 'button',
          name: 'Bouton',
          icon: Square,
          description: 'Bouton interactif',
          defaultProps: { text: 'Cliquez ici', onClick: 'console.log("Button clicked")' }
        }
      ]
    },
    layout: {
      name: 'Mise en Page',
      components: [
        {
          type: 'container',
          name: 'Conteneur',
          icon: Square,
          description: 'Conteneur flexible',
          defaultProps: {}
        },
        {
          type: 'section',
          name: 'Section',
          icon: Layout,
          description: 'Section de page',
          defaultProps: {}
        },
        {
          type: 'columns',
          name: 'Colonnes',
          icon: Columns,
          description: 'Layout en colonnes',
          defaultProps: { columns: 2 }
        },
        {
          type: 'header',
          name: 'En-tête',
          icon: Layout,
          description: 'Header de page',
          defaultProps: {}
        },
        {
          type: 'footer',
          name: 'Pied de page',
          icon: Layout,
          description: 'Footer de page',
          defaultProps: {}
        }
      ]
    },
    navigation: {
      name: 'Navigation',
      components: [
        {
          type: 'navigation',
          name: 'Menu Navigation',
          icon: Navigation,
          description: 'Menu de navigation',
          defaultProps: {
            items: [
              { label: 'Accueil', href: '/' },
              { label: 'À propos', href: '/about' },
              { label: 'Contact', href: '/contact' }
            ]
          }
        },
        {
          type: 'breadcrumb',
          name: 'Fil d\'Ariane',
          icon: Navigation,
          description: 'Navigation breadcrumb',
          defaultProps: {
            items: [
              { label: 'Accueil', href: '/' },
              { label: 'Page actuelle', href: '#' }
            ]
          }
        }
      ]
    },
    forms: {
      name: 'Formulaires',
      components: [
        {
          type: 'form',
          name: 'Formulaire',
          icon: FileText,
          description: 'Formulaire complet',
          defaultProps: {
            action: '#',
            method: 'POST',
            submitText: 'Envoyer'
          }
        },
        {
          type: 'input',
          name: 'Champ de Saisie',
          icon: FileText,
          description: 'Input text',
          defaultProps: { type: 'text', placeholder: 'Entrez votre texte' }
        },
        {
          type: 'textarea',
          name: 'Zone de Texte',
          icon: FileText,
          description: 'Textarea',
          defaultProps: { placeholder: 'Votre message...' }
        },
        {
          type: 'select',
          name: 'Liste Déroulante',
          icon: FileText,
          description: 'Select dropdown',
          defaultProps: {
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' }
            ]
          }
        }
      ]
    },
    media: {
      name: 'Média',
      components: [
        {
          type: 'video',
          name: 'Vidéo',
          icon: Video,
          description: 'Lecteur vidéo',
          defaultProps: { src: '', controls: true }
        },
        {
          type: 'gallery',
          name: 'Galerie',
          icon: Image,
          description: 'Galerie d\'images',
          defaultProps: {
            images: [
              'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
              'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'
            ]
          }
        },
        {
          type: 'map',
          name: 'Carte',
          icon: Map,
          description: 'Carte interactive',
          defaultProps: { lat: 48.8566, lng: 2.3522, zoom: 12 }
        }
      ]
    },
    advanced: {
      name: 'Avancés',
      components: [
        {
          type: 'testimonial',
          name: 'Témoignage',
          icon: Star,
          description: 'Carte témoignage',
          defaultProps: {
            text: 'Excellent service !',
            author: 'Jean Dupont',
            rating: 5
          }
        },
        {
          type: 'pricing',
          name: 'Tarification',
          icon: ShoppingCart,
          description: 'Tableau de prix',
          defaultProps: {
            title: 'Plan Standard',
            price: '29€',
            features: ['Fonctionnalité 1', 'Fonctionnalité 2']
          }
        },
        {
          type: 'team',
          name: 'Équipe',
          icon: Users,
          description: 'Carte membre équipe',
          defaultProps: {
            name: 'Marie Martin',
            role: 'Développeuse',
            image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'
          }
        },
        {
          type: 'stats',
          name: 'Statistiques',
          icon: BarChart,
          description: 'Compteurs statistiques',
          defaultProps: {
            stats: [
              { label: 'Clients', value: '100+' },
              { label: 'Projets', value: '50+' }
            ]
          }
        },
        {
          type: 'calendar',
          name: 'Calendrier',
          icon: Calendar,
          description: 'Widget calendrier',
          defaultProps: {}
        }
      ]
    }
  };

  const createComponent = (componentDef: any): Component => {
    return {
      id: generateId(),
      type: componentDef.type,
      name: componentDef.name,
      props: componentDef.defaultProps,
      children: [],
      styles: {},
      position: { x: 0, y: 0 },
      size: { width: 300, height: 100 }
    };
  };

  const handleAddComponent = (componentDef: any) => {
    const component = createComponent(componentDef);
    onAddComponent(component);
  };

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Category Tabs */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Composants</h3>
        <div className="flex flex-wrap gap-1">
          {Object.entries(componentCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {componentCategories[activeCategory as keyof typeof componentCategories].components.map((component, index) => {
            const Icon = component.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors group"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(component));
                }}
                onClick={() => handleAddComponent(component)}
              >
                <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{component.name}</p>
                  <p className="text-gray-400 text-xs">{component.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Properties */}
      <div className="p-4 border-t border-gray-700">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Propriétés
        </h4>
        {selectedComponentId ? (
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-gray-300 text-sm">
              Composant sélectionné: {selectedComponentId}
            </p>
            {/* Component properties form would go here */}
          </div>
        ) : (
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-sm">
              Sélectionnez un composant pour modifier ses propriétés
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export default ComponentLibrary;