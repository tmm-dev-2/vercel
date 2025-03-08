export interface MarketDataRequest {
  type: 'subscribe' | 'unsubscribe'
  symbol: string
  interval?: string
}

export interface MarketDataResponse {
  symbol: string
  data: {
    price: number
    volume: number
    timestamp: string
  }
}
