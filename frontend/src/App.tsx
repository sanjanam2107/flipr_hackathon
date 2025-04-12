import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from './pages/HomePage';
import StockDetailsPage from './pages/StockDetailsPage';
import WatchlistPage from './pages/WatchlistPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <a href="/" className="flex items-center text-xl font-bold text-primary-600">
                    Stock Market App
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                  >
                    Home
                  </a>
                  <a
                    href="/watchlist"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                  >
                    Watchlist
                  </a>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stock/:id" element={<StockDetailsPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 