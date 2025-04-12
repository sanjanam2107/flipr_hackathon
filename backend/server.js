require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const Stock = require('./models/stock');
const stockRoutes = require('./routes/stock');
const chatRoutes = require('./routes/chat');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept']
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
app.use('/api/stocks', stockRoutes);
app.use('/api/chat', chatRoutes);

// Watchlist routes
app.get('/api/watchlist', (req, res) => {
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

app.post('/api/watchlist', (req, res) => {
    const { stock_id } = req.body;
    db.run('INSERT INTO watchlist (stock_id) VALUES (?)', [stock_id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.delete('/api/watchlist/:id', (req, res) => {
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