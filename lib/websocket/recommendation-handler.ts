import { SymbolRecommendation, RecentSymbol, TVSearchResponse } from './types/recommendation-types';
import { TradingViewSocket } from './tradingview-search';

export class RecommendationHandler {
  private static instance: RecommendationHandler;
  private tvSocket: TradingViewSocket;
  private recentSymbols: RecentSymbol[] = [];
  private readonly MAX_RECENT_SYMBOLS = 5;

  private defaultRecommendations: Record<string, SymbolRecommendation[]> = {
    'Popular Stocks': [
      { symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE', type: 'stock', category: 'Large Cap', popularity: 100 },
      { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', type: 'stock', category: 'IT', popularity: 98 }
    ],
    'Crypto': [
      { symbol: 'BTCUSDT', name: 'Bitcoin', exchange: 'BINANCE', type: 'crypto', category: 'Cryptocurrency', popularity: 100 },
      { symbol: 'ETHUSDT', name: 'Ethereum', exchange: 'BINANCE', type: 'crypto', category: 'Cryptocurrency', popularity: 95 }
    ],
    'Forex': [
      { symbol: 'EURUSD', name: 'EUR/USD', exchange: 'FOREX', type: 'forex', category: 'Major Pairs', popularity: 100 },
      { symbol: 'GBPUSD', name: 'GBP/USD', exchange: 'FOREX', type: 'forex', category: 'Major Pairs', popularity: 95 }
    ]
  };

  private constructor() {
    this.tvSocket = new TradingViewSocket();
  }

  static getInstance(): RecommendationHandler {
    if (!this.instance) {
      this.instance = new RecommendationHandler();
    }
    return this.instance;
  }

  private transformTVResponse(response: TVSearchResponse): SymbolRecommendation {
    return {
      symbol: response.symbol,
      name: response.description,
      exchange: response.exchange,
      type: this.getSymbolType(response.type),
      category: this.getCategory(response.type),
      popularity: 50
    };
  }

  private getSymbolType(type: string): SymbolRecommendation['type'] {
    const typeMap: Record<string, SymbolRecommendation['type']> = {
      stock: 'stock',
      crypto: 'crypto',
      forex: 'forex',
      futures: 'futures',
      index: 'index'
    };
    return typeMap[type?.toLowerCase()] || 'stock';
  }

  private getCategory(type: string): string {
    const categoryMap: Record<string, string> = {
      stock: 'Stocks',
      crypto: 'Cryptocurrency',
      forex: 'Forex Pairs',
      futures: 'Futures',
      index: 'Indices'
    };
    return categoryMap[type?.toLowerCase()] || 'Other';
  }

  addRecentSymbol(symbol: SymbolRecommendation) {
    this.recentSymbols = [
      { ...symbol, lastViewed: new Date() },
      ...this.recentSymbols.filter(s => s.symbol !== symbol.symbol)
    ].slice(0, this.MAX_RECENT_SYMBOLS);
  }

  async getRecommendations(query: string): Promise<Record<string, SymbolRecommendation[]>> {
    const results: Record<string, SymbolRecommendation[]> = {};

    if (this.recentSymbols.length) {
      results['Recent'] = this.recentSymbols;
    }

    if (!query) {
      return { ...results, ...this.defaultRecommendations };
    }

    try {
      console.log('Fetching TV results for:', query);
      const tvResults = await this.tvSocket.search(query);
      console.log('TV API Response:', tvResults);
      
      const resultsArray = Array.isArray(tvResults) ? tvResults : [];
      const transformedResults = resultsArray.map(r => this.transformTVResponse(r));
      
      console.log('Transformed Results:', transformedResults);
      return {
        ...results,
        ...this.categorizeResults(transformedResults)
      };
    } catch (error) {
      console.error('Search error:', error);
      return this.searchLocalResults(query);
    }
  }

  private categorizeResults(symbols: SymbolRecommendation[]): Record<string, SymbolRecommendation[]> {
    return symbols.reduce((acc, symbol) => {
      const category = this.getCategory(symbol.type);
      if (!acc[category]) acc[category] = [];
      acc[category].push(symbol);
      return acc;
    }, {} as Record<string, SymbolRecommendation[]>);
  }

  private searchLocalResults(query: string): Record<string, SymbolRecommendation[]> {
    const lowerQuery = query.toLowerCase();
    return Object.entries(this.defaultRecommendations).reduce((acc, [category, symbols]) => {
      const matches = symbols.filter(s => 
        s.symbol.toLowerCase().includes(lowerQuery) ||
        s.name.toLowerCase().includes(lowerQuery)
      );
      if (matches.length) acc[category] = matches;
      return acc;
    }, {} as Record<string, SymbolRecommendation[]>);
  }
}
