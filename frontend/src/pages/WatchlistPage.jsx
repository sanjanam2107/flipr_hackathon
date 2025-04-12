import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import StockCard from '../components/StockCard';
import { useWatchlist } from '../context/WatchlistContext';
import { motion } from 'framer-motion';

const WatchlistPage = () => {
    const { watchlist } = useWatchlist();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 700,
                        mb: 3,
                        background: 'linear-gradient(to right, #00ff95, #33ffa8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    My Watchlist
                </Typography>

                {watchlist.length === 0 ? (
                    <Box 
                        sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            opacity: 0.7
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            Your watchlist is empty
                        </Typography>
                        <Typography color="text.secondary">
                            Add stocks to your watchlist by clicking the heart icon on any stock card
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {watchlist.map((stock) => (
                            <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
                                <StockCard stock={stock} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </motion.div>
        </Container>
    );
};

export default WatchlistPage; 