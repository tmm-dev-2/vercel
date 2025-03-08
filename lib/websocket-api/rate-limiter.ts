export class RateLimiter {
  private requests = new Map<string, number[]>()
  private readonly WINDOW_MS = 60000
  private readonly MAX_REQUESTS = 100

  canProcess(clientId: string): boolean {
    const now = Date.now()
    const windowStart = now - this.WINDOW_MS
    
    if (!this.requests.has(clientId)) {
      this.requests.set(clientId, [now])
      return true
    }

    const requests = this.requests.get(clientId)!
    const windowRequests = requests.filter(time => time > windowStart)
    
    if (windowRequests.length < this.MAX_REQUESTS) {
      windowRequests.push(now)
      this.requests.set(clientId, windowRequests)
      return true
    }

    return false
  }
}
