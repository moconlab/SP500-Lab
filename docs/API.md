# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required. In production, implement JWT or OAuth2.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 8  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### 1. Health Check

**GET /health**

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "SP500 Stock Evaluation API",
  "version": "1.0.0"
}
```

### 2. API Documentation

**GET /api**

Get API documentation and available endpoints.

**Response:**
```json
{
  "service": "SP500 Stock Evaluation API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### 3. List All Stocks

**GET /api/stocks**

Get all S&P 500 stocks.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "marketCap": 3000000000000,
      "price": 185.50,
      "change": 2.35,
      "changePercent": 1.28,
      "volume": 52000000
    }
  ],
  "count": 8
}
```

### 4. Search Stocks

**GET /api/stocks/search?q=QUERY**

Search stocks by symbol or name.

**Parameters:**
- `q` (required): Search query string

**Example:**
```
GET /api/stocks/search?q=apple
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      ...
    }
  ],
  "count": 1
}
```

### 5. Get Stock Details

**GET /api/stocks/:symbol**

Get comprehensive details for a specific stock.

**Parameters:**
- `symbol` (required): Stock symbol (e.g., AAPL)

**Example:**
```
GET /api/stocks/AAPL
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stock": {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "marketCap": 3000000000000,
      "price": 185.50,
      "change": 2.35,
      "changePercent": 1.28,
      "volume": 52000000
    },
    "metrics": {
      "symbol": "AAPL",
      "peRatio": 29.5,
      "pbRatio": 45.2,
      "debtToEquity": 1.73,
      "roe": 147.5,
      "roa": 28.3,
      "currentRatio": 0.98,
      "quickRatio": 0.85,
      "grossMargin": 44.1,
      "operatingMargin": 30.5,
      "netMargin": 25.3,
      "revenueGrowth": 8.2,
      "earningsGrowth": 13.5,
      "freeCashFlow": 99800000000,
      "dividendYield": 0.52,
      "payoutRatio": 15.2
    },
    "recommendation": {
      "symbol": "AAPL",
      "recommendation": "BUY",
      "confidence": 85,
      "score": 78.5,
      "factors": [
        {
          "name": "P/E Ratio",
          "category": "valuation",
          "value": 29.5,
          "weight": 0.15,
          "impact": "positive",
          "explanation": "P/E ratio of 29.5 indicates reasonable valuation"
        }
      ],
      "generatedAt": "2024-01-15T10:30:00.000Z",
      "modelVersion": "1.0.0"
    },
    "priceHistory": [
      {
        "date": "2024-01-01",
        "open": 180.00,
        "high": 182.50,
        "low": 179.00,
        "close": 181.25,
        "volume": 50000000
      }
    ]
  }
}
```

### 6. Get Stock Metrics

**GET /api/stocks/:symbol/metrics**

Get financial metrics for a specific stock.

**Parameters:**
- `symbol` (required): Stock symbol

**Example:**
```
GET /api/stocks/AAPL/metrics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "peRatio": 29.5,
    "pbRatio": 45.2,
    "debtToEquity": 1.73,
    "roe": 147.5,
    ...
  }
}
```

### 7. Get Stock Recommendation

**GET /api/stocks/:symbol/recommendation**

Get AI-powered recommendation for a specific stock.

**Parameters:**
- `symbol` (required): Stock symbol

**Example:**
```
GET /api/stocks/AAPL/recommendation
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "recommendation": "BUY",
    "confidence": 85,
    "score": 78.5,
    "factors": [...],
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "modelVersion": "1.0.0"
  }
}
```

### 8. Get Price History

**GET /api/stocks/:symbol/history?days=90**

Get historical price data for a specific stock.

**Parameters:**
- `symbol` (required): Stock symbol
- `days` (optional): Number of days (default: 90, max: 365)

**Example:**
```
GET /api/stocks/AAPL/history?days=30
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "open": 180.00,
      "high": 182.50,
      "low": 179.00,
      "close": 181.25,
      "volume": 50000000
    }
  ]
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Rate Limiting

In production, implement rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## CORS

CORS is enabled for all origins in development. Configure specific origins in production.

## Data Freshness

- Stock prices: Updated every 15 minutes during market hours
- Financial metrics: Updated quarterly
- Recommendations: Generated on-demand

## Example Usage

### JavaScript/TypeScript
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Get all stocks
const stocks = await api.get('/stocks');

// Get stock details
const detail = await api.get('/stocks/AAPL');

// Search stocks
const results = await api.get('/stocks/search', {
  params: { q: 'technology' }
});
```

### Python
```python
import requests

BASE_URL = 'http://localhost:5000/api'

# Get all stocks
response = requests.get(f'{BASE_URL}/stocks')
stocks = response.json()['data']

# Get stock details
response = requests.get(f'{BASE_URL}/stocks/AAPL')
detail = response.json()['data']

# Get recommendation
response = requests.get(f'{BASE_URL}/stocks/AAPL/recommendation')
recommendation = response.json()['data']
```

### cURL
```bash
# Get all stocks
curl http://localhost:5000/api/stocks

# Get stock details
curl http://localhost:5000/api/stocks/AAPL

# Search stocks
curl "http://localhost:5000/api/stocks/search?q=apple"

# Get recommendation
curl http://localhost:5000/api/stocks/AAPL/recommendation
```
