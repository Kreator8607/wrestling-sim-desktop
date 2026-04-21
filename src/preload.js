const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  app: {
    name: 'Pro Wrestling Sim',
    version: '3.0.0'
  }
});
