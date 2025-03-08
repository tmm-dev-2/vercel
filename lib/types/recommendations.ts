export interface SymbolRecommendation {
  symbol: string;
  name: string;
  exchange: string;
  type: 'stock' | 'crypto' | 'forex' | 'futures';
  category: string;
  sector?: string;
  popularity: number;
}

export interface RecentSymbol extends SymbolRecommendation {
  lastViewed: Date;
}
