import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    CircularProgress,
    InputAdornment,
    Fade,
    Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import StockCard from '../components/StockCard';
import api from '../services/api';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

const HomePage = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('');
    const [sectors, setSectors] = useState([]);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const stocksData = await api.getStocks();
            
            // Filter stocks based on search and sector
            const filteredStocks = stocksData.filter(stock => {
                const matchesSearch = search === '' || 
                    stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
                    stock.name.toLowerCase().includes(search.toLowerCase());
                
                const matchesSector = sector === '' || stock.sector === sector;
                
                return matchesSearch && matchesSector;
            });
            
            setStocks(filteredStocks);
            
            // Extract unique sectors
            const uniqueSectors = [...new Set(stocksData.map(stock => stock.sector))].filter(Boolean);
            setSectors(uniqueSectors);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update search filter
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStocks();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, sector]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography 
                    variant="h4" 
                    component={motion.h1}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    gutterBottom
                >
                    Stock Market Dashboard
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary"
                    component={motion.p}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Track and analyze your favorite stocks in real-time
                </Typography>
            </Box>
            
            <Paper 
                elevation={0}
                sx={{ 
                    mb: 4, 
                    p: 3,
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                }}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search stocks"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by symbol or name"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FilterListIcon fontSize="small" />
                                    Sector
                                </Box>
                            </InputLabel>
                            <Select
                                value={sector}
                                label="Sector"
                                onChange={(e) => setSector(e.target.value)}
                            >
                                <MenuItem value="">All Sectors</MenuItem>
                                {sectors.map((sec) => (
                                    <MenuItem key={sec} value={sec}>
                                        {sec}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Fade in={loading}>
                        <CircularProgress />
                    </Fade>
                </Box>
            ) : stocks.length === 0 ? (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    minHeight="400px"
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No stocks found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filter criteria
                    </Typography>
                </Box>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        {stocks.map((stock) => (
                            <Grid 
                                item 
                                xs={12} 
                                sm={6} 
                                md={4} 
                                key={stock.symbol}
                                component={motion.div}
                                variants={item}
                            >
                                <StockCard stock={stock} />
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            )}
        </Container>
    );
};

export default HomePage; 