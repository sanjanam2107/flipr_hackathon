import express from 'express';
import { getStocks, getStockBySymbol, updateStockPrice } from '../controllers/stock';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all stocks
router.get('/', getStocks);

// Get stock by symbol
router.get('/:symbol', getStockBySymbol);

// Update stock price (protected route)
router.put('/:symbol/price', auth, updateStockPrice);

export default router; 