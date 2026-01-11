import { Stock, StockMetrics, StockPrice, Recommendation, RecommendationType, RecommendationFactor } from '../types';

// Mock data for S&P 500 stocks
export class StockService {
  private static stocks: Stock[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      marketCap: 3000000000000,
      price: 185.50,
      change: 2.35,
      changePercent: 1.28,
      volume: 52000000
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      industry: 'Software',
      marketCap: 2800000000000,
      price: 375.20,
      change: -1.50,
      changePercent: -0.40,
      volume: 23000000
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Technology',
      industry: 'Internet',
      marketCap: 1700000000000,
      price: 140.80,
      change: 3.20,
      changePercent: 2.33,
      volume: 28000000
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      sector: 'Consumer Cyclical',
      industry: 'E-commerce',
      marketCap: 1600000000000,
      price: 155.30,
      change: 1.80,
      changePercent: 1.17,
      volume: 45000000
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      sector: 'Technology',
      industry: 'Semiconductors',
      marketCap: 1200000000000,
      price: 495.00,
      change: 15.50,
      changePercent: 3.23,
      volume: 38000000
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      sector: 'Consumer Cyclical',
      industry: 'Auto Manufacturers',
      marketCap: 800000000000,
      price: 245.75,
      change: -5.25,
      changePercent: -2.09,
      volume: 125000000
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      sector: 'Financial',
      industry: 'Banking',
      marketCap: 550000000000,
      price: 185.50,
      change: 0.75,
      changePercent: 0.41,
      volume: 12000000
    },
    {
      symbol: 'V',
      name: 'Visa Inc.',
      sector: 'Financial',
      industry: 'Credit Services',
      marketCap: 520000000000,
      price: 265.30,
      change: 2.10,
      changePercent: 0.80,
      volume: 7500000
    }
  ];

  static getAllStocks(): Stock[] {
    return this.stocks;
  }

  static getStockBySymbol(symbol: string): Stock | undefined {
    return this.stocks.find(s => s.symbol === symbol);
  }

  static searchStocks(query: string): Stock[] {
    const lowerQuery = query.toLowerCase();
    return this.stocks.filter(s => 
      s.symbol.toLowerCase().includes(lowerQuery) ||
      s.name.toLowerCase().includes(lowerQuery)
    );
  }

  static getStockMetrics(symbol: string): StockMetrics | undefined {
    const metrics: Record<string, StockMetrics> = {
      'AAPL': {
        symbol: 'AAPL',
        peRatio: 29.5,
        pbRatio: 45.2,
        debtToEquity: 1.73,
        roe: 147.5,
        roa: 28.3,
        currentRatio: 0.98,
        quickRatio: 0.85,
        grossMargin: 44.1,
        operatingMargin: 30.5,
        netMargin: 25.3,
        revenueGrowth: 8.2,
        earningsGrowth: 13.5,
        freeCashFlow: 99800000000,
        dividendYield: 0.52,
        payoutRatio: 15.2
      },
      'MSFT': {
        symbol: 'MSFT',
        peRatio: 34.2,
        pbRatio: 12.8,
        debtToEquity: 0.42,
        roe: 40.8,
        roa: 18.5,
        currentRatio: 1.77,
        quickRatio: 1.68,
        grossMargin: 69.2,
        operatingMargin: 42.1,
        netMargin: 36.7,
        revenueGrowth: 12.8,
        earningsGrowth: 18.2,
        freeCashFlow: 73500000000,
        dividendYield: 0.78,
        payoutRatio: 28.5
      },
      'GOOGL': {
        symbol: 'GOOGL',
        peRatio: 25.3,
        pbRatio: 6.2,
        debtToEquity: 0.11,
        roe: 28.5,
        roa: 19.2,
        currentRatio: 2.45,
        quickRatio: 2.38,
        grossMargin: 56.9,
        operatingMargin: 28.4,
        netMargin: 23.1,
        revenueGrowth: 10.5,
        earningsGrowth: 15.8,
        freeCashFlow: 69300000000,
        dividendYield: 0.0,
        payoutRatio: 0.0
      },
      'AMZN': {
        symbol: 'AMZN',
        peRatio: 52.8,
        pbRatio: 8.3,
        debtToEquity: 0.57,
        roe: 15.2,
        roa: 6.8,
        currentRatio: 1.09,
        quickRatio: 0.82,
        grossMargin: 47.8,
        operatingMargin: 5.3,
        netMargin: 4.8,
        revenueGrowth: 11.2,
        earningsGrowth: 28.5,
        freeCashFlow: 21400000000,
        dividendYield: 0.0,
        payoutRatio: 0.0
      },
      'NVDA': {
        symbol: 'NVDA',
        peRatio: 95.2,
        pbRatio: 48.5,
        debtToEquity: 0.35,
        roe: 78.5,
        roa: 42.3,
        currentRatio: 4.12,
        quickRatio: 3.85,
        grossMargin: 72.1,
        operatingMargin: 48.2,
        netMargin: 49.5,
        revenueGrowth: 125.8,
        earningsGrowth: 185.2,
        freeCashFlow: 28700000000,
        dividendYield: 0.03,
        payoutRatio: 1.2
      },
      'TSLA': {
        symbol: 'TSLA',
        peRatio: 68.5,
        pbRatio: 12.8,
        debtToEquity: 0.15,
        roe: 25.8,
        roa: 12.5,
        currentRatio: 1.73,
        quickRatio: 1.18,
        grossMargin: 25.6,
        operatingMargin: 16.8,
        netMargin: 15.5,
        revenueGrowth: 18.8,
        earningsGrowth: 35.2,
        freeCashFlow: 4400000000,
        dividendYield: 0.0,
        payoutRatio: 0.0
      },
      'JPM': {
        symbol: 'JPM',
        peRatio: 11.2,
        pbRatio: 1.68,
        debtToEquity: 1.25,
        roe: 15.8,
        roa: 1.25,
        currentRatio: 0.95,
        quickRatio: 0.92,
        grossMargin: 0.0,
        operatingMargin: 38.5,
        netMargin: 32.8,
        revenueGrowth: 8.5,
        earningsGrowth: 12.2,
        freeCashFlow: 45600000000,
        dividendYield: 2.45,
        payoutRatio: 28.5
      },
      'V': {
        symbol: 'V',
        peRatio: 31.5,
        pbRatio: 14.2,
        debtToEquity: 0.62,
        roe: 45.2,
        roa: 18.5,
        currentRatio: 1.42,
        quickRatio: 1.38,
        grossMargin: 98.5,
        operatingMargin: 67.8,
        netMargin: 51.2,
        revenueGrowth: 10.2,
        earningsGrowth: 14.8,
        freeCashFlow: 18500000000,
        dividendYield: 0.75,
        payoutRatio: 22.5
      }
    };

    return metrics[symbol];
  }

  static getPriceHistory(symbol: string, days: number = 90): StockPrice[] {
    const history: StockPrice[] = [];
    const today = new Date();
    const stock = this.getStockBySymbol(symbol);
    
    if (!stock) return [];

    let basePrice = stock.price;

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const volatility = 0.02;
      const trend = -0.0003 * i;
      const randomChange = (Math.random() - 0.5) * volatility;
      const dailyChange = trend + randomChange;
      
      basePrice = basePrice * (1 + dailyChange);
      
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.01);
      const close = basePrice;
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = stock.volume * (0.8 + Math.random() * 0.4);

      history.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.round(volume)
      });
    }

    return history;
  }

  static getRecommendation(symbol: string): Recommendation | undefined {
    const metrics = this.getStockMetrics(symbol);
    if (!metrics) return undefined;

    const factors = this.calculateRecommendationFactors(metrics);
    const score = this.calculateScore(factors);
    const recommendation = this.determineRecommendation(score);
    const confidence = this.calculateConfidence(factors);

    return {
      symbol,
      recommendation,
      confidence,
      score,
      factors,
      generatedAt: new Date().toISOString(),
      modelVersion: '1.0.0'
    };
  }

  private static calculateRecommendationFactors(metrics: StockMetrics): RecommendationFactor[] {
    const factors: RecommendationFactor[] = [];

    // Valuation factors
    if (metrics.peRatio < 25) {
      factors.push({
        name: 'P/E Ratio',
        category: 'valuation',
        value: metrics.peRatio,
        weight: 0.15,
        impact: 'positive',
        explanation: `P/E ratio of ${metrics.peRatio.toFixed(1)} indicates reasonable valuation`
      });
    } else if (metrics.peRatio > 50) {
      factors.push({
        name: 'P/E Ratio',
        category: 'valuation',
        value: metrics.peRatio,
        weight: 0.15,
        impact: 'negative',
        explanation: `P/E ratio of ${metrics.peRatio.toFixed(1)} suggests stock may be overvalued`
      });
    } else {
      factors.push({
        name: 'P/E Ratio',
        category: 'valuation',
        value: metrics.peRatio,
        weight: 0.15,
        impact: 'neutral',
        explanation: `P/E ratio of ${metrics.peRatio.toFixed(1)} is within normal range`
      });
    }

    // Profitability factors
    if (metrics.roe > 20) {
      factors.push({
        name: 'Return on Equity',
        category: 'profitability',
        value: metrics.roe,
        weight: 0.12,
        impact: 'positive',
        explanation: `Strong ROE of ${metrics.roe.toFixed(1)}% demonstrates excellent profitability`
      });
    } else if (metrics.roe < 10) {
      factors.push({
        name: 'Return on Equity',
        category: 'profitability',
        value: metrics.roe,
        weight: 0.12,
        impact: 'negative',
        explanation: `Low ROE of ${metrics.roe.toFixed(1)}% indicates weak profitability`
      });
    } else {
      factors.push({
        name: 'Return on Equity',
        category: 'profitability',
        value: metrics.roe,
        weight: 0.12,
        impact: 'neutral',
        explanation: `Moderate ROE of ${metrics.roe.toFixed(1)}%`
      });
    }

    // Operating margin
    if (metrics.operatingMargin > 25) {
      factors.push({
        name: 'Operating Margin',
        category: 'profitability',
        value: metrics.operatingMargin,
        weight: 0.10,
        impact: 'positive',
        explanation: `High operating margin of ${metrics.operatingMargin.toFixed(1)}% shows strong operational efficiency`
      });
    } else if (metrics.operatingMargin < 10) {
      factors.push({
        name: 'Operating Margin',
        category: 'profitability',
        value: metrics.operatingMargin,
        weight: 0.10,
        impact: 'negative',
        explanation: `Low operating margin of ${metrics.operatingMargin.toFixed(1)}% indicates operational challenges`
      });
    } else {
      factors.push({
        name: 'Operating Margin',
        category: 'profitability',
        value: metrics.operatingMargin,
        weight: 0.10,
        impact: 'neutral',
        explanation: `Operating margin of ${metrics.operatingMargin.toFixed(1)}% is moderate`
      });
    }

    // Growth factors
    if (metrics.revenueGrowth > 15) {
      factors.push({
        name: 'Revenue Growth',
        category: 'growth',
        value: metrics.revenueGrowth,
        weight: 0.15,
        impact: 'positive',
        explanation: `Strong revenue growth of ${metrics.revenueGrowth.toFixed(1)}% YoY`
      });
    } else if (metrics.revenueGrowth < 5) {
      factors.push({
        name: 'Revenue Growth',
        category: 'growth',
        value: metrics.revenueGrowth,
        weight: 0.15,
        impact: 'negative',
        explanation: `Weak revenue growth of ${metrics.revenueGrowth.toFixed(1)}% YoY`
      });
    } else {
      factors.push({
        name: 'Revenue Growth',
        category: 'growth',
        value: metrics.revenueGrowth,
        weight: 0.15,
        impact: 'neutral',
        explanation: `Moderate revenue growth of ${metrics.revenueGrowth.toFixed(1)}% YoY`
      });
    }

    // Financial health
    if (metrics.currentRatio > 1.5) {
      factors.push({
        name: 'Current Ratio',
        category: 'financial_health',
        value: metrics.currentRatio,
        weight: 0.08,
        impact: 'positive',
        explanation: `Strong current ratio of ${metrics.currentRatio.toFixed(2)} indicates good liquidity`
      });
    } else if (metrics.currentRatio < 1.0) {
      factors.push({
        name: 'Current Ratio',
        category: 'financial_health',
        value: metrics.currentRatio,
        weight: 0.08,
        impact: 'negative',
        explanation: `Current ratio of ${metrics.currentRatio.toFixed(2)} suggests potential liquidity concerns`
      });
    } else {
      factors.push({
        name: 'Current Ratio',
        category: 'financial_health',
        value: metrics.currentRatio,
        weight: 0.08,
        impact: 'neutral',
        explanation: `Current ratio of ${metrics.currentRatio.toFixed(2)} is adequate`
      });
    }

    // Debt to equity
    if (metrics.debtToEquity < 0.5) {
      factors.push({
        name: 'Debt-to-Equity',
        category: 'financial_health',
        value: metrics.debtToEquity,
        weight: 0.10,
        impact: 'positive',
        explanation: `Low debt-to-equity ratio of ${metrics.debtToEquity.toFixed(2)} shows conservative leverage`
      });
    } else if (metrics.debtToEquity > 2.0) {
      factors.push({
        name: 'Debt-to-Equity',
        category: 'financial_health',
        value: metrics.debtToEquity,
        weight: 0.10,
        impact: 'negative',
        explanation: `High debt-to-equity ratio of ${metrics.debtToEquity.toFixed(2)} indicates elevated financial risk`
      });
    } else {
      factors.push({
        name: 'Debt-to-Equity',
        category: 'financial_health',
        value: metrics.debtToEquity,
        weight: 0.10,
        impact: 'neutral',
        explanation: `Debt-to-equity ratio of ${metrics.debtToEquity.toFixed(2)} is moderate`
      });
    }

    // Free cash flow
    if (metrics.freeCashFlow > 50000000000) {
      factors.push({
        name: 'Free Cash Flow',
        category: 'financial_health',
        value: metrics.freeCashFlow,
        weight: 0.12,
        impact: 'positive',
        explanation: 'Exceptional free cash flow generation'
      });
    } else if (metrics.freeCashFlow < 10000000000) {
      factors.push({
        name: 'Free Cash Flow',
        category: 'financial_health',
        value: metrics.freeCashFlow,
        weight: 0.12,
        impact: 'negative',
        explanation: 'Limited free cash flow generation'
      });
    } else {
      factors.push({
        name: 'Free Cash Flow',
        category: 'financial_health',
        value: metrics.freeCashFlow,
        weight: 0.12,
        impact: 'neutral',
        explanation: 'Moderate free cash flow generation'
      });
    }

    return factors;
  }

  private static calculateScore(factors: RecommendationFactor[]): number {
    let score = 50; // Base score

    factors.forEach(factor => {
      const weightedImpact = factor.weight * 100;
      if (factor.impact === 'positive') {
        score += weightedImpact;
      } else if (factor.impact === 'negative') {
        score -= weightedImpact;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  private static determineRecommendation(score: number): RecommendationType {
    if (score >= 65) return 'BUY';
    if (score >= 40) return 'HOLD';
    return 'AVOID';
  }

  private static calculateConfidence(factors: RecommendationFactor[]): number {
    const positiveCount = factors.filter(f => f.impact === 'positive').length;
    const negativeCount = factors.filter(f => f.impact === 'negative').length;
    const totalCount = factors.length;

    const agreement = Math.abs(positiveCount - negativeCount) / totalCount;
    return Math.round(agreement * 100);
  }
}
