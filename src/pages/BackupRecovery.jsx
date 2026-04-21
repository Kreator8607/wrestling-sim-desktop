import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, RotateCcw, Save, HardDrive, Clock, FileJson } from 'lucide-react';
import { BackupManager, ErrorRecovery } from '../utils/backup';

export default function BackupRecovery() {
  const [backups, setBackups] = useState([]);
  const [stats, setStats] = useState(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [autoBackupInterval, setAutoBackupInterval] = useState(5);
  const [errorLogs, setErrorLogs] = useState([]);

  useEffect(() => {
    loadBackups();
    loadStats();
    loadErrorLogs();
  }, []);

  const loadBackups = () => {
    const list = BackupManager.getBackupList();
    setBackups(list.reverse()); // Most recent first
  };

  const loadStats = () => {
    setStats(BackupManager.getStats());
  };

  const loadErrorLogs = () => {
    const logs = ErrorRecovery.getErrorLogs();
    setErrorLogs(logs.reverse());
  };

  const handleCreateBackup = () => {
    const backup = BackupManager.createBackup();
    if (backup) {
      loadBackups();
      loadStats();
      alert('Backup criado com sucesso!');
    } else {
      alert('Erro ao criar backup');
    }
  };

  const handleRestoreBackup = (backupId) => {
    if (confirm('Tem certeza que deseja restaurar este backup? Dados atuais serão sobrescrito.')) {
      const success = BackupManager.restoreBackup(backupId);
      if (success) {
        alert('Backup restaurado com sucesso! A página será recarregada.');
        window.location.reload();
      } else {
        alert('Erro ao restaurar backup');
      }
    }
  };

  const handleDeleteBackup = (backupId) => {
    if (confirm('Tem certeza que deseja deletar este backup?')) {
      BackupManager.deleteBackup(backupId);
      loadBackups();
      loadStats();
    }
  };

  const handleExportBackup = (backupId) => {
    const success = BackupManager.exportBackup(backupId);
    if (!success) {
      alert('Erro ao exportar backup');
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      BackupManager.importBackup(file).then(success => {
        if (success) {
          loadBackups();
          loadStats();
          alert('Backup importado com sucesso!');
        } else {
          alert('Erro ao importar backup');
        }
      });
    }
  };

  const handleExportErrorLogs = () => {
    ErrorRecovery.exportErrorLogs();
  };

  const handleClearErrorLogs = () => {
    if (confirm('Tem certeza que deseja limpar todos os logs de erro?')) {
      ErrorRecovery.clearErrorLogs();
      setErrorLogs([]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Backup e Recuperação</h1>
        <p className="text-muted-foreground">Gerencie backups e recupere dados</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Backups</p>
                <p className="text-3xl font-bold">{stats.backupCount}</p>
              </div>
              <Save className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tamanho Total</p>
                <p className="text-3xl font-bold">{formatBytes(stats.totalSize)}</p>
              </div>
              <HardDrive className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Último Backup</p>
                <p className="text-sm font-bold">
                  {stats.lastBackup ? formatDate(stats.lastBackup) : 'Nunca'}
                </p>
              </div>
              <Clock className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Auto-Backup Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Auto-Backup</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoBackupEnabled}
              onChange={(e) => setAutoBackupEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Ativar auto-backup automático</span>
          </label>

          {autoBackupEnabled && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Intervalo (minutos): {autoBackupInterval}
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={autoBackupInterval}
                onChange={(e) => setAutoBackupInterval(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Backup Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCreateBackup}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          Criar Backup Agora
        </button>

        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          Importar Backup
          <input
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />
        </label>
      </div>

      {/* Backups List */}
      <div>
        <h3 className="text-lg font-bold mb-4">Backups Disponíveis ({backups.length})</h3>
        {backups.length === 0 ? (
          <div className="text-center py-8 bg-card border border-border rounded-lg">
            <FileJson className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">Nenhum backup criado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold">{formatDate(backup.timestamp)}</p>
                    <p className="text-sm text-muted-foreground">
                      Tamanho: {formatBytes(backup.size)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestoreBackup(backup.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      title="Restaurar este backup"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restaurar
                    </button>
                    <button
                      onClick={() => handleExportBackup(backup.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                      title="Exportar este backup"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      title="Deletar este backup"
                    >
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Logs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Logs de Erro ({errorLogs.length})</h3>
          {errorLogs.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleExportErrorLogs}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={handleClearErrorLogs}
                className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Limpar
              </button>
            </div>
          )}
        </div>

        {errorLogs.length === 0 ? (
          <div className="text-center py-8 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">Nenhum erro registrado</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {errorLogs.slice(0, 20).map((log, idx) => (
              <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-red-600">{log.message}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                {log.context && (
                  <p className="text-xs text-muted-foreground mb-1">Contexto: {log.context}</p>
                )}
                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer hover:text-foreground">Stack trace</summary>
                  <pre className="mt-1 p-2 bg-background rounded overflow-x-auto text-xs">
                    {log.stack}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
