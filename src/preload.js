const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('LighthouseAPI', {
    chooseDir: () => ipcRenderer.invoke('scripts:choose-dir'),
    readSettings: async() => ipcRenderer.invoke('scripts:read-settings'),
    readAlts: async() => ipcRenderer.invoke('scripts:read-alts'),
    readSystems: async() => ipcRenderer.invoke('scripts:read-systems'),
    readJournals: async() => ipcRenderer.invoke('scripts:read-journals')
});