import React, { useState, useEffect } from 'react';
import { stockAPI } from '../services/api';
import { Stock } from '../types';
import StockCard from '../components/StockCard';
import './StockList.css';

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  useEffect(() => {
    fetchStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks, searchQuery, selectedSector]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const data = await stockAPI.getAllStocks();
      setStocks(data);
      setFilteredStocks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stocks. Please try again later.');
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterStocks = () => {
    let filtered = stocks;

    if (searchQuery) {
      filtered = filtered.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSector !== 'All') {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }

    setFilteredStocks(filtered);
  };

  const sectors = ['All', ...Array.from(new Set(stocks.map(s => s.sector)))];

  if (loading) {
    return (
      <div className="stock-list-container">
        <div className="loading">Loading stocks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-list-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="stock-list-container">
      <div className="header">
        <h1>S&P 500 Stocks</h1>
        <p className="subtitle">AI-powered stock recommendations for informed investment decisions</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by symbol or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="sector-select"
        >
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>

      <div className="stock-count">
        Showing {filteredStocks.length} of {stocks.length} stocks
      </div>

      <div className="stock-grid">
        {filteredStocks.map(stock => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>

      {filteredStocks.length === 0 && (
        <div className="no-results">
          No stocks found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default StockList;
