type ErrorType = {
    name: string
    message: string
  }
  
  export class ErrorHandler {
    static handle(error: ErrorType, clientId: string) {
      const errorResponse = {
        type: 'error',
        code: this.getErrorCode(error),
        message: this.getErrorMessage(error),
        clientId
      }
      return errorResponse
    }
  
    private static getErrorCode(error: ErrorType): number {
      switch(error.name) {
        case 'ConnectionError': return 1001
        case 'SubscriptionError': return 1002
        case 'RateLimitError': return 1003
        default: return 1000
      }
    }
  
    private static getErrorMessage(error: ErrorType): string {
      return error.message || 'Unknown error occurred'
    }
  }
  