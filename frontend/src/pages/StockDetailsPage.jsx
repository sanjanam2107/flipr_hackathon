import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Box,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import StockChart from '../components/StockChart';
import api from '../services/api';

const StockDetailsPage = () => {
    const { id } = useParams();
    const [stock, setStock] = useState(null);
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [stockData, watchlistData] = await Promise.all([
                api.getStockDetails(id),
                api.getWatchlist()
            ]);
            
            setStock(stockData);
            setIsWatchlisted(watchlistData.some(item => item.id === parseInt(id)));
        } catch (error) {
            console.error('Error fetching stock details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleWatchlist = async () => {
        try {
            if (isWatchlisted) {
                await api.removeFromWatchlist(id);
            } else {
                await api.addToWatchlist(id);
            }
            setIsWatchlisted(!isWatchlisted);
        } catch (error) {
            console.error('Error updating watchlist:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!stock) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5">Stock not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    {stock.symbol}
                </Typography>
                <IconButton
                    onClick={handleToggleWatchlist}
                    color="primary"
                    sx={{ ml: 2 }}
                >
                    {isWatchlisted ? <Star /> : <StarBorder />}
                </IconButton>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <StockChart data={stock.historical_data} symbol={stock.symbol} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Stock Details
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Company:</strong> {stock.name}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Current Price:</strong> ${stock.price}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Industry:</strong> {stock.industry}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StockDetailsPage; 