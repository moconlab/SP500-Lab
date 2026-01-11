# ML Model Documentation

## Overview

The SP500-Lab uses machine learning to generate Buy/Hold/Avoid recommendations for S&P 500 stocks. The model is trained on historical financial data and technical indicators.

## Model Architecture

### Ensemble Approach

We train multiple models and select the best performer:

1. **Random Forest** - Ensemble of decision trees
2. **Gradient Boosting** - Sequential boosting
3. **XGBoost** - Extreme gradient boosting
4. **LightGBM** - Fast gradient boosting

### Model Selection Criteria

- F1 Score ≥ 0.75
- Balanced precision and recall
- Consistent performance across sectors
- Interpretability of predictions

## Features

### Financial Metrics (13 features)

**Profitability:**
- ROE (Return on Equity)
- ROA (Return on Assets)
- Gross Margin
- Operating Margin
- Net Margin

**Valuation:**
- P/E Ratio (Price-to-Earnings)
- P/B Ratio (Price-to-Book)

**Financial Health:**
- Debt-to-Equity Ratio
- Current Ratio
- Quick Ratio

**Growth:**
- Revenue Growth (YoY)
- Earnings Growth (YoY)
- Free Cash Flow Margin

### Technical Indicators (7 features)

**Momentum:**
- 5-day Return
- 20-day Return
- 60-day Return

**Moving Averages:**
- Price vs SMA-20 (%)
- Price vs SMA-50 (%)

**Volatility:**
- 20-day Standard Deviation

### Composite Scores (4 features)

- Profitability Score (0-1)
- Growth Score (0-1)
- Financial Health Score (0-1)
- Valuation Score (0-1)

## Target Variable

**Classes:**
- **BUY (2)**: Strong fundamentals, growth potential
- **HOLD (1)**: Moderate performance, stable
- **AVOID (0)**: Weak fundamentals, high risk

**Label Generation:**
```python
composite_score = (
    profitability_score * 0.30 +
    growth_score * 0.25 +
    financial_health_score * 0.25 +
    valuation_score * 0.20
)

if composite_score >= 0.75: BUY
elif composite_score >= 0.50: HOLD
else: AVOID
```

## Training Pipeline

### Data Preparation

1. Load features from data warehouse
2. Handle missing values (median imputation)
3. Scale features using StandardScaler
4. Split into train/test (80/20)
5. Stratify by target class

### Hyperparameters

**Random Forest:**
```python
{
    'n_estimators': 200,
    'max_depth': 15,
    'min_samples_split': 5,
    'min_samples_leaf': 2,
    'max_features': 'sqrt'
}
```

**XGBoost:**
```python
{
    'n_estimators': 200,
    'learning_rate': 0.1,
    'max_depth': 6,
    'min_child_weight': 1,
    'subsample': 0.8,
    'colsample_bytree': 0.8
}
```

**LightGBM:**
```python
{
    'n_estimators': 200,
    'learning_rate': 0.1,
    'max_depth': 6,
    'num_leaves': 31,
    'min_child_samples': 20
}
```

### Training Process

1. **Feature Engineering**: Calculate composite scores
2. **Model Training**: Train multiple models
3. **Evaluation**: Calculate metrics on test set
4. **Logging**: Log to MLflow
5. **Registration**: Register best model
6. **Deployment**: Deploy to production

## Evaluation Metrics

### Performance Metrics

- **Accuracy**: Overall correct predictions
- **Precision**: Correct positive predictions / Total positive predictions
- **Recall**: Correct positive predictions / Total actual positives
- **F1 Score**: Harmonic mean of precision and recall

### Confusion Matrix

```
              Predicted
              AVOID  HOLD  BUY
Actual AVOID   [90    5    5]
       HOLD    [10   75   15]
       BUY     [ 5   10   85]
```

### Feature Importance

Top 10 most important features:
1. Profitability Score
2. Growth Score
3. ROE (Return on Equity)
4. Revenue Growth
5. Financial Health Score
6. Operating Margin
7. Earnings Growth
8. Valuation Score
9. P/E Ratio
10. Free Cash Flow Margin

## Inference

### Prediction Process

1. Load production model from MLflow
2. Fetch latest features for stock
3. Preprocess features (scale)
4. Generate prediction
5. Calculate confidence score
6. Create explanation factors

### Confidence Score

```python
confidence = abs(positive_factors - negative_factors) / total_factors * 100
```

### Explainability

Each prediction includes:
- **Factor Name**: Which metric influenced decision
- **Category**: Type of metric (valuation, profitability, etc.)
- **Value**: Current value of the metric
- **Weight**: Importance in decision (0-1)
- **Impact**: Positive, negative, or neutral
- **Explanation**: Human-readable explanation

## MLflow Integration

### Experiment Tracking

```python
with mlflow.start_run():
    # Log parameters
    mlflow.log_params(hyperparameters)
    
    # Log metrics
    mlflow.log_metrics(performance_metrics)
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
    
    # Log artifacts
    mlflow.log_artifact("feature_importance.csv")
    mlflow.log_artifact("confusion_matrix.csv")
```

### Model Registry

```python
# Register model
model_uri = f"runs:/{run_id}/model"
mlflow.register_model(model_uri, "sp500_recommendation_model")

# Transition to production
client.transition_model_version_stage(
    name="sp500_recommendation_model",
    version=1,
    stage="Production"
)
```

## Model Deployment

### Batch Inference

```python
# Load production model
model = mlflow.pyfunc.load_model(
    "models:/sp500_recommendation_model/Production"
)

# Generate predictions
predictions = model.predict(features_df)
```

### Real-time Inference

```python
# Serve model via REST API
mlflow models serve -m "models:/sp500_recommendation_model/Production" -p 5001

# Make predictions
curl -X POST http://localhost:5001/invocations \
  -H 'Content-Type: application/json' \
  -d '{"instances": [feature_vector]}'
```

## Monitoring

### Model Drift Detection

Monitor for:
- Feature distribution changes
- Prediction distribution changes
- Performance degradation
- Data quality issues

### Retraining Schedule

- **Daily**: Update predictions with latest data
- **Weekly**: Evaluate model performance
- **Monthly**: Retrain model if needed
- **Quarterly**: Full model refresh

## Production Considerations

### Data Quality

- Validate input features
- Check for missing values
- Detect outliers
- Monitor data freshness

### Performance

- Prediction latency < 100ms
- Batch processing for multiple stocks
- Caching for frequently accessed predictions
- Model optimization for inference

### Reliability

- Fallback to rule-based system
- Graceful degradation
- Error handling and logging
- Model versioning

## Future Improvements

1. **Deep Learning**: Add LSTM for time series
2. **Alternative Data**: Include sentiment, news
3. **Multi-timeframe**: Short, medium, long-term predictions
4. **Portfolio Optimization**: Combine recommendations
5. **Reinforcement Learning**: Learn from market feedback
