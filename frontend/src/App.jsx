import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { WatchlistProvider } from './context/WatchlistContext';

import HomePage from './pages/HomePage';
import StockDetailsPage from './pages/StockDetailsPage';
import WatchlistPage from './pages/WatchlistPage';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff95',
      light: '#33ffa8',
      dark: '#00b268',
    },
    secondary: {
      main: '#ff0055',
      light: '#ff3377',
      dark: '#b2003b',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    success: {
      main: '#00ff95',
    },
    error: {
      main: '#ff0055',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0, 255, 149, 0.15)',
            border: '1px solid rgba(0, 255, 149, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0,255,149,0.2)',
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WatchlistProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stock/:symbol" element={<StockDetailsPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
          </Routes>
          <ChatBot />
        </Router>
      </WatchlistProvider>
    </ThemeProvider>
  );
}

export default App; 