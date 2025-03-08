CREATE DATABASE IF NOT EXISTS market_data;

CREATE TABLE IF NOT EXISTS market_data.market_ticks (
    symbol String,
    price Float64,
    volume Float64,
    timestamp DateTime64(3),
    open Nullable(Float64),
    high Nullable(Float64),
    low Nullable(Float64),
    close Nullable(Float64)
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(timestamp)
ORDER BY (symbol, timestamp)
SETTINGS index_granularity = 8192;

-- Materialized view for minute-level aggregation
CREATE MATERIALIZED VIEW IF NOT EXISTS market_data.market_ticks_1m
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (symbol, timestamp)
AS SELECT
    symbol,
    toStartOfMinute(timestamp) as timestamp,
    argMax(price, timestamp) as last_price,
    sum(volume) as volume,
    min(price) as low,
    max(price) as high,
    argMinState(price, timestamp) as open,
    argMaxState(price, timestamp) as close
FROM market_data.market_ticks
GROUP BY symbol, timestamp;
