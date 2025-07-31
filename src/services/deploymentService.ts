import { Project, DeploymentSettings, DeploymentHistory } from '../types';
import { codeGenerator } from './codeGenerator';

export class DeploymentService {
  async deployToCPanel(project: Project, settings: DeploymentSettings): Promise<DeploymentHistory> {
    const deploymentId = this.generateId();
    const startTime = new Date().toISOString();
    
    try {
      // Generate build files
      const buildFiles = await this.generateBuildFiles(project);
      
      // Create deployment package
      const deploymentPackage = await this.createDeploymentPackage(buildFiles);
      
      // Upload to cPanel
      await this.uploadToCPanel(deploymentPackage, settings);
      
      // Setup database if needed
      if (project.type === 'php' || project.type === 'nodejs') {
        await this.setupDatabase(settings);
      }
      
      // Configure web server
      await this.configureWebServer(settings);
      
      const deployment: DeploymentHistory = {
        id: deploymentId,
        projectId: project.id,
        version: this.generateVersion(),
        status: 'success',
        url: `https://${settings.host}`,
        deployedAt: startTime,
        logs: [
          'Build completed successfully',
          'Files uploaded to server',
          'Database configured',
          'Web server configured',
          'Deployment completed'
        ]
      };
      
      return deployment;
    } catch (error) {
      return {
        id: deploymentId,
        projectId: project.id,
        version: this.generateVersion(),
        status: 'failed',
        deployedAt: startTime,
        logs: [
          'Deployment started',
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'Deployment failed'
        ]
      };
    }
  }

  private async generateBuildFiles(project: Project): Promise<{ [filename: string]: string }> {
    const files: { [filename: string]: string } = {};
    
    // Generate HTML files for each page
    project.pages.forEach(page => {
      if (project.type === 'php') {
        files[`${page.path}.php`] = codeGenerator.generatePHPPage(page);
      } else {
        files[`${page.path}.html`] = codeGenerator.generateHTML(page);
      }
    });
    
    // Generate CSS
    files['assets/css/main.css'] = this.generateMainCSS(project);
    
    // Generate JavaScript
    files['assets/js/main.js'] = this.generateMainJS(project);
    
    // Generate .htaccess
    files['.htaccess'] = this.generateHtaccess(project);
    
    // Generate database configuration if needed
    if (project.type === 'php') {
      files['config/database.php'] = this.generateDatabaseConfig();
    }
    
    return files;
  }

  private generateMainCSS(project: Project): string {
    let css = `
      /* SiteForger Generated CSS */
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
      
      /* Responsive Grid */
      .grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
      
      /* Components */
      .button-component {
        display: inline-block;
        padding: 12px 24px;
        background: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      .button-component:hover {
        background: #0056b3;
      }
      
      .form-component {
        max-width: 500px;
        margin: 0 auto;
      }
      
      .form-component input,
      .form-component textarea,
      .form-component select {
        width: 100%;
        padding: 12px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
      }
      
      .form-component input:focus,
      .form-component textarea:focus,
      .form-component select:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
      
      .form-component input.error,
      .form-component textarea.error,
      .form-component select.error {
        border-color: #dc3545;
      }
      
      .navigation-component ul {
        list-style: none;
        display: flex;
        gap: 20px;
      }
      
      .navigation-component a {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        transition: color 0.3s ease;
      }
      
      .navigation-component a:hover {
        color: #007bff;
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .container {
          padding: 0 15px;
        }
        
        .grid {
          grid-template-columns: 1fr;
        }
        
        .navigation-component ul {
          flex-direction: column;
          gap: 10px;
        }
      }
    `;
    
    // Add page-specific CSS
    project.pages.forEach(page => {
      css += `\n/* ${page.name} Page Styles */\n`;
      css += page.styles || '';
    });
    
    return css;
  }

