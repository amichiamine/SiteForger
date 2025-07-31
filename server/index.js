const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const cron = require('node-cron');
const archiver = require('archiver');
const chokidar = require('chokidar');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|pdf|zip|html|css|js|json|php/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Database simulation (in production, use PostgreSQL)
let database = {
  projects: [],
  pages: [],
  templates: [],
  users: [],
  deployments: [],
  settings: {}
};

// Load database from file
const DB_FILE = path.join(__dirname, 'database.json');
if (fs.existsSync(DB_FILE)) {
  try {
    database = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

// Save database to file
const saveDatabase = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'siteforger-secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Projects routes
app.get('/api/projects', (req, res) => {
  res.json(database.projects);
});

app.get('/api/projects/:id', (req, res) => {
  const project = database.projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const project = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  database.projects.push(project);
  saveDatabase();
  res.status(201).json(project);
});

app.put('/api/projects/:id', (req, res) => {
  const index = database.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  database.projects[index] = {
    ...database.projects[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  saveDatabase();
  res.json(database.projects[index]);
});

app.delete('/api/projects/:id', (req, res) => {
  const index = database.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  // Delete associated pages
  database.pages = database.pages.filter(page => page.projectId !== req.params.id);
  database.projects.splice(index, 1);
  saveDatabase();
  res.status(204).send();
});

// Pages routes
app.get('/api/projects/:projectId/pages', (req, res) => {
  const pages = database.pages.filter(p => p.projectId === req.params.projectId);
  res.json(pages);
});

app.get('/api/projects/:projectId/pages/:pageId', (req, res) => {
  const page = database.pages.find(p => p.id === req.params.pageId && p.projectId === req.params.projectId);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  res.json(page);
});

app.post('/api/projects/:projectId/pages', (req, res) => {
  const page = {
    id: uuidv4(),
    projectId: req.params.projectId,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  database.pages.push(page);
  saveDatabase();
  res.status(201).json(page);
});

app.put('/api/projects/:projectId/pages/:pageId', (req, res) => {
  const index = database.pages.findIndex(p => p.id === req.params.pageId && p.projectId === req.params.projectId);
  if (index === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  database.pages[index] = {
    ...database.pages[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  saveDatabase();
  res.json(database.pages[index]);
});

app.delete('/api/projects/:projectId/pages/:pageId', (req, res) => {
  const index = database.pages.findIndex(p => p.id === req.params.pageId && p.projectId === req.params.projectId);
  if (index === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  database.pages.splice(index, 1);
  saveDatabase();
  res.status(204).send();
});

// Templates routes
app.get('/api/templates', (req, res) => {
  res.json(database.templates);
});

app.get('/api/templates/:id', (req, res) => {
  const template = database.templates.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

// File upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    url: `/uploads/${req.file.filename}`,
    path: req.file.path,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// Deployment routes
app.post('/api/projects/:id/deploy', async (req, res) => {
  try {
    const project = database.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const deployment = {
      id: uuidv4(),
      projectId: req.params.id,
      version: generateVersion(),
      status: 'pending',
      deployedAt: new Date().toISOString(),
      logs: ['Deployment started']
    };

    database.deployments.push(deployment);
    saveDatabase();

    // Simulate deployment process
    setTimeout(async () => {
      try {
        // Generate build files
        const buildPath = await generateBuildFiles(project);
        deployment.logs.push('Build files generated');

        // Simulate upload to server
        await simulateDeployment(req.body);
        deployment.logs.push('Files uploaded to server');
        deployment.logs.push('Deployment completed successfully');
        deployment.status = 'success';
        deployment.url = `https://${req.body.domain || 'example.com'}`;
      } catch (error) {
        deployment.logs.push(`Deployment failed: ${error.message}`);
        deployment.status = 'failed';
      }

      saveDatabase();
    }, 3000);

    res.json(deployment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id/deployments', (req, res) => {
  const deployments = database.deployments.filter(d => d.projectId === req.params.id);
  res.json(deployments);
});

// VS Code integration
app.post('/api/projects/:id/export/vscode', async (req, res) => {
  try {
    const project = database.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const exportPath = await generateVSCodeProject(project);
    res.json({ downloadUrl: `/downloads/${path.basename(exportPath)}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/import/vscode', upload.single('project'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No project file uploaded' });
    }

    const project = await importVSCodeProject(req.file.path);
    database.projects.push(project);
    saveDatabase();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Preview generation
app.post('/api/projects/:id/preview', async (req, res) => {
  try {
    const project = database.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const previewUrl = await generatePreview(project, req.body.pageId);
    res.json({ url: previewUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
const generateVersion = () => {
  const now = new Date();
  return `v${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
};

const generateBuildFiles = async (project) => {
  const buildPath = path.join(__dirname, 'builds', project.id);
  await fs.ensureDir(buildPath);

  // Generate HTML files for each page
  const pages = database.pages.filter(p => p.projectId === project.id);
  for (const page of pages) {
    const html = generateHTML(page, project);
    await fs.writeFile(path.join(buildPath, `${page.path}.html`), html);
  }

  // Generate CSS
  const css = generateCSS(project);
  await fs.ensureDir(path.join(buildPath, 'assets', 'css'));
  await fs.writeFile(path.join(buildPath, 'assets', 'css', 'main.css'), css);

  // Generate JS
  const js = generateJS(project);
  await fs.ensureDir(path.join(buildPath, 'assets', 'js'));
  await fs.writeFile(path.join(buildPath, 'assets', 'js', 'main.js'), js);

  return buildPath;
};

const generateHTML = (page, project) => {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${page.meta?.description || ''}">
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    ${generateComponentsHTML(page.components || [])}
    <script src="/assets/js/main.js"></script>
</body>
</html>`;
};

const generateComponentsHTML = (components) => {
  return components.map(component => {
    switch (component.type) {
      case 'text':
        return `<p>${component.props.content || ''}</p>`;
      case 'heading':
        const level = component.props.level || 1;
        return `<h${level}>${component.props.content || ''}</h${level}>`;
      case 'image':
        return `<img src="${component.props.src || ''}" alt="${component.props.alt || ''}" />`;
      case 'button':
        return `<button onclick="${component.props.onClick || ''}">${component.props.text || 'Button'}</button>`;
      default:
        return `<div>${component.props.content || ''}</div>`;
    }
  }).join('\n');
};

const generateCSS = (project) => {
  return `
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

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
}
`;
};

const generateJS = (project) => {
  return `
// SiteForger Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('SiteForger site loaded');
  
  // Initialize components
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });
});
`;
};

const simulateDeployment = async (settings) => {
  // Simulate deployment delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!settings.host || !settings.username) {
    throw new Error('Missing deployment configuration');
  }
  
  // In real implementation, this would use FTP/SFTP to upload files
  console.log('Deploying to:', settings.host);
};

const generateVSCodeProject = async (project) => {
  const exportPath = path.join(__dirname, 'exports', `${project.name}-${Date.now()}.zip`);
  await fs.ensureDir(path.dirname(exportPath));

  const output = fs.createWriteStream(exportPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);

  // Add package.json
  const packageJson = {
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
      '@vitejs/plugin-react': '^4.0.0',
      vite: '^4.4.0'
    }
  };

  archive.append(JSON.stringify(packageJson, null, 2), { name: 'package.json' });

  // Add pages
  const pages = database.pages.filter(p => p.projectId === project.id);
  pages.forEach(page => {
    const html = generateHTML(page, project);
    archive.append(html, { name: `src/pages/${page.name}.html` });
  });

  await archive.finalize();
  return exportPath;
};

const importVSCodeProject = async (filePath) => {
  // Simulate VS Code project import
  const project = {
    id: uuidv4(),
    name: 'Imported Project',
    description: 'Imported from VS Code',
    type: 'html',
    status: 'draft',
    pages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      ssl: true,
      compression: true,
      cache: true,
      analytics: false,
      seo: {
        title: 'Imported Project',
        description: '',
        keywords: []
      },
      deployment: {
        provider: 'cpanel',
        host: '',
        username: '',
        password: '',
        path: '/public_html'
      }
    }
  };

  return project;
};

const generatePreview = async (project, pageId) => {
  const previewPath = path.join(__dirname, 'previews', project.id);
  await fs.ensureDir(previewPath);

  let page;
  if (pageId) {
    page = database.pages.find(p => p.id === pageId && p.projectId === project.id);
  } else {
    page = database.pages.find(p => p.projectId === project.id);
  }

  if (page) {
    const html = generateHTML(page, project);
    const previewFile = path.join(previewPath, 'index.html');
    await fs.writeFile(previewFile, html);
    return `/previews/${project.id}/index.html`;
  }

  throw new Error('No page found for preview');
};

// WebSocket for real-time updates
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Serve static files
app.use('/previews', express.static(path.join(__dirname, 'previews')));
app.use('/downloads', express.static(path.join(__dirname, 'exports')));

// Automatic backup every hour
cron.schedule('0 * * * *', () => {
  const backupPath = path.join(__dirname, 'backups', `backup-${Date.now()}.json`);
  fs.ensureDirSync(path.dirname(backupPath));
  fs.writeFileSync(backupPath, JSON.stringify(database, null, 2));
  console.log('Database backup created:', backupPath);
});

// Cleanup old files daily
cron.schedule('0 2 * * *', async () => {
  const cleanupPaths = [
    path.join(__dirname, 'builds'),
    path.join(__dirname, 'previews'),
    path.join(__dirname, 'exports'),
    path.join(__dirname, 'backups')
  ];

  for (const cleanupPath of cleanupPaths) {
    try {
      if (await fs.pathExists(cleanupPath)) {
        const files = await fs.readdir(cleanupPath);
        const now = Date.now();
        
        for (const file of files) {
          const filePath = path.join(cleanupPath, file);
          const stats = await fs.stat(filePath);
          const age = now - stats.mtime.getTime();
          
          // Delete files older than 7 days
          if (age > 7 * 24 * 60 * 60 * 1000) {
            await fs.remove(filePath);
            console.log('Cleaned up old file:', filePath);
          }
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
server.listen(PORT, () => {
  console.log(`SiteForger server running on port ${PORT}`);
  console.log(`WebSocket server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});