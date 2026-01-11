import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StockList from './pages/StockList';
import StockDetailPage from './pages/StockDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <h1 className="logo">📊 S&P 500 Lab</h1>
            <p className="tagline">AI-Powered Stock Analysis & Recommendations</p>
          </div>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<StockList />} />
            <Route path="/stock/:symbol" element={<StockDetailPage />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>© 2024 S&P 500 Lab | Powered by Machine Learning & Data Science</p>
          <p className="disclaimer">
            Disclaimer: This is for educational purposes only. Not financial advice.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
