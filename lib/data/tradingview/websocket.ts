import WebSocket from 'ws';
import { MarketTick } from '../types';
import { ENV } from '../../config/env';

interface TVMessagePayload {
  symbol: string;
  price: number;
  volume: number;
  timestamp: string;
}

interface TVMessage {
  type: string;
  payload: TVMessagePayload;
}

export class TVWebSocket {
  private ws!: WebSocket;
  private tickCallback?: (tick: MarketTick) => void;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    this.ws = new WebSocket('wss://data.tradingview.com/socket.io/websocket');
  }

  async connect(): Promise<void> {
    this.ws.addEventListener('open', () => {
      this.subscribeToAllSymbols();
      console.log('Connected to TradingView data feed');
    });

    this.ws.addEventListener('message', (event: { data: Buffer }) => {
      const message: TVMessage = JSON.parse(event.data.toString());
      this.handleMessage(message);
    });

    this.ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      this.reconnect();
    });

    this.ws.addEventListener('close', () => {
      console.log('WebSocket closed, attempting to reconnect...');
      this.reconnect();
    });
  }

  private async reconnect(): Promise<void> {
    setTimeout(() => {
      this.initializeWebSocket();
      this.connect();
    }, 5000);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  onTick(callback: (tick: MarketTick) => void): void {
    this.tickCallback = callback;
  }

  private handleMessage(message: TVMessage): void {
    if (message.type === 'price_update' && this.tickCallback) {
      this.tickCallback({
        symbol: message.payload.symbol,
        price: message.payload.price,
        volume: message.payload.volume,
        timestamp: new Date().toISOString()
      });
    }
  }

  private subscribeToAllSymbols(): void {
    Object.values(ENV.markets.symbols).flat().forEach(symbol => {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        symbol
      }));
    });
  }
}
