const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const Stock = require('./models/stock');

const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./stocks.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        createTables();
    }
});

// Create tables
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        price REAL,
        industry TEXT,
        historical_data TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stock_id INTEGER,
        FOREIGN KEY (stock_id) REFERENCES stocks(id)
    )`);
}

// Routes
app.get('/api/stocks', async (req, res) => {
    try {
        const stocks = await Stock.getAll();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/stocks/:symbol', async (req, res) => {
    try {
        const stock = await Stock.getBySymbol(req.params.symbol);
        if (!stock) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }
        res.json(stock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/stocks/:symbol/price', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { price } = req.body;

        if (!price || isNaN(price) || price < 0) {
            res.status(400).json({ error: 'Invalid price value' });
            return;
        }

        const success = await Stock.updatePrice(symbol, price);
        if (!success) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }

        res.json({ message: 'Stock price updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Watchlist routes
app.get('/watchlist', (req, res) => {
    db.all(`
        SELECT s.* FROM stocks s
        JOIN watchlist w ON s.id = w.stock_id
    `, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/watchlist', (req, res) => {
    const { stock_id } = req.body;
    db.run('INSERT INTO watchlist (stock_id) VALUES (?)', [stock_id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.delete('/watchlist/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM watchlist WHERE stock_id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Stock removed from watchlist' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 