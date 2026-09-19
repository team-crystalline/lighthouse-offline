const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('LighthouseAPI', {
    chooseDir: () => ipcRenderer.invoke('scripts:choose-dir'),
    readSettings: async() => ipcRenderer.invoke('scripts:read-settings'),

    readAlts: async() => ipcRenderer.invoke('scripts:read-alts'),
    readSystems: async() => ipcRenderer.invoke('scripts:read-systems'),
    readJournals: async() => ipcRenderer.invoke('scripts:read-journals'),

    createSystem: async (system) => ipcRenderer.invoke('scripts:create-system', system),
    createAlter: async (alter) => ipcRenderer.invoke('scripts:create-alt', alter),
    createJournal: async (journal) => ipcRenderer.invoke('scripts:create-journal', journal),
});