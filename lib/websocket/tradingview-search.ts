import { TVSearchResponse } from './types/recommendation-types';

export class TradingViewSocket {
  private readonly SEARCH_URL = 'http://localhost:5000/search';

  async search(query: string): Promise<TVSearchResponse[]> {
    if (!query) return [];

    try {
      const response = await fetch(`${this.SEARCH_URL}?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Symbol search failed:', error);
      return [];
    }
  }
}