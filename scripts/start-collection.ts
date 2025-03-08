import { startDataPipeline } from '../lib/data';
import { clickhouse } from '../lib/db/clients';

async function init() {
  console.log('Initializing market data collection...');
  
  try {
    await clickhouse.ping();
    console.log('✅ Connected to ClickHouse');
    
    await startDataPipeline();
    console.log('✨ Pipeline running successfully!');
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
}

async function cleanup() {
  console.log('Shutting down...');
  process.exit(0);
}

init();
