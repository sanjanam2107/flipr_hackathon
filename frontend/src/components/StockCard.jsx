import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Grid,
    IconButton,
    Tooltip,
    alpha,
    useTheme
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

const StockCard = ({ stock }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const isFavorite = isInWatchlist(stock.symbol);

    const {
        symbol,
        name,
        sector,
        currentPrice,
        high52Week,
        low52Week,
        volume
    } = stock;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(price);
    };

    const formatVolume = (vol) => {
        if (vol >= 10000000) {
            return `${(vol / 10000000).toFixed(2)}Cr`;
        } else if (vol >= 100000) {
            return `${(vol / 100000).toFixed(2)}L`;
        }
        return new Intl.NumberFormat('en-IN').format(vol);
    };

    const priceChangePercent = ((currentPrice - low52Week) / low52Week * 100).toFixed(2);
    const isPriceUp = currentPrice > (high52Week + low52Week) / 2;

    const glowColor = isPriceUp ? '#00ff95' : '#ff0055';
    const gradientBg = isPriceUp 
        ? 'linear-gradient(135deg, rgba(0, 255, 149, 0.15), rgba(0, 178, 104, 0.05))'
        : 'linear-gradient(135deg, rgba(255, 0, 85, 0.15), rgba(178, 0, 59, 0.05))';

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (isFavorite) {
            removeFromWatchlist(symbol);
        } else {
            addToWatchlist(stock);
        }
    };

    const handleChartClick = (e) => {
        e.stopPropagation();
        navigate(`/stock/${symbol}`);
    };

    return (
        <MotionCard
            onClick={() => navigate(`/stock/${symbol}`)}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ 
                y: -12, 
                scale: 1.02,
                boxShadow: `0 0 20px ${alpha(glowColor, 0.3)}`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 100
            }}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                background: gradientBg,
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'transparent',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                    borderColor: alpha(glowColor, 0.3),
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(to right, ${glowColor}, ${alpha(glowColor, 0.5)})`,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                },
            }}
        >
            <CardContent>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                                fontWeight: 700,
                                mb: 0.5,
                                background: `linear-gradient(to right, ${glowColor}, ${alpha(glowColor, 0.7)})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {symbol}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                                mb: 1,
                                opacity: isHovered ? 1 : 0.7,
                                transition: 'opacity 0.3s ease-in-out'
                            }}
                        >
                            {name}
                        </Typography>
                        <Chip 
                            label={sector}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ 
                                borderRadius: 1.5,
                                backgroundColor: alpha(glowColor, 0.1),
                                borderColor: alpha(glowColor, 0.3),
                                '&:hover': {
                                    backgroundColor: alpha(glowColor, 0.2),
                                }
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}>
                            <IconButton 
                                size="small"
                                onClick={handleFavoriteClick}
                                sx={{
                                    color: isFavorite ? theme.palette.error.main : 'inherit',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isFavorite ? 'filled' : 'outlined'}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                    </motion.div>
                                </AnimatePresence>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Chart">
                            <IconButton 
                                size="small" 
                                color="primary"
                                onClick={handleChartClick}
                                sx={{
                                    '&:hover': {
                                        transform: 'scale(1.1) rotate(15deg)',
                                        color: glowColor,
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                <ShowChartIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 700,
                                    color: glowColor,
                                }}
                            >
                                {formatPrice(currentPrice)}
                            </Typography>
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                            >
                                <Chip
                                    label={`${priceChangePercent}%`}
                                    size="small"
                                    color={isPriceUp ? 'success' : 'error'}
                                    sx={{
                                        borderRadius: 1.5,
                                        fontWeight: 600,
                                        backgroundColor: alpha(glowColor, 0.1),
                                        borderColor: alpha(glowColor, 0.3),
                                        color: glowColor,
                                    }}
                                    icon={isPriceUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                />
                            </motion.div>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            gutterBottom
                            sx={{ opacity: isHovered ? 1 : 0.7 }}
                        >
                            52W High
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUpIcon color="success" fontSize="small" />
                            <Typography sx={{ fontWeight: 600 }}>
                                {formatPrice(high52Week)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            gutterBottom
                            sx={{ opacity: isHovered ? 1 : 0.7 }}
                        >
                            52W Low
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingDownIcon color="error" fontSize="small" />
                            <Typography sx={{ fontWeight: 600 }}>
                                {formatPrice(low52Week)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            gutterBottom
                            sx={{ opacity: isHovered ? 1 : 0.7 }}
                        >
                            Volume
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                            {formatVolume(volume)}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </MotionCard>
    );
};

export default StockCard; 