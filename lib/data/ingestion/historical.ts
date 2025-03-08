import { clickhouse } from '../../db/clients';
import { ENV } from '../../config/env';
import WebSocket from 'ws';
import { TVMessage, TVPayload } from '../types';

export class HistoricalDataIngestion {
  private ws!: WebSocket;
  private batchSize = 10000;
  private dataBuffer: TVPayload[] = [];

  async ingestHistoricalData(fromDate: string, toDate: string) {
    this.ws = new WebSocket('wss://data.tradingview.com/socket.io/websocket');

    this.ws.addEventListener('open', () => {
      this.requestHistoricalData(fromDate, toDate);
    });

    this.ws.addEventListener('message', (event: { data: Buffer }) => {
      const message: TVMessage = JSON.parse(event.data.toString());
      this.handleHistoricalData(message);
    });
  }

  private requestHistoricalData(fromDate: string, toDate: string) {
    Object.values(ENV.markets.symbols).flat().forEach(symbol => {
      this.ws.send(JSON.stringify({
        type: 'history',
        symbol,
        from: fromDate,
        to: toDate
      }));
    });
  }

  private async handleHistoricalData(message: TVMessage) {
    if (message.type === 'history') {
      this.dataBuffer.push(message.payload);
      
      if (this.dataBuffer.length >= this.batchSize) {
        await this.flushBuffer();
      }
    }
  }

  private async flushBuffer() {
    if (this.dataBuffer.length === 0) return;

    const batch = [...this.dataBuffer];
    this.dataBuffer = [];

    await clickhouse.insert({
      table: 'market_ticks',
      values: batch,
      format: 'JSONEachRow'
    });
  }
}
