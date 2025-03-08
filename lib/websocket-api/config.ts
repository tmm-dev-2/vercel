export const CONFIG = {
  server: {
    port: process.env.WS_PORT || 8080,
    host: process.env.WS_HOST || 'localhost'
  },
  websocket: {
    maxConnections: 10000,
    heartbeatInterval: 30000,
    reconnectDelay: 5000
  },
  cache: {
    maxAge: 5 * 60 * 1000,
    maxItemsPerSymbol: 1000
  },
  rateLimit: {
    windowMs: 60000,
    maxRequests: 100
  }
}
