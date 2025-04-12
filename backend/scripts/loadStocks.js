const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');
const Stock = require('../models/stock');

const stocksDir = path.join(__dirname, '../../stocks');

async function loadStocksFromDirectory(dirPath) {
  const sector = path.basename(dirPath).replace(/%20/g, ' ');
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file.endsWith('.csv')) {
      const symbol = path.basename(file, '.csv').split('-')[2] || path.basename(file, '.csv');
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, ''); // Remove BOM

      await new Promise((resolve, reject) => {
        csv.parse(fileContent, {
          columns: headers => headers.map(h => h.trim()),
          skip_empty_lines: true,
          trim: true,
          delimiter: ',',
          quote: '"',
          relax_quotes: true,
          relax_column_count: true
        }, async (err, data) => {
          if (err) {
            console.error(`Error parsing ${file}:`, err);
            reject(err);
            return;
          }

          try {
            await Stock.loadFromCSV(symbol, symbol, sector, data);
            console.log(`Loaded ${symbol} from ${sector}`);
            resolve();
          } catch (error) {
            console.error(`Error loading ${symbol}:`, error);
            reject(error);
          }
        });
      });
    }
  }
}

async function loadAllStocks() {
  const sectors = fs.readdirSync(stocksDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const sector of sectors) {
    const sectorPath = path.join(stocksDir, sector);
    console.log(`Loading stocks from sector: ${sector}`);
    await loadStocksFromDirectory(sectorPath);
  }

  console.log('All stocks loaded successfully!');
  process.exit(0);
}

loadAllStocks().catch(error => {
  console.error('Error loading stocks:', error);
  process.exit(1);
}); 