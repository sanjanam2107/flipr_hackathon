import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const api = {
    // Get all stocks
    getStocks: async () => {
        try {
            const response = await axiosInstance.get('/stocks');
            return response.data;
        } catch (error) {
            console.error('Error fetching stocks:', error);
            return [];
        }
    },

    // Get single stock details by symbol
    getStockDetails: async (symbol) => {
        const response = await axiosInstance.get(`/stocks/${symbol}`);
        return response.data;
    },

    // Update stock price
    updateStockPrice: async (symbol, price) => {
        const response = await axiosInstance.put(`/stocks/${symbol}/price`, { price });
        return response.data;
    },

    // Get watchlist
    getWatchlist: async () => {
        const response = await axios.get(`${API_URL}/watchlist`);
        return response.data;
    },

    // Add stock to watchlist
    addToWatchlist: async (stockId) => {
        const response = await axios.post(`${API_URL}/watchlist`, { stock_id: stockId });
        return response.data;
    },

    // Remove stock from watchlist
    removeFromWatchlist: async (stockId) => {
        const response = await axios.delete(`${API_URL}/watchlist/${stockId}`);
        return response.data;
    },

    // Export watchlist as CSV
    exportWatchlistCSV: async () => {
        const stocks = await api.getWatchlist();
        const csvContent = [
            ['Symbol', 'Name', 'Price', 'Industry'],
            ...stocks.map(stock => [
                stock.symbol,
                stock.name,
                stock.price,
                stock.industry
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'watchlist.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    // Send chat message
    sendChatMessage: async (message) => {
        try {
            const response = await axiosInstance.post('/chat', { message });
            return response.data;
        } catch (error) {
            console.error('Error sending chat message:', error);
            throw error;
        }
    }
};

export default api; 