import { TVWebSocket } from '../data/tradingview/websocket'

export class ConnectionManager {
  private static connections = new Map<string, TVWebSocket>()
  
  static async getConnection(clientId: string): Promise<TVWebSocket> {
    if (!this.connections.has(clientId)) {
      const connection = new TVWebSocket()
      await connection.connect()
      this.connections.set(clientId, connection)
    }
    return this.connections.get(clientId)!
  }
}
