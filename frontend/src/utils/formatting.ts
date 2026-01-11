export const formatCurrency = (value: number): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getRecommendationColor = (recommendation: 'BUY' | 'HOLD' | 'AVOID'): string => {
  switch (recommendation) {
    case 'BUY':
      return '#22c55e';
    case 'HOLD':
      return '#f59e0b';
    case 'AVOID':
      return '#ef4444';
  }
};

export const getChangeColor = (change: number): string => {
  return change >= 0 ? '#22c55e' : '#ef4444';
};
