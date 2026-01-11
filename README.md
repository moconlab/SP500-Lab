# SP500-Lab

🚀 **AI-Powered S&P 500 Stock Evaluation Platform**

A comprehensive full-stack web application for evaluating S&P 500 stocks with machine learning-powered recommendations, real-time data analysis, and interactive visualizations.

## 🌟 Features

- **Interactive Dashboard**: Browse and filter S&P 500 stocks with real-time data
- **AI Recommendations**: Machine learning-powered Buy/Hold/Avoid recommendations
- **Explainable AI**: Transparent factor-based analysis with detailed explanations
- **Financial Metrics**: Comprehensive financial ratios and performance indicators
- **Price Charts**: Interactive historical price visualizations
- **Cloud-Native**: Scalable architecture with BigQuery/Snowflake/AWS and Databricks

## 🏗️ Architecture

### Frontend
- **React** with **TypeScript** for type safety
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication
- Responsive design with modern CSS

### Backend
- **Node.js** with **Express** and **TypeScript**
- RESTful API architecture
- Clean separation of concerns (routes, services, types)
- Health checks and API documentation endpoints

### Data Infrastructure
- **dbt** for data transformations and feature engineering
- Support for **BigQuery**, **Snowflake**, and **AWS Redshift**
- Staged data pipeline (staging → marts)
- Pre-calculated financial metrics and ML features

### ML Infrastructure
- **Databricks** for distributed model training
- **MLflow** for experiment tracking and model registry
- Multiple ML algorithms (Random Forest, XGBoost, LightGBM, Gradient Boosting)
- Automated model versioning and deployment
- Feature importance tracking

## 📦 Project Structure

```
SP500-Lab/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Server entry point
│   ├── Dockerfile
│   └── package.json
│
├── dbt-project/             # dbt data transformations
│   ├── models/
│   │   ├── staging/         # Staging models
│   │   └── marts/           # Analytics-ready tables
│   │       ├── finance/     # Financial metrics
│   │       └── features/    # ML features
│   ├── dbt_project.yml
│   └── profiles.yml
│
├── ml-pipeline/             # Machine learning pipeline
│   ├── scripts/
│   │   └── train_model.py   # Model training script
│   ├── config/
│   │   ├── databricks_config.yml
│   │   └── mlflow_config.yml
│   └── requirements.txt
│
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (optional)
- Python 3.9+ (for ML pipeline)
- dbt Core (for data transformations)
- Access to BigQuery/Snowflake/AWS (for production)
- Databricks workspace (for ML training)

### Local Development

#### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The backend API will be available at `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000`

#### 3. dbt Setup (Optional)

```bash
cd dbt-project
pip install dbt-bigquery  # or dbt-snowflake, dbt-redshift
# Configure profiles.yml with your credentials
dbt deps
dbt run
```

#### 4. ML Pipeline Setup (Optional)

```bash
cd ml-pipeline
pip install -r requirements.txt
# Configure Databricks and MLflow settings
python scripts/train_model.py
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MLflow UI: `http://localhost:5001`

## 📊 API Endpoints

### Stock Endpoints

- `GET /api/stocks` - List all S&P 500 stocks
- `GET /api/stocks/search?q=QUERY` - Search stocks by symbol or name
- `GET /api/stocks/:symbol` - Get detailed stock information
- `GET /api/stocks/:symbol/metrics` - Get financial metrics
- `GET /api/stocks/:symbol/recommendation` - Get AI recommendation
- `GET /api/stocks/:symbol/history?days=90` - Get price history

### System Endpoints

- `GET /health` - Health check
- `GET /api` - API documentation

## 🤖 Machine Learning Model

### Features Used

**Financial Metrics:**
- Profitability: ROE, ROA, Gross/Operating/Net Margins
- Valuation: P/E Ratio, P/B Ratio
- Financial Health: Debt-to-Equity, Current Ratio, Quick Ratio
- Growth: Revenue Growth, Earnings Growth, FCF Margin

**Technical Indicators:**
- Price Momentum: 5-day, 20-day, 60-day returns
- Moving Averages: SMA 20, SMA 50
- Volatility: 20-day standard deviation

### Model Architecture

The system trains multiple models and selects the best performer:
- **Random Forest**: Ensemble of decision trees
- **Gradient Boosting**: Sequential boosting algorithm
- **XGBoost**: Extreme gradient boosting
- **LightGBM**: Light gradient boosting machine

### Recommendation Logic

**BUY (Score ≥ 65):**
- Strong profitability and growth
- Reasonable valuation
- Good financial health

**HOLD (Score 40-64):**
- Moderate performance across metrics
- Some concerns but overall stable

**AVOID (Score < 40):**
- Weak fundamentals
- High risk indicators
- Poor growth prospects

## 🔐 Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development

# Data Warehouse (choose one)
GCP_PROJECT_ID=your-project
SNOWFLAKE_ACCOUNT=your-account
AWS_REGION=us-east-1

# Databricks
DATABRICKS_HOST=your-host
DATABRICKS_TOKEN=your-token

# MLflow
MLFLOW_TRACKING_URI=http://localhost:5000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Cloud Provider Setup

#### BigQuery
1. Create a GCP project
2. Enable BigQuery API
3. Create a dataset
4. Configure dbt profile with credentials

#### Snowflake
1. Create a Snowflake account
2. Create a warehouse and database
3. Configure dbt profile with credentials

#### AWS Redshift
1. Create a Redshift cluster
2. Configure security groups
3. Configure dbt profile with credentials

#### Databricks
1. Create a Databricks workspace
2. Create a cluster
3. Install required libraries
4. Configure MLflow experiment

## 📈 Data Pipeline

### dbt Models

**Staging Layer:**
- `stg_stock_prices`: Cleaned stock price data
- `stg_fundamentals`: Cleaned fundamental data

**Finance Marts:**
- `financial_metrics`: Calculated financial ratios

**Feature Marts:**
- `ml_features`: ML-ready feature table

### Running dbt

```bash
# Run all models
dbt run

# Run specific model
dbt run --select financial_metrics

# Test data quality
dbt test

# Generate documentation
dbt docs generate
dbt docs serve
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 License

This project is for educational purposes only and should not be used as financial advice.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or issues, please open a GitHub issue.

## ⚠️ Disclaimer

**This application is for educational and demonstration purposes only. It does not provide financial advice. Always consult with qualified financial advisors before making investment decisions.**

---

Built with ❤️ by the SP500-Lab team