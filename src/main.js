const { app, BrowserWindow } = require('electron');
const path = require('path');

if (app.isPackaged) {
    const { updateElectronApp } = require('update-electron-app');
    updateElectronApp();
}
// Just to shut the damn terminal up:
app.disableHardwareAcceleration();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#393072',
  })

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
};

// #region Special fucking permissions for Mac ----
/*
  Just gonna rant: I don't want to build for Mac. Apple has a $99/year fee PLUS notarization and other fees and I hate that. I hate it a lot.
*/
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

// Actually quits out of the program when it's closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
// #endregion -----