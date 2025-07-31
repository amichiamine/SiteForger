export class ValidationService {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validateProjectName(name: string): { isValid: boolean; message?: string } {
    if (!name.trim()) {
      return { isValid: false, message: 'Le nom du projet est requis' };
    }
    
    if (name.length < 3) {
      return { isValid: false, message: 'Le nom doit contenir au moins 3 caractères' };
    }
    
    if (name.length > 50) {
      return { isValid: false, message: 'Le nom ne peut pas dépasser 50 caractères' };
    }
    
    const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNameRegex.test(name)) {
      return { isValid: false, message: 'Le nom ne peut contenir que des lettres, chiffres, espaces, tirets et underscores' };
    }
    
    return { isValid: true };
  }

  static validatePagePath(path: string): { isValid: boolean; message?: string } {
    if (!path.trim()) {
      return { isValid: false, message: 'Le chemin de la page est requis' };
    }
    
    if (!path.startsWith('/')) {
      return { isValid: false, message: 'Le chemin doit commencer par /' };
    }
    
    const validPathRegex = /^\/[a-zA-Z0-9\-_\/]*$/;
    if (!validPathRegex.test(path)) {
      return { isValid: false, message: 'Le chemin contient des caractères invalides' };
    }
    
    return { isValid: true };
  }

  static validateDeploymentSettings(settings: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!settings.host?.trim()) {
      errors.push('L\'URL du serveur est requise');
    } else if (!this.validateUrl(settings.host)) {
      errors.push('L\'URL du serveur n\'est pas valide');
    }
    
    if (!settings.username?.trim()) {
      errors.push('Le nom d\'utilisateur est requis');
    }
    
    if (!settings.password?.trim()) {
      errors.push('Le mot de passe est requis');
    }
    
    if (!settings.path?.trim()) {
      errors.push('Le chemin de destination est requis');
    } else if (!settings.path.startsWith('/')) {
      errors.push('Le chemin doit commencer par /');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateComponentProps(type: string, props: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    switch (type) {
      case 'image':
        if (!props.src?.trim()) {
          errors.push('L\'URL de l\'image est requise');
        } else if (!this.validateUrl(props.src)) {
          errors.push('L\'URL de l\'image n\'est pas valide');
        }
        break;
        
      case 'button':
        if (!props.text?.trim()) {
          errors.push('Le texte du bouton est requis');
        }
        break;
        
      case 'text':
      case 'heading':
        if (!props.content?.trim()) {
          errors.push('Le contenu du texte est requis');
        }
        break;
        
      case 'form':
        if (!props.action?.trim()) {
          errors.push('L\'action du formulaire est requise');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production, use a proper library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  static validateFileSize(file: File, maxSizeMB: number = 10): { isValid: boolean; message?: string } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        message: `Le fichier est trop volumineux. Taille maximum: ${maxSizeMB}MB`
      };
    }
    
    return { isValid: true };
  }

  static validateFileType(file: File, allowedTypes: string[]): { isValid: boolean; message?: string } {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        message: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
      };
    }
    
    return { isValid: true };
  }

  static validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 8) {
      return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Le mot de passe doit contenir au moins une minuscule' };
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
    }
    
    return { isValid: true };
  }
}

export const validationService = ValidationService;