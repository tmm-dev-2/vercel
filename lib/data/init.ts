import { clickhouse } from '../db/clients';

export async function initializeDatabase() {
  // Create the database
  await clickhouse.query({
    query: `CREATE DATABASE IF NOT EXISTS market_data`
  });

  // Create NSE AXISBANK table
  await clickhouse.query({
    query: `
      CREATE TABLE IF NOT EXISTS market_data.nse_axisbank_ticks (
        timestamp DateTime64(3),
        open Float64,
        high Float64,
        low Float64,
        close Float64,
        volume Float64
      )
      ENGINE = MergeTree
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY timestamp
      SETTINGS index_granularity = 8192
    `
  });

  // Create materialized view for 1-minute aggregation
  await clickhouse.query({
    query: `
      CREATE MATERIALIZED VIEW IF NOT EXISTS market_data.nse_axisbank_1m
      ENGINE = AggregatingMergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY timestamp
      AS SELECT
        toStartOfMinute(timestamp) as timestamp,
        argMinState(open, timestamp) as open,
        max(high) as high,
        min(low) as low,
        argMaxState(close, timestamp) as close,
        sum(volume) as volume
      FROM market_data.nse_axisbank_ticks
      GROUP BY timestamp
    `
  });

  // Create persistent queue table for recovery
  await clickhouse.query({
    query: `
      CREATE TABLE IF NOT EXISTS market_data.data_collection_queue (
        symbol String,
        last_timestamp DateTime64(3),
        status String
      ) ENGINE = ReplacingMergeTree
      ORDER BY symbol
    `
  });
}
