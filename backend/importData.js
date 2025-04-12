const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

const db = new sqlite3.Database('./stocks.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to SQLite database');
    importStocks();
});

function importStocks() {
    const results = [];
    
    fs.createReadStream('./data/sample_stocks.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const stmt = db.prepare('INSERT INTO stocks (symbol, name, price, industry, historical_data) VALUES (?, ?, ?, ?, ?)');
            
            results.forEach((stock) => {
                stmt.run(
                    stock.symbol,
                    stock.name,
                    parseFloat(stock.price),
                    stock.industry,
                    stock.historical_data
                );
            });
            
            stmt.finalize();
            console.log('Data imported successfully');
            db.close();
        });
} 