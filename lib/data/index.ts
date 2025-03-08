import { LiveDataStream } from './streaming/live';
import { clickhouse } from '../db/clients';

export async function startDataPipeline() {
  // Initialize ClickHouse table
  await clickhouse.query({
    query: `
      CREATE TABLE IF NOT EXISTS market_ticks (
        symbol String,
        price Float64,
        volume Float64,
        timestamp DateTime64(3)
      )
      ENGINE = MergeTree
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (symbol, timestamp)
    `
  });

  // Start live data collection
  const live = new LiveDataStream();
  await live.startStreaming();
}
