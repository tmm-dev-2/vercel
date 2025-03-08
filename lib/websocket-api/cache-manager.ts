import { MarketTick } from '../data/types'

export class CacheManager {
  private static instance: CacheManager
  private cache = new Map<string, MarketTick[]>()
  private readonly MAX_CACHE_AGE = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_TICKS_PER_SYMBOL = 1000

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  addTick(symbol: string, tick: MarketTick) {
    if (!this.cache.has(symbol)) {
      this.cache.set(symbol, [])
    }
    
    const ticks = this.cache.get(symbol)!
    ticks.push(tick)
    
    if (ticks.length > this.MAX_TICKS_PER_SYMBOL) {
      ticks.shift()
    }
  }

  getTicks(symbol: string): MarketTick[] {
    return this.cache.get(symbol) || []
  }

  clearOldData() {
    const now = Date.now()
    this.cache.forEach((ticks, symbol) => {
      const validTicks = ticks.filter(tick => 
        now - new Date(tick.timestamp).getTime() < this.MAX_CACHE_AGE
      )
      this.cache.set(symbol, validTicks)
    })
  }
}
