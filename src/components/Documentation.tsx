import React, { useState } from 'react';
import { 
  Book, 
  Code, 
  Database, 
  Server, 
  Globe, 
  Wrench, 
  ChevronRight,
  ExternalLink,
  Download,
  Play
} from 'lucide-react';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction à SiteForger',
      icon: Book,
      content: `
# Introduction à SiteForger

SiteForger est un constructeur de sites web professionnel conçu pour créer, modifier et déployer des sites web modernes avec facilité.

## Caractéristiques Principales

- **Interface Drag & Drop** : Créez des pages web intuitivement
- **Éditeur de Code Intégré** : Contrôle total sur votre code
- **Templates Professionnels** : Bibliothèque de templates prêts à l'emploi
- **Déploiement Automatisé** : Déployez vers votre hébergement en un clic
- **Intégration VS Code** : Synchronisation bidirectionnelle avec VS Code
- **Technologies Modernes** : HTML5, CSS3, JavaScript ES6+, PHP, Node.js, PostgreSQL

## Technologies Supportées

### Frontend
- HTML5 sémantique
- CSS3 avec Flexbox et Grid
- JavaScript ES6+ avec modules
- TypeScript pour la robustesse
- Frameworks : React, Vue.js

### Backend
- Node.js avec Express
- PHP 8+ avec frameworks modernes
- API REST et GraphQL

### Base de Données
- PostgreSQL intégrée
- ORM et migration automatique
- Système de sauvegarde

### Déploiement
- Hébergement web mutualisé
- Configuration cPanel automatisée
- SSL/HTTPS automatique
- Optimisation des performances
      `
    },
    {
      id: 'standalone',
      title: 'Utilisation Hors Environnement de Développement',
      icon: Globe,
      content: `
# Utilisation Hors Environnement de Développement

SiteForger peut fonctionner de manière autonome, sans nécessiter d'outils de développement externes.

## Installation Standalone

### Prérequis Système
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- 4GB RAM minimum
- 2GB d'espace disque libre
- Connexion Internet pour les templates et déploiement

### Installation
\`\`\`bash
# Télécharger SiteForger
wget https://releases.siteforger.com/latest/siteforger-standalone.zip

# Extraire l'archive
unzip siteforger-standalone.zip

# Lancer l'application
cd siteforger
npm start
\`\`\`

## Mode Portable

SiteForger inclut un mode portable qui peut s'exécuter depuis une clé USB :

1. **Téléchargez** la version portable
2. **Extrayez** sur votre support portable
3. **Lancez** siteforger-portable.exe (Windows) ou siteforger-portable.sh (Linux/Mac)

## Interface Utilisateur

### Tableau de Bord
- Vue d'ensemble de vos projets
- Statistiques d'utilisation
- Actions rapides

### Éditeur Visuel
- Glisser-déposer des composants
- Prévisualisation temps réel
- Responsive design automatique

### Éditeur de Code
- Coloration syntaxique
- Auto-complétion
- Validation en temps réel
- Support multi-fichiers

## Projets et Gestion

### Création d'un Nouveau Projet
1. Cliquez sur "Nouveau Projet"
2. Choisissez un template ou partez de zéro
3. Configurez les paramètres du projet
4. Commencez à créer !

### Structure des Projets
\`\`\`
mon-projet/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── pages/
├── components/
└── config/
    └── siteforger.json
\`\`\`
      `
    },
    {
      id: 'vscode-integration',
      title: 'Intégration VS Code',
      icon: Code,
      content: `
# Intégration avec VS Code

SiteForger s'intègre parfaitement avec Visual Studio Code pour une expérience de développement fluide.

## Installation de l'Extension

### Via VS Code Marketplace
1. Ouvrez VS Code
2. Allez dans Extensions (Ctrl+Shift+X)
3. Recherchez "SiteForger"
4. Cliquez sur "Install"

### Configuration Manuelle
\`\`\`json
// settings.json
{
  "siteforger.autoSync": true,
  "siteforger.livePreview": true,
  "siteforger.deployOnSave": false
}
\`\`\`

## Intégration Projet Existant

### Importer un Projet VS Code
1. Dans SiteForger, cliquez sur "Importer"
2. Sélectionnez votre dossier de projet
3. SiteForger analyse automatiquement la structure
4. Configurez les paramètres d'intégration

### Export vers VS Code
\`\`\`bash
# SiteForger génère automatiquement :
# - package.json avec dépendances
# - tsconfig.json pour TypeScript
# - .vscode/settings.json
# - .gitignore
# - README.md
\`\`\`

## Synchronisation Bidirectionnelle

### Fonctionnalités
- **Édition simultanée** : Modifications visibles en temps réel
- **Sauvegarde automatique** : Sync automatique des changements
- **Résolution de conflits** : Interface pour gérer les conflits
- **Historique des versions** : Système de versioning intégré

### Configuration de la Sync
\`\`\`javascript
// siteforger.config.js
module.exports = {
  sync: {
    enabled: true,
    interval: 1000, // millisecondes
    excludePatterns: [
      'node_modules/**',
      '.git/**',
      'dist/**'
    ]
  }
};
\`\`\`

## Workflow Recommandé

### Développement en Équipe
1. **Setup initial** : Un développeur configure le projet
2. **Partage de config** : Distribution du fichier de configuration
3. **Synchronisation** : Chaque membre sync son environnement
4. **Collaboration** : Édition collaborative en temps réel

### Commandes VS Code
\`\`\`
Ctrl+Shift+P > SiteForger: Open Visual Editor
Ctrl+Shift+P > SiteForger: Deploy to Server
Ctrl+Shift+P > SiteForger: Sync with SiteForger
\`\`\`
      `
    },
    {
      id: 'deployment',
      title: 'Déploiement sur Hébergement Web',
      icon: Server,
      content: `
# Déploiement sur Hébergement Web Mutualisé

Guide complet pour déployer vos sites SiteForger sur un hébergement web mutualisé via cPanel.

## Configuration Hébergement

### Prérequis Hébergeur
- Support PHP 8.0+
- Base de données PostgreSQL ou MySQL
- Accès cPanel
- Support SSL/HTTPS
- Minimum 1GB d'espace disque

### Configuration cPanel
\`\`\`
URL cPanel : https://cpanel.votre-hebergeur.com
Utilisateur : votre-username
Domaine : votre-domaine.com
Répertoire : /public_html
\`\`\`

## Base de Données

### Configuration PostgreSQL
1. **Créer la base** dans cPanel > PostgreSQL Databases
2. **Créer un utilisateur** avec tous les privilèges
3. **Noter les informations** de connexion

\`\`\`php
// config/database.php
<?php
return [
    'host' => 'localhost',
    'port' => '5432',
    'database' => 'votre_db',
    'username' => 'votre_user',
    'password' => 'votre_password',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]
];
\`\`\`

## Processus de Déploiement

### Déploiement Automatique
1. **Configuration** : Paramètres dans l'interface SiteForger
2. **Build** : Compilation automatique du projet
3. **Upload** : Transfert FTP/SFTP sécurisé
4. **Migration BDD** : Création/mise à jour des tables
5. **Tests** : Vérification automatique du déploiement

### Structure de Déploiement
\`\`\`
public_html/
├── index.php
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── api/
├── config/
├── database/
│   └── migrations/
└── .htaccess
\`\`\`

### Fichier .htaccess
\`\`\`apache
RewriteEngine On
RewriteBase /

# HTTPS Redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA Routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

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
\`\`\`

## Surveillance et Maintenance

### Monitoring Automatique
- **Uptime monitoring** : Vérification de disponibilité
- **Performance monitoring** : Temps de réponse
- **Error logging** : Journalisation des erreurs
- **Security scanning** : Détection de vulnérabilités

### Mises à Jour
- **Déploiement incrémental** : Seuls les fichiers modifiés
- **Rollback automatique** : Retour à la version précédente en cas d'erreur
- **Backup automatique** : Sauvegarde avant chaque déploiement
      `
    },
    {
      id: 'hosting',
      title: 'Hébergement de SiteForger',
      icon: Database,
      content: `
# Hébergement de SiteForger sur Serveur Web

Guide pour installer et héberger SiteForger sur votre propre serveur ou hébergement mutualisé.

## Installation Serveur

### Prérequis Système
- **OS** : Linux (Ubuntu 20.04+ recommandé) ou Windows Server
- **RAM** : 4GB minimum, 8GB recommandé
- **Stockage** : 10GB minimum SSD
- **Bande passante** : 100Mbps minimum

### Stack Technique
\`\`\`bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 14+
sudo apt update
sudo apt install postgresql postgresql-contrib

# Nginx (proxy reverse)
sudo apt install nginx

# PM2 (gestionnaire de processus)
npm install -g pm2
\`\`\`

## Configuration Base de Données

### PostgreSQL Setup
\`\`\`sql
-- Créer la base de données
CREATE DATABASE siteforger_prod;

-- Créer l'utilisateur
CREATE USER siteforger_user WITH PASSWORD 'mot_de_passe_securise';

-- Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE siteforger_prod TO siteforger_user;

-- Extensions requises
\\c siteforger_prod;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
\`\`\`

### Variables d'Environnement
\`\`\`.env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://siteforger_user:password@localhost:5432/siteforger_prod
JWT_SECRET=votre_jwt_secret_super_securise
UPLOAD_DIR=/var/www/siteforger/uploads
TEMP_DIR=/tmp/siteforger
MAX_PROJECT_SIZE=500MB
\`\`\`

## Installation SiteForger

### Déploiement Manuel
\`\`\`bash
# Cloner ou télécharger SiteForger
cd /var/www
sudo git clone https://github.com/siteforger/siteforger.git
cd siteforger

# Installation des dépendances
npm ci --production

# Build de l'application
npm run build

# Configuration des permissions
sudo chown -R www-data:www-data /var/www/siteforger
sudo chmod -R 755 /var/www/siteforger
\`\`\`

### Configuration Nginx
\`\`\`nginx
# /etc/nginx/sites-available/siteforger
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Sécurité SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Augmenter les timeouts pour les gros uploads
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }

    # Servir les fichiers statiques directement
    location /uploads/ {
        alias /var/www/siteforger/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Limite de taille des uploads
    client_max_body_size 500M;
}
\`\`\`

### Gestionnaire de Processus PM2
\`\`\`javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'siteforger',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/siteforger/error.log',
    out_file: '/var/log/siteforger/out.log',
    log_file: '/var/log/siteforger/combined.log',
    time: true,
    max_memory_restart: '2G',
    node_args: '--max-old-space-size=4096'
  }]
};
\`\`\`

\`\`\`bash
# Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

## Sécurité et Monitoring

### Firewall Configuration
\`\`\`bash
# UFW Configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
\`\`\`

### Monitoring et Logs
\`\`\`bash
# Monitoring avec PM2
pm2 monit

# Logs en temps réel
pm2 logs siteforger

# Statistiques d'utilisation
pm2 show siteforger
\`\`\`

### Backup Automatisé
\`\`\`bash
#!/bin/bash
# backup-siteforger.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/siteforger"

# Backup base de données
pg_dump siteforger_prod > $BACKUP_DIR/db_$DATE.sql

# Backup fichiers utilisateurs
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/siteforger/uploads

# Nettoyer les anciens backups (garder 30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
\`\`\`

### Cron pour Maintenance
\`\`\`crontab
# Backup quotidien à 2h du matin
0 2 * * * /usr/local/bin/backup-siteforger.sh

# Redémarrage hebdomadaire le dimanche à 3h
0 3 * * 0 pm2 restart siteforger

# Nettoyage des logs mensuellement
0 1 1 * * pm2 flush siteforger
\`\`\`
      `
    },
    {
      id: 'package-management',
      title: 'Gestion du Package',
      icon: Wrench,
      content: `
# Gestion du Package SiteForger

Guide complet pour la gestion, mise à jour et maintenance du package SiteForger.

## Structure du Package

### Architecture Modulaire
\`\`\`
siteforger/
├── package.json
├── README.md
├── LICENSE
├── src/
│   ├── core/              # Moteur principal
│   ├── components/        # Composants UI
│   ├── templates/         # Templates intégrés
│   ├── plugins/           # Système de plugins
│   └── utils/             # Utilitaires
├── public/
│   ├── assets/           # Assets statiques
│   └── themes/           # Thèmes visuels
├── config/
│   ├── database/         # Migrations BDD
│   ├── deployment/       # Configs déploiement
│   └── environments/     # Configs environnements
├── docs/                 # Documentation
├── tests/                # Tests automatisés
└── scripts/              # Scripts de maintenance
\`\`\`

### Package.json Principal
\`\`\`json
{
  "name": "@siteforger/core",
  "version": "2.1.0",
  "description": "Professional web builder and deployment platform",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write src",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js",
    "deploy": "node scripts/deploy.js",
    "update": "node scripts/update.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "express": "^4.18.0",
    "pg": "^8.8.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5",
    "node-cron": "^3.0.2"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "vitest": "^0.34.0",
    "playwright": "^1.40.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
\`\`\`

## Installation et Configuration

### Installation Globale
\`\`\`bash
# Installation via npm
npm install -g @siteforger/core

# Installation via yarn
yarn global add @siteforger/core

# Vérification de l'installation
siteforger --version
\`\`\`

### Configuration Initiale
\`\`\`bash
# Initialiser un nouvel environnement
siteforger init

# Configuration interactive
siteforger configure

# Vérifier la configuration
siteforger doctor
\`\`\`

### Fichier de Configuration
\`\`\`json
// siteforger.config.json
{
  "version": "2.1.0",
  "environment": "production",
  "database": {
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "database": "siteforger",
    "ssl": true
  },
  "server": {
    "port": 3000,
    "host": "0.0.0.0",
    "cors": {
      "origin": ["https://app.siteforger.com"],
      "credentials": true
    }
  },
  "storage": {
    "provider": "local",
    "path": "./uploads",
    "maxSize": "500MB"
  },
  "features": {
    "templates": true,
    "deployment": true,
    "collaboration": true,
    "analytics": false
  },
  "security": {
    "jwtSecret": "auto-generated",
    "bcryptRounds": 12,
    "rateLimit": {
      "windowMs": 900000,
      "max": 100
    }
  }
}
\`\`\`

## Mise à Jour et Maintenance

### Système de Mise à Jour
\`\`\`javascript
// scripts/update.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SiteForgerUpdater {
  async checkUpdates() {
    // Vérifier les nouvelles versions
    const latestVersion = await this.getLatestVersion();
    const currentVersion = this.getCurrentVersion();
    
    return {
      hasUpdate: this.compareVersions(latestVersion, currentVersion) > 0,
      latestVersion,
      currentVersion
    };
  }

  async performUpdate() {
    console.log('🚀 Début de la mise à jour SiteForger...');
    
    try {
      // 1. Backup de la configuration actuelle
      await this.backupConfiguration();
      
      // 2. Backup de la base de données
      await this.backupDatabase();
      
      // 3. Télécharger la nouvelle version
      await this.downloadUpdate();
      
      // 4. Arrêter les services
      await this.stopServices();
      
      // 5. Installer la mise à jour
      await this.installUpdate();
      
      // 6. Migrer la base de données
      await this.migrateDatabase();
      
      // 7. Redémarrer les services
      await this.startServices();
      
      // 8. Vérifier l'installation
      await this.verifyInstallation();
      
      console.log('✅ Mise à jour terminée avec succès !');
    } catch (error) {
      console.error('❌ Erreur durant la mise à jour:', error);
      await this.rollback();
    }
  }

  async rollback() {
    console.log('🔄 Rollback en cours...');
    // Logique de rollback
  }
}
\`\`\`

### Commandes CLI
\`\`\`bash
# Vérifier les mises à jour
siteforger update check

# Mettre à jour automatiquement
siteforger update install

# Rollback vers version précédente
siteforger update rollback

# Lister les versions disponibles
siteforger update list

# Installer une version spécifique
siteforger update install --version=2.0.5
\`\`\`

## Gestion des Plugins

### Système de Plugins
\`\`\`javascript
// Plugin Example
class AdvancedAnalyticsPlugin {
  constructor(siteforger) {
    this.siteforger = siteforger;
    this.name = 'advanced-analytics';
    this.version = '1.0.0';
  }

  async install() {
    // Logique d'installation
    await this.createTables();
    await this.registerRoutes();
    await this.setupCronJobs();
  }

  async uninstall() {
    // Logique de désinstallation
    await this.dropTables();
    await this.unregisterRoutes();
    await this.removeCronJobs();
  }

  async activate() {
    this.siteforger.plugins.register(this);
  }
}
\`\`\`

### Commandes Plugin
\`\`\`bash
# Lister les plugins disponibles
siteforger plugin list

# Installer un plugin
siteforger plugin install advanced-analytics

# Désinstaller un plugin
siteforger plugin uninstall advanced-analytics

# Activer/désactiver un plugin
siteforger plugin enable advanced-analytics
siteforger plugin disable advanced-analytics
\`\`\`

## Monitoring et Diagnostics

### Script de Diagnostic
\`\`\`bash
#!/bin/bash
# scripts/health-check.sh

echo "🔍 SiteForger Health Check"
echo "=========================="

# Vérifier le service principal
if pgrep -f "siteforger" > /dev/null; then
    echo "✅ Service SiteForger: Running"
else
    echo "❌ Service SiteForger: Stopped"
fi

# Vérifier la base de données
if pg_isready -h localhost -p 5432 > /dev/null; then
    echo "✅ Database: Connected"
else
    echo "❌ Database: Connection failed"
fi

# Vérifier l'espace disque
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 90 ]; then
    echo "✅ Disk Space: ${DISK_USAGE}% used"
else
    echo "⚠️  Disk Space: ${DISK_USAGE}% used (Critical)"
fi

# Vérifier la mémoire
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
echo "📊 Memory Usage: ${MEMORY_USAGE}%"

# Vérifier les logs d'erreur
ERROR_COUNT=$(tail -n 1000 /var/log/siteforger/error.log | wc -l)
if [ $ERROR_COUNT -gt 10 ]; then
    echo "⚠️  Recent Errors: $ERROR_COUNT (Check logs)"
else
    echo "✅ Recent Errors: $ERROR_COUNT"
fi
\`\`\`

### Maintenance Automatisée
\`\`\`javascript
// scripts/maintenance.js
const cron = require('node-cron');

// Nettoyage quotidien des fichiers temporaires
cron.schedule('0 2 * * *', () => {
  console.log('🧹 Cleaning temporary files...');
  cleanTempFiles();
});

// Optimisation hebdomadaire de la base de données
cron.schedule('0 3 * * 0', () => {
  console.log('🔧 Optimizing database...');
  optimizeDatabase();
});

// Backup automatique
cron.schedule('0 1 * * *', () => {
  console.log('💾 Creating backup...');
  createBackup();
});
\`\`\`
      `
    }
  ];

  const currentSection = sections.find(section => section.id === activeSection);

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sommaire</h3>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{section.title}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Actions Rapides</h4>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 text-sm text-gray-300 hover:text-white">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
            <button className="w-full flex items-center gap-2 text-sm text-gray-300 hover:text-white">
              <ExternalLink className="w-4 h-4" />
              Documentation Online
            </button>
            <button className="w-full flex items-center gap-2 text-sm text-gray-300 hover:text-white">
              <Play className="w-4 h-4" />
              Tutoriels Vidéo
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto">
          {currentSection && (
            <div className="prose prose-invert max-w-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <currentSection.icon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white m-0">{currentSection.title}</h1>
              </div>
              
              <div className="text-gray-300 leading-relaxed">
                {currentSection.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{line.replace('# ', '')}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold text-white mt-6 mb-3">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-medium text-white mt-4 mb-2">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('```')) {
                    return <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto" />;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={index} className="text-gray-300 ml-6">{line.replace('- ', '')}</li>;
                  }
                  if (line.trim() === '') {
                    return <br key={index} />;
                  }
                  return <p key={index} className="text-gray-300 mb-3">{line}</p>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;