import WebSocket from 'isomorphic-ws';
import { TVSearchResponse } from './types/recommendation-types';

export class TradingViewSocket {
  private ws: WebSocket | null = null;
  private readonly WS_URL = 'wss://symbol-search.tradingview.com/symbol_search';

  async search(query: string): Promise<TVSearchResponse[]> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.WS_URL);
        
        this.ws.onopen = () => {
          if (this.ws) {
            this.ws.send(JSON.stringify({ type: 'search', query }));
          }
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data.toString());
          resolve(data.symbols || []);
          this.ws?.close();
        };

        this.ws.onerror = (error) => {
          reject(error);
          this.ws?.close();
        };

      } catch (error) {
        reject(error);
      }
    });
  }
}
