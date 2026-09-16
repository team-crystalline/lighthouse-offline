const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs').promises;
const { read } = require('node:fs');

if (app.isPackaged) {
  const { updateElectronApp } = require('update-electron-app');
  updateElectronApp();
}

/**
 * Returns the settings directory path. Gonna need this a lot.
 * @returns {String} Settings path
 */
function settingsFile() {
  return path.join(app.getPath('userData'), 'settings.json');
}

/**
 * Parses settings and makes it into a readable Object
 * @returns {Object} Settings
 */
async function readSettings() {
  try {
    return JSON.parse(await fs.readFile(settingsFile(), 'utf8'));
  } catch {
    return {};
  }
}

/**
 * Writes settings file.
 * @param {*} settings 
 */
async function writeSettings(settings) {
  await fs.writeFile(settingsFile(), JSON.stringify(settings, null, 2), 'utf8');
}

/**
 * Checks if a path exists.
 * @param {String} path 
 * @returns {Boolean} If the file exists or not.
 */
async function fileExists(path) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

let cachedDir = null;

async function dataDir() {
  if (!cachedDir) {
    const settings = await readSettings();
    cachedDir = settings.dataDir || path.join(app.getPath('documents'), 'lighthouse-offline');
  }
  return cachedDir;
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
    // backgroundColor: '#393072',
  })

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
};

// #region Special fucking permissions for Mac ----
/*
  Just gonna rant: I don't want to build for Mac. Apple has a $99/year fee PLUS notarization and other fees and I hate that. I hate it a lot.
*/
app.whenReady().then(async () => {
  app.settings = await readSettings();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

// Actually quits out of the program when it's closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
// #endregion -----

ipcMain.handle('scripts:choose-dir', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: 'Choose your Lighthouse folder',
    message: 'Your Lighthouse data will be placed here.',
    defaultPath: await dataDir(),
    buttonLabel: 'Use this folder',
    properties: ['openDirectory', 'createDirectory'],
  });

  if (canceled || !filePaths[0]) return { ok: false, dir: await dataDir() };

  // Existing files are left where they are — this points the app somewhere new,
  // it doesn't move your work.
  cachedDir = filePaths[0];
  await writeSettings({ ...(await readSettings()), dataDir: cachedDir });

  return { ok: true, dir: cachedDir };
});

ipcMain.handle('scripts:read-settings', async (_event) => {
  try {
    return JSON.parse(await fs.readFile(settingsFile(), 'utf8'));
  } catch {
    // Create settings!
    await writeSettings({}); // <-- Error here
    return {};
  }
});

ipcMain.handle('scripts:read-alts', async (_event) => {
  const settings = await readSettings();
  if (Object.keys(settings).length < 1) return []; // Can't set anything yet.

  const results = [];

  if (!fileExists(path.join(settings.dataDir, 'alters.csv'))){
    console.log("No Alters file exists.");
  } else {
    console.log("The Alters file exists.");
  }
  // fs.createReadStream(path.join(settings.dataDir, 'alters.csv'))
  //   .pipe(csv())
  //   .on('data', (data) => results.push(data))
  //   .on('end', () => {
  //     console.log(results);
  //     // [
  //     //   { NAME: 'Daffy Duck', AGE: '24' },
  //     //   { NAME: 'Bugs Bunny', AGE: '22' }
  //     // ]
  //   });

});