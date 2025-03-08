import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';
import { IncomingMessage } from 'http';
import { MarketDataRequest } from './types';
import { ErrorHandler } from './error-handler';
import { MarketDataHandler } from './market-data-handler';
import { ConnectionPool } from './connection-pool';

const server = createServer();
const wss = new WebSocketServer({ server });
const marketDataHandler = new MarketDataHandler();
const connectionPool = new ConnectionPool();

wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
  const clientId = req.headers['x-client-id']?.toString() || Math.random().toString();
  
  try {
    await connectionPool.addConnection(clientId, ws);

    ws.addEventListener('message', async (event: MessageEvent) => {
      try {
        const request: MarketDataRequest = JSON.parse(event.data.toString());
        
        switch(request.type) {
          case 'subscribe':
            await marketDataHandler.handleSubscription(clientId, request.symbol);
            break;
          case 'unsubscribe':
            await marketDataHandler.handleUnsubscribe(clientId, request.symbol);
            break;
        }
      } catch (error: unknown) {
        const errorResponse = ErrorHandler.handle({
          name: error instanceof Error ? error.name : 'ConnectionError',
          message: error instanceof Error ? error.message : 'Invalid message format'
        }, clientId);
        ws.send(JSON.stringify(errorResponse));
      }
    });

    ws.addEventListener('close', () => {
      connectionPool.removeConnection(clientId);
    });

  } catch (error: unknown) {
    const errorResponse = ErrorHandler.handle({
      name: error instanceof Error ? error.name : 'ConnectionError',
      message: error instanceof Error ? error.message : 'Connection failed'
    }, clientId);
    ws.send(JSON.stringify(errorResponse));
    ws.close();
  }
});

export { server as wsServer };
