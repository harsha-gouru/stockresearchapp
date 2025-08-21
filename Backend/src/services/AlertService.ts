export class AlertService {
  constructor() {
    console.log('AlertService initialized');
  }

  async startMonitoring(): Promise<void> {
    console.log('Starting alert monitoring...');
    // Implementation coming in next phase
  }

  async stop(): Promise<void> {
    console.log('Stopping alert service...');
  }
}
