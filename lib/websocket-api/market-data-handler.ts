import { TVWebSocket } from '../data/tradingview/websocket'
import { ConnectionPool } from './connection-pool'

export class MarketDataHandler {
  private tvSocket: TVWebSocket
  private connectionPool: ConnectionPool
  private subscriptions = new Map<string, Set<string>>()

  constructor() {
    this.tvSocket = new TVWebSocket()
    this.connectionPool = new ConnectionPool()
    this.setupTVSocket()
  }

  private setupTVSocket() {
    this.tvSocket.onTick((tick) => {
      const subscribers = this.subscriptions.get(tick.symbol)
      if (subscribers) {
        subscribers.forEach(clientId => {
          const ws = this.connectionPool.getConnection(clientId)
          if (ws) {
            ws.send(JSON.stringify(tick))
          }
        })
      }
    })
  }

  async handleSubscription(clientId: string, symbol: string) {
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set())
      await this.tvSocket.connect()
    }
    this.subscriptions.get(symbol)?.add(clientId)
  }

  async handleUnsubscribe(clientId: string, symbol: string) {
    const subscribers = this.subscriptions.get(symbol)
    if (subscribers) {
      subscribers.delete(clientId)
      if (subscribers.size === 0) {
        this.subscriptions.delete(symbol)
      }
    }
  }
}
