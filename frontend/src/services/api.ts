import axios from 'axios';
import { Stock, StockDetail, APIResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const stockAPI = {
  // Get all stocks
  getAllStocks: async (): Promise<Stock[]> => {
    const response = await axios.get<APIResponse<Stock[]>>(`${API_BASE_URL}/stocks`);
    return response.data.data || [];
  },

  // Search stocks
  searchStocks: async (query: string): Promise<Stock[]> => {
    const response = await axios.get<APIResponse<Stock[]>>(`${API_BASE_URL}/stocks/search`, {
      params: { q: query }
    });
    return response.data.data || [];
  },

  // Get stock details
  getStockDetail: async (symbol: string): Promise<StockDetail> => {
    const response = await axios.get<APIResponse<StockDetail>>(`${API_BASE_URL}/stocks/${symbol}`);
    if (!response.data.data) {
      throw new Error('Stock not found');
    }
    return response.data.data;
  }
};
