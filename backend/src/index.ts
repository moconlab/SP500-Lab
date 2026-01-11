import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stockRoutes from './routes/stocks';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SP500 Stock Evaluation API',
    version: '1.0.0'
  });
});

// API documentation endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    service: 'SP500 Stock Evaluation API',
    version: '1.0.0',
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Health check endpoint'
      },
      stocks: {
        list: {
          method: 'GET',
          path: '/api/stocks',
          description: 'Get all S&P 500 stocks'
        },
        search: {
          method: 'GET',
          path: '/api/stocks/search?q=QUERY',
          description: 'Search stocks by symbol or name'
        },
        detail: {
          method: 'GET',
          path: '/api/stocks/:symbol',
          description: 'Get detailed information for a specific stock'
        },
        metrics: {
          method: 'GET',
          path: '/api/stocks/:symbol/metrics',
          description: 'Get financial metrics for a stock'
        },
        recommendation: {
          method: 'GET',
          path: '/api/stocks/:symbol/recommendation',
          description: 'Get AI-powered recommendation for a stock'
        },
        history: {
          method: 'GET',
          path: '/api/stocks/:symbol/history?days=90',
          description: 'Get historical price data for a stock'
        }
      }
    },
    documentation: 'See README.md for complete documentation'
  });
});

// Routes
app.use('/api/stocks', stockRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check at http://localhost:${PORT}/health`);
});

export default app;
