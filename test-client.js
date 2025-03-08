import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', () => {
  const subscribeMessage = {
    type: 'subscribe',
    symbol: 'TSLA'
  };
  ws.send(JSON.stringify(subscribeMessage));
});

ws.addEventListener('message', (event) => {
  console.log('Received market data:', JSON.parse(event.data));
});

ws.addEventListener('close', () => {
  console.log('Connection closed');
});
