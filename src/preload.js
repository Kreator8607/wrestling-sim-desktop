const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  app: {
    name: 'Pro Wrestling Sim',
    version: '4.0.0'
  }
});
