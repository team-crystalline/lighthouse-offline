const path = require('path');
const csv = require('csv-parser');
const fs = require('fs').promises;
const fsCallback = require('fs');
const { read } = require('node:fs');

async function settings() {
  let settingsPath = path.join(app.getPath('userData'), 'settings.json');
  let settingsObj;
  try {
    settingsObj = JSON.parse(await fs.readFile(settingsPath, 'utf8'));
  } catch (e) {
    settingsObj = {};
  }
  return settingsObj;
}

async function writeCSVFromObjects(objects, headers, filePath){
    const lines = [headers.join(',')];
    objects.forEach((obj)=>{
        lines.push(headers.map(h=> obj[h] ?? '').join(','));
    });
    await fs.writeFile(filePath, lines.join('\n'));
}

async function insertToCSV(data, filePath){
    const headers = data.headers();
    const values = headers.map(key => data[key] ?? '');
    
    const csv = await fs.readFile(filePath, 'utf-8');
    const newRow = values.join(',') + '\n';
    
    await fs.appendFile(filePath, newRow);
}

async function readCSV(filePath){
    let results = [];
    return new Promise((resolve, reject) => {
        fsCallback.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', reject);
      });
}

async function updateInCSV(data, filePath){
    const rows = await readCSV(filePath);
    const headers = data.headers();

    const updated = rows.map((row)=>{
        // Does this row match? If yes, update it. If not, keep it the same.
        row.id == data.id ? Object.fromEntries(headers.map(h => [h, data[h]])) : row
    });
    await writeCSVFromObjects(updated, headers, filePath);
}

async function deleteFromCSV(data, filePath){
    const rows = await readCSV(filePath);
    const headers = data.headers();

    const filtered = rows.filter(row => row.id !== data.id);

    await writeCSVFromObjects(filtered, headers, filePath);
}

module.exports = { insertToCSV, readCSV, updateInCSV, deleteFromCSV, settingsFile };