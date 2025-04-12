const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));

// Create stocks table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sector TEXT,
    currentPrice REAL NOT NULL,
    high52Week REAL,
    low52Week REAL,
    volume INTEGER,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create historical_prices table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS historical_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_symbol TEXT NOT NULL,
    date DATE NOT NULL,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    volume INTEGER,
    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol)
  )
`);

const Stock = {
  // Get all stocks
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM stocks', [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },

  // Get stock by symbol
  getBySymbol: (symbol) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM stocks WHERE symbol = ?', [symbol], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  },

  // Update stock price
  updatePrice: (symbol, price) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE stocks SET currentPrice = ?, lastUpdated = CURRENT_TIMESTAMP WHERE symbol = ?',
        [price, symbol],
        function(err) {
          if (err) reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  },

  // Parse number from string (handles commas)
  parseNumber: (str) => {
    if (!str) return null;
    return parseFloat(str.replace(/,/g, ''));
  },

  // Load initial data from CSV
  loadFromCSV: (symbol, name, sector, data) => {
    return new Promise((resolve, reject) => {
      try {
        if (!data || data.length === 0) {
          reject(new Error('No data provided'));
          return;
        }

        const lastRow = data[0];
        const currentPrice = Stock.parseNumber(lastRow.close);
        const high52Week = Stock.parseNumber(lastRow['52W H']);
        const low52Week = Stock.parseNumber(lastRow['52W L']);
        const volume = Stock.parseNumber(lastRow.VOLUME);

        if (!currentPrice) {
          reject(new Error('Invalid price data'));
          return;
        }

        db.serialize(() => {
          // Insert or update stock data
          db.run(
            'INSERT OR REPLACE INTO stocks (symbol, name, sector, currentPrice, high52Week, low52Week, volume) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [symbol, name, sector, currentPrice, high52Week, low52Week, volume],
            function(err) {
              if (err) {
                reject(err);
                return;
              }

              // Insert historical data
              const stmt = db.prepare(
                'INSERT OR REPLACE INTO historical_prices (stock_symbol, date, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?)'
              );

              data.forEach(row => {
                stmt.run([
                  symbol,
                  row.Date.trim(),
                  Stock.parseNumber(row.OPEN),
                  Stock.parseNumber(row.HIGH),
                  Stock.parseNumber(row.LOW),
                  Stock.parseNumber(row.close),
                  Stock.parseNumber(row.VOLUME)
                ]);
              });

              stmt.finalize(err => {
                if (err) reject(err);
                else resolve();
              });
            }
          );
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = Stock; 