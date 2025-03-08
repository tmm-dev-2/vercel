import { clickhouse } from '../../db/clients';
import { TVWebSocket } from '../tradingview/websocket';
import { MarketTick } from '../types';

export class LiveDataStream {
  private ws: TVWebSocket;
  private batchSize = 1000;
  private tickBuffer: MarketTick[] = [];
  private flushInterval: NodeJS.Timeout;

  constructor() {
    this.ws = new TVWebSocket();
    this.flushInterval = setInterval(() => this.flushBuffer(), 1000);
  }

  async startStreaming(): Promise<void> {
    await this.ws.connect();
    console.log('🔄 Live streaming started');
  }

  private async flushBuffer(): Promise<void> {
    if (this.tickBuffer.length === 0) return;

    const batchToInsert = [...this.tickBuffer];
    this.tickBuffer = [];

    try {
      await clickhouse.insert({
        table: 'market_ticks',
        values: batchToInsert,
        format: 'JSONEachRow'
      });
    } catch (error) {
      console.error('Error inserting batch:', error);
      this.tickBuffer = [...batchToInsert, ...this.tickBuffer];
    }
  }

  stop(): void {
    clearInterval(this.flushInterval);
    this.ws.disconnect();
  }
}
