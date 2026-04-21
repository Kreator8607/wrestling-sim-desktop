/**
 * Comprehensive Error Handler and Validation System
 * Handles all errors, validates data, and provides recovery mechanisms
 */

import { ErrorRecovery } from './backup';

/**
 * Error Types
 */
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  BACKUP_ERROR: 'BACKUP_ERROR',
  DATA_ERROR: 'DATA_ERROR',
  PERFORMANCE_ERROR: 'PERFORMANCE_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  RENDER_ERROR: 'RENDER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
};

/**
 * Central Error Handler
 */
export const ErrorHandler = {
  /**
   * Handle error with logging and recovery
   */
  handle(error, context = '', type = ErrorTypes.VALIDATION_ERROR) {
    const errorInfo = {
      type,
      message: error.message || String(error),
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    // Log error
    ErrorRecovery.logError(error, context);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${type}] ${context}:`, error);
    }

    // Attempt recovery based on error type
    this.attemptRecovery(type, errorInfo);

    return errorInfo;
  },

  /**
   * Attempt recovery based on error type
   */
  attemptRecovery(type, errorInfo) {
    switch (type) {
      case ErrorTypes.CACHE_ERROR:
        this.recoverCache();
        break;
      case ErrorTypes.BACKUP_ERROR:
        this.recoverBackup();
        break;
      case ErrorTypes.STORAGE_ERROR:
        this.recoverStorage();
        break;
      case ErrorTypes.RENDER_ERROR:
        this.recoverRender();
        break;
      default:
        break;
    }
  },

  /**
   * Recover from cache errors
   */
  recoverCache() {
    try {
      const cacheKeys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
      cacheKeys.forEach(key => localStorage.removeItem(key));
      console.log('Cache recovered');
    } catch (e) {
      console.error('Failed to recover cache:', e);
    }
  },

  /**
   * Recover from backup errors
   */
  recoverBackup() {
    try {
      const backups = JSON.parse(localStorage.getItem('backups_list') || '[]');
      if (backups.length > 0) {
        const latestBackup = backups[backups.length - 1];
        console.log('Latest backup available:', latestBackup.id);
      }
    } catch (e) {
      console.error('Failed to recover backup:', e);
    }
  },

  /**
   * Recover from storage errors
   */
  recoverStorage() {
    try {
      // Check if localStorage is available
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      console.log('Storage recovered');
    } catch (e) {
      console.error('Storage not available:', e);
    }
  },

  /**
   * Recover from render errors
   */
  recoverRender() {
    try {
      // Reload the page if render error occurs
      console.log('Attempting to recover from render error');
      // window.location.reload(); // Uncomment to auto-reload
    } catch (e) {
      console.error('Failed to recover render:', e);
    }
  },
};

/**
 * Data Validation System
 */
export const Validator = {
  /**
   * Validate wrestler data
   */
  validateWrestler(wrestler) {
    const errors = [];

    if (!wrestler) {
      errors.push('Wrestler object is required');
      return { valid: false, errors };
    }

    if (!wrestler.name || typeof wrestler.name !== 'string' || wrestler.name.trim() === '') {
      errors.push('Wrestler name is required and must be a string');
    }

    if (wrestler.wrestling !== undefined) {
      if (typeof wrestler.wrestling !== 'number' || wrestler.wrestling < 0 || wrestler.wrestling > 100) {
        errors.push('Wrestling must be a number between 0 and 100');
      }
    }

    if (wrestler.entertainment !== undefined) {
      if (typeof wrestler.entertainment !== 'number' || wrestler.entertainment < 0 || wrestler.entertainment > 100) {
        errors.push('Entertainment must be a number between 0 and 100');
      }
    }

    if (wrestler.starPower !== undefined) {
      if (typeof wrestler.starPower !== 'number' || wrestler.starPower < 0 || wrestler.starPower > 100) {
        errors.push('Star Power must be a number between 0 and 100');
      }
    }

    if (wrestler.intimidation !== undefined) {
      if (typeof wrestler.intimidation !== 'number' || wrestler.intimidation < 0 || wrestler.intimidation > 100) {
        errors.push('Intimidation must be a number between 0 and 100');
      }
    }

    if (wrestler.sexAppeal !== undefined) {
      if (typeof wrestler.sexAppeal !== 'number' || wrestler.sexAppeal < 0 || wrestler.sexAppeal > 100) {
        errors.push('Sex Appeal must be a number between 0 and 100');
      }
    }

    if (wrestler.height !== undefined) {
      if (typeof wrestler.height !== 'number' || wrestler.height < 150 || wrestler.height > 250) {
        errors.push('Height must be between 150 and 250 cm');
      }
    }

    if (wrestler.weight !== undefined) {
      if (typeof wrestler.weight !== 'number' || wrestler.weight < 50 || wrestler.weight > 200) {
        errors.push('Weight must be between 50 and 200 kg');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate promotion data
   */
  validatePromotion(promotion) {
    const errors = [];

    if (!promotion) {
      errors.push('Promotion object is required');
      return { valid: false, errors };
    }

    if (!promotion.name || typeof promotion.name !== 'string') {
      errors.push('Promotion name is required and must be a string');
    }

    if (!promotion.country || typeof promotion.country !== 'string') {
      errors.push('Promotion country is required and must be a string');
    }

    if (promotion.founded !== undefined) {
      if (typeof promotion.founded !== 'number' || promotion.founded < 1900 || promotion.founded > new Date().getFullYear()) {
        errors.push(`Founded year must be between 1900 and ${new Date().getFullYear()}`);
      }
    }

    if (promotion.wrestlers !== undefined) {
      if (typeof promotion.wrestlers !== 'number' || promotion.wrestlers < 0) {
        errors.push('Number of wrestlers must be a positive number');
      }
    }

    if (promotion.titles !== undefined) {
      if (typeof promotion.titles !== 'number' || promotion.titles < 0) {
        errors.push('Number of titles must be a positive number');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate title data
   */
  validateTitle(title) {
    const errors = [];

    if (!title) {
      errors.push('Title object is required');
      return { valid: false, errors };
    }

    if (!title.name || typeof title.name !== 'string') {
      errors.push('Title name is required and must be a string');
    }

    if (!title.promotion || typeof title.promotion !== 'string') {
      errors.push('Title promotion is required and must be a string');
    }

    const validTypes = ['World', 'Mid-Card', 'Tag Team', 'Women', 'Cruiserweight', 'Television', 'Hardcore'];
    if (title.type && !validTypes.includes(title.type)) {
      errors.push(`Title type must be one of: ${validTypes.join(', ')}`);
    }

    if (title.prestige !== undefined) {
      if (typeof title.prestige !== 'number' || title.prestige < 0 || title.prestige > 100) {
        errors.push('Prestige must be a number between 0 and 100');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate achievement data
   */
  validateAchievement(achievement) {
    const errors = [];

    if (!achievement) {
      errors.push('Achievement object is required');
      return { valid: false, errors };
    }

    if (!achievement.name || typeof achievement.name !== 'string') {
      errors.push('Achievement name is required and must be a string');
    }

    if (achievement.points !== undefined) {
      if (typeof achievement.points !== 'number' || achievement.points < 0 || achievement.points > 1000) {
        errors.push('Points must be a number between 0 and 1000');
      }
    }

    const validCategories = ['Simulation', 'Rankings', 'Titles', 'Milestones', 'Special'];
    if (achievement.category && !validCategories.includes(achievement.category)) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate event data
   */
  validateEvent(event) {
    const errors = [];

    if (!event) {
      errors.push('Event object is required');
      return { valid: false, errors };
    }

    if (!event.name || typeof event.name !== 'string') {
      errors.push('Event name is required and must be a string');
    }

    if (!event.promotion || typeof event.promotion !== 'string') {
      errors.push('Event promotion is required and must be a string');
    }

    if (!Array.isArray(event.matches) || event.matches.length === 0) {
      errors.push('Event must have at least one match');
    }

    if (event.date && isNaN(new Date(event.date).getTime())) {
      errors.push('Event date must be a valid date');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate settings
   */
  validateSettings(settings) {
    const errors = [];

    if (!settings) {
      errors.push('Settings object is required');
      return { valid: false, errors };
    }

    const validThemes = ['dark', 'light'];
    if (settings.theme && !validThemes.includes(settings.theme)) {
      errors.push(`Theme must be one of: ${validThemes.join(', ')}`);
    }

    if (settings.autoSaveInterval !== undefined) {
      if (typeof settings.autoSaveInterval !== 'number' || settings.autoSaveInterval < 1 || settings.autoSaveInterval > 30) {
        errors.push('Auto-save interval must be between 1 and 30 minutes');
      }
    }

    const validLanguages = ['pt-BR', 'en-US', 'es-ES'];
    if (settings.language && !validLanguages.includes(settings.language)) {
      errors.push(`Language must be one of: ${validLanguages.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

/**
 * Safe Operation Wrapper
 */
export function safeOperation(operation, context = 'Unknown operation', fallback = null) {
  try {
    return operation();
  } catch (error) {
    ErrorHandler.handle(error, context);
    return fallback;
  }
}

/**
 * Safe Async Operation Wrapper
 */
export async function safeAsyncOperation(operation, context = 'Unknown async operation', fallback = null) {
  try {
    return await operation();
  } catch (error) {
    ErrorHandler.handle(error, context);
    return fallback;
  }
}

/**
 * Performance Monitor
 */
export const PerformanceMonitor = {
  metrics: {},

  /**
   * Start measuring performance
   */
  start(label) {
    this.metrics[label] = {
      startTime: performance.now(),
      startMemory: process.memoryUsage().heapUsed,
    };
  },

  /**
   * End measuring performance
   */
  end(label) {
    if (!this.metrics[label]) {
      console.warn(`Performance metric '${label}' was not started`);
      return null;
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    const result = {
      label,
      duration: endTime - this.metrics[label].startTime,
      memoryUsed: (endMemory - this.metrics[label].startMemory) / 1024 / 1024, // MB
    };

    delete this.metrics[label];

    // Log if performance is poor
    if (result.duration > 1000) {
      console.warn(`[Performance Warning] ${label} took ${result.duration.toFixed(2)}ms`);
    }

    return result;
  },

  /**
   * Get all metrics
   */
  getMetrics() {
    return this.metrics;
  },

  /**
   * Clear metrics
   */
  clear() {
    this.metrics = {};
  },
};

/**
 * Fallback UI Component for Error Display
 */
export function ErrorBoundary({ error, resetError }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-red-500 rounded-lg p-6 max-w-md">
        <h2 className="text-lg font-bold text-red-600 mb-2">Erro Detectado</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message || 'Um erro inesperado ocorreu'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Tentar Novamente
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            Recarregar
          </button>
        </div>
      </div>
    </div>
  );
}
