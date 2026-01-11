"""
S&P 500 Stock Recommendation Model Training Script
Uses MLflow for experiment tracking and model registry
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import xgboost as xgb
import lightgbm as lgb
import mlflow
import mlflow.sklearn
import mlflow.xgboost
import mlflow.lightgbm
from datetime import datetime

# Configuration
EXPERIMENT_NAME = "/sp500-recommendation-model"
MODEL_NAME = "sp500_recommendation_model"

class StockRecommendationModel:
    """
    Machine learning model for stock buy/hold/avoid recommendations
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None
        self.feature_names = None
        
    def prepare_features(self, df):
        """
        Prepare features for model training
        """
        feature_columns = [
            'roe', 'roa', 'gross_margin', 'operating_margin', 'net_margin',
            'pe_ratio', 'pb_ratio', 'debt_to_equity', 'current_ratio', 'quick_ratio',
            'revenue_growth', 'earnings_growth', 'fcf_margin',
            'return_5d', 'return_20d', 'return_60d',
            'price_vs_sma20', 'price_vs_sma50', 'volatility_20',
            'profitability_score', 'growth_score', 'financial_health_score', 'valuation_score'
        ]
        
        # Handle missing values
        df_clean = df[feature_columns].fillna(df[feature_columns].median())
        
        # Store feature names
        self.feature_names = feature_columns
        
        return df_clean
    
    def create_labels(self, df):
        """
        Create target labels based on composite scoring
        BUY = 2, HOLD = 1, AVOID = 0
        """
        # Calculate composite score
        df['composite_score'] = (
            df['profitability_score'] * 0.3 +
            df['growth_score'] * 0.25 +
            df['financial_health_score'] * 0.25 +
            df['valuation_score'] * 0.2
        )
        
        # Create labels based on thresholds
        labels = np.where(df['composite_score'] >= 0.75, 2,  # BUY
                 np.where(df['composite_score'] >= 0.50, 1,  # HOLD
                          0))  # AVOID
        
        return labels
    
    def train_random_forest(self, X_train, y_train, params):
        """Train Random Forest model"""
        model = RandomForestClassifier(**params, random_state=42)
        model.fit(X_train, y_train)
        return model
    
    def train_gradient_boosting(self, X_train, y_train, params):
        """Train Gradient Boosting model"""
        model = GradientBoostingClassifier(**params, random_state=42)
        model.fit(X_train, y_train)
        return model
    
    def train_xgboost(self, X_train, y_train, params):
        """Train XGBoost model"""
        model = xgb.XGBClassifier(**params, random_state=42)
        model.fit(X_train, y_train)
        return model
    
    def train_lightgbm(self, X_train, y_train, params):
        """Train LightGBM model"""
        model = lgb.LGBMClassifier(**params, random_state=42)
        model.fit(X_train, y_train)
        return model
    
    def evaluate_model(self, model, X_test, y_test):
        """Evaluate model performance"""
        y_pred = model.predict(X_test)
        
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, average='weighted'),
            'recall': recall_score(y_test, y_pred, average='weighted'),
            'f1_score': f1_score(y_test, y_pred, average='weighted')
        }
        
        return metrics, y_pred
    
    def train_and_log_model(self, df, model_type='random_forest'):
        """
        Train model and log to MLflow
        """
        # Set experiment
        mlflow.set_experiment(EXPERIMENT_NAME)
        
        # Prepare data
        X = self.prepare_features(df)
        y = self.create_labels(df)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Model parameters
        params_map = {
            'random_forest': {
                'n_estimators': 200,
                'max_depth': 15,
                'min_samples_split': 5,
                'min_samples_leaf': 2,
                'max_features': 'sqrt'
            },
            'gradient_boosting': {
                'n_estimators': 200,
                'learning_rate': 0.1,
                'max_depth': 5,
                'min_samples_split': 5,
                'min_samples_leaf': 2
            },
            'xgboost': {
                'n_estimators': 200,
                'learning_rate': 0.1,
                'max_depth': 6,
                'min_child_weight': 1,
                'subsample': 0.8,
                'colsample_bytree': 0.8,
                'objective': 'multi:softmax',
                'num_class': 3
            },
            'lightgbm': {
                'n_estimators': 200,
                'learning_rate': 0.1,
                'max_depth': 6,
                'num_leaves': 31,
                'min_child_samples': 20,
                'objective': 'multiclass',
                'num_class': 3
            }
        }
        
        params = params_map.get(model_type, params_map['random_forest'])
        
        # Start MLflow run
        with mlflow.start_run(run_name=f"{model_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"):
            # Log parameters
            mlflow.log_params(params)
            mlflow.log_param("model_type", model_type)
            mlflow.log_param("train_samples", len(X_train))
            mlflow.log_param("test_samples", len(X_test))
            
            # Train model
            if model_type == 'random_forest':
                model = self.train_random_forest(X_train, y_train, params)
                mlflow.sklearn.log_model(model, "model")
            elif model_type == 'gradient_boosting':
                model = self.train_gradient_boosting(X_train, y_train, params)
                mlflow.sklearn.log_model(model, "model")
            elif model_type == 'xgboost':
                model = self.train_xgboost(X_train, y_train, params)
                mlflow.xgboost.log_model(model, "model")
            elif model_type == 'lightgbm':
                model = self.train_lightgbm(X_train, y_train, params)
                mlflow.lightgbm.log_model(model, "model")
            
            # Evaluate model
            metrics, y_pred = self.evaluate_model(model, X_test, y_test)
            
            # Log metrics
            mlflow.log_metrics(metrics)
            
            # Log feature importance if available
            if hasattr(model, 'feature_importances_'):
                importance_df = pd.DataFrame({
                    'feature': self.feature_names,
                    'importance': model.feature_importances_
                }).sort_values('importance', ascending=False)
                
                importance_df.to_csv('/tmp/feature_importance.csv', index=False)
                mlflow.log_artifact('/tmp/feature_importance.csv')
            
            # Log confusion matrix
            cm = confusion_matrix(y_test, y_pred)
            cm_df = pd.DataFrame(cm, 
                               index=['AVOID', 'HOLD', 'BUY'],
                               columns=['AVOID', 'HOLD', 'BUY'])
            cm_df.to_csv('/tmp/confusion_matrix.csv')
            mlflow.log_artifact('/tmp/confusion_matrix.csv')
            
            # Log tags
            mlflow.set_tags({
                "team": "data-science",
                "project": "sp500-lab",
                "environment": "production"
            })
            
            print(f"\n{model_type.upper()} Model Training Complete!")
            print(f"Accuracy: {metrics['accuracy']:.4f}")
            print(f"Precision: {metrics['precision']:.4f}")
            print(f"Recall: {metrics['recall']:.4f}")
            print(f"F1 Score: {metrics['f1_score']:.4f}")
            
            # Register model if F1 score is high enough
            if metrics['f1_score'] >= 0.75:
                model_uri = f"runs:/{mlflow.active_run().info.run_id}/model"
                mlflow.register_model(model_uri, MODEL_NAME)
                print(f"\nModel registered: {MODEL_NAME}")
            
            return model, metrics


def main():
    """
    Main training pipeline
    """
    print("=" * 60)
    print("S&P 500 Stock Recommendation Model Training")
    print("=" * 60)
    
    # Load features from data warehouse
    # In production, this would query BigQuery/Snowflake/AWS
    # For demo, we'll create synthetic data
    print("\nLoading training data...")
    
    # This is a placeholder - in production, load from dbt models
    # df = spark.sql("SELECT * FROM sp500_analytics.ml_features")
    
    # Train models
    trainer = StockRecommendationModel()
    
    # Note: In production, uncomment and use real data
    # for model_type in ['random_forest', 'gradient_boosting', 'xgboost', 'lightgbm']:
    #     print(f"\n{'=' * 60}")
    #     print(f"Training {model_type.upper()} model...")
    #     print(f"{'=' * 60}")
    #     model, metrics = trainer.train_and_log_model(df, model_type)
    
    print("\n" + "=" * 60)
    print("Training pipeline complete!")
    print("Check MLflow UI for experiment results")
    print("=" * 60)


if __name__ == "__main__":
    main()