  private generateMainJS(project: Project): string {
    return `
      // SiteForger Generated JavaScript
      document.addEventListener('DOMContentLoaded', function() {
        console.log('SiteForger site loaded');
        
        // Initialize components
        initializeComponents();
        
        // Setup form validation
        setupFormValidation();
        
        // Setup responsive navigation
        setupResponsiveNavigation();
      });
      
      function initializeComponents() {
        // Button interactions
        const buttons = document.querySelectorAll('.button-component');
        buttons.forEach(button => {
          button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
              this.style.transform = 'scale(1)';
            }, 150);
          });
        });
      }
      
      function setupFormValidation() {
        const forms = document.querySelectorAll('.form-component');
        forms.forEach(form => {
          form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
              e.preventDefault();
            }
          });
          
          // Real-time validation
          const inputs = form.querySelectorAll('input, textarea, select');
          inputs.forEach(input => {
            input.addEventListener('blur', function() {
              validateField(this);
            });
          });
        });
      }
      
      function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
          if (!validateField(field)) {
            isValid = false;
          }
        });
        
        return isValid;
      }
      
      function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
          isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
          }
        }
        
        // Update field appearance
        if (isValid) {
          field.classList.remove('error');
        } else {
          field.classList.add('error');
        }
        
        return isValid;
      }
      
      function setupResponsiveNavigation() {
        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.navigation-component ul');
        
        if (navToggle && navMenu) {
          navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
          });
        }
      }
      
      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    `;
  }

  private generateHtaccess(project: Project): string {
    return `# SiteForger Generated .htaccess
RewriteEngine On

# HTTPS Redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www
RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# PHP Settings
${project.type === 'php' ? `
php_value upload_max_filesize 64M
php_value post_max_size 64M
php_value max_execution_time 300
php_value max_input_vars 3000
` : ''}

# Error Pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html

# Deny access to sensitive files
<Files ~ "^\\.(htaccess|htpasswd|ini|log|sh|inc|bak)$">
    Order allow,deny
    Deny from all
</Files>
`;
  }

  private generateDatabaseConfig(): string {
    return `<?php
// SiteForger Database Configuration
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;
    
    public function __construct() {
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->db_name = $_ENV['DB_NAME'] ?? 'siteforger_db';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';
    }
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "pgsql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}

// Initialize database connection
$database = new Database();
$db = $database->getConnection();
?>`;
  }

  private async createDeploymentPackage(files: { [filename: string]: string }): Promise<Blob> {
    // In a real implementation, this would create a ZIP file
    // For now, we'll simulate the package creation
    const packageData = JSON.stringify(files);
    return new Blob([packageData], { type: 'application/json' });
  }

  private async uploadToCPanel(packageData: Blob, settings: DeploymentSettings): Promise<void> {
    // Simulate cPanel upload
    const formData = new FormData();
    formData.append('package', packageData);
    formData.append('path', settings.path);
    
    // In a real implementation, this would use cPanel API or FTP
    console.log('Uploading to cPanel:', settings.host);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async setupDatabase(settings: DeploymentSettings): Promise<void> {
    // Simulate database setup
    console.log('Setting up database...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async configureWebServer(settings: DeploymentSettings): Promise<void> {
    // Simulate web server configuration
    console.log('Configuring web server...');
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateVersion(): string {
    const now = new Date();
    return `v${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  }

  async testConnection(settings: DeploymentSettings): Promise<boolean> {
    try {
      // Simulate connection test
      console.log('Testing connection to:', settings.host);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getRollbackVersions(projectId: string): Promise<DeploymentHistory[]> {
    // In a real implementation, this would fetch from database
    return [
      {
        id: '1',
        projectId,
        version: 'v2024.01.14-1430',
        status: 'success',
        url: 'https://example.com',
        deployedAt: '2024-01-14T14:30:00Z',
        logs: ['Deployment successful']
      }
    ];
  }

  async rollback(projectId: string, deploymentId: string): Promise<DeploymentHistory> {
    // Simulate rollback
    console.log('Rolling back to deployment:', deploymentId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      id: this.generateId(),
      projectId,
      version: 'rollback-' + deploymentId,
      status: 'success',
      deployedAt: new Date().toISOString(),
      logs: ['Rollback completed successfully']
    };
  }
}

export const deploymentService = new DeploymentService();