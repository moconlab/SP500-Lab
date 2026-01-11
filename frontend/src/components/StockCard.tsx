import React from 'react';
import { Stock } from '../types';
import { formatCurrency, formatPercent, getChangeColor } from '../utils/formatting';
import { useNavigate } from 'react-router-dom';
import './StockCard.css';

interface StockCardProps {
  stock: Stock;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="stock-card"
      onClick={() => navigate(`/stock/${stock.symbol}`)}
    >
      <div className="stock-card-header">
        <div>
          <h3 className="stock-symbol">{stock.symbol}</h3>
          <p className="stock-name">{stock.name}</p>
        </div>
        <div className="stock-price">
          <div className="price">${stock.price.toFixed(2)}</div>
          <div 
            className="change"
            style={{ color: getChangeColor(stock.change) }}
          >
            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
          </div>
        </div>
      </div>
      <div className="stock-card-body">
        <div className="stock-info-row">
          <span className="label">Sector:</span>
          <span className="value">{stock.sector}</span>
        </div>
        <div className="stock-info-row">
          <span className="label">Market Cap:</span>
          <span className="value">{formatCurrency(stock.marketCap)}</span>
        </div>
        <div className="stock-info-row">
          <span className="label">Volume:</span>
          <span className="value">{(stock.volume / 1000000).toFixed(2)}M</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
