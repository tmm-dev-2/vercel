import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocket, Server } from 'ws';
import { MarketDataHandler } from './market-data-handler';
import { ConnectionPool } from './connection-pool';
import { MetricsCollector } from './metrics';
import { HealthCheck } from './health-check';
import { CacheManager } from './cache-manager';
import { MarketDataRequest } from './types';
import { ErrorHandler } from './error-handler';

export class APIServer {
  private app = express();
  private server = createServer(this.app);
  private wss = new Server({ server: this.server });
  private marketData = new MarketDataHandler();
  private connections = new ConnectionPool();
  private metrics = new MetricsCollector();
  private health = new HealthCheck();
  private cache = CacheManager.getInstance();

  constructor(private port: number = 8080) {
    this.setupWebSocket();
    this.setupHTTPRoutes();
  }

  private setupWebSocket() {
    this.wss.on('connection', async (ws: WebSocket, request: Request) => {
      const clientId = request.headers['x-client-id']?.toString() || Math.random().toString();
      
      try {
        await this.connections.addConnection(clientId, ws);
        this.metrics.incrementConnections();

        ws.addEventListener('message', async (event: MessageEvent) => {
          const startTime = Date.now();
          try {
            const request: MarketDataRequest = JSON.parse(event.data.toString());
            switch(request.type) {
              case 'subscribe':
                await this.marketData.handleSubscription(clientId, request.symbol);
                break;
              case 'unsubscribe':
                await this.marketData.handleUnsubscribe(clientId, request.symbol);
                break;
            }
          } catch (error: unknown) {
            const errorResponse = ErrorHandler.handle({
              name: error instanceof Error ? error.name : 'SubscriptionError',
              message: error instanceof Error ? error.message : 'Invalid request'
            }, clientId);
            ws.send(JSON.stringify(errorResponse));
          }
          this.metrics.recordLatency(Date.now() - startTime);
        });

        ws.addEventListener('close', async () => {
          await this.connections.removeConnection(clientId);
          this.metrics.decrementConnections();
        });

      } catch (error: unknown) {
        const errorResponse = ErrorHandler.handle({
          name: error instanceof Error ? error.name : 'RateLimitError',
          message: error instanceof Error ? error.message : 'Connection limit exceeded'
        }, clientId);
        ws.send(JSON.stringify(errorResponse));
        ws.close();
      }
    });
  }

  private setupHTTPRoutes() {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json(this.health.checkHealth());
    });

    this.app.get('/metrics', (_req: Request, res: Response) => {
      res.json(this.metrics.getMetrics());
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`WebSocket API server running on port ${this.port}`);
    });
  }
}
