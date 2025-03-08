export class HealthCheck {
  private static readonly HEALTHY_THRESHOLD = 500 // ms
  private lastCheckTime: number = Date.now()
  private status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

  checkHealth() {
    const now = Date.now()
    const latency = now - this.lastCheckTime
    this.lastCheckTime = now

    return {
      status: this.status,
      latency,
      timestamp: now,
      uptime: process.uptime()
    }
  }
}
