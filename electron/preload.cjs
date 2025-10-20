const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you want to expose to the renderer process here
  // For example:
  // openExternal: (url) => ipcRenderer.invoke('open-external', url),
  // getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Platform information
  platform: process.platform,
  
  // App information
  isElectron: true,
  
  // Example: Open external links
  openExternal: (url) => {
    // This would need to be implemented in main.js
    console.log('Opening external URL:', url);
  }
});

// Prevent the renderer from accessing Node.js APIs
window.addEventListener('DOMContentLoaded', () => {
  // Remove any Node.js globals that might have leaked
  delete window.require;
  delete window.exports;
  delete window.module;
});
