const path = require('path');
const csv = require('csv-parser');
const fs = require('fs').promises;
const fsCallback = require('fs');
const { read } = require('node:fs');

async function writeCSVFromObjects(objects, headers, filePath){
    const lines = [headers.join(',')];
    objects.forEach((obj)=>{
        const values = headers.map(h => {
            let val = obj[h] ?? '';
            if (String(val).includes(',') || String(val).includes('"')) {
                return `"${String(val).replace(/"/g, '""')}"`;
            }
            return val;
        });
        lines.push(values.join(','));
    });
    await fs.writeFile(filePath, lines.join('\n'));
}

async function insertToCSV(data, filePath) {
    const headers = data.headers();
    let csv = await fs.readFile(filePath, 'utf-8').catch(() => '');

    if (!csv) csv = headers.join(',') + '\n';
    else if (!csv.endsWith('\n')) csv += '\n';

    const values = headers.map(key => {
        const val = String(data[key] ?? '');
        return /[",\n]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val;
    });

    await fs.writeFile(filePath, csv + values.join(',') + '\n');
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
        return row.id == data.id ? Object.fromEntries(headers.map(h => [h, data[h]])) : row
    });
    await writeCSVFromObjects(updated, headers, filePath);
}

async function deleteFromCSV(data, filePath){
    const rows = await readCSV(filePath);
    const headers = data.headers();

    const filtered = rows.filter(row => row.id !== data.id);

    await writeCSVFromObjects(filtered, headers, filePath);
}

module.exports = { insertToCSV, readCSV, updateInCSV, deleteFromCSV, };