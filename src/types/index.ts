export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'html' | 'react' | 'php' | 'nodejs';
  status: 'draft' | 'active' | 'completed';
  pages: Page[];
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
}

export interface Page {
  id: string;
  name: string;
  path: string;
  title: string;
  content: string;
  components: Component[];
  styles: string;
  scripts: string;
  meta: PageMeta;
  createdAt: string;
  updatedAt: string;
}

export interface Component {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children: Component[];
  styles: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  rating: number;
  downloads: number;
  tags: string[];
  type: 'free' | 'premium';
  content: string;
  components: Component[];
}

export interface ProjectSettings {
  domain?: string;
  ssl: boolean;
  compression: boolean;
  cache: boolean;
  analytics: boolean;
  seo: SEOSettings;
  deployment: DeploymentSettings;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface DeploymentSettings {
  provider: 'cpanel' | 'ftp' | 'sftp';
  host: string;
  username: string;
  password: string;
  path: string;
  port?: number;
  ssl?: boolean;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface DeploymentHistory {
  id: string;
  projectId: string;
  version: string;
  status: 'success' | 'failed' | 'pending';
  url?: string;
  deployedAt: string;
  logs: string[];
}