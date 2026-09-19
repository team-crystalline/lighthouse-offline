const { app } = require('electron');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs').promises;
const fsCallback = require('fs');
const { read } = require('node:fs');

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


async function dataDir() {
  if (!cachedDir) {
    const settings = await readSettings();
    cachedDir = settings.dataDir || path.join(app.getPath('documents'), 'lighthouse-offline');
  }
  return cachedDir;
}

module.exports = {settingsFile, readSettings, writeSettings, dataDir}