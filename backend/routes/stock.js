const express = require('express');
const router = express.Router();
const Stock = require('../models/stock');

// Get all stocks
router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.getAll();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get stock by symbol
router.get('/:symbol', async (req, res) => {
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

// Update stock price
router.put('/:symbol/price', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { price } = req.body;
        
        if (!price || isNaN(price) || price <= 0) {
            res.status(400).json({ error: 'Invalid price value' });
            return;
        }

        const success = await Stock.updatePrice(symbol, price);
        if (!success) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }

        res.json({ message: 'Price updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 