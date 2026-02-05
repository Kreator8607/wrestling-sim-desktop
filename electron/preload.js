import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  onDatabaseReady: (callback) => ipcRenderer.on('database-ready', callback),
});
