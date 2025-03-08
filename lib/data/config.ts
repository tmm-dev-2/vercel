import dotenv from 'dotenv'
dotenv.config()
export const DATA_SOURCES = {
  tradingview: {
    symbols: {
      stocks: ['NASDAQ:AAPL', 'NYSE:GOOGL', 'NYSE:MSFT', 'NYSE:META', 'NASDAQ:NVDA'],
      futures: ['CME_MINI:ES1!', 'CME:NQ1!', 'CME:CL1!', 'CME:GC1!'],
      forex: ['FX:EURUSD', 'FX:GBPUSD', 'FX:USDJPY', 'FX:AUDUSD'],
      crypto: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:SOLUSDT']
    },
    interval: '1s'
  }
}  