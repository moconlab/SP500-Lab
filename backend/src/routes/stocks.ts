import { Router, Request, Response } from 'express';
import { StockService } from '../services/stockService';

const router = Router();

// Get all stocks
router.get('/', (req: Request, res: Response) => {
  try {
    const stocks = StockService.getAllStocks();
    res.json({
      success: true,
      data: stocks,
      count: stocks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stocks'
    });
  }
});

// Search stocks
router.get('/search', (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }

    const stocks = StockService.searchStocks(query);
    res.json({
      success: true,
      data: stocks,
      count: stocks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search stocks'
    });
  }
});

// Get stock details
router.get('/:symbol', (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stock = StockService.getStockBySymbol(symbol.toUpperCase());
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        error: 'Stock not found'
      });
    }

    const metrics = StockService.getStockMetrics(symbol.toUpperCase());
    const recommendation = StockService.getRecommendation(symbol.toUpperCase());
    const priceHistory = StockService.getPriceHistory(symbol.toUpperCase(), 90);

    res.json({
      success: true,
      data: {
        stock,
        metrics,
        recommendation,
        priceHistory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock details'
    });
  }
});

// Get stock metrics
router.get('/:symbol/metrics', (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const metrics = StockService.getStockMetrics(symbol.toUpperCase());
    
    if (!metrics) {
      return res.status(404).json({
        success: false,
        error: 'Metrics not found for this stock'
      });
    }

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock metrics'
    });
  }
});

// Get stock recommendation
router.get('/:symbol/recommendation', (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const recommendation = StockService.getRecommendation(symbol.toUpperCase());
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found for this stock'
      });
    }

    res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendation'
    });
  }
});

// Get stock price history
router.get('/:symbol/history', (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const days = parseInt(req.query.days as string) || 90;
    
    const priceHistory = StockService.getPriceHistory(symbol.toUpperCase(), days);
    
    if (priceHistory.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Stock not found'
      });
    }

    res.json({
      success: true,
      data: priceHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price history'
    });
  }
});

export default router;
