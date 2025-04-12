import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    IconButton,
    useTheme,
    alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { motion } from 'framer-motion';

const Navbar = () => {
    const theme = useTheme();

    const MotionIconButton = motion(IconButton);

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MotionIconButton
                            component={RouterLink}
                            to="/"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            sx={{ 
                                mr: 2,
                                color: theme.palette.primary.main
                            }}
                        >
                            <ShowChartIcon />
                        </MotionIconButton>
                        <Typography 
                            variant="h6" 
                            component={RouterLink} 
                            to="/" 
                            sx={{ 
                                textDecoration: 'none', 
                                color: 'inherit',
                                fontWeight: 700,
                                letterSpacing: '-0.01em',
                                background: 'linear-gradient(to right, #00ff95, #33ffa8)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            StockVision
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            color="primary" 
                            component={RouterLink} 
                            to="/"
                            startIcon={<DashboardIcon />}
                            sx={{ 
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            Dashboard
                        </Button>
                        <Button 
                            color="primary" 
                            component={RouterLink} 
                            to="/watchlist"
                            startIcon={<FavoriteIcon />}
                            sx={{ 
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            Watchlist
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar; 