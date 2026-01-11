# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│                   React + TypeScript Frontend                    │
│                  (Recharts, React Router, Axios)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Gateway                                │
│                   Express + TypeScript Backend                   │
│                  (Routes, Services, Middleware)                  │
└───┬─────────────────┬──────────────────┬────────────────────────┘
    │                 │                  │
    │                 │                  │
    ▼                 ▼                  ▼
┌─────────┐    ┌──────────────┐   ┌──────────────┐
│  Cache  │    │  Data Layer  │   │  ML Service  │
│  Redis  │    │              │   │              │
└─────────┘    └──────┬───────┘   └──────┬───────┘
                      │                  │
                      ▼                  ▼
              ┌─────────────────┐  ┌──────────────┐
              │ Data Warehouse  │  │  Databricks  │
              │ BigQuery/       │  │  + MLflow    │
              │ Snowflake/AWS   │  │              │
              └────────┬────────┘  └──────┬───────┘
                       │                  │
                       ▼                  ▼
              ┌─────────────────┐  ┌──────────────┐
              │  dbt Transform  │  │ Model Train  │
              │  Financial Data │  │ & Inference  │
              └─────────────────┘  └──────────────┘
```

## Data Flow

### 1. Data Ingestion
```
Raw Data Sources → Data Warehouse (BigQuery/Snowflake/AWS)
├── Stock Prices (OHLCV)
├── Company Fundamentals
├── Market Metadata
└── Historical Returns
```

### 2. Data Transformation (dbt)
```
Staging Layer → Marts Layer
├── stg_stock_prices
├── stg_fundamentals
│
└── Marts
    ├── finance/financial_metrics
    └── features/ml_features
```

### 3. ML Pipeline (Databricks)
```
Feature Store → Model Training → Model Registry → Inference
├── Load ml_features
├── Train models (RF, XGBoost, LightGBM)
├── Log experiments (MLflow)
├── Register best model
└── Deploy for serving
```

### 4. API Layer
```
Frontend Request → Backend API → Data/ML Service → Response
├── Parse request
├── Validate parameters
├── Fetch data/predictions
├── Transform response
└── Return JSON
```

## Component Interactions

### Frontend Components
- **StockList**: Displays all stocks with filtering
- **StockCard**: Individual stock preview
- **StockDetailPage**: Comprehensive stock analysis
- **PriceChart**: Interactive price history
- **RecommendationCard**: AI recommendation display

### Backend Services
- **StockService**: Business logic for stock operations
- **Routes**: API endpoint handlers
- **Types**: Shared TypeScript interfaces

### Data Models

#### Stock
```typescript
{
  symbol: string
  name: string
  sector: string
  industry: string
  marketCap: number
  price: number
  change: number
  changePercent: number
  volume: number
}
```

#### Recommendation
```typescript
{
  symbol: string
  recommendation: 'BUY' | 'HOLD' | 'AVOID'
  confidence: number (0-100)
  score: number (0-100)
  factors: RecommendationFactor[]
  generatedAt: timestamp
  modelVersion: string
}
```

#### RecommendationFactor
```typescript
{
  name: string
  category: 'valuation' | 'profitability' | 'growth' | 'financial_health'
  value: number
  weight: number (0-1)
  impact: 'positive' | 'negative' | 'neutral'
  explanation: string
}
```

## Scalability Considerations

### Horizontal Scaling
- Backend API can be scaled horizontally with load balancer
- Frontend served via CDN
- Database read replicas for analytics queries

### Caching Strategy
- Redis for frequently accessed data
- Browser caching for static assets
- API response caching with TTL

### Performance Optimization
- Database indexing on symbol, date columns
- Materialized views in data warehouse
- Lazy loading for frontend components
- API pagination for large datasets

## Security

### API Security
- CORS configuration
- Rate limiting
- Input validation
- Error handling without data leakage

### Data Security
- Environment variable management
- Encrypted database connections
- Service account credentials
- Secrets management (AWS Secrets Manager, GCP Secret Manager)

### Frontend Security
- XSS prevention
- CSRF protection
- Content Security Policy
- Secure HTTPS communication

## Monitoring & Observability

### Application Metrics
- API response times
- Error rates
- Request volumes
- Cache hit rates

### ML Metrics
- Model accuracy
- Prediction latency
- Feature drift
- Model performance over time

### Infrastructure Metrics
- CPU/Memory usage
- Database query performance
- Network latency
- Storage utilization

## Deployment

### Development
```bash
docker-compose up -d
```

### Staging
- Kubernetes deployment
- Auto-scaling based on load
- Blue-green deployments

### Production
- Multi-region deployment
- Disaster recovery
- Automated backups
- Health checks and auto-healing
