import { Project, Page, Component } from '../types';

export class CodeGenerator {
  generateHTML(page: Page): string {
    const { title, content, components, meta } = page;
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${meta.description}">
    <meta name="keywords" content="${meta.keywords.join(', ')}">
    ${meta.ogImage ? `<meta property="og:image" content="${meta.ogImage}">` : ''}
    ${meta.canonical ? `<link rel="canonical" href="${meta.canonical}">` : ''}
    <style>
        ${this.generateCSS(components)}
        ${page.styles}
    </style>
</head>
<body>
    ${this.generateComponentsHTML(components)}
    <script>
        ${this.generateJS(components)}
        ${page.scripts}
    </script>
</body>
</html>`;
  }

  generateCSS(components: Component[]): string {
    let css = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .responsive-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 0 15px;
            }
            
            .responsive-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    components.forEach(component => {
      css += this.generateComponentCSS(component);
    });

    return css;
  }

  generateComponentCSS(component: Component): string {
    const { id, type, styles, position, size } = component;
    
    let css = `
        #${id} {
            position: ${position ? 'absolute' : 'relative'};
            ${position ? `left: ${position.x}px; top: ${position.y}px;` : ''}
            ${size ? `width: ${size.width}px; height: ${size.height}px;` : ''}
    `;

    // Add component-specific styles
    Object.entries(styles).forEach(([property, value]) => {
      css += `${this.camelToKebab(property)}: ${value};\n`;
    });

    css += '}\n';

    // Add responsive styles
    if (type === 'text' || type === 'heading') {
      css += `
        @media (max-width: 768px) {
            #${id} {
                font-size: ${styles.fontSize ? `calc(${styles.fontSize} * 0.8)` : '14px'};
            }
        }
      `;
    }

    return css;
  }

  generateComponentsHTML(components: Component[]): string {
    return components.map(component => this.generateComponentHTML(component)).join('\n');
  }

  generateComponentHTML(component: Component): string {
    const { id, type, props, children } = component;

    switch (type) {
      case 'text':
        return `<p id="${id}" class="text-component">${props.content || ''}</p>`;
      
      case 'heading':
        const level = props.level || 1;
        return `<h${level} id="${id}" class="heading-component">${props.content || ''}</h${level}>`;
      
      case 'image':
        return `<img id="${id}" src="${props.src || ''}" alt="${props.alt || ''}" class="image-component">`;
      
      case 'button':
        return `<button id="${id}" class="button-component" onclick="${props.onClick || ''}">${props.text || 'Button'}</button>`;
      
      case 'container':
        const childrenHTML = children ? this.generateComponentsHTML(children) : '';
        return `<div id="${id}" class="container-component">${childrenHTML}</div>`;
      
      case 'section':
        const sectionChildren = children ? this.generateComponentsHTML(children) : '';
        return `<section id="${id}" class="section-component">${sectionChildren}</section>`;
      
      case 'header':
        const headerChildren = children ? this.generateComponentsHTML(children) : '';
        return `<header id="${id}" class="header-component">${headerChildren}</header>`;
      
      case 'footer':
        const footerChildren = children ? this.generateComponentsHTML(children) : '';
        return `<footer id="${id}" class="footer-component">${footerChildren}</footer>`;
      
      case 'form':
        return this.generateFormHTML(component);
      
      case 'navigation':
        return this.generateNavigationHTML(component);
      
      default:
        return `<div id="${id}" class="${type}-component">${props.content || ''}</div>`;
    }
  }

  generateFormHTML(component: Component): string {
    const { id, props, children } = component;
    const fields = children || [];
    
    let formHTML = `<form id="${id}" class="form-component" action="${props.action || '#'}" method="${props.method || 'POST'}">`;
    
    fields.forEach(field => {
      switch (field.type) {
        case 'input':
          formHTML += `<input type="${field.props.type || 'text'}" name="${field.props.name}" placeholder="${field.props.placeholder || ''}" ${field.props.required ? 'required' : ''}>`;
          break;
        case 'textarea':
          formHTML += `<textarea name="${field.props.name}" placeholder="${field.props.placeholder || ''}" ${field.props.required ? 'required' : ''}></textarea>`;
          break;
        case 'select':
          formHTML += `<select name="${field.props.name}" ${field.props.required ? 'required' : ''}>`;
          (field.props.options || []).forEach((option: any) => {
            formHTML += `<option value="${option.value}">${option.label}</option>`;
          });
          formHTML += '</select>';
          break;
      }
    });
    
    formHTML += `<button type="submit">${props.submitText || 'Submit'}</button></form>`;
    return formHTML;
  }

  generateNavigationHTML(component: Component): string {
    const { id, props } = component;
    const items = props.items || [];
    
    let navHTML = `<nav id="${id}" class="navigation-component"><ul>`;
    
    items.forEach((item: any) => {
      navHTML += `<li><a href="${item.href || '#'}">${item.label}</a></li>`;
    });
    
    navHTML += '</ul></nav>';
    return navHTML;
  }

  generateJS(components: Component[]): string {
    let js = `
        // SiteForger Generated JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            console.log('SiteForger page loaded');
            
