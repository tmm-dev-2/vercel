import { APIServer } from './lib/websocket-api/api-server';

const server = new APIServer(8080);
server.start();
