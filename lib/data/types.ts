export interface MarketTick {
  symbol: string
  price: number
  volume: number
  timestamp: string
  open?: number
  high?: number
  low?: number
  close?: number
}

export interface TVPayload {
  symbol: string
  price: number
  volume: number
  timestamp: string
}

export interface TVMessage {
  type: string
  payload: TVPayload
}
