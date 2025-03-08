import { WebSocket } from 'ws'
import { RateLimiter } from './rate-limiter'

export class ConnectionPool {
  private pool = new Map<string, WebSocket>()
  private rateLimiter = new RateLimiter()
  
  async addConnection(clientId: string, ws: WebSocket) {
    if (!this.rateLimiter.canProcess(clientId)) {
      throw new Error('Rate limit exceeded')
    }
    this.pool.set(clientId, ws)
  }

  async removeConnection(clientId: string) {
    const ws = this.pool.get(clientId)
    if (ws) {
      ws.close()
      this.pool.delete(clientId)
    }
  }

  getConnection(clientId: string): WebSocket | undefined {
    return this.pool.get(clientId)
  }

  getActiveConnections(): number {
    return this.pool.size
  }
}
