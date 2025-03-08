export class MetricsCollector {
  private metrics = {
    activeConnections: 0,
    messagesSent: 0,
    messagesReceived: 0,
    errors: 0,
    latency: [] as number[]
  }

  incrementConnections() {
    this.metrics.activeConnections++
  }

  decrementConnections() {
    this.metrics.activeConnections--
  }

  recordLatency(ms: number) {
    this.metrics.latency.push(ms)
    if (this.metrics.latency.length > 1000) {
      this.metrics.latency.shift()
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageLatency: this.calculateAverageLatency()
    }
  }

  private calculateAverageLatency(): number {
    if (this.metrics.latency.length === 0) return 0
    const sum = this.metrics.latency.reduce((a, b) => a + b, 0)
    return sum / this.metrics.latency.length
  }
}
