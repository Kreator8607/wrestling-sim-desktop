/**
 * Backup and Recovery System
 * Handles automatic backups and data recovery
 */

export const BackupManager = {
  /**
   * Create a backup of all app data
   * @returns {object} Backup object with timestamp
   */
  createBackup() {
    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        settings: this._getSettings(),
        events: this._getEvents(),
        wrestlers: this._getWrestlers(),
        titles: this._getTitles(),
        achievements: this._getAchievements(),
      },
      version: '4.0.0',
    };

    // Save to localStorage
    try {
      const backups = this._getBackupList();
      backups.push({
        id: backup.timestamp,
        size: JSON.stringify(backup).length,
        timestamp: backup.timestamp,
      });

      localStorage.setItem('backups_list', JSON.stringify(backups));
      localStorage.setItem(`backup_${backup.timestamp}`, JSON.stringify(backup));
    } catch (e) {
      console.error('Failed to create backup:', e);
      return null;
    }

    return backup;
  },

  /**
   * Restore from a backup
   * @param {string} backupId - Backup timestamp ID
   * @returns {boolean} Success status
   */
  restoreBackup(backupId) {
    try {
      const backup = localStorage.getItem(`backup_${backupId}`);
      if (!backup) {
        console.error('Backup not found:', backupId);
        return false;
      }

      const data = JSON.parse(backup);

      // Restore data
      localStorage.setItem('app_settings', JSON.stringify(data.data.settings));
      localStorage.setItem('app_events', JSON.stringify(data.data.events));
      localStorage.setItem('app_wrestlers', JSON.stringify(data.data.wrestlers));
      localStorage.setItem('app_titles', JSON.stringify(data.data.titles));
      localStorage.setItem('app_achievements', JSON.stringify(data.data.achievements));

      console.log('Backup restored successfully:', backupId);
      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  },

  /**
   * Get list of all backups
   * @returns {array} Array of backup metadata
   */
  getBackupList() {
    return this._getBackupList();
  },

  /**
   * Delete a backup
   * @param {string} backupId - Backup timestamp ID
   */
  deleteBackup(backupId) {
    try {
      localStorage.removeItem(`backup_${backupId}`);
      const backups = this._getBackupList();
      const filtered = backups.filter(b => b.id !== backupId);
      localStorage.setItem('backups_list', JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete backup:', e);
    }
  },

  /**
   * Export backup as JSON file
   * @param {string} backupId - Backup timestamp ID
   */
  exportBackup(backupId) {
    try {
      const backup = localStorage.getItem(`backup_${backupId}`);
      if (!backup) return null;

      const data = JSON.parse(backup);
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wrestling-sim-backup-${backupId}.json`;
      a.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (e) {
      console.error('Failed to export backup:', e);
      return false;
    }
  },

  /**
   * Import backup from JSON file
   * @param {File} file - JSON backup file
   */
  async importBackup(file) {
    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      // Validate backup structure
      if (!backup.timestamp || !backup.data) {
        throw new Error('Invalid backup format');
      }

      // Save imported backup
      const backups = this._getBackupList();
      backups.push({
        id: backup.timestamp,
        size: JSON.stringify(backup).length,
        timestamp: backup.timestamp,
      });

      localStorage.setItem('backups_list', JSON.stringify(backups));
      localStorage.setItem(`backup_${backup.timestamp}`, JSON.stringify(backup));

      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  },

  /**
   * Auto-backup periodically
   * @param {number} interval - Interval in milliseconds
   */
  startAutoBackup(interval = 300000) { // 5 minutes default
    return setInterval(() => {
      this.createBackup();
      this._cleanupOldBackups();
    }, interval);
  },

  /**
   * Get backup statistics
   */
  getStats() {
    const backups = this._getBackupList();
    const totalSize = backups.reduce((sum, b) => sum + b.size, 0);

    return {
      backupCount: backups.length,
      totalSize,
      averageSize: backups.length > 0 ? totalSize / backups.length : 0,
      lastBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null,
    };
  },

  // Private methods
  _getBackupList() {
    try {
      const list = localStorage.getItem('backups_list');
      return list ? JSON.parse(list) : [];
    } catch (e) {
      return [];
    }
  },

  _getSettings() {
    try {
      return JSON.parse(localStorage.getItem('app_settings') || '{}');
    } catch (e) {
      return {};
    }
  },

  _getEvents() {
    try {
      return JSON.parse(localStorage.getItem('app_events') || '[]');
    } catch (e) {
      return [];
    }
  },

  _getWrestlers() {
    try {
      return JSON.parse(localStorage.getItem('app_wrestlers') || '[]');
    } catch (e) {
      return [];
    }
  },

  _getTitles() {
    try {
      return JSON.parse(localStorage.getItem('app_titles') || '[]');
    } catch (e) {
      return [];
    }
  },

  _getAchievements() {
    try {
      return JSON.parse(localStorage.getItem('app_achievements') || '[]');
    } catch (e) {
      return [];
    }
  },

  _cleanupOldBackups() {
    const backups = this._getBackupList();
    const maxBackups = 10;

    if (backups.length > maxBackups) {
      // Keep only the latest maxBackups
      const toDelete = backups.slice(0, backups.length - maxBackups);
      toDelete.forEach(backup => this.deleteBackup(backup.id));
    }
  },
};

/**
 * Error Recovery System
 */
export const ErrorRecovery = {
  /**
   * Log error and create recovery checkpoint
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  logError(error, context = '') {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
    };

    try {
      const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      logs.push(errorLog);

      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.shift();
      }

      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to log error:', e);
    }

    console.error(`[${context}]`, error);
  },

  /**
   * Get error logs
   */
  getErrorLogs() {
    try {
      return JSON.parse(localStorage.getItem('error_logs') || '[]');
    } catch (e) {
      return [];
    }
  },

  /**
   * Clear error logs
   */
  clearErrorLogs() {
    localStorage.removeItem('error_logs');
  },

  /**
   * Export error logs
   */
  exportErrorLogs() {
    const logs = this.getErrorLogs();
    const json = JSON.stringify(logs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wrestling-sim-error-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
