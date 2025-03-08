type DataSourceConfig = {
    [key: string]: {
      [provider: string]: {
        apiKey?: string;
        endpoint?: string;
        wsEndpoint?: string;
        restEndpoint?: string;
      }
    }
  }
  
  export const DATA_SOURCES: DataSourceConfig = {
    stocks: {
      polygon: {
        apiKey: process.env.POLYGON_API_KEY!,
        endpoint: 'https://api.polygon.io/v2/aggs/ticker'
      },
      alpaca: {
        apiKey: process.env.ALPACA_API_KEY!,
        endpoint: 'https://data.alpaca.markets/v2'
      }
    },
    crypto: {
      binance: {
        wsEndpoint: 'wss://stream.binance.com:9443/ws',
        restEndpoint: 'https://api.binance.com/api/v3',
        endpoint: 'https://api.binance.com/api/v3'
      },
      coinbase: {
        wsEndpoint: 'wss://ws-feed.pro.coinbase.com',
        restEndpoint: 'https://api.pro.coinbase.com',
        endpoint: 'https://api.pro.coinbase.com'
      }
    }
  }
  