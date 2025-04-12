import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
};

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState(() => {
        // Load watchlist from localStorage on initial render
        const saved = localStorage.getItem('watchlist');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever watchlist changes
    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const addToWatchlist = (stock) => {
        setWatchlist(prev => {
            if (!prev.some(item => item.symbol === stock.symbol)) {
                return [...prev, stock];
            }
            return prev;
        });
    };

    const removeFromWatchlist = (symbol) => {
        setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
    };

    const isInWatchlist = (symbol) => {
        return watchlist.some(stock => stock.symbol === symbol);
    };

    return (
        <WatchlistContext.Provider value={{ 
            watchlist, 
            addToWatchlist, 
            removeFromWatchlist,
            isInWatchlist
        }}>
            {children}
        </WatchlistContext.Provider>
    );
}; 