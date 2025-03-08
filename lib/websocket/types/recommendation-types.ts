export interface SymbolRecommendation {
    symbol: string;
    name: string;
    exchange: string;
    type: 'stock' | 'crypto' | 'forex' | 'futures' | 'index';
    category: string;
    sector?: string;
    popularity: number;
  }
  
  export interface RecentSymbol extends SymbolRecommendation {
    lastViewed: Date;
  }
  
  export interface TVSearchResponse {
    symbol: string;
    description: string;
    exchange: string;
    type: string;
    prefix?: string;
    provider_id?: string;
  }
  