import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config/config';

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
import stockRoutes from './routes/stock';
import userRoutes from './routes/user';
import watchlistRoutes from './routes/watchlist';

app.use('/api/stocks', stockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
}); 