            // Initialize components
            initializeComponents();
            
            // Setup responsive behavior
            setupResponsive();
            
            // Setup form validation
            setupFormValidation();
        });
        
        function initializeComponents() {
            // Component initialization logic
        }
        
        function setupResponsive() {
            // Responsive behavior
            window.addEventListener('resize', function() {
                // Handle responsive changes
            });
        }
        
        function setupFormValidation() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    if (!validateForm(this)) {
                        e.preventDefault();
                    }
                });
            });
        }
        
        function validateForm(form) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            return isValid;
        }
    `;

    // Add component-specific JavaScript
    components.forEach(component => {
      js += this.generateComponentJS(component);
    });

    return js;
  }

  generateComponentJS(component: Component): string {
    const { id, type, props } = component;
    
    switch (type) {
      case 'button':
        if (props.onClick) {
          return `
            document.getElementById('${id}').addEventListener('click', function() {
                ${props.onClick}
            });
          `;
        }
        break;
      
      case 'form':
        return `
          document.getElementById('${id}').addEventListener('submit', function(e) {
              e.preventDefault();
              // Handle form submission
              const formData = new FormData(this);
              console.log('Form submitted:', Object.fromEntries(formData));
          });
        `;
      
      default:
        return '';
    }
    
    return '';
  }

  generateReactComponent(component: Component): string {
    const { type, props, children } = component;
    
    switch (type) {
      case 'text':
        return `<p>${props.content}</p>`;
      
      case 'heading':
        const level = props.level || 1;
        return `<h${level}>${props.content}</h${level}>`;
      
      case 'image':
        return `<img src="${props.src}" alt="${props.alt}" />`;
      
      case 'button':
        return `<button onClick={${props.onClick || '() => {}'}}>${props.text}</button>`;
      
      case 'container':
        const childrenJSX = children ? children.map(child => this.generateReactComponent(child)).join('\n') : '';
        return `<div>${childrenJSX}</div>`;
      
      default:
        return `<div>{/* ${type} component */}</div>`;
    }
  }

  generatePHPPage(page: Page): string {
    return `<?php
// SiteForger Generated PHP Page
require_once 'config/database.php';

$pageTitle = '${page.title}';
$pageDescription = '${page.meta.description}';

// Page logic here

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <meta name="description" content="<?php echo $pageDescription; ?>">
    <style>
        ${this.generateCSS(page.components)}
    </style>
</head>
<body>
    ${this.generateComponentsHTML(page.components)}
    <script>
        ${this.generateJS(page.components)}
    </script>
</body>
</html>`;
  }

  generateVSCodeProject(project: Project): { [filename: string]: string } {
    const files: { [filename: string]: string } = {};
    
    // Package.json
    files['package.json'] = JSON.stringify({
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: project.description,
      main: 'index.js',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.0.0',
        typescript: '^5.0.0',
        vite: '^4.4.0'
      }
    }, null, 2);
    
    // Vite config
    files['vite.config.ts'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;
    
    // TypeScript config
    files['tsconfig.json'] = JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }]
    }, null, 2);
    
    // Generate pages
    project.pages.forEach(page => {
      if (project.type === 'react') {
        files[`src/pages/${page.name}.tsx`] = this.generateReactPage(page);
      } else if (project.type === 'php') {
        files[`${page.path}.php`] = this.generatePHPPage(page);
      } else {
        files[`${page.path}.html`] = this.generateHTML(page);
      }
    });
    
    // README
    files['README.md'] = `# ${project.name}

${project.description}

## Generated by SiteForger

This project was generated by SiteForger and is ready for development.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
`;
    
    return files;
  }

  generateReactPage(page: Page): string {
    return `import React from 'react';

const ${page.name.replace(/\s+/g, '')}Page: React.FC = () => {
  return (
    <div className="${page.name.toLowerCase().replace(/\s+/g, '-')}-page">
      <h1>${page.title}</h1>
      {/* Generated components */}
      ${page.components.map(component => this.generateReactComponent(component)).join('\n      ')}
    </div>
  );
};

export default ${page.name.replace(/\s+/g, '')}Page;`;
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
}

export const codeGenerator = new CodeGenerator();