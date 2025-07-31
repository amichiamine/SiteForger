import React, { useState, useRef, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RefreshCw, 
  ExternalLink, 
  Download,
  Settings,
  Maximize2
} from 'lucide-react';

interface PreviewFrameProps {
  html: string;
  css?: string;
  javascript?: string;
  title?: string;
  onDeviceChange?: (device: 'mobile' | 'tablet' | 'desktop') => void;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({
  html,
  css = '',
  javascript = '',
  title = 'Preview',
  onDeviceChange
}) => {
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const deviceSizes = {
    mobile: { width: 375, height: 667, name: 'iPhone SE' },
    tablet: { width: 768, height: 1024, name: 'iPad' },
    desktop: { width: 1200, height: 800, name: 'Desktop' }
  };

  useEffect(() => {
    updatePreview();
  }, [html, css, javascript]);

  useEffect(() => {
    if (onDeviceChange) {
      onDeviceChange(selectedDevice);
    }
    calculateScale();
  }, [selectedDevice, onDeviceChange]);

  useEffect(() => {
    const handleResize = () => calculateScale();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedDevice]);

  const calculateScale = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40; // padding
    const containerHeight = container.clientHeight - 100; // toolbar height
    
    const deviceSize = deviceSizes[selectedDevice];
    const scaleX = containerWidth / deviceSize.width;
    const scaleY = containerHeight / deviceSize.height;
    
    const newScale = Math.min(scaleX, scaleY, 1);
    setScale(newScale);
  };

  const updatePreview = () => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          ${css}
          
          /* SiteForger Preview Styles */
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          
          .siteforger-preview-info {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="siteforger-preview-info">
          ${deviceSizes[selectedDevice].name} Preview
        </div>
        ${html}
        <script>
          ${javascript}
          
          // SiteForger Preview Scripts
          console.log('SiteForger Preview loaded');
          
          // Prevent form submissions in preview
          document.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submission prevented in preview mode');
          });
          
          // Handle link clicks
          document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.href) {
              e.preventDefault();
              if (confirm('Open link in new tab?')) {
                window.open(e.target.href, '_blank');
              }
            }
          });
          
          // Notify parent when loaded
          window.addEventListener('load', function() {
            if (window.parent !== window) {
              window.parent.postMessage({ type: 'preview-loaded' }, '*');
            }
          });
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    iframeRef.current.src = url;
    
    // Cleanup previous URL
    const cleanup = () => URL.revokeObjectURL(url);
    setTimeout(cleanup, 1000);
  };

  const handleDeviceChange = (device: 'mobile' | 'tablet' | 'desktop') => {
    setSelectedDevice(device);
  };

  const handleRefresh = () => {
    updatePreview();
  };

  const handleOpenInNewTab = () => {
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${javascript}</script>
      </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownload = () => {
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${javascript}</script>
      </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Listen for iframe load events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'preview-loaded') {
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
          
          {/* Device Selector */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleDeviceChange('mobile')}
              className={`p-2 rounded transition-colors ${
                selectedDevice === 'mobile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeviceChange('tablet')}
              className={`p-2 rounded transition-colors ${
                selectedDevice === 'tablet'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeviceChange('desktop')}
              className={`p-2 rounded transition-colors ${
                selectedDevice === 'desktop'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="Desktop (1200px)"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {deviceSizes[selectedDevice].width} × {deviceSizes[selectedDevice].height}px
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Download HTML"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div
          className="bg-white rounded-lg shadow-2xl overflow-hidden transition-transform duration-300"
          style={{
            width: deviceSizes[selectedDevice].width,
            height: deviceSizes[selectedDevice].height,
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Loading preview...
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title={title}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>Device: {deviceSizes[selectedDevice].name}</span>
          <span>Scale: {Math.round(scale * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <span className="text-blue-600">Loading...</span>}
          <span>SiteForger Preview</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;