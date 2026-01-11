export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface StockMetrics {
  symbol: string;
  peRatio: number;
  pbRatio: number;
  debtToEquity: number;
  roe: number;
  roa: number;
  currentRatio: number;
  quickRatio: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  revenueGrowth: number;
  earningsGrowth: number;
  freeCashFlow: number;
  dividendYield: number;
  payoutRatio: number;
}

export interface StockPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type RecommendationType = 'BUY' | 'HOLD' | 'AVOID';

export interface Recommendation {
  symbol: string;
  recommendation: RecommendationType;
  confidence: number;
  score: number;
  factors: RecommendationFactor[];
  generatedAt: string;
  modelVersion: string;
}

export interface RecommendationFactor {
  name: string;
  category: 'valuation' | 'profitability' | 'growth' | 'financial_health' | 'momentum';
  value: number;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

export interface StockDetail {
  stock: Stock;
  metrics: StockMetrics;
  recommendation: Recommendation;
  priceHistory: StockPrice[];
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}
