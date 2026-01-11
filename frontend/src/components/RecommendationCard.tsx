import React from 'react';
import { Recommendation } from '../types';
import { getRecommendationColor, formatPercent } from '../utils/formatting';
import './RecommendationCard.css';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const categoryNames = {
    valuation: 'Valuation',
    profitability: 'Profitability',
    growth: 'Growth',
    financial_health: 'Financial Health',
    momentum: 'Momentum'
  };

  const groupedFactors = recommendation.factors.reduce((acc, factor) => {
    if (!acc[factor.category]) {
      acc[factor.category] = [];
    }
    acc[factor.category].push(factor);
    return acc;
  }, {} as Record<string, typeof recommendation.factors>);

  return (
    <div className="recommendation-card">
      <div className="recommendation-header">
        <h2>AI Recommendation</h2>
        <div 
          className="recommendation-badge"
          style={{ backgroundColor: getRecommendationColor(recommendation.recommendation) }}
        >
          {recommendation.recommendation}
        </div>
      </div>

      <div className="recommendation-metrics">
        <div className="metric">
          <div className="metric-label">Confidence</div>
          <div className="metric-value">{recommendation.confidence}%</div>
        </div>
        <div className="metric">
          <div className="metric-label">Score</div>
          <div className="metric-value">{recommendation.score.toFixed(1)}/100</div>
        </div>
        <div className="metric">
          <div className="metric-label">Model Version</div>
          <div className="metric-value">{recommendation.modelVersion}</div>
        </div>
      </div>

      <div className="factors-section">
        <h3>Analysis Factors</h3>
        {Object.entries(groupedFactors).map(([category, factors]) => (
          <div key={category} className="factor-category">
            <h4>{categoryNames[category as keyof typeof categoryNames]}</h4>
            {factors.map((factor, index) => (
              <div key={index} className="factor-item">
                <div className="factor-header">
                  <span className="factor-name">{factor.name}</span>
                  <span 
                    className={`factor-impact impact-${factor.impact}`}
                  >
                    {factor.impact.toUpperCase()}
                  </span>
                </div>
                <p className="factor-explanation">{factor.explanation}</p>
                <div className="factor-details">
                  <span>Value: {typeof factor.value === 'number' ? factor.value.toFixed(2) : factor.value}</span>
                  <span>Weight: {formatPercent(factor.weight * 100, 0)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="recommendation-footer">
        <p className="timestamp">
          Generated at: {new Date(recommendation.generatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;
