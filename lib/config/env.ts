import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
  clickhouse: {
    host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    user: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: 'market_data'
  },
  markets: {
    symbols: {
      stocks: ['NYSE:*', 'NASDAQ:*', 'NSE:*', 'BSE:*'],
      futures: ['CME:*', 'NYMEX:*'],
      forex: ['FX:*'],
      crypto: ['BINANCE:*', 'COINBASE:*']
    }
  }
}
