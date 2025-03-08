import { SymbolRecommendation, RecentSymbol } from '../types/recommendations';

export class RecommendationService {
  private static readonly MAX_RECENT_SYMBOLS = 5;
  private static instance: RecommendationService;
  
  private recentSymbols: RecentSymbol[] = [];
  private defaultRecommendations: Record<string, SymbolRecommendation[]> = {
    'Popular Stocks': [
      { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'stock', category: 'Technology', popularity: 100 },
      { symbol: 'MSFT', name: 'Microsoft', exchange: 'NASDAQ', type: 'stock', category: 'Technology', popularity: 95 },
    ],
    'Trending Crypto': [
      { symbol: 'BTCUSDT', name: 'Bitcoin', exchange: 'BINANCE', type: 'crypto', category: 'Cryptocurrency', popularity: 100 },
      { symbol: 'ETHUSDT', name: 'Ethereum', exchange: 'BINANCE', type: 'crypto', category: 'Cryptocurrency', popularity: 90 },
    ],
    'Major Forex': [
      { symbol: 'EURUSD', name: 'Euro/USD', exchange: 'FOREX', type: 'forex', category: 'Currency Pairs', popularity: 100 },
      { symbol: 'GBPUSD', name: 'GBP/USD', exchange: 'FOREX', type: 'forex', category: 'Currency Pairs', popularity: 85 },
    ]
  };

  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  addRecentSymbol(symbol: SymbolRecommendation) {
    this.recentSymbols = [
      { ...symbol, lastViewed: new Date() },
      ...this.recentSymbols.filter(s => s.symbol !== symbol.symbol)
    ].slice(0, RecommendationService.MAX_RECENT_SYMBOLS);
  }

  getRecommendations(query: string): Record<string, SymbolRecommendation[]> {
    if (!query) {
      return {
        'Recent Symbols': this.recentSymbols,
        ...this.defaultRecommendations
      };
    }

    const results: Record<string, SymbolRecommendation[]> = {};
    const lowerQuery = query.toLowerCase();

    // Search in recent symbols first
    const matchingRecent = this.recentSymbols.filter(s => 
      s.symbol.toLowerCase().includes(lowerQuery) ||
      s.name.toLowerCase().includes(lowerQuery)
    );
    if (matchingRecent.length) {
      results['Recent Symbols'] = matchingRecent;
    }

    // Search in each category
    Object.entries(this.defaultRecommendations).forEach(([category, symbols]) => {
      const matches = symbols.filter(s =>
        s.symbol.toLowerCase().includes(lowerQuery) ||
        s.name.toLowerCase().includes(lowerQuery)
      );
      if (matches.length) {
        results[category] = matches;
      }
    });

    return results;
  }
}
