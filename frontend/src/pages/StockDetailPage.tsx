import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stockAPI } from '../services/api';
import { StockDetail } from '../types';
import PriceChart from '../components/PriceChart';
import RecommendationCard from '../components/RecommendationCard';
import { formatCurrency, formatPercent, getChangeColor } from '../utils/formatting';
import './StockDetailPage.css';

const StockDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [stockDetail, setStockDetail] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbol) {
      fetchStockDetail(symbol);
    }
  }, [symbol]);

  const fetchStockDetail = async (sym: string) => {
    try {
      setLoading(true);
      const data = await stockAPI.getStockDetail(sym.toUpperCase());
      setStockDetail(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stock details. Please try again later.');
      console.error('Error fetching stock details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stock-detail-container">
        <div className="loading">Loading stock details...</div>
      </div>
    );
  }

  if (error || !stockDetail) {
    return (
      <div className="stock-detail-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Stocks
        </button>
        <div className="error">{error || 'Stock not found'}</div>
      </div>
    );
  }

  const { stock, metrics, recommendation, priceHistory } = stockDetail;

  return (
    <div className="stock-detail-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Stocks
      </button>

      <div className="stock-header">
        <div>
          <h1>{stock.symbol}</h1>
          <h2>{stock.name}</h2>
          <div className="stock-meta">
            <span className="sector-tag">{stock.sector}</span>
            <span className="industry-tag">{stock.industry}</span>
          </div>
        </div>
        <div className="stock-price-section">
          <div className="current-price">${stock.price.toFixed(2)}</div>
          <div 
            className="price-change"
            style={{ color: getChangeColor(stock.change) }}
          >
            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
          </div>
          <div className="market-cap">Market Cap: {formatCurrency(stock.marketCap)}</div>
        </div>
      </div>

      <div className="content-grid">
        <div className="main-content">
          <PriceChart data={priceHistory} symbol={stock.symbol} />

          <div className="metrics-card">
            <h3>Financial Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">P/E Ratio</span>
                <span className="metric-value">{metrics.peRatio.toFixed(2)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">P/B Ratio</span>
                <span className="metric-value">{metrics.pbRatio.toFixed(2)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">ROE</span>
                <span className="metric-value">{formatPercent(metrics.roe)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">ROA</span>
                <span className="metric-value">{formatPercent(metrics.roa)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Debt/Equity</span>
                <span className="metric-value">{metrics.debtToEquity.toFixed(2)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Current Ratio</span>
                <span className="metric-value">{metrics.currentRatio.toFixed(2)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Quick Ratio</span>
                <span className="metric-value">{metrics.quickRatio.toFixed(2)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Gross Margin</span>
                <span className="metric-value">{formatPercent(metrics.grossMargin)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Operating Margin</span>
                <span className="metric-value">{formatPercent(metrics.operatingMargin)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Net Margin</span>
                <span className="metric-value">{formatPercent(metrics.netMargin)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Revenue Growth</span>
                <span className="metric-value">{formatPercent(metrics.revenueGrowth)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Earnings Growth</span>
                <span className="metric-value">{formatPercent(metrics.earningsGrowth)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Free Cash Flow</span>
                <span className="metric-value">{formatCurrency(metrics.freeCashFlow)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Dividend Yield</span>
                <span className="metric-value">{formatPercent(metrics.dividendYield)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Payout Ratio</span>
                <span className="metric-value">{formatPercent(metrics.payoutRatio)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <RecommendationCard recommendation={recommendation} />
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;
