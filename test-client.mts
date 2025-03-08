import WebSocket from 'ws';
import { MarketDataRequest } from './lib/websocket-api/types';

const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', () => {
  const subscribeMessage: MarketDataRequest = {
    type: 'subscribe',
    symbol: 'TSLA'
  };
  ws.send(JSON.stringify(subscribeMessage));
});

ws.addEventListener('message', (event: { data: string }) => {
  console.log('Received market data:', JSON.parse(event.data));
});

ws.addEventListener('close', () => {
  console.log('Connection closed');
});
