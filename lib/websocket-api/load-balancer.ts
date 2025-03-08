export class LoadBalancer {
    private static readonly MAX_CONNECTIONS_PER_INSTANCE = 5000
    private instances: Map<string, number> = new Map()
  
    async routeConnection(): Promise<string> {
      const availableInstance = this.findAvailableInstance()
      this.instances.set(availableInstance, (this.instances.get(availableInstance) || 0) + 1)
      return availableInstance
    }
  
    private findAvailableInstance(): string {
      return 'instance-1'
    }
  }
  